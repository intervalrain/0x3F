---
title: 02-7. Branch and Bound (分支定界法)
order: 7
description: 分支定界法：透過界限函數剪枝，找到最優解
tags:
  - Branch and Bound
  - 分支定界
  - 最優化
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Branch and Bound (分支定界法)

## 前言

**Branch and Bound (分支定界法)** 是一種用於求解**最優化問題**的演算法，透過**界限函數**來剪枝，避免搜尋無用的分支。

---

## 核心思想

### 定義

分支定界 = **回溯法** + **界限函數** + **最優解追蹤**

```
1. 分支 (Branch): 將問題分成子問題
2. 定界 (Bound): 計算子問題的界限
3. 剪枝: 如果界限比已知最優解差，放棄此分支
```

### vs 回溯法

| 特性 | 回溯法 | 分支定界 |
|-----|-------|---------|
| **目標** | 找所有解 | 找最優解 |
| **剪枝** | 可行性 | 可行性 + 最優性 |
| **界限函數** | 無 | 有 |
| **搜尋順序** | DFS | BFS 或 Best-First |

---

## 基本概念

### 1. 分支 (Branching)

將問題分解成子問題。

```
原問題
├─ 子問題 1
│  ├─ 子子問題 1.1
│  └─ 子子問題 1.2
└─ 子問題 2
   └─ ...
```

### 2. 定界 (Bounding)

計算子問題可能達到的**最優值的界限**。

```cpp
// 最小化問題
下界 = 當前成本 + 剩餘問題的樂觀估計

// 最大化問題
上界 = 當前收益 + 剩餘問題的樂觀估計
```

### 3. 剪枝 (Pruning)

```cpp
if (下界 >= 當前最優解) {
    剪枝;  // 不可能更優
}
```

---

## 經典問題

### 1. 0/1 背包問題

**問題**: n 個物品，每個有重量和價值，背包容量 W，求最大價值

```cpp
struct Node {
    int level;       // 當前層級
    int profit;      // 當前利潤
    int weight;      // 當前重量
    double bound;    // 上界
};

class Comparator {
public:
    bool operator()(Node& a, Node& b) {
        return a.bound < b.bound;  // 最大堆
    }
};

double bound(Node& u, int n, int W,
             vector<int>& weights, vector<int>& values) {
    if (u.weight >= W) return 0;
    
    double profitBound = u.profit;
    int j = u.level + 1;
    int totalWeight = u.weight;
    
    // 貪心：盡可能選擇性價比高的物品
    while (j < n && totalWeight + weights[j] <= W) {
        totalWeight += weights[j];
        profitBound += values[j];
        j++;
    }
    
    // 部分物品（鬆弛）
    if (j < n) {
        profitBound += (W - totalWeight) * values[j] / (double)weights[j];
    }
    
    return profitBound;
}

int knapsack(int W, vector<int>& weights, vector<int>& values) {
    int n = weights.size();
    
    // 按性價比排序
    vector<int> indices(n);
    iota(indices.begin(), indices.end(), 0);
    sort(indices.begin(), indices.end(),
         [&](int i, int j) {
             return (double)values[i]/weights[i] > (double)values[j]/weights[j];
         });
    
    vector<int> sortedWeights(n), sortedValues(n);
    for (int i = 0; i < n; i++) {
        sortedWeights[i] = weights[indices[i]];
        sortedValues[i] = values[indices[i]];
    }
    
    priority_queue<Node, vector<Node>, Comparator> pq;
    
    Node root = {-1, 0, 0, 0.0};
    root.bound = bound(root, n, W, sortedWeights, sortedValues);
    
    pq.push(root);
    
    int maxProfit = 0;
    
    while (!pq.empty()) {
        Node u = pq.top();
        pq.pop();
        
        // 剪枝
        if (u.bound <= maxProfit) continue;
        
        // 下一層
        int level = u.level + 1;
        if (level >= n) continue;
        
        // 選擇物品
        Node v;
        v.level = level;
        v.weight = u.weight + sortedWeights[level];
        v.profit = u.profit + sortedValues[level];
        
        if (v.weight <= W && v.profit > maxProfit) {
            maxProfit = v.profit;
        }
        
        v.bound = bound(v, n, W, sortedWeights, sortedValues);
        if (v.bound > maxProfit) {
            pq.push(v);
        }
        
        // 不選擇物品
        v.weight = u.weight;
        v.profit = u.profit;
        v.level = level;
        v.bound = bound(v, n, W, sortedWeights, sortedValues);
        
        if (v.bound > maxProfit) {
            pq.push(v);
        }
    }
    
    return maxProfit;
}
```

**時間複雜度**: 最壞 O(2^n)，實務上透過剪枝大幅優化

---

### 2. 旅行推銷員問題 (TSP)

**問題**: 訪問所有城市一次，回到起點，最短路徑

```cpp
struct Node {
    vector<bool> visited;
    int cost;
    int level;
    int bound;
};

int calculateBound(Node& node, vector<vector<int>>& graph) {
    // 計算下界：當前成本 + 剩餘邊的最小成本估計
    int bound = node.cost;
    
    // 對未訪問的城市，加上最小出邊
    for (int i = 0; i < graph.size(); i++) {
        if (!node.visited[i]) {
            int minEdge = INT_MAX;
            for (int j = 0; j < graph.size(); j++) {
                if (i != j && !node.visited[j]) {
                    minEdge = min(minEdge, graph[i][j]);
                }
            }
            if (minEdge != INT_MAX) {
                bound += minEdge;
            }
        }
    }
    
    return bound;
}

int tsp(vector<vector<int>>& graph) {
    int n = graph.size();
    priority_queue<pair<int, Node>, vector<pair<int, Node>>, greater<>> pq;
    
    Node root;
    root.visited.resize(n, false);
    root.visited[0] = true;
    root.cost = 0;
    root.level = 0;
    root.bound = calculateBound(root, graph);
    
    pq.push({root.bound, root});
    
    int minCost = INT_MAX;
    
    while (!pq.empty()) {
        auto [_, u] = pq.top();
        pq.pop();
        
        // 剪枝
        if (u.bound >= minCost) continue;
        
        // 所有城市已訪問
        if (u.level == n - 1) {
            int totalCost = u.cost + graph[u.level][0];  // 回到起點
            minCost = min(minCost, totalCost);
            continue;
        }
        
        // 擴展下一個城市
        for (int i = 0; i < n; i++) {
            if (!u.visited[i]) {
                Node v = u;
                v.visited[i] = true;
                v.cost = u.cost + graph[u.level][i];
                v.level = u.level + 1;
                v.bound = calculateBound(v, graph);
                
                if (v.bound < minCost) {
                    pq.push({v.bound, v});
                }
            }
        }
    }
    
    return minCost;
}
```

---

## 搜尋策略

### 1. DFS (深度優先)

```cpp
// 類似回溯法
void dfs(Node u) {
    if (終止條件) {
        更新最優解;
        return;
    }
    
    for (子節點 v : u的子節點) {
        if (v.bound < 當前最優解) {
            dfs(v);
        }
    }
}
```

**優點**: 空間需求小
**缺點**: 可能先搜尋差的分支

### 2. BFS (廣度優先)

```cpp
queue<Node> q;
q.push(root);

while (!q.empty()) {
    Node u = q.front();
    q.pop();
    
    for (子節點 v : u的子節點) {
        if (v.bound < 當前最優解) {
            q.push(v);
        }
    }
}
```

**優點**: 層層推進
**缺點**: 空間需求大

### 3. Best-First Search

```cpp
priority_queue<Node> pq;
pq.push(root);

while (!pq.empty()) {
    Node u = pq.top();
    pq.pop();
    
    if (u.bound >= 當前最優解) continue;
    
    for (子節點 v : u的子節點) {
        if (v.bound < 當前最優解) {
            pq.push(v);
        }
    }
}
```

**優點**: 優先搜尋最有希望的分支
**缺點**: 需要維護優先隊列

---

## 界限函數的設計

### 原則

1. **易於計算**: 不能太複雜
2. **緊緻性**: 越接近真實值越好
3. **有效性**: 能有效剪枝

### 常見技巧

#### 1. 鬆弛問題

```cpp
// 0/1 背包 → 分數背包
// 允許物品部分選擇，得到上界
```

#### 2. 貪心估計

```cpp
// 用貪心法快速得到一個樂觀估計
```

#### 3. 線性規劃鬆弛

```cpp
// 整數規劃 → 線性規劃
```

---

## 應用場景

### 1. 組合最優化

- 0/1 背包
- 任務分配
- 設施選址

### 2. 圖論問題

- 旅行推銷員問題 (TSP)
- 最短路徑
- 最小生成樹

### 3. 排程問題

- 工作排程
- 資源分配

---

## 實作技巧

### 1. 選擇搜尋策略

```cpp
// 小規模 → DFS
// 大規模 → Best-First
```

### 2. 設計好的界限函數

```cpp
// 鬆弛要合理
// 計算要快速
```

### 3. 維護最優解

```cpp
int bestSolution = INT_MAX;  // 最小化
int bestSolution = INT_MIN;  // 最大化
```

---

## Branch and Bound vs 其他方法

### vs 動態規劃

| 特性 | DP | Branch and Bound |
|-----|---|-----------------|
| **適用** | 有重疊子問題 | 組合最優化 |
| **保證** | 多項式時間 | 可能指數時間 |
| **空間** | 較大 | 可控制 |

### vs 貪心法

| 特性 | 貪心 | Branch and Bound |
|-----|-----|-----------------|
| **正確性** | 不一定 | 一定找到最優解 |
| **效率** | O(n log n) | 可能很慢 |
| **應用** | 特定問題 | 通用 |

---

## 重點總結

### 分支定界的核心

1. **分支**: 分解問題
2. **定界**: 計算界限
3. **剪枝**: 排除不可能的分支

### 適用場景

- 求最優解（不是所有解）
- 組合最優化問題
- DP 無法使用時

### 關鍵要素

- **界限函數**: 決定剪枝效果
- **搜尋策略**: DFS, BFS, Best-First
- **資料結構**: 優先隊列

### 優缺點

**優點**:
- 保證找到最優解
- 透過剪枝加速

**缺點**:
- 最壞情況仍是指數時間
- 實作複雜

### 記憶技巧

- Branch and Bound = 回溯 + 界限函數
- 用於**最優化問題**
- 關鍵是設計好的界限函數
- LeetCode 很少出現（偏理論）
