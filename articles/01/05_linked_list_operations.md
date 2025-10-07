---
title: "Linked List 操作與變體"
order: 5
description: "Linked List 的插入、刪除操作，以及 Doubly Linked List 和 Deque 的介紹"
tags: ["Linked List", "Doubly Linked List", "Deque", "插入", "刪除"]
---

# Linked List 操作與變體

## 前言

Linked List 是最基本的動態資料結構之一。理解其操作細節，對於解決 LeetCode 題目至關重要。

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
```

---

## Singly Linked List 基本操作

### 1. 插入操作 (Insertion)

#### 在頭部插入 (Insert at Head)

```cpp
ListNode* insertAtHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    return newNode;  // 新的頭節點
}
```

**時間複雜度**: O(1)

**步驟**:
```
原始: head -> 1 -> 2 -> 3 -> nullptr

插入 0:
1. newNode = new ListNode(0)
2. newNode->next = head

   0 -> 1 -> 2 -> 3 -> nullptr
   ↑
  head
```

#### 在尾部插入 (Insert at Tail)

```cpp
ListNode* insertAtTail(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);

    // 特殊情況：空鏈表
    if (head == nullptr) {
        return newNode;
    }

    // 找到最後一個節點
    ListNode* curr = head;
    while (curr->next != nullptr) {
        curr = curr->next;
    }

    curr->next = newNode;
    return head;
}
```

**時間複雜度**: O(n) - 需要遍歷到尾部

#### 在指定位置插入 (Insert at Position)

```cpp
ListNode* insertAtPosition(ListNode* head, int pos, int val) {
    // 特殊情況：插入頭部
    if (pos == 0) {
        return insertAtHead(head, val);
    }

    ListNode* curr = head;
    // 移動到插入位置的前一個節點
    for (int i = 0; i < pos - 1 && curr != nullptr; i++) {
        curr = curr->next;
    }

    // 檢查位置是否有效
    if (curr == nullptr) {
        return head;  // 位置無效
    }

    ListNode* newNode = new ListNode(val);
    newNode->next = curr->next;
    curr->next = newNode;

    return head;
}
```

**時間複雜度**: O(n)

**步驟**:
```
原始: 1 -> 2 -> 3 -> nullptr
插入 5 在位置 1 (在 1 和 2 之間):

1. 找到位置 0 的節點 (值為 1)
2. newNode->next = curr->next (指向 2)
3. curr->next = newNode

結果: 1 -> 5 -> 2 -> 3 -> nullptr
```

---

### 2. 刪除操作 (Deletion)

#### 刪除頭節點 (Delete Head)

```cpp
ListNode* deleteHead(ListNode* head) {
    if (head == nullptr) {
        return nullptr;
    }

    ListNode* newHead = head->next;
    delete head;
    return newHead;
}
```

**時間複雜度**: O(1)

#### 刪除尾節點 (Delete Tail)

```cpp
ListNode* deleteTail(ListNode* head) {
    // 空鏈表或只有一個節點
    if (head == nullptr || head->next == nullptr) {
        delete head;
        return nullptr;
    }

    // 找到倒數第二個節點
    ListNode* curr = head;
    while (curr->next->next != nullptr) {
        curr = curr->next;
    }

    delete curr->next;
    curr->next = nullptr;
    return head;
}
```

**時間複雜度**: O(n)

#### 刪除指定值的節點 (Delete by Value)

```cpp
ListNode* deleteValue(ListNode* head, int val) {
    // 處理頭節點就是目標的情況
    while (head != nullptr && head->val == val) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }

    if (head == nullptr) return nullptr;

    // 處理其他節點
    ListNode* curr = head;
    while (curr->next != nullptr) {
        if (curr->next->val == val) {
            ListNode* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        } else {
            curr = curr->next;
        }
    }

    return head;
}
```

**時間複雜度**: O(n)

#### 刪除指定位置的節點 (Delete at Position)

```cpp
ListNode* deleteAtPosition(ListNode* head, int pos) {
    if (head == nullptr) return nullptr;

    // 刪除頭節點
    if (pos == 0) {
        ListNode* newHead = head->next;
        delete head;
        return newHead;
    }

    // 找到要刪除節點的前一個節點
    ListNode* curr = head;
    for (int i = 0; i < pos - 1 && curr->next != nullptr; i++) {
        curr = curr->next;
    }

    // 檢查位置是否有效
    if (curr->next == nullptr) {
        return head;
    }

    ListNode* temp = curr->next;
    curr->next = curr->next->next;
    delete temp;

    return head;
}
```

**時間複雜度**: O(n)

---

### 3. 常見技巧：Dummy Node

使用 **Dummy Node** 可以簡化邊界情況的處理。

```cpp
ListNode* deleteValue(ListNode* head, int val) {
    // 創建 dummy node
    ListNode* dummy = new ListNode(0);
    dummy->next = head;

    ListNode* curr = dummy;
    while (curr->next != nullptr) {
        if (curr->next->val == val) {
            ListNode* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        } else {
            curr = curr->next;
        }
    }

    ListNode* newHead = dummy->next;
    delete dummy;
    return newHead;
}
```

**優點**:
- 不需要特殊處理頭節點
- 代碼更簡潔統一

**示意**:
```
原始: head -> 1 -> 2 -> 3

使用 dummy:
dummy -> 1 -> 2 -> 3
  ↑
 curr

統一處理所有節點
```

---

## Doubly Linked List (雙向鏈表)

### 結構定義

```cpp
struct DoublyListNode {
    int val;
    DoublyListNode* prev;  // 指向前一個節點
    DoublyListNode* next;  // 指向下一個節點

    DoublyListNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};
```

**示意**:
```
nullptr <- 1 <-> 2 <-> 3 <-> 4 -> nullptr
           ↑                    ↑
         head                  tail
```

### 插入操作

#### 在頭部插入

```cpp
DoublyListNode* insertAtHead(DoublyListNode* head, int val) {
    DoublyListNode* newNode = new DoublyListNode(val);

    if (head != nullptr) {
        newNode->next = head;
        head->prev = newNode;
    }

    return newNode;
}
```

#### 在尾部插入

```cpp
DoublyListNode* insertAtTail(DoublyListNode* head, int val) {
    DoublyListNode* newNode = new DoublyListNode(val);

    if (head == nullptr) {
        return newNode;
    }

    // 找到尾節點
    DoublyListNode* curr = head;
    while (curr->next != nullptr) {
        curr = curr->next;
    }

    curr->next = newNode;
    newNode->prev = curr;

    return head;
}
```

#### 在指定節點後插入

```cpp
void insertAfter(DoublyListNode* node, int val) {
    if (node == nullptr) return;

    DoublyListNode* newNode = new DoublyListNode(val);

    newNode->next = node->next;
    newNode->prev = node;

    if (node->next != nullptr) {
        node->next->prev = newNode;
    }

    node->next = newNode;
}
```

**步驟**:
```
原始: 1 <-> 2 <-> 3
在 2 後插入 5:

1. newNode->next = node->next (指向 3)
2. newNode->prev = node (指向 2)
3. node->next->prev = newNode (3 的 prev 指向 5)
4. node->next = newNode (2 的 next 指向 5)

結果: 1 <-> 2 <-> 5 <-> 3
```

### 刪除操作

```cpp
DoublyListNode* deleteNode(DoublyListNode* head, DoublyListNode* node) {
    if (node == nullptr) return head;

    // 如果是頭節點
    if (node->prev == nullptr) {
        head = node->next;
    } else {
        node->prev->next = node->next;
    }

    // 如果不是尾節點
    if (node->next != nullptr) {
        node->next->prev = node->prev;
    }

    delete node;
    return head;
}
```

**時間複雜度**: O(1) - 已知節點位置

### 優勢與劣勢

| 特性 | Singly Linked List | Doubly Linked List |
|-----|-------------------|-------------------|
| **記憶體** | 較少 (1 個指標) | 較多 (2 個指標) |
| **向前遍歷** | ✗ | ✓ |
| **刪除節點** | O(n) 需找前驅 | O(1) 已知節點 |
| **插入/刪除** | 單向操作 | 雙向操作更靈活 |

---

## Deque (Double-Ended Queue)

### 概念

**Deque** 是一種可以在**兩端**進行插入和刪除的資料結構。

```cpp
#include <deque>
using namespace std;

deque<int> dq;
```

### 基本操作

```cpp
deque<int> dq;

// 在前端操作
dq.push_front(1);   // [1]
dq.push_front(2);   // [2, 1]
dq.pop_front();     // [1]

// 在後端操作
dq.push_back(3);    // [1, 3]
dq.push_back(4);    // [1, 3, 4]
dq.pop_back();      // [1, 3]

// 隨機存取
int x = dq[0];      // O(1) 存取
int y = dq.front(); // 第一個元素
int z = dq.back();  // 最後一個元素
```

### 底層實作

C++ 的 `deque` 底層通常使用**分段連續記憶體** (segmented array)：

```
中央控制陣列 (map):
[ptr0] [ptr1] [ptr2] [ptr3]
  ↓      ↓      ↓      ↓
[...] [1 2 3] [4 5 6] [...]

每個 ptr 指向一個固定大小的 chunk (通常 512 bytes)
```

### 為什麼 Deque 的隨機存取是 O(1)？

雖然 deque 不是完全連續的記憶體，但透過**兩級索引**可以達到 O(1) 存取。

#### 存取原理

```cpp
// 假設每個 chunk 可以存 4 個元素
deque<int> dq = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};

// 底層結構：
map:     [ptr0] [ptr1] [ptr2]
          ↓      ↓      ↓
chunk0:  [0,1,2,3]
chunk1:  [4,5,6,7]
chunk2:  [8,9,_,_]

// 存取 dq[6] 的過程：
1. chunk_index = 6 / 4 = 1      // O(1) 計算
2. offset = 6 % 4 = 2            // O(1) 計算
3. return map[1][2]              // O(1) 存取
   → 返回 6
```

#### 數學公式

```cpp
// 存取 deque[i]
int chunk_size = 4;  // 假設每個 chunk 存 4 個元素

int chunk_index = i / chunk_size;  // 第幾個 chunk
int offset = i % chunk_size;        // chunk 內的偏移量

return map[chunk_index][offset];
```

#### 為什麼是 O(1)？

1. **除法和取模運算**：O(1) 的算術運算
2. **map 陣列存取**：`map[chunk_index]` 是 O(1)
3. **chunk 內存取**：`chunk[offset]` 是 O(1)

**總時間複雜度**：O(1) + O(1) + O(1) = O(1)

#### 完整範例

```cpp
// 假設 chunk_size = 4, map 大小 = 3
deque<int> dq;

// 插入 0-9
for (int i = 0; i < 10; i++) {
    dq.push_back(i);
}

// 底層狀態：
// map:     [ptr0]  [ptr1]  [ptr2]
//            ↓       ↓       ↓
//          [0123]  [4567]  [89__]

// 存取範例：
dq[0];  // chunk=0/4=0, offset=0%4=0 → map[0][0] = 0
dq[5];  // chunk=5/4=1, offset=5%4=1 → map[1][1] = 5
dq[9];  // chunk=9/4=2, offset=9%4=1 → map[2][1] = 9
```

#### 與 Vector 的比較

| 操作 | vector | deque |
|-----|--------|-------|
| **存取方式** | `base + i` | `map[i/chunk_size][i%chunk_size]` |
| **計算複雜度** | O(1) - 1次加法 | O(1) - 1次除法 + 1次取模 + 2次存取 |
| **實際速度** | 稍快（計算更簡單） | 稍慢（多一層間接） |
| **漸進複雜度** | O(1) | O(1) |

雖然 deque 的常數因子較大，但**漸進複雜度仍是 O(1)**。

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **push_front** | O(1) |
| **push_back** | O(1) |
| **pop_front** | O(1) |
| **pop_back** | O(1) |
| **operator[]** | O(1) |
| **insert (中間)** | O(n) |

### Deque vs Vector vs List

| 特性 | vector | deque | list |
|-----|--------|-------|------|
| **隨機存取** | O(1) | O(1) | O(n) |
| **前端插入** | O(n) | O(1) | O(1) |
| **後端插入** | O(1) | O(1) | O(1) |
| **記憶體** | 連續 | 分段連續 | 不連續 |
| **cache 友善** | 最佳 | 中等 | 最差 |

### 使用場景

```cpp
// 場景 1: 滑動窗口最大值 (需要雙端操作)
deque<int> dq;
for (int i = 0; i < nums.size(); i++) {
    // 移除超出窗口的元素
    while (!dq.empty() && dq.front() < i - k + 1) {
        dq.pop_front();
    }
    // 移除比當前小的元素
    while (!dq.empty() && nums[dq.back()] < nums[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
}

// 場景 2: 需要頻繁頭尾操作
deque<int> dq;
dq.push_front(1);  // vector 做不到 O(1)
dq.push_back(2);
dq.pop_front();    // vector 做不到 O(1)
```

---

## 實作 Doubly Linked List 版本的 Deque

```cpp
class Deque {
private:
    DoublyListNode* head;
    DoublyListNode* tail;
    int size;

public:
    Deque() : head(nullptr), tail(nullptr), size(0) {}

    void push_front(int val) {
        DoublyListNode* newNode = new DoublyListNode(val);

        if (head == nullptr) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        size++;
    }

    void push_back(int val) {
        DoublyListNode* newNode = new DoublyListNode(val);

        if (tail == nullptr) {
            head = tail = newNode;
        } else {
            newNode->prev = tail;
            tail->next = newNode;
            tail = newNode;
        }
        size++;
    }

    void pop_front() {
        if (head == nullptr) return;

        DoublyListNode* temp = head;
        head = head->next;

        if (head != nullptr) {
            head->prev = nullptr;
        } else {
            tail = nullptr;  // 只有一個元素
        }

        delete temp;
        size--;
    }

    void pop_back() {
        if (tail == nullptr) return;

        DoublyListNode* temp = tail;
        tail = tail->prev;

        if (tail != nullptr) {
            tail->next = nullptr;
        } else {
            head = nullptr;  // 只有一個元素
        }

        delete temp;
        size--;
    }

    int front() {
        return head ? head->val : -1;
    }

    int back() {
        return tail ? tail->val : -1;
    }

    bool empty() {
        return size == 0;
    }

    int getSize() {
        return size;
    }
};
```

---

## LeetCode 練習題

### Linked List 操作
- [Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/)
- [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- [Insert into a Sorted Circular Linked List](https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/)

### Doubly Linked List
- [Design Linked List](https://leetcode.com/problems/design-linked-list/)
- [LRU Cache](https://leetcode.com/problems/lru-cache/) (使用 doubly linked list)

### Deque 應用
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- [Design Circular Deque](https://leetcode.com/problems/design-circular-deque/)

---

## 重點總結

### Singly Linked List
- **插入/刪除頭部**: O(1)
- **插入/刪除尾部**: O(n)
- **使用 Dummy Node** 簡化邊界處理

### Doubly Linked List
- **雙向指標**：可向前向後遍歷
- **刪除已知節點**: O(1)
- **記憶體成本**：比 Singly Linked List 多一倍

### Deque
- **雙端隊列**：兩端都可 O(1) 插入/刪除
- **底層實作**：分段連續記憶體或 Doubly Linked List
- **使用場景**：滑動窗口、需要雙端操作的問題

### 選擇建議
- 只需單向遍歷 → **Singly Linked List**
- 需要雙向遍歷或快速刪除 → **Doubly Linked List**
- 需要兩端操作 + 隨機存取 → **Deque (STL)**
- 需要兩端操作 + 不需隨機存取 → **Doubly Linked List**
