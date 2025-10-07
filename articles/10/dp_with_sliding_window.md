---
title: "DP + Sliding Window"
order: 10
description: "結合動態規劃與滑動窗口的優化技巧"
tags: ["動態規劃", "滑動窗口", "單調隊列", "優化"]
---

# DP + Sliding Window

DP + 滑動窗口是一種將動態規劃與滑動窗口技巧結合的優化方法。當 DP 的轉移方程涉及一個**區間範圍內的最值**時,可以使用滑動窗口(通常是**單調隊列**)來優化時間複雜度。

## 核心概念

### 什麼時候需要滑動窗口優化?

當 DP 轉移方程是以下形式時:
```cpp
dp[i] = max/min { dp[j] + cost(j, i) }  for j in [i-k, i-1]
```

樸素做法:
```cpp
for (int i = 0; i < n; i++) {
    for (int j = max(0, i-k); j < i; j++) {
        dp[i] = max(dp[i], dp[j] + cost);
    }
}
```
時間複雜度: O(n × k)

**使用單調隊列優化後:**
時間複雜度: O(n)

### 單調隊列

單調隊列是一種特殊的雙端隊列,滿足:
- 隊列中的元素保持**單調性**(遞增或遞減)
- 支持隊首出隊、隊尾入隊
- 用於維護滑動窗口的最大值/最小值

**單調隊列的操作:**
```cpp
deque<int> dq;

// 維護單調遞減隊列(隊首最大)
void push(int i, vector<int>& arr) {
    // 移除隊尾所有小於 arr[i] 的元素
    while (!dq.empty() && arr[dq.back()] < arr[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
}

// 移除隊首過期元素
void pop(int i, int k) {
    if (!dq.empty() && dq.front() < i - k) {
        dq.pop_front();
    }
}

// 獲取窗口最大值
int getMax(vector<int>& arr) {
    return arr[dq.front()];
}
```

---

## 經典問題 1: 跳躍遊戲 VI (Jump Game VI)

[LeetCode 1696. Jump Game VI](https://leetcode.com/problems/jump-game-vi/)

### 問題描述

給定一個整數數組 nums 和一個整數 k。從索引 0 開始,每次可以向前跳 1 到 k 步。你的分數是經過的所有 nums[i] 的總和。返回你能獲得的最大分數。

**範例:**
```
輸入: nums = [1,-1,-2,4,-7,3], k = 2
輸出: 7
解釋: 選擇索引序列 [0, 2, 3, 5]
     分數 = 1 + (-2) + 4 + 3 = 6... 實際是 7

正確解釋: [0, 1, 3, 5]
         分數 = 1 + (-1) + 4 + 3 = 7
```

### 問題分析

**狀態定義:**
- `dp[i]`: 到達索引 i 的最大分數

**狀態轉移:**
```cpp
dp[i] = nums[i] + max(dp[j])  for j in [i-k, i-1]
```

**樸素做法:** O(n × k)
**優化:** 使用單調隊列維護窗口內的最大 dp 值

### 解法實現

#### 解法 1: 樸素 DP (會 TLE)

```cpp
class Solution {
public:
    int maxResult(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> dp(n);
        dp[0] = nums[0];

        for (int i = 1; i < n; i++) {
            dp[i] = INT_MIN;
            for (int j = max(0, i - k); j < i; j++) {
                dp[i] = max(dp[i], dp[j] + nums[i]);
            }
        }

        return dp[n - 1];
    }
};
```

**時間複雜度:** O(n × k)

#### 解法 2: 單調隊列優化

```cpp
class Solution {
public:
    int maxResult(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> dp(n);
        dp[0] = nums[0];

        deque<int> dq;  // 存儲索引
        dq.push_back(0);

        for (int i = 1; i < n; i++) {
            // 移除超出窗口範圍的元素
            while (!dq.empty() && dq.front() < i - k) {
                dq.pop_front();
            }

            // 計算 dp[i]
            dp[i] = dp[dq.front()] + nums[i];

            // 維護單調遞減隊列
            while (!dq.empty() && dp[dq.back()] <= dp[i]) {
                dq.pop_back();
            }

            dq.push_back(i);
        }

        return dp[n - 1];
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(n)

**單調隊列維護過程 (nums=[1,-1,-2,4,-7,3], k=2):**
```
i=0: dp=[1], dq=[0]
i=1: dp=[1,0], dq=[0,1] (dp[0]=1, dp[1]=1+(-1)=0)
i=2: dp=[1,0,-1], dq=[0,1,2]
     移除 dq[0] (超出範圍)
     dp[2] = dp[1] + nums[2] = 0 + (-2) = -2
     dq=[1,2]
i=3: 移除不必要的,dq=[3] (dp[3]=4+(-2)=2 or 4+0=4)
     dp[3] = max(dp[1], dp[2]) + nums[3] = 0 + 4 = 4
     dq=[3]
...
```

---

## 經典問題 2: 跳躍遊戲 II (Jump Game II)

[LeetCode 45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)

### 問題描述

給定一個非負整數數組 nums,你最初位於數組的第一個位置。數組中的每個元素代表你在該位置可以跳躍的最大長度。你的目標是使用最少的跳躍次數到達數組的最後一個位置。

**範例:**
```
輸入: nums = [2,3,1,1,4]
輸出: 2
解釋: 跳到最後位置的最小跳躍次數是 2
     從索引 0 → 1 → 4
```

### 問題分析

**狀態定義:**
- `dp[i]`: 到達索引 i 的最少跳躍次數

**狀態轉移:**
```cpp
dp[i] = min(dp[j] + 1)  for j where j + nums[j] >= i
```

### 解法實現

#### 解法 1: 貪心(最優)

```cpp
class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        int jumps = 0;
        int currentEnd = 0;
        int farthest = 0;

        for (int i = 0; i < n - 1; i++) {
            farthest = max(farthest, i + nums[i]);

            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }

        return jumps;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

#### 解法 2: DP + 優化

```cpp
class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;

        for (int i = 0; i < n; i++) {
            if (dp[i] == INT_MAX) continue;

            // 從 i 可以跳到 [i+1, i+nums[i]]
            for (int j = i + 1; j <= min(n - 1, i + nums[i]); j++) {
                dp[j] = min(dp[j], dp[i] + 1);
            }
        }

        return dp[n - 1];
    }
};
```

**時間複雜度:** O(n²)

---

## 經典問題 3: 滑動窗口最大值 (Sliding Window Maximum)

[LeetCode 239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

### 問題描述

給定一個數組 nums 和滑動窗口大小 k,找出每個窗口的最大值。

**範例:**
```
輸入: nums = [1,3,-1,-3,5,3,6,7], k = 3
輸出: [3,3,5,5,6,7]
解釋:
窗口位置                最大值
[1  3  -1] -3  5  3  6  7    3
 1 [3  -1  -3] 5  3  6  7    3
 1  3 [-1  -3  5] 3  6  7    5
 1  3  -1 [-3  5  3] 6  7    5
 1  3  -1  -3 [5  3  6] 7    6
 1  3  -1  -3  5 [3  6  7]   7
```

### 問題分析

雖然這題本身不是 DP,但它展示了單調隊列的經典應用,是理解 DP + 滑動窗口的基礎。

### 解法實現

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> result;
        deque<int> dq;  // 存儲索引,保持單調遞減

        for (int i = 0; i < nums.size(); i++) {
            // 移除超出窗口的元素
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }

            // 維護單調遞減
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }

            dq.push_back(i);

            // 窗口形成後,記錄最大值
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }

        return result;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(k)

---

## 單調隊列 vs 優先隊列

| 特性 | 單調隊列 | 優先隊列 (Heap) |
|------|----------|----------------|
| 時間複雜度 | O(n) | O(n log k) |
| 空間複雜度 | O(k) | O(k) |
| 實現難度 | 中等 | 簡單 |
| 適用場景 | 滑動窗口最值 | 一般最值 |
| 維護順序 | 保持單調性 | 堆序性 |

**優先隊列解法 (Jump Game VI):**
```cpp
class Solution {
public:
    int maxResult(vector<int>& nums, int k) {
        int n = nums.size();
        priority_queue<pair<int, int>> pq;  // {dp值, 索引}
        pq.push({nums[0], 0});

        int maxScore = nums[0];
        for (int i = 1; i < n; i++) {
            // 移除超出範圍的元素
            while (!pq.empty() && pq.top().second < i - k) {
                pq.pop();
            }

            maxScore = pq.top().first + nums[i];
            pq.push({maxScore, i});
        }

        return maxScore;
    }
};
```

**時間複雜度:** O(n log k)

---

## DP + 滑動窗口總結

### 適用場景

1. **DP 轉移涉及區間最值**
   - `dp[i] = max/min { dp[j] + ... }` for j in [i-k, i-1]

2. **窗口大小固定或有上限**
   - 通常窗口大小為 k

3. **需要優化 O(n²) 到 O(n)**
   - 樸素 DP 會 TLE

### 單調隊列模板

```cpp
// 維護窗口最大值的單調隊列
deque<int> dq;  // 存儲索引

for (int i = 0; i < n; i++) {
    // 1. 移除超出窗口的元素
    while (!dq.empty() && dq.front() < i - k) {
        dq.pop_front();
    }

    // 2. 計算 dp[i] (使用隊首元素)
    if (!dq.empty()) {
        dp[i] = dp[dq.front()] + ...;
    }

    // 3. 維護單調性(遞減:隊首最大)
    while (!dq.empty() && dp[dq.back()] <= dp[i]) {
        dq.pop_back();
    }

    dq.push_back(i);
}
```

### 關鍵要點

1. **單調隊列維護的是索引,不是值**
   - 方便檢查是否超出窗口範圍

2. **單調性的選擇**
   - 求最大值:單調遞減(隊首最大)
   - 求最小值:單調遞增(隊首最小)

3. **順序很重要**
   - 先移除過期元素
   - 再計算 dp
   - 最後維護單調性

4. **邊界處理**
   - 初始化第一個元素
   - 窗口未形成時的特殊處理

### 複雜度分析

- **時間複雜度:** O(n)
  - 每個元素最多入隊、出隊各一次

- **空間複雜度:** O(n) 或 O(k)
  - dp 數組: O(n)
  - 單調隊列: O(k)

### 常見錯誤

1. **隊列維護的是值而不是索引**
   - 無法判斷是否超出窗口

2. **單調性維護錯誤**
   - 條件寫反(< vs <=)

3. **順序錯誤**
   - 在維護單調性之前就使用了隊列

4. **邊界處理遺漏**
   - 窗口未滿時的特殊情況

---

DP + 滑動窗口是一種強大的優化技巧,通過單調隊列可以將某些 O(n²) 的 DP 優化到 O(n)。掌握單調隊列的原理和使用方法,是解決這類問題的關鍵。這種技巧在競賽和面試中都很常見,值得深入學習。
