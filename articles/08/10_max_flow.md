---
title: "最大流演算法 (進階)"
order: 10
description: "網路流問題 - Edmonds-Karp 與 Dinic 演算法"
tags: ["graph", "max flow", "network flow", "edmonds-karp", "dinic", "advanced"]
---

# 最大流演算法 (Maximum Flow)

最大流問題是圖論中的經典問題，用於計算從源點到匯點可以傳輸的最大流量。本章介紹兩種經典演算法：Edmonds-Karp 和 Dinic。

> **注意**：這是進階主題，在 LeetCode 中較少出現。本章著重於概念介紹和基本實現。

## 核心概念

### 網路流 (Network Flow)

**流網路**由以下元素組成：
- **有向圖** G = (V, E)
- **容量** c(u, v)：邊 (u, v) 的最大流量
- **源點** s：流的起點
- **匯點** t：流的終點

**流 (Flow)**：
- f(u, v)：從 u 到 v 的實際流量
- 必須滿足：
  1. **容量限制**：0 ≤ f(u, v) ≤ c(u, v)
  2. **流守恆**：除了源點和匯點，每個節點的入流 = 出流

### 視覺化範例

```
流網路（數字表示容量）：
    s --10--> a --10--> t
    |         |         ^
    5         5         5
    |         v         |
    +------> b --------+

可能的流：
流 1: s→a→t (10)
流 2: s→b→t (5)
最大流 = 10 + 5 = 15

實際上：
s→a: 10, a→t: 5, a→b: 5, s→b: 5, b→t: 10
最大流 = 15
```

### 殘餘網路 (Residual Network)

**殘餘容量**：
- 正向邊：c(u, v) - f(u, v)（剩餘容量）
- 反向邊：f(u, v)（可以撤回的流量）

**增廣路徑 (Augmenting Path)**：
- 殘餘網路中從 s 到 t 的路徑
- 路徑上的最小殘餘容量 = 可增加的流量

## Ford-Fulkerson 方法

### 核心思想

1. 初始化流為 0
2. 在殘餘網路中找增廣路徑
3. 沿增廣路徑增加流量
4. 重複直到找不到增廣路徑

**偽代碼**：
```
while (存在增廣路徑 P):
    bottleneck = min(殘餘容量 along P)
    增加流量 bottleneck 沿著 P
```

## Edmonds-Karp 演算法

### 核心思想

Ford-Fulkerson 的**BFS 實現**：
- 使用 BFS 找最短增廣路徑
- 時間複雜度有保證：O(VE²)

### 實現

```cpp
class EdmondsKarp {
private:
    int n;
    vector<vector<int>> capacity;  // 容量矩陣
    vector<vector<int>> adj;       // 鄰接表

    // BFS 尋找增廣路徑
    bool bfs(int s, int t, vector<int>& parent) {
        vector<bool> visited(n, false);
        queue<int> q;

        q.push(s);
        visited[s] = true;
        parent[s] = -1;

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int v : adj[u]) {
                // 殘餘容量 > 0 且未訪問
                if (!visited[v] && capacity[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    q.push(v);

                    if (v == t) return true;  // 找到增廣路徑
                }
            }
        }

        return false;  // 沒有增廣路徑
    }

public:
    EdmondsKarp(int n) : n(n), capacity(n, vector<int>(n, 0)), adj(n) {}

    void addEdge(int u, int v, int cap) {
        capacity[u][v] += cap;
        adj[u].push_back(v);
        adj[v].push_back(u);  // 反向邊（容量為 0）
    }

    int maxFlow(int s, int t) {
        int totalFlow = 0;
        vector<int> parent(n);

        // 不斷尋找增廣路徑
        while (bfs(s, t, parent)) {
            // 找瓶頸（路徑上最小殘餘容量）
            int pathFlow = INT_MAX;
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                pathFlow = min(pathFlow, capacity[u][v]);
            }

            // 更新殘餘容量
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                capacity[u][v] -= pathFlow;  // 減少正向容量
                capacity[v][u] += pathFlow;  // 增加反向容量
            }

            totalFlow += pathFlow;
        }

        return totalFlow;
    }
};
```

### 複雜度分析

- **時間複雜度**：O(VE²)
  - 最多 VE 次增廣（每次至少飽和一條邊）
  - 每次 BFS：O(E)

- **空間複雜度**：O(V²)

## Dinic 演算法

### 核心思想

Edmonds-Karp 的**優化版本**：
- 使用 **Level Graph**（層級圖）
- 使用 **Blocking Flow**（阻塞流）
- 時間複雜度：O(V²E)

### 關鍵概念

1. **Level Graph**：
   - BFS 建立層級
   - 只保留指向下一層的邊

2. **Blocking Flow**：
   - 在 Level Graph 上用 DFS 找多條增廣路徑
   - 直到無法增廣

### 實現（簡化版）

```cpp
class Dinic {
private:
    struct Edge {
        int to, cap, rev;  // 終點、容量、反向邊索引
    };

    int n;
    vector<vector<Edge>> graph;
    vector<int> level, iter;

    // BFS 建立層級圖
    bool bfs(int s, int t) {
        level.assign(n, -1);
        queue<int> q;

        level[s] = 0;
        q.push(s);

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (auto& e : graph[u]) {
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }

        return level[t] != -1;
    }

    // DFS 找阻塞流
    int dfs(int u, int t, int flow) {
        if (u == t) return flow;

        for (int& i = iter[u]; i < graph[u].size(); i++) {
            Edge& e = graph[u][i];

            if (e.cap > 0 && level[u] < level[e.to]) {
                int d = dfs(e.to, t, min(flow, e.cap));

                if (d > 0) {
                    e.cap -= d;
                    graph[e.to][e.rev].cap += d;
                    return d;
                }
            }
        }

        return 0;
    }

public:
    Dinic(int n) : n(n), graph(n), level(n), iter(n) {}

    void addEdge(int u, int v, int cap) {
        graph[u].push_back({v, cap, (int)graph[v].size()});
        graph[v].push_back({u, 0, (int)graph[u].size() - 1});  // 反向邊
    }

    int maxFlow(int s, int t) {
        int flow = 0;

        // 反覆建立層級圖並找阻塞流
        while (bfs(s, t)) {
            iter.assign(n, 0);
            int f;
            while ((f = dfs(s, t, INT_MAX)) > 0) {
                flow += f;
            }
        }

        return flow;
    }
};
```

### 複雜度分析

- **時間複雜度**：O(V²E)
  - 最多 V 次 BFS（每次層級至少增加 1）
  - 每次 DFS：O(VE)

- **空間複雜度**：O(V + E)

## 簡單示例題目

### 基本最大流問題

```cpp
// 範例：計算從源點到匯點的最大流
class Solution {
public:
    int maxFlow(int n, vector<vector<int>>& edges, int s, int t) {
        EdmondsKarp ek(n);

        // 加入邊
        for (auto& e : edges) {
            int u = e[0], v = e[1], cap = e[2];
            ek.addEdge(u, v, cap);
        }

        return ek.maxFlow(s, t);
    }
};
```

### 應用：二分圖最大匹配

最大流可以用於求解二分圖最大匹配：
- 建立超級源點連到左部
- 右部連到超級匯點
- 容量均為 1

```cpp
class Solution {
public:
    int maxBipartiteMatching(int n1, int n2, vector<vector<int>>& edges) {
        int n = n1 + n2 + 2;  // +2 for source and sink
        int source = 0, sink = n - 1;

        Dinic dinic(n);

        // 源點 -> 左部（容量 1）
        for (int i = 1; i <= n1; i++) {
            dinic.addEdge(source, i, 1);
        }

        // 左部 -> 右部（匹配邊，容量 1）
        for (auto& e : edges) {
            int u = e[0], v = e[1];
            dinic.addEdge(u, n1 + v, 1);
        }

        // 右部 -> 匯點（容量 1）
        for (int i = 1; i <= n2; i++) {
            dinic.addEdge(n1 + i, sink, 1);
        }

        return dinic.maxFlow(source, sink);
    }
};
```

## 最大流最小割定理

**定理**：最大流 = 最小割

**割 (Cut)**：
- 將節點分為兩個集合 S 和 T
- s ∈ S，t ∈ T
- 割的容量 = 從 S 到 T 的所有邊的容量和

**最小割**：容量最小的割

**應用**：
- 圖像分割
- 社群發現
- 可靠性分析

## 常見陷阱與技巧

### 陷阱

1. **忘記建立反向邊**
   ```cpp
   // 必須同時建立反向邊（容量為 0）
   graph[u].push_back({v, cap, ...});
   graph[v].push_back({u, 0, ...});
   ```

2. **容量更新錯誤**
   ```cpp
   // 正確：正向減少，反向增加
   capacity[u][v] -= flow;
   capacity[v][u] += flow;
   ```

3. **重邊處理**
   ```cpp
   // 多條邊應該累加容量
   capacity[u][v] += cap;
   ```

### 進階技巧

1. **最小費用最大流**
   - 在最大流基礎上增加費用概念
   - 使用 Bellman-Ford 或 SPFA 找最小費用增廣路徑

2. **多源多匯**
   - 建立超級源點和超級匯點
   - 容量設為無窮大

3. **容量縮放**
   - 處理大容量時的優化
   - 逐步增加考慮的容量級別

## 演算法比較

| 演算法 | 時間複雜度 | 適用場景 |
|--------|-----------|---------|
| Edmonds-Karp | O(VE²) | 小規模圖、教學 |
| Dinic | O(V²E) | 中等規模圖 |
| Push-Relabel | O(V³) | 大規模稠密圖 |

## 應用場景

1. **網路流量優化**：最大化數據傳輸
2. **二分圖匹配**：工作分配、婚配問題
3. **項目選擇**：最大化收益
4. **圖像分割**：前景/背景分離
5. **航空排程**：最大化航班安排

## 總結

### 最大流問題特點

**核心概念**：
- 容量限制
- 流守恆
- 殘餘網路
- 增廣路徑

**經典演算法**：
- Edmonds-Karp：BFS 找增廣路徑
- Dinic：Level Graph + Blocking Flow

### 實戰建議

1. **LeetCode 出現頻率**：較低（進階題目）
2. **重點理解概念**：殘餘網路、增廣路徑
3. **優先掌握**：Edmonds-Karp（較簡單）
4. **進階學習**：Dinic、Push-Relabel
5. **實際應用**：二分圖匹配、最小割

### 學習建議

- **基礎**：理解流網路、殘餘網路概念
- **實現**：掌握 Edmonds-Karp 基本實現
- **進階**：了解 Dinic 優化思想
- **應用**：二分圖匹配、項目選擇問題

> **注意**：最大流是進階主題，建議先掌握前面的基礎演算法後再深入學習。

下一章我們將介紹二分圖最大匹配問題及其演算法。
