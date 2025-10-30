---
title: 10-1. 1 維 DP
order: 1
description: 一維動態規劃的經典問題與解法
tags:
  - 動態規劃
  - 1D DP
  - 序列問題
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 1 維 DP

1 維動態規劃是最基礎也是最常見的 DP 類型。在這類問題中，狀態通常只需要一個維度來表示，通常是 `dp[i]`，表示「到第 i 個位置」或「考慮前 i 個元素」時的最優解。

## 問題特徵

1. 問題涉及**線性序列**（數組、字符串等）
2. 決策只依賴於**前面的狀態**
3. 通常求解「前 i 個元素」的某種最優值或計數
4. 狀態轉移只需要考慮**常數個前驅狀態**

## 狀態定義模式

| 定義方式 | 含義 | 適用場景 |
|----------|------|----------|
| `dp[i]` | 以第 i 個元素**結尾**的最優解 | 最大子數組和、最長遞增子序列 |
| `dp[i]` | **前 i 個元素**的最優解 | 爬樓梯、打家劫舍 |
| `dp[i]` | 到達第 i 個位置的**方法數/狀態數** | 計數問題 |

## 核心模板

```cpp
// 基本 1D DP 模板
vector<int> dp(n + 1);

// 1. 初始化
dp[0] = base_case;

// 2. 狀態轉移
for (int i = 1; i <= n; i++) {
    // 從前面的狀態轉移
    dp[i] = function(dp[i-1], dp[i-2], ...);
}

// 3. 返回答案
return dp[n];
```

---

## 經典問題 1：爬樓梯 (Climbing Stairs)

[LeetCode 70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

### 問題描述

假設你正在爬樓梯。需要 n 階你才能到達樓頂。每次你可以爬 1 或 2 個台階。你有多少種不同的方法可以爬到樓頂呢？

### 問題分析

這是最經典的 1D DP 入門題。

**狀態定義：**
- `dp[i]`：到達第 i 階樓梯的方法數

**狀態轉移：**
- 要到達第 i 階，可以從第 i-1 階爬 1 步，或從第 i-2 階爬 2 步
- 因此：`dp[i] = dp[i-1] + dp[i-2]`

**初始化：**
- `dp[0] = 1`（站在地面，1 種方法）
- `dp[1] = 1`（到第 1 階，1 種方法）

**轉移示意圖：**
```
位置:   0   1   2   3   4   5
方法數: 1   1   2   3   5   8
             ↑   ↑
             |   |
        從1階 + 從0階
        (1種) (1種) = 2種
```

### 解法實現

#### 解法 1：基本 DP（Bottom-up）

```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;

        vector<int> dp(n + 1);
        dp[0] = 1;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }

        return dp[n];
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

#### 解法 2：空間優化

因為只依賴前兩個狀態，可以用兩個變量代替數組。

```cpp
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;

        int prev2 = 1;  // dp[i-2]
        int prev1 = 1;  // dp[i-1]

        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }

        return prev1;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(1)

#### 解法 3：記憶化搜索（Top-down）

```cpp
class Solution {
private:
    vector<int> memo;

    int helper(int n) {
        if (n <= 1) return 1;
        if (memo[n] != -1) return memo[n];

        memo[n] = helper(n - 1) + helper(n - 2);
        return memo[n];
    }

public:
    int climbStairs(int n) {
        memo.assign(n + 1, -1);
        return helper(n);
    }
};
```

---

## 經典問題 2：打家劫舍 (House Robber)

[LeetCode 198. House Robber](https://leetcode.com/problems/house-robber/)

### 問題描述

你是一個專業的小偷，計劃偷竊沿街的房屋。每間房內都藏有一定的現金，但相鄰的房屋裝有相互連通的防盜系統，如果兩間相鄰的房屋在同一晚上被小偷闖入，系統會自動報警。

給定一個代表每個房屋存放金額的非負整數數組，計算你在不觸動警報裝置的情況下，一夜之內能夠偷竊到的最高金額。

**範例：**
```
輸入: nums = [1, 2, 3, 1]
輸出: 4
解釋: 偷竊 1 號房屋 (金額 = 1) ，然後偷竊 3 號房屋 (金額 = 3)。
     偷竊到的最高金額 = 1 + 3 = 4。
```

### 問題分析

這是一個典型的「選或不選」問題。

**狀態定義：**
- `dp[i]`：考慮前 i 間房屋（第 0 到第 i-1 間），能夠偷竊到的最高金額

**狀態轉移：**
對於第 i 間房屋（索引 i-1），有兩種選擇：
1. **不偷第 i 間房**：`dp[i] = dp[i-1]`
2. **偷第 i 間房**：不能偷第 i-1 間，所以 `dp[i] = dp[i-2] + nums[i-1]`

取兩者的最大值：
```
dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])
```

**初始化：**
- `dp[0] = 0`（沒有房屋，偷不到錢）
- `dp[1] = nums[0]`（只有一間房，偷這間）

**DP 狀態表：**
```
房屋:   [1,  2,  3,  1]
索引:    0   1   2   3

i    dp[i]   決策
0      0     無房屋
1      1     偷 nums[0] = 1
2      2     不偷 nums[1]，取 max(1, 0+2) = 2
3      4     偷 nums[2]，取 max(2, 1+3) = 4
4      4     不偷 nums[3]，取 max(4, 2+1) = 4
```

### 解法實現

#### 解法 1：基本 DP

```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];

        vector<int> dp(n + 1);
        dp[0] = 0;
        dp[1] = nums[0];

        for (int i = 2; i <= n; i++) {
            // 不偷第 i 間 vs 偷第 i 間
            dp[i] = max(dp[i-1], dp[i-2] + nums[i-1]);
        }

        return dp[n];
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

#### 解法 2：空間優化

```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];

        int prev2 = 0;           // dp[i-2]
        int prev1 = nums[0];     // dp[i-1]

        for (int i = 2; i <= n; i++) {
            int curr = max(prev1, prev2 + nums[i-1]);
            prev2 = prev1;
            prev1 = curr;
        }

        return prev1;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(1)

---

## 經典問題 3：最大子數組和 (Maximum Subarray)

[LeetCode 53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

### 問題描述

給定一個整數數組 nums，找到一個具有最大和的連續子數組（子數組最少包含一個元素），返回其最大和。

**範例：**
```
輸入: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
輸出: 6
解釋: 連續子數組 [4, -1, 2, 1] 的和最大，為 6。
```

### 問題分析

這是 Kadane's Algorithm 的應用。

**狀態定義：**
- `dp[i]`：以第 i 個元素**結尾**的最大子數組和

注意這裡的狀態定義：**必須包含第 i 個元素**。

**狀態轉移：**
對於第 i 個元素，有兩種選擇：
1. 接續前面的子數組：`dp[i-1] + nums[i]`
2. 從當前元素重新開始：`nums[i]`

取兩者的最大值：
```
dp[i] = max(dp[i-1] + nums[i], nums[i])
```

可以簡化為：
```
dp[i] = max(0, dp[i-1]) + nums[i]
```

**初始化：**
- `dp[0] = nums[0]`

**最終答案：**
- `max(dp[0], dp[1], ..., dp[n-1])`

**DP 狀態表：**
```
索引 i:     0    1    2    3    4    5    6    7    8
nums[i]:   -2    1   -3    4   -1    2    1   -5    4
dp[i]:     -2    1   -2    4    3    5    6    1    5
            ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
          開始  重新  接續  重新  接續  接續  接續  接續  接續
                開始        開始

最大值 = 6 (在索引 6)
```

### 解法實現

#### 解法 1：基本 DP

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n);
        dp[0] = nums[0];
        int maxSum = dp[0];

        for (int i = 1; i < n; i++) {
            // 接續前面 or 重新開始
            dp[i] = max(dp[i-1] + nums[i], nums[i]);
            maxSum = max(maxSum, dp[i]);
        }

        return maxSum;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

#### 解法 2：空間優化（Kadane's Algorithm）

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxEndingHere = nums[0];  // dp[i]
        int maxSoFar = nums[0];       // 全局最大值

        for (int i = 1; i < nums.size(); i++) {
            maxEndingHere = max(maxEndingHere + nums[i], nums[i]);
            maxSoFar = max(maxSoFar, maxEndingHere);
        }

        return maxSoFar;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(1)

#### 解法 3：更簡潔的寫法

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currSum = 0;
        int maxSum = INT_MIN;

        for (int num : nums) {
            currSum = max(currSum + num, num);
            maxSum = max(maxSum, currSum);
        }

        return maxSum;
    }
};
```

---

## 經典問題 4：最大乘積子數組 (Maximum Product Subarray)

[LeetCode 152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

### 問題描述

給定一個整數數組 nums，找出數組中乘積最大的連續子數組（至少包含一個數字），返回其乘積。

**範例：**
```
輸入: nums = [2, 3, -2, 4]
輸出: 6
解釋: 子數組 [2, 3] 有最大乘積 6。

輸入: nums = [-2, 0, -1]
輸出: 0
```

### 問題分析

這題與最大子數組和類似，但因為涉及乘法，**負數**會使問題變得複雜：
- 負數 × 負數 = 正數（最小值可能變成最大值）
- 負數 × 正數 = 負數

因此需要**同時維護最大值和最小值**。

**狀態定義：**
- `maxDP[i]`：以第 i 個元素結尾的最大乘積
- `minDP[i]`：以第 i 個元素結尾的最小乘積

**狀態轉移：**
對於第 i 個元素：
```cpp
maxDP[i] = max({nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]});
minDP[i] = min({nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]});
```

為什麼需要考慮 `minDP[i-1] * nums[i]`？
- 如果 `nums[i]` 是負數，之前的最小值（負數）乘以它會變成最大值

**DP 狀態表：**
```
索引:      0    1    2    3
nums:      2    3   -2    4
maxDP:     2    6   -2   24
minDP:     2    2  -12  -48

i = 0: max = 2, min = 2
i = 1: max = max(3, 2*3, 2*3) = 6, min = min(3, 6, 6) = 3 → 實際 min = 2
i = 2: max = max(-2, 6*-2, 3*-2) = -2, min = min(-2, -12, -6) = -12
i = 3: max = max(4, -2*4, -12*4) = max(4, -8, -48) = 4
       但如果繼續用之前的 min: -12 * 4 = -48
       實際上 max 應該是 -2 * 4 = -8 or 重新開始 = 4

正確計算：
i = 2: max = max(-2, 6*-2=-12, 2*-2=-4) = -2
       min = min(-2, -12, -4) = -12
i = 3: max = max(4, -2*4=-8, -12*4=-48) = 4
```

實際上題目範例 `[2,3,-2,4]` 的答案是 6（子數組 [2,3]）。

### 解法實現

#### 解法 1：維護最大最小值

```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;

        int maxDP = nums[0];
        int minDP = nums[0];
        int result = nums[0];

        for (int i = 1; i < n; i++) {
            // 如果當前數是負數，交換 max 和 min
            if (nums[i] < 0) {
                swap(maxDP, minDP);
            }

            // 更新最大最小值
            maxDP = max(nums[i], maxDP * nums[i]);
            minDP = min(nums[i], minDP * nums[i]);

            result = max(result, maxDP);
        }

        return result;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(1)

#### 解法 2：不使用 swap

```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;

        int maxDP = nums[0];
        int minDP = nums[0];
        int result = nums[0];

        for (int i = 1; i < n; i++) {
            int temp = maxDP;
            maxDP = max({nums[i], maxDP * nums[i], minDP * nums[i]});
            minDP = min({nums[i], temp * nums[i], minDP * nums[i]});
            result = max(result, maxDP);
        }

        return result;
    }
};
```

---

## 經典問題 5：打家劫舍 II (House Robber II)

[LeetCode 213. House Robber II](https://leetcode.com/problems/house-robber-ii/)

### 問題描述

房屋排列成一個**圓環**，第一間房和最後一間房相鄰。求在不觸動警報的情況下，能偷竊到的最高金額。

**範例：**
```
輸入: nums = [2, 3, 2]
輸出: 3
解釋: 你不能先偷 1 號房屋（金額 = 2），然後偷 3 號房屋（金額 = 2），因為他們是相鄰的。
```

### 問題分析

這是 House Robber I 的變形。因為首尾相連，所以：
- 如果偷了第 1 間房，就不能偷最後 1 間房
- 如果偷了最後 1 間房，就不能偷第 1 間房

**解法思路：**
分兩種情況討論：
1. 考慮房屋 [0, n-2]（不包括最後一間）
2. 考慮房屋 [1, n-1]（不包括第一間）

取兩者的最大值。

### 解法實現

```cpp
class Solution {
private:
    int robRange(vector<int>& nums, int start, int end) {
        int prev2 = 0;
        int prev1 = 0;

        for (int i = start; i <= end; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }

        return prev1;
    }

public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);

        // 情況 1: 偷 [0, n-2]
        int case1 = robRange(nums, 0, n - 2);

        // 情況 2: 偷 [1, n-1]
        int case2 = robRange(nums, 1, n - 1);

        return max(case1, case2);
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(1)

---

## 其他經典 1D DP 問題

### LeetCode 91. Decode Ways

類似爬樓梯，但需要判斷字符組合的有效性。

### LeetCode 139. Word Break

字符串分割問題，`dp[i]` 表示前 i 個字符能否分割。

### LeetCode 300. Longest Increasing Subsequence

最長遞增子序列（將在序列 DP 章節詳細討論）。

---

## 1D DP 總結

### 關鍵要點

1. **狀態定義要明確**
   - `dp[i]` 表示的是「以 i 結尾」還是「前 i 個元素」？
   - 狀態必須包含足夠的信息來做決策

2. **轉移方程通常很簡潔**
   - `dp[i] = f(dp[i-1], dp[i-2], ...)`
   - 通常只需要考慮前面少數幾個狀態

3. **空間優化很常見**
   - 如果只依賴前 k 個狀態，可以用 k 個變量代替數組
   - 降低空間複雜度從 O(n) 到 O(1)

4. **初始化很重要**
   - 確保邊界條件正確
   - 有時需要 `dp[0]` 作為虛擬狀態

### 解題步驟

1. 確定狀態定義：`dp[i]` 表示什麼？
2. 推導轉移方程：如何從 `dp[i-1]`, `dp[i-2]`, ... 推導出 `dp[i]`？
3. 確定初始條件：`dp[0]`, `dp[1]` 的值是什麼？
4. 確定遍歷順序：從前往後還是從後往前？
5. 考慮空間優化：是否可以用滾動變量代替數組？

### 複雜度分析

- **時間複雜度：** 通常是 O(n) 或 O(n²)
  - 一層循環：O(n)
  - 兩層循環：O(n²)
- **空間複雜度：** O(n) 或 O(1)
  - 未優化：O(n)
  - 滾動變量優化：O(1)

### 常見錯誤

1. 狀態定義模糊不清
2. 初始化錯誤（特別是邊界條件）
3. 轉移方程考慮不全面
4. 忘記更新全局最大值（如最大子數組和）
5. 空間優化時覆蓋了需要的值

---

通過掌握 1D DP，你已經為學習更複雜的 DP 問題打下了堅實的基礎。接下來我們將學習 2D DP、區間 DP、背包 DP 等更高級的主題。
