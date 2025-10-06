---
title: "Stack 與 Queue"
order: 6
description: "Stack (LIFO) 與 Queue (FIFO) 的原理、實作與應用"
tags: ["Stack", "Queue", "LIFO", "FIFO"]
---

# Stack 與 Queue

## 前言

Stack 和 Queue 是兩種最基本的**線性資料結構**，它們的差別在於**元素的存取順序**。

---

## Stack (堆疊)

### 基本概念

Stack 遵循 **LIFO** (Last In, First Out) 原則：**後進先出**。

```
想像一疊盤子：
- 最後放上去的盤子，最先被拿走
- 最先放上去的盤子，最後才能拿到

push(1) → [1]
push(2) → [1, 2]
push(3) → [1, 2, 3]
pop()   → [1, 2]      (移除 3)
pop()   → [1]         (移除 2)
```

### 基本操作

```cpp
#include <stack>
using namespace std;

stack<int> st;

// 1. push - 壓入元素
st.push(1);
st.push(2);
st.push(3);

// 2. pop - 移除頂部元素
st.pop();  // 移除 3

// 3. top - 查看頂部元素
int x = st.top();  // x = 2

// 4. empty - 檢查是否為空
bool isEmpty = st.empty();  // false

// 5. size - 獲取大小
int sz = st.size();  // 2
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **push** | O(1) |
| **pop** | O(1) |
| **top** | O(1) |
| **empty** | O(1) |
| **size** | O(1) |

---

### 實作 Stack

#### 方法 1: 使用 Array (Vector)

```cpp
class Stack {
private:
    vector<int> data;

public:
    void push(int x) {
        data.push_back(x);
    }

    void pop() {
        if (!data.empty()) {
            data.pop_back();
        }
    }

    int top() {
        if (!data.empty()) {
            return data.back();
        }
        return -1;  // 錯誤值
    }

    bool empty() {
        return data.empty();
    }

    int size() {
        return data.size();
    }
};
```

**優點**:
- 實作簡單
- Cache 友善
- 支援隨機存取（雖然通常不需要）

#### 方法 2: 使用 Linked List

```cpp
class Stack {
private:
    struct ListNode {
        int val;
        ListNode* next;
        ListNode(int x) : val(x), next(nullptr) {}
    };

    ListNode* head;
    int _size;

public:
    Stack() : head(nullptr), _size(0) {}

    void push(int x) {
        ListNode* newNode = new ListNode(x);
        newNode->next = head;
        head = newNode;
        _size++;
    }

    void pop() {
        if (head != nullptr) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
            _size--;
        }
    }

    int top() {
        return head ? head->val : -1;
    }

    bool empty() {
        return head == nullptr;
    }

    int size() {
        return _size;
    }
};
```

**優點**:
- 不需要擴容
- 記憶體動態分配

---

### Stack 的應用

#### 1. 括號匹配 (Valid Parentheses)

```cpp
bool isValid(string s) {
    stack<char> st;

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;

            char top = st.top();
            if ((c == ')' && top == '(') ||
                (c == ']' && top == '[') ||
                (c == '}' && top == '{')) {
                st.pop();
            } else {
                return false;
            }
        }
    }

    return st.empty();
}
```

#### 2. 計算器 (Basic Calculator)

```cpp
int calculate(string s) {
    stack<int> st;
    int num = 0;
    char sign = '+';

    for (int i = 0; i < s.size(); i++) {
        char c = s[i];

        if (isdigit(c)) {
            num = num * 10 + (c - '0');
        }

        if ((!isdigit(c) && c != ' ') || i == s.size() - 1) {
            if (sign == '+') {
                st.push(num);
            } else if (sign == '-') {
                st.push(-num);
            } else if (sign == '*') {
                int top = st.top();
                st.pop();
                st.push(top * num);
            } else if (sign == '/') {
                int top = st.top();
                st.pop();
                st.push(top / num);
            }
            sign = c;
            num = 0;
        }
    }

    int result = 0;
    while (!st.empty()) {
        result += st.top();
        st.pop();
    }

    return result;
}
```

#### 3. 單調棧 (Monotonic Stack)

用於解決「下一個更大元素」類問題。

```cpp
// LeetCode 739. Daily Temperatures
vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> result(n, 0);
    stack<int> st;  // 存儲索引

    for (int i = 0; i < n; i++) {
        // 當前溫度比棧頂索引的溫度高
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = i - idx;
        }
        st.push(i);
    }

    return result;
}
```

#### 4. DFS (深度優先搜尋)

```cpp
void dfs(TreeNode* root) {
    if (root == nullptr) return;

    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();

        // 處理節點
        cout << node->val << " ";

        // 先右後左（因為 stack 是 LIFO）
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
}
```

---

## Queue (佇列)

### 基本概念

Queue 遵循 **FIFO** (First In, First Out) 原則：**先進先出**。

```
想像排隊買票：
- 最先排隊的人，最先買到票
- 最後排隊的人，最後才輪到

enqueue(1) → [1]
enqueue(2) → [1, 2]
enqueue(3) → [1, 2, 3]
dequeue()  → [2, 3]      (移除 1)
dequeue()  → [3]         (移除 2)
```

### 基本操作

```cpp
#include <queue>
using namespace std;

queue<int> q;

// 1. push - 加入元素到尾部
q.push(1);
q.push(2);
q.push(3);

// 2. pop - 移除頭部元素
q.pop();  // 移除 1

// 3. front - 查看頭部元素
int x = q.front();  // x = 2

// 4. back - 查看尾部元素
int y = q.back();  // y = 3

// 5. empty - 檢查是否為空
bool isEmpty = q.empty();  // false

// 6. size - 獲取大小
int sz = q.size();  // 2
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **push** | O(1) |
| **pop** | O(1) |
| **front** | O(1) |
| **back** | O(1) |
| **empty** | O(1) |
| **size** | O(1) |

---

### 實作 Queue

#### 方法 1: 使用 Array (Circular Buffer)

```cpp
class Queue {
private:
    vector<int> data;
    int head;
    int tail;
    int size;
    int capacity;

public:
    Queue(int k) : capacity(k), head(0), tail(0), size(0) {
        data.resize(k);
    }

    bool enqueue(int value) {
        if (isFull()) return false;

        data[tail] = value;
        tail = (tail + 1) % capacity;
        size++;
        return true;
    }

    bool dequeue() {
        if (isEmpty()) return false;

        head = (head + 1) % capacity;
        size--;
        return true;
    }

    int front() {
        return isEmpty() ? -1 : data[head];
    }

    int rear() {
        int index = (tail - 1 + capacity) % capacity;
        return isEmpty() ? -1 : data[index];
    }

    bool isEmpty() {
        return size == 0;
    }

    bool isFull() {
        return size == capacity;
    }
};
```

**環形緩衝區示意**:
```
capacity = 5

初始: head = 0, tail = 0
[_, _, _, _, _]
 ↑
head/tail

enqueue(1):
[1, _, _, _, _]
 ↑  ↑
head tail

enqueue(2), enqueue(3):
[1, 2, 3, _, _]
 ↑     ↑
head  tail

dequeue():
[1, 2, 3, _, _]
    ↑  ↑
   head tail

繼續 enqueue 到滿，tail 會回到前面（環形）
```

#### 方法 2: 使用 Linked List

```cpp
class Queue {
private:
    struct ListNode {
        int val;
        ListNode* next;
        ListNode(int x) : val(x), next(nullptr) {}
    };

    ListNode* head;
    ListNode* tail;
    int _size;

public:
    Queue() : head(nullptr), tail(nullptr), _size(0) {}

    void push(int x) {
        ListNode* newNode = new ListNode(x);

        if (tail == nullptr) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
        _size++;
    }

    void pop() {
        if (head == nullptr) return;

        ListNode* temp = head;
        head = head->next;

        if (head == nullptr) {
            tail = nullptr;
        }

        delete temp;
        _size--;
    }

    int front() {
        return head ? head->val : -1;
    }

    int back() {
        return tail ? tail->val : -1;
    }

    bool empty() {
        return head == nullptr;
    }

    int size() {
        return _size;
    }
};
```

---

### Queue 的應用

#### 1. BFS (廣度優先搜尋)

```cpp
void bfs(TreeNode* root) {
    if (root == nullptr) return;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();

        // 處理節點
        cout << node->val << " ";

        // 先左後右
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}
```

#### 2. 層序遍歷 (Level Order Traversal)

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
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

#### 3. 滑動窗口 (需要 deque)

```cpp
// LeetCode 239. Sliding Window Maximum
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;  // 存儲索引
    vector<int> result;

    for (int i = 0; i < nums.size(); i++) {
        // 移除超出窗口的元素
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }

        // 維護遞減隊列
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }

        dq.push_back(i);

        // 窗口形成後開始記錄結果
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}
```

---

## Stack vs Queue 比較

| 特性 | Stack | Queue |
|-----|-------|-------|
| **順序** | LIFO (後進先出) | FIFO (先進先出) |
| **操作** | push, pop, top | push, pop, front, back |
| **應用** | DFS, 括號匹配, 單調棧 | BFS, 層序遍歷, 任務調度 |
| **底層實作** | Array 或 Linked List | Array (環形) 或 Linked List |

---

## 用兩個 Stack 實作 Queue

```cpp
class MyQueue {
private:
    stack<int> inStack;   // 負責 push
    stack<int> outStack;  // 負責 pop

public:
    void push(int x) {
        inStack.push(x);
    }

    int pop() {
        if (outStack.empty()) {
            // 將 inStack 的元素倒到 outStack
            while (!inStack.empty()) {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }

        int val = outStack.top();
        outStack.pop();
        return val;
    }

    int peek() {
        if (outStack.empty()) {
            while (!inStack.empty()) {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }
        return outStack.top();
    }

    bool empty() {
        return inStack.empty() && outStack.empty();
    }
};
```

**時間複雜度**:
- push: O(1)
- pop: 攤銷 O(1)

**示意**:
```
push(1), push(2), push(3):
inStack: [1, 2, 3]
outStack: []

pop():
1. 倒轉到 outStack
   inStack: []
   outStack: [3, 2, 1]

2. 從 outStack pop
   outStack: [3, 2]
   返回 1
```

---

## 用兩個 Queue 實作 Stack

```cpp
class MyStack {
private:
    queue<int> q;

public:
    void push(int x) {
        q.push(x);

        // 將前面的元素移到後面
        int size = q.size();
        for (int i = 0; i < size - 1; i++) {
            q.push(q.front());
            q.pop();
        }
    }

    int pop() {
        int val = q.front();
        q.pop();
        return val;
    }

    int top() {
        return q.front();
    }

    bool empty() {
        return q.empty();
    }
};
```

**示意**:
```
push(1): q = [1]
push(2):
  1. q = [1, 2]
  2. 移動: q = [2, 1]

push(3):
  1. q = [2, 1, 3]
  2. 移動: q = [3, 2, 1]

pop(): 返回 3, q = [2, 1]
```

---

## LeetCode 練習題

### Stack
- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [Min Stack](https://leetcode.com/problems/min-stack/)
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

### Queue
- [Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)
- [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/)

### Stack + Queue
- [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
- [Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)

### 應用
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

---

## 重點總結

### Stack (LIFO)
- **後進先出**：最後放入的最先取出
- **應用**：DFS、括號匹配、單調棧、表達式求值
- **實作**：Array 或 Linked List

### Queue (FIFO)
- **先進先出**：最先放入的最先取出
- **應用**：BFS、層序遍歷、任務調度
- **實作**：環形陣列或 Linked List

### 記憶技巧
- **Stack** = 一疊盤子（LIFO）
- **Queue** = 排隊買票（FIFO）

### 進階概念
- **單調棧/隊列**：維持特定單調性的 Stack/Queue
- **雙端隊列 (Deque)**：結合 Stack 和 Queue 的優點
- **優先隊列 (Priority Queue)**：基於 Heap 實作，下一章介紹
