---
title: 08-6. SPFA 演算法
order: 6
description: Bellman-Ford 的隊列優化 - Shortest Path Faster Algorithm
tags:
  - graph
  - shortest path
  - SPFA
  - queue optimization
author: Rain Hu
date: '2025-10-30'
draft: false
---

# SPFA (Shortest Path Faster Algorithm)

SPFA (Shortest Path Faster Algorithm) 是 Bellman-Ford 演算法的**隊列優化**版本，由中國學者段凡丁於 1994 年提出。它在平均情況下比 Bellman-Ford 快得多，但最壞時間複雜度仍為 O(VE)。

## 核心概念

### 與 Bellman-Ford 的關係

**Bellman-Ford 的問題**：
- 每輪鬆弛**所有邊**，包括不需要鬆弛的邊
- 浪費大量計算

**SPFA 的改進**：
- 只鬆弛**可能更新的邊**
- 使用隊列維護需要處理的節點

### 核心思想

1. 維護一個隊列，存放距離可能被更新的節點
2. 從隊列取出節點 u，鬆弛其所有出邊
3. 如果鄰居 v 的距離被更新且 v 不在隊列中，將 v 入隊
4. 重複直到隊列為空

**關鍵優化**：
- 只有距離被更新的節點才需要再次處理
- 避免重複處理同一個節點（使用 inQueue 標記）

### 視覺化範例

```
圖結構：
    0 --1--> 1
    |        |
   -1        2
    |        |
    v        v
    2 --3--> 3

SPFA 過程：

初始：dist = [0, ∞, ∞, ∞]
      隊列 = [0]

步驟 1：處理節點 0
       更新 1: dist[1] = 1
       更新 2: dist[2] = -1
       隊列 = [1, 2]

步驟 2：處理節點 1
       更新 3: dist[3] = 3
       隊列 = [2, 3]

步驟 3：處理節點 2
       更新 3: dist[3] = min(3, 2) = 2
       隊列 = [3]（3 已在隊列中）

步驟 4：處理節點 3
       無更新
       隊列 = []（結束）

結果：dist = [0, 1, -1, 2]
```

## 演算法實現

### 標準版本

```cpp
class Solution {
public:
    vector<int> spfa(int n, vector<vector<pair<int, int>>>& graph, int start) {
        vector<int> dist(n, INT_MAX);
        vector<bool> inQueue(n, false);  // 標記是否在隊列中
        dist[start] = 0;

        queue<int> q;
        q.push(start);
        inQueue[start] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inQueue[u] = false;  // 出隊時標記

            // 鬆弛所有出邊
            for (auto [v, w] : graph[u]) {
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;

                    // 如果 v 不在隊列中，入隊
                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return dist;
    }
};
```

### 負環檢測版本

統計每個節點的入隊次數，如果超過 V 次，則存在負環。

```cpp
class Solution {
public:
    // 返回 {dist, hasNegativeCycle}
    pair<vector<int>, bool> spfaWithCycleDetection(
        int n, vector<vector<pair<int, int>>>& graph, int start) {

        vector<int> dist(n, INT_MAX);
        vector<int> count(n, 0);  // 每個節點的入隊次數
        vector<bool> inQueue(n, false);
        dist[start] = 0;

        queue<int> q;
        q.push(start);
        inQueue[start] = true;
        count[start]++;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inQueue[u] = false;

            for (auto [v, w] : graph[u]) {
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;

                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                        count[v]++;

                        // 入隊超過 n 次，存在負環
                        if (count[v] >= n) {
                            return {dist, true};
                        }
                    }
                }
            }
        }

        return {dist, false};
    }
};
```

### SLF 優化 (Small Label First)

優化版 SPFA，使用雙端隊列，將較小距離的節點放在隊首。

```cpp
vector<int> spfaSLF(int n, vector<vector<pair<int, int>>>& graph, int start) {
    vector<int> dist(n, INT_MAX);
    vector<bool> inQueue(n, false);
    dist[start] = 0;

    deque<int> dq;
    dq.push_back(start);
    inQueue[start] = true;

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        inQueue[u] = false;

        for (auto [v, w] : graph[u]) {
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;

                if (!inQueue[v]) {
                    // SLF 優化：較小距離放隊首
                    if (!dq.empty() && dist[v] < dist[dq.front()]) {
                        dq.push_front(v);
                    } else {
                        dq.push_back(v);
                    }
                    inQueue[v] = true;
                }
            }
        }
    }

    return dist;
}
```

## 複雜度分析

| 情況 | 時間複雜度 | 說明 |
|------|-----------|------|
| 平均情況 | O(kE) | k 為常數（通常 2-3） |
| 最壞情況 | O(VE) | 退化為 Bellman-Ford |
| 負環檢測 | O(VE) | 最多 V 輪 |

**空間複雜度**：O(V)

**實際表現**：
- 隨機圖：接近 O(E)
- 稠密圖：接近 O(V²)
- 特殊構造的圖：可能達到 O(VE)

## SPFA 的死法

SPFA 在某些特殊構造的圖上會退化到 O(VE)，被稱為「SPFA 的死法」。

```cpp
// 構造最壞情況：
// 0 -> 1 -> 2 -> ... -> n-1
// 每條邊權重 = -1
// 這樣每個節點都會被處理 n 次
```

**現狀**：
- 由於存在卡 SPFA 的數據，許多競賽已不推薦使用
- LeetCode 題目通常不會卡 SPFA

## LeetCode 題目詳解

### 1. [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**題目**：找出最多經過 k 站的最便宜航班。

**解法**：SPFA 變體（限制步數）

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights,
                          int src, int dst, int k) {
        // 建圖
        vector<vector<pair<int, int>>> graph(n);
        for (auto& f : flights) {
            graph[f[0]].push_back({f[1], f[2]});
        }

        // dist[i] 表示到達節點 i 的最小費用
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;

        // 隊列：{節點, 當前費用, 已用步數}
        queue<tuple<int, int, int>> q;
        q.push({src, 0, 0});

        while (!q.empty()) {
            auto [u, cost, stops] = q.front();
            q.pop();

            // 超過步數限制
            if (stops > k) continue;

            for (auto [v, w] : graph[u]) {
                int newCost = cost + w;
                // 如果找到更便宜的路徑，更新
                if (newCost < dist[v]) {
                    dist[v] = newCost;
                    q.push({v, newCost, stops + 1});
                }
            }
        }

        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};
```

**複雜度**：
- 時間：O(E × k)
- 空間：O(V)

### 2. 標準最短路徑問題

SPFA 可以用於任何 Bellman-Ford 能解決的問題。

```cpp
class Solution {
public:
    int shortestPath(int n, vector<vector<int>>& edges, int src, int dst) {
        // 建圖
        vector<vector<pair<int, int>>> graph(n);
        for (auto& e : edges) {
            graph[e[0]].push_back({e[1], e[2]});
        }

        // SPFA
        vector<int> dist(n, INT_MAX);
        vector<bool> inQueue(n, false);
        dist[src] = 0;

        queue<int> q;
        q.push(src);
        inQueue[src] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inQueue[u] = false;

            for (auto [v, w] : graph[u]) {
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};
```

## 常見陷阱與技巧

### 陷阱

1. **忘記標記 inQueue**
   ```cpp
   // 錯誤：可能重複入隊
   q.push(v);

   // 正確：標記後再入隊
   if (!inQueue[v]) {
       q.push(v);
       inQueue[v] = true;
   }
   ```

2. **出隊時忘記清除標記**
   ```cpp
   int u = q.front();
   q.pop();
   inQueue[u] = false;  // 必須清除！
   ```

3. **負環檢測條件錯誤**
   ```cpp
   // 正確：入隊次數 >= n
   if (count[v] >= n) {
       return true;  // 有負環
   }
   ```

4. **INT_MAX 溢位**
   ```cpp
   // 錯誤：溢位
   if (dist[u] + w < dist[v]) { ... }

   // 正確：先檢查
   if (dist[u] != INT_MAX && dist[u] + w < dist[v]) { ... }
   ```

### 進階技巧

1. **提前終止（找到目標節點）**
   ```cpp
   if (u == dst && dist[u] != INT_MAX) {
       return dist[u];
   }
   ```

2. **雙端隊列優化 (SLF)**
   ```cpp
   if (dist[v] < dist[dq.front()]) {
       dq.push_front(v);  // 距離小的放前面
   } else {
       dq.push_back(v);
   }
   ```

3. **LLL 優化 (Large Label Last)**
   ```cpp
   // 只有距離小於平均值的節點才處理
   double avg = accumulate(dist.begin(), dist.end(), 0.0) / n;
   if (dist[u] < avg) {
       // 處理節點 u
   }
   ```

## 最短路徑演算法比較

| 演算法 | 時間複雜度 | 負權邊 | 適用場景 |
|--------|-----------|--------|---------|
| BFS | O(V+E) | 不支持 | 無權圖 |
| Dijkstra | O((V+E) log V) | 不支持 | 非負權重，效率優先 |
| Bellman-Ford | O(VE) | 支持 | 負權邊，需要負環檢測 |
| **SPFA** | **O(kE) ~ O(VE)** | **支持** | **負權邊，平均較快** |
| Floyd-Warshall | O(V³) | 支持 | 全源最短路徑 |

## 選擇建議

```
決策樹：

有負權邊？
├─ 否 → Dijkstra（最快）
└─ 是 ↓
   全源最短路徑？
   ├─ 是 → Floyd-Warshall
   └─ 否 ↓
      擔心被卡？
      ├─ 是 → Bellman-Ford（穩定）
      └─ 否 → SPFA（平均快）
```

## 總結

### SPFA 特點

**優勢**：
- 平均性能優於 Bellman-Ford
- 支持負權邊
- 可以檢測負環
- 實現簡單

**劣勢**：
- 最壞情況 O(VE)
- 存在卡 SPFA 的數據
- 競賽中已較少使用

### 適用場景

- **LeetCode 題目**：通常可以使用（不會卡）
- **競賽**：謹慎使用，優先 Dijkstra 或 Bellman-Ford
- **實際應用**：隨機圖表現優秀

### 實戰建議

1. **LeetCode**：可以放心使用 SPFA
2. **模板**：記住標準模板和 inQueue 處理
3. **優化**：了解 SLF 優化，但標準版本已足夠
4. **負環**：理解負環檢測的原理
5. **選擇**：無負權邊優先 Dijkstra

下一章我們將學習 Floyd-Warshall 演算法，解決全源最短路徑問題。
