---
title: 11-2. 2D Prefix Sum
order: 2
description: 二維前綴和：矩陣子區域和的 O(1) 查詢
tags:
  - 2D Prefix Sum
  - Matrix
  - Inclusion-Exclusion
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 2D Prefix Sum（二維前綴和）

## 核心概念

二維前綴和是一維前綴和的擴展，用於快速查詢矩陣中**任意子矩形區域的和**。

**核心思想**：預處理 O(m·n)，查詢 O(1)

---

## 一、原理與公式

### 定義

對於 `m × n` 矩陣 `matrix`，定義二維前綴和 `prefix[i][j]`：

```
prefix[i][j] = 從 (0,0) 到 (i,j) 的矩形區域和
```

圖解：

```
矩陣 matrix:
    0   1   2   3
  ┌───┬───┬───┬───┐
0 │ 3 │ 0 │ 1 │ 4 │
  ├───┼───┼───┼───┤
1 │ 5 │ 6 │ 3 │ 2 │
  ├───┼───┼───┼───┤
2 │ 1 │ 2 │ 0 │ 1 │
  └───┴───┴───┴───┘

prefix[2][3] = ?
= 3+0+1+4+5+6+3+2+1+2+0+1
= 28 (整個矩形 (0,0) 到 (2,3) 的和)
```

### 計算公式（預處理）

```cpp
prefix[i][j] = matrix[i][j]
             + prefix[i-1][j]     // 上方矩形
             + prefix[i][j-1]     // 左方矩形
             - prefix[i-1][j-1]   // 減去重複計算的左上角
```

**圖解**：

```
計算 prefix[i][j]:

    ┌─────────┬───┐
    │ (i-1,j-1) │ A │  ← prefix[i-1][j]
    ├─────────┼───┤
    │    B    │ X │
    └─────────┴───┘
         ↑
    prefix[i][j-1]

prefix[i][j] = X + A + B + prefix[i-1][j-1]
             = matrix[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]
                   (X)            (A+左上)        (B+左上)        (左上重複，要減)
```

### 查詢公式（區間和）

查詢子矩陣 `(r1, c1)` 到 `(r2, c2)` 的和：

```cpp
sum(r1, c1, r2, c2) = prefix[r2][c2]
                    - prefix[r1-1][c2]
                    - prefix[r2][c1-1]
                    + prefix[r1-1][c1-1]
```

**圖解（容斥原理）**：

```
查詢陰影區域的和：

    c1-1  c1      c2
      ↓   ↓       ↓
  ┌───┬───────────┐
  │ A │     B     │  ← r1-1
  ├───┼───────────┤
  │ C │█████████████│  ← r1
  │   │█████████████│
  │   │█████████████│  ← r2
  └───┴───────────┘

目標區域 = prefix[r2][c2] (整個大矩形)
         - prefix[r1-1][c2] (上方 A+B)
         - prefix[r2][c1-1] (左方 A+C)
         + prefix[r1-1][c1-1] (A 被減了兩次，要加回來)
```

這就是**容斥原理（Inclusion-Exclusion Principle）**！

---

## 二、C++ 模板實現

### 基礎版本

```cpp
class PrefixSum2D {
private:
    vector<vector<int>> prefix;

public:
    // 建構函數：預處理二維前綴和
    PrefixSum2D(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return;

        int m = matrix.size(), n = matrix[0].size();
        prefix.resize(m + 1, vector<int>(n + 1, 0));  // 多一圈，方便邊界處理

        // 預處理：O(m·n)
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefix[i][j] = matrix[i-1][j-1]  // 當前格子
                             + prefix[i-1][j]     // 上方
                             + prefix[i][j-1]     // 左方
                             - prefix[i-1][j-1];  // 減去重複
            }
        }
    }

    // 查詢子矩陣和：(r1,c1) 到 (r2,c2)，0-indexed
    int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2+1][c2+1]
             - prefix[r1][c2+1]
             - prefix[r2+1][c1]
             + prefix[r1][c1];
    }
};
```

### 使用範例

```cpp
int main() {
    vector<vector<int>> matrix = {
        {3, 0, 1, 4},
        {5, 6, 3, 2},
        {1, 2, 0, 1}
    };

    PrefixSum2D ps(matrix);

    // 查詢 (1,1) 到 (2,2) 的和
    // 區域：6, 3
    //       2, 0
    // 和 = 6+3+2+0 = 11
    cout << ps.sumRegion(1, 1, 2, 2) << endl;  // 11

    // 查詢 (0,0) 到 (1,3) 的和
    // 區域：整個前兩行
    // 和 = 3+0+1+4+5+6+3+2 = 24
    cout << ps.sumRegion(0, 0, 1, 3) << endl;  // 24
}
```

---

## 三、複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 預處理 | O(m·n) | O(m·n) |
| 區間查詢 | O(1) | - |

**權衡**：
- 犧牲 O(m·n) 空間
- 獲得 O(1) 查詢時間
- 適合**多次查詢**的場景

---

## 四、LeetCode 題目詳解

### 1. LeetCode 304: Range Sum Query 2D - Immutable

**題目**：給定矩陣 `matrix`，多次查詢子矩陣和。

**解法**：直接套用模板

```cpp
class NumMatrix {
private:
    vector<vector<int>> prefix;

public:
    NumMatrix(vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return;

        int m = matrix.size(), n = matrix[0].size();
        prefix.resize(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefix[i][j] = matrix[i-1][j-1]
                             + prefix[i-1][j]
                             + prefix[i][j-1]
                             - prefix[i-1][j-1];
            }
        }
    }

    int sumRegion(int row1, int col1, int row2, int col2) {
        return prefix[row2+1][col2+1]
             - prefix[row1][col2+1]
             - prefix[row2+1][col1]
             + prefix[row1][col1];
    }
};
```

**複雜度**：
- 建構：O(m·n)
- 查詢：O(1)

---

### 2. LeetCode 1314: Matrix Block Sum

**題目**：給定矩陣 `mat` 和整數 `k`，計算 `answer[i][j]` 為以 `(i,j)` 為中心、邊長不超過 `k` 的矩形區域和。

**範例**：
```
mat = [[1,2,3],
       [4,5,6],
       [7,8,9]], k = 1

answer = [[12,21,16],
          [27,45,33],
          [24,39,28]]

解釋：answer[1][1] = 1+2+3+4+5+6+7+8+9 = 45
```

**解法**：使用二維前綴和 + 邊界處理

```cpp
class Solution {
public:
    vector<vector<int>> matrixBlockSum(vector<vector<int>>& mat, int k) {
        int m = mat.size(), n = mat[0].size();

        // 預處理前綴和
        vector<vector<int>> prefix(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefix[i][j] = mat[i-1][j-1]
                             + prefix[i-1][j]
                             + prefix[i][j-1]
                             - prefix[i-1][j-1];
            }
        }

        // 計算結果
        vector<vector<int>> answer(m, vector<int>(n));
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // 計算邊界
                int r1 = max(0, i - k);
                int c1 = max(0, j - k);
                int r2 = min(m - 1, i + k);
                int c2 = min(n - 1, j + k);

                // 查詢區域和
                answer[i][j] = prefix[r2+1][c2+1]
                             - prefix[r1][c2+1]
                             - prefix[r2+1][c1]
                             + prefix[r1][c1];
            }
        }

        return answer;
    }
};
```

**複雜度**：O(m·n)

**關鍵**：邊界處理使用 `max` 和 `min` 確保不越界。

---

### 3. LeetCode 1277: Count Square Submatrices with All Ones

**題目**：給定 01 矩陣，計算有多少個全為 1 的正方形子矩陣。

**範例**：
```
matrix = [[0,1,1,1],
          [1,1,1,1],
          [0,1,1,1]]

答案：15
```

**解法 1：動態規劃（推薦）**

```cpp
class Solution {
public:
    int countSquares(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        int count = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
                    }
                    count += dp[i][j];
                }
            }
        }

        return count;
    }
};
```

**DP 定義**：`dp[i][j]` = 以 `(i,j)` 為右下角的最大正方形邊長

**解法 2：二維前綴和（暴力枚舉）**

```cpp
class Solution {
public:
    int countSquares(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();

        // 預處理前綴和
        vector<vector<int>> prefix(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefix[i][j] = matrix[i-1][j-1]
                             + prefix[i-1][j]
                             + prefix[i][j-1]
                             - prefix[i-1][j-1];
            }
        }

        int count = 0;

        // 枚舉所有可能的正方形
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // 枚舉邊長
                int maxSize = min(m - i, n - j);
                for (int size = 1; size <= maxSize; size++) {
                    int r2 = i + size - 1;
                    int c2 = j + size - 1;

                    // 查詢區域和
                    int sum = prefix[r2+1][c2+1]
                            - prefix[i][c2+1]
                            - prefix[r2+1][j]
                            + prefix[i][j];

                    // 全為 1 的正方形
                    if (sum == size * size) {
                        count++;
                    }
                }
            }
        }

        return count;
    }
};
```

**複雜度比較**：
- DP：O(m·n)
- 前綴和暴力：O(m·n·min(m,n))

**結論**：這題 DP 更優，但展示了二維前綴和的應用。

---

### 4. LeetCode 363: Max Sum of Rectangle No Larger Than K

**題目**：找出矩陣中和 ≤ k 的最大子矩陣和。

**解法**：二維前綴和 + 固定上下邊界 + 有序集合

這是一個**非常難**的題目，結合了多種技巧：

```cpp
class Solution {
public:
    int maxSumSubmatrix(vector<vector<int>>& matrix, int k) {
        int m = matrix.size(), n = matrix[0].size();
        int maxSum = INT_MIN;

        // 枚舉上邊界
        for (int top = 0; top < m; top++) {
            vector<int> colSum(n, 0);  // 每列的和

            // 枚舉下邊界
            for (int bottom = top; bottom < m; bottom++) {
                // 累加當前行到 colSum
                for (int j = 0; j < n; j++) {
                    colSum[j] += matrix[bottom][j];
                }

                // 問題轉化為一維：找 colSum 中和 ≤ k 的最大子陣列和
                // 使用前綴和 + 有序集合
                set<int> prefixSet;
                prefixSet.insert(0);

                int prefixSum = 0;
                for (int sum : colSum) {
                    prefixSum += sum;

                    // 尋找最小的 prefix >= prefixSum - k
                    auto it = prefixSet.lower_bound(prefixSum - k);
                    if (it != prefixSet.end()) {
                        maxSum = max(maxSum, prefixSum - *it);
                    }

                    prefixSet.insert(prefixSum);
                }
            }
        }

        return maxSum;
    }
};
```

**核心思想**：
1. 固定上下邊界 → 降維成一維問題
2. 一維問題：找和 ≤ k 的最大子陣列和
3. 使用前綴和 + `set` 的 `lower_bound` 在 O(log n) 內查找

**複雜度**：O(m²·n·log n)

---

## 五、進階應用

### 1. 多次更新 + 多次查詢

如果矩陣會**動態修改**，二維前綴和就不適用了（每次更新需要重新預處理）。

**解決方案**：
- **二維樹狀陣列（2D Fenwick Tree）**：O(log m · log n) 更新和查詢
- **二維線段樹（2D Segment Tree）**：功能更強但實現複雜

### 2. 差分矩陣（2D Difference Array）

類似一維差分陣列，可以實現 **O(1) 區間修改**。

**應用**：LeetCode 2536: Increment Submatrices by One

```cpp
void rangeAdd2D(vector<vector<int>>& diff, int r1, int c1, int r2, int c2, int val) {
    diff[r1][c1] += val;
    diff[r1][c2+1] -= val;
    diff[r2+1][c1] -= val;
    diff[r2+1][c2+1] += val;
}
```

還原：
```cpp
// 先對每行做前綴和
for (int i = 0; i < m; i++) {
    for (int j = 1; j < n; j++) {
        matrix[i][j] += matrix[i][j-1];
    }
}

// 再對每列做前綴和
for (int j = 0; j < n; j++) {
    for (int i = 1; i < m; i++) {
        matrix[i][j] += matrix[i-1][j];
    }
}
```

---

## 六、常見陷阱與技巧

### 陷阱 1：邊界處理錯誤

```cpp
// 錯誤：忘記 +1 offset
prefix[i][j] = matrix[i][j] + ...  // 如果 prefix 是 (m+1)×(n+1)，這會越界！

// 正確：使用 1-indexed
prefix[i][j] = matrix[i-1][j-1] + ...
```

### 陷阱 2：查詢公式記錯

記憶技巧：**容斥原理**
```
總和 = 大矩形
     - 上方矩形
     - 左方矩形
     + 左上角矩形（被減了兩次，要加回來）
```

### 陷阱 3：整數溢位

```cpp
// 如果矩陣很大，前綴和可能溢位
vector<vector<long long>> prefix;  // 使用 long long
```

### 技巧 1：降維思想

很多二維問題可以通過**固定一個維度**降為一維問題：
- LeetCode 363: Max Sum of Rectangle No Larger Than K
- LeetCode 85: Maximal Rectangle

### 技巧 2：巧用邊界

多分配一圈（`m+1` 和 `n+1`）可以避免特判邊界：

```cpp
// 不需要判斷 i=0 或 j=0
prefix.resize(m + 1, vector<int>(n + 1, 0));
```

---

## 七、視覺化範例

### 完整計算過程

給定矩陣：
```
matrix = [[1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]]
```

**步驟 1：預處理前綴和**

```
prefix (初始化為 0):
   0  1  2  3
0 [0, 0, 0, 0]
1 [0, ?, ?, ?]
2 [0, ?, ?, ?]
3 [0, ?, ?, ?]

計算 prefix[1][1]:
= matrix[0][0] + prefix[0][1] + prefix[1][0] - prefix[0][0]
= 1 + 0 + 0 - 0
= 1

計算 prefix[1][2]:
= matrix[0][1] + prefix[0][2] + prefix[1][1] - prefix[0][1]
= 2 + 0 + 1 - 0
= 3

計算 prefix[2][2]:
= matrix[1][1] + prefix[1][2] + prefix[2][1] - prefix[1][1]
= 5 + 3 + 5 - 1
= 12

...最終：
   0  1  2  3
0 [0, 0, 0, 0]
1 [0, 1, 3, 6]
2 [0, 5,12,21]
3 [0,12,27,45]
```

**步驟 2：查詢 (1,1) 到 (2,2)**

```
查詢區域：
    5, 6
    8, 9

計算：
= prefix[3][3] - prefix[1][3] - prefix[3][1] + prefix[1][1]
= 45 - 6 - 12 + 1
= 28  ✓
```

---

## 八、總結

### 核心公式

**預處理**：
```cpp
prefix[i][j] = matrix[i-1][j-1]
             + prefix[i-1][j]
             + prefix[i][j-1]
             - prefix[i-1][j-1]
```

**查詢**：
```cpp
sum(r1, c1, r2, c2) = prefix[r2+1][c2+1]
                    - prefix[r1][c2+1]
                    - prefix[r2+1][c1]
                    + prefix[r1][c1]
```

### 適用場景

| 場景 | 是否適用 |
|------|---------|
| 靜態矩陣，多次查詢 | ✅ 完美 |
| 需要動態修改 | ❌ 改用 2D Fenwick Tree |
| 空間受限 | ❌ O(m·n) 空間開銷 |
| 一次性查詢 | ❌ 暴力計算即可 |

### 延伸學習

- **三維前綴和**：處理立方體區域查詢
- **二維樹狀陣列**：支援動態修改
- **差分矩陣**：O(1) 區間修改

掌握二維前綴和後，你已經可以高效解決所有矩陣子區域和問題了！
