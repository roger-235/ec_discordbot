import requests
from bs4 import BeautifulSoup

URL = "https://ec.nkust.edu.tw/p/403-1122-11.php"
HEADER = {"User-Agent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0"}

res=requests.get(URL, headers=HEADER, verify=False)
res.encoding="utf-8"

soup=BeautifulSoup(res.text, "html.parser")
items=soup.select("div.row.listBS")

for item in items :
    a_tag = item.select_one(".mtitle a")
    date_tag = item.select_one(".mdate.after")
    if not a_tag :
        continue
    title = a_tag.text.strip()
    link = a_tag["href"]
    date=date_tag.text.strip()
    print(f"[{date}] {title}")
    print(f" {link}\n")
