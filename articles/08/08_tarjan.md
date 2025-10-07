---
title: "Tarjan 演算法"
order: 8
description: "強連通分量、橋與割點的統一解法"
tags: ["graph", "tarjan", "SCC", "bridge", "articulation point", "DFS"]
---

# Tarjan 演算法

Tarjan 演算法是由 Robert Tarjan 提出的一系列基於 DFS 的圖論演算法,主要用於解決**強連通分量 (SCC)**、**橋 (Bridge)** 和**割點 (Articulation Point)** 問題。

## 核心概念

### 1. 強連通分量 (Strongly Connected Component, SCC)

**定義**：有向圖中的極大強連通子圖。
- 強連通：任意兩個頂點之間都有路徑可達

**應用**：
- 檢測圖的連通性結構
- 縮點（將 SCC 縮為一個節點）
- 2-SAT 問題

```
範例：
    0 → 1 → 2
    ↑   ↓   ↓
    4 ← 3 ←

SCC 1: {0, 1, 3, 4}
SCC 2: {2}
```

### 2. 橋 (Bridge)

**定義**：刪除後使圖不連通的邊。
- 也稱為「割邊」或「關鍵邊」

**應用**：
- 網路關鍵連接
- 脆弱性分析

```
範例：
    0 - 1 - 2
        |
        3

邊 1-2 是橋（刪除後 2 與其他節點不連通）
```

### 3. 割點 (Articulation Point)

**定義**：刪除後使圖的連通分量數增加的頂點。
- 也稱為「關鍵點」

**應用**：
- 網路關鍵節點
- 故障分析

```
範例：
    0 - 1 - 2
        |
        3

節點 1 是割點（刪除後圖分為 {0} 和 {2, 3}）
```

## Tarjan 演算法核心

### 基本概念

Tarjan 使用兩個時間戳：

1. **dfn[u]** (Discovery Time)：節點 u 的訪問時間戳
2. **low[u]** (Low-link Value)：從 u 出發能到達的最早時間戳

**low[u] 的定義**：
```
low[u] = min(
    dfn[u],                    // u 自己的時間戳
    low[v] (v 是 u 的子節點),  // 子樹能到達的最早時間
    dfn[w] (w 是 u 的回邊)     // 回邊指向的節點
)
```

### SCC 的判斷

如果 `low[u] == dfn[u]`，則 u 是某個 SCC 的根節點。

## 強連通分量 (SCC) 實現

```cpp
class TarjanSCC {
private:
    int n;
    vector<vector<int>> adj;
    vector<int> dfn, low;
    vector<bool> inStack;
    stack<int> stk;
    int timestamp;
    vector<vector<int>> sccs;  // 所有 SCC

    void dfs(int u) {
        dfn[u] = low[u] = ++timestamp;
        stk.push(u);
        inStack[u] = true;

        for (int v : adj[u]) {
            if (dfn[v] == 0) {  // 未訪問
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (inStack[v]) {  // 在棧中（回邊）
                low[u] = min(low[u], dfn[v]);
            }
        }

        // u 是 SCC 的根節點
        if (low[u] == dfn[u]) {
            vector<int> scc;
            int v;
            do {
                v = stk.top();
                stk.pop();
                inStack[v] = false;
                scc.push_back(v);
            } while (v != u);

            sccs.push_back(scc);
        }
    }

public:
    TarjanSCC(int n, vector<vector<int>>& graph)
        : n(n), adj(graph), dfn(n, 0), low(n, 0),
          inStack(n, false), timestamp(0) {}

    vector<vector<int>> findSCCs() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) {
                dfs(i);
            }
        }
        return sccs;
    }
};
```

**關鍵點**：
1. 使用棧維護當前路徑
2. `low[u] == dfn[u]` 時，u 是 SCC 根
3. 彈出棧直到 u，形成一個 SCC

## 橋 (Bridge) 檢測

```cpp
class TarjanBridge {
private:
    int n;
    vector<vector<int>> adj;
    vector<int> dfn, low;
    int timestamp;
    vector<pair<int, int>> bridges;

    void dfs(int u, int parent) {
        dfn[u] = low[u] = ++timestamp;

        for (int v : adj[u]) {
            if (v == parent) continue;  // 跳過父邊

            if (dfn[v] == 0) {  // 未訪問
                dfs(v, u);
                low[u] = min(low[u], low[v]);

                // 判斷是否為橋
                if (low[v] > dfn[u]) {
                    bridges.push_back({u, v});
                }
            } else {  // 已訪問（回邊）
                low[u] = min(low[u], dfn[v]);
            }
        }
    }

public:
    TarjanBridge(int n, vector<vector<int>>& graph)
        : n(n), adj(graph), dfn(n, 0), low(n, 0), timestamp(0) {}

    vector<pair<int, int>> findBridges() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) {
                dfs(i, -1);
            }
        }
        return bridges;
    }
};
```

**橋的條件**：`low[v] > dfn[u]`
- 意味著 v 的子樹無法通過其他路徑回到 u 或更早的節點

## 割點 (Articulation Point) 檢測

```cpp
class TarjanArticulation {
private:
    int n;
    vector<vector<int>> adj;
    vector<int> dfn, low;
    int timestamp;
    vector<int> articulationPoints;

    void dfs(int u, int parent) {
        dfn[u] = low[u] = ++timestamp;
        int children = 0;
        bool isArticulation = false;

        for (int v : adj[u]) {
            if (v == parent) continue;

            if (dfn[v] == 0) {  // 未訪問
                children++;
                dfs(v, u);
                low[u] = min(low[u], low[v]);

                // 割點條件
                if (parent != -1 && low[v] >= dfn[u]) {
                    isArticulation = true;
                }
            } else {  // 已訪問
                low[u] = min(low[u], dfn[v]);
            }
        }

        // 根節點的特殊處理
        if (parent == -1 && children > 1) {
            isArticulation = true;
        }

        if (isArticulation) {
            articulationPoints.push_back(u);
        }
    }

public:
    TarjanArticulation(int n, vector<vector<int>>& graph)
        : n(n), adj(graph), dfn(n, 0), low(n, 0), timestamp(0) {}

    vector<int> findArticulationPoints() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == 0) {
                dfs(i, -1);
            }
        }
        return articulationPoints;
    }
};
```

**割點條件**：
1. **非根節點**：`low[v] >= dfn[u]`（子樹無法繞過 u）
2. **根節點**：有兩個或以上的子樹

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| SCC | O(V + E) | O(V) |
| 橋檢測 | O(V + E) | O(V) |
| 割點檢測 | O(V + E) | O(V) |

都是**線性時間複雜度**，非常高效。

## LeetCode 題目詳解

### 1. [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

**題目**：找出網路中的所有關鍵連接（橋）。

**解法**：Tarjan 橋檢測

```cpp
class Solution {
private:
    vector<int> dfn, low;
    int timestamp = 0;
    vector<vector<int>> bridges;

    void dfs(int u, int parent, vector<vector<int>>& adj) {
        dfn[u] = low[u] = ++timestamp;

        for (int v : adj[u]) {
            if (v == parent) continue;  // 跳過父邊

            if (dfn[v] == 0) {
                dfs(v, u, adj);
                low[u] = min(low[u], low[v]);

                // 橋的判斷
                if (low[v] > dfn[u]) {
                    bridges.push_back({u, v});
                }
            } else {
                low[u] = min(low[u], dfn[v]);
            }
        }
    }

public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
        dfn.resize(n, 0);
        low.resize(n, 0);

        // 建圖
        vector<vector<int>> adj(n);
        for (auto& conn : connections) {
            adj[conn[0]].push_back(conn[1]);
            adj[conn[1]].push_back(conn[0]);
        }

        // Tarjan
        dfs(0, -1, adj);

        return bridges;
    }
};
```

**複雜度**：
- 時間：O(V + E)
- 空間：O(V + E)

### 2. [323. Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

**題目**：計算無向圖的連通分量數。

**解法**：DFS（Tarjan 的簡化版本）

```cpp
class Solution {
private:
    void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited) {
        visited[u] = true;
        for (int v : adj[u]) {
            if (!visited[v]) {
                dfs(v, adj, visited);
            }
        }
    }

public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }

        vector<bool> visited(n, false);
        int count = 0;

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, adj, visited);
                count++;
            }
        }

        return count;
    }
};
```

## 常見陷阱與技巧

### 陷阱

1. **無向圖處理父邊**
   ```cpp
   // 錯誤：會把父邊當作回邊
   if (dfn[v] != 0) {
       low[u] = min(low[u], dfn[v]);
   }

   // 正確：跳過父邊
   if (v == parent) continue;
   ```

2. **橋與割點的條件混淆**
   ```cpp
   // 橋：low[v] > dfn[u] （嚴格大於）
   // 割點：low[v] >= dfn[u] （大於等於）
   ```

3. **根節點的特殊處理**
   ```cpp
   // 割點：根節點需要有兩個以上子樹
   if (parent == -1 && children > 1) {
       isArticulation = true;
   }
   ```

4. **時間戳從 1 開始**
   ```cpp
   // dfn 初始化為 0，時間戳從 1 開始
   dfn[u] = low[u] = ++timestamp;
   ```

### 進階技巧

1. **處理重邊**
   ```cpp
   // 使用邊的 ID 而不是節點判斷父邊
   struct Edge {
       int to, id;
   };

   void dfs(int u, int parentEdgeId) {
       // ...
       if (edge.id == parentEdgeId) continue;
   }
   ```

2. **SCC 縮點**
   ```cpp
   // 將每個 SCC 縮為一個節點，建立 DAG
   vector<int> sccId(n);  // 每個節點所屬的 SCC ID
   // 建立新圖...
   ```

3. **橋雙連通分量**
   ```cpp
   // 刪除所有橋後，剩餘的連通分量
   // 用於分析圖的結構
   ```

## 應用場景

### 強連通分量 (SCC)
- 2-SAT 問題
- 有向圖的結構分析
- 縮點構建 DAG

### 橋 (Bridge)
- 網路關鍵連接
- 單點故障分析
- 橋雙連通分量

### 割點 (Articulation Point)
- 網路脆弱性分析
- 關鍵節點識別
- 點雙連通分量

## 總結

### Tarjan 演算法特點

**優勢**：
- 線性時間 O(V + E)
- 一次 DFS 解決問題
- 實現相對簡單
- 應用廣泛

**核心思想**：
- DFS 遍歷 + 時間戳
- dfn 和 low 的維護
- 棧/回邊的處理

### 三種問題的對比

| 問題 | 圖類型 | 判斷條件 | 應用 |
|------|--------|---------|------|
| SCC | 有向圖 | low[u] == dfn[u] | 結構分析、縮點 |
| 橋 | 無向圖 | low[v] > dfn[u] | 關鍵連接 |
| 割點 | 無向圖 | low[v] >= dfn[u] | 關鍵節點 |

### 實戰建議

1. **理解 low 的含義**：能到達的最早時間戳
2. **注意無向圖的父邊處理**
3. **區分橋和割點的條件**
4. **根節點的特殊處理**（割點）
5. **時間戳從 1 開始**（dfn 初始為 0）

下一章我們將學習最小生成樹 (MST) 的兩個經典演算法：Kruskal 和 Prim。
