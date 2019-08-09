from utils import *

class Problem:

    def __init__(self, n):
        self.initial = [[0 for j in range(n)] for i in range(3)]
        self.goal = n

	def is_valid(self,state,tI,tJ):
        if sum(state[tI]) > 1:
            return False
        suma = 0;
        for i in range(self.n):
            suma = suma + state[i][tJ]
        if (suma > 1):
            return False

        i = tI-1
        j = tJ-1
        suma=0
        while (i>=0 and j>=0):
            suma=suma+state[i][j]
            i = i-1
            j = j-1
        if (suma > 0):
            return False

        i = tI + 1
        j = tJ + 1
        suma=0
        while (i<self.n and j<self.n):
            suma=suma+state[i][j]
            i = i+1
            j = j+1
        if (suma > 0):
            return False

        i = tI + 1
        j = tJ - 1
        suma=0
        while (i<self.n and j>=0):
            suma=suma+state[i][j]
            i = i+1
            j = j-1
        if (suma > 0):
            return False

        i = tI - 1
        j = tJ + 1
        suma=0
        while (i<self.n and j<self.n):
            suma=suma+state[i][j]
            i = i-1
            j = j+1
        if (suma > 0):
            return False

        return True;


        matrica = []
        for i in range(n):
            matrica.append([]);
            for j in range(n):
                matrica[i][j]=0

    def actions(self, state):
        next_state = []
        for i in range(self.n):
            for j in range(self.n):
                if (state[i][j] == 0):
                    new_state = copy.deepcopy(state)
                    new_state[i][j] = 1
          
                   if self.is_valid(new_state,i,j):
                       next_state.append(new_state)
        return next_state
		
    def goal_test(self, state): 
		suma = 0;
		for i in range(self.n):
			for j in range(self.n):
				suma = suma + state[i][j]
        
        return suma == self.goal

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
        for a in self.dict.keys():
            for (b, distance) in self.dict[a].items():
                self.connect(b, a, distance)

    def make_directed(self):
        "Add all nodes without neighbours as keys with empty dictionaries as values"
        for a in self.dict.keys():
            for b in self.dict[a].keys():
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
    
    def __init__(self, state, parent=None, path_cost=0):
        "Create a search tree Node, derived from a parent by an action."
        self.state = state
        self.parent = parent
        if parent == None:
            self.depth = 0
        else:
            self.depth = parent.depth + 1
        self.path_cost = path_cost
            
    def expand(self, problem):
        "List the nodes reachable in one step from this node."
        exp_nodes = []
        neighbour_states = problem.actions(self.state)
        for x in neighbour_states:
            curr_cost = self.path_cost
            new_cost = problem.path_cost(curr_cost, self.state, x)
            new_node = Node(x, self, new_cost)
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

    
    
    
    
    
    
    
    
    
    
        
