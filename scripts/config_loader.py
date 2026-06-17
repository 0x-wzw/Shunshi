"""
Config Loader — Load user profile data from Hermes vault or local private config.

This module provides a unified interface for Shunshi scripts to load personal
birth data without hardcoding it in source files.

Priority:
  1. ~/.hermes/vault/ (Hermes encrypted vault keys)
  2. ~/.hermes/.bazi-private.json (local structured JSON)
  3. Environment variables
  4. Raise with helpful message if none found

Usage:
    from scripts.config_loader import load_user_profile
    profile = load_user_profile()  # Returns dict with birth, gender, etc.
"""
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional


def _load_vault_value(key: str) -> Optional[str]:
    """Try loading a value from Hermes vault."""
    vault_py = Path.home() / ".hermes" / "vault" / "vault.py"
    if vault_py.exists():
        try:
            # Use the Hermes vault CLI to get a value
            result = os.popen(f"python3 {vault_py} get {key} 2>/dev/null").read().strip()
            if result and not result.startswith("Error"):
                return result
        except Exception:
            pass
    return None


def _load_private_json() -> Optional[Dict[str, Any]]:
    """Load from ~/.hermes/.bazi-private.json if it exists."""
    path = Path.home() / ".hermes" / ".bazi-private.json"
    if path.exists():
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return None


def _load_env_vars() -> Optional[Dict[str, Any]]:
    """Load from environment variables as fallback."""
    required = ["BAZI_BIRTH_YEAR", "BAZI_BIRTH_MONTH", "BAZI_BIRTH_DAY"]
    if not all(os.getenv(k) for k in required):
        return None

    return {
        "name": os.getenv("BAZI_NAME", "User"),
        "birth": {
            "year": int(os.getenv("BAZI_BIRTH_YEAR")),
            "month": int(os.getenv("BAZI_BIRTH_MONTH")),
            "day": int(os.getenv("BAZI_BIRTH_DAY")),
            "hour": int(os.getenv("BAZI_BIRTH_HOUR", "12")),
            "minute": int(os.getenv("BAZI_BIRTH_MINUTE", "0")),
        },
        "gender": os.getenv("BAZI_GENDER", "male").lower(),
        "timezone_offset": os.getenv("BAZI_TZ_OFFSET", "+0"),
        "location": os.getenv("BAZI_LOCATION", ""),
        "notion_page_id": os.getenv("SHUNSHI_NOTION_PARENT_ID", ""),
    }


def load_user_profile() -> Dict[str, Any]:
    """
    Load user profile from vault, local config, or env vars.

    Returns a dict with keys:
      - name: str
      - birth: {year, month, day, hour, minute}
      - gender: str ("male" | "female")
      - timezone_offset: str (e.g. "+8", "UTC+7:30")
      - location: str (e.g. ">{birth_location}")
      - notion_page_id: str (optional)
      - bazi: str (optional, cached natal pillars)
      - day_master: str (optional)
      - kua: int (optional)
    """
    # Try private JSON first (most common for Shunshi users)
    data = _load_private_json()
    if data:
        return data

    # Try vault keys (individual keys for each field)
    vault_fields = {
        "name": _load_vault_value("BAZI_NAME"),
        "gender": _load_vault_value("BAZI_GENDER"),
        "location": _load_vault_value("BAZI_LOCATION"),
        "timezone_offset": _load_vault_value("BAZI_TZ_OFFSET"),
        "notion_page_id": _load_vault_value("SHUNSHI_NOTION_PARENT_ID"),
    }
    if vault_fields["name"] and vault_fields["gender"]:
        birth_year = _load_vault_value("BAZI_BIRTH_YEAR")
        birth_month = _load_vault_value("BAZI_BIRTH_MONTH")
        birth_day = _load_vault_value("BAZI_BIRTH_DAY")
        if birth_year and birth_month and birth_day:
            data = {
                "name": vault_fields["name"],
                "gender": vault_fields["gender"],
                "location": vault_fields.get("location", ""),
                "timezone_offset": vault_fields.get("timezone_offset", "+0"),
                "notion_page_id": vault_fields.get("notion_page_id", ""),
                "birth": {
                    "year": int(birth_year),
                    "month": int(birth_month),
                    "day": int(birth_day),
                    "hour": int(_load_vault_value("BAZI_BIRTH_HOUR") or "12"),
                    "minute": int(_load_vault_value("BAZI_BIRTH_MINUTE") or "0"),
                },
            }
            return data

    # Try env vars
    data = _load_env_vars()
    if data:
        return data

    # Nothing found — raise with instructions
    raise RuntimeError(
        "No user profile found. Please configure one of:\n"
        "  1. ~/.hermes/.bazi-private.json  (structured JSON)\n"
        "  2. Hermes vault keys: BAZI_NAME, BAZI_BIRTH_YEAR, etc.\n"
        "  3. Environment variables: BAZI_BIRTH_YEAR, BAZI_GENDER, etc.\n"
        "\nExample ~/.hermes/.bazi-private.json:\n"
        '{\n  "name": "User",\n  "birth": {"year": 1990, "month": 1, "day": 1, "hour": 12, "minute": 0},\n  "gender": "male"\n}\n'
    )


def require_notion_config() -> tuple:
    """
    Load Notion API key and parent page ID.

    Returns (NOTION_API_KEY, PARENT_PAGE_ID).
    Raises RuntimeError if either is missing.
    """
    # Try env first
    notion_key = os.environ.get("NOTION_API_KEY", "")
    if not notion_key:
        # Try .env file
        env_path = Path.home() / ".hermes" / ".env"
        if env_path.exists():
            with open(env_path, encoding="utf-8") as f:
                for line in f:
                    if line.startswith("NOTION_API_KEY="):
                        notion_key = line.strip().split("=", 1)[1]
                        break

    if not notion_key:
        raise RuntimeError(
            "NOTION_API_KEY not found. Set it in ~/.hermes/.env or as an environment variable."
        )

    # Load parent page from user profile
    profile = load_user_profile()
    page_id = profile.get("notion_page_id", "")
    if not page_id:
        raise RuntimeError(
            "notion_page_id not found in user profile. Add it to ~/.hermes/.bazi-private.json"
        )

    return notion_key, page_id
