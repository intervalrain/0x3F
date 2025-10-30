---
title: 10-5. 序列 DP
order: 5
description: 序列動態規劃：LIS、LCS、編輯距離
tags:
  - 動態規劃
  - 序列 DP
  - LIS
  - LCS
  - 編輯距離
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 序列 DP (Sequence DP)

序列 DP 是處理序列(數組、字符串)匹配、比較、查找子序列等問題的重要技術。這類問題通常涉及一個或兩個序列,需要找出它們的某種最優子序列或轉換方式。

## 核心問題類型

1. **最長遞增子序列 (LIS - Longest Increasing Subsequence)**
2. **最長公共子序列 (LCS - Longest Common Subsequence)**
3. **編輯距離 (Edit Distance)**
4. **序列匹配與轉換**

---

## 問題 1: 最長遞增子序列 (LIS)

[LeetCode 300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

### 問題描述

給定一個整數數組 nums,找到其中最長嚴格遞增子序列的長度。子序列是由數組派生而來的序列,刪除(或不刪除)數組中的元素而不改變其餘元素的順序。

**範例:**
```
輸入: nums = [10, 9, 2, 5, 3, 7, 101, 18]
輸出: 4
解釋: 最長遞增子序列是 [2, 3, 7, 101],長度為 4
```

### 解法 1: O(n²) 動態規劃

**狀態定義:**
- `dp[i]`: 以 nums[i] **結尾**的最長遞增子序列長度

**狀態轉移:**
對於每個位置 i,查找所有 j < i 且 nums[j] < nums[i] 的位置:
```cpp
dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]
```

**初始化:**
```cpp
dp[i] = 1  // 每個元素自身是長度為 1 的遞增子序列
```

**DP 狀態表:**
```
索引:     0    1   2   3   4   5    6    7
nums:    10    9   2   5   3   7  101   18
dp:       1    1   1   2   2   3    4    4

解釋:
dp[0] = 1: [10]
dp[1] = 1: [9]
dp[2] = 1: [2]
dp[3] = 2: [2, 5]
dp[4] = 2: [2, 3]
dp[5] = 3: [2, 3, 7] 或 [2, 5, 7]
dp[6] = 4: [2, 3, 7, 101]
dp[7] = 4: [2, 3, 7, 18]

最長長度 = max(dp) = 4
```

#### 實現代碼

```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;

        vector<int> dp(n, 1);
        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            maxLen = max(maxLen, dp[i]);
        }

        return maxLen;
    }
};
```

**時間複雜度:** O(n²)
**空間複雜度:** O(n)

### 解法 2: O(n log n) 二分優化

使用一個輔助數組 tails,其中 `tails[i]` 表示長度為 i+1 的遞增子序列的最小末尾元素。

**核心思想:**
- 維護一個嚴格遞增的 tails 數組
- 對於每個新元素,用二分查找找到它應該放的位置
- 如果大於所有元素,追加到末尾(LIS 長度+1)
- 否則,替換第一個大於等於它的元素

**為什麼這樣是對的?**
- tails[i] 表示長度為 i+1 的子序列的最小末尾
- 保持末尾最小,有更大機會接納後面的元素
- 二分查找保證了效率

#### 實現代碼

```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;

        for (int num : nums) {
            // 二分查找第一個 >= num 的位置
            auto it = lower_bound(tails.begin(), tails.end(), num);

            if (it == tails.end()) {
                // num 大於所有元素,追加
                tails.push_back(num);
            } else {
                // 替換第一個 >= num 的元素
                *it = num;
            }
        }

        return tails.size();
    }
};
```

**時間複雜度:** O(n log n)
**空間複雜度:** O(n)

**執行過程示例:**
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]

處理 10: tails = [10]
處理  9: tails = [9]   (替換 10)
處理  2: tails = [2]   (替換 9)
處理  5: tails = [2, 5]
處理  3: tails = [2, 3] (替換 5)
處理  7: tails = [2, 3, 7]
處理 101: tails = [2, 3, 7, 101]
處理 18: tails = [2, 3, 7, 18] (替換 101)

最終長度 = 4
```

**注意:** tails 不是實際的 LIS,而是用於計算長度的輔助數組。

---

## 問題 2: 最長公共子序列 (LCS)

[LeetCode 1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

### 問題描述

給定兩個字符串 text1 和 text2,返回這兩個字符串的最長公共子序列的長度。如果不存在公共子序列,返回 0。

**範例:**
```
輸入: text1 = "abcde", text2 = "ace"
輸出: 3
解釋: 最長公共子序列是 "ace",長度為 3

輸入: text1 = "abc", text2 = "abc"
輸出: 3

輸入: text1 = "abc", text2 = "def"
輸出: 0
```

### 問題分析

這是經典的二維 DP 問題。

**狀態定義:**
- `dp[i][j]`: text1 的前 i 個字符和 text2 的前 j 個字符的 LCS 長度

**狀態轉移:**
對於 text1[i-1] 和 text2[j-1]:

1. **如果相等:**
   ```cpp
   dp[i][j] = dp[i-1][j-1] + 1
   ```
   兩個字符都選入 LCS

2. **如果不等:**
   ```cpp
   dp[i][j] = max(dp[i-1][j], dp[i][j-1])
   ```
   要麼不選 text1[i-1],要麼不選 text2[j-1]

**初始化:**
```cpp
dp[0][j] = 0  // text1 為空,LCS 為 0
dp[i][0] = 0  // text2 為空,LCS 為 0
```

**DP 狀態表 (text1="abcde", text2="ace"):**
```
       ""  a   c   e
    ""  0   0   0   0
    a   0   1   1   1
    b   0   1   1   1
    c   0   1   2   2
    d   0   1   2   2
    e   0   1   2   3

dp[5][3] = 3 (LCS = "ace")
```

### 解法實現

```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();

        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i-1] == text2[j-1]) {
                    // 字符相等,加入 LCS
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    // 字符不等,取較大值
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        return dp[m][n];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

### 空間優化

LCS 只依賴上一行和當前行,可以優化到 O(min(m, n)) 空間:

```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();

        // 確保 text2 是較短的
        if (m < n) {
            swap(text1, text2);
            swap(m, n);
        }

        vector<int> dp(n + 1, 0);

        for (int i = 1; i <= m; i++) {
            int prev = 0;  // dp[i-1][j-1]
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (text1[i-1] == text2[j-1]) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = max(dp[j], dp[j-1]);
                }
                prev = temp;
            }
        }

        return dp[n];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(min(m, n))

### 輸出 LCS 字符串

如果需要輸出實際的 LCS,需要回溯 DP 表:

```cpp
string getLCS(string text1, string text2, vector<vector<int>>& dp) {
    int i = text1.length();
    int j = text2.length();
    string lcs = "";

    while (i > 0 && j > 0) {
        if (text1[i-1] == text2[j-1]) {
            lcs = text1[i-1] + lcs;
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }

    return lcs;
}
```

---

## 問題 3: 編輯距離 (Edit Distance)

[LeetCode 72. Edit Distance](https://leetcode.com/problems/edit-distance/)

### 問題描述

給定兩個字符串 word1 和 word2,計算將 word1 轉換成 word2 所需的最少操作數。你可以對一個單詞進行如下三種操作:
1. 插入一個字符
2. 刪除一個字符
3. 替換一個字符

**範例:**
```
輸入: word1 = "horse", word2 = "ros"
輸出: 3
解釋:
horse -> rorse (將 'h' 替換為 'r')
rorse -> rose (刪除 'r')
rose -> ros (刪除 'e')

輸入: word1 = "intention", word2 = "execution"
輸出: 5
```

### 問題分析

這是經典的 **Levenshtein Distance** 問題。

**狀態定義:**
- `dp[i][j]`: word1 的前 i 個字符轉換為 word2 的前 j 個字符所需的最少操作數

**狀態轉移:**
對於 word1[i-1] 和 word2[j-1]:

1. **如果字符相等:**
   ```cpp
   dp[i][j] = dp[i-1][j-1]  // 不需要操作
   ```

2. **如果字符不等,有三種操作:**
   - **插入:** `dp[i][j-1] + 1`
     - 在 word1[i] 後插入 word2[j],問題變為 word1[0..i] → word2[0..j-1]

   - **刪除:** `dp[i-1][j] + 1`
     - 刪除 word1[i],問題變為 word1[0..i-1] → word2[0..j]

   - **替換:** `dp[i-1][j-1] + 1`
     - 將 word1[i] 替換為 word2[j],問題變為 word1[0..i-1] → word2[0..j-1]

   ```cpp
   dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1
   ```

**初始化:**
```cpp
dp[0][j] = j  // word1 為空,需要插入 j 個字符
dp[i][0] = i  // word2 為空,需要刪除 i 個字符
```

**DP 狀態表 (word1="horse", word2="ros"):**
```
       ""  r   o   s
    ""  0   1   2   3
    h   1   1   2   3
    o   2   2   1   2
    r   3   2   2   2
    s   4   3   3   2
    e   5   4   4   3

解釋:
dp[1][1]: 'h' → 'r' = 1 (替換)
dp[2][2]: 'ho' → 'ro' = 1 (替換 h)
dp[3][1]: 'hor' → 'r' = 2 (刪除 h, o)
dp[5][3]: 'horse' → 'ros' = 3
```

### 解法實現

```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();

        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        // 初始化
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    // 字符相等,不需要操作
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    // 取三種操作的最小值
                    dp[i][j] = min({
                        dp[i-1][j] + 1,    // 刪除
                        dp[i][j-1] + 1,    // 插入
                        dp[i-1][j-1] + 1   // 替換
                    }) ;
                }
            }
        }

        return dp[m][n];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

### 空間優化

```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();

        vector<int> dp(n + 1);
        for (int j = 0; j <= n; j++) dp[j] = j;

        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;

            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1[i-1] == word2[j-1]) {
                    dp[j] = prev;
                } else {
                    dp[j] = min({dp[j], dp[j-1], prev}) + 1;
                }
                prev = temp;
            }
        }

        return dp[n];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(n)

---

## 問題 4: 不相交的線 (Uncrossed Lines)

[LeetCode 1035. Uncrossed Lines](https://leetcode.com/problems/uncrossed-lines/)

### 問題描述

給定兩個整數數組 nums1 和 nums2。在數組之間畫一些連線,連接 nums1[i] 和 nums2[j],要求:
- nums1[i] == nums2[j]
- 連線不能相交

返回可以畫出的最大連線數。

**範例:**
```
輸入: nums1 = [1,4,2], nums2 = [1,2,4]
輸出: 2
解釋: 可以畫 1-1 和 2-2,或者 1-1 和 4-4
```

### 問題分析

這題本質上就是 **LCS**!

為什麼?
- 連線不相交 ⟺ 選擇的元素在兩個數組中的相對順序相同
- 這就是公共子序列的定義

### 解法實現

```cpp
class Solution {
public:
    int maxUncrossedLines(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size();
        int n = nums2.size();

        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (nums1[i-1] == nums2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }

        return dp[m][n];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

---

## 問題 5: 最長連續遞增序列 (Longest Continuous Increasing Subsequence)

[LeetCode 674. Longest Continuous Increasing Subsequence](https://leetcode.com/problems/longest-continuous-increasing-subsequence/)

### 問題描述

給定一個未排序的整數數組,找到最長連續遞增序列的長度。注意這裡要求的是**連續的子數組**。

**範例:**
```
輸入: nums = [1,3,5,4,7]
輸出: 3
解釋: 最長連續遞增序列是 [1,3,5],長度為 3
```

### 問題分析

這題比 LIS 簡單,因為要求連續。

**狀態定義:**
- `dp[i]`: 以 nums[i] 結尾的最長連續遞增序列長度

**狀態轉移:**
```cpp
if (nums[i] > nums[i-1]) {
    dp[i] = dp[i-1] + 1;
} else {
    dp[i] = 1;
}
```

### 解法實現

#### 解法 1: DP

```cpp
class Solution {
public:
    int findLengthOfLCIS(vector<int>& nums) {
        if (nums.empty()) return 0;

        int n = nums.size();
        vector<int> dp(n, 1);
        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[i-1]) {
                dp[i] = dp[i-1] + 1;
            }
            maxLen = max(maxLen, dp[i]);
        }

        return maxLen;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(n)

#### 解法 2: 雙指針 (空間優化)

```cpp
class Solution {
public:
    int findLengthOfLCIS(vector<int>& nums) {
        if (nums.empty()) return 0;

        int maxLen = 1;
        int currLen = 1;

        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] > nums[i-1]) {
                currLen++;
            } else {
                currLen = 1;
            }
            maxLen = max(maxLen, currLen);
        }

        return maxLen;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

---

## 序列 DP 總結

### 問題類型對比

| 問題 | 狀態定義 | 時間複雜度 | 關鍵點 |
|------|----------|------------|--------|
| LIS | `dp[i]` = 以 i 結尾的 LIS 長度 | O(n²) 或 O(n log n) | 二分優化 |
| LCS | `dp[i][j]` = text1[0..i] 和 text2[0..j] 的 LCS | O(m×n) | 二維 DP |
| Edit Distance | `dp[i][j]` = word1[0..i] 到 word2[0..j] 的最小操作數 | O(m×n) | 三種操作 |
| LCIS (連續) | `dp[i]` = 以 i 結尾的連續遞增長度 | O(n) | 連續性 |

### 關鍵要點

1. **狀態定義明確**
   - 單序列: `dp[i]`
   - 雙序列: `dp[i][j]`
   - 明確 "以 i 結尾" vs "前 i 個元素"

2. **轉移方程**
   - LIS: 枚舉所有 j < i
   - LCS/Edit: 根據字符是否相等分情況
   - 連續序列: 只看相鄰元素

3. **優化技巧**
   - LIS: 二分優化到 O(n log n)
   - LCS: 空間優化到 O(min(m,n))
   - 滾動數組

### 解題步驟

1. 識別問題類型(單序列/雙序列)
2. 定義狀態(明確含義)
3. 推導轉移方程
4. 確定初始化
5. 考慮優化(時間/空間)

### 常見錯誤

1. **狀態定義模糊**
   - "以 i 結尾" vs "前 i 個" 區分不清

2. **邊界處理錯誤**
   - 忘記初始化第 0 行/列

3. **轉移方程錯誤**
   - LCS: 忘記考慮字符不等的情況
   - Edit Distance: 三種操作考慮不全

4. **空間優化時變量覆蓋**
   - 需要保存 dp[i-1][j-1] 的值

---

序列 DP 是動態規劃中非常重要的一類問題,掌握 LIS、LCS 和編輯距離這三個經典問題,是解決更複雜序列問題的基礎。接下來我們將學習網格 DP,它在路徑規劃和二維矩陣問題中有廣泛應用。
