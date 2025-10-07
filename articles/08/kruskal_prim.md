---
title: "最小生成樹 - Kruskal & Prim"
order: 9
description: "連接所有節點的最小代價 - 兩種經典 MST 演算法"
tags: ["graph", "MST", "kruskal", "prim", "greedy", "union find"]
---

# 最小生成樹 (Minimum Spanning Tree, MST)

最小生成樹是圖論中的經典問題，目標是找到連接圖中所有節點的**最小權重樹**。

## 核心概念

### 什麼是生成樹？

**生成樹 (Spanning Tree)**：
- 包含圖中所有頂點的樹
- 恰好有 V-1 條邊（V 為頂點數）
- 連通且無環

**最小生成樹 (MST)**：
- 所有生成樹中，邊權重和最小的那棵

### 視覺化範例

```
原圖（帶權重）：
    0 --1-- 1
    |  \    |
    4   2   3
    |    \  |
    2 --5-- 3

可能的生成樹：
方案 1: 0-1(1), 1-3(3), 0-2(4) → 總和 = 8
方案 2: 0-1(1), 0-3(2), 2-3(5) → 總和 = 8
MST:    0-1(1), 0-3(2), 1-3(3) → 總和 = 6 ✓
```

### 性質

1. **唯一性**：權重不同時，MST 唯一；否則可能多個
2. **切割性質**：橫跨切割的最小邊必在某個 MST 中
3. **環性質**：環中最大邊不在 MST 中

## Kruskal 演算法

### 核心思想

**貪心策略**：
1. 將所有邊按權重排序
2. 依次選擇最小權重的邊
3. 如果該邊不形成環，加入 MST
4. 重複直到選夠 V-1 條邊

**關鍵**：使用 Union Find 檢測環

### 實現

```cpp
class Solution {
private:
    class UnionFind {
    public:
        vector<int> parent, rank;

        UnionFind(int n) : parent(n), rank(n, 0) {
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            if (rootX == rootY) return false;  // 已連通，會形成環

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
    };

public:
    int kruskal(int n, vector<vector<int>>& edges) {
        // 排序邊：按權重從小到大
        sort(edges.begin(), edges.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[2] < b[2];
             });

        UnionFind uf(n);
        int mstWeight = 0;
        int edgeCount = 0;

        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];

            // 如果不形成環，加入 MST
            if (uf.unite(u, v)) {
                mstWeight += w;
                edgeCount++;

                // 已選夠 n-1 條邊
                if (edgeCount == n - 1) break;
            }
        }

        return mstWeight;
    }
};
```

### 複雜度分析

| 操作 | 時間複雜度 |
|------|-----------|
| 排序邊 | O(E log E) |
| Union Find | O(E × α(V)) ≈ O(E) |
| **總計** | **O(E log E)** |

**空間複雜度**：O(V)

### 視覺化過程

```
邊列表（已排序）：
0-1(1), 0-3(2), 1-3(3), 0-2(4), 2-3(5)

步驟 1：選擇 0-1(1) ✓
       不形成環，加入 MST
       MST = {0-1}

步驟 2：選擇 0-3(2) ✓
       不形成環，加入 MST
       MST = {0-1, 0-3}

步驟 3：選擇 1-3(3) ✓
       不形成環，加入 MST
       MST = {0-1, 0-3, 1-3}

已選 3 條邊（n-1=3），完成！
總權重 = 1 + 2 + 3 = 6
```

## Prim 演算法

### 核心思想

**貪心策略**：
1. 從任意節點開始
2. 每次選擇**連接 MST 和非 MST 節點的最小權重邊**
3. 將該邊和節點加入 MST
4. 重複直到所有節點都在 MST 中

**關鍵**：使用優先隊列（小根堆）

### 實現

```cpp
class Solution {
public:
    int prim(int n, vector<vector<pair<int, int>>>& graph) {
        vector<bool> inMST(n, false);
        // 優先隊列：{權重, 節點}
        priority_queue<pair<int, int>,
                       vector<pair<int, int>>,
                       greater<>> pq;

        int mstWeight = 0;
        int edgeCount = 0;

        // 從節點 0 開始
        pq.push({0, 0});

        while (!pq.empty() && edgeCount < n) {
            auto [weight, u] = pq.top();
            pq.pop();

            if (inMST[u]) continue;  // 已在 MST 中

            // 加入 MST
            inMST[u] = true;
            mstWeight += weight;
            edgeCount++;

            // 將鄰居加入優先隊列
            for (auto [v, w] : graph[u]) {
                if (!inMST[v]) {
                    pq.push({w, v});
                }
            }
        }

        return mstWeight;
    }
};
```

### 複雜度分析

| 操作 | 時間複雜度 |
|------|-----------|
| 優先隊列操作 | O((V+E) log V) |
| **總計** | **O((V+E) log V)** |

**空間複雜度**：O(V + E)

### 視覺化過程

```
圖結構：
    0 --1-- 1
    |  \    |
    4   2   3
    |    \  |
    2 --5-- 3

步驟 1：從節點 0 開始
       MST = {0}
       優先隊列 = {(1,1), (2,3), (4,2)}

步驟 2：選擇最小邊 0-1(1)
       MST = {0, 1}
       優先隊列 = {(2,3), (3,3), (4,2)}

步驟 3：選擇最小邊 0-3(2)
       MST = {0, 1, 3}
       優先隊列 = {(3,3), (4,2), (5,2)}

步驟 4：選擇最小邊 1-3(3)（但 3 已在 MST）
       選擇 0-2(4)
       MST = {0, 1, 2, 3}

完成！總權重 = 0 + 1 + 2 + 4 = 7
```

## Kruskal vs Prim

| 特性 | Kruskal | Prim |
|------|---------|------|
| 策略 | 邊的貪心 | 節點的貪心 |
| 數據結構 | Union Find | 優先隊列 |
| 時間複雜度 | O(E log E) | O((V+E) log V) |
| 適用場景 | 稀疏圖 | 稠密圖 |
| 實現難度 | 中等 | 中等 |

### 選擇建議

```
選擇 MST 演算法：

邊數 vs 點數：
├─ E << V² (稀疏圖) → Kruskal
└─ E ≈ V² (稠密圖) → Prim

實現偏好：
├─ 熟悉 Union Find → Kruskal
└─ 熟悉優先隊列 → Prim
```

## LeetCode 題目詳解

### 1. [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**題目**：連接所有點的最小代價（曼哈頓距離）。

**解法 1：Kruskal**

```cpp
class Solution {
private:
    class UnionFind {
    public:
        vector<int> parent;

        UnionFind(int n) : parent(n) {
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX == rootY) return false;
            parent[rootX] = rootY;
            return true;
        }
    };

public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();

        // 建立所有邊
        vector<array<int, 3>> edges;  // {權重, u, v}
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int dist = abs(points[i][0] - points[j][0]) +
                          abs(points[i][1] - points[j][1]);
                edges.push_back({dist, i, j});
            }
        }

        // Kruskal
        sort(edges.begin(), edges.end());
        UnionFind uf(n);
        int mstCost = 0;
        int edgeCount = 0;

        for (auto& [w, u, v] : edges) {
            if (uf.unite(u, v)) {
                mstCost += w;
                edgeCount++;
                if (edgeCount == n - 1) break;
            }
        }

        return mstCost;
    }
};
```

**解法 2：Prim**

```cpp
class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<bool> inMST(n, false);

        // 優先隊列：{距離, 點索引}
        priority_queue<pair<int, int>,
                       vector<pair<int, int>>,
                       greater<>> pq;

        pq.push({0, 0});  // 從點 0 開始
        int mstCost = 0;
        int edgeCount = 0;

        while (!pq.empty() && edgeCount < n) {
            auto [dist, u] = pq.top();
            pq.pop();

            if (inMST[u]) continue;

            inMST[u] = true;
            mstCost += dist;
            edgeCount++;

            // 將鄰居加入優先隊列
            for (int v = 0; v < n; v++) {
                if (!inMST[v]) {
                    int newDist = abs(points[u][0] - points[v][0]) +
                                 abs(points[u][1] - points[v][1]);
                    pq.push({newDist, v});
                }
            }
        }

        return mstCost;
    }
};
```

**複雜度**：
- Kruskal：O(V² log V)（建立所有邊 + 排序）
- Prim：O(V² log V)（每個點加入 V 個鄰居）

### 2. [1135. Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

**題目**：連接所有城市的最小代價。

**解法：Kruskal（標準 MST）**

```cpp
class Solution {
private:
    class UnionFind {
    public:
        vector<int> parent;

        UnionFind(int n) : parent(n + 1) {
            for (int i = 0; i <= n; i++) {
                parent[i] = i;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX == rootY) return false;
            parent[rootX] = rootY;
            return true;
        }
    };

public:
    int minimumCost(int n, vector<vector<int>>& connections) {
        // 排序邊
        sort(connections.begin(), connections.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[2] < b[2];
             });

        UnionFind uf(n);
        int totalCost = 0;
        int edgeCount = 0;

        for (auto& conn : connections) {
            int u = conn[0], v = conn[1], cost = conn[2];

            if (uf.unite(u, v)) {
                totalCost += cost;
                edgeCount++;

                if (edgeCount == n - 1) {
                    return totalCost;
                }
            }
        }

        return -1;  // 無法連接所有城市
    }
};
```

**複雜度**：
- 時間：O(E log E)
- 空間：O(V)

## 常見陷阱與技巧

### 陷阱

1. **忘記檢查圖的連通性**
   ```cpp
   // 如果選不夠 n-1 條邊，圖不連通
   if (edgeCount != n - 1) return -1;
   ```

2. **Kruskal 排序錯誤**
   ```cpp
   // 錯誤：按起點排序
   sort(edges.begin(), edges.end());

   // 正確：按權重排序
   sort(edges.begin(), edges.end(),
        [](auto& a, auto& b) { return a[2] < b[2]; });
   ```

3. **Prim 忘記檢查 inMST**
   ```cpp
   auto [weight, u] = pq.top();
   pq.pop();
   if (inMST[u]) continue;  // 必須檢查！
   ```

4. **節點編號從 0 還是 1**
   ```cpp
   // 根據題目調整
   UnionFind uf(n);      // 0-indexed
   UnionFind uf(n + 1);  // 1-indexed
   ```

### 進階技巧

1. **次小生成樹**
   ```cpp
   // 先求 MST，然後嘗試替換每條邊
   // 找最小的替換代價
   ```

2. **限制條件的 MST**
   ```cpp
   // 例如：必須包含某些邊
   // 先加入必須的邊，再執行 Kruskal
   ```

3. **MST 的唯一性判斷**
   ```cpp
   // 檢查是否有相同權重的邊可以替換
   // 統計每個權重的邊數
   ```

4. **Prim 的優化（鄰接表）**
   ```cpp
   // 只將實際鄰居加入優先隊列
   // 而不是所有未訪問節點
   for (auto [v, w] : graph[u]) {
       if (!inMST[v]) {
           pq.push({w, v});
       }
   }
   ```

## 應用場景

1. **網路設計**：最小化佈線成本
2. **道路建設**：連接所有城市的最小代價
3. **聚類分析**：單鏈接聚類
4. **圖像分割**：基於像素相似度
5. **近似算法**：TSP 的近似解

## 總結

### MST 問題特點

**必要條件**：
- 無向圖
- 連通圖
- 帶權重的邊

**目標**：
- 連接所有節點
- 無環（樹的性質）
- 總權重最小

### 兩種演算法對比

| 算法 | 適合場景 | 核心數據結構 | 複雜度 |
|------|---------|-------------|--------|
| Kruskal | 稀疏圖、邊較少 | Union Find | O(E log E) |
| Prim | 稠密圖、點較少 | 優先隊列 | O((V+E) log V) |

### 實戰建議

1. **LeetCode 常用**：Kruskal（Union Find 模板通用）
2. **記住模板**：排序邊 + Union Find 或 優先隊列 + inMST
3. **檢查連通性**：edgeCount == n - 1
4. **靈活選擇**：根據圖的類型選擇演算法

下一章我們將介紹進階主題：最大流演算法（Dinic/Edmonds-Karp）。
