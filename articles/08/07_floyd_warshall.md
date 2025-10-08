---
title: 08-7. Floyd-Warshall 演算法
order: 7
description: 全源最短路徑的動態規劃解法
tags:
  - graph
  - shortest path
  - floyd-warshall
  - all-pairs
  - dynamic programming
author: Rain Hu
date: ''
draft: true
---

# Floyd-Warshall 演算法

Floyd-Warshall 演算法是解決**全源最短路徑 (All-Pairs Shortest Path)** 問題的經典動態規劃演算法,可以一次計算出圖中任意兩點之間的最短距離。

## 核心概念

### 問題定義

給定帶權重的有向圖（可能有負權邊），找出**所有節點對**之間的最短路徑。

**輸入**：圖的鄰接矩陣
**輸出**：dist[i][j] 表示從節點 i 到節點 j 的最短距離

### 基本思想

採用**動態規劃**：
- **狀態定義**：`dist[k][i][j]` 表示「只使用節點 0~k 作為中間節點」時，從 i 到 j 的最短距離
- **狀態轉移**：
  ```
  dist[k][i][j] = min(
      dist[k-1][i][j],           // 不經過節點 k
      dist[k-1][i][k] + dist[k-1][k][j]  // 經過節點 k
  )
  ```
- **空間優化**：可以滾動陣列優化為二維

### 核心洞察

**為什麼這樣可行？**
- 最短路徑可能經過某些中間節點
- 依次考慮每個節點作為中間節點
- 第 k 輪後，保證找到「可以使用節點 0~k 的最短路徑」
- n 輪後，可以使用所有節點，即為最終最短路徑

### 視覺化範例

```
圖結構（鄰接矩陣）：
     0   1   2   3
0 [  0   3  ∞   7 ]
1 [  8   0   2  ∞ ]
2 [  5  ∞   0   1 ]
3 [  2  ∞  ∞   0 ]

初始狀態（k=-1，不使用中間節點）：
dist = graph

第 1 輪（k=0，可使用節點 0）：
更新 dist[1][2]：經過 0？min(2, 8+3) = 2（不更新）
更新 dist[1][3]：經過 0？min(∞, 8+7) = 15
更新 dist[2][1]：經過 0？min(∞, 5+3) = 8
更新 dist[2][3]：經過 0？min(1, 5+7) = 1（不更新）
更新 dist[3][1]：經過 0？min(∞, 2+3) = 5
更新 dist[3][2]：經過 0？min(∞, 2+∞) = ∞（不更新）

繼續迭代直到 k=3...
```

## 演算法實現

### 標準版本（三層迴圈）

```cpp
class Solution {
public:
    vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<vector<int>> dist = graph;

        // k: 中間節點
        for (int k = 0; k < n; k++) {
            // i: 起點
            for (int i = 0; i < n; i++) {
                // j: 終點
                for (int j = 0; j < n; j++) {
                    // 檢查是否可以通過 k 縮短距離
                    if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        return dist;
    }
};
```

### 完整模板（含初始化）

```cpp
class Solution {
public:
    vector<vector<int>> floydWarshall(int n, vector<vector<int>>& edges) {
        const int INF = 1e9;  // 使用較大值代替 INT_MAX

        // 初始化距離矩陣
        vector<vector<int>> dist(n, vector<int>(n, INF));

        // 自己到自己距離為 0
        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        // 加入邊
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            dist[u][v] = min(dist[u][v], w);  // 處理重邊
        }

        // Floyd-Warshall 核心
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }

        return dist;
    }
};
```

### 記錄路徑版本

```cpp
pair<vector<vector<int>>, vector<vector<int>>> floydWarshallWithPath(
    vector<vector<int>>& graph) {

    int n = graph.size();
    vector<vector<int>> dist = graph;
    vector<vector<int>> next(n, vector<int>(n, -1));

    // 初始化 next（下一個節點）
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j && dist[i][j] != INT_MAX) {
                next[i][j] = j;
            }
        }
    }

    // Floyd-Warshall
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];  // 經過 k
                    }
                }
            }
        }
    }

    return {dist, next};
}

// 重建路徑
vector<int> reconstructPath(int u, int v, vector<vector<int>>& next) {
    if (next[u][v] == -1) return {};  // 無路徑

    vector<int> path = {u};
    while (u != v) {
        u = next[u][v];
        path.push_back(u);
    }
    return path;
}
```

## 複雜度分析

| 操作 | 複雜度 | 說明 |
|------|--------|------|
| 時間 | O(V³) | 三層迴圈 |
| 空間 | O(V²) | 距離矩陣 |

**注意**：
- 時間複雜度固定為 O(V³)，與邊數無關
- 適合**稠密圖**（E 接近 V²）
- 小規模圖（V ≤ 400）可以接受

## 負環檢測

Floyd-Warshall 可以檢測負環：
- 如果 `dist[i][i] < 0`，則存在包含節點 i 的負環

```cpp
bool hasNegativeCycle(vector<vector<int>>& dist) {
    int n = dist.size();
    for (int i = 0; i < n; i++) {
        if (dist[i][i] < 0) {
            return true;  // 存在負環
        }
    }
    return false;
}
```

## LeetCode 題目詳解

### 1. [1334. Find the City With the Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**題目**：找出在距離閾值內可達城市數最少的城市。

**解法**：Floyd-Warshall + 統計

```cpp
class Solution {
public:
    int findTheCity(int n, vector<vector<int>>& edges,
                    int distanceThreshold) {
        const int INF = 1e9;
        vector<vector<int>> dist(n, vector<int>(n, INF));

        // 初始化
        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            dist[u][v] = w;
            dist[v][u] = w;  // 無向圖
        }

        // Floyd-Warshall
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }

        // 統計每個城市的可達城市數
        int minCount = n;
        int result = 0;

        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (i != j && dist[i][j] <= distanceThreshold) {
                    count++;
                }
            }

            // 選擇可達城市數最少的（編號最大的）
            if (count <= minCount) {
                minCount = count;
                result = i;
            }
        }

        return result;
    }
};
```

**複雜度**：
- 時間：O(n³)
- 空間：O(n²)

### 2. [1462. Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)

**題目**：判斷課程之間的先修關係（傳遞閉包）。

**解法**：Floyd-Warshall（可達性）

```cpp
class Solution {
public:
    vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& prerequisites,
                                     vector<vector<int>>& queries) {
        // isReachable[i][j] 表示是否可以從 i 到達 j
        vector<vector<bool>> isReachable(n, vector<bool>(n, false));

        // 自己可以到達自己
        for (int i = 0; i < n; i++) {
            isReachable[i][i] = true;
        }

        // 加入直接先修關係
        for (auto& p : prerequisites) {
            isReachable[p[0]][p[1]] = true;
        }

        // Floyd-Warshall（傳遞閉包）
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    // 如果 i->k 且 k->j，則 i->j
                    isReachable[i][j] = isReachable[i][j] ||
                                       (isReachable[i][k] && isReachable[k][j]);
                }
            }
        }

        // 回答查詢
        vector<bool> result;
        for (auto& q : queries) {
            result.push_back(isReachable[q[0]][q[1]]);
        }

        return result;
    }
};
```

**複雜度**：
- 時間：O(n³ + Q)，Q 為查詢數
- 空間：O(n²)

### 3. 標準全源最短路徑

```cpp
class Solution {
public:
    // 返回任意兩點的最短距離
    vector<vector<int>> allPairsShortestPath(
        int n, vector<vector<int>>& edges) {

        const int INF = 1e9;
        vector<vector<int>> dist(n, vector<int>(n, INF));

        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            dist[u][v] = min(dist[u][v], w);
        }

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] < INF && dist[k][j] < INF) {
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        return dist;
    }
};
```

## 常見陷阱與技巧

### 陷阱

1. **迴圈順序錯誤**
   ```cpp
   // 錯誤：k 必須在最外層
   for (int i = 0; i < n; i++)
       for (int j = 0; j < n; j++)
           for (int k = 0; k < n; k++)  // 錯誤！

   // 正確：k 在最外層
   for (int k = 0; k < n; k++)
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
   ```

2. **使用 INT_MAX 導致溢位**
   ```cpp
   // 錯誤：INT_MAX + x 溢位
   dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

   // 正確：使用較小的 INF 或先檢查
   const int INF = 1e9;
   if (dist[i][k] < INF && dist[k][j] < INF) {
       dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
   }
   ```

3. **忘記初始化對角線**
   ```cpp
   // dist[i][i] 應該初始化為 0
   for (int i = 0; i < n; i++) {
       dist[i][i] = 0;
   }
   ```

4. **無向圖忘記雙向加邊**
   ```cpp
   // 無向圖需要加兩條邊
   dist[u][v] = w;
   dist[v][u] = w;
   ```

### 進階技巧

1. **傳遞閉包（布林版本）**
   ```cpp
   // 判斷可達性（不需要距離）
   vector<vector<bool>> reachable(n, vector<bool>(n, false));

   for (int k = 0; k < n; k++)
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
               reachable[i][j] |= (reachable[i][k] && reachable[k][j]);
   ```

2. **最大/最小瓶頸路徑**
   ```cpp
   // 找路徑上最小的最大邊（minimax）
   for (int k = 0; k < n; k++)
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
               dist[i][j] = min(dist[i][j], max(dist[i][k], dist[k][j]));
   ```

3. **檢測負環並標記受影響的節點**
   ```cpp
   // 第二輪：標記受負環影響的節點
   for (int k = 0; k < n; k++)
       for (int i = 0; i < n; i++)
           for (int j = 0; j < n; j++)
               if (dist[k][k] < 0 && dist[i][k] < INF && dist[k][j] < INF)
                   dist[i][j] = -INF;  // 標記為負無窮
   ```

## Floyd-Warshall vs 其他演算法

### 全源最短路徑的解法比較

| 方法 | 時間複雜度 | 適用場景 |
|------|-----------|---------|
| Floyd-Warshall | O(V³) | 稠密圖、小規模圖 |
| V 次 Dijkstra | O(V(V+E) log V) | 稀疏圖、無負權邊 |
| V 次 Bellman-Ford | O(V²E) | 稀疏圖、有負權邊 |

### 選擇建議

```
全源最短路徑問題：

節點數 V：
├─ V ≤ 400 → Floyd-Warshall（簡單直接）
└─ V > 400 ↓
   有負權邊？
   ├─ 否 → V 次 Dijkstra
   └─ 是 → V 次 Bellman-Ford/SPFA
```

## 應用場景

1. **傳遞閉包**：計算圖的可達性
2. **最短路徑矩陣**：需要任意兩點的最短距離
3. **圖的直徑**：max(dist[i][j])
4. **圖的中心**：min(max(dist[i][j]))
5. **負環檢測**：檢查 dist[i][i] < 0

## 總結

### Floyd-Warshall 特點

**優勢**：
- 實現簡單（三層迴圈）
- 一次計算所有點對
- 支持負權邊
- 可以檢測負環
- 可以求傳遞閉包

**劣勢**：
- 時間複雜度固定 O(V³)
- 空間複雜度 O(V²)
- 不適合大規模圖

### 實戰建議

1. **模板化**：記住三層迴圈的順序（k-i-j）
2. **初始化**：對角線為 0，其他為 INF
3. **溢位處理**：使用 1e9 而非 INT_MAX
4. **無向圖**：記得雙向加邊
5. **應用變體**：理解核心思想，靈活修改

### 適用場景

- **小規模圖**（V ≤ 400）
- **稠密圖**（E 接近 V²）
- **需要所有點對的最短距離**
- **傳遞閉包問題**
- **圖的直徑/中心問題**

下一章我們將學習 Tarjan 演算法，處理強連通分量、橋和割點問題。
