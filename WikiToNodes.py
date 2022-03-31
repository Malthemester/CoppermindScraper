import json
import math
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

from bs4 import BeautifulSoup
BaseURL = "https://coppermind.net"
URL = "/wiki/Cosmere"

nodes = []
links = []


class Node:
    val = 0

    def __init__(self, title):
        self.title = title

    def json(self):
        return {"id": self.title, "name": self.title, "val": self.val}


class Link:
    val = 0

    def __init__(self, source, target):
        self.source = source
        self.target = target

    def json(self):
        return {"source": self.source, "target": self.target}


wikiQueue = []
urlContent = [[], [], []]


def getTitle(url):

    if url is None:
        return None

    if url in urlContent[0]:
        return urlContent[1][urlContent[0].index(url)]

    if ("File:" in url or "Artists" in url or "edit" in url or "/Cover" in url
            or "#" in url or ":" in url or "wikipedia" in url):
        return None

    # print(f"Getting: {BaseURL + url}")

    try:
        pageHTML = requests.get(BaseURL + url)
        doc = BeautifulSoup(pageHTML.text, "html.parser")
        title = doc.find(id="firstHeading").text
    except KeyError:
        pass

    if ("File:" in title or "Artists" in title or "#" in title or "edit" in title
            or "/" in title or ":" in title or "wikipedia" in pageHTML.url):
        urlContent[0].append(url)
        urlContent[1].append(None)
        urlContent[2].append(None)
        return None

    content = doc.find(class_="mw-parser-output")
    if content is None:
        return None

    if title in urlContent[1]:
        urlContent[0].append(url)
        urlContent[1].append(title)
        urlContent[2].append(None)
        return title

    urlContent[0].append(url)
    urlContent[1].append(title)
    urlContent[2].append(content)

    wikiQueue.append(title)

    print(f"Queued: {title :<28} from: {url}")

    return title


def refToLink(a, title):

    try:
        if a['class'][0] == "external" or a['class'][0] == "extiw" or a['class'][0] == "image":
            return None
    except KeyError:
        pass

    if len(a.find_parents(class_="navaid")) > 0:
        return None

    if len(a.find_parents(class_="navbar")) > 0:
        return None

    ref = a.get('href')
    target = getTitle(ref)

    if target:
        return Link(title, target)

    return None


def pageToNode(title, content):

    node = Node(title)

    aTags = None
    try:
        aTags = content.find_all('a')
    except:
        pass

    if aTags is None:
        return

    processes = []
    with ThreadPoolExecutor(max_workers=30) as executor:
        for aTag in aTags:
            processes.append(executor.submit(refToLink, aTag, title))

        for link in as_completed(processes):
            if link.result():
                links.append(link.result())
                node.val += 1

    nodes.append(node)


def nodesToJson(nodes, links):

    nodesJson = []
    for node in nodes:
        nodesJson.append(node.json())
    nodeFile = open(f"NodeGraphCoppermind/src/nodesData.json",
                    "w", encoding="utf-8")
    nodesData = json.dumps(nodesJson, indent=4)

    nodeFile.write(nodesData)
    nodeFile.close()

    linksJson = []
    for link in links:
        linksJson.append(link.json())
    linkFile = open(f"NodeGraphCoppermind/src/linksData.json",
                    "w", encoding="utf-8")
    nodesData = json.dumps(linksJson, indent=4)

    linkFile.write(nodesData)
    linkFile.close()


getTitle(URL)

completed = 0
start = time.time()
while len(wikiQueue) > 0:

    wikiPage = wikiQueue.pop(0)
    # if completed % 100 == 0:
    print(
        f"\nQueue : {str(len(wikiQueue)) :<5} Completed:{completed :<5} | Curent: {wikiPage:<20}  | Time elapsed: {math.round(time.time() - start)}")

    content = urlContent[2][urlContent[1].index(wikiPage)]
    pageToNode(wikiPage, content)

    urlContent[2][urlContent[1].index(wikiPage)] = "Done"

    completed += 1

print(
    f"Queue:{str(len(wikiQueue)) :<5} Completed:{completed :<5} | Time elapsed: {math.round(time.time() - start)}")

nodesToJson(nodes, links)
print("Nodes and links written")
