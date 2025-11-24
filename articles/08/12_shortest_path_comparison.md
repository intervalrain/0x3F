---
title: 08-12. 最短路徑算法比較：四種解法實戰
order: 12
description: 透過 LeetCode 1334 題比較 Floyd-Warshall、Dijkstra、SPFA、Bellman-Ford 四種最短路徑算法的性能差異
tags:
  - graph
  - shortest path
  - floyd-warshall
  - dijkstra
  - spfa
  - bellman-ford
  - comparison
author: Rain Hu
date: '2025-10-15'
draft: false
subscription: member
---

# 最短路徑算法比較：四種解法實戰

## 題目：Find the City With the Smallest Number of Neighbors at a Threshold Distance

[LeetCode 1334](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

給定 `n` 個城市和一些邊,找出在距離閾值內可到達城市數量最少的城市。如果有多個答案,返回編號最大的城市。

## 解題思路

這道題需要計算所有城市對之間的最短距離,然後統計每個城市在閾值內能到達的城市數量。

由於需要求**所有點對**的最短路徑,我們可以:
1. 使用 Floyd-Warshall 一次性計算所有點對最短路
2. 或對每個起點跑一次單源最短路 (Dijkstra/SPFA/Bellman-Ford)

## 性能比較

在相同測試數據下的運行時間:
- **Floyd-Warshall**: 14ms (最快)
- **Dijkstra**: 32ms
- **SPFA**: 64ms
- **Bellman-Ford**: 251ms (最慢)

## C++ 完整實現

```cpp
class Solution {
public:
    int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
        const int INF = 1e9 + 7;

        // 初始化鄰接表和距離矩陣
        vector<vector<pair<int, int>>> adj(n);
        vector<vector<int>> dist(n, vector<int>(n, INF));

        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        // 建立鄰接表
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            adj[u].push_back({v, w});
            adj[v].push_back({u, w});
        }

        // 選擇一種算法計算最短路徑
        // floyd(n, dist, edges);

        for (int i = 0; i < n; i++) {
            dijkstra(n, adj, dist[i], i);
            // spfa(n, adj, dist[i], i);
            // bellman(n, edges, dist[i], i);
        }

        // 統計每個城市能到達的城市數量
        int minCity = -1;
        int minCount = n;

        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (i != j && dist[i][j] <= distanceThreshold) {
                    count++;
                }
            }
            // 注意: <= 確保選擇編號最大的城市
            if (count <= minCount) {
                minCount = count;
                minCity = i;
            }
        }

        return minCity;
    }

private:
    // 方法 1: Floyd-Warshall (14ms) - 最快
    void floyd(int n, vector<vector<int>>& dist, vector<vector<int>>& edges) {
        // 先填充直接相連的邊
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            dist[u][v] = w;
            dist[v][u] = w;
        }

        // 三層循環: k 必須在最外層
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    // 方法 2: Dijkstra (32ms) - 次快
    void dijkstra(int n, vector<vector<pair<int, int>>>& adj,
                  vector<int>& dist, int src) {
        priority_queue<pair<int, int>, vector<pair<int, int>>,
                       greater<pair<int, int>>> pq;
        pq.push({0, src});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();

            // 剪枝: 如果當前距離已經過時,跳過
            if (d > dist[u]) continue;

            for (auto [v, w] : adj[u]) {
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }
    }

    // 方法 3: SPFA (64ms) - 較慢
    void spfa(int n, vector<vector<pair<int, int>>>& adj,
              vector<int>& dist, int src) {
        deque<int> q;
        vector<int> updateCount(n, 0);
        q.push_back(src);

        while (!q.empty()) {
            int u = q.front();
            q.pop_front();

            for (auto [v, w] : adj[u]) {
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    updateCount[v]++;
                    q.push_back(v);

                    // 負環檢測 (本題用不到)
                    if (updateCount[v] > n) {
                        // 存在負環
                        return;
                    }
                }
            }
        }
    }

    // 方法 4: Bellman-Ford (251ms) - 最慢
    void bellman(int n, vector<vector<int>>& edges,
                 vector<int>& dist, int src) {
        // 鬆弛 n-1 輪
        for (int k = 1; k < n; k++) {
            for (auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];

                // 無向圖需要雙向更新
                if (dist[u] > dist[v] + w) {
                    dist[u] = dist[v] + w;
                }
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                }
            }
        }
    }
};
```

## 算法選擇指南

### 1. Floyd-Warshall
- **適用**: 稠密圖、需要所有點對最短路
- **時間複雜度**: O(n³)
- **空間複雜度**: O(n²)
- **優點**: 實現簡單、常數小、本題最快
- **缺點**: 不適合大規模圖 (n > 500)

### 2. Dijkstra
- **適用**: 非負權重、稀疏圖
- **時間複雜度**: O((V + E) log V) × n = O(n² log n + mn log n)
- **空間複雜度**: O(V + E)
- **優點**: 適合大規模稀疏圖
- **缺點**: 不能處理負權邊

### 3. SPFA
- **適用**: 可能有負權邊 (但無負環)
- **時間複雜度**: 平均 O(kE),最壞 O(VE)
- **空間複雜度**: O(V + E)
- **優點**: 可處理負權邊、實現簡單
- **缺點**: 最壞情況退化嚴重

### 4. Bellman-Ford
- **適用**: 有負權邊、需要檢測負環
- **時間複雜度**: O(VE)
- **空間複雜度**: O(V)
- **優點**: 可檢測負環、最穩定
- **缺點**: 速度最慢

## 本題最佳方案

對於這道題:
- 城市數量 n ≤ 100 (小規模)
- 邊數 m ≤ n(n-1)/2 (可能是稠密圖)
- 所有權重為正
- 需要所有點對最短路

**推薦使用 Floyd-Warshall**:
1. 一次性求出所有點對最短路,代碼最簡潔
2. 對於 n ≤ 100 的規模,O(n³) 完全可接受
3. 實測性能最優 (14ms)

## 複雜度分析

| 算法 | 時間複雜度 | 空間複雜度 | 實測時間 |
|-----|-----------|-----------|---------|
| Floyd-Warshall | O(n³) | O(n²) | 14ms |
| Dijkstra × n | O(n² log n + mn log n) | O(m + n) | 32ms |
| SPFA × n | O(kmn) | O(m + n) | 64ms |
| Bellman-Ford × n | O(n²m) | O(m + n) | 251ms |

## 關鍵技巧

1. **Floyd 初始化**: 必須先設置 `dist[i][i] = 0` 和直接相連的邊
2. **Dijkstra 剪枝**: 使用 `if (d > dist[u]) continue` 避免處理過時狀態
3. **SPFA 負環檢測**: 記錄更新次數 `> n` 表示有負環
4. **Bellman-Ford 無向圖**: 需要雙向更新距離
5. **結果統計**: 使用 `<=` 確保選擇編號最大的城市

## 相關題目

- [LeetCode 743. Network Delay Time](https://leetcode.com/problems/network-delay-time/) - 單源最短路
- [LeetCode 787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) - 帶限制的最短路
- [LeetCode 1976. Number of Ways to Arrive at Destination](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/) - 最短路計數
