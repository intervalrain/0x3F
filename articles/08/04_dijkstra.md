---
title: 08-4. Dijkstra 最短路徑演算法
order: 4
description: 單源最短路徑的貪心演算法
tags:
  - graph
  - shortest path
  - dijkstra
  - greedy
  - priority queue
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Dijkstra 最短路徑演算法

Dijkstra 演算法是解決**單源最短路徑 (Single-Source Shortest Path)** 問題的經典貪心演算法，由荷蘭計算機科學家 Edsger Dijkstra 於 1956 年提出。

## 核心概念

### 問題定義

給定帶權重的有向圖，找出從**源點 (source)** 到所有其他頂點的最短路徑。

**限制**：邊的權重必須**非負** (≥ 0)。

### 基本思想

採用**貪心策略**：
1. 維護一個距離陣列 `dist[]`，初始化源點距離為 0，其他為無窮大
2. 每次選擇**距離最小且未確定**的節點
3. 用該節點更新（鬆弛）其鄰居的距離
4. 重複直到所有節點都被確定

### 視覺化範例

```
圖結構（權重）：
    0 --4--> 1
    |        |
    1        3
    |        |
    v        v
    2 --2--> 3

從節點 0 出發：

初始：dist = [0, ∞, ∞, ∞]

步驟 1：選擇節點 0（dist=0）
       更新鄰居：dist = [0, 4, 1, ∞]

步驟 2：選擇節點 2（dist=1）
       更新鄰居：dist = [0, 4, 1, 3]

步驟 3：選擇節點 3（dist=3）
       無更新：  dist = [0, 4, 1, 3]

步驟 4：選擇節點 1（dist=4）
       無更新：  dist = [0, 4, 1, 3]

最終結果：0→1 最短距離=4，0→2=1，0→3=3
```

## 演算法實現

### 標準版本（使用 Priority Queue）

```cpp
class Solution {
public:
    // 返回從 start 到所有節點的最短距離
    vector<int> dijkstra(int n, vector<vector<pair<int, int>>>& graph, int start) {
        vector<int> dist(n, INT_MAX);
        dist[start] = 0;

        // 小根堆：{距離, 節點}
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();

            // 如果當前距離已經不是最短距離，跳過
            if (d > dist[u]) continue;

            // 鬆弛操作：更新鄰居的距離
            for (auto [v, w] : graph[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }

        return dist;
    }
};
```

### 完整模板（常用於 LeetCode）

```cpp
class Solution {
public:
    int dijkstra(int n, vector<vector<pair<int, int>>>& graph, int start, int end) {
        vector<int> dist(n, INT_MAX);
        dist[start] = 0;

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();

            // 提前終止：已找到目標節點的最短路徑
            if (u == end) return d;

            // 跳過過期的距離
            if (d > dist[u]) continue;

            for (auto [v, w] : graph[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }

        return dist[end] == INT_MAX ? -1 : dist[end];
    }
};
```

### 關鍵點解析

1. **為什麼用 Priority Queue？**
   - 每次需要選擇距離最小的節點
   - 小根堆可以在 O(log V) 時間內取出最小值

2. **為什麼要檢查 `d > dist[u]`？**
   - 同一個節點可能多次入隊（距離更新時）
   - 只處理最短距離的那次

3. **鬆弛操作 (Relaxation)**
   ```cpp
   if (dist[u] + w < dist[v]) {
       dist[v] = dist[u] + w;  // 更新更短的路徑
   }
   ```

## 複雜度分析

| 實現方式 | 時間複雜度 | 空間複雜度 |
|---------|-----------|-----------|
| 樸素版本（遍歷找最小） | O(V²) | O(V) |
| 二元堆 (Binary Heap) | O((V+E) log V) | O(V) |
| 斐波那契堆 | O(E + V log V) | O(V) |

**LeetCode 常用**：二元堆版本（C++ 的 `priority_queue`）

- **時間**：O((V+E) log V)
  - 每個節點最多入隊 V 次
  - 每次入隊/出隊 O(log V)
  - 總共處理 E 條邊

- **空間**：O(V + E)
  - dist 陣列：O(V)
  - 圖的存儲：O(V + E)
  - 優先隊列：O(V)

## LeetCode 題目詳解

### 1. [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**題目**：給定網路延遲時間，計算信號從節點 k 傳播到所有節點的最短時間。

**解法**：標準 Dijkstra

```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // 建圖：graph[u] = {{v1, w1}, {v2, w2}, ...}
        vector<vector<pair<int, int>>> graph(n + 1);
        for (auto& t : times) {
            graph[t[0]].push_back({t[1], t[2]});
        }

        // Dijkstra
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        pq.push({0, k});

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

        // 找最大距離（所有節點都收到信號的時間）
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) return -1;  // 有節點無法到達
            maxDist = max(maxDist, dist[i]);
        }

        return maxDist;
    }
};
```

**複雜度**：
- 時間：O((V+E) log V)
- 空間：O(V + E)

### 2. [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**題目**：找出最多經過 k 站的最便宜航班。

**解法**：修改版 Dijkstra（增加步數限制）

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // 建圖
        vector<vector<pair<int, int>>> graph(n);
        for (auto& f : flights) {
            graph[f[0]].push_back({f[1], f[2]});
        }

        // dist[i] 表示到達節點 i 的最小費用
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;

        // 優先隊列：{費用, {節點, 已用步數}}
        priority_queue<tuple<int, int, int>,
                       vector<tuple<int, int, int>>,
                       greater<>> pq;
        pq.push({0, src, 0});

        while (!pq.empty()) {
            auto [cost, u, stops] = pq.top();
            pq.pop();

            // 到達目標
            if (u == dst) return cost;

            // 超過步數限制
            if (stops > k) continue;

            // 鬆弛操作
            for (auto [v, w] : graph[u]) {
                int newCost = cost + w;
                // 注意：這裡不能用 dist[v] 過濾，因為可能用更多步數得到更小費用
                if (newCost < dist[v]) {
                    dist[v] = newCost;
                    pq.push({newCost, v, stops + 1});
                }
            }
        }

        return -1;
    }
};
```

**關鍵修改**：
- 優先隊列中加入步數信息
- 不能簡單用 `dist[v]` 過濾（步數限制下可能有多條路徑）

**複雜度**：
- 時間：O((V+E) × k × log(V×k))
- 空間：O(V + E)

### 3. [1514. Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/)

**題目**：找出從起點到終點成功率最高的路徑。

**解法**：最大化問題的 Dijkstra

```cpp
class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges,
                          vector<double>& succProb, int start, int end) {
        // 建圖
        vector<vector<pair<int, double>>> graph(n);
        for (int i = 0; i < edges.size(); i++) {
            int u = edges[i][0], v = edges[i][1];
            double prob = succProb[i];
            graph[u].push_back({v, prob});
            graph[v].push_back({u, prob});
        }

        // prob[i] 表示到達節點 i 的最大概率
        vector<double> prob(n, 0.0);
        prob[start] = 1.0;

        // 大根堆（最大化概率）
        priority_queue<pair<double, int>> pq;
        pq.push({1.0, start});

        while (!pq.empty()) {
            auto [p, u] = pq.top();
            pq.pop();

            if (u == end) return p;
            if (p < prob[u]) continue;

            for (auto [v, edgeProb] : graph[u]) {
                double newProb = p * edgeProb;
                if (newProb > prob[v]) {
                    prob[v] = newProb;
                    pq.push({newProb, v});
                }
            }
        }

        return 0.0;
    }
};
```

**關鍵修改**：
- 使用大根堆（最大化概率）
- 初始化為 0（概率最小值）
- 起點概率為 1.0
- 更新條件改為 `newProb > prob[v]`

**複雜度**：
- 時間：O((V+E) log V)
- 空間：O(V + E)

### 4. [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

**題目**：找出從左上角到右下角的路徑，使得相鄰格子高度差的最大值最小。

**解法**：Dijkstra 變體（最小化最大值）

```cpp
class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();

        // effort[i][j] 表示到達 (i,j) 的最小 effort
        vector<vector<int>> effort(m, vector<int>(n, INT_MAX));
        effort[0][0] = 0;

        // 優先隊列：{effort, {i, j}}
        priority_queue<tuple<int, int, int>,
                       vector<tuple<int, int, int>>,
                       greater<>> pq;
        pq.push({0, 0, 0});

        int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

        while (!pq.empty()) {
            auto [eff, i, j] = pq.top();
            pq.pop();

            if (i == m - 1 && j == n - 1) return eff;
            if (eff > effort[i][j]) continue;

            for (auto& dir : dirs) {
                int ni = i + dir[0];
                int nj = j + dir[1];

                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    int newEffort = max(eff, abs(heights[ni][nj] - heights[i][j]));
                    if (newEffort < effort[ni][nj]) {
                        effort[ni][nj] = newEffort;
                        pq.push({newEffort, ni, nj});
                    }
                }
            }
        }

        return 0;
    }
};
```

**關鍵修改**：
- 距離更新公式：`max(當前effort, 高度差)`
- 目標：最小化路徑上的最大 effort

**複雜度**：
- 時間：O(m × n × log(m×n))
- 空間：O(m × n)

## 常見陷阱與技巧

### 陷阱

1. **負權邊**
   ```cpp
   // Dijkstra 不能處理負權邊！
   // 如果有負權邊，使用 Bellman-Ford
   ```

2. **忘記檢查過期距離**
   ```cpp
   // 錯誤：會重複處理同一節點
   auto [d, u] = pq.top();
   pq.pop();
   // 處理...

   // 正確：跳過過期距離
   if (d > dist[u]) continue;
   ```

3. **優先隊列順序錯誤**
   ```cpp
   // 錯誤：大根堆
   priority_queue<pair<int, int>> pq;

   // 正確：小根堆（距離最小優先）
   priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
   ```

4. **節點編號從 0 還是 1 開始**
   ```cpp
   // 根據題目調整陣列大小
   vector<vector<pair<int, int>>> graph(n);      // 0-indexed
   vector<vector<pair<int, int>>> graph(n + 1);  // 1-indexed
   ```

### 進階技巧

1. **提前終止（找單一目標）**
   ```cpp
   if (u == end) return dist[u];
   ```

2. **記錄路徑**
   ```cpp
   vector<int> parent(n, -1);

   // 更新距離時記錄父節點
   if (dist[u] + w < dist[v]) {
       dist[v] = dist[u] + w;
       parent[v] = u;
       pq.push({dist[v], v});
   }

   // 重建路徑
   vector<int> path;
   for (int v = end; v != -1; v = parent[v]) {
       path.push_back(v);
   }
   reverse(path.begin(), path.end());
   ```

3. **多源最短路徑**
   ```cpp
   // 將所有源點同時加入優先隊列
   for (int src : sources) {
       dist[src] = 0;
       pq.push({0, src});
   }
   ```

4. **雙向 Dijkstra**
   ```cpp
   // 從起點和終點同時搜尋，相遇時結束
   // 適用於點對點最短路徑，可以減少搜尋空間
   ```

## Dijkstra vs 其他演算法

| 演算法 | 時間複雜度 | 負權邊 | 適用場景 |
|--------|-----------|--------|---------|
| Dijkstra | O((V+E) log V) | 不支持 | 非負權重，單源最短路徑 |
| Bellman-Ford | O(VE) | 支持 | 有負權邊，檢測負環 |
| SPFA | O(kE) | 支持 | 負權邊，平均較快 |
| Floyd-Warshall | O(V³) | 支持 | 全源最短路徑 |
| BFS | O(V+E) | - | 無權圖（所有邊權重=1） |

## 總結

### Dijkstra 適用場景

1. **非負權重的有向/無向圖**
2. **單源最短路徑**（從一個點到所有點）
3. **點對點最短路徑**（提前終止優化）
4. **需要快速求解**（相比 Bellman-Ford）

### 實戰建議

1. **模板化**：記住標準模板，靈活應用
2. **圖的構建**：正確處理邊的方向和權重
3. **優先隊列**：使用小根堆（`greater<>`）
4. **過期檢查**：`if (d > dist[u]) continue`
5. **變體問題**：理解核心思想，修改更新規則

下一章我們將學習 Bellman-Ford 演算法，它可以處理負權邊並檢測負環。
