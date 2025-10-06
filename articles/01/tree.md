---
title: "Tree (樹)"
order: 8
description: "Binary Tree、BST、TreeNode 結構，以及各種樹的變體"
tags: ["Tree", "Binary Tree", "BST", "AVL", "Red-Black Tree"]
---

# Tree (樹)

## 前言

**Tree (樹)** 是一種非線性的資料結構，由節點 (Node) 和邊 (Edge) 組成，廣泛應用於檔案系統、資料庫索引、編譯器等。

---

## 基本概念

### 術語

```
        1        ← root (根)
       / \
      2   3      ← siblings (兄弟)
     / \   \
    4   5   6    ← leaves (葉節點)

- 節點 (Node): 包含資料的元素
- 根 (Root): 最頂層的節點 (1)
- 父節點 (Parent): 節點 2 的父節點是 1
- 子節點 (Child): 節點 1 的子節點是 2, 3
- 葉節點 (Leaf): 沒有子節點的節點 (4, 5, 6)
- 深度 (Depth): 從根到節點的邊數 (節點 4 深度 = 2)
- 高度 (Height): 從節點到最深葉節點的邊數 (樹高 = 2)
```

---

## Binary Tree (二元樹)

### 定義

每個節點**最多有兩個子節點**的樹。

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

### 類型

#### 1. Full Binary Tree (滿二元樹)

每個節點都有 0 或 2 個子節點。

```
        1
       / \
      2   3
     / \
    4   5
```

#### 2. Complete Binary Tree (完全二元樹)

除了最後一層，其他層都是滿的，且最後一層節點靠左排列。

```
        1
       / \
      2   3
     / \  /
    4  5 6
```

**應用**: Heap

#### 3. Perfect Binary Tree (完美二元樹)

所有葉節點在同一層，所有內部節點都有兩個子節點。

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

**特性**: 節點數 = 2^h - 1 (h 為高度)

---

## Tree Traversal (樹的遍歷)

### 1. Preorder (前序遍歷)

順序：**根 → 左 → 右**

```cpp
void preorder(TreeNode* root) {
    if (root == nullptr) return;

    cout << root->val << " ";  // 訪問根
    preorder(root->left);      // 左子樹
    preorder(root->right);     // 右子樹
}

// 迭代版本
void preorderIterative(TreeNode* root) {
    if (root == nullptr) return;

    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();

        cout << node->val << " ";

        // 先右後左（因為 stack 是 LIFO）
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
}
```

**範例**:
```
Tree:    1
        / \
       2   3
      / \
     4   5

Preorder: 1 → 2 → 4 → 5 → 3
```

### 2. Inorder (中序遍歷)

順序：**左 → 根 → 右**

```cpp
void inorder(TreeNode* root) {
    if (root == nullptr) return;

    inorder(root->left);       // 左子樹
    cout << root->val << " ";  // 訪問根
    inorder(root->right);      // 右子樹
}

// 迭代版本
void inorderIterative(TreeNode* root) {
    stack<TreeNode*> st;
    TreeNode* curr = root;

    while (curr != nullptr || !st.empty()) {
        // 一路向左
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        }

        curr = st.top();
        st.pop();
        cout << curr->val << " ";

        curr = curr->right;
    }
}
```

**範例**:
```
Tree:    1
        / \
       2   3
      / \
     4   5

Inorder: 4 → 2 → 5 → 1 → 3
```

**重要**: BST 的中序遍歷是**有序的**！

### 3. Postorder (後序遍歷)

順序：**左 → 右 → 根**

```cpp
void postorder(TreeNode* root) {
    if (root == nullptr) return;

    postorder(root->left);     // 左子樹
    postorder(root->right);    // 右子樹
    cout << root->val << " ";  // 訪問根
}

// 迭代版本（較複雜）
void postorderIterative(TreeNode* root) {
    if (root == nullptr) return;

    stack<TreeNode*> st1, st2;
    st1.push(root);

    while (!st1.empty()) {
        TreeNode* node = st1.top();
        st1.pop();
        st2.push(node);

        if (node->left) st1.push(node->left);
        if (node->right) st1.push(node->right);
    }

    while (!st2.empty()) {
        cout << st2.top()->val << " ";
        st2.pop();
    }
}
```

**範例**:
```
Tree:    1
        / \
       2   3
      / \
     4   5

Postorder: 4 → 5 → 2 → 3 → 1
```

### 4. Level Order (層序遍歷)

使用 **BFS** (Queue)。

```cpp
void levelOrder(TreeNode* root) {
    if (root == nullptr) return;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();

        cout << node->val << " ";

        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}

// 分層輸出
vector<vector<int>> levelOrderGroups(TreeNode* root) {
    vector<vector<int>> result;
    if (root == nullptr) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;

        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();

            level.push_back(node->val);

            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }

        result.push_back(level);
    }

    return result;
}
```

**範例**:
```
Tree:    1
        / \
       2   3
      / \
     4   5

Level Order: 1 → 2 → 3 → 4 → 5
分層: [[1], [2, 3], [4, 5]]
```

---

## BST (Binary Search Tree)

### 定義

BST 滿足以下性質：
- 左子樹的所有值 < 根節點的值
- 右子樹的所有值 > 根節點的值
- 左右子樹也都是 BST

```
       5
      / \
     3   7
    / \ / \
   2  4 6  8

所有操作基於：左 < 根 < 右
```

### 基本操作

#### 1. 搜尋 (Search)

```cpp
TreeNode* search(TreeNode* root, int val) {
    if (root == nullptr || root->val == val) {
        return root;
    }

    if (val < root->val) {
        return search(root->left, val);
    } else {
        return search(root->right, val);
    }
}

// 迭代版本
TreeNode* searchIterative(TreeNode* root, int val) {
    while (root != nullptr && root->val != val) {
        if (val < root->val) {
            root = root->left;
        } else {
            root = root->right;
        }
    }
    return root;
}
```

**時間複雜度**:
- 平均 O(log n)
- 最壞 O(n) (退化成鏈表)

#### 2. 插入 (Insert)

```cpp
TreeNode* insert(TreeNode* root, int val) {
    if (root == nullptr) {
        return new TreeNode(val);
    }

    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    // val == root->val 時不插入（避免重複）

    return root;
}
```

#### 3. 刪除 (Delete)

```cpp
TreeNode* deleteNode(TreeNode* root, int val) {
    if (root == nullptr) return nullptr;

    if (val < root->val) {
        root->left = deleteNode(root->left, val);
    } else if (val > root->val) {
        root->right = deleteNode(root->right, val);
    } else {
        // 找到要刪除的節點

        // Case 1: 葉節點或只有一個子節點
        if (root->left == nullptr) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }

        // Case 2: 有兩個子節點
        // 找右子樹的最小值（或左子樹的最大值）
        TreeNode* minNode = findMin(root->right);
        root->val = minNode->val;
        root->right = deleteNode(root->right, minNode->val);
    }

    return root;
}

TreeNode* findMin(TreeNode* node) {
    while (node->left != nullptr) {
        node = node->left;
    }
    return node;
}
```

**刪除示意**:
```
刪除節點 5:

原始:      5
          / \
         3   7
        /   / \
       2   6   8

步驟:
1. 找右子樹最小值 (6)
2. 用 6 替換 5
3. 刪除右子樹中的 6

結果:      6
          / \
         3   7
        /     \
       2       8
```

#### 4. 驗證 BST

```cpp
bool isValidBST(TreeNode* root) {
    return validate(root, LONG_MIN, LONG_MAX);
}

bool validate(TreeNode* node, long min, long max) {
    if (node == nullptr) return true;

    if (node->val <= min || node->val >= max) {
        return false;
    }

    return validate(node->left, min, node->val) &&
           validate(node->right, node->val, max);
}
```

---

## 平衡二元樹

### 為什麼需要平衡？

BST 可能退化成鏈表：

```
插入: 1, 2, 3, 4, 5

退化成鏈表:
1
 \
  2
   \
    3
     \
      4
       \
        5

所有操作變成 O(n)！
```

**解決方法**: 使用自平衡樹

---

### AVL Tree

**定義**: 任何節點的左右子樹高度差 ≤ 1

```
AVL Tree:
        4
       / \
      2   6
     / \ / \
    1  3 5  7

每個節點的平衡因子 = |height(left) - height(right)| ≤ 1
```

**操作**:
- 插入/刪除後，透過**旋轉**恢復平衡
- 時間複雜度：O(log n) 保證

**旋轉類型**:
```
Left Rotation (左旋):
    x              y
   / \            / \
  A   y    →     x   C
     / \        / \
    B   C      A   B

Right Rotation (右旋):
      y          x
     / \        / \
    x   C  →   A   y
   / \            / \
  A   B          B   C
```

---

### Red-Black Tree (紅黑樹)

**性質**:
1. 每個節點是紅色或黑色
2. 根節點是黑色
3. 所有葉節點 (NIL) 是黑色
4. 紅色節點的子節點必須是黑色
5. 從任一節點到其葉節點的所有路徑，包含相同數量的黑色節點

```
        10(B)
       /     \
     5(R)    15(R)
    /  \     /  \
  3(B) 7(B) 12(B) 18(B)

B = Black, R = Red
```

**優點**:
- 保證 O(log n) 操作
- 比 AVL 樹旋轉次數少（插入最多 2 次，刪除最多 3 次）
- C++ `map`, `set` 使用紅黑樹

**vs AVL**:

| 特性 | AVL Tree | Red-Black Tree |
|-----|----------|---------------|
| **平衡性** | 更嚴格 | 較寬鬆 |
| **查找速度** | 更快 | 稍慢 |
| **插入/刪除** | 更多旋轉 | 更少旋轉 |
| **適用** | 查找密集 | 插入/刪除密集 |

---

## 其他樹

### Trie (字典樹)

用於字串搜尋。

```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd;
    TrieNode() : isEnd(false) {}
};

class Trie {
private:
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

**應用**: 自動補全、拼寫檢查

### Segment Tree (線段樹)

用於區間查詢。

**應用**: 區間和、區間最大值

### B-Tree / B+ Tree

**應用**: 資料庫索引、檔案系統

---

## LeetCode 練習題

### Binary Tree 基礎
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
- [Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)

### Tree Traversal
- [Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

### BST
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
- [Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

### 進階
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
- [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

---

## 重點總結

### Binary Tree
- **遍歷**: Preorder (根左右), Inorder (左根右), Postorder (左右根), Level Order (BFS)
- **遞迴 vs 迭代**: 遞迴簡潔，迭代需要 stack/queue

### BST
- **性質**: 左 < 根 < 右
- **中序遍歷**: 有序序列
- **操作**: 搜尋、插入、刪除 平均 O(log n)
- **問題**: 可能退化成 O(n)

### 平衡樹
- **AVL**: 嚴格平衡，查找快
- **Red-Black Tree**: 寬鬆平衡，插入/刪除快
- **應用**: C++ `map`/`set` 用紅黑樹

### 選擇建議
- 需要快速查找且資料有序 → **BST**
- 需要保證 O(log n) → **AVL / Red-Black Tree**
- 字串前綴搜尋 → **Trie**
- 區間查詢 → **Segment Tree**
