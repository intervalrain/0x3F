---
title: 05-4. Binary Tree
order: 4
description: '全面掌握二元樹的基礎知識與遍歷技巧。包含前序、中序、後序遍歷的遞迴與迭代實作，以及層序遍歷、路徑問題、樹的構造等經典題型解析。'
tags: ['Binary Tree', 'Tree Traversal', 'DFS', 'BFS', '二元樹', '樹遍歷']
author: Rain Hu
date: ''
draft: true
---

# Binary Tree (二元樹)

## 1. 基本概念

### 1.1 定義

二元樹是每個節點最多有兩個子節點的樹結構。

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

### 1.2 基本術語

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

- **根節點** (Root): 1
- **葉節點** (Leaf): 4, 5, 6
- **深度** (Depth): 節點到根的路徑長度
- **高度** (Height): 節點到最深葉節點的路徑長度
- **層級** (Level): 深度 + 1

## 2. 樹的遍歷

### 2.1 前序遍歷 (Preorder: Root -> Left -> Right)

#### 遞迴實現

```cpp
// LeetCode 144. Binary Tree Preorder Traversal
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        preorder(root, result);
        return result;
    }

private:
    void preorder(TreeNode* node, vector<int>& result) {
        if (!node) return;

        result.push_back(node->val);  // 訪問根節點
        preorder(node->left, result);  // 遍歷左子樹
        preorder(node->right, result); // 遍歷右子樹
    }
};
```

#### 迭代實現

```cpp
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        if (!root) return result;

        stack<TreeNode*> stk;
        stk.push(root);

        while (!stk.empty()) {
            TreeNode* node = stk.top();
            stk.pop();

            result.push_back(node->val);

            // 先右後左，因為棧是後進先出
            if (node->right) stk.push(node->right);
            if (node->left) stk.push(node->left);
        }

        return result;
    }
};
```

### 2.2 中序遍歷 (Inorder: Left -> Root -> Right)

#### 遞迴實現

```cpp
// LeetCode 94. Binary Tree Inorder Traversal
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        inorder(root, result);
        return result;
    }

private:
    void inorder(TreeNode* node, vector<int>& result) {
        if (!node) return;

        inorder(node->left, result);   // 遍歷左子樹
        result.push_back(node->val);   // 訪問根節點
        inorder(node->right, result);  // 遍歷右子樹
    }
};
```

#### 迭代實現

```cpp
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> stk;
        TreeNode* curr = root;

        while (curr || !stk.empty()) {
            // 一直往左走到底
            while (curr) {
                stk.push(curr);
                curr = curr->left;
            }

            // 訪問當前節點
            curr = stk.top();
            stk.pop();
            result.push_back(curr->val);

            // 轉向右子樹
            curr = curr->right;
        }

        return result;
    }
};
```

### 2.3 後序遍歷 (Postorder: Left -> Right -> Root)

#### 遞迴實現

```cpp
// LeetCode 145. Binary Tree Postorder Traversal
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        postorder(root, result);
        return result;
    }

private:
    void postorder(TreeNode* node, vector<int>& result) {
        if (!node) return;

        postorder(node->left, result);  // 遍歷左子樹
        postorder(node->right, result); // 遍歷右子樹
        result.push_back(node->val);    // 訪問根節點
    }
};
```

#### 迭代實現

```cpp
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        if (!root) return result;

        stack<TreeNode*> stk;
        TreeNode* curr = root;
        TreeNode* lastVisited = nullptr;

        while (curr || !stk.empty()) {
            // 一直往左走到底
            while (curr) {
                stk.push(curr);
                curr = curr->left;
            }

            curr = stk.top();

            // 如果右子樹為空或已訪問過，則訪問當前節點
            if (!curr->right || curr->right == lastVisited) {
                result.push_back(curr->val);
                stk.pop();
                lastVisited = curr;
                curr = nullptr;
            } else {
                // 否則訪問右子樹
                curr = curr->right;
            }
        }

        return result;
    }
};
```

### 2.4 層序遍歷 (Level Order)

```cpp
// LeetCode 102. Binary Tree Level Order Traversal
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;

        queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;

            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();

                currentLevel.push_back(node->val);

                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }

            result.push_back(currentLevel);
        }

        return result;
    }
};
```

#### 變體：之字形層序遍歷

```cpp
// LeetCode 103. Binary Tree Zigzag Level Order Traversal
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;

        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;

        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel(levelSize);

            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();

                // 根據方向決定插入位置
                int index = leftToRight ? i : (levelSize - 1 - i);
                currentLevel[index] = node->val;

                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }

            result.push_back(currentLevel);
            leftToRight = !leftToRight;
        }

        return result;
    }
};
```

## 3. 樹的性質

### 3.1 最大深度

```cpp
// LeetCode 104. Maximum Depth of Binary Tree
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```

### 3.2 最小深度

```cpp
// LeetCode 111. Minimum Depth of Binary Tree
class Solution {
public:
    int minDepth(TreeNode* root) {
        if (!root) return 0;
        if (!root->left) return 1 + minDepth(root->right);
        if (!root->right) return 1 + minDepth(root->left);
        return 1 + min(minDepth(root->left), minDepth(root->right));
    }
};
```

### 3.3 Diameter (直徑)

樹的直徑是任意兩個節點之間最長路徑的長度。

```cpp
// LeetCode 543. Diameter of Binary Tree
class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        int diameter = 0;
        height(root, diameter);
        return diameter;
    }

private:
    int height(TreeNode* node, int& diameter) {
        if (!node) return 0;

        int leftHeight = height(node->left, diameter);
        int rightHeight = height(node->right, diameter);

        // 更新直徑：經過當前節點的最長路徑
        diameter = max(diameter, leftHeight + rightHeight);

        return 1 + max(leftHeight, rightHeight);
    }
};
```

### 3.4 平衡樹判斷

```cpp
// LeetCode 110. Balanced Binary Tree
class Solution {
public:
    bool isBalanced(TreeNode* root) {
        return height(root) != -1;
    }

private:
    int height(TreeNode* node) {
        if (!node) return 0;

        int leftHeight = height(node->left);
        if (leftHeight == -1) return -1;

        int rightHeight = height(node->right);
        if (rightHeight == -1) return -1;

        // 如果左右子樹高度差大於1，返回-1表示不平衡
        if (abs(leftHeight - rightHeight) > 1) return -1;

        return 1 + max(leftHeight, rightHeight);
    }
};
```

### 3.5 對稱樹

```cpp
// LeetCode 101. Symmetric Tree
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        return isMirror(root, root);
    }

private:
    bool isMirror(TreeNode* t1, TreeNode* t2) {
        if (!t1 && !t2) return true;
        if (!t1 || !t2) return false;

        return (t1->val == t2->val) &&
               isMirror(t1->left, t2->right) &&
               isMirror(t1->right, t2->left);
    }
};
```

## 4. 最近公共祖先 (LCA)

### 4.1 普通二元樹的 LCA

```cpp
// LeetCode 236. Lowest Common Ancestor of a Binary Tree
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Base case
        if (!root || root == p || root == q) {
            return root;
        }

        // 在左右子樹中查找
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);

        // 如果 p 和 q 分別在左右子樹中，則當前節點是 LCA
        if (left && right) return root;

        // 否則返回非空的那個
        return left ? left : right;
    }
};
```

### 4.2 BST 的 LCA

```cpp
// LeetCode 235. Lowest Common Ancestor of a Binary Search Tree
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // 利用 BST 的性質
        if (root->val > p->val && root->val > q->val) {
            return lowestCommonAncestor(root->left, p, q);
        }
        if (root->val < p->val && root->val < q->val) {
            return lowestCommonAncestor(root->right, p, q);
        }
        return root;
    }
};
```

## 5. 樹的構建

### 5.1 從前序和中序遍歷構建

```cpp
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inorderMap;
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        return build(preorder, 0, preorder.size() - 1,
                    inorder, 0, inorder.size() - 1, inorderMap);
    }

private:
    TreeNode* build(vector<int>& preorder, int preStart, int preEnd,
                    vector<int>& inorder, int inStart, int inEnd,
                    unordered_map<int, int>& inorderMap) {
        if (preStart > preEnd) return nullptr;

        // 前序遍歷的第一個元素是根節點
        int rootVal = preorder[preStart];
        TreeNode* root = new TreeNode(rootVal);

        // 在中序遍歷中找到根節點的位置
        int rootIndex = inorderMap[rootVal];
        int leftSize = rootIndex - inStart;

        // 遞迴構建左右子樹
        root->left = build(preorder, preStart + 1, preStart + leftSize,
                          inorder, inStart, rootIndex - 1, inorderMap);
        root->right = build(preorder, preStart + leftSize + 1, preEnd,
                           inorder, rootIndex + 1, inEnd, inorderMap);

        return root;
    }
};
```

### 5.2 從中序和後序遍歷構建

```cpp
// LeetCode 106. Construct Binary Tree from Inorder and Postorder Traversal
class Solution {
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        unordered_map<int, int> inorderMap;
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        return build(inorder, 0, inorder.size() - 1,
                    postorder, 0, postorder.size() - 1, inorderMap);
    }

private:
    TreeNode* build(vector<int>& inorder, int inStart, int inEnd,
                    vector<int>& postorder, int postStart, int postEnd,
                    unordered_map<int, int>& inorderMap) {
        if (inStart > inEnd) return nullptr;

        // 後序遍歷的最後一個元素是根節點
        int rootVal = postorder[postEnd];
        TreeNode* root = new TreeNode(rootVal);

        int rootIndex = inorderMap[rootVal];
        int leftSize = rootIndex - inStart;

        root->left = build(inorder, inStart, rootIndex - 1,
                          postorder, postStart, postStart + leftSize - 1,
                          inorderMap);
        root->right = build(inorder, rootIndex + 1, inEnd,
                           postorder, postStart + leftSize, postEnd - 1,
                           inorderMap);

        return root;
    }
};
```

## 6. 路徑相關問題

### 6.1 路徑總和

```cpp
// LeetCode 112. Path Sum
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;

        // 到達葉節點，檢查路徑和
        if (!root->left && !root->right) {
            return root->val == targetSum;
        }

        // 遞迴檢查左右子樹
        return hasPathSum(root->left, targetSum - root->val) ||
               hasPathSum(root->right, targetSum - root->val);
    }
};
```

### 6.2 最大路徑和

```cpp
// LeetCode 124. Binary Tree Maximum Path Sum
class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int maxSum = INT_MIN;
        maxGain(root, maxSum);
        return maxSum;
    }

private:
    int maxGain(TreeNode* node, int& maxSum) {
        if (!node) return 0;

        // 遞迴計算左右子樹的最大貢獻
        int leftGain = max(maxGain(node->left, maxSum), 0);
        int rightGain = max(maxGain(node->right, maxSum), 0);

        // 更新最大路徑和（經過當前節點的路徑）
        int currentPath = node->val + leftGain + rightGain;
        maxSum = max(maxSum, currentPath);

        // 返回當前節點的最大貢獻（只能選擇一邊）
        return node->val + max(leftGain, rightGain);
    }
};
```

## 7. 序列化與反序列化

```cpp
// LeetCode 297. Serialize and Deserialize Binary Tree
class Codec {
public:
    // 序列化
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," +
               serialize(root->left) + "," +
               serialize(root->right);
    }

    // 反序列化
    TreeNode* deserialize(string data) {
        queue<string> nodes;
        stringstream ss(data);
        string item;

        while (getline(ss, item, ',')) {
            nodes.push(item);
        }

        return deserializeHelper(nodes);
    }

private:
    TreeNode* deserializeHelper(queue<string>& nodes) {
        string val = nodes.front();
        nodes.pop();

        if (val == "#") return nullptr;

        TreeNode* root = new TreeNode(stoi(val));
        root->left = deserializeHelper(nodes);
        root->right = deserializeHelper(nodes);

        return root;
    }
};
```

## 8. 總結

### 8.1 遍歷方法對比

| 遍歷方式 | 順序 | 遞迴 | 迭代 | 應用 |
|---------|------|------|------|------|
| 前序 | 根-左-右 | 簡單 | 使用棧 | 複製樹、前綴表達式 |
| 中序 | 左-根-右 | 簡單 | 使用棧 | BST 排序 |
| 後序 | 左-右-根 | 簡單 | 較複雜 | 刪除樹、後綴表達式 |
| 層序 | 逐層 | 使用隊列 | 簡單 | 最短路徑 |

### 8.2 關鍵技巧

1. **遞迴**：大多數樹問題都可以用遞迴解決
2. **DFS vs BFS**：深度優先使用棧/遞迴，廣度優先使用隊列
3. **後序遍歷**：適合需要先處理子節點的問題
4. **全局變量**：用於在遞迴中維護狀態（如最大值、直徑）
5. **HashMap**：加速查找（如構建樹時查找根節點位置）
