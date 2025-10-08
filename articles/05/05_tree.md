---
title: 05-5. Tree
order: 5
description: '深入探討各種樹形資料結構，包含二元搜尋樹（BST）、平衡樹（AVL）、紅黑樹等進階主題。理解樹的性質、操作複雜度，以及在實際應用中的選擇與權衡。'
tags: ['Tree', 'BST', 'AVL', 'Red-Black Tree', '樹', '平衡樹']
author: Rain Hu
date: ''
draft: true
---

# Tree (樹)

## 1. General Tree (一般樹)

### 1.1 N-ary Tree (N 叉樹)

每個節點可以有任意數量的子節點。

```cpp
struct Node {
    int val;
    vector<Node*> children;

    Node(int v) : val(v) {}
};
```

#### N 叉樹的遍歷

```cpp
// LeetCode 589. N-ary Tree Preorder Traversal
class Solution {
public:
    vector<int> preorder(Node* root) {
        vector<int> result;
        if (!root) return result;

        stack<Node*> stk;
        stk.push(root);

        while (!stk.empty()) {
            Node* node = stk.top();
            stk.pop();

            result.push_back(node->val);

            // 逆序壓入子節點（右到左）
            for (int i = node->children.size() - 1; i >= 0; i--) {
                stk.push(node->children[i]);
            }
        }

        return result;
    }
};

// LeetCode 590. N-ary Tree Postorder Traversal
class Solution {
public:
    vector<int> postorder(Node* root) {
        vector<int> result;
        postorderHelper(root, result);
        return result;
    }

private:
    void postorderHelper(Node* node, vector<int>& result) {
        if (!node) return;

        for (Node* child : node->children) {
            postorderHelper(child, result);
        }
        result.push_back(node->val);
    }
};

// LeetCode 429. N-ary Tree Level Order Traversal
class Solution {
public:
    vector<vector<int>> levelOrder(Node* root) {
        vector<vector<int>> result;
        if (!root) return result;

        queue<Node*> q;
        q.push(root);

        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;

            for (int i = 0; i < levelSize; i++) {
                Node* node = q.front();
                q.pop();

                currentLevel.push_back(node->val);

                for (Node* child : node->children) {
                    q.push(child);
                }
            }

            result.push_back(currentLevel);
        }

        return result;
    }
};
```

#### N 叉樹的最大深度

```cpp
// LeetCode 559. Maximum Depth of N-ary Tree
class Solution {
public:
    int maxDepth(Node* root) {
        if (!root) return 0;

        int maxChildDepth = 0;
        for (Node* child : root->children) {
            maxChildDepth = max(maxChildDepth, maxDepth(child));
        }

        return 1 + maxChildDepth;
    }
};
```

## 2. Binary Search Tree (BST)

### 2.1 BST 性質

對於 BST 中的每個節點：
- 左子樹所有節點的值 < 當前節點的值
- 右子樹所有節點的值 > 當前節點的值
- 左右子樹也都是 BST

### 2.2 BST 驗證

```cpp
// LeetCode 98. Validate Binary Search Tree
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }

private:
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;

        // 當前節點的值必須在 (minVal, maxVal) 範圍內
        if (node->val <= minVal || node->val >= maxVal) {
            return false;
        }

        // 遞迴驗證左右子樹
        return validate(node->left, minVal, node->val) &&
               validate(node->right, node->val, maxVal);
    }
};

// 方法2：利用中序遍歷
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        TreeNode* prev = nullptr;
        return inorder(root, prev);
    }

private:
    bool inorder(TreeNode* node, TreeNode*& prev) {
        if (!node) return true;

        // 檢查左子樹
        if (!inorder(node->left, prev)) return false;

        // 檢查當前節點
        if (prev && prev->val >= node->val) return false;
        prev = node;

        // 檢查右子樹
        return inorder(node->right, prev);
    }
};
```

### 2.3 BST 搜索

```cpp
// LeetCode 700. Search in a Binary Search Tree
class Solution {
public:
    // 遞迴版本
    TreeNode* searchBST(TreeNode* root, int val) {
        if (!root || root->val == val) return root;

        if (val < root->val) {
            return searchBST(root->left, val);
        } else {
            return searchBST(root->right, val);
        }
    }

    // 迭代版本
    TreeNode* searchBST2(TreeNode* root, int val) {
        while (root && root->val != val) {
            root = (val < root->val) ? root->left : root->right;
        }
        return root;
    }
};
```

### 2.4 BST 插入

```cpp
// LeetCode 701. Insert into a Binary Search Tree
class Solution {
public:
    // 遞迴版本
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);

        if (val < root->val) {
            root->left = insertIntoBST(root->left, val);
        } else {
            root->right = insertIntoBST(root->right, val);
        }

        return root;
    }

    // 迭代版本
    TreeNode* insertIntoBST2(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);

        TreeNode* curr = root;
        while (true) {
            if (val < curr->val) {
                if (!curr->left) {
                    curr->left = new TreeNode(val);
                    break;
                }
                curr = curr->left;
            } else {
                if (!curr->right) {
                    curr->right = new TreeNode(val);
                    break;
                }
                curr = curr->right;
            }
        }

        return root;
    }
};
```

### 2.5 BST 刪除

```cpp
// LeetCode 450. Delete Node in a BST
class Solution {
public:
    TreeNode* deleteNode(TreeNode* root, int key) {
        if (!root) return nullptr;

        if (key < root->val) {
            root->left = deleteNode(root->left, key);
        } else if (key > root->val) {
            root->right = deleteNode(root->right, key);
        } else {
            // 找到要刪除的節點

            // 情況1：葉節點或只有一個子節點
            if (!root->left) return root->right;
            if (!root->right) return root->left;

            // 情況2：有兩個子節點
            // 找到右子樹的最小節點（後繼節點）
            TreeNode* minNode = findMin(root->right);
            root->val = minNode->val;
            root->right = deleteNode(root->right, minNode->val);
        }

        return root;
    }

private:
    TreeNode* findMin(TreeNode* node) {
        while (node->left) {
            node = node->left;
        }
        return node;
    }
};
```

### 2.6 BST 的第 K 小元素

```cpp
// LeetCode 230. Kth Smallest Element in a BST
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        int count = 0;
        int result = 0;
        inorder(root, k, count, result);
        return result;
    }

private:
    void inorder(TreeNode* node, int k, int& count, int& result) {
        if (!node) return;

        inorder(node->left, k, count, result);

        count++;
        if (count == k) {
            result = node->val;
            return;
        }

        inorder(node->right, k, count, result);
    }
};
```

### 2.7 BST 轉換為排序雙向鏈表

```cpp
// LeetCode 426. Convert Binary Search Tree to Sorted Doubly Linked List
class Solution {
public:
    Node* treeToDoublyList(Node* root) {
        if (!root) return nullptr;

        Node* head = nullptr;
        Node* prev = nullptr;

        inorder(root, head, prev);

        // 連接頭尾形成循環鏈表
        head->left = prev;
        prev->right = head;

        return head;
    }

private:
    void inorder(Node* node, Node*& head, Node*& prev) {
        if (!node) return;

        inorder(node->left, head, prev);

        // 處理當前節點
        if (!prev) {
            head = node;  // 最左節點是頭節點
        } else {
            prev->right = node;
            node->left = prev;
        }
        prev = node;

        inorder(node->right, head, prev);
    }
};
```

## 3. AVL Tree (平衡二元搜索樹)

### 3.1 AVL Tree 性質

AVL Tree 是一種自平衡的 BST，任何節點的左右子樹高度差最多為 1。

```cpp
struct AVLNode {
    int val;
    int height;
    AVLNode* left;
    AVLNode* right;

    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    AVLNode* root;

    // 獲取節點高度
    int height(AVLNode* node) {
        return node ? node->height : 0;
    }

    // 更新節點高度
    void updateHeight(AVLNode* node) {
        if (node) {
            node->height = 1 + max(height(node->left), height(node->right));
        }
    }

    // 計算平衡因子
    int getBalance(AVLNode* node) {
        return node ? height(node->left) - height(node->right) : 0;
    }

    // 右旋
    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;

        // 執行旋轉
        x->right = y;
        y->left = T2;

        // 更新高度
        updateHeight(y);
        updateHeight(x);

        return x;
    }

    // 左旋
    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;

        // 執行旋轉
        y->left = x;
        x->right = T2;

        // 更新高度
        updateHeight(x);
        updateHeight(y);

        return y;
    }

    // 插入節點
    AVLNode* insert(AVLNode* node, int val) {
        // 1. 執行標準 BST 插入
        if (!node) return new AVLNode(val);

        if (val < node->val) {
            node->left = insert(node->left, val);
        } else if (val > node->val) {
            node->right = insert(node->right, val);
        } else {
            return node;  // 重複值，不插入
        }

        // 2. 更新高度
        updateHeight(node);

        // 3. 獲取平衡因子
        int balance = getBalance(node);

        // 4. 如果不平衡，執行旋轉

        // Left-Left Case
        if (balance > 1 && val < node->left->val) {
            return rightRotate(node);
        }

        // Right-Right Case
        if (balance < -1 && val > node->right->val) {
            return leftRotate(node);
        }

        // Left-Right Case
        if (balance > 1 && val > node->left->val) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }

        // Right-Left Case
        if (balance < -1 && val < node->right->val) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    // 找到最小值節點
    AVLNode* minValueNode(AVLNode* node) {
        AVLNode* current = node;
        while (current->left) {
            current = current->left;
        }
        return current;
    }

    // 刪除節點
    AVLNode* deleteNode(AVLNode* node, int val) {
        // 1. 執行標準 BST 刪除
        if (!node) return node;

        if (val < node->val) {
            node->left = deleteNode(node->left, val);
        } else if (val > node->val) {
            node->right = deleteNode(node->right, val);
        } else {
            // 找到要刪除的節點
            if (!node->left || !node->right) {
                AVLNode* temp = node->left ? node->left : node->right;
                if (!temp) {
                    temp = node;
                    node = nullptr;
                } else {
                    *node = *temp;
                }
                delete temp;
            } else {
                // 有兩個子節點：找到右子樹的最小節點
                AVLNode* temp = minValueNode(node->right);
                node->val = temp->val;
                node->right = deleteNode(node->right, temp->val);
            }
        }

        if (!node) return node;

        // 2. 更新高度
        updateHeight(node);

        // 3. 獲取平衡因子
        int balance = getBalance(node);

        // 4. 如果不平衡，執行旋轉

        // Left-Left Case
        if (balance > 1 && getBalance(node->left) >= 0) {
            return rightRotate(node);
        }

        // Left-Right Case
        if (balance > 1 && getBalance(node->left) < 0) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }

        // Right-Right Case
        if (balance < -1 && getBalance(node->right) <= 0) {
            return leftRotate(node);
        }

        // Right-Left Case
        if (balance < -1 && getBalance(node->right) > 0) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

public:
    AVLTree() : root(nullptr) {}

    void insert(int val) {
        root = insert(root, val);
    }

    void remove(int val) {
        root = deleteNode(root, val);
    }

    void inorder() {
        inorderHelper(root);
        cout << endl;
    }

private:
    void inorderHelper(AVLNode* node) {
        if (node) {
            inorderHelper(node->left);
            cout << node->val << " ";
            inorderHelper(node->right);
        }
    }
};
```

## 4. Minimum Spanning Tree (MST)

### 4.1 Kruskal's Algorithm

使用 Union-Find 數據結構，按邊的權重從小到大選擇邊。

```cpp
// LeetCode 1584. Min Cost to Connect All Points
class Solution {
private:
    class UnionFind {
    private:
        vector<int> parent;
        vector<int> rank;

    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
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

            if (rootX == rootY) return false;

            // 按秩合併
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }

            return true;
        }
    };

public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<tuple<int, int, int>> edges;  // (cost, i, j)

        // 建立所有邊
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int cost = abs(points[i][0] - points[j][0]) +
                          abs(points[i][1] - points[j][1]);
                edges.push_back({cost, i, j});
            }
        }

        // 按成本排序
        sort(edges.begin(), edges.end());

        UnionFind uf(n);
        int totalCost = 0;
        int edgesUsed = 0;

        // Kruskal's Algorithm
        for (auto& [cost, i, j] : edges) {
            if (uf.unite(i, j)) {
                totalCost += cost;
                edgesUsed++;

                if (edgesUsed == n - 1) break;  // MST 完成
            }
        }

        return totalCost;
    }
};
```

### 4.2 Prim's Algorithm

使用優先隊列（最小堆），從任意節點開始逐步擴展 MST。

```cpp
class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<bool> inMST(n, false);

        // 優先隊列：(cost, point_index)
        priority_queue<pair<int, int>, vector<pair<int, int>>,
                      greater<pair<int, int>>> pq;

        // 從點 0 開始
        pq.push({0, 0});
        int totalCost = 0;
        int edgesUsed = 0;

        while (edgesUsed < n && !pq.empty()) {
            auto [cost, point] = pq.top();
            pq.pop();

            if (inMST[point]) continue;

            inMST[point] = true;
            totalCost += cost;
            edgesUsed++;

            // 添加所有與當前點相連的邊
            for (int next = 0; next < n; next++) {
                if (!inMST[next]) {
                    int nextCost = abs(points[point][0] - points[next][0]) +
                                  abs(points[point][1] - points[next][1]);
                    pq.push({nextCost, next});
                }
            }
        }

        return totalCost;
    }
};
```

## 5. Trie (前綴樹)

```cpp
// LeetCode 208. Implement Trie (Prefix Tree)
class Trie {
private:
    struct TrieNode {
        bool isEnd;
        unordered_map<char, TrieNode*> children;
        TrieNode() : isEnd(false) {}
    };

    TrieNode* root;

public:
    Trie() {
        root = new TrieNode();
    }

    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                return false;
            }
            node = node->children[c];
        }
        return node->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c)) {
                return false;
            }
            node = node->children[c];
        }
        return true;
    }
};
```

## 6. 總結

### 6.1 樹結構比較

| 樹類型 | 特點 | 時間複雜度 | 應用 |
|--------|------|-----------|------|
| Binary Tree | 每個節點最多2個子節點 | - | 表達式樹 |
| BST | 有序的二元樹 | O(h) | 查找、排序 |
| AVL Tree | 自平衡 BST | O(log n) | 頻繁插入/刪除 |
| Red-Black Tree | 較寬鬆的平衡 | O(log n) | STL map/set |
| B-Tree | 多路平衡樹 | O(log n) | 數據庫索引 |
| Trie | 字符串專用樹 | O(m) | 自動補全 |

### 6.2 關鍵概念

1. **BST 操作**：利用有序性質，時間複雜度取決於高度
2. **平衡樹**：通過旋轉操作維持平衡，保證 O(log n) 性能
3. **MST**：連接所有節點的最小成本生成樹
4. **Trie**：高效處理字符串前綴查詢
