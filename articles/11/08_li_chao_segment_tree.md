---
title: 11-8. Li Chao Segment Tree
order: 8
description: 李超線段樹：動態維護線段集合的利器
tags:
  - Li Chao Tree
  - Segment Tree
  - Convex Hull Trick
  - Slope Optimization
  - Dynamic Programming
author: Rain Hu
date: '2025-10-12'
draft: false
subscription: member
---

# Li Chao Segment Tree（李超線段樹）

## 前言：問題引入

### 經典問題

給定一個空的線段集合，支援以下操作：
1. **插入線段**：添加一條線段 `y = kx + b`（定義域為整個數軸或某個區間）
2. **查詢最大值**：查詢在 `x = x₀` 處，所有線段中 `y` 值最大的是多少

**範例**：
```
操作 1: 插入線段 L₁: y = 2x + 1
操作 2: 插入線段 L₂: y = -x + 10
操作 3: 查詢 x = 2 處的最大值
        → L₁(2) = 5, L₂(2) = 8
        → 答案：8

操作 4: 查詢 x = 5 處的最大值
        → L₁(5) = 11, L₂(5) = 5
        → 答案：11
```

---

### 暴力做法的瓶頸

```cpp
// 暴力解法
vector<pair<int, int>> lines;  // (k, b)

void insert(int k, int b) {
    lines.push_back({k, b});  // O(1)
}

int query(int x) {
    int maxVal = INT_MIN;
    for (auto [k, b] : lines) {
        maxVal = max(maxVal, k * x + b);  // O(n)
    }
    return maxVal;
}
```

**問題**：
- 插入：O(1) 
- 查詢：**O(n)** （n 為線段數量）

如果有 n 次插入和 m 次查詢，總複雜度為 **O(nm)**，當 n, m 都很大時會 TLE。

---

### 為什麼普通線段樹不夠用？

**普通線段樹**：
- 適合處理**區間信息**（區間和、區間最大值等）
- 線段樹的節點維護的是**一段連續區間**的統計信息

**線段維護問題的特點**：
- 每條線段是一個**函數** `y = kx + b`
- 在不同的 x 位置，最優的線段可能不同
- 需要維護的是**所有線段在某點的最大值**

普通線段樹無法高效處理這種"動態函數集合"的問題。

---

## 一、核心思想

### 1.1 幾何直觀

觀察線段的性質：
- 每條線段 `y = kx + b` 是一條直線
- 在某個區間內，**某條線段可能一直是最優的**
- 兩條線段最多交於一點

```
線段示意圖：

y
│         L₂
│        /
│       /   L₁
│      /   /
│     /   /
│    /   /
│   /   /
│  /   /___________
│ /   /
│/___/______________ x
0   2   4   6   8

L₁: y = 2x + 1
L₂: y = -x + 10

交點：2x + 1 = -x + 10 → x = 3

區間支配：
- x ∈ [0, 3)：L₂ 更優（斜率小，截距大）
- x ∈ [3, ∞)：L₁ 更優（斜率大）
```

---

### 1.2 標籤永久化技巧

**關鍵思想**：
- 每個節點只保存**一條線段**（當前可能最優的線段）
- 插入新線段時，與當前線段比較
- 在**中點**處判斷優劣
- 將"部分區間更優"的線段遞歸下推到子樹

**與普通線段樹的區別**：
- 普通線段樹：精確維護每個區間的信息
- 李超線段樹：只保留"可能成為最優解"的線段，標籤不完全下推

---

### 1.3 核心操作：插入線段

**算法流程**：
1. 計算當前區間的**中點** `mid`
2. 比較當前節點的線段 `cur` 與新線段 `new` 在 `mid` 處的值
3. **保留在 `mid` 處更優的線段**
4. 將另一條線段下推到子樹（因為它可能在子區間內更優）

**決策樹**：
```
if new(mid) > cur(mid):
    swap(new, cur)  // 保留 new，下推 cur

if new 與 cur 有交點:
    if new(left) > cur(left):
        遞歸插入到左子樹
    else:
        遞歸插入到右子樹
```

---

## 二、詳細圖解

### 2.1 插入第一條線段

```
初始狀態：空樹

              [0, 7]
               null

插入 L₁: y = x + 2

              [0, 7]
               L₁
```

---

### 2.2 插入第二條線段

```
當前狀態：
              [0, 7]
               L₁

插入 L₂: y = -x + 10

步驟 1：比較中點 mid = 3.5
    L₁(3.5) = 3.5 + 2 = 5.5
    L₂(3.5) = -3.5 + 10 = 6.5
    → L₂ 在中點更優

步驟 2：保留 L₂，下推 L₁

              [0, 7]
               L₂

步驟 3：判斷 L₁ 在哪個子區間可能更優
    L₁(0) = 2, L₂(0) = 10 → L₂ 更優（左邊界）
    L₁(7) = 9, L₂(7) = 3 → L₁ 更優（右邊界）
    → L₁ 下推到右子樹

              [0, 7]
               L₂
              /    \
         [0,3]    [4,7]
          null     L₁
```

---

### 2.3 查詢操作

```
查詢 x = 2：

沿著路徑 [0,7] → [0,3] 收集答案：
    [0, 7]: L₂(2) = -2 + 10 = 8
    [0, 3]: null
    結果：max = 8

查詢 x = 6：

沿著路徑 [0,7] → [4,7] 收集答案：
    [0, 7]: L₂(6) = -6 + 10 = 4
    [4, 7]: L₁(6) = 6 + 2 = 8
    結果：max = 8
```

---

## 三、完整模板實現

### 3.1 基礎版本（靜態區間）

```cpp
struct Line {
    long long k, b;  // y = kx + b

    long long eval(long long x) const {
        return k * x + b;
    }
};

class LiChaoTree {
private:
    vector<Line> tree;
    int n;

    // 比較兩條線段在 x 處的值
    bool better(const Line& a, const Line& b, long long x) {
        return a.eval(x) > b.eval(x);  // 求最大值
    }

    void insert(int node, int start, int end, Line line) {
        if (start > end) return;

        int mid = (start + end) / 2;

        // 比較中點
        bool midBetter = better(line, tree[node], mid);
        bool leftBetter = better(line, tree[node], start);

        if (midBetter) {
            swap(tree[node], line);  // 保留在中點更優的線段
        }

        // 決定下推方向
        if (start == end) return;

        if (line.k < tree[node].k) {  // 斜率小，可能在左邊更優
            if (leftBetter) {
                insert(2 * node, start, mid, line);
            } else {
                insert(2 * node + 1, mid + 1, end, line);
            }
        } else {  // 斜率大，可能在右邊更優
            if (!leftBetter) {
                insert(2 * node + 1, mid + 1, end, line);
            } else {
                insert(2 * node, start, mid, line);
            }
        }
    }

    long long query(int node, int start, int end, long long x) {
        if (start > end) return LLONG_MIN;

        long long res = tree[node].eval(x);

        if (start == end) return res;

        int mid = (start + end) / 2;

        if (x <= mid) {
            return max(res, query(2 * node, start, mid, x));
        } else {
            return max(res, query(2 * node + 1, mid + 1, end, x));
        }
    }

public:
    LiChaoTree(int range) : n(range) {
        tree.resize(4 * n, {0, LLONG_MIN / 2});  // 初始化為極小值
    }

    void insert(long long k, long long b) {
        insert(1, 0, n - 1, {k, b});
    }

    long long query(long long x) {
        return query(1, 0, n - 1, x);
    }
};
```

---

### 3.2 動態開點版本

```cpp
struct Node {
    Line line;
    Node *left, *right;

    Node() : line({0, LLONG_MIN / 2}), left(nullptr), right(nullptr) {}
};

class LiChaoTreeDynamic {
private:
    Node* root;
    long long L, R;  // 值域範圍

    bool better(const Line& a, const Line& b, long long x) {
        return a.eval(x) > b.eval(x);
    }

    void insert(Node*& node, long long start, long long end, Line line) {
        if (!node) node = new Node();
        if (start > end) return;

        long long mid = start + (end - start) / 2;

        bool midBetter = better(line, node->line, mid);
        bool leftBetter = better(line, node->line, start);

        if (midBetter) {
            swap(node->line, line);
        }

        if (start == end) return;

        if (line.k < node->line.k) {
            if (leftBetter) {
                insert(node->left, start, mid, line);
            } else {
                insert(node->right, mid + 1, end, line);
            }
        } else {
            if (!leftBetter) {
                insert(node->right, mid + 1, end, line);
            } else {
                insert(node->left, start, mid, line);
            }
        }
    }

    long long query(Node* node, long long start, long long end, long long x) {
        if (!node) return LLONG_MIN;
        if (start > end) return LLONG_MIN;

        long long res = node->line.eval(x);

        if (start == end) return res;

        long long mid = start + (end - start) / 2;

        if (x <= mid) {
            return max(res, query(node->left, start, mid, x));
        } else {
            return max(res, query(node->right, mid + 1, end, x));
        }
    }

public:
    LiChaoTreeDynamic(long long l, long long r) : L(l), R(r) {
        root = nullptr;
    }

    void insert(long long k, long long b) {
        insert(root, L, R, {k, b});
    }

    long long query(long long x) {
        return query(root, L, R, x);
    }
};
```

**優勢**：
- 支援大範圍值域（如 [-10^9, 10^9]）
- 只在需要時才創建節點
- 空間複雜度：O(n log V)，n 為線段數，V 為值域大小

---

## 四、進階：斜率優化 DP

### 4.1 問題模型

許多 DP 問題的轉移方程形如：

```
dp[i] = min/max (dp[j] + cost(j, i))
        j < i
```

當 `cost(j, i)` 可以表示為線性函數時，可以使用李超線段樹優化。

---

### 4.2 經典問題：任務調度

**問題**：
- 有 n 個任務，第 i 個任務的權重為 `w[i]`
- 將任務分成若干組，每組的代價為 `(sum)²`
- 求最小總代價

**DP 方程**：
```
dp[i] = min (dp[j] + (sum[i] - sum[j])²)
        j < i

展開：
dp[i] = min (dp[j] + sum[i]² - 2*sum[i]*sum[j] + sum[j]²)
      = min (sum[i]² + (dp[j] + sum[j]²) - 2*sum[i]*sum[j])
```

**轉化為李超線段樹**：

將每個狀態 `j` 視為一條線段：
- 斜率 `k = -2 * sum[j]`
- 截距 `b = dp[j] + sum[j]²`

查詢 `x = sum[i]` 處的最小值。

```cpp
class Solution {
public:
    int minCost(vector<int>& w) {
        int n = w.size();
        vector<long long> sum(n + 1, 0);

        for (int i = 0; i < n; i++) {
            sum[i + 1] = sum[i] + w[i];
        }

        // 值域範圍：sum 的最大值
        LiChaoTreeDynamic tree(0, sum[n]);

        vector<long long> dp(n + 1, 0);
        tree.insert(0, 0);  // 初始狀態：k=0, b=0

        for (int i = 1; i <= n; i++) {
            long long val = tree.query(sum[i]);
            dp[i] = sum[i] * sum[i] + val;

            // 插入新線段：k = -2*sum[i], b = dp[i] + sum[i]²
            tree.insert(-2 * sum[i], dp[i] + sum[i] * sum[i]);
        }

        return dp[n];
    }
};
```

**複雜度**：
- 時間：O(n log V)
- 空間：O(n log V)

---

## 五、LeetCode 與競賽題目

### 5.1 Codeforces 932F - Escape Through Leaf

**題意**：
- 樹上每個節點有權值 `a[i]` 和 `b[i]`
- 從節點 u 跳到子樹中的節點 v，代價為 `a[u] * b[v]`
- 求從每個節點到葉節點的最小代價

**解法**：樹形 DP + 李超線段樹

```cpp
struct Line {
    long long k, b;
    long long eval(long long x) {
        return k * x + b;
    }
};

class Solution {
    vector<long long> dp;
    vector<vector<int>> tree;
    vector<long long> a, b;

    LiChaoTreeDynamic lct;

    void dfs(int u) {
        if (tree[u].empty()) {  // 葉節點
            dp[u] = 0;
            return;
        }

        LiChaoTreeDynamic local(-1e9, 1e9);

        for (int v : tree[u]) {
            dfs(v);
            // 子節點的線段：y = b[v] * x + dp[v]
            local.insert(b[v], dp[v]);
        }

        dp[u] = local.query(a[u]);
    }
};
```

---

### 5.2 POJ 3709 - K Anonymous Sequence

**題意**：
- 將序列分成若干段，每段至少有 k 個相同元素
- 最小化總段數

**解法**：DP + 李超線段樹維護凸包

---

## 六、常見陷阱與技巧

### 6.1 陷阱 1：精度問題

```cpp
// 錯誤：使用浮點數比較
if (line1.k * x + line1.b > line2.k * x + line2.b)

// 正確：使用整數運算
if ((line1.k - line2.k) * x > line2.b - line1.b)
```

### 6.2 陷阱 2：初始化極值

```cpp
// 錯誤：初始化為 0
Line() : k(0), b(0) {}

// 正確：初始化為極小值
Line() : k(0), b(LLONG_MIN / 2) {}  // 避免溢出
```

### 6.3 技巧：離散化

當查詢的 x 範圍很大但數量很少時，可以離散化：

```cpp
set<int> coords;
for (auto [x, ...] : queries) {
    coords.insert(x);
}

map<int, int> compress;
int id = 0;
for (int c : coords) {
    compress[c] = id++;
}

LiChaoTree tree(coords.size());
```

---

## 七、總結

### 核心特點

| 特性 | Li Chao Tree | 凸包維護 | 普通線段樹 |
|------|-------------|---------|-----------|
| **插入** | O(log V) | O(log n) | - |
| **查詢** | O(log V) | O(log n) | O(log n) |
| **動態插入** | 適合 |  需單調性 | 不行 |
| **空間** | O(n log V) | O(n) | O(4n) |
| **實現難度** | 中等 | 困難 | 簡單 |

### 適用場景

**適合李超線段樹**：
- 動態維護線段集合
- 查詢單點最大/最小值
- 斜率優化 DP
- 線段不具備單調性

**不適合**：
- 需要區間最大值（用普通線段樹）
- 線段具備單調性（用凸包更簡單）
- 只有靜態查詢（離線處理更快）

---