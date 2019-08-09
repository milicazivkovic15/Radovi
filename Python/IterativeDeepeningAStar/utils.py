class FIFOQueue:

    """A First-In-First-Out Queue."""

    def __init__(self):
        self.A = []

    def append(self, item):
        self.A.append(item)

    def __len__(self):
        return len(self.A)

    def pop(self):
        first = self.A[0]
        self.A = self.A[1:]
        return first

class SortedQueue:
    
    def __init__(self):
        self.A = []

    def append(self, node):
        place = len(self.A)
        for i in range(len(self.A)):
            if (node.path_cost < self.A[i].path_cost):
                place = i
                break
        self.A.insert(place, node)
            
    def __len__(self):
        return len(self.A)

    def pop(self):
        first = self.A[0]
        self.A = self.A[1:]
        return first


class PriorityQueue():

    """A queue in which the minimum (or maximum) element (as determined by f and
    order) is returned first. If order is min, the item with minimum f(x) is
    returned first; if order is max, then it is the item with maximum f(x).
    Also supports dict-like lookup."""

    def __init__(self, f=lambda x: x):
        self.A = []
        self.f = f

    def append(self, item):
        place = len(self.A)
        for i in range(len(self.A)):
            if self.f(item) < self.f(self.A[i]):
                place = i
                break
        self.A.insert(place, item)

    def __len__(self):
        return len(self.A)

    def pop(self):
        return self.A.pop(0)
