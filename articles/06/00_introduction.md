---
title: '06-0. Stack, Queue, Deque, 單調棧介紹'
order: 0
description: '完整介紹堆疊、佇列、雙端佇列與單調棧的概念與實作。從基本操作到進階應用，理解 LIFO、FIFO 特性，掌握單調棧解決 Next Greater Element 等經典問題的核心技巧。'
tags: ['Stack', 'Queue', 'Deque', 'Monotonic Stack', '堆疊', '佇列', '單調棧']
author: Rain Hu
date: '2025-10-08'
draft: false
---

# Stack, Queue, Deque, 單調棧介紹

## Stack（棧）

### 基本概念

Stack 是一種 **LIFO (Last In First Out)** 資料結構，最後放入的元素最先被取出。

```
Push 3 元素的過程：
┌─────┐       ┌─────┐       ┌─────┐
│  3  │       │  3  │       │  3  │
├─────┤       ├─────┤       ├─────┤
│  2  │       │  2  │  <-   │  2  │
├─────┤  <-   ├─────┤       ├─────┤
│  1  │       │  1  │       │  1  │
└─────┘       └─────┘       └─────┘
 push(1)      push(2)       push(3)

Pop 的過程（LIFO）：
3 -> 2 -> 1
```

### STL `std::stack` 用法

```cpp
#include <stack>
#include <iostream>

void stackBasics() {
    std::stack<int> st;

    // 1. push: 壓入元素
    st.push(1);
    st.push(2);
    st.push(3);

    // 2. top: 查看棧頂元素（不移除）
    std::cout << "Top: " << st.top() << "\n";  // 3

    // 3. pop: 移除棧頂元素（無返回值）
    st.pop();
    std::cout << "After pop, top: " << st.top() << "\n";  // 2

    // 4. size: 棧的大小
    std::cout << "Size: " << st.size() << "\n";  // 2

    // 5. empty: 檢查是否為空
    while (!st.empty()) {
        std::cout << st.top() << " ";
        st.pop();
    }
    // 輸出: 2 1
}
```

### Stack 的實作方式

#### 1. 基於陣列的實作

```cpp
class ArrayStack {
private:
    vector<int> data;

public:
    void push(int x) {
        data.push_back(x);
    }

    void pop() {
        if (!empty()) {
            data.pop_back();
        }
    }

    int top() {
        return data.back();
    }

    bool empty() {
        return data.empty();
    }

    int size() {
        return data.size();
    }
};
```

**時間複雜度：**
- Push: O(1) amortized
- Pop: O(1)
- Top: O(1)

#### 2. 基於鏈表的實作

```cpp
class LinkedStack {
private:
    struct Node {
        int val;
        Node* next;
        Node(int x) : val(x), next(nullptr) {}
    };

    Node* head;
    int _size;

public:
    LinkedStack() : head(nullptr), _size(0) {}

    void push(int x) {
        Node* node = new Node(x);
        node->next = head;
        head = node;
        _size++;
    }

    void pop() {
        if (!empty()) {
            Node* temp = head;
            head = head->next;
            delete temp;
            _size--;
        }
    }

    int top() {
        return head->val;
    }

    bool empty() {
        return head == nullptr;
    }

    int size() {
        return _size;
    }

    ~LinkedStack() {
        while (!empty()) {
            pop();
        }
    }
};
```

**時間複雜度：**
- Push: O(1)
- Pop: O(1)
- Top: O(1)

### Stack 的應用場景

1. **函數調用棧**：記錄函數調用順序
2. **表達式求值**：中綴轉後綴、計算後綴表達式
3. **括號匹配**：檢查括號是否合法
4. **深度優先搜尋（DFS）**：非遞迴實作
5. **單調棧**：找下一個更大/更小的元素

---

## Queue（隊列）

### 基本概念

Queue 是一種 **FIFO (First In First Out)** 資料結構，最先放入的元素最先被取出。

```
Enqueue 3 個元素的過程：
Front                     Rear
  ↓                         ↓
┌───┐                   ┌───┐
│ 1 │                   │ 1 │
└───┘                   ├───┤
  enqueue(1)            │ 2 │
                        └───┘
                          enqueue(2)

Front                           Rear
  ↓                               ↓
┌───┬───┬───┐
│ 1 │ 2 │ 3 │
└───┴───┴───┘
    enqueue(3)

Dequeue 的過程（FIFO）：
1 -> 2 -> 3
```

### STL `std::queue` 用法

```cpp
#include <queue>
#include <iostream>

void queueBasics() {
    std::queue<int> q;

    // 1. push: 加入元素到隊尾
    q.push(1);
    q.push(2);
    q.push(3);

    // 2. front: 查看隊首元素
    std::cout << "Front: " << q.front() << "\n";  // 1

    // 3. back: 查看隊尾元素
    std::cout << "Back: " << q.back() << "\n";    // 3

    // 4. pop: 移除隊首元素
    q.pop();
    std::cout << "After pop, front: " << q.front() << "\n";  // 2

    // 5. size 和 empty
    std::cout << "Size: " << q.size() << "\n";

    while (!q.empty()) {
        std::cout << q.front() << " ";
        q.pop();
    }
    // 輸出: 2 3
}
```

### Queue 的實作方式

#### 1. 基於循環陣列的實作

```cpp
class CircularQueue {
private:
    vector<int> data;
    int front_idx;
    int rear_idx;
    int _size;
    int capacity;

public:
    CircularQueue(int k) : data(k), front_idx(0), rear_idx(-1), _size(0), capacity(k) {}

    bool enqueue(int x) {
        if (isFull()) return false;
        rear_idx = (rear_idx + 1) % capacity;
        data[rear_idx] = x;
        _size++;
        return true;
    }

    bool dequeue() {
        if (isEmpty()) return false;
        front_idx = (front_idx + 1) % capacity;
        _size--;
        return true;
    }

    int front() {
        return isEmpty() ? -1 : data[front_idx];
    }

    int rear() {
        return isEmpty() ? -1 : data[rear_idx];
    }

    bool isEmpty() {
        return _size == 0;
    }

    bool isFull() {
        return _size == capacity;
    }

    int size() {
        return _size;
    }
};
```

**時間複雜度：**
- Enqueue: O(1)
- Dequeue: O(1)
- Front/Rear: O(1)

#### 2. 基於鏈表的實作

```cpp
class LinkedQueue {
private:
    struct Node {
        int val;
        Node* next;
        Node(int x) : val(x), next(nullptr) {}
    };

    Node* front_node;
    Node* rear_node;
    int _size;

public:
    LinkedQueue() : front_node(nullptr), rear_node(nullptr), _size(0) {}

    void push(int x) {
        Node* node = new Node(x);
        if (empty()) {
            front_node = rear_node = node;
        } else {
            rear_node->next = node;
            rear_node = node;
        }
        _size++;
    }

    void pop() {
        if (!empty()) {
            Node* temp = front_node;
            front_node = front_node->next;
            if (front_node == nullptr) {
                rear_node = nullptr;
            }
            delete temp;
            _size--;
        }
    }

    int front() {
        return front_node->val;
    }

    int back() {
        return rear_node->val;
    }

    bool empty() {
        return front_node == nullptr;
    }

    int size() {
        return _size;
    }

    ~LinkedQueue() {
        while (!empty()) {
            pop();
        }
    }
};
```

### Queue 的應用場景

1. **廣度優先搜尋（BFS）**：層序遍歷
2. **任務調度**：先來先服務
3. **緩衝區**：IO 緩衝、消息隊列
4. **打印隊列**：按順序處理打印任務

---

## Deque（雙端隊列）

### 基本概念

Deque (Double-ended Queue) 是一種可以在兩端進行插入和刪除操作的資料結構。

```
Front                           Back
  ↓                               ↓
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │
└───┴───┴───┴───┴───┘
  ↑                   ↑
可以在兩端進行操作
```

### STL `std::deque` 用法

```cpp
#include <deque>
#include <iostream>

void dequeBasics() {
    std::deque<int> dq;

    // 1. 在後端操作
    dq.push_back(1);   // [1]
    dq.push_back(2);   // [1, 2]

    // 2. 在前端操作
    dq.push_front(0);  // [0, 1, 2]
    dq.push_front(-1); // [-1, 0, 1, 2]

    // 3. 訪問元素
    std::cout << "Front: " << dq.front() << "\n";  // -1
    std::cout << "Back: " << dq.back() << "\n";    // 2
    std::cout << "dq[1]: " << dq[1] << "\n";       // 0

    // 4. 刪除元素
    dq.pop_front();    // [0, 1, 2]
    dq.pop_back();     // [0, 1]

    // 5. 隨機訪問（支持 operator[]）
    for (int i = 0; i < dq.size(); i++) {
        std::cout << dq[i] << " ";
    }
    // 輸出: 0 1
}
```

### Deque 的特性

```cpp
// Deque vs Vector vs List
void dequeFeatures() {
    std::deque<int> dq;

    // 1. 兩端操作都是 O(1)
    dq.push_front(1);  // O(1)
    dq.push_back(2);   // O(1)
    dq.pop_front();    // O(1)
    dq.pop_back();     // O(1)

    // 2. 支持隨機訪問 O(1)
    int x = dq[0];     // O(1)

    // 3. 中間插入/刪除是 O(n)
    dq.insert(dq.begin() + 1, 10);  // O(n)
    dq.erase(dq.begin() + 1);       // O(n)
}
```

**比較：**

| 操作 | Vector | List | Deque |
|------|--------|------|-------|
| 前端插入 | O(n) | O(1) | O(1) |
| 後端插入 | O(1)* | O(1) | O(1) |
| 隨機訪問 | O(1) | O(n) | O(1) |
| 中間插入 | O(n) | O(1)** | O(n) |

\* amortized
\** 如果已有迭代器

### Deque 的應用場景

1. **滑動窗口最大值**：單調隊列
2. **工作竊取隊列**：多線程任務調度
3. **撤銷/重做功能**：需要兩端操作
4. **回文檢查**：從兩端比較

---

## 單調棧（Monotonic Stack）

### 基本概念

單調棧是一種特殊的棧，棧內元素保持單調性（遞增或遞減）。

#### 單調遞減棧

```
處理序列 [2, 1, 5, 6, 2, 3]，維護單調遞減棧：

i=0, num=2:  Stack: [2]
i=1, num=1:  Stack: [2, 1]  (1 < 2，符合遞減)
i=2, num=5:  彈出 1, 2      (5 > 1 和 5 > 2)
             Stack: [5]
i=3, num=6:  彈出 5         (6 > 5)
             Stack: [6]
i=4, num=2:  Stack: [6, 2]  (2 < 6，符合遞減)
i=5, num=3:  彈出 2         (3 > 2)
             Stack: [6, 3]
```

#### 單調遞增棧

```
處理序列 [2, 1, 5, 6, 2, 3]，維護單調遞增棧：

i=0, num=2:  Stack: [2]
i=1, num=1:  彈出 2         (1 < 2)
             Stack: [1]
i=2, num=5:  Stack: [1, 5]  (5 > 1，符合遞增)
i=3, num=6:  Stack: [1, 5, 6]  (6 > 5，符合遞增)
i=4, num=2:  彈出 6, 5      (2 < 6 和 2 < 5)
             Stack: [1, 2]
i=5, num=3:  Stack: [1, 2, 3]  (3 > 2，符合遞增)
```

### 單調棧的實作模板

#### 模板 1: 找下一個更大的元素（單調遞減棧）

```cpp
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存索引

    for (int i = 0; i < n; i++) {
        // 當前元素比棧頂大，說明找到了棧頂元素的下一個更大元素
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }

    return result;
}

// 示例：
// nums = [2, 1, 2, 4, 3]
// result = [4, 2, 4, -1, -1]
```

#### 模板 2: 找下一個更小的元素（單調遞增棧）

```cpp
vector<int> nextSmallerElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存索引

    for (int i = 0; i < n; i++) {
        // 當前元素比棧頂小，說明找到了棧頂元素的下一個更小元素
        while (!st.empty() && nums[i] < nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }

    return result;
}

// 示例：
// nums = [4, 2, 3, 1, 5]
// result = [2, 1, 1, -1, -1]
```

#### 模板 3: 找前一個更大的元素

```cpp
vector<int> previousGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存索引，維護單調遞減

    for (int i = 0; i < n; i++) {
        // 彈出所有小於等於當前元素的元素
        while (!st.empty() && nums[st.top()] <= nums[i]) {
            st.pop();
        }
        // 棧頂就是前一個更大的元素
        if (!st.empty()) {
            result[i] = nums[st.top()];
        }
        st.push(i);
    }

    return result;
}

// 示例：
// nums = [2, 1, 2, 4, 3]
// result = [-1, -1, -1, -1, 4]
```

### 單調棧的應用場景

1. **Next Greater Element**：找下一個更大的元素
2. **Daily Temperatures**：找下一個更高溫度的天數
3. **Largest Rectangle in Histogram**：柱狀圖中最大矩形
4. **Trapping Rain Water**：接雨水問題
5. **Stock Span Problem**：股票價格跨度

### 單調棧的時間複雜度分析

雖然有嵌套循環，但每個元素最多入棧一次、出棧一次：

```cpp
for (int i = 0; i < n; i++) {           // n 次迭代
    while (!st.empty() && ...) {        // 總共最多 n 次 pop
        st.pop();
    }
    st.push(i);                         // n 次 push
}
```

**總時間複雜度：O(n)**
- 每個元素最多入棧一次：n 次
- 每個元素最多出棧一次：n 次
- 總操作數：2n = O(n)

---

## 總結

| 資料結構 | 特性 | 主要操作 | 時間複雜度 | 應用場景 |
|---------|------|---------|-----------|---------|
| Stack | LIFO | push, pop, top | O(1) | DFS, 括號匹配, 表達式求值 |
| Queue | FIFO | push, pop, front | O(1) | BFS, 任務調度 |
| Deque | 雙端操作 | push/pop_front/back | O(1) | 滑動窗口, 單調隊列 |
| 單調棧 | 維護單調性 | 同 Stack | O(n) 總體 | Next Greater, 矩形面積 |

### 選擇建議

1. **需要 LIFO**：使用 Stack
2. **需要 FIFO**：使用 Queue
3. **需要兩端操作**：使用 Deque
4. **需要找最大/最小值**：考慮單調棧/隊列
5. **需要隨機訪問**：Deque 優於 Queue

在接下來的章節中，我們將深入探討這些資料結構的具體應用：
- 使用 Stack 實作迭代式 DFS
- 使用單調棧解決 Next Greater Element 問題
- 使用單調棧計算矩形面積
