from utils import *
import copy

class Problem:

    def __init__(self,n):
        self.initial = [[0 for j in range(n)] for i in range(3)]
        self.goal = [[0 for j in range(n)] for i in range(3)]
        for i in range(n):
            self.initial[0][i] = i + 1
            self.goal[2][i] = i + 1
                
    def is_valid(self, state):
        for i in range(3):
            for j in range(0,len(state[0])-1):
                if state[i][j] > state[i][j+1]:
                    return False;
        return True;
                
    def actions(self, state):
        moves = [(0,1), (0,2), (1,0), (1,2), (2,0), (2,1)]
        next_states = []
        for move in moves:
            new_state = [row[:] for row in state]
            for i in range(len(new_state[0])):
                current = new_state[move[0]][i]
                if current:
                    new_state[move[0]][i] = 0
                    for j in range(len(new_state[0])-1,-1,-1):
                        if new_state[move[1]][j] == 0:
                            new_state[move[1]][j] = current
                            break
                    break
            if state != new_state and self.is_valid(new_state):
                next_states.append(new_state)
        return next_states

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
            #curr_cost = self.path_cost
            #new_cost = problem.path_cost(curr_cost, self.state, x)
            #new_node = Node(x, self, new_cost)
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
            print 'Broj poteza: ' + str(len(node.solution())-1)
            return node.solution()
        for child in node.expand(problem):
            if child.state not in explored:
                open_nodes.append(child)
                explored.append(child.state)
    return None                
    
def breadth_first_search(problem):
    return graph_search(problem, FIFOQueue())
    
    
    
    
    
    
    
        
