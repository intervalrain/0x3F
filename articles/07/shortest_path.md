---
title: "最短路徑 (Shortest Path)"
order: 4
---

# 最短路徑 (Shortest Path)

網格圖的最短路徑問題是圖論中的經典問題。根據邊的權重不同，需要使用不同的算法：

- **無權圖或等權圖**：BFS
- **帶權圖（非負權重）**：Dijkstra
- **帶權圖（可能有負權重）**：Bellman-Ford（網格圖中較少見）

## BFS 求最短路徑

### 原理

在無權圖或等權圖中，BFS 保證第一次到達目標點時的路徑就是最短路徑。

### 模板

```cpp
int bfs(vector<vector<int>>& grid, int startX, int startY, int endX, int endY) {
    int m = grid.size(), n = grid[0].size();
    queue<pair<int, int>> q;
    vector<vector<bool>> visited(m, vector<bool>(n, false));

    q.push({startX, startY});
    visited[startX][startY] = true;

    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};

    int distance = 0;

    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [x, y] = q.front();
            q.pop();

            // 到達終點
            if (x == endX && y == endY) {
                return distance;
            }

            // 四個方向
            for (int d = 0; d < 4; d++) {
                int nx = x + dx[d];
                int ny = y + dy[d];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    !visited[nx][ny] && grid[nx][ny] != OBSTACLE) {
                    visited[nx][ny] = true;
                    q.push({nx, ny});
                }
            }
        }
        distance++;
    }

    return -1;  // 無法到達
}
```

---

## LeetCode 1091: Shortest Path in Binary Matrix

### 題目描述

在 n×n 的二進制矩陣中，找到從左上角 (0, 0) 到右下角 (n-1, n-1) 的最短路徑長度。只能經過值為 0 的格子，可以沿八個方向移動。

**範例**：
```
輸入: grid = [
  [0,0,0],
  [1,1,0],
  [1,1,0]
]
輸出: 4
路徑: (0,0) → (0,1) → (0,2) → (1,2) → (2,2)
```

### 解法：BFS

```cpp
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();

        // 起點或終點被阻擋
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) {
            return -1;
        }

        // 八個方向
        const int dx[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
        const int dy[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

        queue<pair<int, int>> q;
        q.push({0, 0});
        grid[0][0] = 1;  // 標記為已訪問（複用 grid）

        int pathLength = 1;

        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                auto [x, y] = q.front();
                q.pop();

                // 到達終點
                if (x == n - 1 && y == n - 1) {
                    return pathLength;
                }

                // 八個方向
                for (int d = 0; d < 8; d++) {
                    int nx = x + dx[d];
                    int ny = y + dy[d];

                    if (nx >= 0 && nx < n && ny >= 0 && ny < n &&
                        grid[nx][ny] == 0) {
                        grid[nx][ny] = 1;
                        q.push({nx, ny});
                    }
                }
            }
            pathLength++;
        }

        return -1;
    }
};
```

### 優化：提前終止

```cpp
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
        if (n == 1) return 1;  // 特殊情況

        const int dx[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
        const int dy[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

        queue<tuple<int, int, int>> q;  // (x, y, distance)
        q.push({0, 0, 1});
        grid[0][0] = 1;

        while (!q.empty()) {
            auto [x, y, dist] = q.front();
            q.pop();

            for (int d = 0; d < 8; d++) {
                int nx = x + dx[d];
                int ny = y + dy[d];

                if (nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] == 0) {
                    // 到達終點
                    if (nx == n - 1 && ny == n - 1) {
                        return dist + 1;
                    }

                    grid[nx][ny] = 1;
                    q.push({nx, ny, dist + 1});
                }
            }
        }

        return -1;
    }
};
```

**時間複雜度**：O(n²)
**空間複雜度**：O(n²)

---

## Dijkstra 算法

### 原理

Dijkstra 用於求解**非負權重圖**的單源最短路徑。核心思想：
1. 維護每個點的最短距離估計值
2. 每次選擇距離最小的未訪問節點
3. 更新其鄰居的距離（鬆弛操作）

### 模板

```cpp
int dijkstra(vector<vector<int>>& grid, int startX, int startY, int endX, int endY) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, INT_MAX));

    // 優先隊列：{距離, {x, y}}
    priority_queue<pair<int, pair<int, int>>,
                   vector<pair<int, pair<int, int>>>,
                   greater<>> pq;

    dist[startX][startY] = 0;
    pq.push({0, {startX, startY}});

    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};

    while (!pq.empty()) {
        auto [d, pos] = pq.top();
        pq.pop();
        auto [x, y] = pos;

        // 到達終點
        if (x == endX && y == endY) {
            return d;
        }

        // 如果當前距離已過時，跳過
        if (d > dist[x][y]) {
            continue;
        }

        // 遍歷鄰居
        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];

            if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                int newDist = d + getWeight(grid, x, y, nx, ny);

                // 鬆弛操作
                if (newDist < dist[nx][ny]) {
                    dist[nx][ny] = newDist;
                    pq.push({newDist, {nx, ny}});
                }
            }
        }
    }

    return -1;
}
```

---

## LeetCode 1631: Path With Minimum Effort

### 題目描述

給定一個二維數組 heights，每個格子的值代表高度。從左上角走到右下角，路徑的「努力值」定義為路徑中相鄰格子高度差的絕對值的最大值。求最小努力值。

**範例**：
```
輸入: heights = [
  [1,2,2],
  [3,8,2],
  [5,3,5]
]
輸出: 2
解釋: 路徑 [1,3,5,3,5] 的最大高度差為 2
```

### 思路

這是一個變形的最短路徑問題：
- **邊的權重**：相鄰格子的高度差
- **目標**：最小化路徑上的最大權重

可以使用 Dijkstra，但需要修改：
- 距離定義為「從起點到當前點的最大高度差」
- 更新鄰居時，取 max(當前最大高度差, 到鄰居的高度差)

### 解法：Dijkstra 變形

```cpp
class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();

        // dist[i][j] 表示從起點到 (i,j) 的最小努力值
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));

        // 優先隊列：{努力值, {x, y}}
        priority_queue<pair<int, pair<int, int>>,
                       vector<pair<int, pair<int, int>>>,
                       greater<>> pq;

        dist[0][0] = 0;
        pq.push({0, {0, 0}});

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!pq.empty()) {
            auto [effort, pos] = pq.top();
            pq.pop();
            auto [x, y] = pos;

            // 到達終點
            if (x == m - 1 && y == n - 1) {
                return effort;
            }

            // 如果當前努力值已過時，跳過
            if (effort > dist[x][y]) {
                continue;
            }

            // 遍歷四個方向
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    // 計算到鄰居的努力值
                    int heightDiff = abs(heights[nx][ny] - heights[x][y]);
                    int newEffort = max(effort, heightDiff);

                    // 更新最小努力值
                    if (newEffort < dist[nx][ny]) {
                        dist[nx][ny] = newEffort;
                        pq.push({newEffort, {nx, ny}});
                    }
                }
            }
        }

        return 0;
    }
};
```

### 解法 2：二分搜索 + BFS

可以二分搜索答案（努力值），對於每個候選值，用 BFS/DFS 檢查是否能到達終點。

```cpp
class Solution {
private:
    bool canReach(vector<vector<int>>& heights, int maxEffort) {
        int m = heights.size(), n = heights[0].size();
        vector<vector<bool>> visited(m, vector<bool>(n, false));

        queue<pair<int, int>> q;
        q.push({0, 0});
        visited[0][0] = true;

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            if (x == m - 1 && y == n - 1) {
                return true;
            }

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    !visited[nx][ny]) {
                    int diff = abs(heights[nx][ny] - heights[x][y]);
                    if (diff <= maxEffort) {
                        visited[nx][ny] = true;
                        q.push({nx, ny});
                    }
                }
            }
        }

        return false;
    }

public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int left = 0, right = 1000000;
        int result = right;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canReach(heights, mid)) {
                result = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return result;
    }
};
```

**時間複雜度**：
- Dijkstra：O(m × n × log(m × n))
- 二分 + BFS：O(log(MAX) × m × n)

**空間複雜度**：O(m × n)

---

## LeetCode 1102: Path With Maximum Minimum Value

### 題目描述

給定一個整數矩陣 grid，找到一條從左上角到右下角的路徑，使得路徑上的最小值最大。

**範例**：
```
輸入: grid = [
  [5,4,5],
  [1,2,6],
  [7,4,6]
]
輸出: 4
解釋: 路徑 5→4→5→6→6 的最小值為 4
```

### 思路

這是一個**最大化最小值**的問題，可以使用：
1. **Dijkstra 變形**：維護路徑上的最小值，選擇最小值最大的路徑
2. **二分搜索 + BFS**：二分答案，檢查是否存在所有值 ≥ mid 的路徑

### 解法：Dijkstra 變形

```cpp
class Solution {
public:
    int maximumMinimumPath(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();

        // maxMin[i][j] 表示從起點到 (i,j) 的路徑最小值的最大值
        vector<vector<int>> maxMin(m, vector<int>(n, -1));

        // 優先隊列：{最小值, {x, y}}，按最小值降序排列
        priority_queue<pair<int, pair<int, int>>> pq;

        maxMin[0][0] = grid[0][0];
        pq.push({grid[0][0], {0, 0}});

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!pq.empty()) {
            auto [minVal, pos] = pq.top();
            pq.pop();
            auto [x, y] = pos;

            // 到達終點
            if (x == m - 1 && y == n - 1) {
                return minVal;
            }

            // 如果當前值已過時，跳過
            if (minVal < maxMin[x][y]) {
                continue;
            }

            // 遍歷四個方向
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    // 計算新路徑的最小值
                    int newMin = min(minVal, grid[nx][ny]);

                    // 如果找到更好的路徑
                    if (newMin > maxMin[nx][ny]) {
                        maxMin[nx][ny] = newMin;
                        pq.push({newMin, {nx, ny}});
                    }
                }
            }
        }

        return -1;
    }
};
```

### 解法 2：二分搜索 + BFS

```cpp
class Solution {
private:
    bool canReach(vector<vector<int>>& grid, int minValue) {
        int m = grid.size(), n = grid[0].size();

        // 起點值不夠大
        if (grid[0][0] < minValue) {
            return false;
        }

        vector<vector<bool>> visited(m, vector<bool>(n, false));
        queue<pair<int, int>> q;
        q.push({0, 0});
        visited[0][0] = true;

        const int dx[4] = {-1, 1, 0, 0};
        const int dy[4] = {0, 0, -1, 1};

        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();

            if (x == m - 1 && y == n - 1) {
                return true;
            }

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    !visited[nx][ny] && grid[nx][ny] >= minValue) {
                    visited[nx][ny] = true;
                    q.push({nx, ny});
                }
            }
        }

        return false;
    }

public:
    int maximumMinimumPath(vector<vector<int>>& grid) {
        int left = 0, right = min(grid[0][0], grid.back().back());
        int result = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canReach(grid, mid)) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }
};
```

**時間複雜度**：
- Dijkstra：O(m × n × log(m × n))
- 二分 + BFS：O(log(MAX) × m × n)

**空間複雜度**：O(m × n)

---

## LeetCode 787: Cheapest Flights Within K Stops

### 題目描述

有 n 個城市，通過航班連接。給定航班 [from, to, price]，求從 src 到 dst 最多經過 k 次中轉的最便宜價格。

**範例**：
```
輸入: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],
      src = 0, dst = 3, k = 1
輸出: 700
解釋: 0 → 1 → 3，價格為 100 + 600 = 700
```

### 思路

這不是網格圖，但是最短路徑的經典問題。可以使用：
1. **Bellman-Ford**：允許最多 k+1 次鬆弛
2. **Dijkstra 變形**：狀態包含 (城市, 剩餘中轉次數)

### 解法：Bellman-Ford

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        const int INF = 1e9;
        vector<int> dist(n, INF);
        dist[src] = 0;

        // 最多 k+1 次鬆弛（k 次中轉 = k+1 條邊）
        for (int i = 0; i <= k; i++) {
            vector<int> temp = dist;

            for (const auto& flight : flights) {
                int from = flight[0];
                int to = flight[1];
                int price = flight[2];

                if (dist[from] != INF) {
                    temp[to] = min(temp[to], dist[from] + price);
                }
            }

            dist = temp;
        }

        return dist[dst] == INF ? -1 : dist[dst];
    }
};
```

### 解法 2：Dijkstra + 狀態

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // 構建鄰接表
        vector<vector<pair<int, int>>> graph(n);
        for (const auto& f : flights) {
            graph[f[0]].push_back({f[1], f[2]});  // {to, price}
        }

        // 優先隊列：{價格, {城市, 剩餘中轉次數}}
        priority_queue<tuple<int, int, int>,
                       vector<tuple<int, int, int>>,
                       greater<>> pq;

        pq.push({0, src, k + 1});  // k 次中轉 = k+1 條邊

        // visited[city][stops] 表示到達 city 用 stops 步時的最低價格
        vector<vector<int>> visited(n, vector<int>(k + 2, INT_MAX));

        while (!pq.empty()) {
            auto [price, city, stops] = pq.top();
            pq.pop();

            if (city == dst) {
                return price;
            }

            if (stops == 0) {
                continue;
            }

            if (price > visited[city][stops]) {
                continue;
            }

            for (auto [nextCity, cost] : graph[city]) {
                int newPrice = price + cost;
                if (newPrice < visited[nextCity][stops - 1]) {
                    visited[nextCity][stops - 1] = newPrice;
                    pq.push({newPrice, nextCity, stops - 1});
                }
            }
        }

        return -1;
    }
};
```

**時間複雜度**：
- Bellman-Ford：O(k × E)
- Dijkstra：O(E × k × log(E × k))

**空間複雜度**：O(n × k)

---

## 總結

### 算法選擇

| 場景 | 推薦算法 | 時間複雜度 |
|------|---------|-----------|
| 無權圖 | BFS | O(V + E) |
| 等權圖 | BFS | O(V + E) |
| 非負權重 | Dijkstra | O(E log V) |
| 有負權重 | Bellman-Ford | O(VE) |
| 最大化最小值 | Dijkstra 變形 | O(E log V) |
| 有約束條件 | Dijkstra + 狀態 | O(E × S × log(V × S)) |

### Dijkstra 變形技巧

1. **最小化最大值**：維護路徑上的最大值，選擇最大值最小的
2. **最大化最小值**：維護路徑上的最小值，選擇最小值最大的
3. **帶約束**：狀態包含位置 + 約束（如剩餘步數）
4. **多目標**：使用多維距離數組

### 優化技巧

1. **提前終止**：到達目標時立即返回
2. **雙向搜索**：從起點和終點同時搜索
3. **A* 算法**：使用啟發式函數（如曼哈頓距離）
4. **二分搜索**：將最優化問題轉為判定問題

### 實現細節

1. **優先隊列**：使用 `priority_queue<pair<int, pair<int, int>>>`
2. **去重**：檢查距離是否已過時
3. **狀態表示**：根據問題定義合適的狀態
4. **邊界處理**：注意起點和終點的特殊情況
