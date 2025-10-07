---
title: "Bellman-Ford 演算法"
order: 5
description: "支援負權邊的單源最短路徑演算法"
tags: ["graph", "shortest path", "bellman-ford", "negative edge", "dynamic programming"]
---

# Bellman-Ford 演算法

Bellman-Ford 演算法是另一種解決**單源最短路徑**問題的演算法，與 Dijkstra 的主要區別在於它可以處理**負權邊**，並且能夠**檢測負環**。

## 核心概念

### 問題定義

給定帶權重的有向圖（可能有負權邊），找出從源點到所有其他頂點的最短路徑。

**優勢**：
- 支持負權邊
- 可以檢測負環（存在負環時無最短路徑）

**劣勢**：
- 時間複雜度較高：O(VE)

### 基本思想

採用**動態規劃**的思想：
1. 初始化距離陣列，源點為 0，其他為無窮大
2. **鬆弛所有邊 V-1 次**（V 為頂點數）
3. 檢查是否存在負環（再鬆弛一次，若有更新則有負環）

**核心洞察**：
- 最短路徑最多包含 V-1 條邊（V 個頂點）
- 因此鬆弛 V-1 次後，所有最短路徑都會被找到

### 鬆弛操作 (Relaxation)

```cpp
// 如果經過邊 (u, v) 可以得到更短的路徑，則更新
if (dist[u] + weight(u, v) < dist[v]) {
    dist[v] = dist[u] + weight(u, v);
}
```

### 視覺化範例

```
圖結構（含負權邊）：
    0 --1--> 1
    |        |
   -1        2
    |        |
    v        v
    2 --3--> 3

從節點 0 出發：

初始：dist = [0, ∞, ∞, ∞]

第 1 輪鬆弛（所有邊）：
  邊 0→1: dist[1] = 0+1 = 1
  邊 0→2: dist[2] = 0+(-1) = -1
  邊 1→3: dist[3] = 1+2 = 3
  邊 2→3: dist[3] = min(3, -1+3) = 2
  結果：dist = [0, 1, -1, 2]

第 2 輪鬆弛：
  邊 0→1: 無更新
  邊 0→2: 無更新
  邊 1→3: 無更新
  邊 2→3: 無更新
  結果：dist = [0, 1, -1, 2]（已收斂）

第 3 輪：無更新（已是最短路徑）
```

## 演算法實現

### 標準版本

```cpp
class Solution {
public:
    // 返回從 start 到所有節點的最短距離
    // 如果存在負環，返回空陣列
    vector<int> bellmanFord(int n, vector<vector<int>>& edges, int start) {
        vector<int> dist(n, INT_MAX);
        dist[start] = 0;

        // 鬆弛 n-1 次
        for (int i = 0; i < n - 1; i++) {
            for (auto& e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        // 檢測負環：再鬆弛一次
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                return {};  // 存在負環
            }
        }

        return dist;
    }
};
```

### 優化版本（提前終止）

如果某一輪沒有任何更新，可以提前終止。

```cpp
vector<int> bellmanFordOptimized(int n, vector<vector<int>>& edges, int start) {
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    for (int i = 0; i < n - 1; i++) {
        bool updated = false;

        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }

        // 沒有更新，提前終止
        if (!updated) break;
    }

    // 檢測負環
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            return {};
        }
    }

    return dist;
}
```

## 複雜度分析

| 操作 | 時間複雜度 | 說明 |
|------|-----------|------|
| 初始化 | O(V) | 設定初始距離 |
| 鬆弛操作 | O(VE) | V-1 輪，每輪 E 條邊 |
| 負環檢測 | O(E) | 額外一輪鬆弛 |
| **總計** | **O(VE)** | |

**空間複雜度**：O(V)

## 為什麼鬆弛 V-1 次？

**證明**：
1. 最短路徑最多包含 V-1 條邊（V 個頂點，無環）
2. 第 k 輪鬆弛後，保證所有**最多 k 條邊**的最短路徑都被找到
3. 因此 V-1 輪後，所有最短路徑都被找到

```
範例：
0 → 1 → 2 → 3

第 1 輪：找到 0→1
第 2 輪：找到 0→1→2
第 3 輪：找到 0→1→2→3
```

## 負環檢測

**負環 (Negative Cycle)**：環上所有邊的權重和為負數。

**為什麼負環導致無最短路徑？**
- 可以無限循環負環，距離不斷減小
- 理論上最短距離為 -∞

**檢測方法**：
- 在 V-1 輪鬆弛後，再鬆弛一次
- 如果仍有距離更新，則存在負環

```cpp
// 第 V 輪鬆弛（檢測負環）
for (auto& e : edges) {
    int u = e[0], v = e[1], w = e[2];
    if (dist[u] + w < dist[v]) {
        // 仍可更新 => 存在負環
        return true;
    }
}
```

## LeetCode 題目詳解

### 1. [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**題目**：找出最多經過 k 站的最便宜航班。

**解法**：修改版 Bellman-Ford（限制鬆弛次數）

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights,
                          int src, int dst, int k) {
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;

        // 最多 k+1 次鬆弛（k 站 = k+1 條邊）
        for (int i = 0; i <= k; i++) {
            vector<int> temp = dist;  // 使用臨時陣列避免同一輪內的影響

            for (auto& f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != INT_MAX) {
                    temp[v] = min(temp[v], dist[u] + w);
                }
            }

            dist = temp;
        }

        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};
```

**關鍵點**：
1. 鬆弛 k+1 次（最多 k 站）
2. 使用臨時陣列 `temp`，避免同一輪內的連鎖更新

**複雜度**：
- 時間：O(k × E)
- 空間：O(V)

### 2. [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**題目**：網路延遲時間（可用 Dijkstra 或 Bellman-Ford）。

**解法**：Bellman-Ford

```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;

        // 鬆弛 n-1 次
        for (int i = 0; i < n - 1; i++) {
            for (auto& t : times) {
                int u = t[0], v = t[1], w = t[2];
                if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        // 找最大距離
        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) return -1;
            maxDist = max(maxDist, dist[i]);
        }

        return maxDist;
    }
};
```

**複雜度**：
- 時間：O(V × E)
- 空間：O(V)

**對比 Dijkstra**：
- Dijkstra：O((V+E) log V)，更快
- Bellman-Ford：O(VE)，但支持負權邊

## 常見陷阱與技巧

### 陷阱

1. **忘記檢查 INT_MAX**
   ```cpp
   // 錯誤：INT_MAX + w 會溢位
   if (dist[u] + w < dist[v]) { ... }

   // 正確：先檢查 INT_MAX
   if (dist[u] != INT_MAX && dist[u] + w < dist[v]) { ... }
   ```

2. **負環檢測不完整**
   ```cpp
   // 必須在 V-1 輪鬆弛後再檢測
   for (int i = 0; i < n - 1; i++) { /* 鬆弛 */ }
   // 然後才檢測負環
   ```

3. **限制步數時使用同一陣列**
   ```cpp
   // 錯誤：同一輪內會產生連鎖更新
   dist[v] = min(dist[v], dist[u] + w);

   // 正確：使用臨時陣列
   vector<int> temp = dist;
   temp[v] = min(temp[v], dist[u] + w);
   dist = temp;
   ```

4. **無向圖處理**
   ```cpp
   // 無向圖需要加兩條邊
   edges.push_back({u, v, w});
   edges.push_back({v, u, w});
   ```

### 進階技巧

1. **提前終止優化**
   ```cpp
   bool updated = false;
   for (auto& e : edges) {
       if (/* 鬆弛成功 */) {
           updated = true;
       }
   }
   if (!updated) break;  // 提前終止
   ```

2. **記錄負環中的節點**
   ```cpp
   vector<bool> inNegCycle(n, false);

   // 標記負環影響的節點
   for (int i = 0; i < n; i++) {
       for (auto& e : edges) {
           int u = e[0], v = e[1], w = e[2];
           if (dist[u] + w < dist[v]) {
               dist[v] = dist[u] + w;
               inNegCycle[v] = true;
           }
           if (inNegCycle[u]) {
               inNegCycle[v] = true;
           }
       }
   }
   ```

3. **記錄路徑**
   ```cpp
   vector<int> parent(n, -1);

   if (dist[u] + w < dist[v]) {
       dist[v] = dist[u] + w;
       parent[v] = u;  // 記錄前驅
   }
   ```

## Bellman-Ford vs Dijkstra

| 特性 | Bellman-Ford | Dijkstra |
|------|-------------|----------|
| 時間複雜度 | O(VE) | O((V+E) log V) |
| 負權邊 | 支持 | 不支持 |
| 負環檢測 | 支持 | 不支持 |
| 實現難度 | 簡單 | 中等 |
| 適用場景 | 負權邊、負環檢測 | 非負權重、效率優先 |

**選擇建議**：
- 有負權邊 → Bellman-Ford 或 SPFA
- 全是非負權重 → Dijkstra（更快）
- 需要檢測負環 → Bellman-Ford
- 需要限制步數 → Bellman-Ford（容易修改）

## 總結

### Bellman-Ford 特點

1. **優勢**：
   - 支持負權邊
   - 可以檢測負環
   - 實現簡單
   - 容易修改（如限制步數）

2. **劣勢**：
   - 時間複雜度較高 O(VE)
   - 不如 Dijkstra 高效（無負權邊時）

3. **核心思想**：
   - 動態規劃
   - 鬆弛操作
   - V-1 輪迭代

### 適用場景

- 圖中有**負權邊**
- 需要**檢測負環**
- 需要**限制路徑長度**（步數）
- 邊數較少時（E 較小）

### 實戰建議

1. 記住標準模板，理解鬆弛操作
2. 注意 INT_MAX 的溢位問題
3. 限制步數時使用臨時陣列
4. 理解為什麼鬆弛 V-1 次
5. 掌握負環檢測方法

下一章我們將學習 SPFA (Shortest Path Faster Algorithm)，它是 Bellman-Ford 的隊列優化版本，平均性能更好。
