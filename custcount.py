import requests
import json
from urllib.parse import urljoin

BASE_URL = "https://utility.rrgeneralsupply.com"
API_KEY = "aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp"
AUTH_B64 = "V0VCVEVTVC5pcnRpemE6V2ViUHJvamVjdDIwMjUk"
COOKIE = "ss-id=J70FQ8YLoNV512gd8tZL; ss-pid=05ZCBNJr5QkvP3dKRbOV"

def extract_customers(data):
    """Return a list of customers from any accepted API shape."""
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    if isinstance(data, dict):
        for key in ("Customers", "customers", "results", "items", "data"):
            if isinstance(data.get(key), list):
                return [x for x in data[key] if isinstance(x, dict)]
    return []

def find_next(payload, base):
    """Find pagination link if exists."""
    if not isinstance(payload, dict):
        return None
    for k in ("next", "Next", "@odata.nextLink"):
        nxt = payload.get(k)
        if isinstance(nxt, str) and nxt.strip():
            return nxt if nxt.startswith("http") else urljoin(base, nxt.lstrip("/"))
    links = payload.get("links") or payload.get("Links") or payload.get("_links")
    if isinstance(links, dict):
        nxt = links.get("next") or links.get("Next")
        if isinstance(nxt, str):
            return nxt if nxt.startswith("http") else urljoin(base, nxt.lstrip("/"))
    return None

def main():
    url = f"{BASE_URL}/Customers"
    headers = {
        "APIKey": API_KEY,
        "Authorization": f"Basic {AUTH_B64}",
        "Cookie": COOKIE
    }

    total = 0
    session = requests.Session()

    while url:
        print(f"Fetching: {url}")
        res = session.get(url, headers=headers)
        res.raise_for_status()
        data = res.json()
        batch = extract_customers(data)
        total += len(batch)
        url = find_next(data, BASE_URL)

    print("\n✅ Total customers:", total)

if __name__ == "__main__":
    main()
