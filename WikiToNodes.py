import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

from bs4 import BeautifulSoup
BaseURL = "https://coppermind.net"
URL = "/wiki/Cosmere"

headers = {
    'User-Agent': "Scraping coppermids to visualize it. Contact me at Discord: Emtkjaer#6677"}

nodes = []
links = []


class Node:
    val = 0
    tags = []

    def __init__(self, title, url):
        self.title = title
        self.url = url

    def json(self):
        return {"id": self.title, "name": self.title, "val": self.val, "url": self.url, "tags": self.tags}


class Link:
    val = 0

    def __init__(self, source, target):
        self.source = source
        self.target = target

    def __eq__(self, other):
        if isinstance(other, Link):
            if (self.source == other.source and self.target == other.target) or (self.source == other.target and self.target == other.source):
                return True
        return False

    def json(self):
        return {"source": self.source, "target": self.target}


wikiQueue = []
urlContent = [[], [], [], []]


def findBookTag(content):
    try:
        for wrap in content.find_all(class_="mw-references-wrap"):
            wrap.decompose()
    except:
        pass

    try:
        for navbar in content.find_all(class_="navbar"):
            navbar.decompose()
    except:
        pass

    try:
        content.find(class_="navaid").decompose()
    except:
        pass

    contentText = content.text.lower()

    tagsArray = [
        ["stormlight archive"],
        ["alcatraz"],
        ["mistborn"],
        ["mistborn era 1", "mistborn"],
        ["mistborn era 2"],
        ["elantris"],
        ["rithmatist"],
        ["reckoners"],
        ["legion (series)"],
        ["emperor's soul"],
        ["warbreaker"],
        ["white sand"],
        ["first of the sun"],
        ["threnody"],
        ["cosmere"],
        ["skyward", "cytoverse"],
        ["brandon sanderson"]]

    pageTags = []

    tagCount = 0
    mainTag = ""

    for tags in tagsArray:
        for tag in tags:
            if tag in contentText:
                pageTags.append(tags[0])

            if contentText.count(tag) > tagCount:
                mainTag = tag
                tagCount = contentText.count(tag)

    return {"mainTag": mainTag, "bookTags": pageTags}


def getTitle(url):

    if url is None:
        return None

    if url in urlContent[0]:
        return urlContent[1][urlContent[0].index(url)]

    if ("File:" in url or "Artists" in url or "edit" in url or "/Cover" in url
            or "#" in url or ":" in url or "wikipedia" in url):
        return None

    try:
        pageHTML = requests.get(url=BaseURL + url, headers=headers)
        doc = BeautifulSoup(pageHTML.text, "html.parser")
        title = doc.find(id="firstHeading")
        if title is not None:
            title = title.text
        else:
            return None
    except KeyError:
        print("There was an Error1")
        return None

    if ("File:" in title or "Artists" in title or "#" in title or "edit" in title
            or "/" in title or ":" in title or "wikipedia" in pageHTML.url):
        urlContent[0].append(url)
        urlContent[1].append(None)
        urlContent[2].append(None)
        urlContent[3].append(None)
        return None

    content = doc.find(class_="mw-parser-output")
    if content is None:
        return None

    if title in urlContent[1]:
        urlContent[0].append(url)
        urlContent[1].append(title)
        urlContent[2].append(None)
        urlContent[3].append(pageHTML.url)
        return title

    urlContent[0].append(url)
    urlContent[1].append(title)
    urlContent[2].append(content)
    urlContent[3].append(pageHTML.url)

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


def pageToNode(title, content, node):

    aTags = None
    try:
        aTags = content.find_all('a')
    except:
        print("There was an Error3")
        return

    if aTags is None:
        return

    processes = []
    with ThreadPoolExecutor(max_workers=70) as executor:
        for aTag in aTags:
            processes.append(executor.submit(refToLink, aTag, title))

        for link in as_completed(processes):
            if link.result():
                node.val += 1
                if link.result() not in links:
                    links.append(link.result())

    node.tags = findBookTag(content)

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
    print(f"\nQueue : {str(len(wikiQueue)) :<5} Completed:{completed :<5} | Curent: {wikiPage:<20}  | Time elapsed: {round(time.time() - start)}s | {round((time.time() - start) / 60)}m")

    pageIndex = urlContent[1].index(wikiPage)
    content = urlContent[2][pageIndex]

    pageNode = Node(wikiPage, urlContent[3][pageIndex])

    pageToNode(wikiPage, content, pageNode)

    urlContent[2][urlContent[1].index(wikiPage)] = "Done"

    completed += 1

print(
    f"Queue:{str(len(wikiQueue)) :<5} Completed:{completed :<5} | Time elapsed: {round(time.time() - start)}s | {round((time.time() - start) / 60)}m")

nodesToJson(nodes, links)
print("Nodes and links written")
print(f"{len(nodes)} nodes and {len(links)} links. Total: {len(nodes)+len(links)}")
