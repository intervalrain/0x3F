---
title: "演算法概述"
order: 0
description: "演算法的選擇策略：以找某值為例，探討時間與空間的權衡"
tags: ["演算法", "複雜度", "Hash Table", "Binary Search"]
---

# 演算法概述

## 前言

選擇合適的演算法，取決於**資料特性**和**使用場景**。本章以「找某值」為例，說明不同情況下的最佳策略。

---

## 問題：在陣列中查找某個值

### 場景 1: 亂序陣列，單次查詢

**資料**: `[3, 7, 1, 9, 2, 5]`
**需求**: 查找 `target = 9` 是否存在

#### 解法：線性遍歷 (Linear Search)

```cpp
bool find(vector<int>& arr, int target) {
    for (int num : arr) {
        if (num == target) {
            return true;
        }
    }
    return false;
}
```

**時間複雜度**: O(n)
**空間複雜度**: O(1)

**結論**: 亂序陣列必須遍歷，最壞情況需要檢查所有元素。

---

### 場景 2: 有序陣列，單次查詢

**資料**: `[1, 2, 3, 5, 7, 9]` (已排序)
**需求**: 查找 `target = 5` 是否存在

#### 解法：二分搜尋 (Binary Search)

```cpp
bool binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return true;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}
```

**時間複雜度**: O(log n)
**空間複雜度**: O(1)

**結論**: 有序陣列可以使用二分搜尋，大幅降低時間複雜度。

**範例**:
```
arr = [1, 2, 3, 5, 7, 9], target = 5

步驟:
1. mid = 2, arr[2] = 3 < 5, left = 3
2. mid = 4, arr[4] = 7 > 5, right = 3
3. mid = 3, arr[3] = 5 == 5, 找到！

只需 3 次比較
線性搜尋需要 4 次比較
```

---

### 場景 3: 亂序陣列，多次查詢（靜態資料）

**資料**: `[3, 7, 1, 9, 2, 5]`
**需求**: 多次查詢不同的值，資料不變

#### 解法 1: 每次遍歷

```cpp
bool find(vector<int>& arr, int target) {
    for (int num : arr) {
        if (num == target) return true;
    }
    return false;
}

// 查詢 k 次不同的值
// 總時間: O(k * n)
```

**缺點**: 每次查詢都要 O(n)，效率低

#### 解法 2: 預處理成 Hash Table

```cpp
class Finder {
private:
    unordered_set<int> hashSet;

public:
    Finder(vector<int>& arr) {
        // 預處理：O(n)
        for (int num : arr) {
            hashSet.insert(num);
        }
    }

    bool find(int target) {
        // 查詢：O(1) 平均
        return hashSet.count(target);
    }
};

// 查詢 k 次
// 總時間: O(n + k)
```

**時間複雜度**:
- 預處理: O(n)
- 每次查詢: 攤銷 O(1)
- 總計: O(n + k)

**空間複雜度**: O(n)

**結論**: **用空間換時間**，預先建立 Hash Table，將查詢從 O(n) 降到 O(1)。

**比較**:
```
假設 n = 1,000,000, k = 1,000

解法 1: 1,000 × 1,000,000 = 1,000,000,000 次操作
解法 2: 1,000,000 + 1,000 = 1,001,000 次操作

速度差距約 1000 倍！
```

---

### 場景 4: 動態陣列，頻繁查詢與插入

**資料**: `[3, 7, 1, 9, 2, 5]`
**需求**:
- 頻繁查詢某值是否存在
- 頻繁插入新元素

#### 解法 1: 使用 Vector + 線性搜尋

```cpp
class Finder {
private:
    vector<int> arr;

public:
    void insert(int val) {
        arr.push_back(val);  // O(1)
    }

    bool find(int target) {
        for (int num : arr) {
            if (num == target) return true;
        }
        return false;  // O(n)
    }
};

// m 次插入 + k 次查詢
// 總時間: O(m + k*n)
```

**缺點**: 查詢慢

#### 解法 2: 維護 Hash Set

```cpp
class Finder {
private:
    unordered_set<int> hashSet;

public:
    void insert(int val) {
        hashSet.insert(val);  // O(1) 平均
    }

    void remove(int val) {
        hashSet.erase(val);  // O(1) 平均
    }

    bool find(int target) {
        return hashSet.count(target);  // O(1) 平均
    }
};

// m 次插入 + k 次查詢
// 總時間: O(m + k)
```

**時間複雜度**:
- 插入/刪除: 攤銷 O(1)
- 查詢: 攤銷 O(1)

**空間複雜度**: O(n)

#### 解法 3: 維護有序集合 (需要排序)

```cpp
class Finder {
private:
    set<int> sortedSet;  // 自動排序

public:
    void insert(int val) {
        sortedSet.insert(val);  // O(log n)
    }

    bool find(int target) {
        return sortedSet.count(target);  // O(log n)
    }

    // 額外功能：範圍查詢
    int findLowerBound(int val) {
        auto it = sortedSet.lower_bound(val);
        return it != sortedSet.end() ? *it : -1;
    }
};
```

**優點**: 支援範圍查詢、有序遍歷
**缺點**: 插入和查詢比 Hash Set 慢

**結論**:
- 只需要查找 → `unordered_set` (最快)
- 需要排序或範圍查詢 → `set`
- 記憶體受限 → `vector` + 線性搜尋

---

### 場景 5: 有序陣列，查詢某值的位置

**資料**: `[1, 2, 3, 5, 7, 9]` (已排序)
**需求**: 查找 `target = 5` 的索引位置

#### 解法 1: 線性搜尋

```cpp
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

// 時間: O(n)
```

**缺點**: 沒有利用「有序」的特性

#### 解法 2: 二分搜尋

```cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// 時間: O(log n)
```

**優勢**: 每次排除一半的候選

**比較**:
```
n = 1,000,000

線性搜尋: 最多 1,000,000 次比較
二分搜尋: 最多 20 次比較 (log₂ 1,000,000 ≈ 20)

差距: 50,000 倍！
```

**結論**: **有序資料必用二分搜尋**，將 O(n) 降到 O(log n)。

---

## 演算法選擇策略

### 決策流程圖

```
資料是否有序？
├─ Yes → 二分搜尋 O(log n)
│
└─ No  → 查詢次數？
         ├─ 單次 → 線性搜尋 O(n)
         │
         └─ 多次 → 資料是否靜態？
                  ├─ Yes → Hash Table O(n + k)
                  │
                  └─ No  → 需要什麼操作？
                           ├─ 只查找 → unordered_set O(1)
                           ├─ 查找 + 需排序 → set O(log n)
                           └─ 查找 + 頻繁插刪 → unordered_set O(1)
```

### 策略總結

| 場景 | 解法 | 查詢時間 | 空間複雜度 | 策略 |
|-----|------|---------|----------|------|
| **亂序 + 單次查詢** | 線性搜尋 | O(n) | O(1) | 無法優化 |
| **有序 + 查詢** | 二分搜尋 | O(log n) | O(1) | 利用有序性 |
| **靜態 + 多次查詢** | Hash Table | O(1) | O(n) | 空間換時間 |
| **動態 + 只查找** | unordered_set | O(1) | O(n) | 最快 |
| **動態 + 需排序** | set | O(log n) | O(n) | 平衡樹 |
| **需要索引位置** | 二分搜尋 | O(log n) | O(1) | 有序前提 |

---

## 空間換時間的常見例子

### 1. Hash Table

**場景**: Two Sum 問題

```cpp
// 暴力解法: O(n²)
vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}

// Hash Table: O(n) 時間，O(n) 空間
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}
```

**策略**: 用 O(n) 空間換取 O(n²) → O(n) 的時間優化

### 2. 記憶化搜尋 (Memoization)

**場景**: 計算費氏數列

```cpp
// 遞迴: O(2^n)
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// 記憶化: O(n) 時間，O(n) 空間
unordered_map<int, int> memo;

int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];

    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}
```

**策略**: 用 O(n) 空間避免重複計算，從 O(2^n) 降到 O(n)

### 3. 前綴和 (Prefix Sum)

**場景**: 多次查詢區間和

```cpp
// 每次計算: O(n)
int rangeSum(vector<int>& arr, int i, int j) {
    int sum = 0;
    for (int k = i; k <= j; k++) {
        sum += arr[k];
    }
    return sum;
}

// 前綴和: 預處理 O(n)，查詢 O(1)
class PrefixSum {
private:
    vector<int> prefix;

public:
    PrefixSum(vector<int>& arr) {
        int n = arr.size();
        prefix.resize(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
    }

    int rangeSum(int i, int j) {
        return prefix[j + 1] - prefix[i];
    }
};
```

**策略**: 用 O(n) 空間預處理，將每次查詢從 O(n) 降到 O(1)

---

## Binary Search 的應用

### 有序陣列中查找元素

```cpp
// 線性搜尋: O(n)
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

// 二分搜尋: O(log n)
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}
```

**前提**: 資料必須有序
**優勢**: O(log n) << O(n)

**複雜度對比**:
```
n = 10:      線性 10 次  vs 二分 4 次
n = 100:     線性 100 次 vs 二分 7 次
n = 1,000:   線性 1,000 次 vs 二分 10 次
n = 1,000,000: 線性 1,000,000 次 vs 二分 20 次
```

---

## 時間與空間的權衡

### 權衡原則

| 情況 | 策略 |
|-----|------|
| **記憶體充足 + 速度要求高** | 空間換時間 |
| **記憶體受限 + 速度要求低** | 時間換空間 |
| **一次性計算** | 不需要預處理 |
| **頻繁查詢** | 值得預處理 |

### 實際例子

#### 例 1: LeetCode 中的選擇

```cpp
// 問題：判斷陣列中是否有重複元素

// 解法 1: 排序 - O(n log n) 時間，O(1) 空間
bool containsDuplicate(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}

// 解法 2: Hash Set - O(n) 時間，O(n) 空間
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num)) return true;
        seen.insert(num);
    }
    return false;
}
```

**選擇**:
- 小資料或記憶體受限 → 排序
- 大資料且記憶體充足 → Hash Set

#### 例 2: 動態規劃的空間優化

```cpp
// 標準 DP: O(n) 空間
int fib(int n) {
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// 空間優化: O(1) 空間
int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

**策略**: 當只需要前幾個狀態時，可以優化空間

---

## LeetCode 練習題

### 基礎
- [Two Sum](https://leetcode.com/problems/two-sum/) - Hash Table
- [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) - Hash Set
- [Binary Search](https://leetcode.com/problems/binary-search/) - 二分搜尋

### 空間換時間
- [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) - Prefix Sum
- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) - DP 或空間優化

### Binary Search
- [Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

---

## 重點總結

### 演算法選擇的關鍵因素

1. **資料特性**
   - 有序 vs 亂序
   - 靜態 vs 動態
   - 資料量大小

2. **操作類型**
   - 單次查詢 vs 多次查詢
   - 只讀 vs 讀寫混合
   - 是否需要維持順序

3. **效能要求**
   - 時間限制
   - 空間限制
   - 實時性要求

### 常見優化策略

- **排序**: 將查找從 O(n) 降到 O(log n)
- **Hash Table**: 將查找從 O(n) 降到 O(1)
- **Binary Search**: 有序資料必用，O(log n)
- **預處理**: 用空間換時間
- **記憶化**: 避免重複計算

### 記憶技巧

- 靜態 + 多次查詢 = **預處理 (Hash Table)**
- 動態 + 頻繁操作 = **維護資料結構** (Set, Map)
- 有序資料 = **Binary Search**
- 亂序資料 + 快速查找 = **Hash Table**
- 查詢次數 > 資料量 = **值得預處理**
