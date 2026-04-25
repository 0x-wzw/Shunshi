#!/usr/bin/env python3
"""
八字24小时全日对参 — Notion 上传脚本

功能：运行 bazi_daily_24h_cn.py 生成报告，
      将结果上传到 Notion 作为每日子页面。
"""
import sys
import os
import json
import subprocess
import re
import urllib.request
import urllib.error

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))

NOTION_KEY = os.environ.get('NOTION_API_KEY', '')
if not NOTION_KEY:
    # Try reading from .env
    env_path = os.path.expanduser('~/.hermes/.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('NOTION_API_KEY='):
                    NOTION_KEY = line.strip().split('=', 1)[1]
                    break

PARENT_PAGE_ID = "34d05e4a-7c41-8173-9067-f8eb5fa8c9a6"  # 八字24小时对参
NOTION_VERSION = "2025-09-03"

def _notion_req(path, data, method="POST"):
    url = f"https://api.notion.com/v1{path}"
    payload = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {NOTION_KEY}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
        method=method
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        errmsg = json.loads(e.read().decode('utf-8'))
        print(f"⚠️ Notion API error ({e.code}):", errmsg, file=sys.stderr)
        return None


def _split_rich_text(text, max_len=1800):
    """Split long text into chunks for Notion blocks."""
    if len(text) <= max_len:
        return [{"type": "text", "text": {"content": text}}]
    chunks = []
    i = 0
    while i < len(text):
        chunk = text[i:i+max_len]
        chunks.append({"type": "text", "text": {"content": chunk}})
        i += max_len
    return chunks


def _create_blocks(lines):
    """Convert report lines into Notion block objects."""
    blocks = []
    for line in lines:
        # Heading detection
        m = re.match(r'^(#{1,6})\s*(.*)', line.strip())
        if m:
            level = len(m.group(1))
            heading_type = f"heading_{min(level, 3)}"
            blocks.append({
                "object": "block",
                "type": heading_type,
                heading_type: {
                    "rich_text": [{"type": "text", "text": {"content": m.group(2).strip()}}],
                    "color": "default"
                }
            })
            continue

        # Divider detection
        if set(line.strip()) <= {'=', '─', '-', '*'} and len(line.strip()) >= 10:
            blocks.append({
                "object": "block",
                "type": "divider",
                "divider": {}
            })
            continue

        # Empty line
        if not line.strip():
            continue

        # Normal paragraph
        blocks.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": _split_rich_text(line)
            }
        })
    return blocks


def _upload_to_notion(report_text, date_str, summary):
    """Create a new daily Notion page with the report."""

    # 1. Create the child page
    page_data = {
        "parent": {"page_id": PARENT_PAGE_ID},
        "properties": {
            "title": {
                "title": [{"text": {"content": f"📅 {date_str} 全日对参"}}]
            }
        }
    }

    page = _notion_req("/pages", page_data)
    if not page or "id" not in page:
        print("Failed to create Notion page", file=sys.stderr)
        return None

    page_id = page["id"]
    print(f"✅ Notion page created: {page.get('url', '')}")

    # 2. Split report into small block batches (Notion allows max 100 blocks at once)
    lines = report_text.split('\n')
    all_blocks = _create_blocks(lines)

    batch_size = 80
    for i in range(0, len(all_blocks), batch_size):
        batch = all_blocks[i:i+batch_size]
        resp = _notion_req(
            f"/blocks/{page_id}/children",
            {"children": batch},
            method="PATCH"
        )
        if not resp:
            print(f"⚠️ Failed to add batch {i//batch_size}", file=sys.stderr)
    print(f"✅ Uploaded {len(all_blocks)} blocks")

    # 3. Add summary callout at the bottom
    summary_block = [
        {
            "object": "block",
            "type": "divider",
            "divider": {}
        },
        {
            "object": "block",
            "type": "callout",
            "callout": {
                "icon": {"emoji": "⭐"},
                "rich_text": [{"type": "text", "text": {"content": f"最佳时辰：{summary.get('best_shichen','?')}  |  最需规避：{summary.get('worst_shichen','无')}"}}]
            }
        }
    ]
    _notion_req(
        f"/blocks/{page_id}/children",
        {"children": summary_block},
        method="PATCH"
    )
    print(f"✅ Summary callout added")

    return page


def main():
    import bazi_daily_24h_cn as daily

    report_text, summary, date_str = daily.生成全日报告()
    print(f"\n📄 Report generated for {date_str}")
    print(f"Lines: {len(report_text.splitlines())}, Chars: {len(report_text)}")

    page = _upload_to_notion(report_text, date_str, summary)
    if page:
        print(f"\n📎 Page URL: {page.get('url', 'N/A')}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
