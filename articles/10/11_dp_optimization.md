---
title: 10-11. DP 優化技巧
order: 11
description: 動態規劃的進階優化技巧：二分、貪心、決策單調性
tags:
  - 動態規劃
  - 優化
  - 二分搜索
  - 貪心
author: Rain Hu
date: '2025-10-30'
draft: false
---

# DP 優化技巧

動態規劃的優化是將高時間複雜度的 DP 降低到更可接受的範圍。常見的優化技巧包括:二分搜索、貪心結合、決策單調性等。

## 優化技巧分類

1. **空間優化**: 滾動數組、狀態壓縮
2. **時間優化**: 二分搜索、單調隊列、決策單調性
3. **算法結合**: DP + 貪心、DP + 二分

---

## 技巧 1: 最長遞增子序列的二分優化 (LIS)

[LeetCode 300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

### 從 O(n²) 優化到 O(n log n)

#### 樸素 DP: O(n²)

```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
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

#### 二分優化: O(n log n)

**核心思想:**
維護一個 tails 數組,`tails[i]` 表示長度為 i+1 的遞增子序列的最小末尾元素。

**為什麼可以優化?**
- tails 數組是嚴格遞增的
- 對於新元素,可以用二分查找它在 tails 中的位置

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

## 技巧 2: 俄羅斯套娃信封問題 (Russian Doll Envelopes)

[LeetCode 354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

### 問題描述

給定一些標記了寬度和高度的信封,寬度和高度以整數對 (w, h) 形式出現。當一個信封的寬度和高度都比另一個信封大時,這個信封可以放入另一個信封里。求最多能有多少個信封組成一組"俄羅斯套娃"信封。

**範例:**
```
輸入: envelopes = [[5,4],[6,4],[6,7],[2,3]]
輸出: 3
解釋: 最多信封的個數為 3, 組合為: [2,3] => [5,4] => [6,7]
```

### 問題分析

這題是 LIS 的二維版本。

**關鍵洞察:**
1. 先按寬度 w 升序排序
2. 如果 w 相同,按高度 h **降序**排序
3. 對高度 h 做 LIS

**為什麼 w 相同時 h 要降序?**
- 避免 w 相同的信封被算入同一個遞增序列
- 例如 `[[3,3], [3,4]]`,降序後變 `[[3,4], [3,3]]`,h 的 LIS 不會同時選中它們

### 解法實現

```cpp
class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        // 按 w 升序,w 相同時 h 降序
        sort(envelopes.begin(), envelopes.end(),
             [](const auto& a, const auto& b) {
                 return a[0] < b[0] || (a[0] == b[0] && a[1] > b[1]);
             });

        // 對高度做 LIS
        vector<int> tails;
        for (const auto& env : envelopes) {
            int h = env[1];
            auto it = lower_bound(tails.begin(), tails.end(), h);

            if (it == tails.end()) {
                tails.push_back(h);
            } else {
                *it = h;
            }
        }

        return tails.size();
    }
};
```

**時間複雜度:** O(n log n)
**空間複雜度:** O(n)

**執行過程:**
```
輸入: [[5,4],[6,4],[6,7],[2,3]]

排序後: [[2,3],[5,4],[6,7],[6,4]]
                                 ↑ w=6 時 h 降序

對 h 做 LIS:
h = [3, 4, 7, 4]

處理 3: tails = [3]
處理 4: tails = [3, 4]
處理 7: tails = [3, 4, 7]
處理 4: tails = [3, 4, 7] (4 替換 4,位置不變)

最終長度 = 3
```

---

## 技巧 3: 最長數對鏈 (Maximum Length of Pair Chain)

[LeetCode 646. Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

### 問題描述

給定 n 個數對。如果 pair1[1] < pair2[0],則稱 pair2 可以跟在 pair1 後面。找出最長的數對鏈。

**範例:**
```
輸入: pairs = [[1,2],[2,3],[3,4]]
輸出: 2
解釋: 最長的數對鏈是 [1,2] -> [3,4]
```

### 問題分析

這題可以用 DP 或貪心解決。

#### 解法 1: DP (類似 LIS)

```cpp
class Solution {
public:
    int findLongestChain(vector<vector<int>>& pairs) {
        sort(pairs.begin(), pairs.end());

        int n = pairs.size();
        vector<int> dp(n, 1);
        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (pairs[j][1] < pairs[i][0]) {
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

#### 解法 2: 貪心(最優)

**貪心策略:** 按數對的**右端點**排序,每次選擇右端點最小的數對。

**為什麼貪心是對的?**
- 右端點越小,留給後面數對的空間越大
- 這是區間調度問題的變形

```cpp
class Solution {
public:
    int findLongestChain(vector<vector<int>>& pairs) {
        // 按右端點排序
        sort(pairs.begin(), pairs.end(),
             [](const auto& a, const auto& b) {
                 return a[1] < b[1];
             });

        int count = 1;
        int end = pairs[0][1];

        for (int i = 1; i < pairs.size(); i++) {
            if (pairs[i][0] > end) {
                count++;
                end = pairs[i][1];
            }
        }

        return count;
    }
};
```

**時間複雜度:** O(n log n)
**空間複雜度:** O(1)

---

## 技巧 4: 決策單調性優化

### 什麼是決策單調性?

當 DP 轉移方程滿足:
```cpp
dp[i] = min/max { dp[j] + cost(j, i) }
```

如果存在最優決策點 j,且隨著 i 增大,最優 j 也單調不減,則稱具有**決策單調性**。

**利用決策單調性可以將 O(n²) 優化到 O(n log n) 或 O(n)**。

### 示例: 郵局選址問題

假設有 n 個村莊排列在一條直線上,要建 k 個郵局,使得所有村莊到最近郵局的距離之和最小。

**DP 定義:**
- `dp[i][j]`: 前 i 個村莊建 j 個郵局的最小距離和

**轉移方程:**
```cpp
dp[i][j] = min { dp[k][j-1] + cost(k+1, i) }  for k in [j-1, i-1]
```

**優化:**
- cost(i, j) 具有四邊形不等式性質
- 最優決策點具有單調性
- 可以用分治或單調隊列優化

---

## DP 優化總結

### 優化技巧對比

| 優化方法 | 複雜度改進 | 適用場景 | 難度 |
|----------|-----------|----------|------|
| 滾動數組 | O(n×m) → O(m) 空間 | 只依賴前幾層 | 簡單 |
| 二分搜索 | O(n²) → O(n log n) | 維護單調數組 | 中等 |
| 單調隊列 | O(n×k) → O(n) | 滑動窗口最值 | 中等 |
| 貪心結合 | O(n²) → O(n log n) | 具有貪心性質 | 中等 |
| 決策單調性 | O(n²) → O(n log n) | 決策點單調 | 困難 |
| 狀態壓縮 | O(n×2ⁿ) → O(2ⁿ) 空間 | 小規模集合 | 中等 |

### 如何選擇優化方法?

1. **空間優化**
   - 檢查是否只依賴前幾個狀態
   - 使用滾動數組或變量

2. **時間優化**
   - 轉移涉及區間最值 → 單調隊列
   - 維護遞增/遞減序列 → 二分搜索
   - 存在貪心性質 → DP + 貪心
   - 決策點單調 → 決策單調性優化

3. **算法結合**
   - LIS → DP + 二分
   - 區間調度 → DP + 貪心
   - 集合問題 → 狀態壓縮

### 常見優化模式

#### 模式 1: LIS 類問題

```cpp
// 維護遞增數組 + 二分查找
vector<int> tails;
for (int num : nums) {
    auto it = lower_bound(tails.begin(), tails.end(), num);
    if (it == tails.end()) {
        tails.push_back(num);
    } else {
        *it = num;
    }
}
```

#### 模式 2: 滑動窗口最值

```cpp
// 單調隊列
deque<int> dq;
for (int i = 0; i < n; i++) {
    // 移除過期元素
    while (!dq.empty() && dq.front() < i - k) {
        dq.pop_front();
    }
    // 維護單調性
    while (!dq.empty() && dp[dq.back()] <= dp[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
}
```

#### 模式 3: 貪心 + DP

```cpp
// 先排序,再 DP 或貪心
sort(items.begin(), items.end(), comparator);

// 貪心選擇
for (const auto& item : items) {
    if (canTake(item)) {
        take(item);
    }
}
```

### 優化的思考步驟

1. **分析瓶頸**
   - 找出時間/空間複雜度的瓶頸
   - 確定是否需要優化

2. **識別性質**
   - 是否有單調性?
   - 是否可以二分?
   - 是否有貪心性質?

3. **選擇方法**
   - 根據問題性質選擇優化技巧

4. **驗證正確性**
   - 證明優化後的算法正確性
   - 用小例子測試

5. **分析複雜度**
   - 確保優化後複雜度降低

### 常見陷阱

1. **過度優化**
   - 不是所有 DP 都需要優化
   - 先確保正確性,再考慮優化

2. **破壞正確性**
   - 優化時改變了算法邏輯
   - 邊界條件處理錯誤

3. **複雜度分析錯誤**
   - 以為優化了,實際沒有
   - 忽略了隱藏的複雜度

4. **代碼可讀性**
   - 過度優化導致代碼難以理解
   - 平衡效率與可維護性

---

## 推薦練習題

### 二分優化
- LeetCode 300: Longest Increasing Subsequence
- LeetCode 354: Russian Doll Envelopes
- LeetCode 646: Maximum Length of Pair Chain

### 單調隊列優化
- LeetCode 1696: Jump Game VI
- LeetCode 239: Sliding Window Maximum

### 貪心 + DP
- LeetCode 435: Non-overlapping Intervals
- LeetCode 452: Minimum Number of Arrows to Burst Balloons

### 決策單調性
- LeetCode 1478: Allocate Mailboxes (困難)

---

動態規劃的優化是一門藝術,需要對問題有深入的理解,並能識別問題的特殊性質。通過大量練習,你會逐漸培養出優化的直覺。記住:**先正確,再優化**。
