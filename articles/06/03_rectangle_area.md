---
title: 06-3. 矩形面積 (Rectangle Area)
order: 3
description: '使用單調棧解決柱狀圖最大矩形、二維矩陣最大矩形等幾何問題。深入理解如何透過單調遞增棧找到左右邊界，實現 O(n) 時間複雜度的高效算法。'
tags: ['Monotonic Stack', 'Rectangle', 'Histogram', 'DP', '單調棧', '矩形', '動態規劃']
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 矩形面積 (Rectangle Area)

## 概述

單調棧在計算矩形面積問題中有重要應用，特別是：
1. **柱狀圖中最大矩形**
2. **二維矩陣中最大矩形**
3. **最大正方形**

這些問題都可以通過單調棧高效解決。

---

## LeetCode 84: Largest Rectangle in Histogram

**問題：** 給定 n 個非負整數表示柱狀圖中各個柱子的高度，每個柱子寬度為 1，求柱狀圖中最大矩形的面積。

**示例：**
```
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation:
     6
   5 █
   █ █
   █ █   3
   █ █ 2 █
 2 █ █ █ █
 █ █ █ █ █
最大矩形面積 = 5 * 2 = 10 (高度為5的柱子和高度為6的柱子)
```

### 核心思想

對於每個柱子，找到：
1. **左邊界**：左邊第一個比它矮的柱子
2. **右邊界**：右邊第一個比它矮的柱子
3. **矩形寬度** = 右邊界 - 左邊界 - 1
4. **矩形面積** = 高度 × 寬度

```
heights = [2, 1, 5, 6, 2, 3]

對於 height=5 (index=2):
  左邊界: index=1 (height=1 < 5)
  右邊界: index=4 (height=2 < 5)
  寬度: 4 - 1 - 1 = 2
  面積: 5 * 2 = 10
```

### 解法 1：暴力法（TLE）

```cpp
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size();
        int maxArea = 0;

        for (int i = 0; i < n; i++) {
            int h = heights[i];

            // 找左邊界
            int left = i;
            while (left > 0 && heights[left - 1] >= h) {
                left--;
            }

            // 找右邊界
            int right = i;
            while (right < n - 1 && heights[right + 1] >= h) {
                right++;
            }

            int width = right - left + 1;
            maxArea = max(maxArea, h * width);
        }

        return maxArea;
    }
};
```

**時間複雜度：** O(n²)
**空間複雜度：** O(1)

### 解法 2：單調遞增棧

**核心思想：**
- 維護單調遞增棧（存儲索引）
- 當遇到更矮的柱子時，棧中所有比它高的柱子都找到了右邊界
- 彈出柱子時計算以它為高度的最大矩形

```cpp
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size();
        stack<int> st;  // 單調遞增棧（存索引）
        int maxArea = 0;

        for (int i = 0; i <= n; i++) {
            // 在末尾添加高度為0的柱子，確保所有柱子都被處理
            int h = (i == n) ? 0 : heights[i];

            // 當前柱子比棧頂矮，計算以棧頂為高度的矩形
            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()];
                st.pop();

                // 寬度計算：
                // 左邊界：棧頂的下一個元素（如果棧空，則為-1）
                // 右邊界：當前位置 i
                int width = st.empty() ? i : (i - st.top() - 1);
                maxArea = max(maxArea, height * width);
            }

            st.push(i);
        }

        return maxArea;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

### 詳細過程示例

```
heights = [2, 1, 5, 6, 2, 3]

i=0, h=2: Stack=[0]

i=1, h=1:
  1 < 2, 彈出 0
    height=2, width=1, area=2
  Stack=[1]

i=2, h=5: Stack=[1, 2]

i=3, h=6: Stack=[1, 2, 3]

i=4, h=2:
  2 < 6, 彈出 3
    height=6, width=4-2-1=1, area=6
  2 < 5, 彈出 2
    height=5, width=4-1-1=2, area=10  <- 最大
  Stack=[1, 4]

i=5, h=3: Stack=[1, 4, 5]

i=6, h=0 (虛擬):
  0 < 3, 彈出 5
    height=3, width=6-4-1=1, area=3
  0 < 2, 彈出 4
    height=2, width=6-1-1=4, area=8
  0 < 1, 彈出 1
    height=1, width=6, area=6
  Stack=[6]

maxArea = 10
```

### 關鍵點解釋

#### 1. 為什麼在末尾添加高度為0的柱子？

```cpp
int h = (i == n) ? 0 : heights[i];
```

**原因：** 確保棧中所有柱子都能被彈出並計算面積。

```
如果沒有這個虛擬柱子：
heights = [5, 6, 7]  (遞增序列)
Stack 會一直增長: [0, 1, 2]
最後沒有機會計算這些柱子的面積

添加虛擬柱子後：
i=3, h=0
  彈出所有柱子，計算所有面積
```

#### 2. 寬度如何計算？

```cpp
int width = st.empty() ? i : (i - st.top() - 1);
```

**情況 1：棧非空**
```
左邊界 = st.top() (左邊第一個更小的柱子)
右邊界 = i (當前柱子)
寬度 = i - st.top() - 1

示例: heights = [2, 1, 5, 6, 2]
彈出 index=3 (height=6) 時:
  左邊界 = st.top() = 2
  右邊界 = i = 4
  寬度 = 4 - 2 - 1 = 1
```

**情況 2：棧為空**
```
說明左邊沒有更小的柱子
寬度 = i (從0到i-1，共i個柱子)

示例: heights = [1, 2, 3]
彈出 index=0 (height=1) 時:
  棧為空，說明左邊沒有更小的
  寬度 = 3 (可以延伸到整個範圍)
```

### 解法 3：優化版（不需要虛擬柱子）

```cpp
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0;

        for (int i = 0; i < heights.size(); i++) {
            while (!st.empty() && heights[i] < heights[st.top()]) {
                int h = heights[st.top()];
                st.pop();
                int w = st.empty() ? i : (i - st.top() - 1);
                maxArea = max(maxArea, h * w);
            }
            st.push(i);
        }

        // 處理棧中剩餘元素
        while (!st.empty()) {
            int h = heights[st.top()];
            st.pop();
            int w = st.empty() ? (int)heights.size() : ((int)heights.size() - st.top() - 1);
            maxArea = max(maxArea, h * w);
        }

        return maxArea;
    }
};
```

---

## LeetCode 85: Maximal Rectangle

**問題：** 給定一個僅包含 `'0'` 和 `'1'` 的二維二進制矩陣，找出只包含 `'1'` 的最大矩形，並返回其面積。

**示例：**
```
Input: matrix = [
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
]
Output: 6
Explanation:
  1 0 1 0 0
  1 0 1 1 1
  1 1 1 1 1    <- 最大矩形在這裡
  1 0 0 1 0
面積 = 3 * 2 = 6
```

### 核心思想

將二維問題轉化為多個一維問題（柱狀圖）：
1. 對於每一行，計算以該行為底的柱狀圖高度
2. 對每個柱狀圖應用 LeetCode 84 的解法

```
matrix:
["1","0","1","0","0"]  -> heights = [1, 0, 1, 0, 0]
["1","0","1","1","1"]  -> heights = [2, 0, 2, 1, 1]
["1","1","1","1","1"]  -> heights = [3, 1, 3, 2, 2]
["1","0","0","1","0"]  -> heights = [4, 0, 0, 3, 0]

對每個 heights 計算最大矩形面積
```

### 解法

```cpp
class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;

        int m = matrix.size(), n = matrix[0].size();
        vector<int> heights(n, 0);
        int maxArea = 0;

        // 逐行處理
        for (int i = 0; i < m; i++) {
            // 更新柱狀圖高度
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    heights[j]++;  // 累加高度
                } else {
                    heights[j] = 0;  // 遇到0重置
                }
            }

            // 計算當前柱狀圖的最大矩形
            maxArea = max(maxArea, largestRectangleArea(heights));
        }

        return maxArea;
    }

private:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0;

        for (int i = 0; i <= heights.size(); i++) {
            int h = (i == heights.size()) ? 0 : heights[i];

            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()];
                st.pop();
                int width = st.empty() ? i : (i - st.top() - 1);
                maxArea = max(maxArea, height * width);
            }

            st.push(i);
        }

        return maxArea;
    }
};
```

**時間複雜度：** O(m × n)，m 和 n 分別是矩陣的行數和列數
**空間複雜度：** O(n)

### 詳細過程

```
matrix:
["1","0","1","0","0"]
["1","0","1","1","1"]
["1","1","1","1","1"]
["1","0","0","1","0"]

Row 0: heights = [1, 0, 1, 0, 0]
  largestRectangleArea([1, 0, 1, 0, 0]) = 1

Row 1: heights = [2, 0, 2, 1, 1]
  matrix[1][0] = '1' -> heights[0]++  (1 -> 2)
  matrix[1][1] = '0' -> heights[1] = 0
  matrix[1][2] = '1' -> heights[2]++  (1 -> 2)
  matrix[1][3] = '1' -> heights[3]++  (0 -> 1)
  matrix[1][4] = '1' -> heights[4]++  (0 -> 1)
  largestRectangleArea([2, 0, 2, 1, 1]) = 3

Row 2: heights = [3, 1, 3, 2, 2]
  largestRectangleArea([3, 1, 3, 2, 2]) = 6  <- 最大

Row 3: heights = [4, 0, 0, 3, 0]
  largestRectangleArea([4, 0, 0, 3, 0]) = 4

maxArea = 6
```

### 視覺化

```
第2行的柱狀圖：
heights = [3, 1, 3, 2, 2]

  3     3
  █     █ 2 2
  █ 1   █ █ █
  █ █   █ █ █
  0 1 2 3 4

最大矩形：
      3
      █ 2 2
      █ █ █
      3 4
面積 = 3 * 2 = 6
```

---

## LeetCode 221: Maximal Square

**問題：** 在一個由 `'0'` 和 `'1'` 組成的二維矩陣內，找到只包含 `'1'` 的最大正方形，並返回其面積。

**示例：**
```
Input: matrix = [
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
]
Output: 4
Explanation:
  1 0 1 0 0
  1 0 1 1 1    最大正方形
  1 1 1 1 1    邊長為2
  1 0 0 1 0
面積 = 2 * 2 = 4
```

### 解法 1：動態規劃（推薦）

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;

        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        int maxSide = 0;

        // dp[i][j] 表示以 (i,j) 為右下角的最大正方形邊長
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;  // 邊界情況
                    } else {
                        // 取左、上、左上三個方向的最小值 + 1
                        dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
                    }
                    maxSide = max(maxSide, dp[i][j]);
                }
            }
        }

        return maxSide * maxSide;
    }
};
```

**時間複雜度：** O(m × n)
**空間複雜度：** O(m × n)

### DP 狀態轉移解釋

```
為什麼 dp[i][j] = min(left, top, top-left) + 1？

示例：
  1 1 1
  1 1 1
  1 1 ?

如果左、上、左上都是2，說明存在 2x2 的正方形
當前位置是1，可以擴展成 3x3 的正方形

  1 1 1
  1 2 2
  1 2 3  <- dp[2][2] = min(2, 2, 2) + 1 = 3

如果有任何一個方向不夠長，就受限於最短的那個：
  1 1 1
  0 1 1
  1 1 ?

  dp[2][2] = min(0, 1, 1) + 1 = 1
  （左邊是0，無法形成更大的正方形）
```

### 空間優化版本

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;

        int m = matrix.size(), n = matrix[0].size();
        vector<int> dp(n, 0);
        int maxSide = 0;
        int prev = 0;  // 保存左上角的值

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int temp = dp[j];  // 保存當前值（下一輪的左上角）

                if (matrix[i][j] == '1') {
                    if (j == 0) {
                        dp[j] = 1;
                    } else {
                        dp[j] = min({dp[j], dp[j-1], prev}) + 1;
                    }
                    maxSide = max(maxSide, dp[j]);
                } else {
                    dp[j] = 0;
                }

                prev = temp;
            }
        }

        return maxSide * maxSide;
    }
};
```

**時間複雜度：** O(m × n)
**空間複雜度：** O(n)

### 解法 2：使用單調棧（類似 LeetCode 85）

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;

        int m = matrix.size(), n = matrix[0].size();
        vector<int> heights(n, 0);
        int maxSide = 0;

        for (int i = 0; i < m; i++) {
            // 更新高度
            for (int j = 0; j < n; j++) {
                heights[j] = (matrix[i][j] == '1') ? heights[j] + 1 : 0;
            }

            // 使用單調棧找最大正方形
            maxSide = max(maxSide, maxSquareInHistogram(heights));
        }

        return maxSide * maxSide;
    }

private:
    int maxSquareInHistogram(vector<int>& heights) {
        stack<int> st;
        int maxSide = 0;

        for (int i = 0; i <= heights.size(); i++) {
            int h = (i == heights.size()) ? 0 : heights[i];

            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()];
                st.pop();
                int width = st.empty() ? i : (i - st.top() - 1);

                // 正方形的邊長受限於高度和寬度的最小值
                int side = min(height, width);
                maxSide = max(maxSide, side);
            }

            st.push(i);
        }

        return maxSide;
    }
};
```

**時間複雜度：** O(m × n)
**空間複雜度：** O(n)

---

## 單調棧在矩形問題中的應用總結

### 問題類型

| 問題 | 描述 | 關鍵技巧 |
|------|------|---------|
| LeetCode 84 | 柱狀圖中最大矩形 | 單調遞增棧 |
| LeetCode 85 | 矩陣中最大矩形 | 轉換為多個柱狀圖 |
| LeetCode 221 | 最大正方形 | DP 或單調棧 |

### 核心思想

#### 1. 柱狀圖最大矩形（LeetCode 84）

```
對於每個柱子：
1. 找左邊第一個更矮的柱子（左邊界）
2. 找右邊第一個更矮的柱子（右邊界）
3. 寬度 = 右邊界 - 左邊界 - 1
4. 面積 = 高度 × 寬度

使用單調遞增棧：
- 棧維護遞增序列
- 遇到更矮的柱子時，彈出並計算
```

#### 2. 二維矩陣最大矩形（LeetCode 85）

```
逐行處理：
1. 計算每一行的柱狀圖高度
2. 對每個柱狀圖應用 LeetCode 84
3. 累加高度（遇到0重置）

heights[j] 表示以第 i 行為底，第 j 列的柱子高度
```

#### 3. 最大正方形（LeetCode 221）

```
方法1 - DP:
dp[i][j] = min(左, 上, 左上) + 1

方法2 - 單調棧:
類似 LeetCode 85，但邊長受限於 min(height, width)
```

### 單調棧模板（柱狀圖最大矩形）

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;  // 單調遞增棧（存索引）
    int maxArea = 0;

    for (int i = 0; i <= heights.size(); i++) {
        int h = (i == heights.size()) ? 0 : heights[i];

        while (!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()];
            st.pop();
            int width = st.empty() ? i : (i - st.top() - 1);
            maxArea = max(maxArea, height * width);
        }

        st.push(i);
    }

    return maxArea;
}
```

### 關鍵點

1. **為什麼用單調遞增棧？**
   - 確保能找到左右邊界
   - 彈出時說明找到了右邊界

2. **為什麼添加虛擬柱子（高度為0）？**
   - 確保所有柱子都能被彈出
   - 處理遞增序列的情況

3. **寬度如何計算？**
   - 棧非空：`i - st.top() - 1`
   - 棧為空：`i`（說明左邊沒有更小的）

4. **如何轉換二維問題？**
   - 逐行累加高度
   - 每行都視為一個柱狀圖問題

---

## 總結

### 時間複雜度

- **LeetCode 84**：O(n)，每個元素最多入棧出棧一次
- **LeetCode 85**：O(m × n)，m 行，每行 O(n)
- **LeetCode 221**：O(m × n)

### 空間複雜度

- **單調棧解法**：O(n)，棧的大小
- **DP 解法**：O(m × n) 或 O(n)（優化後）

### 相關題目

- [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)
- [221. Maximal Square](https://leetcode.com/problems/maximal-square/)
- [1277. Count Square Submatrices with All Ones](https://leetcode.com/problems/count-square-submatrices-with-all-ones/)

這些問題充分展示了單調棧在處理幾何和矩形相關問題中的強大能力。掌握這些技巧對於解決類似問題非常有幫助。
