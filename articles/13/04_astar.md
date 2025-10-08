---
title: 13-4. A* 算法
order: 4
description: A* 啟發式搜索：貪心與最短路徑的結合
tags:
  - greedy
  - shortest-path
  - heuristic
  - advanced
author: Rain Hu
date: ''
draft: true
---

# 4. A* 算法 (**)

**註**：本章為進階主題，重點在於概念理解和基本應用。A* 算法結合了貪心法的局部最優選擇和最短路徑算法的全局最優保證。

## 什麼是 A* 算法？

**A* (A-Star)** 是一種啟發式搜索算法，用於在圖中找到從起點到終點的最短路徑。它是 Dijkstra 算法的改進版本，通過引入啟發函數來加速搜索。

### 核心思想

**評估函數**：
```
f(n) = g(n) + h(n)

其中：
- g(n): 從起點到節點 n 的實際代價（已知）
- h(n): 從節點 n 到終點的估計代價（啟發函數）
- f(n): 節點 n 的總估計代價
```

**貪心策略**：每次選擇 f(n) 最小的節點進行擴展。

## A* vs Dijkstra vs BFS

| 算法 | 評估函數 | 特點 | 適用場景 |
|------|----------|------|----------|
| BFS | - | 無權圖最短路 | 無權圖 |
| Dijkstra | g(n) | 已知代價 | 非負權圖 |
| A* | g(n) + h(n) | 已知 + 估計 | 有明確目標的路徑搜索 |

### 關係

```
BFS ⊂ Dijkstra ⊂ A*

- BFS 是 Dijkstra 的特例（所有邊權重為 1）
- Dijkstra 是 A* 的特例（h(n) = 0）
```

## 啟發函數 h(n)

啟發函數是 A* 的核心，它估計從當前節點到目標的代價。

### 可接納性 (Admissibility)

**定義**：h(n) 必須不高估實際代價，即：
```
h(n) ≤ h*(n)

其中 h*(n) 是從 n 到目標的真實最短距離
```

**重要性**：可接納的啟發函數保證 A* 找到最優解。

### 一致性 (Consistency)

**定義**：對於任意節點 n 和其後繼 n'：
```
h(n) ≤ cost(n, n') + h(n')
```

這類似於三角不等式。一致性保證每個節點只需訪問一次。

### 常見啟發函數

#### 1. 曼哈頓距離 (Manhattan Distance)

**適用**：網格圖，只能上下左右移動

```cpp
int manhattanDistance(pair<int,int> a, pair<int,int> b) {
    return abs(a.first - b.first) + abs(a.second - b.second);
}
```

**視覺化**：
```
從 A 到 B 的曼哈頓距離 = |x₁-x₂| + |y₁-y₂|

A . . . .
. . . . .
. . . . B

距離 = |0-4| + |0-2| = 4 + 2 = 6
```

#### 2. 歐幾里得距離 (Euclidean Distance)

**適用**：可以任意方向移動

```cpp
double euclideanDistance(pair<int,int> a, pair<int,int> b) {
    int dx = a.first - b.first;
    int dy = a.second - b.second;
    return sqrt(dx*dx + dy*dy);
}
```

#### 3. 對角距離 (Chebyshev Distance)

**適用**：可以對角移動（8個方向）

```cpp
int chebyshevDistance(pair<int,int> a, pair<int,int> b) {
    return max(abs(a.first - b.first),
               abs(a.second - b.second));
}
```

#### 4. 對角距離優化版

**適用**：對角移動代價為 √2，直線移動代價為 1

```cpp
double diagonalDistance(pair<int,int> a, pair<int,int> b) {
    int dx = abs(a.first - b.first);
    int dy = abs(a.second - b.second);
    return (dx + dy) + (sqrt(2) - 2) * min(dx, dy);
}
```

## A* 算法實現

### 基本結構

```cpp
struct Node {
    int x, y;           // 坐標
    int g;              // 從起點到此點的實際代價
    int h;              // 從此點到終點的估計代價
    int f;              // f = g + h

    Node(int x, int y, int g, int h)
        : x(x), y(y), g(g), h(h), f(g + h) {}

    // 優先隊列需要：f 小的優先
    bool operator>(const Node& other) const {
        return f > other.f;
    }
};
```

### 完整實現

```cpp
class AStar {
private:
    // 計算曼哈頓距離
    int heuristic(pair<int,int> a, pair<int,int> b) {
        return abs(a.first - b.first) + abs(a.second - b.second);
    }

public:
    int shortestPath(vector<vector<int>>& grid,
                    pair<int,int> start,
                    pair<int,int> target) {
        int m = grid.size(), n = grid[0].size();

        // 優先隊列：f 值小的優先
        priority_queue<Node, vector<Node>, greater<Node>> pq;

        // 記錄每個點的最小 g 值
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));

        // 起點
        int h = heuristic(start, target);
        pq.push(Node(start.first, start.second, 0, h));
        dist[start.first][start.second] = 0;

        // 四個方向
        int dx[] = {-1, 1, 0, 0};
        int dy[] = {0, 0, -1, 1};

        while (!pq.empty()) {
            Node curr = pq.top();
            pq.pop();

            // 到達目標
            if (curr.x == target.first && curr.y == target.second) {
                return curr.g;
            }

            // 如果當前 g 值不是最優，跳過
            if (curr.g > dist[curr.x][curr.y]) {
                continue;
            }

            // 擴展鄰居
            for (int i = 0; i < 4; i++) {
                int nx = curr.x + dx[i];
                int ny = curr.y + dy[i];

                // 邊界檢查
                if (nx < 0 || nx >= m || ny < 0 || ny >= n) {
                    continue;
                }

                // 障礙物檢查
                if (grid[nx][ny] == 1) {
                    continue;
                }

                int newG = curr.g + 1;  // 假設每步代價為 1

                // 如果找到更短路徑
                if (newG < dist[nx][ny]) {
                    dist[nx][ny] = newG;
                    int h = heuristic({nx, ny}, target);
                    pq.push(Node(nx, ny, newG, h));
                }
            }
        }

        return -1;  // 無法到達
    }
};
```

## 視覺化示例

```
網格（0 是通路，1 是障礙）：
S . . 1 .
. 1 . 1 .
. . . . .
1 1 1 . .
. . . . T

S = (0,0), T = (4,4)

A* 搜索過程（使用曼哈頓距離）：

起點 S(0,0):
  g=0, h=8, f=8

展開 (0,0):
  → (0,1): g=1, h=7, f=8
  → (1,0): g=1, h=7, f=8

展開 (0,1):
  → (0,2): g=2, h=6, f=8

展開 (1,0):
  → (2,0): g=2, h=6, f=8

...（選擇 f 值最小的繼續展開）

最終找到路徑：
S → (0,1) → (0,2) → (1,2) → (2,2) → (2,3) → (2,4) → (3,4) → T

路徑長度：8
```

### A* vs Dijkstra 對比

```
Dijkstra 展開順序（無方向性）：
展開節點：按 g 值從小到大
擴散模式：以起點為中心的同心圓

●●●●●
●●●●●
●●S●●
●●●●●
●●●●●

A* 展開順序（有方向性）：
展開節點：按 f = g + h 從小到大
擴散模式：朝向目標的扇形

    ●●●
   ●●●●
  ●S●●●
 ●●●●●
●●●●T

A* 展開的節點更少！
```

## LeetCode 應用

### LeetCode 1091: Shortest Path in Binary Matrix

**題目**：在 n×n 的二進制矩陣中，找從左上角到右下角的最短路徑（可以 8 個方向移動）。

```cpp
class Solution {
private:
    // 對角距離（Chebyshev）
    int heuristic(int x, int y, int n) {
        return max(abs(x - (n-1)), abs(y - (n-1)));
    }

public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) {
            return -1;
        }

        // 優先隊列：{f, g, x, y}
        priority_queue<vector<int>, vector<vector<int>>,
                      greater<vector<int>>> pq;

        // 起點
        int h = heuristic(0, 0, n);
        pq.push({1 + h, 1, 0, 0});  // f, g, x, y

        vector<vector<int>> dist(n, vector<int>(n, INT_MAX));
        dist[0][0] = 1;

        // 8 個方向
        int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};
        int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};

        while (!pq.empty()) {
            auto curr = pq.top();
            pq.pop();

            int g = curr[1], x = curr[2], y = curr[3];

            // 到達終點
            if (x == n-1 && y == n-1) {
                return g;
            }

            // 如果不是最優，跳過
            if (g > dist[x][y]) {
                continue;
            }

            // 擴展 8 個方向
            for (int i = 0; i < 8; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx < 0 || nx >= n || ny < 0 || ny >= n) {
                    continue;
                }

                if (grid[nx][ny] == 1) {
                    continue;
                }

                int newG = g + 1;

                if (newG < dist[nx][ny]) {
                    dist[nx][ny] = newG;
                    int h = heuristic(nx, ny, n);
                    pq.push({newG + h, newG, nx, ny});
                }
            }
        }

        return -1;
    }
};
```

**時間複雜度**：O(n² log n)

**空間複雜度**：O(n²)

**LeetCode 連結**：https://leetcode.com/problems/shortest-path-in-binary-matrix/

### LeetCode 773: Sliding Puzzle

**題目**：滑動拼圖，求最少移動次數。

**分析**：狀態空間搜索，A* 比 BFS 更快。

**啟發函數**：曼哈頓距離（每個數字到目標位置的距離和）

```cpp
class Solution {
private:
    // 計算啟發函數：曼哈頓距離和
    int heuristic(string state) {
        int h = 0;
        for (int i = 0; i < 6; i++) {
            if (state[i] == '0') continue;

            int val = state[i] - '1';
            int targetX = val / 3, targetY = val % 3;
            int currX = i / 3, currY = i % 3;

            h += abs(targetX - currX) + abs(targetY - currY);
        }
        return h;
    }

public:
    int slidingPuzzle(vector<vector<int>>& board) {
        // 將 2D 板轉為字符串
        string start = "";
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 3; j++) {
                start += to_string(board[i][j]);
            }
        }

        string target = "123450";

        if (start == target) return 0;

        // 每個位置可以移動的方向
        vector<vector<int>> neighbors = {
            {1, 3},       // 位置 0
            {0, 2, 4},    // 位置 1
            {1, 5},       // 位置 2
            {0, 4},       // 位置 3
            {1, 3, 5},    // 位置 4
            {2, 4}        // 位置 5
        };

        // 優先隊列：{f, g, state}
        priority_queue<tuple<int,int,string>,
                      vector<tuple<int,int,string>>,
                      greater<tuple<int,int,string>>> pq;

        unordered_map<string, int> dist;

        int h = heuristic(start);
        pq.push({h, 0, start});
        dist[start] = 0;

        while (!pq.empty()) {
            auto [f, g, state] = pq.top();
            pq.pop();

            if (state == target) {
                return g;
            }

            if (g > dist[state]) {
                continue;
            }

            // 找到 0 的位置
            int zeroPos = state.find('0');

            // 嘗試移動
            for (int nextPos : neighbors[zeroPos]) {
                string nextState = state;
                swap(nextState[zeroPos], nextState[nextPos]);

                int newG = g + 1;

                if (dist.find(nextState) == dist.end() ||
                    newG < dist[nextState]) {
                    dist[nextState] = newG;
                    int h = heuristic(nextState);
                    pq.push({newG + h, newG, nextState});
                }
            }
        }

        return -1;
    }
};
```

**時間複雜度**：O(k log k)，k 是狀態數（最多 6! = 720）

**空間複雜度**：O(k)

**LeetCode 連結**：https://leetcode.com/problems/sliding-puzzle/

## A* 的優勢與局限

### 優勢

1. **更快**：比 Dijkstra 和 BFS 訪問更少的節點
2. **有方向性**：利用目標信息引導搜索
3. **最優性**：使用可接納啟發函數保證最優解
4. **靈活性**：可以調整啟發函數適應不同場景

### 局限

1. **需要好的啟發函數**：設計啟發函數可能困難
2. **內存開銷**：需要存儲所有訪問過的節點
3. **依賴目標**：必須有明確的目標節點
4. **圖結構限制**：不適合動態變化的圖

## 啟發函數設計原則

### 1. 可接納性 > 準確性

```
寧可低估，不要高估

✓ h(n) = 0（總是可接納，退化為 Dijkstra）
✓ h(n) = 曼哈頓距離（在網格中總是可接納）
✗ h(n) = 2 × 真實距離（高估，不保證最優）
```

### 2. 越準確越好（在可接納前提下）

```
h(n) 越接近真實距離，搜索越快

h(n) = 0           → 展開很多節點（Dijkstra）
h(n) = 真實距離/2   → 展開較少節點
h(n) = 真實距離     → 展開最少節點（理想情況）
```

### 3. 計算效率

```
h(n) 的計算應該很快

✓ 曼哈頓距離：O(1)
✓ 歐幾里得距離：O(1)
✗ 複雜的圖搜索：O(n)（太慢）
```

## 實際應用

### 1. 遊戲 AI

```
路徑規劃：
- 即時戰略遊戲（StarCraft）
- MOBA 遊戲（LOL, Dota）
- 第一人稱射擊（CS）

A* 用於 NPC 移動路徑規劃
```

### 2. 機器人導航

```
自動駕駛：
- 路徑規劃
- 避障
- 停車位搜索

使用 A* 找到最優路徑
```

### 3. 地圖導航

```
Google Maps, 百度地圖：
- 最短路徑
- 考慮交通狀況
- 多模式交通

A* 或其變體（如 D*）
```

## 常見陷阱與技巧

### 陷阱 1：啟發函數高估

```cpp
// 錯誤：高估距離
int h(int x, int y) {
    return 2 * manhattanDistance(x, y);  // 不可接納！
}

// 正確：不高估
int h(int x, int y) {
    return manhattanDistance(x, y);
}
```

### 陷阱 2：忘記檢查 g 值

```cpp
// 錯誤：重複處理相同節點
while (!pq.empty()) {
    auto curr = pq.top();
    pq.pop();
    // 直接處理，可能處理過時的節點
}

// 正確：檢查 g 值
while (!pq.empty()) {
    auto curr = pq.top();
    pq.pop();
    if (curr.g > dist[curr.x][curr.y]) {
        continue;  // 跳過過時的節點
    }
}
```

### 技巧 1：選擇合適的啟發函數

```cpp
// 網格 + 4方向 → 曼哈頓距離
// 網格 + 8方向 → 對角距離
// 自由移動 → 歐幾里得距離
```

### 技巧 2：提前終止

```cpp
// 到達目標立即返回
if (curr.x == target.x && curr.y == target.y) {
    return curr.g;  // 找到最優解
}
```

## 總結

### A* 核心概念

| 概念 | 說明 |
|------|------|
| f(n) = g(n) + h(n) | 評估函數 |
| g(n) | 已知的實際代價 |
| h(n) | 估計的剩餘代價 |
| 可接納性 | h(n) ≤ 真實距離 |
| 一致性 | h(n) ≤ cost(n,n') + h(n') |

### 與其他算法的關係

```
BFS: 無權圖，層次遍歷
Dijkstra: 非負權圖，f(n) = g(n)
A*: 帶啟發函數，f(n) = g(n) + h(n)
```

### LeetCode 題目總結

1. **1091. Shortest Path in Binary Matrix** - 網格最短路徑
2. **773. Sliding Puzzle** - 狀態空間搜索
3. **752. Open the Lock** - 可用 A* 優化的 BFS

### 學習建議

1. **理解原理**：明白為什麼 A* 比 Dijkstra 快
2. **啟發函數**：掌握常見啟發函數的設計
3. **可接納性**：理解為什麼需要可接納性
4. **實踐應用**：從簡單的網格問題開始
5. **對比分析**：與 BFS、Dijkstra 對比，理解優勢

A* 算法是貪心思想在路徑搜索中的經典應用，它結合了實際代價和估計代價，在保證最優性的同時大幅提高了搜索效率。雖然是進階主題,但理解其核心思想對於解決複雜的搜索問題非常有幫助。
