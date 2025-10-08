---
title: 07-0. 網格圖的介紹
order: 0
description: '全面介紹網格圖的基本概念與遍歷技巧。學習四向/八向移動、邊界檢查、visited 陣列的使用，掌握 DFS 與 BFS 在網格圖中的應用模板與最佳實踐。'
tags: ['Grid', 'Graph', 'DFS', 'BFS', '網格圖', '圖論']
author: Rain Hu
date: '2025-10-08'
draft: false
---

# 網格圖的介紹

## 什麼是網格圖？

網格圖（Grid Graph）是一種特殊的圖結構，通常用二維陣列表示。每個格子代表一個節點，相鄰的格子之間有邊相連。網格圖在演算法題目中非常常見，特別是在路徑搜尋、區域填充、島嶼問題等場景中。

### 與一般圖的區別

| 特性 | 一般圖 | 網格圖 |
|------|--------|--------|
| 表示方式 | 鄰接表、鄰接矩陣 | 二維陣列 |
| 節點數量 | 任意 | m × n |
| 邊的方向 | 任意 | 有規律（四向/八向） |
| 鄰居節點 | 需要顯式存儲 | 可以通過座標計算 |

## 四向移動與八向移動

### 四向移動（上下左右）

```cpp
// 方法 1: 使用方向陣列
const int dx[4] = {-1, 1, 0, 0};  // 上、下、左、右
const int dy[4] = {0, 0, -1, 1};

// 方法 2: 使用 pair
const vector<pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

// 遍歷所有鄰居
for (int i = 0; i < 4; i++) {
    int nx = x + dx[i];
    int ny = y + dy[i];
    // 處理鄰居節點
}
```

### 八向移動（包含對角線）

```cpp
const int dx[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
const int dy[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

// 或使用更清晰的表示
const vector<pair<int, int>> directions = {
    {-1, -1}, {-1, 0}, {-1, 1},  // 上方三個
    {0, -1},           {0, 1},    // 左右
    {1, -1},  {1, 0},  {1, 1}     // 下方三個
};
```

## 邊界檢查

在網格圖中，必須確保訪問的座標在合法範圍內：

```cpp
// 檢查座標是否合法
bool isValid(int x, int y, int m, int n) {
    return x >= 0 && x < m && y >= 0 && y < n;
}

// 或者使用 inline 函數
inline bool inBounds(int x, int y, int m, int n) {
    return x >= 0 && x < m && y >= 0 && y < n;
}
```

## Visited 數組

### 方法 1: 使用額外的 visited 陣列

```cpp
vector<vector<bool>> visited(m, vector<bool>(n, false));

void dfs(int x, int y) {
    if (!isValid(x, y, m, n) || visited[x][y]) {
        return;
    }
    visited[x][y] = true;
    // 處理當前節點

    // 遍歷鄰居
    for (int i = 0; i < 4; i++) {
        dfs(x + dx[i], y + dy[i]);
    }
}
```

### 方法 2: 原地標記（修改原陣列）

```cpp
void dfs(vector<vector<int>>& grid, int x, int y) {
    if (!isValid(x, y, m, n) || grid[x][y] == 0) {
        return;
    }

    grid[x][y] = 0;  // 標記為已訪問

    for (int i = 0; i < 4; i++) {
        dfs(grid, x + dx[i], y + dy[i]);
    }
}
```

### 方法 3: 使用特殊值標記

```cpp
void dfs(vector<vector<char>>& grid, int x, int y) {
    if (!isValid(x, y, m, n) || grid[x][y] != '1') {
        return;
    }

    grid[x][y] = '#';  // 使用特殊值標記已訪問

    for (int i = 0; i < 4; i++) {
        dfs(grid, x + dx[i], y + dy[i]);
    }
}
```

## 基本網格遍歷模板

### DFS 模板

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    bool isValid(int x, int y) {
        return x >= 0 && x < m && y >= 0 && y < n;
    }

    void dfs(vector<vector<int>>& grid, int x, int y) {
        // 邊界檢查和終止條件
        if (!isValid(x, y) || grid[x][y] == 0) {
            return;
        }

        // 標記為已訪問
        grid[x][y] = 0;

        // 處理當前節點
        // ...

        // 遍歷四個方向
        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];
            dfs(grid, nx, ny);
        }
    }

public:
    void solve(vector<vector<int>>& grid) {
        if (grid.empty()) return;
        m = grid.size();
        n = grid[0].size();

        // 遍歷所有格子
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dfs(grid, i, j);
                }
            }
        }
    }
};
```

### BFS 模板

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    bool isValid(int x, int y) {
        return x >= 0 && x < m && y >= 0 && y < n;
    }

    void bfs(vector<vector<int>>& grid, int startX, int startY) {
        queue<pair<int, int>> q;
        q.push({startX, startY});
        grid[startX][startY] = 0;  // 標記為已訪問

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            // 處理當前節點
            // ...

            // 遍歷四個方向
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (isValid(nx, ny) && grid[nx][ny] == 1) {
                    grid[nx][ny] = 0;  // 標記為已訪問
                    q.push({nx, ny});
                }
            }
        }
    }

public:
    void solve(vector<vector<int>>& grid) {
        if (grid.empty()) return;
        m = grid.size();
        n = grid[0].size();

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    bfs(grid, i, j);
                }
            }
        }
    }
};
```

## 常見技巧

### 1. 座標轉換

將二維座標轉換為一維索引（用於 Union-Find）：

```cpp
int toIndex(int x, int y, int n) {
    return x * n + y;
}

pair<int, int> toCoord(int index, int n) {
    return {index / n, index % n};
}
```

### 2. 層序遍歷（計算距離）

```cpp
void bfs(vector<vector<int>>& grid, int startX, int startY) {
    queue<pair<int, int>> q;
    q.push({startX, startY});
    int distance = 0;

    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [x, y] = q.front();
            q.pop();

            // 當前層的所有節點距離都是 distance

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

### 3. 多源 BFS

```cpp
void multiSourceBFS(vector<vector<int>>& grid) {
    queue<pair<int, int>> q;

    // 將所有源點加入隊列
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == SOURCE) {
                q.push({i, j});
            }
        }
    }

    // 標準 BFS
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();

        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];
            if (isValid(nx, ny) && !visited[nx][ny]) {
                visited[nx][ny] = true;
                q.push({nx, ny});
            }
        }
    }
}
```

## 時間與空間複雜度

對於 m × n 的網格圖：

- **時間複雜度**：O(m × n)，每個格子最多訪問一次
- **空間複雜度**：
  - DFS：O(m × n)，遞迴堆疊最壞情況
  - BFS：O(min(m, n))，隊列最多存儲一層的節點
  - Visited 陣列：O(m × n)

## 小結

網格圖是一種特殊但常見的圖結構，掌握以下要點：

1. **方向陣列**：使用 dx, dy 陣列簡化代碼
2. **邊界檢查**：確保座標合法
3. **訪問標記**：避免重複訪問
4. **DFS vs BFS**：根據題目選擇合適的遍歷方式
5. **模板化**：熟練掌握基本模板，靈活應用

接下來的章節將深入探討網格圖的各種應用場景。
