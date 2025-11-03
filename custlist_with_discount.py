import requests
import json
from urllib.parse import urljoin

BASE_URL = "https://utility.rrgeneralsupply.com"
API_KEY = "aj88R3KMh9f588H7N4CF0XUhqsvqZrWIN9iIYXkp"
AUTH_B64 = "V0VCVEVTVC5pcnRpemE6V2ViUHJvamVjdDIwMjUk"
COOKIE = "ss-id=J70FQ8YLoNV512gd8tZL; ss-pid=05ZCBNJr5QkvP3dKRbOV"

# -------- Helper to locate customers in different JSON responses -------- #
def extract_customers(data):
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    if isinstance(data, dict):
        for key in ("Customers", "customers", "results", "items", "data"):
            if isinstance(data.get(key), list):
                return [x for x in data[key] if isinstance(x, dict)]
    return []

# -------- Pagination resolver -------- #
def find_next(payload, base):
    if not isinstance(payload, dict):
        return None
    for k in ("next", "Next", "@odata.nextLink"):
        if isinstance(payload.get(k), str):
            nxt = payload[k]
            return nxt if nxt.startswith("http") else urljoin(base, nxt.lstrip("/"))
    links = payload.get("links") or payload.get("Links") or payload.get("_links")
    if isinstance(links, dict):
        nxt = links.get("next") or links.get("Next")
        if isinstance(nxt, str):
            return nxt if nxt.startswith("http") else urljoin(base, nxt.lstrip("/"))
    return None

# -------- Discount extraction logic -------- #
def detect_discount(cust):
    for key in ["DiscPct", "DiscountPct", "Discount", "CUST_DISC_PCT", "disc_pct", "cust_disc_pct"]:
        if key in cust:
            try:
                return cust.get(key), key
            except:
                pass
    # Check lowercase or unknown field variations
    for k, v in cust.items():
        if isinstance(k, str) and "disc" in k.lower():
            return v, k
    return 0, None

# -------- Main program -------- #
def main():
    url = f"{BASE_URL}/Customers"
    headers = {
        "APIKey": API_KEY,
        "Authorization": f"Basic {AUTH_B64}",
        "Cookie": COOKIE
    }

    session = requests.Session()
    all_rows = []

    print("Fetching all customers...")
    while url:
        res = session.get(url, headers=headers)
        res.raise_for_status()
        data = res.json()

        for cust in extract_customers(data):
            code = cust.get("CustomerCode") or cust.get("CUST_NO")
            name = cust.get("Name") or cust.get("CustomerName")
            discount, field = detect_discount(cust)
            all_rows.append((code, name, discount, field))

        url = find_next(data, BASE_URL)

    print("\n✅ Finished. Total customers:", len(all_rows))
    print("\nCustomerCode, CustomerName, Discount, DiscountField\n" + "-"*60)

    for row in all_rows:
        print(f"{row[0]}, {row[1]}, {row[2]}, {row[3]}")

    # Optional: write CSV
    with open("customer_discounts.csv", "w", encoding="utf-8") as f:
        f.write("CustomerCode,CustomerName,Discount,DiscountField\n")
        for r in all_rows:
            f.write(f"{r[0]},{r[1]},{r[2]},{r[3]}\n")

    print("\n📁 CSV saved as: customer_discounts.csv")

if __name__ == "__main__":
    main()
