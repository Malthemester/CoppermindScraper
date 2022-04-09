def sttof():
    tags = ["Elantris", "Alcatraz","Mistborn", "Mistborn Era 1", "Mistborn Era 2",
            "Rithmatist", "Reckoners", "Stormlight Archive", "Legion (series)", "Emperor's Soul",
            "Warbreaker", "White Sand", "Sixth of the Dusk", "Cosmere", "Skyward"]
    pageTags = []
    
    tagCount = 0
    mainTag = ""

    contentText = "Elantris Elantris Elantris Mistborn Mistborn cosmere cosmerecosmere -cosmere"

    contentText = contentText.lower()
    for tag in tags:
        if tag in contentText:
            pageTags.append(tag)

        if contentText.count(tag) > tagCount:
            mainTag = tag
            tagCount = contentText.count(tag)

    return {"mainTag": mainTag, "bookTags": pageTags}

print(sttof())