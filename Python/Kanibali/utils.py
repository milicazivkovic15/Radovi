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

class PriorityQueue:

    def __init__(self, f = lambda x: x):
        self.A = [];
        self.f = f;

    def append(self, node):
        place = len(self.A)
        for i in range(len(self.A)):
            if (self.f(node) < self.f(self.A[i])):
                place = i;
                break

        self.A.insert(place,node);

    def __len__(self):
        return len(self.A);

    def pop(self):
        return self.A.pop(0);
    
        
