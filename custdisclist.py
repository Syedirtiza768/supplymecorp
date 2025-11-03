#!/usr/bin/env python3
"""
Fetch customers from /Customers and print only those with discount > threshold.

Supports:
- Headers: APIKey, Authorization: Basic <base64>, optional Cookie
- Pagination: next / Next / links.next / @odata.nextLink
- Auto-detect discount field (e.g., DiscPct, Discount, etc.)
- Optional CSV export

Usage (with your server and headers):
  python get_discounted_customers.py \
    --base-url https://utility.rrgeneralsupply.com \
    --api-key aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp \
    --auth-basic-b64 V0VCVEVTVC5pcnRpemE6V2ViUHJvamVjdDIwMjUk \
    --cookie "ss-id=J70FQ8YLoNV512gd8tZL; ss-pid=05ZCBNJr5QkvP3dKRbOV" \
    --min-discount 0 \
    --csv customers_with_discount.csv \
    --pretty

Environment variables (alternative):
  CP_BASE_URL, CP_API_KEY, CP_AUTH_BASIC_B64, CP_COOKIE
"""

import os
import sys
import csv
import json
import math
import time
import argparse
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.parse import urljoin

import requests
from requests.exceptions import RequestException


# -------------- config helpers --------------

def env_or(arg: Optional[str], key: str) -> Optional[str]:
    return arg if arg is not None else os.getenv(key)

def normalize_base(base_url: str) -> str:
    u = base_url.strip()
    if not u.startswith(("http://", "https://")):
        u = "https://" + u
    return u.rstrip("/") + "/"

# -------------- discount detection --------------

def _to_number(v: Any) -> Optional[float]:
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v) if math.isfinite(float(v)) else None
    if isinstance(v, str):
        s = v.strip().replace("%", "")
        try:
            n = float(s)
            return n if math.isfinite(n) else None
        except ValueError:
            return None
    return None

def pick_discount_value(obj: Dict[str, Any]) -> Tuple[Optional[str], float]:
    """
    Try to find a discount percentage or numeric discount field on a customer.
    Returns (field_name, value) with value 0.0 if nothing found/parseable.
    """
    # 1) common candidates
    candidates = [
        "DiscPct", "DiscountPct", "Discount", "DiscPercent",
        "CUST_DISC_PCT", "cust_disc_pct", "disc_pct", "discpercent",
        "customer_discount", "custDiscount", "discountPct",
    ]
    for k in candidates:
        if k in obj:
            v = _to_number(obj[k])
            if v is not None:
                return (k, v)

    # 2) case-insensitive pass
    lower_map = {k.lower(): k for k in obj.keys()}
    for k in candidates:
        lk = k.lower()
        if lk in lower_map:
            orig = lower_map[lk]
            v = _to_number(obj[orig])
            if v is not None:
                return (orig, v)

    # 3) heuristic: any key containing "disc" and ("pct" or "percent") or equal to "discount"
    for k, v in obj.items():
        if isinstance(k, str):
            lk = k.lower()
            if ("disc" in lk and ("pct" in lk or "percent" in lk)) or lk == "discount":
                num = _to_number(v)
                if num is not None:
                    return (k, num)

    # 4) peek common nested places
    for nest_key in ("Pricing", "pricing", "Price", "price"):
        nested = obj.get(nest_key)
        if isinstance(nested, dict):
            f, val = pick_discount_value(nested)
            if f is not None:
                return (f"{nest_key}.{f}", val)

    return (None, 0.0)

# -------------- payload handling --------------

def extract_customers(payload: Any) -> List[Dict[str, Any]]:
    """
    Accepts:
      - [ {...}, {...} ]
      - {"Customers":[...]} / {"customers":[...]}
      - {"results":[...]}  / {"items":[...]} / {"data":[...]}
    """
    if isinstance(payload, list):
        return [x for x in payload if isinstance(x, dict)]
    if isinstance(payload, dict):
        for key in ("Customers", "customers", "results", "Results", "items", "Items", "data", "Data"):
            if isinstance(payload.get(key), list):
                return [x for x in payload[key] if isinstance(x, dict)]
    return []

def find_next_link(payload: Any, base_url: str) -> Optional[str]:
    """
    Follows common pagination pointers:
      payload.next / payload.Next / payload["@odata.nextLink"]
      payload.links.next / payload.Links.Next / payload._links.next
    """
    if not isinstance(payload, dict):
        return None

    for k in ("next", "Next", "@odata.nextLink"):
        nxt = payload.get(k)
        if isinstance(nxt, str) and nxt.strip():
            return nxt if nxt.startswith("http") else urljoin(base_url, nxt.lstrip("/"))

    for lk in ("links", "Links", "_links"):
        links = payload.get(lk)
        if isinstance(links, dict):
            nxt = links.get("next") or links.get("Next")
            if isinstance(nxt, str) and nxt.strip():
                return nxt if nxt.startswith("http") else urljoin(base_url, nxt.lstrip("/"))

    return None

# -------------- http --------------

def get_json(session: requests.Session, url: str, headers: Dict[str, str], timeout: int = 30) -> Any:
    try:
        r = session.get(url, headers=headers, timeout=timeout)
        r.raise_for_status()
        try:
            return r.json()
        except ValueError:
            return {}
    except RequestException as e:
        raise SystemExit(f"Request failed for {url}:\n{e}")

def stream_customers(base_url: str, headers: Dict[str, str], start_path: str = "Customers", throttle_sec: float = 0.0):
    base_url = normalize_base(base_url)
    url = urljoin(base_url, start_path.lstrip("/"))
    with requests.Session() as sess:
        while url:
            payload = get_json(sess, url, headers)
            for c in extract_customers(payload):
                yield c
            url = find_next_link(payload, base_url)
            if url and throttle_sec > 0:
                time.sleep(throttle_sec)

# -------------- main --------------

def main():
    ap = argparse.ArgumentParser(description="Print customers with discount > threshold from /Customers.")
    ap.add_argument("--base-url", help="Base API URL, e.g., https://utility.rrgeneralsupply.com")
    ap.add_argument("--api-key", help="APIKey header value")
    ap.add_argument("--auth-basic-b64", help="Base64 for Authorization: Basic <this>")
    ap.add_argument("--cookie", help='Cookie header value (optional, e.g., "ss-id=...; ss-pid=...")')
    ap.add_argument("--start-path", default="Customers", help="Initial path (default: Customers)")
    ap.add_argument("--min-discount", type=float, default=0.0, help="Filter strictly greater than this value")
    ap.add_argument("--csv", help="Write CSV to this path (optional)")
    ap.add_argument("--pretty", action="store_true", help="Pretty-print JSON")
    ap.add_argument("--throttle", type=float, default=0.0, help="Seconds to sleep between paged requests (optional)")
    args = ap.parse_args()

    base_url = env_or(args.base_url, "CP_BASE_URL")
    api_key  = env_or(args.api_key, "CP_API_KEY")
    auth_b64 = env_or(args.auth_basic_b64, "CP_AUTH_BASIC_B64")
    cookie   = env_or(args.cookie, "CP_COOKIE")

    missing = [k for k, v in {
        "base-url": base_url,
        "api-key": api_key,
        "auth-basic-b64": auth_b64,
    }.items() if not v]
    if missing:
        sys.exit("Missing required: " + ", ".join(missing) + "\n"
                 "Provide flags or set CP_BASE_URL, CP_API_KEY, CP_AUTH_BASIC_B64.")

    headers = {
        "APIKey": api_key,
        "Authorization": f"Basic {auth_b64}",
    }
    if cookie:
        headers["Cookie"] = cookie

    results = []
    csv_rows = []

    for cust in stream_customers(base_url, headers, start_path=args.start_path, throttle_sec=args.throttle):
        field, disc = pick_discount_value(cust)
        if disc is not None and disc > args.min_discount:
            enriched = dict(cust)
            enriched["_detected_discount_field"] = field
            enriched["_detected_discount_value"] = disc
            results.append(enriched)

            code = cust.get("CustomerCode") or cust.get("CUST_NO") or cust.get("cust_no") or cust.get("Code") or cust.get("code")
            name = cust.get("Name") or cust.get("CUST_NAME") or cust.get("name") or cust.get("CustomerName")
            csv_rows.append({
                "CustomerCode": str(code) if code is not None else "",
                "Name": str(name) if name is not None else "",
                "Discount": disc,
                "DiscountField": field or "",
            })

    # stdout JSON
    if args.pretty:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(results, ensure_ascii=False, separators=(",", ":")))

    # optional CSV
    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["CustomerCode", "Name", "Discount", "DiscountField"])
            w.writeheader()
            w.writerows(csv_rows)
        print(f"\nWrote CSV: {args.csv}", file=sys.stderr)


if __name__ == "__main__":
    main()
