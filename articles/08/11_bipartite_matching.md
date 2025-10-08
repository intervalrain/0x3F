---
title: 08-11. 二分圖最大匹配 (進階)
order: 11
description: 二分圖判定與最大匹配 - 匈牙利演算法與 Hopcroft-Karp
tags:
  - graph
  - bipartite
  - matching
  - hungarian algorithm
  - hopcroft-karp
  - advanced
author: Rain Hu
date: ''
draft: true
---

# 二分圖最大匹配

二分圖最大匹配是圖論中的經典問題，用於尋找二分圖中最多的不相交匹配邊。本章介紹二分圖的基本概念、判定方法和匹配演算法。

> **注意**：這是進階主題，最大匹配演算法在 LeetCode 較少出現，但二分圖判定是常見題型。

## 核心概念

### 二分圖 (Bipartite Graph)

**定義**：頂點可以分為兩個集合 U 和 V，使得：
- 同一集合內的頂點之間沒有邊
- 所有邊都連接 U 和 V 中的頂點

**等價條件**：
- 圖是**二染色**的（可用兩種顏色染色，相鄰頂點顏色不同）
- 圖中**沒有奇數環**

### 視覺化範例

```
二分圖：
  U: 0   1       V: 2   3
     |\ /|
     | X |
     |/ \|
     2   3

可以分為 {0, 1} 和 {2, 3}

非二分圖（有奇數環）：
     0
    / \
   1   2
    \ /
     3

三角形 0-1-3 是奇數環
```

### 匹配 (Matching)

**匹配**：邊的集合，其中任意兩條邊不共享頂點

**最大匹配**：邊數最多的匹配

**完美匹配**：所有頂點都被匹配

```
範例：
  U: 0   1   2       V: 3   4   5
     |   |\ /|
     |   | X |
     |   |/ \|
     3   4   5

一個最大匹配：{0-3, 1-4, 2-5}（完美匹配）
```

## 二分圖判定

### DFS 染色法

使用 DFS 嘗試二染色，如果成功則是二分圖。

```cpp
class Solution {
private:
    bool dfs(int node, int color, vector<int>& colors,
             vector<vector<int>>& graph) {
        colors[node] = color;

        for (int neighbor : graph[node]) {
            if (colors[neighbor] == -1) {
                // 鄰居未染色，染成不同顏色
                if (!dfs(neighbor, 1 - color, colors, graph)) {
                    return false;
                }
            } else if (colors[neighbor] == color) {
                // 鄰居顏色相同，不是二分圖
                return false;
            }
        }

        return true;
    }

public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> colors(n, -1);  // -1 表示未染色

        // 處理所有連通分量
        for (int i = 0; i < n; i++) {
            if (colors[i] == -1) {
                if (!dfs(i, 0, colors, graph)) {
                    return false;
                }
            }
        }

        return true;
    }
};
```

**複雜度**：
- 時間：O(V + E)
- 空間：O(V)

### BFS 染色法

```cpp
class Solution {
public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> colors(n, -1);

        for (int start = 0; start < n; start++) {
            if (colors[start] != -1) continue;

            queue<int> q;
            q.push(start);
            colors[start] = 0;

            while (!q.empty()) {
                int node = q.front();
                q.pop();

                for (int neighbor : graph[node]) {
                    if (colors[neighbor] == -1) {
                        colors[neighbor] = 1 - colors[node];
                        q.push(neighbor);
                    } else if (colors[neighbor] == colors[node]) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
};
```

## 最大匹配演算法

### 匈牙利演算法 (Hungarian Algorithm)

**核心思想**：
- 為左部的每個頂點尋找匹配
- 使用 DFS 尋找**增廣路徑**
- 時間複雜度：O(VE)

```cpp
class HungarianAlgorithm {
private:
    int n1, n2;
    vector<vector<int>> graph;
    vector<int> match;     // match[v] = u 表示右部 v 匹配左部 u
    vector<bool> visited;

    // DFS 尋找增廣路徑
    bool dfs(int u) {
        for (int v : graph[u]) {
            if (visited[v]) continue;
            visited[v] = true;

            // v 未匹配，或 v 的匹配可以找到新的匹配
            if (match[v] == -1 || dfs(match[v])) {
                match[v] = u;
                return true;
            }
        }

        return false;
    }

public:
    HungarianAlgorithm(int n1, int n2, vector<vector<int>>& graph)
        : n1(n1), n2(n2), graph(graph), match(n2, -1) {}

    int maxMatching() {
        int matchCount = 0;

        // 為每個左部頂點尋找匹配
        for (int u = 0; u < n1; u++) {
            visited.assign(n2, false);
            if (dfs(u)) {
                matchCount++;
            }
        }

        return matchCount;
    }

    vector<pair<int, int>> getMatching() {
        vector<pair<int, int>> matching;
        for (int v = 0; v < n2; v++) {
            if (match[v] != -1) {
                matching.push_back({match[v], v});
            }
        }
        return matching;
    }
};
```

**複雜度**：
- 時間：O(V × E)
- 空間：O(V)

### Hopcroft-Karp 演算法

**優化版本**：
- 使用 BFS + DFS 同時尋找多條增廣路徑
- 時間複雜度：O(E√V)

```cpp
class HopcroftKarp {
private:
    int n1, n2;
    vector<vector<int>> graph;
    vector<int> pairU, pairV, dist;
    const int INF = 1e9;

    // BFS 建立層級圖
    bool bfs() {
        queue<int> q;

        for (int u = 0; u < n1; u++) {
            if (pairU[u] == -1) {
                dist[u] = 0;
                q.push(u);
            } else {
                dist[u] = INF;
            }
        }

        dist[n1] = INF;  // 虛擬節點

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            if (dist[u] < dist[n1]) {
                for (int v : graph[u]) {
                    int nextU = pairV[v];
                    if (nextU == -1) nextU = n1;  // 虛擬節點

                    if (dist[nextU] == INF) {
                        dist[nextU] = dist[u] + 1;
                        if (nextU != n1) q.push(nextU);
                    }
                }
            }
        }

        return dist[n1] != INF;
    }

    // DFS 尋找增廣路徑
    bool dfs(int u) {
        if (u == -1) return true;

        for (int v : graph[u]) {
            int nextU = pairV[v];
            if (nextU == -1) nextU = n1;

            if (dist[nextU] == dist[u] + 1) {
                if (dfs(nextU == n1 ? -1 : nextU)) {
                    pairV[v] = u;
                    pairU[u] = v;
                    return true;
                }
            }
        }

        dist[u] = INF;
        return false;
    }

public:
    HopcroftKarp(int n1, int n2, vector<vector<int>>& graph)
        : n1(n1), n2(n2), graph(graph),
          pairU(n1, -1), pairV(n2, -1), dist(n1 + 1) {}

    int maxMatching() {
        int matching = 0;

        while (bfs()) {
            for (int u = 0; u < n1; u++) {
                if (pairU[u] == -1 && dfs(u)) {
                    matching++;
                }
            }
        }

        return matching;
    }
};
```

**複雜度**：
- 時間：O(E√V)
- 空間：O(V)

## LeetCode 題目詳解

### 1. [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)

**題目**：判斷圖是否為二分圖。

**解法**：DFS 染色

```cpp
class Solution {
private:
    bool dfs(int node, int color, vector<int>& colors,
             vector<vector<int>>& graph) {
        colors[node] = color;

        for (int neighbor : graph[node]) {
            if (colors[neighbor] == -1) {
                if (!dfs(neighbor, 1 - color, colors, graph)) {
                    return false;
                }
            } else if (colors[neighbor] == color) {
                return false;
            }
        }

        return true;
    }

public:
    bool isBipartite(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> colors(n, -1);

        for (int i = 0; i < n; i++) {
            if (colors[i] == -1) {
                if (!dfs(i, 0, colors, graph)) {
                    return false;
                }
            }
        }

        return true;
    }
};
```

### 2. [886. Possible Bipartition](https://leetcode.com/problems/possible-bipartition/)

**題目**：判斷能否將 n 個人分成兩組，使得不喜歡的人不在同一組。

**解法**：建圖 + 二分圖判定

```cpp
class Solution {
private:
    bool dfs(int node, int color, vector<int>& colors,
             vector<vector<int>>& graph) {
        colors[node] = color;

        for (int neighbor : graph[node]) {
            if (colors[neighbor] == -1) {
                if (!dfs(neighbor, 1 - color, colors, graph)) {
                    return false;
                }
            } else if (colors[neighbor] == color) {
                return false;
            }
        }

        return true;
    }

public:
    bool possibleBipartition(int n, vector<vector<int>>& dislikes) {
        // 建圖：不喜歡的人之間連邊
        vector<vector<int>> graph(n + 1);
        for (auto& d : dislikes) {
            graph[d[0]].push_back(d[1]);
            graph[d[1]].push_back(d[0]);
        }

        vector<int> colors(n + 1, -1);

        for (int i = 1; i <= n; i++) {
            if (colors[i] == -1) {
                if (!dfs(i, 0, colors, graph)) {
                    return false;
                }
            }
        }

        return true;
    }
};
```

## 常見陷阱與技巧

### 陷阱

1. **忘記處理多個連通分量**
   ```cpp
   // 錯誤：只從節點 0 開始
   dfs(0, 0, colors, graph);

   // 正確：處理所有連通分量
   for (int i = 0; i < n; i++) {
       if (colors[i] == -1) {
           dfs(i, 0, colors, graph);
       }
   }
   ```

2. **染色顏色錯誤**
   ```cpp
   // 使用 0 和 1 作為顏色（不是 1 和 2）
   colors[neighbor] = 1 - colors[node];
   ```

3. **最大匹配中的增廣路徑**
   ```cpp
   // 每次尋找增廣路徑前重置 visited
   visited.assign(n2, false);
   ```

### 進階技巧

1. **最小點覆蓋**
   ```cpp
   // 二分圖的最小點覆蓋 = 最大匹配（König定理）
   int minVertexCover = maxMatching();
   ```

2. **最大獨立集**
   ```cpp
   // 二分圖的最大獨立集 = V - 最大匹配
   int maxIndependentSet = n - maxMatching();
   ```

3. **完美匹配判定**
   ```cpp
   // 存在完美匹配 <=> 最大匹配 = min(|U|, |V|)
   bool hasPerfectMatching = (maxMatching() == min(n1, n2));
   ```

## 應用場景

### 二分圖判定
- 任務分組
- 衝突檢測
- 二染色問題

### 最大匹配
- 工作分配
- 婚配問題
- 資源調度
- 課程安排

## 演算法比較

| 演算法 | 時間複雜度 | 適用場景 |
|--------|-----------|---------|
| 匈牙利演算法 | O(VE) | 一般二分圖 |
| Hopcroft-Karp | O(E√V) | 大規模二分圖 |
| 最大流 | O(VE²) ~ O(V²E) | 通用（但較慢） |

## 總結

### 二分圖特點

**判定條件**：
- 可以二染色
- 沒有奇數環
- DFS/BFS 染色成功

**性質**：
- 最小點覆蓋 = 最大匹配
- 最大獨立集 = V - 最大匹配
- 可以用最大流求最大匹配

### 實戰建議

1. **LeetCode 重點**：
   - 二分圖判定（常見）
   - 最大匹配（較少）

2. **必須掌握**：
   - DFS/BFS 染色法
   - 二分圖判定

3. **進階學習**：
   - 匈牙利演算法
   - Hopcroft-Karp 演算法

4. **實現技巧**：
   - 記住染色模板
   - 理解增廣路徑概念

### 學習路徑

1. **基礎**：二分圖定義與判定
2. **進階**：最大匹配概念
3. **演算法**：匈牙利演算法
4. **優化**：Hopcroft-Karp 演算法
5. **應用**：實際問題建模

> **總結**：二分圖判定是常見題型，必須掌握；最大匹配是進階主題，了解概念即可。

## 圖論章節完結

恭喜完成圖論章節的學習！從基礎的圖表示、遍歷，到最短路徑、最小生成樹，最後到進階的最大流和二分圖匹配，你已經掌握了圖論的核心演算法。

**學習建議**：
- **基礎演算法**：DFS/BFS、Union Find、Dijkstra（必須精通）
- **中級演算法**：拓撲排序、Bellman-Ford、Floyd-Warshall、MST（熟練掌握）
- **進階演算法**：Tarjan、最大流、二分圖匹配（理解概念）

**實戰練習**：
- 多刷 LeetCode 圖論題目
- 理解每個演算法的適用場景
- 記住常用模板
- 注意細節（方向、權重、連通性）

祝你在演算法學習的道路上越走越遠！
