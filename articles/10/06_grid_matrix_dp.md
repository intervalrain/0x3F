---
title: 10-6. Grid/Matrix DP
order: 6
description: 網格動態規劃：路徑問題與矩陣問題
tags:
  - 動態規劃
  - 網格 DP
  - 路徑問題
  - 矩陣
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Grid/Matrix DP

網格 DP 是處理二維網格或矩陣上路徑、區域問題的重要技術。這類問題通常涉及在網格上移動、計數路徑、或找出滿足特定條件的最優子矩陣。

## 問題特徵

1. 在二維網格上進行操作
2. 通常只能向右、向下移動
3. 求路徑數量、最優路徑、或最大子矩陣
4. 狀態通常是 `dp[i][j]` 表示到達 (i,j) 的某種最優值

## 狀態定義

```cpp
dp[i][j]  // 到達位置 (i, j) 的最優解/路徑數/某種狀態
```

## 轉移方程模板

```cpp
// 從上方或左方轉移
dp[i][j] = function(dp[i-1][j], dp[i][j-1])

// 如果有障礙物
if (grid[i][j] == obstacle) {
    dp[i][j] = 0 or invalid;
} else {
    dp[i][j] = dp[i-1][j] + dp[i][j-1];
}
```

---

## 問題 1: 不同路徑 (Unique Paths)

[LeetCode 62. Unique Paths](https://leetcode.com/problems/unique-paths/)

### 問題描述

一個機器人位於 m×n 網格的左上角。機器人每次只能向下或向右移動一步。機器人試圖到達網格的右下角。問總共有多少條不同的路徑?

**範例:**
```
輸入: m = 3, n = 7
輸出: 28

輸入: m = 3, n = 2
輸出: 3
解釋:
1. 右 → 下 → 下
2. 下 → 右 → 下
3. 下 → 下 → 右
```

### 問題分析

這是最基礎的網格 DP 問題。

**狀態定義:**
- `dp[i][j]`: 到達位置 (i, j) 的路徑數量

**狀態轉移:**
只能從上方 (i-1, j) 或左方 (i, j-1) 到達:
```cpp
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

**初始化:**
```cpp
dp[0][j] = 1  // 第一行只有一條路徑(一直向右)
dp[i][0] = 1  // 第一列只有一條路徑(一直向下)
```

**DP 狀態表 (m=3, n=7):**
```
    0   1   2   3   4   5   6
0   1   1   1   1   1   1   1
1   1   2   3   4   5   6   7
2   1   3   6  10  15  21  28

解釋:
dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2
dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3
dp[2][6] = dp[1][6] + dp[2][5] = 7 + 21 = 28
```

### 解法實現

#### 解法 1: 二維 DP

```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 1));

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }

        return dp[m-1][n-1];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

#### 解法 2: 一維優化

```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] = dp[j] + dp[j-1];
            }
        }

        return dp[n-1];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(n)

#### 解法 3: 數學公式 (組合數)

從 (0,0) 到 (m-1,n-1) 需要向下 m-1 步、向右 n-1 步,總共 m+n-2 步。
問題變成:從 m+n-2 步中選 m-1 步向下(或 n-1 步向右)。

答案 = C(m+n-2, m-1) = C(m+n-2, n-1)

```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        long long ans = 1;
        // 計算 C(m+n-2, m-1)
        for (int i = 1; i < m; i++) {
            ans = ans * (n + i - 1) / i;
        }
        return ans;
    }
};
```

**時間複雜度:** O(min(m, n))
**空間複雜度:** O(1)

---

## 問題 2: 不同路徑 II (Unique Paths II)

[LeetCode 63. Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

### 問題描述

與上題相同,但網格中某些位置有障礙物。障礙物用 1 表示,空地用 0 表示。

**範例:**
```
輸入:
[
  [0,0,0],
  [0,1,0],
  [0,0,0]
]
輸出: 2
解釋:
3×3 網格的中間有一個障礙物。
從左上角到右下角共有 2 條路徑:
1. 右 → 右 → 下 → 下
2. 下 → 下 → 右 → 右
```

### 問題分析

與無障礙版本的主要區別:
- 遇到障礙物時,該位置的路徑數為 0
- 初始化時也要考慮障礙物

**狀態轉移:**
```cpp
if (grid[i][j] == 1) {
    dp[i][j] = 0;  // 障礙物,無法到達
} else {
    dp[i][j] = dp[i-1][j] + dp[i][j-1];
}
```

### 解法實現

```cpp
class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        int m = obstacleGrid.size();
        int n = obstacleGrid[0].size();

        // 如果起點或終點有障礙物,直接返回 0
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }

        vector<vector<int>> dp(m, vector<int>(n, 0));
        dp[0][0] = 1;

        // 初始化第一列
        for (int i = 1; i < m; i++) {
            if (obstacleGrid[i][0] == 0) {
                dp[i][0] = dp[i-1][0];
            }
        }

        // 初始化第一行
        for (int j = 1; j < n; j++) {
            if (obstacleGrid[0][j] == 0) {
                dp[0][j] = dp[0][j-1];
            }
        }

        // 填充 DP 表
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 0) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }

        return dp[m-1][n-1];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

---

## 問題 3: 最小路徑和 (Minimum Path Sum)

[LeetCode 64. Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

### 問題描述

給定一個包含非負整數的 m×n 網格,找出一條從左上角到右下角的路徑,使得路徑上的數字總和最小。每次只能向下或向右移動。

**範例:**
```
輸入:
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
輸出: 7
解釋: 路徑 1→3→1→1→1 的總和最小
```

### 問題分析

**狀態定義:**
- `dp[i][j]`: 從 (0,0) 到 (i,j) 的最小路徑和

**狀態轉移:**
```cpp
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

**初始化:**
```cpp
dp[0][0] = grid[0][0]
dp[0][j] = dp[0][j-1] + grid[0][j]  // 第一行
dp[i][0] = dp[i-1][0] + grid[i][0]  // 第一列
```

### 解法實現

#### 解法 1: 二維 DP

```cpp
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        vector<vector<int>> dp(m, vector<int>(n, 0));
        dp[0][0] = grid[0][0];

        // 初始化第一行
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j-1] + grid[0][j];
        }

        // 初始化第一列
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }

        // 填充 DP 表
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);
            }
        }

        return dp[m-1][n-1];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

#### 解法 2: 原地修改(如果允許)

```cpp
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // 初始化第一行和第一列
        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j-1];
        }
        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i-1][0];
        }

        // 填充
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += min(grid[i-1][j], grid[i][j-1]);
            }
        }

        return grid[m-1][n-1];
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(1)

---

## 問題 4: 最大正方形 (Maximal Square)

[LeetCode 221. Maximal Square](https://leetcode.com/problems/maximal-square/)

### 問題描述

在一個由 '0' 和 '1' 組成的二維矩陣內,找到只包含 '1' 的最大正方形,並返回其面積。

**範例:**
```
輸入:
[
  ['1','0','1','0','0'],
  ['1','0','1','1','1'],
  ['1','1','1','1','1'],
  ['1','0','0','1','0']
]
輸出: 4
解釋: 最大正方形的邊長為 2
```

### 問題分析

這是一道經典的二維 DP 問題。

**狀態定義:**
- `dp[i][j]`: 以 (i, j) 為**右下角**的最大正方形邊長

**狀態轉移:**
如果 matrix[i][j] == '1':
```cpp
dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
```

**為什麼這樣轉移?**
```
以 (i,j) 為右下角的正方形,需要:
1. 左邊有正方形: dp[i][j-1]
2. 上邊有正方形: dp[i-1][j]
3. 左上角有正方形: dp[i-1][j-1]

取三者最小值,再加 1

示意圖:
  dp[i-1][j-1]  dp[i-1][j]
  dp[i][j-1]    dp[i][j]
```

**初始化:**
```cpp
第一行和第一列: dp[i][j] = (matrix[i][j] == '1' ? 1 : 0)
```

### 解法實現

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty()) return 0;

        int m = matrix.size();
        int n = matrix[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        int maxSide = 0;

        // 填充 DP 表
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = min({dp[i-1][j],
                                       dp[i][j-1],
                                       dp[i-1][j-1]}) + 1;
                    }
                    maxSide = max(maxSide, dp[i][j]);
                }
            }
        }

        return maxSide * maxSide;
    }
};
```

**時間複雜度:** O(m × n)
**空間複雜度:** O(m × n)

#### 空間優化

```cpp
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        if (matrix.empty()) return 0;

        int m = matrix.size();
        int n = matrix[0].size();
        vector<int> dp(n, 0);
        int maxSide = 0;
        int prev = 0;  // dp[i-1][j-1]

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int temp = dp[j];
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

**時間複雜度:** O(m × n)
**空間複雜度:** O(n)

---

## 問題 5: 下降路徑最小和 (Minimum Falling Path Sum)

[LeetCode 931. Minimum Falling Path Sum](https://leetcode.com/problems/minimum-falling-path-sum/)

### 問題描述

給定一個 n×n 的整數矩陣,找出並返回通過矩陣的下降路徑的最小和。

下降路徑從第一行的任何元素開始,並從每一行選擇一個元素。在下一行選擇的元素和當前行選擇的元素**最多相隔一列**(即位於正下方或斜下方的左側或右側)。

**範例:**
```
輸入: matrix = [[2,1,3],[6,5,4],[7,8,9]]
輸出: 13
解釋: 下降路徑 1→5→7 或 1→4→8 的和最小,為 13
```

### 問題分析

**狀態定義:**
- `dp[i][j]`: 從第一行到達 (i, j) 的最小路徑和

**狀態轉移:**
從上一行的三個位置轉移過來:
```cpp
dp[i][j] = matrix[i][j] + min(dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1])
```

注意邊界: j-1 和 j+1 可能越界

### 解法實現

```cpp
class Solution {
public:
    int minFallingPathSum(vector<vector<int>>& matrix) {
        int n = matrix.size();
        vector<vector<int>> dp(n, vector<int>(n));

        // 初始化第一行
        for (int j = 0; j < n; j++) {
            dp[0][j] = matrix[0][j];
        }

        // 填充 DP 表
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int minPrev = dp[i-1][j];
                if (j > 0) {
                    minPrev = min(minPrev, dp[i-1][j-1]);
                }
                if (j < n - 1) {
                    minPrev = min(minPrev, dp[i-1][j+1]);
                }
                dp[i][j] = matrix[i][j] + minPrev;
            }
        }

        // 找出最後一行的最小值
        return *min_element(dp[n-1].begin(), dp[n-1].end());
    }
};
```

**時間複雜度:** O(n²)
**空間複雜度:** O(n²)

#### 空間優化

```cpp
class Solution {
public:
    int minFallingPathSum(vector<vector<int>>& matrix) {
        int n = matrix.size();
        vector<int> dp = matrix[0];

        for (int i = 1; i < n; i++) {
            vector<int> newDp(n);
            for (int j = 0; j < n; j++) {
                int minPrev = dp[j];
                if (j > 0) minPrev = min(minPrev, dp[j-1]);
                if (j < n - 1) minPrev = min(minPrev, dp[j+1]);
                newDp[j] = matrix[i][j] + minPrev;
            }
            dp = newDp;
        }

        return *min_element(dp.begin(), dp.end());
    }
};
```

**時間複雜度:** O(n²)
**空間複雜度:** O(n)

---

## Grid DP 總結

### 問題類型

| 問題 | 狀態定義 | 轉移方向 | 應用 |
|------|----------|----------|------|
| 路徑計數 | dp[i][j] = 到達 (i,j) 的路徑數 | 上、左 | Unique Paths |
| 最優路徑 | dp[i][j] = 到達 (i,j) 的最小/大值 | 上、左 | Min Path Sum |
| 正方形/矩形 | dp[i][j] = 以 (i,j) 為角的最大邊長 | 上、左、左上 | Maximal Square |
| 下降路徑 | dp[i][j] = 到達 (i,j) 的最優值 | 左上、上、右上 | Falling Path |

### 關鍵要點

1. **狀態定義**
   - `dp[i][j]` 通常表示"到達 (i,j) 的某種最優值"
   - 有時表示"以 (i,j) 為某個角的最優值"

2. **轉移方向**
   - 通常從上方、左方轉移
   - 有時需要考慮對角線方向
   - 確保轉移的位置已經計算過

3. **初始化**
   - 第一行和第一列通常需要特殊處理
   - 障礙物需要特別標記

4. **空間優化**
   - 通常可以用滾動數組優化到 O(n)
   - 有時可以原地修改(如果允許)

### 解題模板

```cpp
// Grid DP 標準模板
vector<vector<int>> dp(m, vector<int>(n));

// 初始化第一行和第一列
dp[0][0] = init_value;
for (int j = 1; j < n; j++) dp[0][j] = ...;
for (int i = 1; i < m; i++) dp[i][0] = ...;

// 填充 DP 表
for (int i = 1; i < m; i++) {
    for (int j = 1; j < n; j++) {
        dp[i][j] = function(dp[i-1][j], dp[i][j-1], ...);
    }
}

return dp[m-1][n-1];
```

### 常見錯誤

1. **邊界處理錯誤**
   - 第一行、第一列的初始化
   - 數組越界

2. **障礙物處理遺漏**
   - 忘記檢查障礙物
   - 障礙物位置的 dp 值設置錯誤

3. **方向錯誤**
   - 只能向右下移動,不能向左上

4. **空間優化時變量覆蓋**
   - 需要保存必要的前一層數據

---

Grid DP 是動態規劃在二維空間的應用,掌握基本的路徑問題和矩陣問題,是解決更複雜網格問題的基礎。接下來我們將學習狀態壓縮 DP,這是處理集合問題的強大工具。
