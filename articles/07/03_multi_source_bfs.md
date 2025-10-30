---
title: '07-3. Multi-source BFS, 狀態空間 BFS'
order: 3
description: '掌握多源 BFS 與狀態空間 BFS 的進階技巧。學習如何同時從多個起點擴展、計算到最近源點的距離，以及在狀態空間中進行搜索的方法與應用。'
tags: ['Multi-source BFS', 'State Space', 'Distance', 'Shortest Bridge', '多源BFS', '狀態空間']
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Multi-source BFS, 狀態空間 BFS

## 多源 BFS（Multi-source BFS）

### 核心思想

普通 BFS 從單一源點開始擴展，而多源 BFS 同時從多個源點開始擴展。這在計算「到最近源點的距離」時特別有用。

### 技巧

將所有源點同時加入初始隊列，然後執行標準 BFS。這樣每個點到達的時間就是它到最近源點的距離。

### 模板

```cpp
void multiSourceBFS(vector<vector<int>>& grid) {
    queue<pair<int, int>> q;
    vector<vector<bool>> visited(m, vector<bool>(n, false));

    // 第一步：將所有源點加入隊列
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (isSource(grid[i][j])) {
                q.push({i, j});
                visited[i][j] = true;
            }
        }
    }

    // 第二步：標準 BFS
    int distance = 0;
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [x, y] = q.front();
            q.pop();

            // 處理當前節點

            for (int d = 0; d < 4; d++) {
                int nx = x + dx[d];
                int ny = y + dy[d];
                if (isValid(nx, ny) && !visited[nx][ny]) {
                    visited[nx][ny] = true;
                    q.push({nx, ny});
                }
            }
        }
        distance++;
    }
}
```

---

## LeetCode 542: 01 Matrix

### 題目描述

給定一個由 0 和 1 組成的矩陣 mat，返回一個相同大小的矩陣，其中每個元素是該位置到最近的 0 的距離。

**範例**：
```
輸入: mat = [
  [0,0,0],
  [0,1,0],
  [0,0,0]
]
輸出: [
  [0,0,0],
  [0,1,0],
  [0,0,0]
]

輸入: mat = [
  [0,0,0],
  [0,1,0],
  [1,1,1]
]
輸出: [
  [0,0,0],
  [0,1,0],
  [1,2,1]
]
```

### 思路

如果對每個 1 執行 BFS 找最近的 0，時間複雜度為 O((mn)²)。

更好的方法：**多源 BFS**
1. 將所有 0 作為源點同時加入隊列
2. 從這些源點同時向外擴展
3. 每個 1 被第一次訪問時的距離就是答案

### 圖解

```
初始狀態:        第一層:          第二層:
0 0 0           [0][0][0]        [0][0][0]
0 1 0           [0] ?  [0]       [0][1][0]
1 1 1            ?  ?   ?        [1] ?  [1]

第三層:
[0][0][0]
[0][1][0]
[1][2][1]
```

### 解法

```cpp
class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        if (mat.empty()) return mat;
        int m = mat.size(), n = mat[0].size();

        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        queue<pair<int, int>> q;

        // 第一步：將所有 0 加入隊列，距離設為 0
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                    q.push({i, j});
                }
            }
        }

        // 第二步：多源 BFS
        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    // 如果找到更短的距離
                    if (dist[nx][ny] > dist[x][y] + 1) {
                        dist[nx][ny] = dist[x][y] + 1;
                        q.push({nx, ny});
                    }
                }
            }
        }

        return dist;
    }
};
```

### 優化：使用 visited 避免重複

```cpp
class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        int m = mat.size(), n = mat[0].size();
        vector<vector<int>> dist(m, vector<int>(n, 0));
        vector<vector<bool>> visited(m, vector<bool>(n, false));
        queue<pair<int, int>> q;

        // 將所有 0 加入隊列
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    q.push({i, j});
                    visited[i][j] = true;
                }
            }
        }

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
                    dist[nx][ny] = dist[x][y] + 1;
                    visited[nx][ny] = true;
                    q.push({nx, ny});
                }
            }
        }

        return dist;
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## LeetCode 934: Shortest Bridge

### 題目描述

在給定的二維二進制矩陣中，有兩個島嶼（由 1 組成）。找到連接這兩個島嶼的最短橋樑（改變 0 為 1 的最少數量）。

**範例**：
```
輸入: grid = [
  [0,1],
  [1,0]
]
輸出: 1

輸入: grid = [
  [1,1,1,1,1],
  [1,0,0,0,1],
  [1,0,1,0,1],
  [1,0,0,0,1],
  [1,1,1,1,1]
]
輸出: 1
```

### 思路

1. **第一步**：DFS 找到第一個島嶼，標記所有格子
2. **第二步**：從第一個島嶼的所有格子開始多源 BFS
3. **第三步**：當遇到第二個島嶼時，返回距離

### 圖解

```
原始:            找到島嶼1:       從島嶼1 BFS:
0 1 0 0 0       0 [1] 0 0 0      0 [1] 1 0 0
0 1 0 0 0       0 [1] 0 0 0      0 [1] 1 0 0
0 0 0 0 0  -->  0  0  0 0 0  --> 0  1  1 1 0
0 0 0 1 0       0  0  0 ? 0      0  0  1 ? 0
0 0 0 1 0       0  0  0 ? 0      0  0  1 ? 0
                島嶼2             找到島嶼2!距離=2
```

### 解法

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    // DFS 標記第一個島嶼
    void dfs(vector<vector<int>>& grid, int x, int y, queue<pair<int, int>>& q) {
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] != 1) {
            return;
        }

        grid[x][y] = 2;  // 標記為第一個島嶼
        q.push({x, y});  // 加入 BFS 隊列

        for (int i = 0; i < 4; i++) {
            dfs(grid, x + dx[i], y + dy[i], q);
        }
    }

public:
    int shortestBridge(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();

        queue<pair<int, int>> q;

        // 第一步：找到第一個島嶼
        bool found = false;
        for (int i = 0; i < m && !found; i++) {
            for (int j = 0; j < n && !found; j++) {
                if (grid[i][j] == 1) {
                    dfs(grid, i, j, q);
                    found = true;
                }
            }
        }

        // 第二步：從第一個島嶼開始多源 BFS
        int steps = 0;
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                auto [x, y] = q.front();
                q.pop();

                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d];
                    int ny = y + dy[d];

                    if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                        if (grid[nx][ny] == 1) {
                            return steps;  // 找到第二個島嶼
                        }
                        if (grid[nx][ny] == 0) {
                            grid[nx][ny] = 2;  // 標記為已訪問
                            q.push({nx, ny});
                        }
                    }
                }
            }
            steps++;
        }

        return -1;  // 不應該到達這裡
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## LeetCode 286: Walls and Gates

### 題目描述

給定一個 m × n 的網格：
- -1：牆壁（障礙物）
- 0：門（源點）
- INF：空房間（需要計算到門的最短距離）

填充每個空房間到最近門的距離。

**範例**：
```
輸入: rooms = [
  [INF, -1,  0,  INF],
  [INF, INF, INF, -1],
  [INF, -1,  INF, -1],
  [0,   -1,  INF, INF]
]
輸出: [
  [3, -1,  0,  1],
  [2,  2,  1, -1],
  [1, -1,  2, -1],
  [0, -1,  3,  4]
]
```

### 解法：多源 BFS

```cpp
class Solution {
public:
    void wallsAndGates(vector<vector<int>>& rooms) {
        if (rooms.empty()) return;
        int m = rooms.size(), n = rooms[0].size();

        const int INF = 2147483647;
        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        queue<pair<int, int>> q;

        // 將所有門加入隊列
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rooms[i][j] == 0) {
                    q.push({i, j});
                }
            }
        }

        // 多源 BFS
        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                // 只處理空房間（INF）
                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    rooms[nx][ny] == INF) {
                    rooms[nx][ny] = rooms[x][y] + 1;
                    q.push({nx, ny});
                }
            }
        }
    }
};
```

**時間複雜度**：O(m × n)
**空間複雜度**：O(m × n)

---

## 狀態空間 BFS

### 核心思想

當問題的狀態不僅僅是位置，還包括其他維度（如方向、攜帶物品、時間等）時，需要在**狀態空間**中進行 BFS。

狀態通常用多元組表示：`(x, y, state1, state2, ...)`

---

## LeetCode 773: Sliding Puzzle

### 題目描述

在 2×3 的棋盤上，有 5 個方塊和 1 個空格（用 0 表示）。每次移動可以將 0 與相鄰的方塊交換。給定初始狀態，返回達到目標狀態 `[[1,2,3],[4,5,0]]` 的最少移動次數。

**範例**：
```
輸入: board = [[1,2,3],[4,0,5]]
輸出: 1
解釋: 交換 0 和 5

輸入: board = [[1,2,3],[5,4,0]]
輸出: -1
解釋: 無法達到目標狀態
```

### 思路

1. 將 2D 棋盤狀態轉換為字符串（狀態壓縮）
2. 使用 BFS 在狀態空間中搜索
3. 每個狀態的鄰居是交換 0 後的新狀態
4. 使用 set 記錄訪問過的狀態

### 解法

```cpp
class Solution {
public:
    int slidingPuzzle(vector<vector<int>>& board) {
        string start = "";
        string target = "123450";

        // 將 2D board 轉為字符串
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 3; j++) {
                start += to_string(board[i][j]);
            }
        }

        if (start == target) return 0;

        // 定義每個位置可以移動到的鄰居位置
        // 0 1 2
        // 3 4 5
        vector<vector<int>> neighbors = {
            {1, 3},       // 位置 0 可以移動到 1, 3
            {0, 2, 4},    // 位置 1 可以移動到 0, 2, 4
            {1, 5},       // 位置 2 可以移動到 1, 5
            {0, 4},       // 位置 3 可以移動到 0, 4
            {1, 3, 5},    // 位置 4 可以移動到 1, 3, 5
            {2, 4}        // 位置 5 可以移動到 2, 4
        };

        queue<string> q;
        unordered_set<string> visited;

        q.push(start);
        visited.insert(start);

        int steps = 0;

        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                string curr = q.front();
                q.pop();

                if (curr == target) {
                    return steps;
                }

                // 找到 0 的位置
                int zero_pos = curr.find('0');

                // 嘗試所有可能的移動
                for (int next_pos : neighbors[zero_pos]) {
                    string next = curr;
                    swap(next[zero_pos], next[next_pos]);

                    if (!visited.count(next)) {
                        visited.insert(next);
                        q.push(next);
                    }
                }
            }
            steps++;
        }

        return -1;
    }
};
```

**時間複雜度**：O(m × n × (m×n)!)，狀態數量
**空間複雜度**：O((m×n)!)

---

## LeetCode 1091: Shortest Path in Binary Matrix

### 題目描述

給定一個 n×n 的二進制矩陣 grid，返回從左上角到右下角的最短路徑長度。路徑可以沿八個方向移動，且只能經過值為 0 的格子。

**範例**：
```
輸入: grid = [
  [0,1],
  [1,0]
]
輸出: 2

輸入: grid = [
  [0,0,0],
  [1,1,0],
  [1,1,0]
]
輸出: 4
```

### 解法：BFS（八方向）

```cpp
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) {
            return -1;
        }

        // 八個方向
        const int dx[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
        const int dy[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

        queue<pair<int, int>> q;
        q.push({0, 0});
        grid[0][0] = 1;  // 標記為已訪問

        int path_length = 1;

        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                auto [x, y] = q.front();
                q.pop();

                // 到達終點
                if (x == n - 1 && y == n - 1) {
                    return path_length;
                }

                // 八個方向
                for (int d = 0; d < 8; d++) {
                    int nx = x + dx[d];
                    int ny = y + dy[d];

                    if (nx >= 0 && nx < n && ny >= 0 && ny < n &&
                        grid[nx][ny] == 0) {
                        grid[nx][ny] = 1;  // 標記為已訪問
                        q.push({nx, ny});
                    }
                }
            }
            path_length++;
        }

        return -1;
    }
};
```

**時間複雜度**：O(n²)
**空間複雜度**：O(n²)

---

## 總結

### 多源 BFS vs 單源 BFS

| 特性 | 單源 BFS | 多源 BFS |
|------|---------|---------|
| 起點數量 | 1 個 | 多個 |
| 初始隊列 | 單個源點 | 所有源點 |
| 適用場景 | 單點最短路 | 到最近源點的距離 |
| 時間複雜度 | O(V + E) | O(V + E) |

### 狀態空間 BFS 關鍵點

1. **狀態表示**：定義完整的狀態（位置 + 其他維度）
2. **狀態轉換**：定義從一個狀態到另一個狀態的規則
3. **去重**：使用 set/map 記錄訪問過的狀態
4. **狀態壓縮**：將多維狀態壓縮為字符串或整數

### 常見應用

- **多源 BFS**：距離計算、區域擴展、連接問題
- **狀態空間 BFS**：益智遊戲、路徑規劃、狀態搜索

### 優化技巧

1. **雙向 BFS**：從起點和終點同時搜索
2. **A* 算法**：使用啟發式函數優化搜索
3. **狀態剪枝**：提前判斷不可達狀態
