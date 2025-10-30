---
title: 02-3. Divide and Conquer (分治法)
order: 3
description: 分治法的核心思想：分割、解決、合併
tags:
  - Divide and Conquer
  - 分治法
  - 遞迴
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Divide and Conquer (分治法)

## 前言

**Divide and Conquer (分治法)** 是一種重要的演算法設計策略，將大問題**分割**成小問題，分別解決後再**合併**結果。

---

## 核心思想

### 三步驟

1. **Divide (分割)**: 將問題分成若干子問題
2. **Conquer (解決)**: 遞迴解決子問題
3. **Combine (合併)**: 將子問題的解合併成原問題的解

```
原問題 (大)
   ↓ Divide
子問題1  子問題2  子問題3
   ↓ Conquer (遞迴)
解1      解2      解3
   ↓ Combine
最終解
```

### 遞迴結構

```cpp
解法 divide_and_conquer(問題 P) {
    if (P 夠小) {
        return 直接解決(P);  // Base case
    }

    // Divide
    子問題[] = 分割(P);

    // Conquer
    for (子問題 sub : 子問題) {
        解[sub] = divide_and_conquer(sub);
    }

    // Combine
    return 合併(解);
}
```

---

## 經典範例

### 1. Merge Sort (合併排序)

**最經典的分治法應用**。

```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;

    // Combine: 合併兩個有序陣列
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (int i = 0; i < k; i++) {
        arr[left + i] = temp[i];
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;  // Base case

    // Divide: 分成兩半
    int mid = left + (right - left) / 2;

    // Conquer: 遞迴排序
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    // Combine: 合併結果
    merge(arr, left, mid, right);
}
```

**時間複雜度**: O(n log n)

**過程**:
```
[5, 2, 8, 1, 9]

Divide:
[5, 2]    [8, 1, 9]
[5] [2]   [8] [1, 9]
          [8] [1] [9]

Conquer + Combine:
[2, 5]    [1, 8] [9]
[2, 5]    [1, 8, 9]
[1, 2, 5, 8, 9]
```

---

### 2. Quick Sort (快速排序)

```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        // Divide: 分割成兩部分
        int pi = partition(arr, low, high);

        // Conquer: 遞迴排序
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);

        // Combine: 不需要，已在 partition 中完成
    }
}
```

**時間複雜度**: 平均 O(n log n)

---

### 3. Binary Search (二分搜尋)

```cpp
int binarySearch(vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;  // Base case

    // Divide: 分成兩半
    int mid = left + (right - left) / 2;

    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        // Conquer: 只需搜尋右半
        return binarySearch(arr, target, mid + 1, right);
    } else {
        // Conquer: 只需搜尋左半
        return binarySearch(arr, target, left, mid - 1);
    }

    // Combine: 不需要
}
```

**時間複雜度**: O(log n)

**特點**: 只需解決一個子問題

---

### 4. Maximum Subarray (最大子陣列)

**問題**: 找出連續子陣列的最大和

```cpp
int maxCrossingSum(vector<int>& arr, int left, int mid, int right) {
    // 找跨越中點的最大子陣列
    int leftSum = INT_MIN, sum = 0;
    for (int i = mid; i >= left; i--) {
        sum += arr[i];
        leftSum = max(leftSum, sum);
    }

    int rightSum = INT_MIN;
    sum = 0;
    for (int i = mid + 1; i <= right; i++) {
        sum += arr[i];
        rightSum = max(rightSum, sum);
    }

    return leftSum + rightSum;
}

int maxSubArray(vector<int>& arr, int left, int right) {
    if (left == right) {
        return arr[left];  // Base case
    }

    // Divide
    int mid = left + (right - left) / 2;

    // Conquer
    int leftMax = maxSubArray(arr, left, mid);
    int rightMax = maxSubArray(arr, mid + 1, right);
    int crossMax = maxCrossingSum(arr, left, mid, right);

    // Combine
    return max({leftMax, rightMax, crossMax});
}
```

**時間複雜度**: O(n log n)

**三種情況**:
```
[−2, 1, −3, 4, −1, 2, 1, −5, 4]
           ↑ mid

1. 最大子陣列在左半: [4]
2. 最大子陣列在右半: [4, −1, 2, 1]
3. 跨越中點: 可能更大
```

---

### 5. Pow(x, n) - 快速冪

```cpp
double myPow(double x, int n) {
    if (n == 0) return 1.0;  // Base case

    long long N = n;
    if (N < 0) {
        x = 1 / x;
        N = -N;
    }

    // Divide: 分成兩半
    double half = myPow(x, N / 2);

    // Combine
    if (N % 2 == 0) {
        return half * half;
    } else {
        return half * half * x;
    }
}
```

**時間複雜度**: O(log n)

**原理**:
```
x^8 = (x^4)^2
x^4 = (x^2)^2
x^2 = (x^1)^2

只需計算 log n 次
```

---

## 分治法的時間複雜度分析

### Master Theorem (主定理)

對於遞迴式：`T(n) = aT(n/b) + f(n)`

其中：
- `a` = 子問題數量
- `n/b` = 子問題大小
- `f(n)` = 分割和合併的成本

**三種情況**:

1. **f(n) = O(n^c), c < log_b(a)**
   - `T(n) = O(n^log_b(a))`

2. **f(n) = O(n^c), c = log_b(a)**
   - `T(n) = O(n^c log n)`

3. **f(n) = O(n^c), c > log_b(a)**
   - `T(n) = O(f(n))`

### 實例

#### Merge Sort
```
T(n) = 2T(n/2) + O(n)

a = 2, b = 2, f(n) = O(n)
log_2(2) = 1

→ 情況 2: T(n) = O(n log n)
```

#### Binary Search
```
T(n) = T(n/2) + O(1)

a = 1, b = 2, f(n) = O(1)
log_2(1) = 0

→ 情況 2: T(n) = O(log n)
```

#### Karatsuba (大數乘法)
```
T(n) = 3T(n/2) + O(n)

a = 3, b = 2, f(n) = O(n)
log_2(3) ≈ 1.585

→ 情況 1: T(n) = O(n^1.585)
```

---

## 分治法 vs 其他策略

### vs 動態規劃

| 特性 | 分治法 | 動態規劃 |
|-----|-------|---------|
| **子問題** | 獨立 | 重疊 |
| **記憶** | 不需要 | 需要記憶化 |
| **合併** | 需要合併步驟 | 通常不需要 |
| **範例** | Merge Sort | Fibonacci |

```cpp
// 分治法：子問題獨立
mergeSort(left);
mergeSort(right);

// DP：子問題重疊
dp[i] = dp[i-1] + dp[i-2];  // 重複使用 dp[i-1]
```

### vs 貪心法

| 特性 | 分治法 | 貪心法 |
|-----|-------|--------|
| **決策** | 考慮所有子問題 | 局部最優 |
| **正確性** | 總是正確 | 可能錯誤 |
| **效率** | O(n log n) 以上 | 通常 O(n) |

---

## 分治法的應用

### 1. 排序演算法
- Merge Sort
- Quick Sort
- Heap Sort (部分)

### 2. 搜尋演算法
- Binary Search
- Quick Select (找第 k 大)

### 3. 數學運算
- 快速冪
- Karatsuba 乘法
- Strassen 矩陣乘法

### 4. 幾何演算法
- 最近點對問題
- 凸包問題

### 5. 字串演算法
- Merge Sort 字串

---

## LeetCode 練習題

### 基礎
- [Merge Sort an Array](https://leetcode.com/problems/sort-an-array/)
- [Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/)
- [Pow(x, n)](https://leetcode.com/problems/powx-n/)

### 進階
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

### 困難
- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)
- [Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)

---

## 實作技巧

### 1. 選擇合適的分割點

```cpp
// 平均分割
int mid = left + (right - left) / 2;

// Quick Sort: 選 pivot
int pivot = arr[high];  // 或隨機選擇
```

### 2. 處理邊界條件

```cpp
if (left >= right) return;  // 重要！

// 或
if (left == right) {
    return arr[left];
}
```

### 3. 合併策略

```cpp
// Merge Sort: 兩個有序陣列合併
// Quick Sort: 不需要合併（已在 partition 完成）
// Binary Search: 不需要合併
```

---

## 重點總結

### 分治法的核心

1. **Divide**: 分割問題
2. **Conquer**: 遞迴解決
3. **Combine**: 合併結果

### 適用場景

- 問題可以分割成**相似的子問題**
- 子問題之間**獨立**（無重疊）
- 子問題的解可以**合併**

### 時間複雜度

- 通常是 O(n log n) 或 O(log n)
- 使用 Master Theorem 分析

### 常見模式

- **二分**: Binary Search, 快速冪
- **均分**: Merge Sort, Maximum Subarray
- **不均分**: Quick Sort

### 記憶技巧

- 看到「排序」→ Merge Sort
- 看到「搜尋」→ Binary Search
- 看到「最大/最小」→ 考慮分治
- 子問題獨立 → 分治法
- 子問題重疊 → 動態規劃
