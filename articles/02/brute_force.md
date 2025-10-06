---
title: "Brute Force (暴力法)"
order: 2
description: "暴力法的概念、應用場景與優化策略"
tags: ["Brute Force", "暴力法", "窮舉"]
---

# Brute Force (暴力法)

## 前言

**Brute Force (暴力法)** 是最直接的解題策略：**嘗試所有可能的解法**，直到找到答案。

---

## 基本概念

### 定義

暴力法透過**窮舉所有可能性**來解決問題。

```
問題：找出陣列中兩數之和等於 target

暴力法：檢查所有配對
for i = 0 to n-1:
    for j = i+1 to n-1:
        if arr[i] + arr[j] == target:
            return (i, j)
```

###特性

- ✓ **一定能找到答案**（如果存在）
- ✓ **容易理解和實作**
- ✗ **時間複雜度高**
- ✗ **不適合大資料**

---

## 經典範例

### 1. Two Sum (暴力解)

```cpp
// LeetCode 1. Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();

    // 嘗試所有配對
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }

    return {};
}
```

**時間複雜度**: O(n²)
**空間複雜度**: O(1)

**優化**: 使用 Hash Table → O(n)

---

### 2. 最大子陣列和 (暴力解)

```cpp
// LeetCode 53. Maximum Subarray
int maxSubArray(vector<int>& nums) {
    int n = nums.size();
    int maxSum = INT_MIN;

    // 嘗試所有子陣列
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            maxSum = max(maxSum, currentSum);
        }
    }

    return maxSum;
}
```

**時間複雜度**: O(n²)
**空間複雜度**: O(1)

**優化**: Kadane's Algorithm → O(n)

---

### 3. 字串匹配 (暴力解)

```cpp
// 在文本中找pattern
int strStr(string haystack, string needle) {
    int m = haystack.size();
    int n = needle.size();

    // 嘗試所有起始位置
    for (int i = 0; i <= m - n; i++) {
        int j = 0;
        while (j < n && haystack[i + j] == needle[j]) {
            j++;
        }
        if (j == n) return i;
    }

    return -1;
}
```

**時間複雜度**: O(m × n)
**空間複雜度**: O(1)

**優化**: KMP Algorithm → O(m + n)

---

## 何時使用暴力法？

### 適用場景

1. **資料量小** (n ≤ 20)
   ```cpp
   // n ≤ 10: O(n!) 可接受
   // n ≤ 20: O(2^n) 可接受
   // n ≤ 1000: O(n²) 可接受
   ```

2. **沒有更好的演算法**
   - 某些 NP-Complete 問題只能暴力

3. **快速驗證想法**
   - 先寫暴力解，確保理解問題
   - 再優化

4. **生成測試資料**
   - 用暴力解驗證優化解的正確性

---

## 暴力法的變體

### 1. 完全窮舉

檢查**所有可能**。

```cpp
// 生成所有子集
void generateSubsets(vector<int>& nums) {
    int n = nums.size();
    int total = 1 << n;  // 2^n

    for (int mask = 0; mask < total; mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push_back(nums[i]);
            }
        }
        // 處理 subset
    }
}
```

**時間複雜度**: O(2^n × n)

---

### 2. 剪枝 (Pruning)

提前排除不可能的情況。

```cpp
// 組合總和，剪枝優化
void combinationSum(vector<int>& candidates, int target,
                    vector<int>& current, int start) {
    if (target == 0) {
        // 找到解
        return;
    }

    for (int i = start; i < candidates.size(); i++) {
        // 剪枝：如果當前數字已經大於目標，後面更大
        if (candidates[i] > target) break;

        current.push_back(candidates[i]);
        combinationSum(candidates, target - candidates[i], current, i);
        current.pop_back();
    }
}
```

**優化**: 排除不必要的分支，減少計算

---

### 3. 記憶化 (Memoization)

儲存已計算的結果，避免重複計算。

```cpp
// 費氏數列
unordered_map<int, int> memo;

int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];

    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}
```

**優化**: O(2^n) → O(n)

---

## 暴力法 → 優化的過程

### 範例：3Sum 問題

#### 暴力解法 O(n³)

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    int n = nums.size();

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] == 0) {
                    result.push_back({nums[i], nums[j], nums[k]});
                }
            }
        }
    }

    return result;
}
```

#### 優化 1: 排序 + 雙指針 O(n²)

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    sort(nums.begin(), nums.end());
    int n = nums.size();

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}
```

**優化**: 固定一個數，用雙指針找另外兩個

---

## 常見暴力法模式

### 1. 雙重迴圈

```cpp
// 找所有配對
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        // 檢查 (i, j)
    }
}
```

**應用**: Two Sum, Pair相關問題

### 2. 位元遮罩

```cpp
// 生成所有子集
for (int mask = 0; mask < (1 << n); mask++) {
    // mask 代表一個子集
}
```

**應用**: 子集、組合問題

### 3. 全排列

```cpp
// 生成所有排列
void permute(vector<int>& nums, int start) {
    if (start == nums.size()) {
        // 處理一個排列
        return;
    }

    for (int i = start; i < nums.size(); i++) {
        swap(nums[start], nums[i]);
        permute(nums, start + 1);
        swap(nums[start], nums[i]);
    }
}
```

**應用**: 排列、旅行推銷員問題

---

## LeetCode 練習題

### 基礎暴力
- [Two Sum](https://leetcode.com/problems/two-sum/)
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- [Palindrome Number](https://leetcode.com/problems/palindrome-number/)

### 暴力 + 優化
- [3Sum](https://leetcode.com/problems/3sum/)
- [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

### 窮舉
- [Subsets](https://leetcode.com/problems/subsets/)
- [Permutations](https://leetcode.com/problems/permutations/)

---

## 重點總結

### 暴力法的價值

1. **建立基準**: 先有暴力解，再優化
2. **驗證想法**: 確保理解問題
3. **測試工具**: 生成測試資料
4. **面試技巧**: 展示思考過程

### 優化方向

- **排序**: 降低一層迴圈
- **Hash Table**: O(n) 查找
- **雙指針**: O(n²) → O(n)
- **剪枝**: 減少不必要的計算
- **記憶化**: 避免重複計算

### 記憶技巧

- n ≤ 10 → O(n!) 可接受
- n ≤ 20 → O(2^n) 可接受
- n ≤ 500 → O(n³) 可接受
- n ≤ 5000 → O(n²) 可接受

### 面試建議

1. 先說暴力解
2. 分析時間複雜度
3. 討論優化方向
4. 實作優化解
