---
title: "二分搜尋進階"
order: 1
description: "深入理解二分搜尋的各種變形"
tags: ["二分搜尋", "進階"]
---

# 二分搜尋進階

## 基本概念

二分搜尋是一種在有序數組中查找特定元素的高效演算法，時間複雜度為 O(log n)。

## 基本模板

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

## 常見變形

### 1. 查找第一個等於目標值的位置

```python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            result = mid
            right = mid - 1  # 繼續向左找
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result
```

### 2. 查找最後一個等於目標值的位置

```python
def find_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            result = mid
            left = mid + 1  # 繼續向右找
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result
```

## 應用場景

- 在有序數組中查找元素
- 查找峰值
- 旋轉數組搜索
- 答案的二分搜尋（最小化最大值、最大化最小值）
