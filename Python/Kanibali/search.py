from utils import *

class Problem:

    def __init__(self):
        self.initial = (3,3,'L')
        self.goal = (0,0,'R')

    def is_valid(self,state):
        (m,k,c) = state
        # ako na levoj obali ima 0 ili 3 misionara
        # ili ima jednak broj misionara i kanibala, bezbedno je
        if (m == 0 or m == 3 or (m == 1 and k == 1) or (m == 2 and k == 2)):
            return True
        return False

    def actions(self, state):
        
        moves = [(2,0),(1,0),(1,1),(0,1),(0,2)]
        nextStates = []

        for move in moves:
            delta_m = move[0]
            delta_k = move[1]

            (m,k,c) = state

            # ako je trenutno stanje takvo da je camac na levoj strani
            # onda se broj misionara i kanibala na levoj strani smanjuje
            # a camac prelazi sa leve na desnu stranu
            if c == 'L':
                k = k - delta_k
                m = m - delta_m
                c = 'R'
            else:
                k = k + delta_k
                m = m + delta_m
                c = 'L'

            newState = (m,k,c)
            if (self.is_valid(newState)):
                nextStates.append(newState)

        return nextStates
        

    def goal_test(self, state):
        return state == self.goal

class Graph:

    def __init__(self, dictionary, directed=True):
        self.dict = dictionary
        self.directed = directed
        if directed:
            self.make_directed()
        else:
            self.make_undirected()

    def make_undirected(self):
        "Make a digraph into an undirected graph by adding symmetric edges."
        keys = list(self.dict.keys())
        for a in keys:
            b_items = self.dict[a].items()
            for (b, distance) in b_items:
                self.connect(b, a, distance)

    def make_directed(self):
        "Add all nodes without neighbours as keys with empty dictionaries as values"
        keys = list(self.dict.keys())
        for a in keys:
            a_keys = list(self.dict[a].keys())
            for b in a_keys:
                self.dict.setdefault(b, {})

    def connect(self, a, b, distance):
        "Add a link from A to B of given distance, in one direction only."
        self.dict.setdefault(a, {})
        self.dict[a][b] = distance

    def nodes(self):
        "Return a list of nodes in the graph."
        return self.dict.keys()
        
    def get(self, a):
        self.dict.setdefault(a, {})
        return self.dict[a]
    
class Node:
    
    def __init__(self, state, parent=None):
        "Create a search tree Node, derived from a parent by an action."
        self.state = state
        self.parent = parent
        if parent == None:
            self.depth = 0
        else:
            self.depth = parent.depth + 1
            
    def expand(self, problem):
        "List the nodes reachable in one step from this node."
        exp_nodes = []
        neighbour_states = problem.actions(self.state)
        for x in neighbour_states:
            new_node = Node(x, self)
            exp_nodes.append(new_node)
        return exp_nodes
    
    def solution(self):
        "Return a list of nodes forming the path from the root to this node."
        sol_states = []
        node = self
        while node != None:
            sol_states.insert(0, node.state)
            node = node.parent
        return sol_states

def graph_search(problem, open_nodes):
    """Search through the successors of a problem to find a goal.
    The argument open_nodes should be an empty queue."""
    explored = [problem.initial]
    open_nodes.append(Node(problem.initial))
    while len(open_nodes) > 0:
        node = open_nodes.pop()
        if problem.goal_test(node.state):
            #print "Path cost: %d" % node.path_cost
            return node.solution()
        for child in node.expand(problem):
            if child.state not in explored:
                open_nodes.append(child)
                explored.append(child.state)
    return None                
    
def breadth_first_search(problem):
    return graph_search(problem, FIFOQueue())



        
    
