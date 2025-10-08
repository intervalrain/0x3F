---
title: 04-0. 二分法介紹
order: 0
description: 二分搜尋的核心概念、模板與應用場景
tags:
  - Binary Search
  - 二分搜尋
  - 二分法
author: Rain Hu
date: '2025-10-08'
draft: false
---

# 二分法介紹

## 核心概念

**二分搜尋 (Binary Search)** 是一種在**有序資料**中快速查找目標值的演算法。

### 基本原理

每次將搜尋範圍縮小一半，直到找到目標或確定不存在。

```
有序陣列: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
查找 target = 7

步驟 1: left = 0, right = 9, mid = 4
        arr[4] = 9 > 7 → 往左找

步驟 2: left = 0, right = 3, mid = 1
        arr[1] = 3 < 7 → 往右找

步驟 3: left = 2, right = 3, mid = 2
        arr[2] = 5 < 7 → 往右找

步驟 4: left = 3, right = 3, mid = 3
        arr[3] = 7 == 7 → 找到！
```

### 時間複雜度

- **最佳**：O(1)（第一次就找到）
- **平均**：O(log n)
- **最差**：O(log n)

**為什麼是 O(log n)？**
- 每次範圍減半：n → n/2 → n/4 → ... → 1
- 需要 log₂(n) 次操作

---

## 適用條件

### 必要條件

1. **資料有序**（遞增或遞減）
2. **可以隨機存取**（陣列、vector）

### 不適用場景

- **無序資料**：需要先排序 O(n log n)
- **鏈表**：無法 O(1) 隨機存取中點

---

## 基本模板

### 模板 1：找確切值

```cpp
// 在有序陣列中查找 target
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢位

        if (arr[mid] == target) {
            return mid;  // 找到
        } else if (arr[mid] < target) {
            left = mid + 1;  // 往右找
        } else {
            right = mid - 1;  // 往左找
        }
    }

    return -1;  // 未找到
}
```

**關鍵點**：
- 循環條件：`left <= right`
- 中點計算：`left + (right - left) / 2`（避免 `(left + right) / 2` 溢位）
- 移動邊界：`left = mid + 1` 或 `right = mid - 1`

### 模板 2：左邊界（第一個 >= target 的位置）

```cpp
// 找第一個 >= target 的位置
int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;  // 可能是答案，繼續往左找
        }
    }

    return left;
}
```

**關鍵點**：
- 循環條件：`left < right`（沒有等號）
- `right` 初始值：`arr.size()`（可以返回 n）
- 移動 right：`right = mid`（不是 `mid - 1`）

### 模板 3：右邊界（最後一個 <= target 的位置）

```cpp
// 找最後一個 <= target 的位置
int upperBound(vector<int>& arr, int target) {
    int left = -1, right = arr.size() - 1;

    while (left < right) {
        int mid = left + (right - left + 1) / 2;  // 向上取整

        if (arr[mid] > target) {
            right = mid - 1;
        } else {
            left = mid;  // 可能是答案，繼續往右找
        }
    }

    return left;
}
```

**關鍵點**：
- `left` 初始值：`-1`（可以返回 -1）
- 中點計算：`(left + right + 1) / 2`（向上取整，避免死循環）
- 移動 left：`left = mid`（不是 `mid + 1`）

---

## 三種模板對比

| 特性 | 模板 1（找確切值） | 模板 2（左邊界） | 模板 3（右邊界） |
|-----|-----------------|----------------|----------------|
| **循環條件** | `left <= right` | `left < right` | `left < right` |
| **初始 left** | 0 | 0 | -1 |
| **初始 right** | n - 1 | n | n - 1 |
| **mid 計算** | `(L+R)/2` | `(L+R)/2` | `(L+R+1)/2` 向上取整 |
| **移動左** | `mid + 1` | `mid + 1` | `mid` |
| **移動右** | `mid - 1` | `mid` | `mid - 1` |
| **返回值** | mid 或 -1 | left（第一個>=target） | left（最後一個<=target） |

---

## 常見錯誤

### 1. 溢位問題

```cpp
// ✗ 錯誤：當 left 和 right 很大時會溢位
int mid = (left + right) / 2;

// ✓ 正確：防止溢位
int mid = left + (right - left) / 2;
```

### 2. 死循環

```cpp
// ✗ 錯誤：當 left = 1, right = 2 時
int mid = (left + right) / 2;  // mid = 1
left = mid;  // left 永遠是 1，死循環

// ✓ 正確：向上取整
int mid = left + (right - left + 1) / 2;
```

**何時向上取整？**
- 當更新 `left = mid` 時，需要向上取整
- 當更新 `right = mid` 時，向下取整（默認）

### 3. 邊界條件

```cpp
// 注意返回值是否需要檢查
int idx = binarySearch(arr, target);
if (idx == -1) {
    // 未找到
}

// 左邊界可能返回 arr.size()
int idx = lowerBound(arr, target);
if (idx == arr.size()) {
    // 所有元素都 < target
}
```

---

## STL 函數

C++ STL 提供了二分搜尋相關函數：

### 1. binary_search

```cpp
// 判斷 target 是否存在
bool found = binary_search(arr.begin(), arr.end(), target);
```

### 2. lower_bound

```cpp
// 返回第一個 >= target 的迭代器
auto it = lower_bound(arr.begin(), arr.end(), target);
int idx = it - arr.begin();
```

### 3. upper_bound

```cpp
// 返回第一個 > target 的迭代器
auto it = upper_bound(arr.begin(), arr.end(), target);
int idx = it - arr.begin();
```

### 4. equal_range

```cpp
// 返回 [lower_bound, upper_bound)
auto [l, r] = equal_range(arr.begin(), arr.end(), target);
int count = r - l;  // target 出現次數
```

---

## 應用場景

### 1. 基礎查找

- 在有序陣列中查找元素
- 查找插入位置

### 2. 二分猜答案

- 猜測結果，驗證可行性
- 最小化最大值、最大化最小值

### 3. 旋轉/部分有序陣列

- 旋轉排序陣列
- 山脈陣列

### 4. 搜尋空間離散化

- 答案範圍很大，但可以二分
- 浮點數二分

---

## 經典題目

### Easy
- [LeetCode 704 - Binary Search](https://leetcode.com/problems/binary-search/)
- [LeetCode 35 - Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [LeetCode 69 - Sqrt(x)](https://leetcode.com/problems/sqrtx/)

### Medium
- [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [LeetCode 33 - Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [LeetCode 74 - Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)
- [LeetCode 153 - Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

### Hard
- [LeetCode 4 - Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

---

## 範例：Binary Search

**問題**：[LeetCode 704](https://leetcode.com/problems/binary-search/)

在有序陣列中查找 target，存在返回索引，不存在返回 -1。

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

---

## 重點回顧

1. **核心思想**：每次縮小一半搜尋範圍
2. **時間複雜度**：O(log n)
3. **三種模板**：
   - 找確切值：`left <= right`
   - 左邊界：`left < right`, `right = mid`
   - 右邊界：`left < right`, `left = mid`, 向上取整
4. **常見錯誤**：溢位、死循環、邊界條件
5. **適用條件**：有序 + 可隨機存取

### 下一步

接下來將學習二分搜尋的三個主要應用：
1. 基礎查找
2. 二分猜答案
3. 第 K 小/大元素
