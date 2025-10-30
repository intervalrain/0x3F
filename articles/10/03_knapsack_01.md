---
title: 10-3. 0-1 背包 DP
order: 3
description: 0-1 背包問題的原理與變形
tags:
  - 動態規劃
  - 背包問題
  - 0-1 Knapsack
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 0-1 背包 DP (0-1 Knapsack)

0-1 背包問題是動態規劃中最經典、最重要的問題之一。它不僅本身是一個重要的問題類型,更是許多 DP 問題的基礎模型。

## 問題描述

有 N 件物品和一個容量為 W 的背包。第 i 件物品的重量是 `w[i]`,價值是 `v[i]`。每件物品**只能選擇一次**(要麼拿,要麼不拿),求在不超過背包容量的前提下,能獲得的最大價值。

**範例:**
```
物品: 1   2   3   4
重量: 2   3   4   5
價值: 3   4   5   6
背包容量: 8

最優解: 選擇物品 2 和 3,重量 = 3+4 = 7,價值 = 4+5 = 9
```

## 核心特徵

1. **每個物品只能選一次**
2. **有容量限制**
3. **求最大價值/最小成本**
4. **選或不選的決策**

## 狀態定義

```cpp
dp[i][j]  // 考慮前 i 個物品,背包容量為 j 時的最大價值
```

其中:
- `i` 表示考慮前 i 個物品 (0 ≤ i ≤ n)
- `j` 表示背包剩餘容量 (0 ≤ j ≤ W)
- `dp[i][j]` 表示在這種情況下能獲得的最大價值

## 狀態轉移方程

對於第 i 個物品(索引 i-1),有兩種選擇:

### 1. 不選第 i 個物品
```cpp
dp[i][j] = dp[i-1][j]
```

### 2. 選第 i 個物品
前提: `j >= w[i-1]` (背包有足夠空間)
```cpp
dp[i][j] = dp[i-1][j - w[i-1]] + v[i-1]
```

### 綜合
```cpp
if (j >= w[i-1]) {
    dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i-1]] + v[i-1]);
} else {
    dp[i][j] = dp[i-1][j];  // 裝不下,只能不選
}
```

## 初始化

```cpp
// 不考慮任何物品時,價值為 0
for (int j = 0; j <= W; j++) {
    dp[0][j] = 0;
}

// 容量為 0 時,無法裝入任何物品
for (int i = 0; i <= n; i++) {
    dp[i][0] = 0;
}
```

## DP 狀態表示例

**物品資訊:**
```
i   w[i]  v[i]
1    2     3
2    3     4
3    4     5
4    5     6
```

**DP 表 (W = 8):**
```
     j→  0   1   2   3   4   5   6   7   8
i↓
0        0   0   0   0   0   0   0   0   0
1 (2,3)  0   0   3   3   3   3   3   3   3
2 (3,4)  0   0   3   4   4   7   7   7   7
3 (4,5)  0   0   3   4   5   7   8   9   9
4 (5,6)  0   0   3   4   5   7   8   9   10

解釋:
dp[1][2]: 考慮物品1,容量2,選物品1 → 價值3
dp[2][5]: 考慮物品1,2,容量5,選物品1,2 → 價值7
dp[3][7]: 考慮物品1,2,3,容量7,選物品2,3 → 價值9
dp[4][8]: 考慮物品1,2,3,4,容量8,選物品2,4 → 價值10
```

## 基本實現

### 解法 1: 二維 DP

```cpp
class Knapsack {
public:
    int knapsack01(int W, vector<int>& w, vector<int>& v) {
        int n = w.size();
        vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= W; j++) {
                // 不選第 i 個物品
                dp[i][j] = dp[i-1][j];

                // 選第 i 個物品(如果裝得下)
                if (j >= w[i-1]) {
                    dp[i][j] = max(dp[i][j],
                                   dp[i-1][j-w[i-1]] + v[i-1]);
                }
            }
        }

        return dp[n][W];
    }
};
```

**時間複雜度:** O(n × W)
**空間複雜度:** O(n × W)

### 解法 2: 一維滾動數組優化

觀察狀態轉移方程,`dp[i][j]` 只依賴於 `dp[i-1][...]`,因此可以用一維數組優化。

**關鍵:必須從後往前遍歷容量!**

為什麼要逆序?
- 正序會導致 `dp[j-w[i]]` 已經被更新為第 i 層的值
- 逆序保證 `dp[j-w[i]]` 仍是第 i-1 層的值

```cpp
class Knapsack {
public:
    int knapsack01(int W, vector<int>& w, vector<int>& v) {
        int n = w.size();
        vector<int> dp(W + 1, 0);

        for (int i = 0; i < n; i++) {
            // 必須逆序遍歷!
            for (int j = W; j >= w[i]; j--) {
                dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
            }
        }

        return dp[W];
    }
};
```

**時間複雜度:** O(n × W)
**空間複雜度:** O(W)

**逆序遍歷示意:**
```
處理物品 i 時:
j: W → w[i]

j = 8: dp[8] = max(dp[8], dp[8-w[i]] + v[i])
              使用的是 dp[8-w[i]] 的舊值 ✓

j = 7: dp[7] = max(dp[7], dp[7-w[i]] + v[i])
              使用的是 dp[7-w[i]] 的舊值 ✓

如果正序:
j = 2: dp[2] = max(dp[2], dp[2-w[i]] + v[i])  更新了 dp[2]
j = 4: dp[4] = max(dp[4], dp[4-2] + v[i])
              = max(dp[4], dp[2] + v[i])
              使用的是新的 dp[2] ✗ (錯誤!)
```

---

## 經典問題 1: 分割等和子集 (Partition Equal Subset Sum)

[LeetCode 416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

### 問題描述

給定一個只包含正整數的非空數組,判斷是否可以將這個數組分割成兩個子集,使得兩個子集的元素和相等。

**範例:**
```
輸入: nums = [1, 5, 11, 5]
輸出: true
解釋: 數組可以分割成 [1, 5, 5] 和 [11]

輸入: nums = [1, 2, 3, 5]
輸出: false
```

### 問題分析

這是一個偽裝的 0-1 背包問題!

**轉換為背包問題:**
- 總和 sum,目標是找到子集和為 sum/2
- 每個數字只能選一次 → 0-1 背包
- 背包容量: sum/2
- 物品重量和價值都是 nums[i]
- 問題變成:能否裝滿背包?

**狀態定義:**
- `dp[i][j]`: 使用前 i 個數字,能否組成和為 j

**狀態轉移:**
```cpp
dp[i][j] = dp[i-1][j] || dp[i-1][j-nums[i-1]]
```

**初始化:**
- `dp[0][0] = true` (不選任何數,和為0)
- `dp[0][j] = false` (j > 0)

### 解法實現

#### 解法 1: 二維 DP

```cpp
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = 0;
        for (int num : nums) sum += num;

        // 和為奇數,無法平分
        if (sum % 2 != 0) return false;

        int target = sum / 2;
        int n = nums.size();

        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
        dp[0][0] = true;

        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= target; j++) {
                // 不選 nums[i-1]
                dp[i][j] = dp[i-1][j];

                // 選 nums[i-1]
                if (j >= nums[i-1]) {
                    dp[i][j] = dp[i][j] || dp[i-1][j-nums[i-1]];
                }
            }
        }

        return dp[n][target];
    }
};
```

**時間複雜度:** O(n × sum)
**空間複雜度:** O(n × sum)

#### 解法 2: 一維優化

```cpp
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = 0;
        for (int num : nums) sum += num;

        if (sum % 2 != 0) return false;

        int target = sum / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;

        for (int num : nums) {
            // 逆序遍歷!
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j-num];
            }
        }

        return dp[target];
    }
};
```

**時間複雜度:** O(n × sum)
**空間複雜度:** O(sum)

---

## 經典問題 2: 目標和 (Target Sum)

[LeetCode 494. Target Sum](https://leetcode.com/problems/target-sum/)

### 問題描述

給定一個非負整數數組和一個目標數 target。在每個數字前添加 `+` 或 `-`,使得表達式的結果等於 target。求有多少種方法。

**範例:**
```
輸入: nums = [1, 1, 1, 1, 1], target = 3
輸出: 5
解釋:
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
```

### 問題分析

這題看起來像 DFS,但實際上是 0-1 背包的變形!

**數學轉換:**
設添加 `+` 的數字集合為 P,添加 `-` 的數字集合為 N,則:
```
sum(P) - sum(N) = target
sum(P) + sum(N) = sum(nums)

解得:
sum(P) = (target + sum(nums)) / 2
```

**問題轉換:**
找有多少種方法選出子集,使其和為 `(target + sum) / 2`

這就是一個**計數型 0-1 背包問題**!

**狀態定義:**
- `dp[j]`: 和為 j 的方法數

**狀態轉移:**
```cpp
dp[j] += dp[j - nums[i]]
```

### 解法實現

```cpp
class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int sum = 0;
        for (int num : nums) sum += num;

        // 無解的情況
        if (sum < abs(target) || (sum + target) % 2 != 0) {
            return 0;
        }

        int bagSize = (sum + target) / 2;
        vector<int> dp(bagSize + 1, 0);
        dp[0] = 1;  // 和為 0 有 1 種方法(不選)

        for (int num : nums) {
            for (int j = bagSize; j >= num; j--) {
                dp[j] += dp[j - num];
            }
        }

        return dp[bagSize];
    }
};
```

**時間複雜度:** O(n × sum)
**空間複雜度:** O(sum)

**DP 狀態表 (nums=[1,1,1,1,1], target=3, bagSize=4):**
```
     j→  0   1   2   3   4
處理前   1   0   0   0   0
處理1    1   1   0   0   0
處理1    1   2   1   0   0
處理1    1   3   3   1   0
處理1    1   4   6   4   1
處理1    1   5  10  10   5

dp[4] = 5 即為答案
```

---

## 經典問題 3: 一和零 (Ones and Zeroes)

[LeetCode 474. Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/)

### 問題描述

給定一個二進制字符串數組 strs 和兩個整數 m 和 n。找出並返回 strs 的最大子集的大小,該子集中最多有 m 個 0 和 n 個 1。

**範例:**
```
輸入: strs = ["10","0001","111001","1","0"], m = 5, n = 3
輸出: 4
解釋: 最大子集是 {"10", "0001", "1", "0"},有 5 個 0 和 3 個 1
```

### 問題分析

這是**二維費用的 0-1 背包**問題!

- 有兩個容量限制:m 個 0,n 個 1
- 每個字符串只能選一次
- 求最多能選多少個字符串

**狀態定義:**
- `dp[i][j]`: 最多有 i 個 0 和 j 個 1 時,能選的最大字符串數量

**狀態轉移:**
對於字符串 s,統計其中 0 的個數 zeros 和 1 的個數 ones:
```cpp
dp[i][j] = max(dp[i][j], dp[i-zeros][j-ones] + 1)
```

### 解法實現

```cpp
class Solution {
public:
    int findMaxForm(vector<string>& strs, int m, int n) {
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (const string& s : strs) {
            // 統計 0 和 1 的個數
            int zeros = 0, ones = 0;
            for (char c : s) {
                if (c == '0') zeros++;
                else ones++;
            }

            // 逆序遍歷(0-1 背包)
            for (int i = m; i >= zeros; i--) {
                for (int j = n; j >= ones; j--) {
                    dp[i][j] = max(dp[i][j],
                                   dp[i-zeros][j-ones] + 1);
                }
            }
        }

        return dp[m][n];
    }
};
```

**時間複雜度:** O(len × m × n),其中 len 是字符串數組長度
**空間複雜度:** O(m × n)

---

## 經典問題 4: 最後一塊石頭的重量 II (Last Stone Weight II)

[LeetCode 1049. Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

### 問題描述

有一堆石頭,每塊石頭的重量都是正整數。每一回合,選出任意兩塊石頭,將它們一起粉碎。假設石頭的重量分別為 x 和 y,且 x ≤ y。粉碎的結果:
- 如果 x == y,兩塊石頭都會被完全粉碎
- 如果 x != y,重量為 x 的石頭將會被完全粉碎,重量為 y 的石頭新重量為 y-x

最後,最多只會剩下一塊石頭。返回此石頭最小的可能重量。

**範例:**
```
輸入: stones = [2,7,4,1,8,1]
輸出: 1
解釋:
組合 2 和 4,得到 2,石頭變為 [2,7,1,8,1]
組合 7 和 8,得到 1,石頭變為 [2,1,1,1]
組合 2 和 1,得到 1,石頭變為 [1,1,1]
組合 1 和 1,得到 0,石頭變為 [1]
最後剩下 1
```

### 問題分析

這題的關鍵洞察:**將石頭分成兩堆,最後的結果是兩堆重量之差**。

假設分成兩堆 A 和 B:
- sum(A) + sum(B) = sum(stones)
- 最終結果 = |sum(A) - sum(B)|

要使結果最小,需要使 sum(A) 和 sum(B) 盡可能接近,即都接近 sum/2。

**問題轉換:**
找一個子集,使其和盡可能接近 sum/2(但不超過)。

這就是 0-1 背包問題!

**狀態定義:**
- `dp[j]`: 容量為 j 的背包能裝的最大重量

### 解法實現

```cpp
class Solution {
public:
    int lastStoneWeightII(vector<int>& stones) {
        int sum = 0;
        for (int stone : stones) sum += stone;

        int target = sum / 2;
        vector<int> dp(target + 1, 0);

        for (int stone : stones) {
            for (int j = target; j >= stone; j--) {
                dp[j] = max(dp[j], dp[j-stone] + stone);
            }
        }

        // dp[target] 是盡可能接近 target 的和
        // 另一堆的和是 sum - dp[target]
        return sum - 2 * dp[target];
    }
};
```

**時間複雜度:** O(n × sum)
**空間複雜度:** O(sum)

---

## 0-1 背包的變形

### 1. 恰好裝滿背包

**問題:** 恰好裝滿容量為 W 的背包,求最大價值。

**修改初始化:**
```cpp
vector<int> dp(W + 1, INT_MIN);  // 初始化為負無窮
dp[0] = 0;  // 容量為 0 可以恰好裝滿,價值為 0
```

**解釋:**
- 初始化為負無窮表示"不可達"
- 只有 dp[0] = 0 表示"不裝任何東西可以恰好裝滿容量 0"
- 轉移時,如果 dp[j-w[i]] 是負無窮,說明容量 j-w[i] 無法恰好裝滿

### 2. 至多裝入(不要求裝滿)

**這是標準的 0-1 背包,前面的解法都是這種。**

### 3. 求方案數

**問題:** 有多少種方法恰好裝滿背包?

**狀態定義:**
- `dp[j]`: 容量為 j 時的方案數

**轉移方程:**
```cpp
dp[j] += dp[j - w[i]]
```

**初始化:**
```cpp
dp[0] = 1;  // 不裝任何東西有 1 種方案
```

### 4. 輸出具體方案

需要記錄每個狀態的來源,最後回溯。

```cpp
// 記錄選擇
vector<vector<bool>> choice(n+1, vector<bool>(W+1, false));

for (int i = 1; i <= n; i++) {
    for (int j = W; j >= w[i-1]; j--) {
        if (dp[i-1][j-w[i-1]] + v[i-1] > dp[i-1][j]) {
            dp[i][j] = dp[i-1][j-w[i-1]] + v[i-1];
            choice[i][j] = true;  // 選了第 i 個物品
        }
    }
}

// 回溯輸出
vector<int> selected;
int j = W;
for (int i = n; i >= 1; i--) {
    if (choice[i][j]) {
        selected.push_back(i);
        j -= w[i-1];
    }
}
```

---

## 0-1 背包總結

### 關鍵要點

1. **核心特徵:** 每個物品只能選一次

2. **狀態定義:** `dp[i][j]` = 前 i 個物品,容量 j 的最優解

3. **轉移方程:** `dp[i][j] = max(不選, 選)`

4. **空間優化:** 一維數組 + **逆序遍歷**

5. **變形問題:**
   - 判斷可行性(bool)
   - 計數方案數(count)
   - 求最優值(max/min)

### 解題模板

```cpp
// 一維優化版本
vector<int> dp(W + 1, 0);

for (int i = 0; i < n; i++) {
    for (int j = W; j >= w[i]; j--) {  // 逆序!
        dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
    }
}

return dp[W];
```

### 常見錯誤

1. **空間優化時正序遍歷**
   - 必須逆序,否則會重複使用同一物品

2. **初始化錯誤**
   - 恰好裝滿:初始化為負無窮
   - 至多裝入:初始化為 0

3. **數組越界**
   - 注意 j >= w[i] 的判斷

4. **狀態定義不清**
   - 明確 dp[i][j] 的含義

### 複雜度分析

- **時間複雜度:** O(n × W)
  - n 是物品數量
  - W 是背包容量

- **空間複雜度:**
  - 二維: O(n × W)
  - 一維優化: O(W)

---

0-1 背包是動態規劃的重中之重,許多看似無關的問題都可以轉化為背包問題。掌握 0-1 背包的核心思想和解題模板,是學習更複雜 DP 問題的關鍵。接下來我們將學習完全背包,它與 0-1 背包只有細微差別,但應用同樣廣泛。
