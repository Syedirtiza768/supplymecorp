import math
import time
from typing import Any, Dict, Iterable, List, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from requests.exceptions import ChunkedEncodingError, ConnectionError as ReqConnectionError, Timeout
from urllib3.exceptions import ProtocolError

BASE_URL = "https://utility.rrgeneralsupply.com/Items"

def build_session() -> requests.Session:
    # Retry on common transient network/server issues (incl. chunked responses that end early)
    retry = Retry(
        total=6,
        connect=3,
        read=6,
        backoff_factor=0.6,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset(["GET", "HEAD", "OPTIONS"]),
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry, pool_connections=50, pool_maxsize=50)
    s = requests.Session()
    s.headers.update({
        # identity disables gzip/deflate; helps with some flaky servers
        "Accept-Encoding": "identity",
        "Connection": "keep-alive",
        "User-Agent": "supplymecorp-itemcount/1.0 (+requests)"
    })
    s.mount("http://", adapter)
    s.mount("https://", adapter)
    return s

def safe_get_json(session: requests.Session, url: str, timeout=(5, 45)) -> Any:
    # Extra guard around the Session retries to catch chunked/ProtocolError and try again.
    for attempt in range(1, 6):
        try:
            resp = session.get(url, timeout=timeout)
            resp.raise_for_status()
            return resp.json()
        except (ChunkedEncodingError, ProtocolError, ReqConnectionError, Timeout) as e:
            if attempt == 5:
                raise
            # small exponential backoff
            time.sleep(0.5 * attempt)
        except requests.HTTPError:
            # For non-transient HTTP codes not handled by Retry, still try a few times.
            if attempt == 5:
                raise
            time.sleep(0.5 * attempt)

def coerce_price(value: Any) -> float:
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        if math.isnan(value) if isinstance(value, float) else False:
            return 0.0
        return float(value)
    # strings like "0", "0.00", "", "9.99", "  "
    s = str(value).strip()
    if not s:
        return 0.0
    try:
        return float(s)
    except ValueError:
        return 0.0

def extract_items(payload: Any) -> List[Dict[str, Any]]:
    """
    Handles common API response shapes:
    - { "items": [...] }
    - { "data": [...] }
    - [ ... ]
    """
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for key in ("items", "data", "results"):
            if key in payload and isinstance(payload[key], list):
                return payload[key]
    return []

def find_next_url(payload: Any, current_page: int, base_url: str) -> Optional[str]:
    """
    Tries to discover a next page URL. Supports:
    - Link in payload: payload.get('next')
    - Numeric paging via ?page=
    """
    if isinstance(payload, dict):
        nxt = payload.get("next") or payload.get("links", {}).get("next")
        if isinstance(nxt, str) and nxt:
            return nxt

    # Fallback: assume simple page=x pattern
    return f"{base_url}?page={current_page + 1}"

def main():
    session = build_session()
    page = 1
    url = f"{BASE_URL}?page={page}"
    total_seen = 0
    count_price_gt_zero = 0
    pages_without_items = 0

    print("Counting items with PRC_1 > 0 (robust mode)...")

    while True:
        print(f"→ Page {page}: {url}")
        payload = safe_get_json(session, url)

        items = extract_items(payload)
        if not items:
            pages_without_items += 1
            # stop if we hit 2 empty pages in a row to avoid infinite loops on unknown paging schemes
            if pages_without_items >= 2:
                break
            # try next page anyway
            page += 1
            url = find_next_url(payload, page - 1, BASE_URL)
            continue

        pages_without_items = 0

        for it in items:
            prc = coerce_price(it.get("PRC_1"))
            if prc > 0.0:
                count_price_gt_zero += 1

        total_seen += len(items)

        # Heuristic: if the API returns fewer than, say, 2 items, assume we're at the end.
        if len(items) < 2 and not isinstance(payload, dict) or ("next" not in payload if isinstance(payload, dict) else False):
            # Still try advancing once; if empty, loop will break on next iteration.
            page += 1
            url = find_next_url(payload, page - 1, BASE_URL)
            continue

        # advance page
        page += 1
        url = find_next_url(payload, page - 1, BASE_URL)

        # optional: print progress every N pages
        if page % 10 == 0:
            print(f"…progress: {total_seen} items scanned, {count_price_gt_zero} with PRC_1 > 0")

    print("\n✅ Scan complete.")
    print(f"Total items scanned: {total_seen}")
    print(f"Items with PRC_1 > 0: {count_price_gt_zero}")

if __name__ == "__main__":
    main()
