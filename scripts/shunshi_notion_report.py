#!/usr/bin/env python3
"""
Shunshi 每日全息决断 → Notion only (no Telegram)
===============================================
Runs the full daily report computation from the Shunshi engine,
uploads the formatted report to a Notion page, and prints only
a one-line status to stdout.

Birth data: ~/.hermes/.bazi-private.json
Notion key: ~/.hermes/.env (NOTION_API_KEY)
Notion parent: from .bazi-private.json → notion_page_id
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

HOME = os.path.expanduser("~/.hermes")
PRIVATE_FILE = os.path.join(HOME, ".bazi-private.json")

# ── Load birth data ────────────────────────────────────────────
with open(PRIVATE_FILE) as f:
    priv = json.load(f)

b = priv["birth"]
birth_dt = datetime(b["year"], b["month"], b["day"], b["hour"], b["minute"])
gender = priv["gender"]

# ── Pull latest engine from GitHub ─────────────────────────────
SHUNSHI_DIR = os.path.expanduser("~/Shunshi")
try:
    result = subprocess.run(
        ["git", "pull", "--ff-only", "origin", "main"],
        cwd=SHUNSHI_DIR,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode != 0:
        print(f"⚠️ git pull failed (non-fatal, running with local code): {result.stderr.strip()}", file=sys.stderr)
    else:
        print(f"📡 git pull: {result.stdout.strip()}", file=sys.stderr)
except Exception as e:
    print(f"⚠️ git pull error (non-fatal): {e}", file=sys.stderr)

# ── Load engine ────────────────────────────────────────────────
sys.path.insert(0, os.path.join(SHUNSHI_DIR, "engine"))

# Import the existing report module from ~/Shunshi/scripts/
sys.path.insert(0, os.path.join(SHUNSHI_DIR, "scripts"))
from kairos_daily_report import compute_all, format_markdown

# ── Load Notion key ────────────────────────────────────────────
NOTION_KEY = os.environ.get("NOTION_API_KEY", "")
if not NOTION_KEY:
    env_path = os.path.join(HOME, ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("NOTION_API_KEY="):
                    NOTION_KEY = line.strip().split("=", 1)[1]
                    break
if not NOTION_KEY:
    print("FATAL: NOTION_API_KEY not set", file=sys.stderr)
    sys.exit(1)

PARENT_PAGE_ID = priv.get("notion_page_id", "")
if not PARENT_PAGE_ID:
    print("FATAL: notion_page_id missing from .bazi-private.json", file=sys.stderr)
    sys.exit(1)


def _notion(path: str, data_payload: dict, method: str = "POST") -> dict | None:
    url = f"https://api.notion.com/v1{path}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data_payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {NOTION_KEY}",
            "Notion-Version": "2025-09-03",
            "Content-Type": "application/json",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")[:300]
        print(f"Notion error {e.code}: {body}", file=sys.stderr)
        return None


def upload_report(report_text: str, date_str: str) -> str | None:
    """Create a Notion page and populate it with the report blocks. Returns page URL or None."""

    # Create page
    page = _notion("/pages", {
        "parent": {"page_id": PARENT_PAGE_ID},
        "properties": {
            "title": {"title": [{"text": {"content": f"🌀 {date_str} 每日全息决断"}}]},
        },
    })
    if not page or "id" not in page:
        print("Failed to create Notion page", file=sys.stderr)
        return None

    page_id = page["id"]

    # Parse markdown → Notion blocks
    blocks = []
    for line in report_text.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue

        # Headings
        m = re.match(r"^(#{1,3})\s+(.*)", line)
        if m:
            level = min(len(m.group(1)), 3)
            blocks.append({
                "object": "block",
                "type": f"heading_{level}",
                f"heading_{level}": {
                    "rich_text": [{"type": "text", "text": {"content": m.group(2).strip()[:2000]}}],
                },
            })
            continue

        # Separator
        if set(stripped) <= {"-", "=", "*"} and len(stripped) >= 5:
            blocks.append({"object": "block", "type": "divider", "divider": {}})
            continue

        # Normal text — strip markdown formatting for cleaner Notion display
        clean = re.sub(r"\*\*(.*?)\*\*", r"\1", line)
        clean = re.sub(r"\*(.*?)\*", r"\1", clean)
        clean = re.sub(r"~~(.*?)~~", r"\1", clean)

        blocks.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": clean[:2000]}}],
            },
        })

    # Send in batches of 80
    for i in range(0, len(blocks), 80):
        batch = blocks[i:i + 80]
        _notion(f"/blocks/{page_id}/children", {"children": batch}, "PATCH")
        time.sleep(0.3)

    notion_url = f"https://notion.so/{page_id.replace('-', '')}"
    return notion_url


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    data = compute_all(birth_dt, gender)
    report = format_markdown(data)
    date_str = data["meta"]["date"]

    # Upload to Notion — this is the only output target
    url = upload_report(report, date_str)

    if url:
        summary = data["shunshi"]["decision"]["综合决断"]
        # Only print status — no full report (avoids Telegram delivery)
        print(f"✅ {date_str} 每日全息决断 → {url}")
        print(f"   综合决断: {summary}", file=sys.stderr)
    else:
        print(f"❌ {date_str} — Notion upload failed", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
