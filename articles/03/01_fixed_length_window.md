---
title: "定長滑動視窗"
order: 1
description: "固定窗口大小的滑動視窗技巧與經典題目"
tags: ["Sliding Window", "Fixed Length", "定長視窗"]
---

# 定長滑動視窗 (Fixed-Length Sliding Window)

## 核心概念

**定長滑動視窗**指的是窗口大小固定為 k 的滑動視窗問題。

### 特點

- 窗口大小**固定不變**
- 每次移動：右邊加入新元素，左邊移除舊元素
- 時間複雜度：O(n)
- 適合求「每個大小為 k 的子陣列的某個屬性」

---

## 通用模板

```cpp
// 定長滑動視窗模板
void fixedSlidingWindow(vector<int>& arr, int k) {
    int n = arr.size();

    // 建立 window
    for (int i = 0; i < k; i++) {
        加入 arr[i] 到窗口;  // 移動右指針
    }
    更新答案;

    for (int i = k; i < n; i++) {
        加入 arr[i] 到窗口;       // 移動右指針
        移除 arr[i - k] 從窗口;   // 移動左指針
        更新答案;
    }
}
```

### 模板說明

1. **建立窗口**：先建立大小為 k 的初始窗口 `[0, k-1]`
2. **更新答案**：記錄第一個窗口的答案
3. **滑動窗口**：從索引 k 開始，每次右指針移動加入新元素，左指針移動移除舊元素
4. **更新答案**：每次滑動後更新答案

---

## 三種維護策略

### 策略 1：維護索引

**適用場景**：只需要知道窗口範圍。

```cpp
// 範例：印出所有大小為 k 的子陣列
void printSubarrays(vector<int>& arr, int k) {
    for (int i = 0; i < arr.size(); i++) {
        if (i >= k - 1) {
            // 窗口範圍：[i - k + 1, i]
            cout << "[";
            for (int j = i - k + 1; j <= i; j++) {
                cout << arr[j];
                if (j < i) cout << ", ";
            }
            cout << "]" << endl;
        }
    }
}
```

**複雜度**：O(n × k)（需要遍歷窗口內元素）

---

### 策略 2：維護值（和/計數）

**適用場景**：需要知道窗口內元素的和、平均值、計數等。

#### 範例 1：Maximum Average Subarray I

**問題**：[LeetCode 643](https://leetcode.com/problems/maximum-average-subarray-i/)

給定整數陣列 `nums` 和整數 `k`，找出長度為 `k` 的連續子陣列的最大平均值。

```cpp
class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        int n = nums.size();
        double sum = 0;

        // 建立 window
        for (int i = 0; i < k; i++) {
            sum += nums[i];  // 移動右指針
        }
        double maxAvg = sum / k;

        for (int i = k; i < n; i++) {
            sum += nums[i];       // 移動右指針
            sum -= nums[i - k];   // 移動左指針
            maxAvg = max(maxAvg, sum / k);
        }

        return maxAvg;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**關鍵**：
- 用 `sum` 維護窗口內元素的和
- 移動窗口時：加入右邊，移除左邊

#### 範例 2：維護字符計數

**問題**：[LeetCode 567 - Permutation in String](https://leetcode.com/problems/permutation-in-string/)

給定兩個字串 `s1` 和 `s2`，判斷 `s2` 是否包含 `s1` 的排列。

```cpp
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        int n1 = s1.size(), n2 = s2.size();
        if (n1 > n2) return false;

        // 目標字符計數
        vector<int> target(26, 0);
        for (char c : s1) {
            target[c - 'a']++;
        }

        // 建立 window
        vector<int> window(26, 0);
        for (int i = 0; i < n1; i++) {
            window[s2[i] - 'a']++;  // 移動右指針
        }
        if (window == target) return true;

        for (int i = n1; i < n2; i++) {
            window[s2[i] - 'a']++;           // 移動右指針
            window[s2[i - n1] - 'a']--;      // 移動左指針
            if (window == target) {
                return true;
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(n)（vector 比較是 O(26) = O(1)）
**空間複雜度**：O(1)

---

### 策略 3：維護最大/最小值（Deque）

**適用場景**：需要知道窗口內的最大值或最小值。

#### 核心技巧：單調遞減隊列（Monotonic Deque）

**原理**：
- 維護一個**單調遞減**的雙端隊列（deque）
- 隊首始終是窗口的最大值
- 時間複雜度：O(n)（每個元素最多進出隊列一次）

**操作**：
1. **加入新元素**：從隊尾移除所有小於新元素的值，然後加入新元素
2. **移除舊元素**：如果隊首是要移除的元素，彈出隊首
3. **查詢最大值**：隊首就是當前窗口的最大值

#### 範例：Sliding Window Maximum

**問題**：[LeetCode 239](https://leetcode.com/problems/sliding-window-maximum/)

給定整數陣列 `nums` 和窗口大小 `k`，返回每個窗口的最大值。

```
輸入: nums = [1,3,-1,-3,5,3,6,7], k = 3
輸出: [3,3,5,5,6,7]

解釋:
窗口位置                最大值
---------------        -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**實作**：

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> result;
        deque<int> dq;  // 存索引，維護單調遞減

        // 建立 window
        for (int i = 0; i < k; i++) {
            // 維護單調遞減性質
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }
            dq.push_back(i);  // 移動右指針
        }
        result.push_back(nums[dq.front()]);

        for (int i = k; i < n; i++) {
            // 移除超出窗口範圍的索引（移動左指針）
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }

            // 維護單調遞減性質（移動右指針）
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }

            dq.push_back(i);
            result.push_back(nums[dq.front()]);
        }

        return result;
    }
};
```

**時間複雜度**：O(n)（每個元素最多進出 deque 一次）
**空間複雜度**：O(k)（deque 最多存 k 個元素）

**圖解**：

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

i=0: dq=[0]                    (加入 1)
i=1: dq=[1]                    (3 > 1，移除 0，加入 1)
i=2: dq=[1,2]                  (加入 -1，窗口形成，最大值 = nums[1] = 3)
i=3: dq=[1,2,3]                (加入 -3，窗口形成，最大值 = nums[1] = 3)
i=4: dq=[4]                    (5 > -1,-3,3，全部移除，加入 5，最大值 = 5)
i=5: dq=[4,5]                  (加入 3，最大值 = nums[4] = 5)
i=6: dq=[6]                    (6 > 5,3，移除，加入 6，最大值 = 6)
i=7: dq=[7]                    (7 > 6，移除，加入 7，最大值 = 7)

結果: [3, 3, 5, 5, 6, 7]
```

**為什麼存索引而非值？**
- 需要判斷元素是否還在窗口內（`dq.front() < i - k + 1`）
- 索引可以推導出值（`nums[dq.front()]`）

---

## 單調隊列詳解

### 為什麼要單調遞減？

如果隊列中有元素 `a` 和 `b`（`a` 在前，`b` 在後）：
- 若 `nums[a] <= nums[b]`，則 `a` **永遠不可能**成為最大值
- 因為 `b` 更大且更晚離開窗口

**範例**：

```
窗口: [1, 3, -1]

加入 3 時：
- deque 有 [0]（值 1）
- 因為 nums[0]=1 < nums[1]=3，且 3 更晚離開
- 移除索引 0，deque 變成 [1]
```

### 單調隊列的性質

1. **隊首**是窗口的最大值
2. **隊列遞減**：`nums[dq[i]] > nums[dq[i+1]]`
3. **每個元素**最多進出隊列一次 → O(n)

### 維護最小值

如果要維護**最小值**，使用**單調遞增**隊列：

```cpp
// 維護窗口最小值
while (!dq.empty() && nums[dq.back()] > nums[i]) {  // 改為 >
    dq.pop_back();
}
```

---

## 經典題目

### 1. [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

**難度**：Easy
**策略**：維護和

```cpp
double findMaxAverage(vector<int>& nums, int k) {
    double sum = 0;
    // 建立 window
    for (int i = 0; i < k; i++) {
        sum += nums[i];
    }
    double maxAvg = sum / k;

    for (int i = k; i < nums.size(); i++) {
        sum += nums[i];       // 移動右指針
        sum -= nums[i - k];   // 移動左指針
        maxAvg = max(maxAvg, sum / k);
    }
    return maxAvg;
}
```

---

### 2. [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**難度**：Hard
**策略**：單調遞減隊列

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;

    // 建立 window
    for (int i = 0; i < k; i++) {
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        dq.push_back(i);
    }
    result.push_back(nums[dq.front()]);

    for (int i = k; i < nums.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k) {  // 移動左指針
            dq.pop_front();
        }
        while (!dq.empty() && nums[dq.back()] < nums[i]) {  // 移動右指針
            dq.pop_back();
        }
        dq.push_back(i);
        result.push_back(nums[dq.front()]);
    }
    return result;
}
```

---

### 3. [LeetCode 1423 - Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/)

**難度**：Medium
**策略**：反向思考 + 維護和

**問題**：從陣列兩端取 k 個數，使總和最大。

**思路**：
- 取 k 個數 = 剩下 `n - k` 個數
- **最大化取走的和** = **最小化剩下的和**
- 找大小為 `n - k` 的窗口，使其和最小

```cpp
class Solution {
public:
    int maxScore(vector<int>& cardPoints, int k) {
        int n = cardPoints.size();
        int totalSum = 0;
        for (int x : cardPoints) {
            totalSum += x;
        }

        // 找大小為 n - k 的最小窗口和
        int windowSize = n - k;
        if (windowSize == 0) return totalSum;

        // 建立 window
        int windowSum = 0;
        for (int i = 0; i < windowSize; i++) {
            windowSum += cardPoints[i];  // 移動右指針
        }
        int minWindowSum = windowSum;

        for (int i = windowSize; i < n; i++) {
            windowSum += cardPoints[i];              // 移動右指針
            windowSum -= cardPoints[i - windowSize]; // 移動左指針
            minWindowSum = min(minWindowSum, windowSum);
        }

        return totalSum - minWindowSum;
    }
};
```

---

### 4. [LeetCode 1461 - Check If a String Contains All Binary Codes of Size K](https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/)

**難度**：Medium
**策略**：維護計數 + Hash Set

**問題**：判斷字串 s 是否包含所有長度為 k 的二進制碼。

```cpp
class Solution {
public:
    bool hasAllCodes(string s, int k) {
        int n = s.size();
        if (n < k) return false;

        unordered_set<string> seen;

        // 建立 window
        seen.insert(s.substr(0, k));

        for (int i = k; i < n; i++) {
            seen.insert(s.substr(i - k + 1, k));
        }

        // 長度為 k 的二進制碼共有 2^k 個
        return seen.size() == (1 << k);
    }
};
```

**優化**：使用 rolling hash 避免 substr，降低到 O(n)。

---

## 常見陷阱

### 1. 忘記先建立窗口

```cpp
// ✗ 錯誤：直接從 i = 0 開始
for (int i = 0; i < n; i++) {
    sum += arr[i];
    if (i >= k) {  // 條件錯誤，應該是 i >= k - 1
        sum -= arr[i - k];
    }
    maxSum = max(maxSum, sum);  // 窗口還沒形成就更新
}

// ✓ 正確：先建立窗口，再滑動
for (int i = 0; i < k; i++) {
    sum += arr[i];
}
maxSum = sum;

for (int i = k; i < n; i++) {
    sum += arr[i];
    sum -= arr[i - k];
    maxSum = max(maxSum, sum);
}
```

### 2. 索引計算錯誤

```cpp
// 使用 for (int i = k; i < n; i++) 模式時
// 窗口範圍是 [i - k + 1, i]
// 要移除的是 arr[i - k]，因為左指針在 i - k
```

### 3. 單調隊列未移除過期索引

```cpp
// ✗ 錯誤：忘記移除超出窗口的索引
for (int i = k; i < n; i++) {
    while (!dq.empty() && nums[dq.back()] < nums[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
    result.push_back(nums[dq.front()]);  // dq.front() 可能已超出窗口
}

// ✓ 正確：先移除過期索引
for (int i = k; i < n; i++) {
    while (!dq.empty() && dq.front() <= i - k) {
        dq.pop_front();
    }
    while (!dq.empty() && nums[dq.back()] < nums[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
    result.push_back(nums[dq.front()]);
}
```

---

## 複雜度總結

| 維護內容 | 時間複雜度 | 空間複雜度 |
|---------|-----------|-----------|
| 索引 | O(n × k) | O(1) |
| 和/計數 | O(n) | O(1) 或 O(字符集大小) |
| 最大/最小值（deque） | O(n) | O(k) |

---

## 練習題目

### Easy
- [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)
- [LeetCode 1652 - Defuse the Bomb](https://leetcode.com/problems/defuse-the-bomb/)

### Medium
- [LeetCode 567 - Permutation in String](https://leetcode.com/problems/permutation-in-string/)
- [LeetCode 438 - Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)
- [LeetCode 1423 - Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/)
- [LeetCode 1461 - Check If a String Contains All Binary Codes of Size K](https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/)

### Hard
- [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- [LeetCode 1425 - Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)

---

## 重點回顧

1. **定長視窗** = 窗口大小固定為 k
2. **三種維護策略**：
   - 維護索引（最基本）
   - 維護值（和、平均、計數）
   - 維護最大/最小值（單調隊列）
3. **單調隊列**是處理窗口極值的關鍵技巧
4. **時間複雜度** O(n)：每個元素最多進出隊列一次
5. **常見錯誤**：窗口未形成就處理、索引計算錯誤

### 下一步

接下來將學習**不定長滑動視窗**，窗口大小會根據條件動態調整。
