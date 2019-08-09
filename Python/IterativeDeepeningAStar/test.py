from search import *

romania_map = { 
    'Arad' : { 'Zerind':75, 'Sibiu':140, 'Timisoara':118 },
    'Bucharest' : { 'Urziceni':85, 'Pitesti':101, 'Giurgiu':90, 'Fagaras':211 },
    'Craiova' : { 'Drobeta':120, 'Rimnicu':146, 'Pitesti':138 },
    'Drobeta' : { 'Mehadia':75 },
    'Eforie' : { 'Hirsova':86 },
    'Fagaras' : { 'Sibiu':99 },
    'Hirsova' : { 'Urziceni':98 },
    'Iasi' : { 'Vaslui':92, 'Neamt':87 },
    'Lugoj' : { 'Timisoara':111, 'Mehadia':70 },
    'Oradea' : { 'Zerind':71, 'Sibiu':151 },
    'Pitesti' : { 'Rimnicu':97 },
    'Rimnicu' : { 'Sibiu':80 },
    'Urziceni' : { 'Vaslui':142 }
}

distances_Bucharest = {
    'Arad' : 366, 'Bucharest' : 0, 'Craiova' : 160,
    'Drobeta' : 242, 'Eforie' : 161, 'Fagaras' : 176,
    'Giurgiu' : 77, 'Hirsova' : 151, 'Iasi' : 226,
    'Lugoj' : 244, 'Mehadia' : 241, 'Neamt' : 234,
    'Oradea' : 380, 'Pitesti' : 100, 'Rimnicu' : 193,
    'Sibiu' : 253, 'Timisoara' : 329, 'Urziceni' : 80,
    'Vaslui': 199, 'Zerind' : 374
}

def heuristic(node):
    return distances_Bucharest[node.state]


graph = Graph(romania_map,False)
problem = Problem('Arad',['Bucharest'],graph)
print(iterative_deepening_a_star_search(problem, heuristic))
