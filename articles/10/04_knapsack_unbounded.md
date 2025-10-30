---
title: 10-4. 完全背包
order: 4
description: 完全背包問題的原理與應用
tags:
  - 動態規劃
  - 背包問題
  - 完全背包
  - Unbounded Knapsack
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 完全背包 (Unbounded Knapsack)

完全背包是背包問題的另一個重要變形。與 0-1 背包的區別在於:**每個物品可以選擇無限次**。

## 問題描述

有 N 種物品和一個容量為 W 的背包。第 i 種物品的重量是 `w[i]`,價值是 `v[i]`。**每種物品可以選擇任意多次**,求在不超過背包容量的前提下,能獲得的最大價值。

**範例:**
```
物品: 1   2   3
重量: 2   3   4
價值: 3   4   5
背包容量: 8

最優解: 選擇物品 1 四次,重量 = 2×4 = 8,價值 = 3×4 = 12
或: 選擇物品 2 兩次、物品 1 一次,重量 = 3×2+2 = 8,價值 = 4×2+3 = 11
實際最優: 物品 1 四次,價值 = 12
```

## 核心特徵

1. **每個物品可以選無限次**
2. **有容量限制**
3. **求最大價值/最小成本**

## 與 0-1 背包的區別

| 特性 | 0-1 背包 | 完全背包 |
|------|----------|----------|
| 物品使用次數 | 每個最多 1 次 | 每個無限次 |
| 空間優化時的遍歷順序 | **逆序** | **正序** |
| 狀態轉移 | 從 i-1 層轉移 | 從 i 層或 i-1 層轉移 |

## 狀態定義

### 二維 DP
```cpp
dp[i][j]  // 考慮前 i 種物品,背包容量為 j 時的最大價值
```

### 一維 DP
```cpp
dp[j]  // 背包容量為 j 時的最大價值
```

## 狀態轉移方程

### 二維 DP

對於第 i 種物品,可以選擇 0 次、1 次、2 次、...、k 次:

```cpp
dp[i][j] = max(dp[i-1][j],                      // 不選
               dp[i-1][j-w[i]] + v[i],          // 選 1 次
               dp[i-1][j-2*w[i]] + 2*v[i],      // 選 2 次
               ...
               dp[i-1][j-k*w[i]] + k*v[i])      // 選 k 次
```

其中 `k = j / w[i]`

**優化後的轉移方程:**
```cpp
dp[i][j] = max(dp[i-1][j],           // 不選第 i 種物品
               dp[i][j-w[i]] + v[i]) // 選第 i 種物品(可能已經選過)
```

**為什麼可以這樣優化?**
```
dp[i][j-w[i]] = max(dp[i-1][j-w[i]],
                    dp[i][j-2*w[i]] + v[i],
                    ...)

所以:
dp[i][j] = max(dp[i-1][j], dp[i][j-w[i]] + v[i])
```

注意這裡用的是 `dp[i][j-w[i]]` 而不是 `dp[i-1][j-w[i]]`,這意味著**同一種物品可以被重複選擇**。

### 一維 DP (空間優化)

```cpp
dp[j] = max(dp[j], dp[j-w[i]] + v[i])
```

**關鍵:必須正序遍歷!**

## 遍歷順序的關鍵

### 0-1 背包: 逆序遍歷
```cpp
for (int i = 0; i < n; i++) {
    for (int j = W; j >= w[i]; j--) {  // 逆序!
        dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
    }
}
```

**原因:** 保證 `dp[j-w[i]]` 是上一層(i-1)的值,每個物品只用一次。

### 完全背包: 正序遍歷
```cpp
for (int i = 0; i < n; i++) {
    for (int j = w[i]; j <= W; j++) {  // 正序!
        dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
    }
}
```

**原因:** 允許 `dp[j-w[i]]` 是當前層(i)的值,物品可以被重複使用。

**遍歷順序對比:**
```
0-1 背包 (逆序):
j = 8: dp[8] = max(dp[8], dp[6] + v[i])  // dp[6] 是舊值
j = 6: dp[6] = max(dp[6], dp[4] + v[i])  // 更新 dp[6]
→ dp[8] 和 dp[6] 只用了 1 次物品 i

完全背包 (正序):
j = 2: dp[2] = max(dp[2], dp[0] + v[i])  // 更新 dp[2]
j = 4: dp[4] = max(dp[4], dp[2] + v[i])  // dp[2] 是新值!
j = 6: dp[6] = max(dp[6], dp[4] + v[i])  // dp[4] 是新值!
→ 物品 i 可能被用了多次
```

## 基本實現

### 解法 1: 二維 DP (樸素)

```cpp
class UnboundedKnapsack {
public:
    int knapsack(int W, vector<int>& w, vector<int>& v) {
        int n = w.size();
        vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= W; j++) {
                // 不選第 i 種物品
                dp[i][j] = dp[i-1][j];

                // 選第 i 種物品(可能選多次)
                if (j >= w[i-1]) {
                    dp[i][j] = max(dp[i][j],
                                   dp[i][j-w[i-1]] + v[i-1]);
                }
            }
        }

        return dp[n][W];
    }
};
```

**時間複雜度:** O(n × W)
**空間複雜度:** O(n × W)

### 解法 2: 一維優化 (推薦)

```cpp
class UnboundedKnapsack {
public:
    int knapsack(int W, vector<int>& w, vector<int>& v) {
        int n = w.size();
        vector<int> dp(W + 1, 0);

        for (int i = 0; i < n; i++) {
            // 正序遍歷!
            for (int j = w[i]; j <= W; j++) {
                dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
            }
        }

        return dp[W];
    }
};
```

**時間複雜度:** O(n × W)
**空間複雜度:** O(W)

---

## 經典問題 1: 零錢兌換 (Coin Change)

[LeetCode 322. Coin Change](https://leetcode.com/problems/coin-change/)

### 問題描述

給定不同面額的硬幣 coins 和一個總金額 amount。計算可以湊成總金額所需的**最少的硬幣個數**。如果無法湊成,返回 -1。假設每種硬幣有無限個。

**範例:**
```
輸入: coins = [1, 2, 5], amount = 11
輸出: 3
解釋: 11 = 5 + 5 + 1

輸入: coins = [2], amount = 3
輸出: -1
```

### 問題分析

這是典型的**完全背包問題**:
- 每種硬幣可以用無限次
- 背包容量是 amount
- 求最少硬幣個數(最小化問題)

**狀態定義:**
- `dp[j]`: 湊成金額 j 所需的最少硬幣數

**狀態轉移:**
```cpp
dp[j] = min(dp[j], dp[j-coin] + 1)
```

**初始化:**
```cpp
dp[0] = 0;           // 金額 0 需要 0 個硬幣
dp[j] = INT_MAX;     // 其他金額初始化為無窮大
```

### 解法實現

```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX);
        dp[0] = 0;

        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                if (dp[j-coin] != INT_MAX) {
                    dp[j] = min(dp[j], dp[j-coin] + 1);
                }
            }
        }

        return dp[amount] == INT_MAX ? -1 : dp[amount];
    }
};
```

**時間複雜度:** O(n × amount)
**空間複雜度:** O(amount)

**DP 狀態表 (coins=[1,2,5], amount=11):**
```
     j→  0   1   2   3   4   5   6   7   8   9  10  11
初始    0   ∞   ∞   ∞   ∞   ∞   ∞   ∞   ∞   ∞   ∞   ∞
coin=1  0   1   2   3   4   5   6   7   8   9  10  11
coin=2  0   1   1   2   2   3   3   4   4   5   5   6
coin=5  0   1   1   2   2   1   2   2   3   3   2   3

dp[11] = 3 (5+5+1)
```

---

## 經典問題 2: 零錢兌換 II (Coin Change II)

[LeetCode 518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)

### 問題描述

給定不同面額的硬幣和一個總金額,計算可以湊成總金額的**硬幣組合數**。假設每種硬幣有無限個。

**範例:**
```
輸入: amount = 5, coins = [1, 2, 5]
輸出: 4
解釋: 有四種方式可以湊成總金額:
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
```

### 問題分析

這是**計數型完全背包**問題。

**關鍵區別:**
- 求**組合數**(不考慮順序)
- [1,2,2] 和 [2,1,2] 算同一種組合

**狀態定義:**
- `dp[j]`: 湊成金額 j 的組合數

**狀態轉移:**
```cpp
dp[j] += dp[j-coin]
```

**初始化:**
```cpp
dp[0] = 1;  // 湊成 0 有 1 種方法(不選任何硬幣)
```

**遍歷順序很關鍵!**

### 解法實現

```cpp
class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> dp(amount + 1, 0);
        dp[0] = 1;

        // 外層遍歷硬幣,內層遍歷金額
        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] += dp[j-coin];
            }
        }

        return dp[amount];
    }
};
```

**時間複雜度:** O(n × amount)
**空間複雜度:** O(amount)

### 組合 vs 排列

**這題求組合,外層遍歷物品:**
```cpp
for (int coin : coins) {
    for (int j = coin; j <= amount; j++) {
        dp[j] += dp[j-coin];
    }
}
```

**如果求排列(考慮順序),外層遍歷容量:**
```cpp
for (int j = 1; j <= amount; j++) {
    for (int coin : coins) {
        if (j >= coin) {
            dp[j] += dp[j-coin];
        }
    }
}
```

**為什麼順序不同會影響結果?**

以 amount=3, coins=[1,2] 為例:

**組合(外層物品):**
```
coin=1: dp[1]=1, dp[2]=1, dp[3]=1  // 只用 1
coin=2: dp[2]=2, dp[3]=2           // 加上用 2 的情況
結果: [1,1,1], [1,2] → 2 種組合
```

**排列(外層容量):**
```
j=1: dp[1]=1   // [1]
j=2: dp[2]=2   // [1,1], [2]
j=3: dp[3]=3   // [1,1,1], [1,2], [2,1]
結果: 3 種排列
```

---

## 經典問題 3: 組合總和 IV (Combination Sum IV)

[LeetCode 377. Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

### 問題描述

給定一個由不同整數組成的數組 nums 和一個目標整數 target。請計算並返回可以從 nums 中選出元素來組成 target 的不同組合的個數。**順序不同的序列被視為不同的組合。**

**範例:**
```
輸入: nums = [1, 2, 3], target = 4
輸出: 7
解釋:
1+1+1+1
1+1+2
1+2+1
1+3
2+1+1
2+2
3+1
```

### 問題分析

這題求的是**排列數**(考慮順序),不是組合數!

**遍歷順序:** 外層容量,內層物品

### 解法實現

```cpp
class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<unsigned int> dp(target + 1, 0);
        dp[0] = 1;

        // 外層遍歷目標值,內層遍歷數字
        for (int j = 1; j <= target; j++) {
            for (int num : nums) {
                if (j >= num) {
                    dp[j] += dp[j-num];
                }
            }
        }

        return dp[target];
    }
};
```

**注意:** 使用 `unsigned int` 避免溢出。

**時間複雜度:** O(target × n)
**空間複雜度:** O(target)

---

## 經典問題 4: 單詞拆分 (Word Break)

[LeetCode 139. Word Break](https://leetcode.com/problems/word-break/)

### 問題描述

給定一個字符串 s 和一個字符串字典 wordDict,判斷 s 是否可以被空格拆分為一個或多個在字典中出現的單詞。字典中的同一個單詞可能在拆分中被重複使用多次。

**範例:**
```
輸入: s = "leetcode", wordDict = ["leet", "code"]
輸出: true
解釋: "leetcode" 可以拆分為 "leet code"

輸入: s = "applepenapple", wordDict = ["apple", "pen"]
輸出: true
解釋: "applepenapple" 可以拆分為 "apple pen apple"
```

### 問題分析

這是**完全背包的變形**:
- 字符串 s 是"背包"
- 單詞是"物品",可以重複使用
- 判斷能否恰好裝滿

**狀態定義:**
- `dp[i]`: 字符串前 i 個字符能否被拆分

**狀態轉移:**
對於位置 i,枚舉所有可能的單詞結尾位置 j:
```cpp
if (dp[j] && s.substr(j, i-j) in wordDict) {
    dp[i] = true;
}
```

### 解法實現

```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        vector<bool> dp(n + 1, false);
        dp[0] = true;  // 空串可以被拆分

        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i-j))) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[n];
    }
};
```

**時間複雜度:** O(n² × L),其中 L 是平均單詞長度
**空間複雜度:** O(n)

**優化:** 可以先記錄最長單詞長度,減少內層循環範圍。

---

## 完全背包 vs 0-1 背包對比

| 特性 | 0-1 背包 | 完全背包 |
|------|----------|----------|
| 物品使用 | 每個最多 1 次 | 每個無限次 |
| 轉移方程 | `dp[i][j] = max(dp[i-1][j], dp[i-1][j-w]+v)` | `dp[i][j] = max(dp[i-1][j], dp[i][j-w]+v)` |
| 一維優化遍歷 | **逆序** `for (j = W; j >= w; j--)` | **正序** `for (j = w; j <= W; j++)` |
| 典型問題 | 分割子集、目標和 | 零錢兌換、組合總和 |

**記憶技巧:**
- 0-1: 每個只能用 1 次 → 逆序(防止重複使用)
- 完全: 每個可以用多次 → 正序(允許重複使用)

---

## 完全背包總結

### 關鍵要點

1. **核心特徵:** 每個物品可以選無限次

2. **與 0-1 背包的唯一區別:** 遍歷順序
   - 0-1: 逆序
   - 完全: 正序

3. **組合 vs 排列:**
   - 組合(不考慮順序): 外層物品,內層容量
   - 排列(考慮順序): 外層容量,內層物品

4. **常見應用:**
   - 零錢兌換
   - 組合問題
   - 字符串拆分

### 解題模板

```cpp
// 完全背包標準模板
vector<int> dp(W + 1, 0);

for (int i = 0; i < n; i++) {
    for (int j = w[i]; j <= W; j++) {  // 正序!
        dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
    }
}

return dp[W];
```

### 變形問題

1. **求最小值:**
```cpp
vector<int> dp(W + 1, INT_MAX);
dp[0] = 0;
for (int i = 0; i < n; i++) {
    for (int j = w[i]; j <= W; j++) {
        if (dp[j-w[i]] != INT_MAX) {
            dp[j] = min(dp[j], dp[j-w[i]] + 1);
        }
    }
}
```

2. **求組合數:**
```cpp
vector<int> dp(W + 1, 0);
dp[0] = 1;
for (int i = 0; i < n; i++) {  // 外層物品
    for (int j = w[i]; j <= W; j++) {
        dp[j] += dp[j-w[i]];
    }
}
```

3. **求排列數:**
```cpp
vector<int> dp(W + 1, 0);
dp[0] = 1;
for (int j = 1; j <= W; j++) {  // 外層容量
    for (int i = 0; i < n; i++) {
        if (j >= w[i]) {
            dp[j] += dp[j-w[i]];
        }
    }
}
```

### 常見錯誤

1. **遍歷順序錯誤**
   - 完全背包用逆序 → 錯誤(會變成 0-1 背包)

2. **組合與排列混淆**
   - 外層循環順序影響結果

3. **初始化錯誤**
   - 求最小值時忘記初始化為 INF
   - 求方案數時忘記 dp[0] = 1

4. **溢出問題**
   - 方案數可能很大,使用 unsigned int 或取模

### 複雜度分析

- **時間複雜度:** O(n × W)
- **空間複雜度:** O(W)

---

完全背包與 0-1 背包是背包問題的兩大基石。掌握它們的核心差異(遍歷順序)是解決各類背包變形的關鍵。接下來我們將學習序列 DP,包括經典的 LIS、LCS 和編輯距離問題。
