---
title: "圖論介紹"
order: 0
description: "圖的基本概念、表示方式與術語"
tags: ["graph", "基礎概念"]
---

# 圖論介紹

圖論 (Graph Theory) 是研究圖 (Graph) 及其性質的數學分支，在計算機科學中有廣泛應用，包括社交網路分析、路徑規劃、網路流量優化等。

## 基本概念

### 什麼是圖？

**圖 (Graph)** 是由**頂點 (Vertex/Node)** 和**邊 (Edge)** 組成的數據結構，記作 `G = (V, E)`：
- `V`: 頂點集合
- `E`: 邊集合

```
範例：一個簡單的圖

    0 ---- 1
    |      |
    |      |
    3 ---- 2

V = {0, 1, 2, 3}
E = {(0,1), (1,2), (2,3), (0,3)}
```

### 圖的分類

#### 1. 有向圖 vs 無向圖

**無向圖 (Undirected Graph)**：
- 邊沒有方向
- (u, v) 和 (v, u) 是同一條邊
- 例如：社交網路中的「朋友關係」

**有向圖 (Directed Graph/Digraph)**：
- 邊有方向
- (u, v) 表示從 u 指向 v
- 例如：Twitter 的「關注關係」

```
無向圖:              有向圖:
  0 ---- 1           0 ----> 1
  |      |           |       ^
  |      |           v       |
  3 ---- 2           3 ----> 2
```

#### 2. 加權圖 vs 非加權圖

**加權圖 (Weighted Graph)**：
- 每條邊有一個權重 (weight)
- 權重可以代表距離、成本、容量等

**非加權圖 (Unweighted Graph)**：
- 所有邊的權重視為 1

```
加權圖範例：
    0 --5-- 1
    |       |
    2       3
    |       |
    3 --1-- 2
```

#### 3. 其他特殊圖

**DAG (Directed Acyclic Graph)**：
- 有向無環圖
- 應用：任務排序、編譯依賴

**完全圖 (Complete Graph)**：
- 任意兩個頂點之間都有邊
- n 個頂點的完全圖有 n(n-1)/2 條邊

**二分圖 (Bipartite Graph)**：
- 頂點可以分為兩個集合，同一集合內的頂點之間沒有邊
- 可用二染色法檢測

**樹 (Tree)**：
- 連通的無環無向圖
- n 個頂點恰好有 n-1 條邊

## 圖的表示方式

在 C++ 中，圖主要有兩種表示方式：

### 1. 鄰接矩陣 (Adjacency Matrix)

使用二維陣列 `adj[i][j]` 表示頂點 i 到頂點 j 是否有邊。

```cpp
// 無向圖的鄰接矩陣
vector<vector<int>> adj(n, vector<int>(n, 0));

// 加邊
adj[u][v] = 1;
adj[v][u] = 1;  // 無向圖需要雙向

// 加權圖
adj[u][v] = weight;
adj[v][u] = weight;
```

**優點**：
- 查詢兩點是否相鄰：O(1)
- 適合稠密圖 (邊數接近 V²)

**缺點**：
- 空間複雜度：O(V²)，浪費空間於稀疏圖
- 遍歷所有鄰居：O(V)

### 2. 鄰接表 (Adjacency List)

使用陣列或向量，每個元素儲存該頂點的所有鄰居。

```cpp
// 無向圖的鄰接表
vector<vector<int>> adj(n);

// 加邊
adj[u].push_back(v);
adj[v].push_back(u);  // 無向圖需要雙向

// 加權圖：使用 pair<鄰居, 權重>
vector<vector<pair<int, int>>> graph(n);
graph[u].push_back({v, weight});
graph[v].push_back({u, weight});
```

**優點**：
- 空間複雜度：O(V + E)，適合稀疏圖
- 遍歷所有鄰居：O(degree(v))

**缺點**：
- 查詢兩點是否相鄰：O(degree(v))

### 選擇建議

| 情況 | 建議 |
|------|------|
| 稠密圖 (E ≈ V²) | 鄰接矩陣 |
| 稀疏圖 (E << V²) | 鄰接表 |
| 需要頻繁查詢邊 | 鄰接矩陣 |
| 需要遍歷鄰居 | 鄰接表 |
| LeetCode 題目 | 通常用鄰接表 |

## 基本術語

### 度 (Degree)

**度 (degree)**：與頂點相連的邊數

- **無向圖**：頂點 v 的度 = 與 v 相連的邊數
- **有向圖**：
  - **入度 (in-degree)**：指向 v 的邊數
  - **出度 (out-degree)**：從 v 出發的邊數

```cpp
// 計算度
int degree(int v, vector<vector<int>>& adj) {
    return adj[v].size();  // 鄰接表
}

// 有向圖的入度（需要預先計算）
vector<int> indegree(n, 0);
for (int u = 0; u < n; u++) {
    for (int v : adj[u]) {
        indegree[v]++;
    }
}
```

### 路徑與環

**路徑 (Path)**：
- 頂點序列 v₀, v₁, ..., vₖ，其中 (vᵢ, vᵢ₊₁) 是邊
- **簡單路徑**：沒有重複頂點的路徑

**環 (Cycle)**：
- 起點和終點相同的路徑
- **簡單環**：除了起點和終點，沒有其他重複頂點

```
路徑範例：0 -> 1 -> 2 -> 3
環範例：  0 -> 1 -> 2 -> 0
```

### 連通性

**連通 (Connected)**：
- 無向圖中，任意兩個頂點之間都有路徑
- 有向圖中，稱為**強連通 (Strongly Connected)**

**連通分量 (Connected Component)**：
- 極大的連通子圖

```
範例：兩個連通分量

    0 --- 1       4 --- 5
    |     |           |
    2 --- 3           6

分量 1: {0, 1, 2, 3}
分量 2: {4, 5, 6}
```

## C++ 中的圖表示

### 基本模板

```cpp
// 1. 無向圖（鄰接表）
class Graph {
public:
    int n;  // 頂點數
    vector<vector<int>> adj;  // 鄰接表

    Graph(int n) : n(n), adj(n) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);  // 無向圖
    }
};

// 2. 有向圖（鄰接表）
class DirectedGraph {
public:
    int n;
    vector<vector<int>> adj;

    DirectedGraph(int n) : n(n), adj(n) {}

    void addEdge(int u, int v) {
        adj[u].push_back(v);  // 只加一條邊
    }
};

// 3. 加權圖（鄰接表）
class WeightedGraph {
public:
    int n;
    vector<vector<pair<int, int>>> adj;  // {鄰居, 權重}

    WeightedGraph(int n) : n(n), adj(n) {}

    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});  // 無向圖
    }
};
```

### 從 LeetCode 輸入建圖

```cpp
// 從邊列表建圖（常見於 LeetCode）
vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        int u = e[0], v = e[1];
        adj[u].push_back(v);
        adj[v].push_back(u);  // 無向圖
    }
    return adj;
}

// 加權圖版本
vector<vector<pair<int,int>>> buildWeightedGraph(
    int n, vector<vector<int>>& edges) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    return adj;
}
```

## 圖的基本操作

### 遍歷鄰居

```cpp
// 遍歷頂點 u 的所有鄰居
for (int v : adj[u]) {
    // 處理鄰居 v
}

// 加權圖
for (auto [v, w] : adj[u]) {
    // 鄰居 v，邊權重 w
}
```

### 檢查邊是否存在

```cpp
// 鄰接表（O(degree(u))）
bool hasEdge(int u, int v, vector<vector<int>>& adj) {
    return find(adj[u].begin(), adj[u].end(), v) != adj[u].end();
}

// 鄰接矩陣（O(1)）
bool hasEdge(int u, int v, vector<vector<int>>& matrix) {
    return matrix[u][v] != 0;
}
```

## 常見應用場景

1. **社交網路**：用戶為頂點，關係為邊
2. **地圖導航**：地點為頂點，道路為邊（加權圖）
3. **網頁排名**：網頁為頂點，超連結為邊（有向圖）
4. **任務排程**：任務為頂點，依賴為邊（DAG）
5. **網路路由**：路由器為頂點，連線為邊
6. **推薦系統**：物品為頂點，相似度為邊權重

## 複雜度分析

| 操作 | 鄰接矩陣 | 鄰接表 |
|------|----------|--------|
| 空間 | O(V²) | O(V + E) |
| 加邊 | O(1) | O(1) |
| 刪邊 | O(1) | O(V) |
| 查邊 | O(1) | O(V) |
| 遍歷鄰居 | O(V) | O(degree) |
| 遍歷所有邊 | O(V²) | O(V + E) |

## 下一步

接下來我們將學習：

1. **DFS/BFS 遍歷**：圖的基本搜尋演算法
2. **環檢測**：檢測圖中是否存在環
3. **Union Find**：快速判斷連通性
4. **拓撲排序**：DAG 的線性排序
5. **最短路徑**：Dijkstra、Bellman-Ford、Floyd-Warshall
6. **最小生成樹**：Kruskal、Prim
7. **進階主題**：Tarjan、最大流、二分圖匹配

## 參考資料

- [Graph Theory - Wikipedia](https://en.wikipedia.org/wiki/Graph_theory)
- [Introduction to Graphs - GeeksforGeeks](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)
