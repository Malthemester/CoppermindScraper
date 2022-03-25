import random
import requests
from bs4 import BeautifulSoup
BaseURL = "https://coppermind.net"
# URL = "https://coppermind.net/wiki/Cosmere"
URL = "https://coppermind.net/wiki/Vin"

done = False


wikiQueue = [URL]
wikiDone = []
UrlTitle = []


def LinkToMarkdown(a):

    if len(a.find_parents(class_="navaid")) > 0:
        return

    ref = a.get('href')
    ref = str(ref)

    if BaseURL + ref in UrlTitle[0]:
        title = UrlTitle[1][UrlTitle[0].index(BaseURL + ref)]

    HTMLpage = requests.get(BaseURL + ref)

    if "File:" in ref or "Artists" in ref or "#" in ref or ":" in ref or "wikipedia" in ref:
        return
    if "wiki" in ref:
        if BaseURL + ref not in wikiQueue:
            if BaseURL + ref not in wikiDone:
                wikiQueue.append(BaseURL + ref)
                print("wikiQueue: " + BaseURL + ref)
        title = ref.replace(
            "/wiki/", "").replace("_", " ").replace("%27", "'")

        return f"[[{title}\|{a.text}]]"
    return ""


def ContentToNode(content):
    a = content.find_all('a')


while len(wikiQueue) > 0:
    wikiPage = wikiQueue.pop(random.randrange(0, len(wikiQueue)))
    HTMLpage = requests.get(wikiPage)
    doc = BeautifulSoup(HTMLpage.text, "html.parser")
    content = doc.find(class_="mw-parser-output")
    if content is None:
        continue
    title = doc.find(id="firstHeading").text
    if "File:" in title or "Artists" in title or "#" in title or "/" in title or ":" in title or "wikipedia" in title:
        continue
    print("URL: " + wikiPage + "    " + str(len(wikiQueue)) + " left" + " | " +
          str(len(wikiDone)) + " completed")
    page = content
    page += "\n\n" + wikiPage
    f = open(f"Cosmere\{title}.md", "w", encoding="utf-8")
    f.write(page)
    f.close()
    wikiDone.append(wikiPage)
    done = False
