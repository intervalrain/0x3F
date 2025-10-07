---
title: "基礎查找"
order: 1
description: "二分搜尋的基礎應用：查找元素、插入位置、邊界查找"
tags: ["Binary Search", "Basic Search", "基礎查找"]
---

# 基礎查找 (Basic Search)

## 核心概念

基礎查找是二分搜尋最直接的應用，包括：
1. 查找確切的元素
2. 查找插入位置
3. 查找左右邊界

---

## 場景 1：查找元素是否存在

### 問題：Binary Search

**題目**：[LeetCode 704](https://leetcode.com/problems/binary-search/)

在升序陣列中查找 target，存在返回索引，不存在返回 -1。

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

## 場景 2：查找插入位置

### 問題：Search Insert Position

**題目**：[LeetCode 35](https://leetcode.com/problems/search-insert-position/)

在升序陣列中查找 target，返回其索引。若不存在，返回它應該插入的位置。

```
輸入: nums = [1,3,5,6], target = 5
輸出: 2

輸入: nums = [1,3,5,6], target = 2
輸出: 1（插入位置）

輸入: nums = [1,3,5,6], target = 7
輸出: 4（插入位置）
```

**思路**：找第一個 >= target 的位置（lower_bound）

```cpp
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size();

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

**為什麼返回 left？**
```
nums = [1, 3, 5, 6], target = 2

循環過程:
left=0, right=4, mid=2: nums[2]=5 >= 2 → right=2
left=0, right=2, mid=1: nums[1]=3 >= 2 → right=1
left=0, right=1, mid=0: nums[0]=1 < 2  → left=1
left=1, right=1: 結束

返回 left=1，即插入位置
```

---

## 場景 3：查找元素的範圍

### 問題：Find First and Last Position

**題目**：[LeetCode 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

在升序陣列中查找 target 的開始和結束位置。

```
輸入: nums = [5,7,7,8,8,10], target = 8
輸出: [3,4]

輸入: nums = [5,7,7,8,8,10], target = 6
輸出: [-1,-1]
```

**思路**：
- 左邊界：第一個 >= target 的位置
- 右邊界：第一個 > target 的位置 - 1

```cpp
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        if (nums.empty()) return {-1, -1};

        int left = findLeft(nums, target);
        int right = findRight(nums, target);

        // 檢查 target 是否存在
        if (left >= nums.size() || nums[left] != target) {
            return {-1, -1};
        }

        return {left, right};
    }

private:
    // 找第一個 >= target 的位置
    int findLeft(vector<int>& nums, int target) {
        int left = 0, right = nums.size();

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

    // 找第一個 > target 的位置，然後 -1
    int findRight(vector<int>& nums, int target) {
        int left = 0, right = nums.size();

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left - 1;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

**使用 STL 的版本**：

```cpp
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto left = lower_bound(nums.begin(), nums.end(), target);
        auto right = upper_bound(nums.begin(), nums.end(), target);

        if (left == nums.end() || *left != target) {
            return {-1, -1};
        }

        return {(int)(left - nums.begin()), (int)(right - nums.begin() - 1)};
    }
};
```

---

## 場景 4：Sqrt(x)

### 問題：Sqrt(x)

**題目**：[LeetCode 69](https://leetcode.com/problems/sqrtx/)

計算並返回 x 的平方根（向下取整）。

```
輸入: x = 8
輸出: 2（sqrt(8) = 2.828...，向下取整為 2）
```

**思路**：二分答案，找最大的 ans 使得 ans² <= x

```cpp
class Solution {
public:
    int mySqrt(int x) {
        if (x == 0) return 0;

        int left = 1, right = x;

        while (left < right) {
            // 向上取整，避免死循環
            int mid = left + (right - left + 1) / 2;

            // 防止溢位：mid > x / mid 等價於 mid * mid > x
            if (mid > x / mid) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }

        return left;
    }
};
```

**時間複雜度**：O(log x)
**空間複雜度**：O(1)

**為什麼向上取整？**
```
x = 8
left=1, right=8, mid=4: 4 > 8/4 → right=3
left=1, right=3, mid=2: 2 <= 8/2 → left=2
left=2, right=3, mid=3: 3 > 8/3 → right=2
left=2, right=2: 結束，返回 2
```

**優化版本（縮小搜尋範圍）**：

```cpp
class Solution {
public:
    int mySqrt(int x) {
        if (x < 2) return x;

        int left = 1, right = x / 2;  // sqrt(x) <= x/2 對於 x >= 2

        while (left < right) {
            int mid = left + (right - left + 1) / 2;

            if (mid > x / mid) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }

        return left;
    }
};
```

---

## 場景 5：Peak Element

### 問題：Find Peak Element

**題目**：[LeetCode 162](https://leetcode.com/problems/find-peak-element/)

峰值元素是指其值嚴格大於左右相鄰值的元素。找到任意峰值元素的索引。

```
輸入: nums = [1,2,3,1]
輸出: 2（nums[2] = 3 是峰值）

輸入: nums = [1,2,1,3,5,6,4]
輸出: 5（nums[5] = 6 是峰值）或 1（nums[1] = 2 也是峰值）
```

**思路**：
- 如果 `nums[mid] < nums[mid+1]`，說明右邊有峰值
- 如果 `nums[mid] > nums[mid+1]`，說明左邊有峰值（mid 也可能是峰值）

```cpp
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < nums[mid + 1]) {
                // 上升趨勢，峰值在右邊
                left = mid + 1;
            } else {
                // 下降趨勢，峰值在左邊（包括 mid）
                right = mid;
            }
        }

        return left;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

**為什麼一定有峰值？**
- 題目保證 `nums[-1] = nums[n] = -∞`
- 如果一直上升，最後一個元素是峰值
- 如果一直下降，第一個元素是峰值
- 如果有轉折，轉折點就是峰值

---

## 場景 6：旋轉排序陣列

### 問題：Search in Rotated Sorted Array

**題目**：[LeetCode 33](https://leetcode.com/problems/search-in-rotated-sorted-array/)

在旋轉排序陣列中查找 target。

```
輸入: nums = [4,5,6,7,0,1,2], target = 0
輸出: 4

原始陣列: [0,1,2,4,5,6,7]
旋轉後:   [4,5,6,7,0,1,2]
```

**思路**：
- 陣列被分為兩段有序
- 先判斷哪一段是有序的
- 再判斷 target 是否在有序段內

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // 判斷哪一段是有序的
            if (nums[left] <= nums[mid]) {
                // 左半段有序
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;  // target 在左半段
                } else {
                    left = mid + 1;   // target 在右半段
                }
            } else {
                // 右半段有序
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;   // target 在右半段
                } else {
                    right = mid - 1;  // target 在左半段
                }
            }
        }

        return -1;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

**圖解**：

```
nums = [4,5,6,7,0,1,2], target = 0

mid=3: nums[3]=7
  左半段 [4,5,6,7] 有序
  0 不在 [4,7] 範圍內 → 往右找

mid=5: nums[5]=1
  右半段 [1,2] 有序
  0 不在 [1,2] 範圍內 → 往左找

mid=4: nums[4]=0 → 找到！
```

---

## 場景 7：2D 矩陣查找

### 問題：Search a 2D Matrix

**題目**：[LeetCode 74](https://leetcode.com/problems/search-a-2d-matrix/)

在 m × n 矩陣中查找 target。矩陣滿足：
- 每行從左到右遞增
- 每行第一個數大於上一行最後一個數

```
matrix = [
  [1,  3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
target = 3 → 返回 true
```

**思路 1**：將 2D 矩陣視為 1D 陣列

```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int left = 0, right = m * n - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midVal = matrix[mid / n][mid % n];  // 轉換為 2D 座標

            if (midVal == target) {
                return true;
            } else if (midVal < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(log(m × n))
**空間複雜度**：O(1)

**思路 2**：兩次二分

```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();

        // 第一次二分：找哪一行
        int top = 0, bottom = m - 1;
        while (top <= bottom) {
            int mid = top + (bottom - top) / 2;

            if (matrix[mid][0] <= target && target <= matrix[mid][n - 1]) {
                // target 可能在這一行
                return binarySearch(matrix[mid], target);
            } else if (target < matrix[mid][0]) {
                bottom = mid - 1;
            } else {
                top = mid + 1;
            }
        }

        return false;
    }

private:
    bool binarySearch(vector<int>& row, int target) {
        int left = 0, right = row.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (row[mid] == target) {
                return true;
            } else if (row[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return false;
    }
};
```

---

## 經典題目

### Easy
- [LeetCode 704 - Binary Search](https://leetcode.com/problems/binary-search/)
- [LeetCode 35 - Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [LeetCode 69 - Sqrt(x)](https://leetcode.com/problems/sqrtx/)
- [LeetCode 367 - Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)
- [LeetCode 374 - Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/)

### Medium
- [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [LeetCode 33 - Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [LeetCode 74 - Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)
- [LeetCode 81 - Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)
- [LeetCode 153 - Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- [LeetCode 162 - Find Peak Element](https://leetcode.com/problems/find-peak-element/)
- [LeetCode 240 - Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/)
- [LeetCode 540 - Single Element in a Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/)

---

## 常見陷阱

### 1. 邊界檢查

```cpp
// 查找範圍時，記得檢查返回值
int left = findLeft(nums, target);
if (left >= nums.size() || nums[left] != target) {
    return -1;  // target 不存在
}
```

### 2. 溢位處理

```cpp
// Sqrt(x)
// ✗ 錯誤：mid * mid 可能溢位
if (mid * mid > x)

// ✓ 正確：避免乘法溢位
if (mid > x / mid)
```

### 3. 2D 座標轉換

```cpp
// 1D → 2D
int row = mid / n;
int col = mid % n;

// 2D → 1D
int idx = row * n + col;
```

---

## 重點回顧

1. **基礎查找**涵蓋大部分二分應用
2. **三個核心問題**：
   - 查找元素
   - 查找插入位置（左邊界）
   - 查找範圍（左右邊界）
3. **變形問題**：
   - 旋轉陣列（判斷有序段）
   - 2D 矩陣（1D 化或兩次二分）
   - Peak Element（比較相鄰元素）
4. **常見陷阱**：溢位、邊界檢查、座標轉換

### 下一步

接下來將學習**二分猜答案**，將問題轉化為「判定問題」。
