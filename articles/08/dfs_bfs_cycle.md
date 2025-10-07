---
title: "DFS/BFS 與環檢測"
order: 1
description: "深度優先搜尋、廣度優先搜尋與圖的環檢測"
tags: ["graph", "DFS", "BFS", "cycle detection"]
---

# DFS/BFS 與環檢測

圖的遍歷是圖論中最基本也最重要的操作。本章將介紹兩種主要的遍歷方法：深度優先搜尋 (DFS) 和廣度優先搜尋 (BFS)，以及如何使用它們來檢測圖中的環。

## 深度優先搜尋 (DFS)

DFS 沿著一條路徑盡可能深入，直到無法繼續時回溯。

### DFS 特性

- **策略**：一直往深處走，走不通再回頭
- **數據結構**：Stack（或遞迴調用棧）
- **應用**：路徑搜尋、環檢測、拓撲排序、連通分量

### DFS 實現方式

#### 1. 遞迴版本（推薦）

```cpp
class Solution {
private:
    void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
        visited[node] = true;
        cout << node << " ";  // 處理當前節點

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor, adj, visited);
            }
        }
    }

public:
    void traverseGraph(vector<vector<int>>& adj) {
        int n = adj.size();
        vector<bool> visited(n, false);

        // 處理所有連通分量
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, adj, visited);
            }
        }
    }
};
```

#### 2. 迭代版本（使用 Stack）

```cpp
void dfsIterative(int start, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    stack<int> stk;

    stk.push(start);

    while (!stk.empty()) {
        int node = stk.top();
        stk.pop();

        if (visited[node]) continue;
        visited[node] = true;

        cout << node << " ";  // 處理當前節點

        // 注意：為了與遞迴版本順序一致，反向加入鄰居
        for (int i = adj[node].size() - 1; i >= 0; i--) {
            int neighbor = adj[node][i];
            if (!visited[neighbor]) {
                stk.push(neighbor);
            }
        }
    }
}
```

### DFS 遍歷順序範例

```
圖結構：
    0
   / \
  1   2
 /   / \
3   4   5

DFS 從 0 開始：0 -> 1 -> 3 -> 2 -> 4 -> 5
（先深入左子樹，再回到右子樹）
```

## 廣度優先搜尋 (BFS)

BFS 逐層遍歷，先訪問距離起點近的節點。

### BFS 特性

- **策略**：一層一層向外擴散
- **數據結構**：Queue
- **應用**：最短路徑（無權圖）、層級遍歷、最短步數

### BFS 實現

```cpp
void bfs(int start, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;

    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        cout << node << " ";  // 處理當前節點

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

### BFS 層級遍歷（記錄距離）

```cpp
vector<int> bfsWithDistance(int start, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> dist(n, -1);  // -1 表示未訪問
    queue<int> q;

    q.push(start);
    dist[start] = 0;

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        for (int neighbor : adj[node]) {
            if (dist[neighbor] == -1) {  // 未訪問
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }

    return dist;  // 返回從 start 到各點的最短距離
}
```

### BFS 遍歷順序範例

```
圖結構：
    0
   / \
  1   2
 /   / \
3   4   5

BFS 從 0 開始：0 -> 1 -> 2 -> 3 -> 4 -> 5
（按層級：0 | 1,2 | 3,4,5）
```

## DFS vs BFS 比較

| 特性 | DFS | BFS |
|------|-----|-----|
| 數據結構 | Stack / 遞迴 | Queue |
| 空間複雜度 | O(h)，h 為深度 | O(w)，w 為寬度 |
| 時間複雜度 | O(V + E) | O(V + E) |
| 最短路徑 | 不保證 | 保證（無權圖） |
| 適用場景 | 路徑存在性、拓撲排序 | 最短路徑、層級問題 |

## 環檢測 (Cycle Detection)

環檢測是判斷圖中是否存在環的問題。無向圖和有向圖的檢測方法不同。

### 無向圖環檢測

使用 DFS，記錄父節點以避免回到來的方向。

```cpp
class Solution {
private:
    bool hasCycleDFS(int node, int parent, vector<vector<int>>& adj,
                     vector<bool>& visited) {
        visited[node] = true;

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                if (hasCycleDFS(neighbor, node, adj, visited)) {
                    return true;
                }
            } else if (neighbor != parent) {
                // 訪問到已訪問的節點，且不是父節點 => 有環
                return true;
            }
        }

        return false;
    }

public:
    bool hasCycle(int n, vector<vector<int>>& adj) {
        vector<bool> visited(n, false);

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                if (hasCycleDFS(i, -1, adj, visited)) {
                    return true;
                }
            }
        }

        return false;
    }
};
```

**原理**：
- 如果 DFS 過程中遇到已訪問的節點，且該節點不是父節點，則存在環
- 需要記錄父節點，避免誤判（因為無向圖的邊是雙向的）

```
範例：檢測環

無環：          有環：
0 - 1          0 - 1
|              | \ |
2              2 - 3

無環情況：0 -> 1，回到 0（但 0 是 1 的父節點，不算環）
有環情況：0 -> 1 -> 3 -> 0（0 不是 3 的父節點，存在環）
```

### 有向圖環檢測（三色標記法）

使用三種狀態（顏色）：
- **白色 (0)**：未訪問
- **灰色 (1)**：正在訪問（在當前 DFS 路徑上）
- **黑色 (2)**：已完成訪問

```cpp
class Solution {
private:
    // 0: 白色（未訪問）
    // 1: 灰色（正在訪問）
    // 2: 黑色（已完成）
    bool hasCycleDFS(int node, vector<vector<int>>& adj, vector<int>& color) {
        color[node] = 1;  // 標記為灰色

        for (int neighbor : adj[node]) {
            if (color[neighbor] == 1) {
                // 遇到灰色節點 => 回邊 => 有環
                return true;
            }
            if (color[neighbor] == 0) {
                if (hasCycleDFS(neighbor, adj, color)) {
                    return true;
                }
            }
            // 黑色節點（已完成）不需要處理
        }

        color[node] = 2;  // 標記為黑色
        return false;
    }

public:
    bool hasCycle(int n, vector<vector<int>>& adj) {
        vector<int> color(n, 0);  // 初始化為白色

        for (int i = 0; i < n; i++) {
            if (color[i] == 0) {
                if (hasCycleDFS(i, adj, color)) {
                    return true;
                }
            }
        }

        return false;
    }
};
```

**原理**：
- **灰色**：節點在當前 DFS 遞迴路徑上
- 如果遇到灰色節點，表示有回邊（back edge），存在環
- 黑色節點表示該節點及其所有後代都已處理完，不會形成環

```
範例：有向圖環檢測

有環：
0 -> 1
^    |
|    v
3 <- 2

DFS: 0(灰) -> 1(灰) -> 2(灰) -> 3(灰) -> 0(灰)
遇到灰色的 0 => 有環
```

## LeetCode 題目詳解

### 1. [797. All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/)

**題目**：給定有向無環圖，找出從節點 0 到節點 n-1 的所有路徑。

**解法**：DFS + 回溯

```cpp
class Solution {
private:
    void dfs(int node, int target, vector<vector<int>>& graph,
             vector<int>& path, vector<vector<int>>& result) {
        path.push_back(node);

        if (node == target) {
            result.push_back(path);
        } else {
            for (int neighbor : graph[node]) {
                dfs(neighbor, target, graph, path, result);
            }
        }

        path.pop_back();  // 回溯
    }

public:
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
        vector<vector<int>> result;
        vector<int> path;
        int n = graph.size();
        dfs(0, n - 1, graph, path, result);
        return result;
    }
};
```

**複雜度**：
- 時間：O(2^V * V)，最壞情況下有 2^V 條路徑
- 空間：O(V)，遞迴深度

### 2. [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

**題目**：判斷課程依賴關係是否有環（能否完成所有課程）。

**解法**：有向圖環檢測

```cpp
class Solution {
private:
    bool hasCycle(int node, vector<vector<int>>& adj, vector<int>& color) {
        color[node] = 1;  // 灰色

        for (int neighbor : adj[node]) {
            if (color[neighbor] == 1) return true;  // 有環
            if (color[neighbor] == 0) {
                if (hasCycle(neighbor, adj, color)) return true;
            }
        }

        color[node] = 2;  // 黑色
        return false;
    }

public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);

        // 建圖：a -> b 表示要先修 a 才能修 b
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
        }

        vector<int> color(numCourses, 0);

        for (int i = 0; i < numCourses; i++) {
            if (color[i] == 0) {
                if (hasCycle(i, adj, color)) {
                    return false;  // 有環，無法完成
                }
            }
        }

        return true;  // 無環，可以完成
    }
};
```

**複雜度**：
- 時間：O(V + E)
- 空間：O(V + E)

### 3. [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**題目**：返回課程的修課順序（拓撲排序）。

**解法**：DFS + 後序遍歷

```cpp
class Solution {
private:
    bool dfs(int node, vector<vector<int>>& adj, vector<int>& color,
             vector<int>& result) {
        color[node] = 1;

        for (int neighbor : adj[node]) {
            if (color[neighbor] == 1) return false;  // 有環
            if (color[neighbor] == 0) {
                if (!dfs(neighbor, adj, color, result)) return false;
            }
        }

        color[node] = 2;
        result.push_back(node);  // 後序位置加入結果
        return true;
    }

public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);

        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
        }

        vector<int> color(numCourses, 0);
        vector<int> result;

        for (int i = 0; i < numCourses; i++) {
            if (color[i] == 0) {
                if (!dfs(i, adj, color, result)) {
                    return {};  // 有環
                }
            }
        }

        reverse(result.begin(), result.end());  // 反轉得到拓撲順序
        return result;
    }
};
```

### 4. [261. Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)

**題目**：判斷無向圖是否為樹。

**條件**：
1. 無環
2. 連通（所有節點連在一起）
3. n 個節點恰好有 n-1 條邊

```cpp
class Solution {
private:
    bool hasCycle(int node, int parent, vector<vector<int>>& adj,
                  vector<bool>& visited) {
        visited[node] = true;

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                if (hasCycle(neighbor, node, adj, visited)) {
                    return true;
                }
            } else if (neighbor != parent) {
                return true;  // 有環
            }
        }

        return false;
    }

public:
    bool validTree(int n, vector<vector<int>>& edges) {
        // 樹的性質：n 個節點有 n-1 條邊
        if (edges.size() != n - 1) return false;

        // 建圖
        vector<vector<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }

        vector<bool> visited(n, false);

        // 檢查環
        if (hasCycle(0, -1, adj, visited)) {
            return false;
        }

        // 檢查連通性（所有節點都被訪問）
        for (int i = 0; i < n; i++) {
            if (!visited[i]) return false;
        }

        return true;
    }
};
```

**複雜度**：
- 時間：O(V + E)
- 空間：O(V + E)

## 常見陷阱與技巧

### 陷阱

1. **無向圖 DFS 忘記記錄父節點**
   - 錯誤：任何已訪問節點都當作環
   - 正確：排除父節點再判斷

2. **有向圖環檢測使用 visited 陣列**
   - 錯誤：只用布林 visited 無法區分「當前路徑」和「其他路徑」
   - 正確：使用三色標記法

3. **BFS 忘記在入隊時標記 visited**
   - 錯誤：在出隊時標記，導致重複入隊
   - 正確：入隊時立即標記

4. **混淆 DFS 和 BFS 的應用場景**
   - DFS：不需要最短路徑時使用（更省空間）
   - BFS：需要最短步數/層級時使用

### 進階技巧

1. **DFS 記錄路徑時使用回溯**
   ```cpp
   path.push_back(node);
   dfs(neighbor);
   path.pop_back();  // 回溯
   ```

2. **BFS 記錄層級**
   ```cpp
   int level = 0;
   while (!q.empty()) {
       int size = q.size();
       for (int i = 0; i < size; i++) {
           // 處理當前層
       }
       level++;
   }
   ```

3. **環檢測的優化（Union Find）**
   - 無向圖環檢測也可用 Union Find
   - 時間複雜度近似 O(E)

## 總結

| 演算法 | 時間複雜度 | 空間複雜度 | 應用 |
|--------|-----------|-----------|------|
| DFS | O(V + E) | O(V) | 路徑、環、拓撲排序 |
| BFS | O(V + E) | O(V) | 最短路徑、層級遍歷 |
| 無向圖環檢測 | O(V + E) | O(V) | 判斷樹、連通性 |
| 有向圖環檢測 | O(V + E) | O(V) | 依賴關係、死鎖 |

**選擇建議**：
- 需要最短路徑 → BFS
- 需要所有路徑 → DFS + 回溯
- 檢測環 → DFS + 顏色標記
- 層級問題 → BFS

下一章我們將學習 Union Find，另一種解決連通性和環檢測的高效方法。
