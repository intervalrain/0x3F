---
title: "並查集 (Union Find)"
order: 2
description: "高效處理集合合併與查詢的資料結構"
tags: ["graph", "union find", "disjoint set"]
---

# 並查集 (Union Find)

並查集 (Union Find)，也稱為 Disjoint Set Union (DSU)，是一種用於處理**不相交集合**的合併和查詢問題的資料結構。

## 核心概念

### 問題場景

並查集主要解決以下問題：
1. **合併 (Union)**：將兩個集合合併為一個
2. **查詢 (Find)**：判斷兩個元素是否在同一個集合中

### 應用場景

- **連通性問題**：判斷圖中兩點是否連通
- **環檢測**：檢測無向圖中是否存在環
- **最小生成樹**：Kruskal 演算法
- **集合合併**：賬號合併、朋友圈問題

### 基本結構

```
初始狀態（每個元素自成一個集合）：
0   1   2   3   4

合併 (0,1) 和 (2,3) 後：
0       2       4
|       |
1       3

合併 (1,2) 後：
    0
   / \
  1   2
      |
      3       4
```

## 基本實現

### 1. 樸素版本

```cpp
class UnionFind {
private:
    vector<int> parent;  // parent[i] 表示 i 的父節點

public:
    UnionFind(int n) {
        parent.resize(n);
        // 初始化：每個節點的父節點是自己
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    // 查找根節點（代表元素）
    int find(int x) {
        if (parent[x] == x) {
            return x;  // 找到根節點
        }
        return find(parent[x]);  // 遞迴向上查找
    }

    // 合併兩個集合
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX != rootY) {
            parent[rootX] = rootY;  // 將 x 的根連到 y 的根
        }
    }

    // 判斷是否在同一集合
    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }
};
```

**複雜度分析**：
- Find：O(n)，最壞情況下退化成鏈
- Union：O(n)

## 優化技巧

### 優化 1：路徑壓縮 (Path Compression)

在 `find` 操作中，將路徑上的所有節點直接連到根節點。

```cpp
int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]);  // 路徑壓縮
    }
    return parent[x];
}
```

**視覺化**：
```
壓縮前：              壓縮後：
    0                   0
    |                 / | \
    1                1  2  3
    |
    2
    |
    3

find(3) 後，3 直接連到根節點 0
```

### 優化 2：按秩合併 (Union by Rank)

合併時，將較小的樹連到較大的樹上，保持樹的平衡。

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;  // rank[i] 表示以 i 為根的樹的高度

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
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

        // 按秩合併：將秩小的樹連到秩大的樹
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;  // 高度相同時，合併後高度+1
        }
    }

    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }
};
```

### 優化 3：按大小合併 (Union by Size)

另一種優化方式，記錄集合大小而非高度。

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> size;  // size[i] 表示以 i 為根的集合大小

public:
    UnionFind(int n) {
        parent.resize(n);
        size.resize(n, 1);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        // 將小集合合併到大集合
        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
    }

    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }

    int getSize(int x) {
        return size[find(x)];
    }
};
```

## 複雜度分析

| 操作 | 樸素版本 | 路徑壓縮 | 路徑壓縮 + 按秩合併 |
|------|---------|---------|-------------------|
| Find | O(n) | O(log n) | O(α(n)) ≈ O(1) |
| Union | O(n) | O(log n) | O(α(n)) ≈ O(1) |

其中 α(n) 是 Ackermann 函數的反函數，增長極其緩慢，實際應用中可視為常數。

## 完整模板（推薦使用）

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    int count;  // 連通分量數量

public:
    UnionFind(int n) : count(n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;  // 已在同一集合

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        count--;  // 合併後連通分量減少
        return true;
    }

    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }

    int getCount() {
        return count;
    }
};
```

## LeetCode 題目詳解

### 1. [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)

**題目**：給定二維網格，'1' 表示陸地，'0' 表示水，計算島嶼數量。

**解法**：Union Find（將相鄰的陸地合併）

```cpp
class Solution {
private:
    class UnionFind {
    public:
        vector<int> parent;
        int count;

        UnionFind(vector<vector<char>>& grid) {
            int m = grid.size(), n = grid[0].size();
            parent.resize(m * n);
            count = 0;

            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == '1') {
                        parent[i * n + j] = i * n + j;
                        count++;
                    }
                }
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        void unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX != rootY) {
                parent[rootX] = rootY;
                count--;
            }
        }
    };

public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;

        int m = grid.size(), n = grid[0].size();
        UnionFind uf(grid);

        int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    // 向右和向下合併（避免重複）
                    for (auto& dir : dirs) {
                        int ni = i + dir[0];
                        int nj = j + dir[1];
                        if (ni < m && nj < n && grid[ni][nj] == '1') {
                            uf.unite(i * n + j, ni * n + nj);
                        }
                    }
                }
            }
        }

        return uf.count;
    }
};
```

**複雜度**：
- 時間：O(m × n × α(m×n)) ≈ O(m × n)
- 空間：O(m × n)

### 2. [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)

**題目**：找出無向圖中使其成為樹需要刪除的最後一條邊。

**解法**：Union Find 檢測環

```cpp
class Solution {
private:
    class UnionFind {
    public:
        vector<int> parent;

        UnionFind(int n) {
            parent.resize(n + 1);
            for (int i = 0; i <= n; i++) {
                parent[i] = i;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            if (rootX == rootY) {
                return false;  // 已連通，加這條邊會形成環
            }

            parent[rootX] = rootY;
            return true;
        }
    };

public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        UnionFind uf(n);

        for (auto& edge : edges) {
            if (!uf.unite(edge[0], edge[1])) {
                return edge;  // 這條邊導致環
            }
        }

        return {};
    }
};
```

**複雜度**：
- 時間：O(n × α(n)) ≈ O(n)
- 空間：O(n)

### 3. [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)

**題目**：合併屬於同一個人的賬號（通過共同的 email）。

**解法**：Union Find + HashMap

```cpp
class Solution {
private:
    class UnionFind {
    public:
        unordered_map<string, string> parent;

        string find(string x) {
            if (parent.find(x) == parent.end()) {
                parent[x] = x;
            }
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        void unite(string x, string y) {
            string rootX = find(x);
            string rootY = find(y);
            if (rootX != rootY) {
                parent[rootX] = rootY;
            }
        }
    };

public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        UnionFind uf;
        unordered_map<string, string> emailToName;

        // 合併同一賬號的所有 email
        for (auto& account : accounts) {
            string name = account[0];
            string firstEmail = account[1];

            for (int i = 1; i < account.size(); i++) {
                emailToName[account[i]] = name;
                uf.unite(firstEmail, account[i]);
            }
        }

        // 按根節點分組
        unordered_map<string, vector<string>> groups;
        for (auto& [email, name] : emailToName) {
            string root = uf.find(email);
            groups[root].push_back(email);
        }

        // 構建結果
        vector<vector<string>> result;
        for (auto& [root, emails] : groups) {
            sort(emails.begin(), emails.end());
            vector<string> account = {emailToName[root]};
            account.insert(account.end(), emails.begin(), emails.end());
            result.push_back(account);
        }

        return result;
    }
};
```

**複雜度**：
- 時間：O(n × k × α(n) + n × k × log(k))，k 為最大 email 數量
- 空間：O(n × k)

### 4. [947. Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)

**題目**：移除最多的石頭，每次移除必須與其他石頭在同一行或同一列。

**解法**：Union Find 計算連通分量

```cpp
class Solution {
private:
    class UnionFind {
    public:
        unordered_map<int, int> parent;
        int count = 0;

        int find(int x) {
            if (parent.find(x) == parent.end()) {
                parent[x] = x;
                count++;
            }
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        void unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX != rootY) {
                parent[rootX] = rootY;
                count--;
            }
        }
    };

public:
    int removeStones(vector<vector<int>>& stones) {
        UnionFind uf;

        for (auto& stone : stones) {
            int x = stone[0];
            int y = stone[1];
            // 將行和列視為節點，加上偏移避免衝突
            uf.unite(x, y + 10001);
        }

        // 可以移除的石頭數 = 總石頭數 - 連通分量數
        return stones.size() - uf.count;
    }
};
```

**關鍵洞察**：
- 每個連通分量最多保留 1 個石頭
- 可移除數量 = 總數 - 連通分量數

**複雜度**：
- 時間：O(n × α(n)) ≈ O(n)
- 空間：O(n)

## 常見陷阱與技巧

### 陷阱

1. **忘記路徑壓縮**
   ```cpp
   // 錯誤：沒有壓縮
   int find(int x) {
       while (parent[x] != x) {
           x = parent[x];
       }
       return x;
   }

   // 正確：路徑壓縮
   int find(int x) {
       if (parent[x] != x) {
           parent[x] = find(parent[x]);
       }
       return parent[x];
   }
   ```

2. **Union 前沒有先 Find**
   ```cpp
   // 錯誤：直接合併
   parent[x] = y;

   // 正確：合併根節點
   int rootX = find(x);
   int rootY = find(y);
   parent[rootX] = rootY;
   ```

3. **座標轉換錯誤**
   ```cpp
   // 二維轉一維：正確公式
   int index = i * n + j;
   ```

### 進階技巧

1. **統計連通分量數量**
   ```cpp
   int count = n;  // 初始化為節點數

   bool unite(int x, int y) {
       // ...
       if (rootX != rootY) {
           count--;  // 合併後減少
           return true;
       }
       return false;
   }
   ```

2. **獲取集合大小**
   ```cpp
   vector<int> size(n, 1);

   void unite(int x, int y) {
       // ...
       size[rootY] += size[rootX];
   }
   ```

3. **處理字串/物件的並查集**
   ```cpp
   unordered_map<string, string> parent;

   string find(string x) {
       if (parent.find(x) == parent.end()) {
           parent[x] = x;  // 首次出現
       }
       // ...
   }
   ```

## 總結

### Union Find 特點

| 特性 | 說明 |
|------|------|
| 適用場景 | 動態連通性、等價類劃分 |
| 時間複雜度 | O(α(n)) ≈ O(1) |
| 空間複雜度 | O(n) |
| 優點 | 極快的合併和查詢 |
| 缺點 | 不支持刪除操作 |

### 與其他方法比較

| 問題 | DFS/BFS | Union Find |
|------|---------|-----------|
| 連通性查詢 | O(V+E) | O(α(n)) |
| 環檢測 | O(V+E) | O(E×α(n)) |
| 動態連通性 | 不適用 | 優秀 |
| 路徑查詢 | 支持 | 不支持 |

**選擇建議**：
- 靜態圖 + 需要路徑 → DFS/BFS
- 動態圖 + 只需連通性 → Union Find
- 無向圖環檢測 → Union Find（更快）
- 有向圖環檢測 → DFS（三色標記）

下一章我們將學習拓撲排序，處理有向無環圖的線性排序問題。
