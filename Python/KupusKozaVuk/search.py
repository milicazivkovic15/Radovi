from utils import *

class Problem:

    def __init__(self):
        #vuk, koza, kupus, covek
        self.initial = (1,1,1,1)
        self.goal = (0,0,0,0)
      
    def is_valid(self, state):
        (vuk, koza, kupus, covek) = state
        if any((x!=0 and x!=1) for x in state):
            return False
        if (covek==0 and vuk==1 and koza==1) or (covek==0 and kupus==1 and koza==1):
            return False
        if (covek==1 and vuk==0 and koza==0) or (covek==1 and kupus==0 and koza==0):
            return False
        return True

    def actions(self, state):
        moves = [(1,0,0,1), (0,1,0,1), (0,0,1,1), (0,0,0,1)]
        next_states = []
        for move in moves:
            (delta_vuk, delta_koza, delta_kupus, delta_covek) = move
            (vuk, koza, kupus, covek) = state
            if covek==1:
                vuk -= delta_vuk
                koza -= delta_koza
                kupus -= delta_kupus
                covek -= delta_covek
            else:
                vuk += delta_vuk
                koza += delta_koza
                kupus += delta_kupus
                covek += delta_covek
            new_state = (vuk, koza, kupus, covek)
            if self.is_valid(new_state):
                next_states.append(new_state)
        return next_states
                
        

    def goal_test(self, state):
        return state == self.goal
    """  
    def path_cost(self, cost_so_far, A, B):
        return cost_so_far + self.graph.get(A)[B]
        """
    
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
            return node.solution()
        for child in node.expand(problem):
            if child.state not in explored:
                open_nodes.append(child)
                explored.append(child.state)
    return None                
    
def breadth_first_search(problem):
    return graph_search(problem, FIFOQueue())


    
    
    
    
    
    
        
