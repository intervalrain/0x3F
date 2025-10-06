---
title: "Heap 與 Priority Queue"
order: 7
description: "Heap 的原理、實作與應用，以及 Priority Queue 的使用"
tags: ["Heap", "Priority Queue", "Binary Heap", "堆積"]
---

# Heap 與 Priority Queue

## 前言

**Heap (堆積)** 是一種特殊的完全二元樹，常用於實作 **Priority Queue (優先隊列)**。

---

## Heap 的概念

### 定義

Heap 是一棵**完全二元樹**，滿足以下性質：

- **Max Heap (大根堆)**：每個節點的值 ≥ 其子節點的值
- **Min Heap (小根堆)**：每個節點的值 ≤ 其子節點的值

```
Max Heap 範例:
        100
       /   \
      19    36
     / \   / \
    17  3 25  1

Min Heap 範例:
         1
       /   \
      3     2
     / \   / \
    17 19 36 25
```

### 完全二元樹

完全二元樹：除了最後一層外，其他層都必須是滿的，且最後一層的節點靠左排列。

```
完全二元樹：
        1
       / \
      2   3
     / \  /
    4  5 6

不是完全二元樹：
        1
       / \
      2   3
         / \
        4   5
```

---

## 陣列表示 Heap

Heap 可以用**陣列**高效表示：

```
陣列: [100, 19, 36, 17, 3, 25, 1]
索引:   0   1   2   3  4   5  6

樹形結構:
        100(0)
       /      \
    19(1)     36(2)
    /  \      /  \
  17(3) 3(4) 25(5) 1(6)
```

### 索引關係

對於索引 `i` 的節點：
- **父節點**: `(i - 1) / 2`
- **左子節點**: `2 * i + 1`
- **右子節點**: `2 * i + 2`

```cpp
int parent(int i) { return (i - 1) / 2; }
int left(int i) { return 2 * i + 1; }
int right(int i) { return 2 * i + 2; }
```

### 為什麼用陣列？

| 特性 | 陣列表示 | 鏈表表示 |
|-----|---------|---------|
| **空間效率** | 高（無需指標） | 低（需要指標） |
| **cache 友善** | 是（連續記憶體） | 否（分散記憶體） |
| **父子節點存取** | O(1) 計算 | O(1) 但需指標 |

---

## Heap 的基本操作

### 1. Insert (插入)

**步驟**：
1. 將元素加到陣列末尾
2. **向上調整** (heapify up / sift up)

```cpp
void insert(vector<int>& heap, int val) {
    // 1. 加到末尾
    heap.push_back(val);

    // 2. 向上調整
    int i = heap.size() - 1;
    while (i > 0) {
        int p = (i - 1) / 2;  // 父節點

        if (heap[i] > heap[p]) {  // Max Heap
            swap(heap[i], heap[p]);
            i = p;
        } else {
            break;
        }
    }
}
```

**時間複雜度**: O(log n)

**範例**：
```
插入 50 到 Max Heap:

原始 Heap:
        100
       /   \
      19    36

1. 加到末尾:
        100
       /   \
      19    36
     /
    50

2. 向上調整 (50 > 19):
        100
       /   \
      50    36
     /
    19
```

### 2. Extract Max/Min (取出最大/最小值)

**步驟**：
1. 取出根節點（最大/最小值）
2. 將最後一個元素移到根節點
3. **向下調整** (heapify down / sift down)

```cpp
int extractMax(vector<int>& heap) {
    if (heap.empty()) return -1;

    // 1. 取出根節點
    int maxVal = heap[0];

    // 2. 將最後一個元素移到根
    heap[0] = heap.back();
    heap.pop_back();

    // 3. 向下調整
    int i = 0;
    int n = heap.size();

    while (true) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < n && heap[right] > heap[largest]) {
            largest = right;
        }

        if (largest != i) {
            swap(heap[i], heap[largest]);
            i = largest;
        } else {
            break;
        }
    }

    return maxVal;
}
```

**時間複雜度**: O(log n)

**範例**：
```
Extract Max:

原始:
        100
       /   \
      50    36
     /
    19

1. 取出 100，將 19 移到根:
        19
       /  \
      50   36

2. 向下調整 (50 > 19):
        50
       /  \
      19   36
```

### 3. Heapify (建堆)

將無序陣列轉換為 Heap。

```cpp
void heapifyDown(vector<int>& heap, int i, int n) {
    while (true) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < n && heap[right] > heap[largest]) {
            largest = right;
        }

        if (largest != i) {
            swap(heap[i], heap[largest]);
            i = largest;
        } else {
            break;
        }
    }
}

void buildHeap(vector<int>& arr) {
    int n = arr.size();
    // 從最後一個非葉節點開始，向上調整
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}
```

**時間複雜度**: O(n) - 雖然看起來是 O(n log n)，但數學證明是 O(n)

**為什麼是 O(n)？**
```
完全二元樹的性質：
- 最後一層有 n/2 個節點，調整高度 0
- 倒數第二層有 n/4 個節點，調整高度 1
- ...

總成本:
n/2 * 0 + n/4 * 1 + n/8 * 2 + ... ≈ O(n)
```

---

## Priority Queue (優先隊列)

### 概念

Priority Queue 是一種特殊的 Queue，**每次取出優先級最高的元素**。

```cpp
#include <queue>
using namespace std;

// Max Heap (預設)
priority_queue<int> pq;

// Min Heap
priority_queue<int, vector<int>, greater<int>> minPq;
```

### 基本操作

```cpp
priority_queue<int> pq;

// 1. push - 插入元素
pq.push(3);
pq.push(1);
pq.push(4);
pq.push(1);
pq.push(5);

// 2. top - 查看最大值
int maxVal = pq.top();  // 5

// 3. pop - 移除最大值
pq.pop();  // 移除 5

// 4. size
int sz = pq.size();  // 4

// 5. empty
bool isEmpty = pq.empty();  // false
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **push** | O(log n) |
| **pop** | O(log n) |
| **top** | O(1) |
| **size** | O(1) |
| **empty** | O(1) |

---

## 自訂比較函數

### 方法 1: 使用 lambda

```cpp
// Min Heap
auto cmp = [](int a, int b) { return a > b; };
priority_queue<int, vector<int>, decltype(cmp)> pq(cmp);

// 自訂排序 (按絕對值)
auto absCmp = [](int a, int b) { return abs(a) < abs(b); };
priority_queue<int, vector<int>, decltype(absCmp)> pq2(absCmp);
```

### 方法 2: 使用 struct

```cpp
struct Node {
    int val;
    int priority;

    bool operator<(const Node& other) const {
        return priority < other.priority;  // Max Heap
    }
};

priority_queue<Node> pq;
pq.push({1, 10});
pq.push({2, 5});
pq.push({3, 15});

Node top = pq.top();  // {3, 15}
```

### 方法 3: 使用 pair

```cpp
// pair 預設比較：先比 first，再比 second
priority_queue<pair<int, int>> pq;

pq.push({3, 1});
pq.push({1, 2});
pq.push({3, 5});

auto top = pq.top();  // {3, 5}
```

---

## Heap 的應用

### 1. Top K 問題

```cpp
// LeetCode 215. Kth Largest Element in an Array
int findKthLargest(vector<int>& nums, int k) {
    // 使用 Min Heap，大小為 k
    priority_queue<int, vector<int>, greater<int>> minPq;

    for (int num : nums) {
        minPq.push(num);
        if (minPq.size() > k) {
            minPq.pop();  // 移除最小的
        }
    }

    return minPq.top();
}
```

**為什麼用 Min Heap？**
- 保持 heap 大小為 k
- 堆頂是第 k 大的元素
- 時間複雜度：O(n log k)

### 2. 合併 K 個有序鏈表

```cpp
// LeetCode 23. Merge k Sorted Lists
struct Compare {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val;  // Min Heap
    }
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, Compare> pq;

    // 將每個鏈表的頭節點加入 heap
    for (ListNode* head : lists) {
        if (head) pq.push(head);
    }

    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;

    while (!pq.empty()) {
        ListNode* node = pq.top();
        pq.pop();

        curr->next = node;
        curr = curr->next;

        if (node->next) {
            pq.push(node->next);
        }
    }

    return dummy->next;
}
```

### 3. 中位數

```cpp
// LeetCode 295. Find Median from Data Stream
class MedianFinder {
private:
    priority_queue<int> maxHeap;  // 存較小的一半
    priority_queue<int, vector<int>, greater<int>> minHeap;  // 存較大的一半

public:
    void addNum(int num) {
        // 總是先加到 maxHeap
        maxHeap.push(num);

        // 平衡：maxHeap 的最大值 ≤ minHeap 的最小值
        minHeap.push(maxHeap.top());
        maxHeap.pop();

        // 保持大小：maxHeap.size() >= minHeap.size()
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }

    double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.top();
        } else {
            return (maxHeap.top() + minHeap.top()) / 2.0;
        }
    }
};
```

**示意**：
```
數據流: 1, 2, 3, 4, 5

maxHeap (小的一半): [3, 2, 1]  (大根堆)
minHeap (大的一半): [4, 5]     (小根堆)

中位數 = 3
```

### 4. Dijkstra 最短路徑

```cpp
vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    // {距離, 節點}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}
```

---

## Heap Sort (堆積排序)

```cpp
void heapSort(vector<int>& arr) {
    int n = arr.size();

    // 1. 建立 Max Heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }

    // 2. 依序取出最大值
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);  // 將最大值移到末尾
        heapifyDown(arr, 0, i);  // 調整剩餘部分
    }
}
```

**時間複雜度**: O(n log n)
**空間複雜度**: O(1)

**特點**：
- 原地排序
- 不穩定排序
- 實務上比 Quick Sort 慢（cache 不友善）

---

## 完整實作 Min Heap

```cpp
class MinHeap {
private:
    vector<int> heap;

    void heapifyUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (heap[i] < heap[p]) {
                swap(heap[i], heap[p]);
                i = p;
            } else {
                break;
            }
        }
    }

    void heapifyDown(int i) {
        int n = heap.size();
        while (true) {
            int smallest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (left < n && heap[left] < heap[smallest]) {
                smallest = left;
            }
            if (right < n && heap[right] < heap[smallest]) {
                smallest = right;
            }

            if (smallest != i) {
                swap(heap[i], heap[smallest]);
                i = smallest;
            } else {
                break;
            }
        }
    }

public:
    void push(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }

    int pop() {
        if (heap.empty()) return -1;

        int minVal = heap[0];
        heap[0] = heap.back();
        heap.pop_back();

        if (!heap.empty()) {
            heapifyDown(0);
        }

        return minVal;
    }

    int top() {
        return heap.empty() ? -1 : heap[0];
    }

    bool empty() {
        return heap.empty();
    }

    int size() {
        return heap.size();
    }
};
```

---

## LeetCode 練習題

### 基礎
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/)
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

### 進階
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
- [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)

### 演算法應用
- [Dijkstra's Algorithm](https://leetcode.com/problems/network-delay-time/)
- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

---

## 重點總結

### Heap 特性
- **完全二元樹**：用陣列高效表示
- **Max/Min Heap**：根節點是最大/最小值
- **時間複雜度**：插入/刪除 O(log n)，建堆 O(n)

### Priority Queue
- **底層**：通常用 Heap 實作
- **應用**：Top K 問題、中位數、Dijkstra

### 選擇建議
- 需要頻繁找最大/最小值 → **Heap / Priority Queue**
- 需要排序 → **Heap Sort** (但 Quick Sort 通常更快)
- Top K 問題 → **大小為 K 的 Heap**

### 實務技巧
- C++ 使用 `priority_queue`，無需自己實作
- Min Heap: `priority_queue<int, vector<int>, greater<int>>`
- 自訂比較: lambda 或 operator<
