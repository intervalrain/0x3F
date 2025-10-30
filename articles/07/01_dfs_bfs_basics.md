---
title: 07-1. DFS/BFS 基礎 (DFS/BFS Basics)
order: 1
description: '深入學習網格圖的 DFS 與 BFS 基礎應用。透過 Flood Fill、島嶼計數、最大面積等經典題目，掌握連通區域搜索、邊界處理、原地標記等實用技巧。'
tags: ['DFS', 'BFS', 'Grid', 'Flood Fill', 'Island', '深度優先', '廣度優先']
author: Rain Hu
date: '2025-10-30'
draft: false
---

# DFS/BFS 基礎

網格圖的 DFS 和 BFS 是最基礎也最重要的技巧，主要用於：
- 連通區域的搜索（Flood Fill）
- 島嶼問題（Number of Islands）
- 面積計算（Max Area of Island）
- 邊界處理（Surrounded Regions）

## 核心概念

### DFS（深度優先搜索）

- **特點**：一條路走到底，回溯繼續
- **實現**：遞迴或堆疊
- **適用**：連通性判斷、路徑搜索、回溯問題
- **空間複雜度**：O(m × n)，遞迴深度

### BFS（廣度優先搜索）

- **特點**：一層一層展開
- **實現**：隊列
- **適用**：最短路徑、層序遍歷、距離計算
- **空間複雜度**：O(min(m, n))，隊列大小

## LeetCode 733: Flood Fill

### 題目描述

給定一個圖像（二維整數陣列），從位置 (sr, sc) 開始，將其連通的相同顏色區域全部改為新顏色。

**範例**：
```
輸入: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
輸出: [[2,2,2],[2,2,0],[2,0,1]]
```

### 解法：DFS

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;
    int originalColor;

    void dfs(vector<vector<int>>& image, int x, int y, int newColor) {
        // 邊界檢查或顏色不匹配
        if (x < 0 || x >= m || y < 0 || y >= n ||
            image[x][y] != originalColor || image[x][y] == newColor) {
            return;
        }

        // 填充新顏色
        image[x][y] = newColor;

        // 向四個方向擴展
        for (int i = 0; i < 4; i++) {
            dfs(image, x + dx[i], y + dy[i], newColor);
        }
    }

public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image.empty()) return image;
        m = image.size();
        n = image[0].size();
        originalColor = image[sr][sc];

        // 如果原色和新色相同，直接返回（避免無限遞迴）
        if (originalColor == color) return image;

        dfs(image, sr, sc, color);
        return image;
    }
};
```

### 解法：BFS

```cpp
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image.empty()) return image;
        int m = image.size(), n = image[0].size();
        int originalColor = image[sr][sc];

        if (originalColor == color) return image;

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        queue<pair<int, int>> q;
        q.push({sr, sc});
        image[sr][sc] = color;

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    image[nx][ny] == originalColor) {
                    image[nx][ny] = color;
                    q.push({nx, ny});
                }
            }
        }

        return image;
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)（DFS 遞迴堆疊）或 O(min(m, n))（BFS 隊列）

---

## LeetCode 200: Number of Islands

### 題目描述

給定一個由 '1'（陸地）和 '0'（水）組成的二維網格，計算島嶼的數量。島嶼由水平或垂直連接的陸地組成。

**範例**：
```
輸入: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
輸出: 1
```

### 解法：DFS

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    void dfs(vector<vector<char>>& grid, int x, int y) {
        // 邊界檢查或遇到水/已訪問的格子
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] != '1') {
            return;
        }

        // 標記為已訪問（使用 '0' 或其他特殊值）
        grid[x][y] = '0';

        // 向四個方向擴展
        for (int i = 0; i < 4; i++) {
            dfs(grid, x + dx[i], y + dy[i]);
        }
    }

public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();
        int count = 0;

        // 遍歷所有格子
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;  // 發現新島嶼
                    dfs(grid, i, j);  // 標記整個島嶼
                }
            }
        }

        return count;
    }
};
```

### 解法：BFS

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int m = grid.size(), n = grid[0].size();
        int count = 0;

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;

                    // BFS 標記整個島嶼
                    queue<pair<int, int>> q;
                    q.push({i, j});
                    grid[i][j] = '0';

                    while (!q.empty()) {
                        auto [x, y] = q.front();
                        q.pop();

                        for (int k = 0; k < 4; k++) {
                            int nx = x + dx[k];
                            int ny = y + dy[k];

                            if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                                grid[nx][ny] == '1') {
                                grid[nx][ny] = '0';
                                q.push({nx, ny});
                            }
                        }
                    }
                }
            }
        }

        return count;
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## LeetCode 695: Max Area of Island

### 題目描述

給定一個包含 0 和 1 的二維網格，找出最大島嶼的面積。

**範例**：
```
輸入: grid = [
  [0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,1,1,0,1,0,0,0,0,0,0,0,0],
  [0,1,0,0,1,1,0,0,1,0,1,0,0]
]
輸出: 6
解釋: 中間的島嶼面積為 6
```

### 解法：DFS

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    int dfs(vector<vector<int>>& grid, int x, int y) {
        // 邊界檢查或遇到水/已訪問
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 0) {
            return 0;
        }

        // 標記為已訪問
        grid[x][y] = 0;

        // 當前格子面積為 1，加上四個方向的面積
        int area = 1;
        for (int i = 0; i < 4; i++) {
            area += dfs(grid, x + dx[i], y + dy[i]);
        }

        return area;
    }

public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();
        int maxArea = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    maxArea = max(maxArea, dfs(grid, i, j));
                }
            }
        }

        return maxArea;
    }
};
```

### 解法：BFS

```cpp
class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        int m = grid.size(), n = grid[0].size();
        int maxArea = 0;

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    int area = 0;
                    queue<pair<int, int>> q;
                    q.push({i, j});
                    grid[i][j] = 0;

                    while (!q.empty()) {
                        auto [x, y] = q.front();
                        q.pop();
                        area++;

                        for (int k = 0; k < 4; k++) {
                            int nx = x + dx[k];
                            int ny = y + dy[k];

                            if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                                grid[nx][ny] == 1) {
                                grid[nx][ny] = 0;
                                q.push({nx, ny});
                            }
                        }
                    }

                    maxArea = max(maxArea, area);
                }
            }
        }

        return maxArea;
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## LeetCode 130: Surrounded Regions

### 題目描述

給定一個包含 'X' 和 'O' 的二維網格，捕獲所有被 'X' 包圍的 'O'，將其變為 'X'。被包圍的區域不包括邊界上的 'O'。

**範例**：
```
輸入: board = [
  ["X","X","X","X"],
  ["X","O","O","X"],
  ["X","X","O","X"],
  ["X","O","X","X"]
]
輸出: [
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","O","X","X"]
]
```

### 思路

1. 從邊界的 'O' 開始 DFS/BFS，標記所有連通的 'O'（這些是不會被捕獲的）
2. 遍歷整個網格，將未標記的 'O' 改為 'X'
3. 將標記的 'O' 恢復

### 解法：DFS

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    void dfs(vector<vector<char>>& board, int x, int y) {
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] != 'O') {
            return;
        }

        // 標記為臨時字符，表示不會被捕獲
        board[x][y] = '#';

        for (int i = 0; i < 4; i++) {
            dfs(board, x + dx[i], y + dy[i]);
        }
    }

public:
    void solve(vector<vector<char>>& board) {
        if (board.empty()) return;
        m = board.size();
        n = board[0].size();

        // 第一步：從邊界的 'O' 開始 DFS，標記不會被捕獲的 'O'
        // 處理第一列和最後一列
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') dfs(board, i, 0);
            if (board[i][n-1] == 'O') dfs(board, i, n-1);
        }

        // 處理第一行和最後一行
        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') dfs(board, 0, j);
            if (board[m-1][j] == 'O') dfs(board, m-1, j);
        }

        // 第二步：遍歷整個網格
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') {
                    board[i][j] = 'X';  // 未標記的 'O' 被捕獲
                } else if (board[i][j] == '#') {
                    board[i][j] = 'O';  // 恢復標記的 'O'
                }
            }
        }
    }
};
```

### 解法：BFS

```cpp
class Solution {
public:
    void solve(vector<vector<char>>& board) {
        if (board.empty()) return;
        int m = board.size(), n = board[0].size();

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        auto bfs = [&](int startX, int startY) {
            queue<pair<int, int>> q;
            q.push({startX, startY});
            board[startX][startY] = '#';

            while (!q.empty()) {
                auto [x, y] = q.front();
                q.pop();

                for (int i = 0; i < 4; i++) {
                    int nx = x + dx[i];
                    int ny = y + dy[i];

                    if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                        board[nx][ny] == 'O') {
                        board[nx][ny] = '#';
                        q.push({nx, ny});
                    }
                }
            }
        };

        // 從邊界開始 BFS
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') bfs(i, 0);
            if (board[i][n-1] == 'O') bfs(i, n-1);
        }

        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') bfs(0, j);
            if (board[m-1][j] == 'O') bfs(m-1, j);
        }

        // 更新網格
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') {
                    board[i][j] = 'X';
                } else if (board[i][j] == '#') {
                    board[i][j] = 'O';
                }
            }
        }
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## LeetCode 1254: Number of Closed Islands

### 題目描述

給定一個二維網格，0 表示陸地，1 表示水。如果一個島嶼完全被水包圍（不接觸邊界），則稱為「封閉島嶼」。計算封閉島嶼的數量。

**範例**：
```
輸入: grid = [
  [1,1,1,1,1,1,1,0],
  [1,0,0,0,0,1,1,0],
  [1,0,1,0,1,1,1,0],
  [1,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,0]
]
輸出: 2
```

### 思路

1. 先從邊界的陸地（0）開始 DFS，標記所有接觸邊界的島嶼
2. 遍歷內部，計算剩餘的島嶼數量（即封閉島嶼）

### 解法

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    void dfs(vector<vector<int>>& grid, int x, int y) {
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 1) {
            return;
        }

        // 標記為已訪問
        grid[x][y] = 1;

        for (int i = 0; i < 4; i++) {
            dfs(grid, x + dx[i], y + dy[i]);
        }
    }

public:
    int closedIsland(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();

        // 第一步：標記所有接觸邊界的島嶼
        for (int i = 0; i < m; i++) {
            if (grid[i][0] == 0) dfs(grid, i, 0);
            if (grid[i][n-1] == 0) dfs(grid, i, n-1);
        }

        for (int j = 0; j < n; j++) {
            if (grid[0][j] == 0) dfs(grid, 0, j);
            if (grid[m-1][j] == 0) dfs(grid, m-1, j);
        }

        // 第二步：計算剩餘的島嶼（封閉島嶼）
        int count = 0;
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                if (grid[i][j] == 0) {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }

        return count;
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## 總結

### DFS vs BFS 選擇

| 場景 | 推薦方法 | 原因 |
|------|---------|------|
| 連通性判斷 | DFS | 代碼簡潔 |
| 最短路徑 | BFS | 層序遍歷保證最短 |
| 面積計算 | DFS | 返回值累加方便 |
| 邊界處理 | DFS/BFS | 都可以 |
| 空間要求嚴格 | BFS | 空間複雜度更小 |

### 關鍵技巧

1. **原地標記**：直接修改網格避免額外空間
2. **邊界優先處理**：很多題目需要先處理邊界
3. **雙向標記**：先標記特殊區域，再處理剩餘區域
4. **方向陣列**：統一使用 dx, dy 陣列

### 練習建議

1. 先用 DFS 實現，再用 BFS 實現
2. 注意邊界情況（空網格、單格網格）
3. 理解何時需要 visited 陣列，何時可以原地標記
4. 掌握從邊界開始搜索的技巧
