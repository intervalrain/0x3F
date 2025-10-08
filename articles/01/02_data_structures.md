---
title: 01-2. 基本資料結構
order: 2
description: Array 與 Linked List 的特性、CRUD 操作，以及資料結構的選擇策略
tags:
  - 資料結構
  - Array
  - Linked List
  - Tree
author: Rain Hu
date: ''
draft: true
---

# 基本資料結構 (Basic Data Structures)

## 前言

對於任何資料結構，我們最關心的是它的 **CRUD** 操作：
- **C**reate (建立)
- **R**ead (讀取)
- **U**pdate (更新)
- **D**elete (刪除)

所有複雜的資料結構，都是以 **Array** 或 **Linked List** 為基礎延伸而來。

---

## Array (陣列)

### 概念

陣列是一種**連續記憶體空間**儲存相同類型元素的資料結構。

```cpp
int arr[5] = {1, 2, 3, 4, 5};
vector<int> vec = {1, 2, 3, 4, 5};
```

### 優勢

- **隨機存取快速**：透過索引直接訪問元素，O(1)
- **記憶體局部性好**：連續記憶體空間，對 CPU cache 友善
- **節省記憶體**：不需要額外指標空間

### 劣勢

- **插入/刪除慢**：需要移動大量元素，O(n)
- **固定大小**：靜態陣列需要預先分配空間
- **擴容成本高**：動態陣列擴容時需要複製所有元素

### CRUD 時間複雜度

| 操作 | 時間複雜度 | 說明 |
|-----|----------|------|
| **Create** | O(1) | 在末尾新增元素 |
| **Read** | O(1) | 透過索引直接訪問 |
| **Update** | O(1) | 透過索引直接修改 |
| **Delete** | O(n) | 刪除後需移動後續元素 |
| **Insert** | O(n) | 插入後需移動後續元素 |
| **Search** | O(n) | 未排序陣列需線性搜尋 |

### Traversal (遍歷)

```cpp
// 方法 1: 傳統 for 迴圈
for (int i = 0; i < arr.size(); i++) {
    cout << arr[i] << " ";
}

// 方法 2: Range-based for loop
for (int num : arr) {
    cout << num << " ";
}

// 方法 3: 使用迭代器
for (auto it = arr.begin(); it != arr.end(); it++) {
    cout << *it << " ";
}
```

---

## Linked List (鏈結串列)

### 概念

鏈結串列是由節點組成的資料結構，每個節點包含**資料**和**指向下一個節點的指標**。

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
```

### 優勢

- **插入/刪除快速**：只需修改指標，O(1)
- **動態大小**：不需要預先分配空間
- **不需要連續記憶體**：適合記憶體碎片化的情況

### 劣勢

- **隨機存取慢**：需要從頭遍歷，O(n)
- **額外記憶體開銷**：每個節點需要儲存指標
- **記憶體局部性差**：節點分散在記憶體中

### CRUD 時間複雜度

| 操作 | 時間複雜度 | 說明 |
|-----|----------|------|
| **Create** | O(1) | 在頭部新增節點 |
| **Read** | O(n) | 需要遍歷找到目標節點 |
| **Update** | O(n) | 先找到節點 O(n)，再更新 O(1) |
| **Delete** | O(n) | 需要找到前一個節點 |
| **Insert** | O(1) | 已知位置時，僅需修改指標 |
| **Search** | O(n) | 必須線性搜尋 |

### Traversal (遍歷)

```cpp
// 方法 1: 迭代法 (while)
ListNode* curr = head;
while (curr != nullptr) {
    cout << curr->val << " ";
    curr = curr->next;
}

// 方法 2: 迭代法 (for)
for (ListNode* curr = head; curr; curr = curr->next) {
    cout << curr->val << " ";
}

// 方法 3: 遞迴法
void traverse(ListNode* node) {
    if (node == nullptr) return;
    cout << node->val << " ";
    traverse(node->next);
}
```

---

## Binary Tree (二元樹)

### 概念

二元樹是一種特殊的鏈結結構，每個節點最多有**兩個子節點**。

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

### Traversal (遍歷)

```cpp
// 前序遍歷 (Pre-order): 根 -> 左 -> 右
void preorder(TreeNode* root) {
    if (root == nullptr) return;
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}

// 中序遍歷 (In-order): 左 -> 根 -> 右
void inorder(TreeNode* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

// 後序遍歷 (Post-order): 左 -> 右 -> 根
void postorder(TreeNode* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}

// 層序遍歷 (Level-order): 使用 Queue
void levelorder(TreeNode* root) {
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
```

---

## 資料結構的本質

所有的資料結構，本質上都是以 **Array** 或 **Linked List** 為基礎延伸而來：

| 資料結構 | 底層實作 |
|---------|---------|
| **Stack** | Array 或 Linked List |
| **Queue** | Array 或 Linked List |
| **Hash Table** | Array + Linked List (解決碰撞) |
| **Heap** | Array (Complete Binary Tree) |
| **Graph** | Array (鄰接矩陣) 或 Linked List (鄰接串列) |
| **Tree** | Linked List (節點 + 指標) |

---

## Trade-off 策略：如何選擇資料結構？

在選擇資料結構時，我們需要根據**使用場景**來權衡：

### 1. 存取模式

| 需求 | 推薦資料結構 |
|-----|------------|
| **頻繁隨機存取** | Array |
| **頻繁插入/刪除** | Linked List |
| **需要快速搜尋** | Hash Table / BST |
| **需要排序** | Array + Sort / BST |

### 2. 記憶體考量

| 需求 | 推薦資料結構 |
|-----|------------|
| **記憶體有限** | Array (省空間) |
| **記憶體碎片化** | Linked List |
| **需要動態擴展** | Linked List / Dynamic Array |

### 3. 效能考量

| 需求 | 推薦資料結構 |
|-----|------------|
| **快速讀取** | Array |
| **快速插入** | Linked List |
| **平衡讀寫** | Hash Table / Balanced BST |

### 實際案例

```cpp
// 案例 1: LeetCode 常見場景 - 需要快速查找
// 使用 Hash Table (unordered_map/unordered_set)
unordered_set<int> seen;
if (seen.count(num)) {
    // O(1) 查找
}

// 案例 2: 需要頻繁插入刪除 - 使用 Linked List
// LeetCode 206. Reverse Linked List
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    while (head) {
        ListNode* next = head->next;
        head->next = prev;
        prev = head;
        head = next;
    }
    return prev;
}

// 案例 3: 需要有序資料 - 使用 Array + Sort
// LeetCode 977. Squares of a Sorted Array
vector<int> sortedSquares(vector<int>& nums) {
    for (int& num : nums) {
        num = num * num;
    }
    sort(nums.begin(), nums.end());  // O(n log n)
    return nums;
}
```

---

## 延伸思考

1. **時間與空間的權衡**
   - Hash Table：用空間換時間
   - Dynamic Programming：用空間換時間（記憶化）

2. **何時選擇 Array？**
   - 需要隨機存取
   - 資料大小已知且固定
   - 記憶體局部性很重要

3. **何時選擇 Linked List？**
   - 頻繁的插入/刪除操作
   - 資料大小不確定
   - 不需要隨機存取

4. **複合資料結構**
   - Hash Table = Array + Linked List
   - Priority Queue = Heap (Array-based)
   - Graph = Array (Matrix) 或 Linked List (Adjacency List)

---

## LeetCode 練習題

### Array 相關
- [Two Sum](https://leetcode.com/problems/two-sum/)
- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

### Linked List 相關
- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

### Tree 相關
- [Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

---

## 重點總結

- **Array** 適合頻繁讀取、隨機存取的場景
- **Linked List** 適合頻繁插入、刪除的場景
- 所有複雜資料結構都是基於這兩者延伸
- 選擇資料結構時，考慮**時間、空間、使用場景**的權衡
- LeetCode 中最常用的是 **Array、Hash Table、Linked List、Tree**
