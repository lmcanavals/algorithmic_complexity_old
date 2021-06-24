import graphviz as gv
import networkx as nx

def nx2gv(G, weighted=False, params={'rankdir': 'LR', 'size': '6'},
          path=None, pathparams={'color':'orangered', 'penwidth': '3'},
          nodeinfo=False):
  if G.is_directed():
    g = gv.Digraph('G')
  else:
    g = gv.Graph('G')
  g.attr(**params)

  for u in G.nodes:
    if nodeinfo:
      g.node(str(u), **dict(G.nodes[u]))
    else:
      g.node(str(u))

  for u, v in G.edges():
    if G.is_directed():
      pp = pathparams if path and path[v] == u else {}
    else:
      pp = pathparams if (path and path[v] == u) or (path and path[u] == v) else {}

    if weighted:
      g.edge(str(u), str(v), f"{G.edges[u, v]['weight']}", **pp)
    else:
      g.edge(str(u), str(v), **pp)
      
  return g

def adjmatrix2gv(G, weighted=False, params={'rankdir': 'LR', 'size': '5'}):
  return nx2gv(nx.from_numpy_matrix(G), weighted, params)
             
def adjlist2gv(G, type='digraph', weighted=False, params={'rankdir': 'LR'}):
  digraph = type == 'digraph'
  if digraph:
    g = gv.Digraph('G')
  else:
    g = gv.Graph('G')
  Gv.attr(**params)

  n = len(G)
  for i in range(n):
    g.node(str(i))
             
  for u in range(n):
    if weighted:
      for v, w in range(n):
        g.edge(str(u), str(v), str(w))
        if digraph:
          g.edge(str(v), str(u), str(w))
    else:
      for v in range(n):
        g.edge(str(u), str(v))
        if digraph:
          g.edge(str(v), str(u))

  return g
      
def path2gv(path, params={'rankdir': 'LR', 'size': '5'}):
  g = gv.Digraph('G')
  g.attr(**params)
              
  n = len(path)
  for i in range(n):
    g.node(str(i))

  for v, u in enumerate(path):
    if u != -1:
      g.edge(str(u), str(v))

  return g
              
def wedges2adjlist(filename: str, type='graph'):
  with open(filename) as file:
    data = []
    n = 0
    for line in file:
      if line[0] != '#':
        data.append([int(x) for x in line.strip().split(',')])
        if data[-1][0] > n: n = data[-1][0]
        if data[-1][1] > n: n = data[-1][1]

  n += 1
  G = [[] for _ in range(n)]
  for u, v, w in data:
    G[u].append((v, w))
    if type == 'graph':
      G[v].append((u, w))
              
  return G
