import graphviz as gv

class DisjointSet:
  def __init__(self, n):
    self.s = [-1]*n

  def find(self, e):
    if self.s[e] < 0:
      return e
    else:
      ancestor = self.find(self.s[e])
      self.s[e] = ancestor
      return ancestor

  def isSameSet(self, a, b):
    return self.find(a) == self.find(b)

  def union(self, a, b):
    pa = self.find(a)
    pb = self.find(b)
    if pa != pb:
      if abs(self.s[pa]) > abs(self.s[pb]):
        self.s[pa] += self.s[pb]
        self.s[pb] = pa
      else:
        self.s[pb] += self.s[pa]
        self.s[pa] = pb

def ds2gv(ds):
  g = gv.Digraph()
  g.graph_attr['rankdir'] = 'BT'
  for e in range(len(ds.s)):
    g.node(str(e))
    
  for a, b in enumerate(ds.s):
    if b >= 0 and a != b:
      g.edge(str(a), str(b))
      
  return g
