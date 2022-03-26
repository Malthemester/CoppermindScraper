import random
import requests
from bs4 import BeautifulSoup
BaseURL = "https://coppermind.net"
# URL = "https://coppermind.net/wiki/Cosmere"
URL = "https://coppermind.net/wiki/Vin"

done = False

node = []
links = []

class node:
    val = 0

    def __init__(self, title):
        self.title = title
        self.id = title

class link:
    val = 0

    def __init__(self, source, target):
        self.source = source
        self.target = target


wikiQueue = [URL]
wikiDone = []
UrlTitle = []


def LinkToMarkdown(a):

    if len(a.find_parents(class_="navaid")) > 0:
        return

    ref = a.get('href')
    refUrl = BaseURL + str(ref)

    title = ""

    if refUrl in UrlTitle[0]:
        title = UrlTitle[1][UrlTitle[0].index(refUrl)]
    else:
        HTMLpage = requests.get(refUrl)
        doc = BeautifulSoup(HTMLpage.text, "html.parser")
        content = doc.find(class_="mw-parser-output")
        title = doc.find(id="firstHeading").text
        UrlTitle[0].append(refUrl)
        UrlTitle[1].append(title)

    if "File:" in refUrl or "Artists" in refUrl or "#" in refUrl or ":" in refUrl or "wikipedia" in refUrl:
        return
    if "wiki" in refUrl:
        if refUrl not in wikiQueue:
            if refUrl not in wikiDone:
                wikiQueue.append(refUrl)
                print("wikiQueue: " + refUrl)
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
