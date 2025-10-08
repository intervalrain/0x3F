---
title: 04-3. 第 K 小/大元素
order: 3
description: 使用二分搜尋、快速選擇和堆找第 K 小/大元素
tags:
  - Binary Search
  - Kth Element
  - Quick Select
  - Heap
author: Rain Hu
date: ''
draft: true
---

# 第 K 小/大元素 (Kth Element)

## 核心概念

找第 K 小/大元素是經典問題，有多種解法：
1. **排序**：O(n log n)
2. **堆 (Heap)**：O(n log k)
3. **快速選擇 (Quick Select)**：O(n) 平均，O(n²) 最差
4. **二分搜尋**：O(n log(範圍))

---

## 方法 1：排序

### 最直接的方法

```cpp
// 找第 k 小的元素（k 從 1 開始）
int findKthSmallest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    return nums[k - 1];
}

// 找第 k 大的元素
int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}
```

**時間複雜度**：O(n log n)
**空間複雜度**：O(1)

**優點**：簡單直接
**缺點**：不是最優解

---

## 方法 2：堆 (Heap)

### 使用 Min Heap（找第 K 大）

維護一個大小為 K 的最小堆，堆頂就是第 K 大的元素。

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;

        for (int num : nums) {
            minHeap.push(num);

            if (minHeap.size() > k) {
                minHeap.pop();  // 移除最小的
            }
        }

        return minHeap.top();
    }
};
```

**時間複雜度**：O(n log k)
**空間複雜度**：O(k)

**為什麼用 Min Heap？**
```
nums = [3,2,1,5,6,4], k = 2

處理過程：
  3 → heap = [3]
  2 → heap = [2, 3]
  1 → heap = [2, 3] → pop(1)
  5 → heap = [3, 5] → pop(2)
  6 → heap = [5, 6] → pop(3)
  4 → heap = [5, 6]

結果：heap.top() = 5（第 2 大）
```

### 使用 Max Heap（找第 K 小）

```cpp
int findKthSmallest(vector<int>& nums, int k) {
    priority_queue<int> maxHeap;

    for (int num : nums) {
        maxHeap.push(num);

        if (maxHeap.size() > k) {
            maxHeap.pop();  // 移除最大的
        }
    }

    return maxHeap.top();
}
```

---

## 方法 3：快速選擇 (Quick Select)

### 基於快速排序的分區思想

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        return quickSelect(nums, 0, n - 1, n - k);  // 第 k 大 = 第 n-k 小
    }

private:
    int quickSelect(vector<int>& nums, int left, int right, int k) {
        if (left == right) {
            return nums[left];
        }

        // 隨機選擇 pivot，避免最壞情況
        int pivotIndex = left + rand() % (right - left + 1);
        pivotIndex = partition(nums, left, right, pivotIndex);

        if (k == pivotIndex) {
            return nums[k];
        } else if (k < pivotIndex) {
            return quickSelect(nums, left, pivotIndex - 1, k);
        } else {
            return quickSelect(nums, pivotIndex + 1, right, k);
        }
    }

    int partition(vector<int>& nums, int left, int right, int pivotIndex) {
        int pivotValue = nums[pivotIndex];
        swap(nums[pivotIndex], nums[right]);  // 移到最右

        int storeIndex = left;
        for (int i = left; i < right; i++) {
            if (nums[i] < pivotValue) {
                swap(nums[i], nums[storeIndex]);
                storeIndex++;
            }
        }

        swap(nums[storeIndex], nums[right]);
        return storeIndex;
    }
};
```

**時間複雜度**：
- 平均：O(n)
- 最差：O(n²)（每次都選到最小/最大值）

**空間複雜度**：O(1)

**優化：三數取中法**

```cpp
int medianOfThree(vector<int>& nums, int left, int right) {
    int mid = left + (right - left) / 2;

    if (nums[left] > nums[mid]) swap(nums[left], nums[mid]);
    if (nums[left] > nums[right]) swap(nums[left], nums[right]);
    if (nums[mid] > nums[right]) swap(nums[mid], nums[right]);

    return mid;
}
```

---

## 方法 4：二分搜尋（值域二分）

### 適用於特定場景

當元素值域已知時，可以二分答案。

```cpp
// 找第 k 小的元素
int findKthSmallest(vector<int>& nums, int k) {
    int left = *min_element(nums.begin(), nums.end());
    int right = *max_element(nums.begin(), nums.end());

    while (left < right) {
        int mid = left + (right - left) / 2;

        // 計算 <= mid 的元素個數
        int count = 0;
        for (int num : nums) {
            if (num <= mid) count++;
        }

        if (count < k) {
            left = mid + 1;  // 第 k 小的元素 > mid
        } else {
            right = mid;  // 第 k 小的元素 <= mid
        }
    }

    return left;
}
```

**時間複雜度**：O(n × log(max - min))
**空間複雜度**：O(1)

**注意**：這個方法要求答案一定在陣列中。

---

## 經典題目

### 題目 1：Kth Largest Element in an Array

**題目**：[LeetCode 215](https://leetcode.com/problems/kth-largest-element-in-an-array/)

找陣列中第 k 大的元素。

**解法 1：Min Heap**

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;

        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        return minHeap.top();
    }
};
```

**解法 2：Quick Select**

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        return quickSelect(nums, 0, n - 1, n - k);
    }

private:
    int quickSelect(vector<int>& nums, int left, int right, int k) {
        if (left == right) return nums[left];

        int pivotIndex = left + rand() % (right - left + 1);
        pivotIndex = partition(nums, left, right, pivotIndex);

        if (k == pivotIndex) {
            return nums[k];
        } else if (k < pivotIndex) {
            return quickSelect(nums, left, pivotIndex - 1, k);
        } else {
            return quickSelect(nums, pivotIndex + 1, right, k);
        }
    }

    int partition(vector<int>& nums, int left, int right, int pivotIndex) {
        int pivotValue = nums[pivotIndex];
        swap(nums[pivotIndex], nums[right]);

        int storeIndex = left;
        for (int i = left; i < right; i++) {
            if (nums[i] < pivotValue) {
                swap(nums[i], nums[storeIndex++]);
            }
        }

        swap(nums[storeIndex], nums[right]);
        return storeIndex;
    }
};
```

---

### 題目 2：Kth Smallest Element in a Sorted Matrix

**題目**：[LeetCode 378](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

在 n × n 矩陣中找第 k 小的元素，每行和每列都是升序。

```
matrix = [
   [1,  5,  9],
   [10, 11, 13],
   [12, 13, 15]
]
k = 8 → 返回 13
```

**解法 1：Min Heap**

```cpp
class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        priority_queue<int> maxHeap;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                maxHeap.push(matrix[i][j]);
                if (maxHeap.size() > k) {
                    maxHeap.pop();
                }
            }
        }

        return maxHeap.top();
    }
};
```

**時間複雜度**：O(n² log k)
**空間複雜度**：O(k)

**解法 2：二分搜尋**

```cpp
class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        int left = matrix[0][0];
        int right = matrix[n - 1][n - 1];

        while (left < right) {
            int mid = left + (right - left) / 2;

            // 計算 <= mid 的元素個數
            int count = countLessEqual(matrix, mid);

            if (count < k) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

private:
    // 計算 <= target 的元素個數
    int countLessEqual(vector<vector<int>>& matrix, int target) {
        int n = matrix.size();
        int count = 0;
        int row = n - 1, col = 0;

        // 從左下角開始
        while (row >= 0 && col < n) {
            if (matrix[row][col] <= target) {
                count += row + 1;  // 這一列所有元素都 <= target
                col++;
            } else {
                row--;
            }
        }

        return count;
    }
};
```

**時間複雜度**：O(n × log(max - min))
**空間複雜度**：O(1)

**為什麼從左下角開始？**
```
matrix = [
   [1,  5,  9],
   [10, 11, 13],
   [12, 13, 15]
]

從 matrix[2][0] = 12 開始：
- 如果 12 <= target：這一列 [1,10,12] 都 <= target，向右移
- 如果 12 > target：向上移
```

---

### 題目 3：Find K Pairs with Smallest Sums

**題目**：[LeetCode 373](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)

從兩個升序陣列中找 k 對和最小的數對。

```
輸入: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
輸出: [[1,2],[1,4],[1,6]]
```

**解法：Min Heap**

```cpp
class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        vector<vector<int>> result;
        if (nums1.empty() || nums2.empty() || k == 0) return result;

        // Min heap: {sum, i, j}
        auto cmp = [&](const vector<int>& a, const vector<int>& b) {
            return nums1[a[0]] + nums2[a[1]] > nums1[b[0]] + nums2[b[1]];
        };
        priority_queue<vector<int>, vector<vector<int>>, decltype(cmp)> minHeap(cmp);

        // 初始化：將 nums1 的所有元素與 nums2[0] 配對
        for (int i = 0; i < min((int)nums1.size(), k); i++) {
            minHeap.push({i, 0});
        }

        while (k-- > 0 && !minHeap.empty()) {
            auto curr = minHeap.top();
            minHeap.pop();

            int i = curr[0], j = curr[1];
            result.push_back({nums1[i], nums2[j]});

            // 將下一個配對加入 heap
            if (j + 1 < nums2.size()) {
                minHeap.push({i, j + 1});
            }
        }

        return result;
    }
};
```

**時間複雜度**：O(k log k)
**空間複雜度**：O(k)

---

## 方法比較

| 方法 | 時間複雜度 | 空間複雜度 | 適用場景 |
|-----|-----------|-----------|---------|
| 排序 | O(n log n) | O(1) | 簡單實作 |
| Min/Max Heap | O(n log k) | O(k) | k << n 時最優 |
| Quick Select | O(n) 平均 | O(1) | 原地操作，k 不重要 |
| 二分搜尋 | O(n log(範圍)) | O(1) | 值域小或有序結構 |

### 選擇建議

- **k << n**：使用 Heap
- **需要原地操作**：使用 Quick Select
- **值域小或矩陣有序**：使用二分搜尋
- **簡單實作**：直接排序

---

## 經典題目

### Easy
- [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

### Medium
- [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [LeetCode 373 - Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)
- [LeetCode 378 - Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)
- [LeetCode 658 - Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/)
- [LeetCode 973 - K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

### Hard
- [LeetCode 295 - Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
- [LeetCode 502 - IPO](https://leetcode.com/problems/ipo/)

---

## 進階：Median of Two Sorted Arrays

### 題目：Median of Two Sorted Arrays

**題目**：[LeetCode 4](https://leetcode.com/problems/median-of-two-sorted-arrays/)

找兩個有序陣列的中位數，要求 O(log(m+n))。

```
輸入: nums1 = [1,3], nums2 = [2]
輸出: 2.0

輸入: nums1 = [1,2], nums2 = [3,4]
輸出: 2.5
```

**思路**：二分搜尋分割點

```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.size(), n = nums2.size();
        int left = 0, right = m;

        while (left <= right) {
            int partition1 = left + (right - left) / 2;
            int partition2 = (m + n + 1) / 2 - partition1;

            int maxLeft1 = (partition1 == 0) ? INT_MIN : nums1[partition1 - 1];
            int minRight1 = (partition1 == m) ? INT_MAX : nums1[partition1];

            int maxLeft2 = (partition2 == 0) ? INT_MIN : nums2[partition2 - 1];
            int minRight2 = (partition2 == n) ? INT_MAX : nums2[partition2];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                // 找到正確的分割點
                if ((m + n) % 2 == 0) {
                    return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
                } else {
                    return max(maxLeft1, maxLeft2);
                }
            } else if (maxLeft1 > minRight2) {
                right = partition1 - 1;
            } else {
                left = partition1 + 1;
            }
        }

        return 0.0;
    }
};
```

**時間複雜度**：O(log(min(m, n)))
**空間複雜度**：O(1)

---

## 重點回顧

1. **四種方法**：排序、堆、快速選擇、二分搜尋
2. **時間複雜度**：
   - Heap：O(n log k) - k << n 時最優
   - Quick Select：O(n) 平均
   - 二分搜尋：O(n log(範圍))
3. **適用場景**：
   - k 很小 → Heap
   - 原地操作 → Quick Select
   - 有序結構 → 二分搜尋
4. **經典變形**：
   - 矩陣第 k 小
   - 兩陣列中位數
   - Top K 問題

### Section 04 完成

已完成 Section 04. 二分法的所有 4 個章節！
