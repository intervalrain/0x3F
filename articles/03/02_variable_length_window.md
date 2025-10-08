---
title: 03-2. 不定長滑動視窗
order: 2
description: 可變窗口大小的滑動視窗技巧與經典題目
tags:
  - Sliding Window
  - Variable Length
  - 不定長視窗
author: Rain Hu
date: ''
draft: true
---

# 不定長滑動視窗 (Variable-Length Sliding Window)

## 核心概念

**不定長滑動視窗**指的是窗口大小**可變**，根據條件動態調整左右邊界。

### 特點

- 窗口大小**動態變化**
- 使用 `left` 和 `right` 兩個指針
- `right` 向右擴展，`left` 向右收縮
- 時間複雜度：O(n)
- 適合求「滿足某條件的最長/最短子陣列」

---

## 通用模板

```cpp
// 不定長滑動視窗模板
int left = 0;
for (int right = 0; right < n; right++) {
    // 1. 加入右邊新元素
    加入 arr[right] 到窗口;

    // 2. 收縮窗口直到滿足條件
    while (窗口不滿足條件) {
        移除 arr[left] 從窗口;
        left++;
    }

    // 3. 更新答案
    更新答案（此時窗口滿足條件）;
}
```

### 模板說明

1. **右指針擴展**：`right` 從 0 遍歷到 n-1，每次加入新元素
2. **左指針收縮**：當窗口不滿足條件時，收縮左邊界
3. **更新答案**：窗口滿足條件後更新答案

---

## 三種常見場景

### 場景 1：求最長子陣列

**問題特徵**：找**最長**的滿足條件的子陣列。

**策略**：
- `while` 條件：窗口**不滿足**條件時收縮
- 更新答案：在 while 之後，窗口滿足條件時

**模板**：
```cpp
int left = 0, maxLen = 0;
for (int right = 0; right < n; right++) {
    加入 arr[right];

    // 收縮到滿足條件
    while (窗口不滿足條件) {
        移除 arr[left];
        left++;
    }

    // 此時窗口滿足條件，更新最長長度
    maxLen = max(maxLen, right - left + 1);
}
```

#### 範例 1：Longest Substring Without Repeating Characters

**問題**：[LeetCode 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

找出字串中最長的無重複字符子串。

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.size();
        unordered_set<char> window;
        int left = 0, maxLen = 0;

        for (int right = 0; right < n; right++) {
            // 加入右邊字符
            char c = s[right];

            // 收縮窗口：當有重複字符時
            while (window.count(c)) {
                window.erase(s[left]);
                left++;
            }

            // 加入新字符
            window.insert(c);

            // 更新最長長度
            maxLen = max(maxLen, right - left + 1);
        }

        return maxLen;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(min(n, m))，m 為字符集大小

**關鍵**：
- 窗口條件：無重複字符
- 當遇到重複時，收縮 `left` 直到無重複
- 每次更新最長長度

#### 範例 2：Max Consecutive Ones III

**問題**：[LeetCode 1004](https://leetcode.com/problems/max-consecutive-ones-iii/)

給定二進制陣列和整數 k，最多可以翻轉 k 個 0。找出翻轉後最長的連續 1 的長度。

```cpp
class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int n = nums.size();
        int left = 0, maxLen = 0;
        int zeros = 0;  // 窗口內 0 的數量

        for (int right = 0; right < n; right++) {
            // 加入右邊元素
            if (nums[right] == 0) {
                zeros++;
            }

            // 收縮窗口：當 0 的數量 > k
            while (zeros > k) {
                if (nums[left] == 0) {
                    zeros--;
                }
                left++;
            }

            // 更新最長長度
            maxLen = max(maxLen, right - left + 1);
        }

        return maxLen;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

---

### 場景 2：求最短子陣列

**問題特徵**：找**最短**的滿足條件的子陣列。

**策略**：
- `while` 條件：窗口**滿足**條件時收縮
- 更新答案：在 while 內，每次收縮前更新

**模板**：
```cpp
int left = 0, minLen = INT_MAX;
for (int right = 0; right < n; right++) {
    加入 arr[right];

    // 收縮到不滿足條件
    while (窗口滿足條件) {
        // 在收縮前更新最短長度
        minLen = min(minLen, right - left + 1);

        移除 arr[left];
        left++;
    }
}
```

#### 範例 1：Minimum Size Subarray Sum

**問題**：[LeetCode 209](https://leetcode.com/problems/minimum-size-subarray-sum/)

找出和 ≥ target 的最短子陣列。

```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int left = 0, minLen = INT_MAX;
        int sum = 0;

        for (int right = 0; right < n; right++) {
            // 加入右邊元素
            sum += nums[right];

            // 收縮窗口：當和 >= target
            while (sum >= target) {
                // 更新最短長度
                minLen = min(minLen, right - left + 1);

                // 移除左邊元素
                sum -= nums[left];
                left++;
            }
        }

        return minLen == INT_MAX ? 0 : minLen;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**關鍵**：
- 窗口條件：sum >= target
- 當滿足條件時，盡量收縮來找最短
- 每次收縮前更新答案

#### 範例 2：Minimum Window Substring

**問題**：[LeetCode 76](https://leetcode.com/problems/minimum-window-substring/)

給定字串 s 和 t，找出 s 中包含 t 所有字符的最短子串。

```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";

        // 目標字符計數
        unordered_map<char, int> target;
        for (char c : t) {
            target[c]++;
        }

        // 窗口字符計數
        unordered_map<char, int> window;
        int left = 0, minLen = INT_MAX, start = 0;
        int matched = 0;  // 已匹配的字符種類數

        for (int right = 0; right < s.size(); right++) {
            char c = s[right];

            // 加入右邊字符
            if (target.count(c)) {
                window[c]++;
                if (window[c] == target[c]) {
                    matched++;
                }
            }

            // 收縮窗口：當包含所有字符
            while (matched == target.size()) {
                // 更新最短長度
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    start = left;
                }

                // 移除左邊字符
                char d = s[left];
                if (target.count(d)) {
                    if (window[d] == target[d]) {
                        matched--;
                    }
                    window[d]--;
                }
                left++;
            }
        }

        return minLen == INT_MAX ? "" : s.substr(start, minLen);
    }
};
```

**時間複雜度**：O(n + m)
**空間複雜度**：O(m)，m 為字符集大小

---

### 場景 3：計數滿足條件的子陣列

**問題特徵**：計算有多少個滿足條件的子陣列。

**策略**：
- `while` 條件：窗口**不滿足**條件時收縮
- 計數：以 `right` 結尾的子陣列有 `right - left + 1` 個

**模板**：
```cpp
int left = 0, count = 0;
for (int right = 0; right < n; right++) {
    加入 arr[right];

    // 收縮到滿足條件
    while (窗口不滿足條件) {
        移除 arr[left];
        left++;
    }

    // 以 right 結尾的滿足條件的子陣列有 right - left + 1 個
    count += right - left + 1;
}
```

#### 範例：Subarray Product Less Than K

**問題**：[LeetCode 713](https://leetcode.com/problems/subarray-product-less-than-k/)

計算乘積 < k 的連續子陣列數量。

```cpp
class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k <= 1) return 0;

        int n = nums.size();
        int left = 0, count = 0;
        int product = 1;

        for (int right = 0; right < n; right++) {
            // 加入右邊元素
            product *= nums[right];

            // 收縮窗口：當乘積 >= k
            while (product >= k) {
                product /= nums[left];
                left++;
            }

            // 以 right 結尾的子陣列數量
            count += right - left + 1;
        }

        return count;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**為什麼是 `right - left + 1`？**

```
nums = [10, 5, 2, 6], k = 100

right = 0: [10]                      → 1 個
right = 1: [10, 5], [5]              → 2 個
right = 2: [10, 5, 2], [5, 2], [2]   → 3 個
right = 3: [5, 2, 6], [2, 6], [6]    → 3 個（left 移動到 1）

每次加入 nums[right]，以它結尾的子陣列為 [left, right], [left+1, right], ..., [right, right]
共 right - left + 1 個
```

---

## 最長 vs 最短 對比

| 問題類型 | while 條件 | 更新答案時機 | 範例 |
|---------|-----------|------------|------|
| **最長** | 窗口**不滿足**條件 | while **之後** | Longest Substring Without Repeating Characters |
| **最短** | 窗口**滿足**條件 | while **內部** | Minimum Size Subarray Sum |

### 記憶技巧

- **最長**：盡量擴展 → 不滿足時才收縮 → while 後更新
- **最短**：盡量收縮 → 滿足時就收縮 → while 內更新

---

## 經典題目

### Easy
- [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) (定長)

### Medium
- [LeetCode 3 - Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (最長)
- [LeetCode 209 - Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) (最短)
- [LeetCode 424 - Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) (最長)
- [LeetCode 713 - Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) (計數)
- [LeetCode 904 - Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/) (最長)
- [LeetCode 930 - Binary Subarrays With Sum](https://leetcode.com/problems/binary-subarrays-with-sum/) (計數)
- [LeetCode 992 - Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) (計數，困難)
- [LeetCode 1004 - Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) (最長)
- [LeetCode 1208 - Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget/) (最長)

### Hard
- [LeetCode 76 - Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (最短)
- [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (定長 + 單調隊列)

---

## 常見陷阱

### 1. 更新答案的時機錯誤

```cpp
// ✗ 錯誤：最短問題在 while 外更新
while (sum >= target) {
    sum -= nums[left];
    left++;
}
minLen = min(minLen, right - left + 1);  // 此時窗口不滿足條件

// ✓ 正確：在 while 內更新
while (sum >= target) {
    minLen = min(minLen, right - left + 1);
    sum -= nums[left];
    left++;
}
```

### 2. 忘記更新窗口狀態

```cpp
// ✗ 錯誤：忘記移除左邊元素
while (窗口不滿足條件) {
    left++;  // 只移動指針，沒有更新狀態
}

// ✓ 正確：先更新狀態
while (窗口不滿足條件) {
    移除 arr[left];  // 更新窗口狀態
    left++;
}
```

### 3. 計數問題理解錯誤

```cpp
// ✗ 錯誤：只計數窗口本身
count++;  // 只算 [left, right] 這一個

// ✓ 正確：計數所有以 right 結尾的子陣列
count += right - left + 1;  // [left, right], [left+1, right], ..., [right, right]
```

---

## 進階技巧

### 1. 反向思考

**問題**：恰好 k 個不同元素的子陣列數量。

**技巧**：
```
恰好 k 個 = 最多 k 個 - 最多 k-1 個
```

```cpp
int atMostK(vector<int>& nums, int k) {
    int left = 0, count = 0;
    unordered_map<int, int> window;

    for (int right = 0; right < nums.size(); right++) {
        window[nums[right]]++;

        while (window.size() > k) {
            window[nums[left]]--;
            if (window[nums[left]] == 0) {
                window.erase(nums[left]);
            }
            left++;
        }

        count += right - left + 1;
    }

    return count;
}

int exactlyK(vector<int>& nums, int k) {
    return atMostK(nums, k) - atMostK(nums, k - 1);
}
```

### 2. 雙窗口技巧

對於某些問題，維護兩個獨立的窗口狀態。

---

## 複雜度總結

| 維護內容 | 時間複雜度 | 空間複雜度 |
|---------|-----------|-----------|
| 和/計數 | O(n) | O(1) |
| 字符計數 | O(n) | O(字符集大小) |
| 元素計數 | O(n) | O(k)，k 為不同元素數 |

---

## 重點回顧

1. **不定長視窗** = 窗口大小動態變化
2. **三種場景**：
   - 最長子陣列：while 不滿足 → while 後更新
   - 最短子陣列：while 滿足 → while 內更新
   - 計數子陣列：count += right - left + 1
3. **核心思想**：
   - right 擴展窗口
   - left 收縮窗口
   - 每個元素最多訪問兩次 → O(n)
4. **常見錯誤**：更新答案時機、忘記更新狀態、計數理解錯誤

### 下一步

接下來將學習**雙向雙指針**，處理有序陣列和對撞指針問題。
