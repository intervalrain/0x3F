---
title: "Iteration DFS (stack)"
order: 1
---

# Iteration DFS (Stack)

## 概述

深度優先搜尋（DFS）通常使用遞迴實作，但也可以使用 Stack 來實現非遞迴版本。使用 Stack 的迭代式 DFS 在某些情況下更有優勢：

1. **避免棧溢出**：遞迴深度太大時會導致 Stack Overflow
2. **更靈活的控制**：可以隨時暫停、恢復搜尋
3. **易於理解**：顯式地使用 Stack，更清晰地看到調用過程

## 遞迴 DFS vs 迭代 DFS

### 遞迴 DFS

```cpp
void dfsRecursive(TreeNode* root) {
    if (root == nullptr) return;

    // 前序處理
    cout << root->val << " ";

    // 遞迴左子樹
    dfsRecursive(root->left);

    // 遞迴右子樹
    dfsRecursive(root->right);
}
```

### 迭代 DFS（使用 Stack）

```cpp
void dfsIterative(TreeNode* root) {
    if (root == nullptr) return;

    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();

        // 處理當前節點
        cout << node->val << " ";

        // 注意：先壓右子樹，再壓左子樹
        // 因為 Stack 是 LIFO，這樣出棧時先訪問左子樹
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
}
```

**為什麼先壓右再壓左？**

```
       1
      / \
     2   3
    / \
   4   5

Stack 操作過程：
1. push(1)       Stack: [1]
2. pop(1), 訪問1  Stack: []
   push(3)       Stack: [3]
   push(2)       Stack: [3, 2]
3. pop(2), 訪問2  Stack: [3]
   push(5)       Stack: [3, 5]
   push(4)       Stack: [3, 5, 4]
4. pop(4), 訪問4  Stack: [3, 5]
5. pop(5), 訪問5  Stack: [3]
6. pop(3), 訪問3  Stack: []

遍歷順序：1 -> 2 -> 4 -> 5 -> 3 (前序)
```

---

## 樹的三種遍歷

### 1. 前序遍歷（Preorder）

**順序：根 -> 左 -> 右**

```cpp
// 遞迴版本
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        preorder(root, result);
        return result;
    }

private:
    void preorder(TreeNode* node, vector<int>& result) {
        if (node == nullptr) return;
        result.push_back(node->val);      // 根
        preorder(node->left, result);     // 左
        preorder(node->right, result);    // 右
    }
};

// 迭代版本（使用 Stack）
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) return result;

        stack<TreeNode*> st;
        st.push(root);

        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            result.push_back(node->val);  // 訪問根節點

            // 先壓右子樹，再壓左子樹
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }

        return result;
    }
};
```

### 2. 中序遍歷（Inorder）

**順序：左 -> 根 -> 右**

```cpp
// 遞迴版本
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        inorder(root, result);
        return result;
    }

private:
    void inorder(TreeNode* node, vector<int>& result) {
        if (node == nullptr) return;
        inorder(node->left, result);      // 左
        result.push_back(node->val);      // 根
        inorder(node->right, result);     // 右
    }
};

// 迭代版本（使用 Stack）
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;

        while (curr != nullptr || !st.empty()) {
            // 一直往左走，把所有左節點壓入棧
            while (curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }

            // 到達最左邊，開始處理
            curr = st.top();
            st.pop();
            result.push_back(curr->val);  // 訪問根節點

            // 轉向右子樹
            curr = curr->right;
        }

        return result;
    }
};
```

**迭代過程示例：**

```
       1
        \
         2
        /
       3

curr = 1, Stack: []
  curr = 1, Stack: [1]
  curr = null
curr = 1 (pop), result = [1], Stack: []
  curr = 2
  curr = 2, Stack: [2]
  curr = 3, Stack: [2, 3]
  curr = null
curr = 3 (pop), result = [1, 3], Stack: [2]
  curr = null
curr = 2 (pop), result = [1, 3, 2], Stack: []
  curr = null

最終結果：[1, 3, 2]
```

### 3. 後序遍歷（Postorder）

**順序：左 -> 右 -> 根**

```cpp
// 遞迴版本
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        postorder(root, result);
        return result;
    }

private:
    void postorder(TreeNode* node, vector<int>& result) {
        if (node == nullptr) return;
        postorder(node->left, result);    // 左
        postorder(node->right, result);   // 右
        result.push_back(node->val);      // 根
    }
};

// 迭代版本 1：使用兩個棧
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) return result;

        stack<TreeNode*> st1, st2;
        st1.push(root);

        // 第一個棧：根 -> 右 -> 左（前序的鏡像）
        while (!st1.empty()) {
            TreeNode* node = st1.top();
            st1.pop();
            st2.push(node);

            // 注意：先壓左，再壓右（與前序相反）
            if (node->left) st1.push(node->left);
            if (node->right) st1.push(node->right);
        }

        // 第二個棧：反轉得到 左 -> 右 -> 根
        while (!st2.empty()) {
            result.push_back(st2.top()->val);
            st2.pop();
        }

        return result;
    }
};

// 迭代版本 2：使用一個棧（更複雜但空間優化）
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;
        TreeNode* lastVisited = nullptr;

        while (curr != nullptr || !st.empty()) {
            // 往左走到底
            while (curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }

            // 查看棧頂元素，但不彈出
            curr = st.top();

            // 如果右子樹不存在或已訪問，則訪問當前節點
            if (curr->right == nullptr || curr->right == lastVisited) {
                result.push_back(curr->val);
                st.pop();
                lastVisited = curr;
                curr = nullptr;  // 重要：設為 null 防止重複訪問
            } else {
                // 否則訪問右子樹
                curr = curr->right;
            }
        }

        return result;
    }
};
```

---

## LeetCode 144: Binary Tree Preorder Traversal

**問題：** 給定二叉樹的根節點，返回其前序遍歷。

### 解法

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) return result;

        stack<TreeNode*> st;
        st.push(root);

        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            result.push_back(node->val);  // 根

            // 先壓右子樹，再壓左子樹
            // 因為棧是 LIFO，這樣能保證左子樹先被訪問
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }

        return result;
    }
};
```

**時間複雜度：** O(n)，每個節點訪問一次
**空間複雜度：** O(h)，h 是樹的高度，最壞情況 O(n)

---

## LeetCode 94: Binary Tree Inorder Traversal

**問題：** 給定二叉樹的根節點，返回其中序遍歷。

### 解法

```cpp
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;

        while (curr != nullptr || !st.empty()) {
            // 一路向左，將所有左節點壓入棧
            while (curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }

            // 處理棧頂節點
            curr = st.top();
            st.pop();
            result.push_back(curr->val);  // 根

            // 轉向右子樹
            curr = curr->right;
        }

        return result;
    }
};
```

**關鍵點：**
- 先將所有左節點壓入棧
- 彈出節點時訪問
- 然後處理右子樹

**時間複雜度：** O(n)
**空間複雜度：** O(h)

---

## LeetCode 145: Binary Tree Postorder Traversal

**問題：** 給定二叉樹的根節點，返回其後序遍歷。

### 解法：使用兩個棧

```cpp
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) return result;

        stack<TreeNode*> st1, st2;
        st1.push(root);

        // 第一個棧：得到 根 -> 右 -> 左
        while (!st1.empty()) {
            TreeNode* node = st1.top();
            st1.pop();
            st2.push(node);

            // 先壓左，再壓右
            if (node->left) st1.push(node->left);
            if (node->right) st1.push(node->right);
        }

        // 第二個棧：反轉得到 左 -> 右 -> 根
        while (!st2.empty()) {
            result.push_back(st2.top()->val);
            st2.pop();
        }

        return result;
    }
};
```

**思路：**
1. 前序遍歷是：根 -> 左 -> 右
2. 調整順序變成：根 -> 右 -> 左
3. 反轉結果得到：左 -> 右 -> 根（後序）

**時間複雜度：** O(n)
**空間複雜度：** O(n)

---

## LeetCode 590: N-ary Tree Postorder Traversal

**問題：** 給定 N 叉樹的根節點，返回其後序遍歷。

### N 叉樹定義

```cpp
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}
    Node(int _val) : val(_val) {}
    Node(int _val, vector<Node*> _children) : val(_val), children(_children) {}
};
```

### 解法：迭代版本

```cpp
class Solution {
public:
    vector<int> postorder(Node* root) {
        vector<int> result;
        if (root == nullptr) return result;

        stack<Node*> st1, st2;
        st1.push(root);

        // 第一個棧：得到 根 -> 子節點（從右到左）
        while (!st1.empty()) {
            Node* node = st1.top();
            st1.pop();
            st2.push(node);

            // 將所有子節點壓入棧（從左到右壓入）
            for (Node* child : node->children) {
                if (child) st1.push(child);
            }
        }

        // 第二個棧：反轉得到後序遍歷
        while (!st2.empty()) {
            result.push_back(st2.top()->val);
            st2.pop();
        }

        return result;
    }
};
```

**示例：**

```
       1
     / | \
    3  2  4
   / \
  5   6

Stack1 過程：
push(1) -> [1]
pop(1), push(3,2,4) -> [4,2,3]
pop(3), push(5,6) -> [4,2,6,5]
pop(5) -> [4,2,6]
pop(6) -> [4,2]
pop(2) -> [4]
pop(4) -> []

Stack2: [1,3,2,4,5,6]
反轉後：[5,6,3,2,4,1]
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

---

## 圖的 DFS

### LeetCode 200: Number of Islands

**問題：** 給定一個由 `'1'`（陸地）和 `'0'`（水）組成的二維網格，計算島嶼的數量。

### 解法 1：遞迴 DFS

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
                    dfs(grid, i, j);
                    count++;
                }
            }
        }

        return count;
    }

private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();

        // 邊界檢查
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0') {
            return;
        }

        // 標記為已訪問
        grid[i][j] = '0';

        // 四個方向遞迴
        dfs(grid, i - 1, j);  // 上
        dfs(grid, i + 1, j);  // 下
        dfs(grid, i, j - 1);  // 左
        dfs(grid, i, j + 1);  // 右
    }
};
```

### 解法 2：迭代 DFS（使用 Stack）

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
                    dfsIterative(grid, i, j);
                    count++;
                }
            }
        }

        return count;
    }

private:
    void dfsIterative(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        stack<pair<int, int>> st;
        st.push({i, j});
        grid[i][j] = '0';  // 標記為已訪問

        int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!st.empty()) {
            auto [x, y] = st.top();
            st.pop();

            // 探索四個方向
            for (auto& dir : dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == '1') {
                    st.push({nx, ny});
                    grid[nx][ny] = '0';  // 標記為已訪問
                }
            }
        }
    }
};
```

**時間複雜度：** O(m × n)
**空間複雜度：** O(m × n)，最壞情況整個網格都是陸地

---

## LeetCode 695: Max Area of Island

**問題：** 給定包含 `0` 和 `1` 的二維網格，找出最大島嶼的面積。

### 解法：迭代 DFS

```cpp
class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
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

private:
    int dfs(vector<vector<int>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        stack<pair<int, int>> st;
        st.push({i, j});
        grid[i][j] = 0;  // 標記為已訪問

        int area = 0;
        int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!st.empty()) {
            auto [x, y] = st.top();
            st.pop();
            area++;  // 計數當前格子

            // 探索四個方向
            for (auto& dir : dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                    st.push({nx, ny});
                    grid[nx][ny] = 0;  // 標記為已訪問
                }
            }
        }

        return area;
    }
};
```

**時間複雜度：** O(m × n)
**空間複雜度：** O(m × n)

---

## 遞迴 vs 迭代：如何選擇？

### 遞迴 DFS 的優勢

1. **代碼簡潔**：更容易理解和實作
2. **自然的回溯**：自動處理狀態恢復
3. **適合樹結構**：樹的高度通常不會太大

```cpp
// 簡潔易懂
void dfs(TreeNode* node) {
    if (node == nullptr) return;
    // process node
    dfs(node->left);
    dfs(node->right);
}
```

### 迭代 DFS 的優勢

1. **避免棧溢出**：深度很大時不會爆棧
2. **更好的控制**：可以隨時暫停和恢復
3. **性能優化**：避免函數調用開銷

```cpp
// 可控制、可暫停
void dfs(TreeNode* root) {
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();
        // process node
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
}
```

### 選擇建議

| 場景 | 推薦方式 |
|------|---------|
| 樹的深度 < 1000 | 遞迴（更簡潔） |
| 樹的深度 > 10000 | 迭代（避免爆棧） |
| 需要暫停/恢復 | 迭代 |
| 代碼可讀性優先 | 遞迴 |
| 圖的遍歷 | 迭代（深度不確定） |

---

## 總結

### 核心要點

1. **Stack 實現 DFS**：
   - 前序：根 -> 左 -> 右（先壓右，再壓左）
   - 中序：左 -> 根 -> 右（需要額外指針）
   - 後序：左 -> 右 -> 根（兩個棧或標記法）

2. **遍歷模板**：
   ```cpp
   stack<Node*> st;
   st.push(start);
   while (!st.empty()) {
       Node* node = st.top();
       st.pop();
       // process node
       // push children
   }
   ```

3. **圖的 DFS**：
   - 需要標記已訪問節點
   - 四個方向或鄰接表遍歷
   - 用於連通性問題

### 複雜度分析

- **時間複雜度**：O(n)，每個節點訪問一次
- **空間複雜度**：O(h)，h 為深度，最壞 O(n)

### 相關題目

- [144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)
- [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- [145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)
- [590. N-ary Tree Postorder Traversal](https://leetcode.com/problems/n-ary-tree-postorder-traversal/)
- [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/)
