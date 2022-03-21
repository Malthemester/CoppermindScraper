import random
import requests
from bs4 import BeautifulSoup
BaseURL = "https://coppermind.net"
# URL = "https://coppermind.net/wiki/Cosmere"
URL = "https://coppermind.net/wiki/Vin"

done = False


def TableToMarkdown(table):
    table = table.find_all("tr")
    markdownTable = ""
    header = True

    for row in table:
        if(row.find("table")):
            continue
        else:
            for collumn in row:
                if(collumn.name == "th" or collumn.name == "td"):
                    markdownTable += '|'
                    collText = ElementToMarkdown(collumn).replace("\n", "")
                    markdownTable += collText
            markdownTable += '|\n'
        if(header):
            markdownTable += "|-|-|\n"
            header = False

    return markdownTable


def HtmlToMarkdown(element):
    markdown = ""
    global done
    if done:
        return ""
    for child in element:
        if done:
            return markdown
        markdown += ElementToMarkdown(child)

    return markdown


def ElementToMarkdown(element):
    global done

    match element.name:
        case None:
            return element.text
        case 'a':
            try:
                if element['class'][0] == "external" or element['class'][0] == "extiw" or element['class'][0] == "image":
                    return ""
            except KeyError:
                pass  # or some other fallback action
            return LinkToMarkdown(element)
        case 'b':
            return f"**{element.text}**"
        case 'th':
            return f"**{element.text}**"
        case 'em':
            return f"*{element.text}*"
        case 'i':
            return f"*{element.text}*"
        case 'ul':
            return HtmlToMarkdown(element)
        case 'li':
            return HtmlToMarkdown(element)
        case 'td':
            return HtmlToMarkdown(element)
        case 'h3':
            return "### " + HtmlToMarkdown(element)
        case 'h3':
            return "#### " + HtmlToMarkdown(element)
        case 'h2':
            try:
                if element.text == "Notes[edit]":
                    done = True
                    return ""
            except KeyError:
                pass  # or some other fallback action
            return "## " + HtmlToMarkdown(element)
        case 'span':
            try:
                if element['class'][0] == "mw-editsection":
                    return ""
            except KeyError:
                pass  # or some other fallback action
            return HtmlToMarkdown(element)
        case 'p':
            return HtmlToMarkdown(element)
        case 'div':
            try:
                if element['class'][0] == "notice quality quality-partial stub":
                    return ""
            except KeyError:
                pass  # or some other fallback action
            return HtmlToMarkdown(element)
        case 'table':
            return TableToMarkdown(element)
        case 'blockquote':
            blockquote = ">" + HtmlToMarkdown(element.p).replace("\n", "")
            blockquote = str(blockquote) + "\n"
            if len(element.contents) > 1:
                blockquote += "\-" + element.contents[1].text.replace("—", "")
                blockquote = str(blockquote) + "\n"
            return blockquote
        # case 'sup':
            # FootnoteToMarkdown(element)
            # return ""
        case _:
            # print(f"{element.name} is not a match")
            return ""


wikiQueue = [URL]
wikiDone = []


def LinkToMarkdown(a):
    ref = a.get('href')
    ref = str(ref)
    if "File:" in ref or "Artists" in ref or "#" in ref or ":" in ref:
        return a.text
    if "wiki" in ref:
        if BaseURL + ref not in wikiQueue:
            if BaseURL + ref not in wikiDone:
                wikiQueue.append(BaseURL + ref)
                print("wikiQueue: " + BaseURL + ref)
        title = ref.replace(
            "/wiki/", "").replace("_", " ").replace("%27", "'")

        return f"[[{title}\|{a.text}]]"
    return ""


while len(wikiQueue) > 0:
    wikiPage = wikiQueue.pop(random.randrange(0, len(wikiQueue)))
    HTMLpage = requests.get(wikiPage)
    doc = BeautifulSoup(HTMLpage.text, "html.parser")
    content = doc.find(class_="mw-parser-output")
    if content is None:
        continue
    title = doc.find(id="firstHeading").text
    if "File:" in title or "Artists" in title or "#" in title or "/" in title or ":" in title:
        continue
    print("URL: " + wikiPage + "    " + str(len(wikiQueue)) + " left" + " | " +
          str(len(wikiDone)) + " completed")
    page = HtmlToMarkdown(content)
    page += "\n\n" + wikiPage
    f = open(f"Cosmere\{title}.md", "w", encoding="utf-8")
    f.write(page)
    f.close()
    wikiDone.append(wikiPage)
    done = False
