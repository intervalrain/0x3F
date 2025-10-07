---
title: "Union Find (Disjoint Set Union)"
order: 4
description: "並查集：高效處理集合合併與連通性問題"
tags: ["Union Find", "DSU", "Disjoint Set", "Connected Components"]
---

# Union Find (Disjoint Set Union)

## 核心概念

Union Find（並查集），也稱為 Disjoint Set Union (DSU)，是一種用於維護**互斥集合**（Disjoint Sets）的資料結構。

**核心功能**：
- `find(x)`：找到元素 x 所在集合的**代表元素**（根節點）
- `union(x, y)`：合併 x 和 y 所在的集合

**時間複雜度**：經過優化後，兩個操作都是 **O(α(n)) ≈ O(1)**，其中 α 是反阿克曼函數（增長極慢）。

---

## 一、基本原理

### 集合的樹狀表示

每個集合用一棵**樹**表示，樹的**根節點**是該集合的代表元素。

```
初始狀態（每個元素自成一個集合）：
    0   1   2   3   4
    ↑   ↑   ↑   ↑   ↑
   自己 自己 自己 自己 自己

合併 (0, 1):
      0
      ↑
      1   2   3   4

合併 (2, 3):
      0       2
      ↑       ↑
      1       3   4

合併 (0, 2):
        0
       ↗ ↖
      1   2
          ↑
          3   4
```

### 陣列表示

使用陣列 `parent[]` 存儲每個節點的父節點：

```
parent[i] = i 的父節點
parent[根節點] = 根節點自己
```

範例：
```
集合結構：
        0
       ↗ ↖
      1   2
          ↑
          3

陣列表示：
parent[0] = 0  （0 是根）
parent[1] = 0
parent[2] = 0
parent[3] = 2
```

---

## 二、基礎實現（無優化）

### 代碼

```cpp
class UnionFind {
private:
    vector<int> parent;

public:
    // 建構函數
    UnionFind(int n) {
        parent.resize(n);
        for (int i = 0; i < n; i++) {
            parent[i] = i;  // 每個元素自成一個集合
        }
    }

    // 查找根節點
    int find(int x) {
        while (parent[x] != x) {
            x = parent[x];
        }
        return x;
    }

    // 合併兩個集合
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX != rootY) {
            parent[rootX] = rootY;  // 將 x 的根指向 y 的根
        }
    }

    // 判斷是否在同一集合
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

### 複雜度分析

**最壞情況**：樹退化成鏈表

```
退化成鏈表的情況：
    0 ← 1 ← 2 ← 3 ← 4

find(4) 需要 O(n) 時間！
```

**時間複雜度**：
- `find`: O(n) 最壞情況
- `unite`: O(n)

**問題**：效率太低，需要優化！

---

## 三、優化 1：路徑壓縮（Path Compression）

### 核心思想

在 `find(x)` 過程中，將路徑上的所有節點**直接連到根節點**。

### 圖解

```
查找前：
        0
       ↑
      1
     ↑
    2
   ↑
  3

find(3) 過程：
    1. 找到根 0
    2. 將路徑上所有節點直接連到 0

查找後（壓縮路徑）：
        0
      ↗ ↑ ↖
     1  2  3
```

### 代碼（遞迴版）

```cpp
int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]);  // 路徑壓縮
    }
    return parent[x];
}
```

**過程詳解**：
```
find(3) 在樹 3 → 2 → 1 → 0 中：

遞迴過程：
    find(3): parent[3] = find(2)
        find(2): parent[2] = find(1)
            find(1): parent[1] = find(0)
                find(0): return 0
            parent[1] = 0, return 0
        parent[2] = 0, return 0
    parent[3] = 0, return 0

結果：所有節點直接連到根 0
```

### 代碼（迭代版）

```cpp
int find(int x) {
    int root = x;
    // 1. 找到根
    while (parent[root] != root) {
        root = parent[root];
    }

    // 2. 壓縮路徑
    while (x != root) {
        int next = parent[x];
        parent[x] = root;
        x = next;
    }

    return root;
}
```

---

## 四、優化 2：按秩合併（Union by Rank）

### 核心思想

合併時，將**秩較小的樹**連到**秩較大的樹**，避免樹過高。

**秩（Rank）**：樹的高度（或節點數量）

### 圖解

```
錯誤做法（總是將 x 連到 y）：
    合併 (0, 1):
        0
        ↑
        1

    合併 (1, 2):
        0
        ↑
        1
        ↑
        2  （樹變高了！）

正確做法（按秩合併）：
    合併 (0, 1):
        0
        ↑
        1

    合併 (0, 2):
          0
        ↗  ↖
       1    2  （樹保持扁平）
```

### 代碼

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;  // 存儲每個根的秩

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);  // 初始秩為 0

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // 路徑壓縮
        }
        return parent[x];
    }

    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        // 按秩合併
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;  // 秩相同時，秩加 1
        }
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

---

## 五、優化 3：按大小合併（Union by Size）

### 核心思想

將**節點數較少的樹**連到**節點數較多的樹**。

### 代碼

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> size;  // 存儲每個集合的大小

public:
    UnionFind(int n) {
        parent.resize(n);
        size.resize(n, 1);  // 初始每個集合大小為 1

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // 路徑壓縮
        }
        return parent[x];
    }

    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        // 按大小合併
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }

    // 額外功能：獲取集合大小
    int getSize(int x) {
        return size[find(x)];
    }
};
```

**優勢**：可以方便地查詢集合大小。

---

## 六、完整模板（推薦版本）

結合**路徑壓縮**和**按大小合併**：

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> size;
    int count;  // 集合數量

public:
    UnionFind(int n) : count(n) {
        parent.resize(n);
        size.resize(n, 1);

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // 路徑壓縮
        }
        return parent[x];
    }

    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;  // 已經在同一集合

        // 按大小合併
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }

        count--;  // 集合數量減 1
        return true;
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }

    int getSize(int x) {
        return size[find(x)];
    }

    int getCount() {
        return count;  // 返回集合總數
    }
};
```

**複雜度**：
- `find` 和 `unite`：O(α(n)) ≈ O(1)
- α(n) 是反阿克曼函數，增長極慢（n = 10^9 時，α(n) ≈ 4）

---

## 七、應用場景

### 1. 連通性問題

判斷圖中兩點是否連通：

```cpp
bool isConnected(int n, vector<vector<int>>& edges, int u, int v) {
    UnionFind uf(n);

    for (auto& edge : edges) {
        uf.unite(edge[0], edge[1]);
    }

    return uf.connected(u, v);
}
```

### 2. 環檢測

判斷無向圖中是否有環：

```cpp
bool hasCycle(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);

    for (auto& edge : edges) {
        int u = edge[0], v = edge[1];

        // 如果兩個節點已經連通，加入這條邊會形成環
        if (uf.connected(u, v)) {
            return true;
        }

        uf.unite(u, v);
    }

    return false;
}
```

### 3. 連通分量數量

計算圖中有多少個連通分量：

```cpp
int countComponents(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);

    for (auto& edge : edges) {
        uf.unite(edge[0], edge[1]);
    }

    return uf.getCount();
}
```

---

## 八、LeetCode 題目詳解

### 1. LeetCode 200: Number of Islands

**題目**：給定 01 矩陣，計算島嶼數量（1 連通的區域）

**解法 1：Union Find**

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;

        int m = grid.size(), n = grid[0].size();
        UnionFind uf(m * n);

        int waterCount = 0;  // 水的數量

        // 四個方向
        int dx[] = {0, 1};  // 只需右和下（避免重複）
        int dy[] = {1, 0};

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '0') {
                    waterCount++;
                    continue;
                }

                // 與右邊和下邊的 1 連通
                for (int k = 0; k < 2; k++) {
                    int ni = i + dx[k];
                    int nj = j + dy[k];

                    if (ni < m && nj < n && grid[ni][nj] == '1') {
                        uf.unite(i * n + j, ni * n + nj);
                    }
                }
            }
        }

        return uf.getCount() - waterCount;
    }
};
```

**解法 2：DFS（更簡潔）**

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;

        int m = grid.size(), n = grid[0].size();
        int count = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }

        return count;
    }

private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || grid[i][j] != '1') {
            return;
        }

        grid[i][j] = '0';  // 標記為已訪問

        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
};
```

**結論**：這題 DFS 更簡單，但 Union Find 展示了其在連通性問題上的應用。

---

### 2. LeetCode 684: Redundant Connection

**題目**：給定無向圖的邊列表，找出導致環的最後一條邊

**解法**：Union Find 環檢測

```cpp
class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        UnionFind uf(n + 1);  // 節點編號從 1 開始

        for (auto& edge : edges) {
            int u = edge[0], v = edge[1];

            // 如果已經連通，這條邊會形成環
            if (uf.connected(u, v)) {
                return edge;
            }

            uf.unite(u, v);
        }

        return {};
    }
};
```

**複雜度**：O(n·α(n)) ≈ O(n)

---

### 3. LeetCode 721: Accounts Merge

**題目**：給定帳號列表，每個帳號有名字和多個郵箱。如果兩個帳號有共同郵箱，則屬於同一人。合併所有同一人的帳號。

**範例**：
```
輸入:
[
  ["John", "john@mail.com", "john_work@mail.com"],
  ["John", "john@mail.com", "john_home@mail.com"],
  ["Mary", "mary@mail.com"]
]

輸出:
[
  ["John", "john@mail.com", "john_home@mail.com", "john_work@mail.com"],
  ["Mary", "mary@mail.com"]
]
```

**解法**：Union Find

```cpp
class Solution {
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        int n = accounts.size();
        UnionFind uf(n);

        unordered_map<string, int> emailToId;  // 郵箱 → 帳號索引

        // 1. 建立郵箱到帳號的映射，並合併有共同郵箱的帳號
        for (int i = 0; i < n; i++) {
            for (int j = 1; j < accounts[i].size(); j++) {
                string email = accounts[i][j];

                if (emailToId.count(email)) {
                    uf.unite(i, emailToId[email]);
                } else {
                    emailToId[email] = i;
                }
            }
        }

        // 2. 收集每個帳號的所有郵箱
        unordered_map<int, set<string>> groups;  // 根帳號 → 郵箱集合

        for (auto& [email, id] : emailToId) {
            int root = uf.find(id);
            groups[root].insert(email);
        }

        // 3. 構建結果
        vector<vector<string>> result;

        for (auto& [id, emails] : groups) {
            vector<string> account;
            account.push_back(accounts[id][0]);  // 名字

            for (const string& email : emails) {
                account.push_back(email);
            }

            result.push_back(account);
        }

        return result;
    }
};
```

**複雜度**：O(n·k·α(n))，k 為平均郵箱數量

---

### 4. LeetCode 947: Most Stones Removed with Same Row or Column

**題目**：石頭放在 2D 平面上，如果兩顆石頭在同一行或同一列，可以移除其中一顆。求最多可以移除多少顆石頭。

**核心思想**：
- 在同一連通分量中，可以移除 size - 1 顆石頭
- 總移除數 = 總石頭數 - 連通分量數

**解法**：

```cpp
class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int n = stones.size();
        UnionFind uf(n);

        // 合併在同一行或同一列的石頭
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (stones[i][0] == stones[j][0] || stones[i][1] == stones[j][1]) {
                    uf.unite(i, j);
                }
            }
        }

        return n - uf.getCount();
    }
};
```

**優化**：使用 Hash Map 存儲每行/列的石頭，避免 O(n²) 比較

```cpp
class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        UnionFind uf(stones.size());

        unordered_map<int, int> rowMap;   // 行 → 石頭索引
        unordered_map<int, int> colMap;   // 列 → 石頭索引

        for (int i = 0; i < stones.size(); i++) {
            int row = stones[i][0];
            int col = stones[i][1] + 10001;  // 避免行列衝突

            if (rowMap.count(row)) {
                uf.unite(i, rowMap[row]);
            } else {
                rowMap[row] = i;
            }

            if (colMap.count(col)) {
                uf.unite(i, colMap[col]);
            } else {
                colMap[col] = i;
            }
        }

        return stones.size() - uf.getCount();
    }
};
```

---

### 5. LeetCode 128: Longest Consecutive Sequence (進階應用)

**題目**：給定未排序陣列，找最長連續序列的長度

**範例**：
```
輸入: [100, 4, 200, 1, 3, 2]
輸出: 4 (連續序列 [1, 2, 3, 4])
```

**解法**：Union Find（非典型應用）

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        if (nums.empty()) return 0;

        unordered_map<int, int> numToId;  // 數字 → Union Find ID
        int id = 0;

        for (int num : nums) {
            if (!numToId.count(num)) {
                numToId[num] = id++;
            }
        }

        UnionFind uf(id);

        // 合併連續的數字
        for (int num : nums) {
            if (numToId.count(num + 1)) {
                uf.unite(numToId[num], numToId[num + 1]);
            }
        }

        // 找最大的集合
        int maxSize = 0;
        for (int i = 0; i < id; i++) {
            maxSize = max(maxSize, uf.getSize(i));
        }

        return maxSize;
    }
};
```

**更優解法**：Hash Set（O(n)）

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int maxLen = 0;

        for (int num : numSet) {
            // 只從序列起點開始計算
            if (!numSet.count(num - 1)) {
                int currentNum = num;
                int currentLen = 1;

                while (numSet.count(currentNum + 1)) {
                    currentNum++;
                    currentLen++;
                }

                maxLen = max(maxLen, currentLen);
            }
        }

        return maxLen;
    }
};
```

---

## 九、常見陷阱與技巧

### 陷阱 1：忘記路徑壓縮

```cpp
// 錯誤：沒有路徑壓縮
int find(int x) {
    while (parent[x] != x) {
        x = parent[x];
    }
    return x;  // 複雜度退化到 O(n)
}

// 正確：路徑壓縮
int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]);
    }
    return parent[x];
}
```

### 陷阱 2：合併時忘記先 find

```cpp
// 錯誤：直接連接
parent[x] = y;  // x 和 y 可能不是根！

// 正確：先找到根
int rootX = find(x);
int rootY = find(y);
parent[rootX] = rootY;
```

### 陷阱 3：二維座標轉一維索引

```cpp
// 將 (i, j) 轉為一維索引
int id = i * n + j;

// 注意：n 是列數，不是行數！
```

### 技巧 1：動態分配 ID

當元素不是連續整數時，使用 Hash Map：

```cpp
unordered_map<string, int> idMap;
int nextId = 0;

int getId(const string& key) {
    if (!idMap.count(key)) {
        idMap[key] = nextId++;
    }
    return idMap[key];
}
```

### 技巧 2：利用 getCount() 計算連通分量

```cpp
UnionFind uf(n);
for (auto& edge : edges) {
    uf.unite(edge[0], edge[1]);
}

int components = uf.getCount();  // 連通分量數量
```

---

## 十、總結

### 核心操作

| 操作 | 無優化 | 路徑壓縮 | 路徑壓縮 + 按秩合併 |
|------|-------|---------|-------------------|
| `find` | O(n) | O(log n) | O(α(n)) ≈ O(1) |
| `unite` | O(n) | O(log n) | O(α(n)) ≈ O(1) |

### 適用場景

| 問題類型 | 是否適用 |
|---------|---------|
| 連通性判斷 | ✅ 完美 |
| 環檢測（無向圖） | ✅ 完美 |
| 動態連通分量 | ✅ 完美 |
| 最小生成樹（Kruskal） | ✅ 完美 |
| 有向圖環檢測 | ❌ 用拓撲排序 |
| 最短路徑 | ❌ 用 Dijkstra/BFS |

### 模板速查

```cpp
class UnionFind {
    vector<int> parent, size;
    int count;

public:
    UnionFind(int n) : count(n) {
        parent.resize(n);
        size.resize(n, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;

        if (size[rootX] < size[rootY]) swap(rootX, rootY);
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        count--;
        return true;
    }

    bool connected(int x, int y) { return find(x) == find(y); }
    int getSize(int x) { return size[find(x)]; }
    int getCount() { return count; }
};
```

Union Find 是處理動態連通性問題的最佳選擇，簡潔高效！

