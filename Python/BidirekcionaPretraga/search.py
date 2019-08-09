from utils import *

class Problem:

    def __init__(self, initial, goal, graph):
        self.initial = initial
        self.goal = goal
        self.graph = graph

    def actions(self, a):
        return self.graph.get(a).keys()

    def goal_test(self, state):
        return any(x==state for x in self.goal)

    def goal_test_start(self, state):
       return any(x==state for x in self.inital)
    
    def path_cost(self, cost_so_far, A, B):
        return cost_so_far + self.graph.get(A)[B]

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
    
def best_first_search(problem, h):
    open_nodes = PriorityQueue(h)
    explored = [problem.initial]
    open_nodes.append(Node(problem.initial))
    while len(open_nodes) > 0:
        node = open_nodes.pop()
        print "Popped " + node.state + " " + str(h(node))
        if problem.goal_test(node.state):
            return node.solution()
        for child in node.expand(problem):
            if child.state not in explored:
                open_nodes.append(child)
                print "Pushed " + child.state
                explored.append(child.state)
            else:
                for i in range(len(open_nodes)):
                    if open_nodes.A[i].state == child.state:
                        if h(child) < h(open_nodes.A[i]):
                            open_nodes.A[i] = child
                            print "Changed " + child.state
    return None


    
def graph_search(problem):
    exploredStart = [problem.initial]
    openNodesStart = FIFOQueue()
    openNodesStart.append(Node(problem.initial))

    exploredGoal = [problem.goal[0]]
    openNodesGoal = FIFOQueue()
    openNodesGoal.append(Node(problem.goal[0]))

    if (problem.goal_test(problem.initial)):
        return Node(problem.initial).solution()


    while (len(openNodesStart) > 0 and len(openNodesGoal) > 0):
        nodeStart = openNodesStart.pop()
        nodeGoal = openNodesGoal.pop()
        
        if (problem.goal_test_start(nodeGoal)):
            return nodeGoal.solution()
        if (problem.goal_test_goal(nodeStart)):
            return nodeStart.solution()

        for childStart in nodeStart.expand(problem):
            if childStart.state not in exploredStart:
                openNodesStart.append(
                
    
        
