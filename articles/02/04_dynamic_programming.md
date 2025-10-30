---
title: 02-4. Dynamic Programming (動態規劃)
order: 4
description: 動態規劃的核心思想：記憶化、狀態轉移方程
tags:
  - Dynamic Programming
  - DP
  - 動態規劃
  - 記憶化
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Dynamic Programming (動態規劃)

## 前言

**Dynamic Programming (DP)** 是一種透過**將問題分解成子問題**，並**儲存子問題的解**來避免重複計算的演算法策略。

---

## 核心思想

### 兩個關鍵特性

1. **重疊子問題 (Overlapping Subproblems)**
   - 子問題會被重複計算

2. **最優子結構 (Optimal Substructure)**
   - 最優解包含子問題的最優解

### DP vs 分治法

| 特性 | 分治法 | DP |
|-----|-------|---|
| **子問題** | 獨立 | **重疊** |
| **重複計算** | 可能 | **避免**（記憶化） |
| **範例** | Merge Sort | Fibonacci |

---

## 入門範例：Fibonacci 數列

### 問題

計算第 n 個 Fibonacci 數：`F(n) = F(n-1) + F(n-2)`

### 方法 1: 純遞迴 (指數時間)

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

**時間複雜度**: O(2^n)

**問題**: 大量重複計算

```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)  ← 重複計算
│       ├── fib(1)
│       └── fib(0)
└── fib(3)  ← 重複計算
    ├── fib(2)
    │   ├── fib(1)
    │   └── fib(0)
    └── fib(1)
```

### 方法 2: 記憶化搜尋 (Top-down DP)

```cpp
unordered_map<int, int> memo;

int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}
```

**時間複雜度**: O(n)
**空間複雜度**: O(n)

### 方法 3: 遞推 (Bottom-up DP)

```cpp
int fib(int n) {
    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

**時間複雜度**: O(n)
**空間複雜度**: O(n)

### 方法 4: 空間優化

```cpp
int fib(int n) {
    if (n <= 1) return n;
    
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

**時間複雜度**: O(n)
**空間複雜度**: O(1)

---

## DP 的解題步驟

### 五步法

1. **定義狀態**
   - `dp[i]` 代表什麼？

2. **找出狀態轉移方程**
   - `dp[i]` 如何從其他狀態得到？

3. **初始化**
   - Base case 是什麼？

4. **確定遍歷順序**
   - 從前往後？從後往前？

5. **返回結果**
   - 答案在哪個狀態？

---

## 經典 DP 問題

### 1. 爬樓梯 (Climbing Stairs)

**問題**: 爬 n 階樓梯，每次爬 1 或 2 階，有幾種爬法？

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

**狀態定義**: `dp[i]` = 爬到第 i 階的方法數
**轉移方程**: `dp[i] = dp[i-1] + dp[i-2]`

---

### 2. 打家劫舍 (House Robber)

**問題**: 不能搶相鄰的房子，最多能搶多少？

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    
    for (int i = 2; i < n; i++) {
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    
    return dp[n - 1];
}
```

**狀態定義**: `dp[i]` = 前 i 間房子能搶的最大金額
**轉移方程**: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
- 不搶第 i 間：`dp[i-1]`
- 搶第 i 間：`dp[i-2] + nums[i]`

---

### 3. 零錢兌換 (Coin Change)

**問題**: 用最少硬幣湊出金額

```cpp
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i >= coin && dp[i - coin] != INT_MAX) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}
```

**狀態定義**: `dp[i]` = 湊出金額 i 的最少硬幣數
**轉移方程**: `dp[i] = min(dp[i], dp[i-coin] + 1)`

---

### 4. 最長遞增子序列 (LIS)

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int maxLen = 1;
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }
    
    return maxLen;
}
```

**時間複雜度**: O(n²)
**狀態定義**: `dp[i]` = 以 nums[i] 結尾的 LIS 長度

---

## 二維 DP

### 5. 最小路徑和 (Minimum Path Sum)

```cpp
int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n));
    
    dp[0][0] = grid[0][0];
    
    // 第一行
    for (int j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    
    // 第一列
    for (int i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    
    // 其他位置
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
        }
    }
    
    return dp[m - 1][n - 1];
}
```

**狀態定義**: `dp[i][j]` = 到達 (i,j) 的最小路徑和
**轉移方程**: `dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]`

---

### 6. 編輯距離 (Edit Distance)

```cpp
int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = min({
                    dp[i - 1][j],     // 刪除
                    dp[i][j - 1],     // 插入
                    dp[i - 1][j - 1]  // 替換
                }) + 1;
            }
        }
    }
    
    return dp[m][n];
}
```

---

## 0/1 背包問題

**問題**: n 個物品，每個有重量和價值，背包容量 W，求最大價值

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(
                    dp[i - 1][w],  // 不選
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]  // 選
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][W];
}
```

**空間優化**（滾動陣列）:

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    
    for (int i = 0; i < weights.size(); i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[W];
}
```

---

## DP 的優化技巧

### 1. 空間優化（滾動陣列）

```cpp
// 原始：O(n) 空間
vector<int> dp(n);

// 優化：O(1) 空間
int prev = 0, curr = 0;
```

### 2. 狀態壓縮

```cpp
// 二維 → 一維
// dp[i][j] → dp[j]
```

### 3. 記憶化搜尋（避免重複計算）

```cpp
unordered_map<string, int> memo;

int dfs(參數) {
    string key = 生成key(參數);
    if (memo.count(key)) return memo[key];
    
    // 計算
    int result = ...;
    memo[key] = result;
    return result;
}
```

---

## LeetCode 練習題

### 基礎
- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
- [House Robber](https://leetcode.com/problems/house-robber/)
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

### 中等
- [Coin Change](https://leetcode.com/problems/coin-change/)
- [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
- [Unique Paths](https://leetcode.com/problems/unique-paths/)

### 困難
- [Edit Distance](https://leetcode.com/problems/edit-distance/)
- [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/)
- [Burst Balloons](https://leetcode.com/problems/burst-balloons/)

---

## 重點總結

### DP 的特徵
1. **重疊子問題**: 子問題會被重複計算
2. **最優子結構**: 最優解包含子問題的最優解

### 解題步驟
1. 定義狀態
2. 找轉移方程
3. 初始化
4. 確定順序
5. 返回結果

### 常見模式
- **線性 DP**: Fibonacci, 爬樓梯
- **背包 DP**: 0/1 背包, 完全背包
- **區間 DP**: 戳氣球, 合併石頭
- **樹形 DP**: 打家劫舍 III
- **狀態機 DP**: 股票買賣

### 優化方向
- 空間優化（滾動陣列）
- 狀態壓縮
- 記憶化搜尋
