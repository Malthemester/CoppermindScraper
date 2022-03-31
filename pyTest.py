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

links = []
links.append(Link(1,2))
links.append(Link(1,3))

print(Link(1,2) == Link(1,2))
print(Link(2,1) in links)