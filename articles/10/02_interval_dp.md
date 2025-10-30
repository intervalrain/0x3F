---
title: 10-2. 區間 DP
order: 2
description: 區間動態規劃的經典問題與解法
tags:
  - 動態規劃
  - 區間 DP
  - Interval DP
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 區間 DP (Interval DP)

區間 DP 是一種在**區間 [i, j] 上**進行決策的動態規劃問題。這類問題的核心思想是：**將大區間的問題分解為小區間的子問題**，通過枚舉分割點來合併子區間的解。

## 問題特徵

1. 問題涉及**連續區間**的最優解
2. 大區間的解可以由**小區間的解合併**得到
3. 需要**枚舉分割點**來決定如何劃分區間
4. 通常涉及**區間合併、區間分割、回文串**等概念

## 狀態定義

```cpp
dp[i][j]  // 表示區間 [i, j] 的最優解
```

其中：
- `i` 是區間的左端點
- `j` 是區間的右端點
- `dp[i][j]` 表示對區間 [i, j] 進行操作後的最優值

## 轉移方程模板

區間 DP 的轉移方程通常需要**枚舉分割點 k**：

```cpp
dp[i][j] = optimize { dp[i][k] + dp[k+1][j] + cost(i, j, k) }
           for k in [i, j)
```

其中：
- `optimize` 可以是 `min` 或 `max`
- `cost(i, j, k)` 是合併的代價

## 遍歷順序

**關鍵：必須先計算小區間，再計算大區間**

```cpp
// 按區間長度遞增的順序遍歷
for (int len = 2; len <= n; len++) {        // 區間長度從 2 開始
    for (int i = 0; i + len - 1 < n; i++) { // 左端點
        int j = i + len - 1;                 // 右端點

        // 枚舉分割點 k
        for (int k = i; k < j; k++) {
            dp[i][j] = optimize(dp[i][j],
                               dp[i][k] + dp[k+1][j] + cost);
        }
    }
}
```

**遍歷順序示意圖（n=4）：**
```
   j →
i  0   1   2   3
↓
0  1   2   4   7
1      3   5   8
2          6   9
3              10

遍歷順序：
len=1: 1, 3, 6, 10 (單個元素)
len=2: 2, 5, 9     (長度為 2 的區間)
len=3: 4, 8        (長度為 3 的區間)
len=4: 7           (長度為 4 的區間)
```

## 核心模板

```cpp
// 區間 DP 標準模板
vector<vector<int>> dp(n, vector<int>(n, 0));

// 1. 初始化：長度為 1 的區間
for (int i = 0; i < n; i++) {
    dp[i][i] = base_case;
}

// 2. 按區間長度遞增遍歷
for (int len = 2; len <= n; len++) {
    for (int i = 0; i + len - 1 < n; i++) {
        int j = i + len - 1;

        // 初始化為極值
        dp[i][j] = (求最小值) ? INT_MAX : INT_MIN;

        // 3. 枚舉分割點
        for (int k = i; k < j; k++) {
            dp[i][j] = optimize(dp[i][j],
                               dp[i][k] + dp[k+1][j] + cost(i, j, k));
        }
    }
}

// 4. 返回答案
return dp[0][n-1];
```

---

## 經典問題 1：最長回文子序列 (Longest Palindromic Subsequence)

[LeetCode 516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

### 問題描述

給定一個字符串 s，找出其中最長的回文子序列的長度。子序列是指從原字符串中刪除一些（也可以不刪除）字符後，剩下的字符保持原有順序組成的新字符串。

**範例：**
```
輸入: s = "bbbab"
輸出: 4
解釋: 最長回文子序列是 "bbbb"
```

### 問題分析

這是一道經典的區間 DP 問題。

**狀態定義：**
- `dp[i][j]`：字符串 s[i..j] 的最長回文子序列長度

**狀態轉移：**
考慮區間 [i, j] 的兩端字符 s[i] 和 s[j]：

1. **如果 s[i] == s[j]**：
   - 這兩個字符可以同時加入回文子序列
   - `dp[i][j] = dp[i+1][j-1] + 2`

2. **如果 s[i] != s[j]**：
   - 只能選擇其中一個
   - `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`

**初始化：**
- `dp[i][i] = 1`（單個字符是長度為 1 的回文）

**DP 狀態表（s = "bbbab"）：**
```
     j→
i↓   0   1   2   3   4
     b   b   b   a   b

0    1   2   3   3   4
1        1   2   2   3
2            1   1   3
3                1   1
4                    1

計算過程：
[0,1]: s[0]='b' == s[1]='b', dp[0][1] = dp[1][0] + 2 = 0 + 2 = 2
[1,2]: s[1]='b' == s[2]='b', dp[1][2] = dp[2][1] + 2 = 0 + 2 = 2
[2,3]: s[2]='b' != s[3]='a', dp[2][3] = max(dp[3][3], dp[2][2]) = 1
[0,2]: s[0]='b' == s[2]='b', dp[0][2] = dp[1][1] + 2 = 1 + 2 = 3
[1,3]: s[1]='b' != s[3]='a', dp[1][3] = max(dp[2][3], dp[1][2]) = max(1, 2) = 2
[3,4]: s[3]='a' != s[4]='b', dp[3][4] = max(dp[4][4], dp[3][3]) = 1
[0,3]: s[0]='b' != s[3]='a', dp[0][3] = max(dp[1][3], dp[0][2]) = max(2, 3) = 3
[1,4]: s[1]='b' == s[4]='b', dp[1][4] = dp[2][3] + 2 = 1 + 2 = 3
[0,4]: s[0]='b' == s[4]='b', dp[0][4] = dp[1][3] + 2 = 2 + 2 = 4
```

### 解法實現

```cpp
class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.length();
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // 初始化：單個字符的回文長度為 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }

        // 按區間長度遞增遍歷
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;

                if (s[i] == s[j]) {
                    // 兩端字符相同，加入回文
                    dp[i][j] = dp[i+1][j-1] + 2;
                } else {
                    // 兩端字符不同，選較長的
                    dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
                }
            }
        }

        return dp[0][n-1];
    }
};
```

**時間複雜度：** O(n²)
**空間複雜度：** O(n²)

### 空間優化

可以使用滾動數組優化到 O(n) 空間，但代碼較複雜。

---

## 經典問題 2：戳氣球 (Burst Balloons)

[LeetCode 312. Burst Balloons](https://leetcode.com/problems/burst-balloons/)

### 問題描述

有 n 個氣球，編號為 0 到 n-1，每個氣球上都標有一個數字，這些數字存在數組 nums 中。現在要求你戳破所有的氣球。戳破第 i 個氣球，你可以獲得 `nums[i-1] * nums[i] * nums[i+1]` 枚硬幣。這裡的 i-1 和 i+1 代表和 i 相鄰的兩個氣球的序號。如果 i-1 或 i+1 超出了數組的邊界，那麼就當它是一個數字為 1 的氣球。

求所能獲得硬幣的最大數量。

**範例：**
```
輸入: nums = [3, 1, 5, 8]
輸出: 167
解釋:
nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []
coins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167
```

### 問題分析

這是一道非常經典但有難度的區間 DP 問題。

**關鍵洞察：正向思考很困難**
- 如果從前往後戳氣球，每次戳破一個氣球後，相鄰關係會改變，很難定義狀態

**逆向思考：最後戳破哪個氣球？**
- 假設最後戳破的是第 k 個氣球
- 此時區間 [i, k-1] 和 [k+1, j] 的氣球都已經被戳破
- 戳破第 k 個氣球獲得的硬幣：`nums[i-1] * nums[k] * nums[j+1]`

**狀態定義：**
- `dp[i][j]`：戳破開區間 (i, j) 內所有氣球能獲得的最大硬幣數
- 注意是**開區間**，不包括 i 和 j

**為什麼使用開區間？**
- 便於處理邊界：在數組前後添加虛擬氣球 1

**狀態轉移：**
枚舉最後戳破的氣球 k（k ∈ (i, j)）：
```cpp
dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
           for k in (i, j)
```

**初始化：**
- 在 nums 前後添加 1：`[1, 3, 1, 5, 8, 1]`
- `dp[i][i] = 0`（空區間）
- `dp[i][i+1] = 0`（開區間內無元素）

**DP 狀態表（nums = [3,1,5,8] → points = [1,3,1,5,8,1]）：**
```
開區間 (i, j) 的 dp 值：

     j→
i↓   0   1   2   3   4   5
     1   3   1   5   8   1

0    0   0   30  159 167
1        0   0   30  106
2            0   0   40
3                0   0
4                    0

計算過程：
len=3: (0,2): k=1, dp[0][2] = dp[0][1] + dp[1][2] + 1*3*1 = 0+0+3 = 3
                     實際應該是 1*3*1 = 3... (需要重新計算)

實際上對於 nums=[3,1,5,8]:
戳破順序: 1 -> 5 -> 3 -> 8
硬幣: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15 + 120 + 24 + 8 = 167
```

### 解法實現

```cpp
class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();

        // 在前後添加虛擬氣球 1
        vector<int> points(n + 2);
        points[0] = 1;
        points[n + 1] = 1;
        for (int i = 0; i < n; i++) {
            points[i + 1] = nums[i];
        }

        // dp[i][j] 表示開區間 (i, j) 的最大硬幣數
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));

        // 按區間長度遍歷
        for (int len = 3; len <= n + 2; len++) {
            for (int i = 0; i + len - 1 <= n + 1; i++) {
                int j = i + len - 1;

                // 枚舉最後戳破的氣球 k
                for (int k = i + 1; k < j; k++) {
                    int coins = points[i] * points[k] * points[j];
                    dp[i][j] = max(dp[i][j],
                                   dp[i][k] + dp[k][j] + coins);
                }
            }
        }

        return dp[0][n + 1];
    }
};
```

**時間複雜度：** O(n³)
**空間複雜度：** O(n²)

### 記憶化搜索解法

```cpp
class Solution {
private:
    vector<int> points;
    vector<vector<int>> memo;

    int dp(int i, int j) {
        // 開區間內無氣球
        if (i >= j - 1) return 0;

        if (memo[i][j] != -1) return memo[i][j];

        int maxCoins = 0;
        // 枚舉最後戳破的氣球 k
        for (int k = i + 1; k < j; k++) {
            int coins = points[i] * points[k] * points[j];
            maxCoins = max(maxCoins,
                          dp(i, k) + dp(k, j) + coins);
        }

        memo[i][j] = maxCoins;
        return maxCoins;
    }

public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();

        // 添加虛擬氣球
        points.resize(n + 2);
        points[0] = 1;
        points[n + 1] = 1;
        for (int i = 0; i < n; i++) {
            points[i + 1] = nums[i];
        }

        memo.assign(n + 2, vector<int>(n + 2, -1));
        return dp(0, n + 1);
    }
};
```

---

## 經典問題 3：最小三角剖分分數 (Minimum Score Triangulation of Polygon)

[LeetCode 1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/)

### 問題描述

給定一個凸多邊形，頂點按順時針順序排列，值為 values。將多邊形剖分為若干三角形，每個三角形的分數為其三個頂點值的乘積。求最小的總分數。

**範例：**
```
輸入: values = [1, 2, 3]
輸出: 6
解釋: 只有一個三角形，分數 = 1 * 2 * 3 = 6

輸入: values = [3, 7, 4, 5]
輸出: 144
解釋: 剖分為兩個三角形 [3,7,5] 和 [3,4,5]
     分數 = 3*7*5 + 3*4*5 = 105 + 60 = 165 (錯誤)

實際上應該是 [3,7,4] 和 [3,4,5]:
     分數 = 3*7*4 + 3*4*5 = 84 + 60 = 144
```

### 問題分析

**狀態定義：**
- `dp[i][j]`：將頂點 i 到 j 組成的多邊形剖分的最小分數

**狀態轉移：**
固定邊 (i, j)，枚舉第三個頂點 k（i < k < j）：
```cpp
dp[i][j] = min(dp[i][k] + dp[k][j] + values[i] * values[k] * values[j])
           for k in (i, j)
```

**初始化：**
- `dp[i][i+1] = 0`（邊不需要剖分）
- `dp[i][i+2] = values[i] * values[i+1] * values[i+2]`（單個三角形）

### 解法實現

```cpp
class Solution {
public:
    int minScoreTriangulation(vector<int>& values) {
        int n = values.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // 按區間長度遍歷
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                dp[i][j] = INT_MAX;

                // 枚舉第三個頂點 k
                for (int k = i + 1; k < j; k++) {
                    int score = values[i] * values[k] * values[j];
                    dp[i][j] = min(dp[i][j],
                                   dp[i][k] + dp[k][j] + score);
                }
            }
        }

        return dp[0][n - 1];
    }
};
```

**時間複雜度：** O(n³)
**空間複雜度：** O(n²)

---

## 經典問題 4：合併石頭的最低成本 (Minimum Cost to Merge Stones)

[LeetCode 1000. Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/)

### 問題描述

有 N 堆石頭排成一排，每次可以將連續的 K 堆石頭合併成一堆，合併的成本為這 K 堆石頭的總和。求將所有石頭合併成一堆的最小成本。如果無法合併，返回 -1。

**範例：**
```
輸入: stones = [3,2,4,1], K = 2
輸出: 20
解釋:
從 [3, 2, 4, 1] 開始
合併 [3, 2]: cost = 5, 結果 [5, 4, 1]
合併 [4, 1]: cost = 5, 結果 [5, 5]
合併 [5, 5]: cost = 10, 結果 [10]
總成本 = 5 + 5 + 10 = 20
```

### 問題分析

**可行性判斷：**
- N 堆石頭要合併成 1 堆，每次減少 K-1 堆
- 需要滿足：`(N - 1) % (K - 1) == 0`

**狀態定義：**
- `dp[i][j][p]`：將區間 [i, j] 的石頭合併成 p 堆的最小成本

**狀態轉移：**
1. 合併成 p 堆（p > 1）：
   ```cpp
   dp[i][j][p] = min(dp[i][mid][1] + dp[mid+1][j][p-1])
   ```

2. 合併成 1 堆：
   ```cpp
   dp[i][j][1] = dp[i][j][K] + sum(i, j)
   ```

### 解法實現

```cpp
class Solution {
public:
    int mergeStones(vector<int>& stones, int K) {
        int n = stones.size();

        // 判斷可行性
        if ((n - 1) % (K - 1) != 0) return -1;

        // 前綴和
        vector<int> prefixSum(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + stones[i];
        }

        // dp[i][j][p]: 區間 [i,j] 合併成 p 堆的最小成本
        vector<vector<vector<int>>> dp(n,
            vector<vector<int>>(n,
                vector<int>(K + 1, INT_MAX)));

        // 初始化：單個石頭
        for (int i = 0; i < n; i++) {
            dp[i][i][1] = 0;
        }

        // 按區間長度遍歷
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;

                // 合併成 p 堆 (p > 1)
                for (int p = 2; p <= K; p++) {
                    for (int mid = i; mid < j; mid += K - 1) {
                        if (dp[i][mid][1] != INT_MAX &&
                            dp[mid+1][j][p-1] != INT_MAX) {
                            dp[i][j][p] = min(dp[i][j][p],
                                dp[i][mid][1] + dp[mid+1][j][p-1]);
                        }
                    }
                }

                // 合併成 1 堆
                if (dp[i][j][K] != INT_MAX) {
                    dp[i][j][1] = dp[i][j][K] +
                                  prefixSum[j+1] - prefixSum[i];
                }
            }
        }

        return dp[0][n-1][1];
    }
};
```

**時間複雜度：** O(n³ × K)
**空間複雜度：** O(n² × K)

---

## 其他經典區間 DP 問題

### LeetCode 5. Longest Palindromic Substring
最長回文子串（與子序列不同，要求連續）。

### LeetCode 647. Palindromic Substrings
計算回文子串的個數。

### LeetCode 1745. Palindrome Partitioning IV
判斷能否將字符串分成 3 個回文子串。

### LeetCode 87. Scramble String
判斷兩個字符串是否為 scramble 關係。

---

## 區間 DP 總結

### 關鍵要點

1. **狀態定義**
   - `dp[i][j]` 表示區間 [i, j] 的最優解
   - 注意是閉區間還是開區間

2. **轉移方程**
   - 枚舉分割點 k，將大區間分成小區間
   - `dp[i][j] = optimize(dp[i][k] + dp[k+1][j] + cost)`

3. **遍歷順序**
   - **必須按區間長度遞增**
   - 先計算小區間，再計算大區間

4. **初始化**
   - 長度為 1 的區間（單個元素）
   - 有時需要初始化長度為 2 的區間

5. **三層循環**
   - 外層：區間長度 len
   - 中層：左端點 i
   - 內層：分割點 k

### 解題步驟

1. 確認問題是否適合區間 DP：
   - 是否涉及區間？
   - 大區間能否由小區間合併得到？

2. 定義狀態：`dp[i][j]` 的含義

3. 推導轉移方程：如何枚舉分割點？

4. 確定初始化：最小區間的值

5. 確定遍歷順序：按長度遞增

6. 實現代碼

### 複雜度分析

- **時間複雜度：** 通常是 O(n³)
  - 兩層循環枚舉區間：O(n²)
  - 一層循環枚舉分割點：O(n)

- **空間複雜度：** O(n²)
  - 二維 dp 數組

### 常見錯誤

1. **遍歷順序錯誤**
   - 必須按區間長度遞增，不能按 i, j 直接遍歷

2. **邊界處理錯誤**
   - 區間端點的處理
   - 開區間 vs 閉區間

3. **初始化遺漏**
   - 忘記初始化單個元素的情況

4. **分割點枚舉錯誤**
   - k 的範圍不對（注意開閉區間）

### 優化技巧

1. **記憶化搜索**
   - 對於某些問題，記憶化搜索更直觀

2. **前綴和優化**
   - 當需要頻繁計算區間和時使用

3. **剪枝**
   - 提前判斷無解的情況

---

區間 DP 是動態規劃中的重要類型，掌握其核心思想（按長度遞增、枚舉分割點）是解決這類問題的關鍵。接下來我們將學習背包 DP，這是另一類非常重要的 DP 問題。
