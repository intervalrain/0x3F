---
title: 01-9. Graph (圖)
order: 9
description: 圖的表示方法、有向圖、無向圖、有權圖，以及基本演算法
tags:
  - Graph
  - DFS
  - BFS
  - 有向圖
  - 無向圖
  - 鄰接矩陣
  - 鄰接串列
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Graph (圖)

## 前言

**Graph (圖)** 是一種由**節點 (Vertex)** 和**邊 (Edge)** 組成的資料結構，用於表示複雜的關係網路。

---

## 基本概念

### 術語

```
圖範例:
    1 --- 2
    |   / |
    |  /  |
    | /   |
    3 --- 4

- 頂點 (Vertex/Node): 1, 2, 3, 4
- 邊 (Edge): (1,2), (1,3), (2,3), (2,4), (3,4)
- 度 (Degree): 節點連接的邊數
  - 節點 2 的度 = 3
- 路徑 (Path): 從一個節點到另一個節點的節點序列
  - 1 → 2 → 4
- 環 (Cycle): 起點和終點相同的路徑
  - 1 → 2 → 3 → 1
```

---

## 圖的分類

### 1. 有向圖 (Directed Graph)

邊有方向性。

```
有向圖:
    1 → 2
    ↓   ↓
    3 → 4

- 入度 (In-degree): 指向節點的邊數
- 出度 (Out-degree): 從節點出發的邊數
```

**應用**: 任務依賴、網頁連結、社交媒體追蹤

### 2. 無向圖 (Undirected Graph)

邊無方向性。

```
無向圖:
    1 --- 2
    |     |
    3 --- 4

邊 (1,2) 可以雙向通行
```

**應用**: 社交網路好友關係、道路網路

### 3. 有權圖 (Weighted Graph)

邊帶有權重。

```
有權圖:
    1 -5- 2
    |     |
    3     7
    |     |
    3 -2- 4

邊 (1,2) 的權重 = 5
```

**應用**: 路徑長度、成本計算、網路流量

### 4. 無權圖 (Unweighted Graph)

邊沒有權重（或權重都為 1）。

---

## 圖的表示方法

### 1. 鄰接矩陣 (Adjacency Matrix)

使用二維陣列表示圖。

```cpp
// 無向圖範例
    1 --- 2
    |     |
    3 --- 4

// 鄰接矩陣
vector<vector<int>> graph = {
    {0, 1, 1, 0},  // 節點 0: 連接 1, 2
    {1, 0, 0, 1},  // 節點 1: 連接 0, 3
    {1, 0, 0, 1},  // 節點 2: 連接 0, 3
    {0, 1, 1, 0}   // 節點 3: 連接 1, 2
};

// graph[i][j] = 1 表示節點 i 和 j 之間有邊
// graph[i][j] = 0 表示沒有邊
```

**有權圖**:
```cpp
vector<vector<int>> graph = {
    {0, 5, 3, 0},  // 節點 0 到 1 權重 5，到 2 權重 3
    {5, 0, 0, 7},
    {3, 0, 0, 2},
    {0, 7, 2, 0}
};

// graph[i][j] = weight 表示邊的權重
// graph[i][j] = 0 或 INF 表示沒有邊
```

**優點**:
- 檢查兩節點是否相鄰: O(1)
- 適合稠密圖 (邊數接近 V²)

**缺點**:
- 空間複雜度: O(V²)
- 不適合稀疏圖

### 2. 鄰接串列 (Adjacency List)

使用 list/vector 表示每個節點的鄰居。

```cpp
// 無向圖範例
    0 --- 1
    |     |
    2 --- 3

// 鄰接串列
vector<vector<int>> graph = {
    {1, 2},     // 節點 0 的鄰居: 1, 2
    {0, 3},     // 節點 1 的鄰居: 0, 3
    {0, 3},     // 節點 2 的鄰居: 0, 3
    {1, 2}      // 節點 3 的鄰居: 1, 2
};
```

**有權圖**:
```cpp
// 使用 pair<鄰居, 權重>
vector<vector<pair<int, int>>> graph = {
    {{1, 5}, {2, 3}},  // 0 → 1 權重 5, 0 → 2 權重 3
    {{0, 5}, {3, 7}},
    {{0, 3}, {3, 2}},
    {{1, 7}, {2, 2}}
};
```

**優點**:
- 空間複雜度: O(V + E)
- 適合稀疏圖
- 遍歷鄰居快

**缺點**:
- 檢查兩節點是否相鄰: O(degree)

---

## 稀疏圖 vs 稠密圖

### 定義

- **稀疏圖**: E << V² (邊數遠小於 V²)
- **稠密圖**: E ≈ V² (邊數接近 V²)

```
稀疏圖範例 (V=5, E=5):
    1 --- 2
    |
    3     4 --- 5

稠密圖範例 (V=4, E=6):
    1 --- 2
    |\ /|
    | X |
    |/ \|
    3 --- 4

幾乎所有節點都相連
```

### 選擇建議

| 圖類型 | 推薦表示 | 原因 |
|-------|---------|------|
| **稀疏圖** | 鄰接串列 | 節省空間 O(V+E) |
| **稠密圖** | 鄰接矩陣 | 快速查詢 O(1) |

---

## 圖的遍歷

### 1. DFS (深度優先搜尋)

使用 **Stack** 或**遞迴**。

```cpp
// 遞迴版本
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}

// 迭代版本
void dfsIterative(vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    stack<int> st;

    st.push(start);

    while (!st.empty()) {
        int node = st.top();
        st.pop();

        if (visited[node]) continue;

        visited[node] = true;
        cout << node << " ";

        // 先右後左（因為 stack）
        for (int i = graph[node].size() - 1; i >= 0; i--) {
            int neighbor = graph[node][i];
            if (!visited[neighbor]) {
                st.push(neighbor);
            }
        }
    }
}
```

**時間複雜度**:
- 鄰接串列: O(V + E)
- 鄰接矩陣: O(V²)

**應用**: 路徑搜尋、拓撲排序、連通分量

### 2. BFS (廣度優先搜尋)

使用 **Queue**。

```cpp
void bfs(vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    queue<int> q;

    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        cout << node << " ";

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

**時間複雜度**: O(V + E)

**應用**: 最短路徑（無權圖）、層級遍歷

---

## 常見圖演算法

### 1. 檢測環 (Cycle Detection)

#### 無向圖

```cpp
bool hasCycleDFS(vector<vector<int>>& graph, int node, int parent, vector<bool>& visited) {
    visited[node] = true;

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            if (hasCycleDFS(graph, neighbor, node, visited)) {
                return true;
            }
        } else if (neighbor != parent) {
            return true;  // 找到環
        }
    }

    return false;
}
```

#### 有向圖（使用拓撲排序或 DFS）

```cpp
bool hasCycleDFS(vector<vector<int>>& graph, int node, vector<int>& state) {
    // state: 0 = 未訪問, 1 = 訪問中, 2 = 已完成
    state[node] = 1;

    for (int neighbor : graph[node]) {
        if (state[neighbor] == 1) {
            return true;  // 找到環（back edge）
        }
        if (state[neighbor] == 0 && hasCycleDFS(graph, neighbor, state)) {
            return true;
        }
    }

    state[node] = 2;
    return false;
}
```

### 2. 拓撲排序 (Topological Sort)

僅適用於**有向無環圖 (DAG)**。

```cpp
// DFS 版本
void topologicalSortDFS(vector<vector<int>>& graph, int node,
                        vector<bool>& visited, stack<int>& st) {
    visited[node] = true;

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            topologicalSortDFS(graph, neighbor, visited, st);
        }
    }

    st.push(node);  // 後序位置
}

vector<int> topologicalSort(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    stack<int> st;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            topologicalSortDFS(graph, i, visited, st);
        }
    }

    vector<int> result;
    while (!st.empty()) {
        result.push_back(st.top());
        st.pop();
    }

    return result;
}

// Kahn's Algorithm (BFS 版本)
vector<int> topologicalSortKahn(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);

    // 計算入度
    for (int i = 0; i < n; i++) {
        for (int neighbor : graph[i]) {
            indegree[neighbor]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> result;

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);

        for (int neighbor : graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    // 如果 result.size() < n，表示有環
    return result;
}
```

**應用**: 任務調度、課程安排

### 3. 連通分量 (Connected Components)

```cpp
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}

int countComponents(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(graph, i, visited);
            count++;
        }
    }

    return count;
}
```

### 4. 最短路徑

#### BFS (無權圖)

```cpp
vector<int> shortestPath(vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    queue<int> q;

    dist[start] = 0;
    q.push(start);

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        for (int neighbor : graph[node]) {
            if (dist[neighbor] == INT_MAX) {
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }

    return dist;
}
```

#### Dijkstra (有權圖，非負權重)

```cpp
vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});  // {距離, 節點}

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}
```

**時間複雜度**: O((V + E) log V)

#### Bellman-Ford (可處理負權重)

```cpp
vector<int> bellmanFord(int n, vector<vector<int>>& edges, int start) {
    // edges: {u, v, weight}
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    // 鬆弛 V-1 次
    for (int i = 0; i < n - 1; i++) {
        for (auto& edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // 檢測負環
    for (auto& edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            // 存在負環
        }
    }

    return dist;
}
```

**時間複雜度**: O(VE)

---

## Union-Find (並查集)

用於處理**動態連通性**問題。

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // 路徑壓縮
        }
        return parent[x];
    }

    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;

        // 按秩合併
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        return true;
    }

    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }
};
```

**時間複雜度**: 攤銷 O(α(n)) ≈ O(1)

**應用**: Kruskal 最小生成樹、檢測環

---

## LeetCode 練習題

### 圖的基礎
- [Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [Clone Graph](https://leetcode.com/problems/clone-graph/)
- [Course Schedule](https://leetcode.com/problems/course-schedule/)

### DFS/BFS
- [All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/)
- [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

### 最短路徑
- [Network Delay Time](https://leetcode.com/problems/network-delay-time/)
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

### Union-Find
- [Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
- [Redundant Connection](https://leetcode.com/problems/redundant-connection/)

---

## 重點總結

### 圖的表示
- **鄰接矩陣**: 適合稠密圖，O(1) 查詢
- **鄰接串列**: 適合稀疏圖，O(V+E) 空間

### 遍歷
- **DFS**: Stack/遞迴，路徑搜尋
- **BFS**: Queue，最短路徑

### 最短路徑
- **BFS**: 無權圖 O(V+E)
- **Dijkstra**: 非負權重 O((V+E)logV)
- **Bellman-Ford**: 可處理負權重 O(VE)

### 其他演算法
- **拓撲排序**: DAG 的線性排序
- **Union-Find**: 動態連通性，攤銷 O(1)
