---
title: 11-3. Heap (Priority Queue)
order: 3
description: 堆：動態維護極值的利器
tags:
  - Heap
  - Priority Queue
  - Binary Heap
  - Top K
author: Rain Hu
date: ''
draft: true
---

# Heap (Priority Queue)

## 核心概念

Heap（堆）是一種**完全二叉樹**，滿足**堆性質**：
- **Max Heap**（大頂堆）：父節點 ≥ 子節點
- **Min Heap**（小頂堆）：父節點 ≤ 子節點

**核心優勢**：在 O(log n) 時間內動態維護最大值或最小值。

---

## 一、Heap 的結構與性質

### 完全二叉樹

Heap 是一棵**完全二叉樹**（Complete Binary Tree）：
- 除了最後一層，其他層都是滿的
- 最後一層的節點靠左排列

```
         示例（Max Heap）：
              9
            /   \
           7     6
          / \   /
         3   2 5

不是完全二叉樹（右邊有空缺）：
              9
            /   \
           7     6
          /       \
         3         5  ✗
```

### 陣列表示

完全二叉樹可以用**陣列**高效存儲（不需要指標）：

```
索引:  0   1   2   3   4   5
陣列: [9,  7,  6,  3,  2,  5]

樹形結構：
              9 (索引0)
            /   \
         7(1)    6(2)
        / \     /
      3(3) 2(4) 5(5)

索引關係：
- 父節點: parent(i) = (i-1) / 2
- 左子節點: left(i) = 2*i + 1
- 右子節點: right(i) = 2*i + 2
```

### 堆性質

**Max Heap**：對於任意節點 i，`arr[i] >= arr[left(i)]` 且 `arr[i] >= arr[right(i)]`

**Min Heap**：對於任意節點 i，`arr[i] <= arr[left(i)]` 且 `arr[i] <= arr[right(i)]`

**注意**：Heap **不保證**兄弟節點之間的順序！

```
Max Heap 範例：
       9
      / \
     7   6    ← 7 和 6 的順序不重要！
    / \
   3   2

這也是合法的 Max Heap：
       9
      / \
     6   7
    / \
   3   2
```

---

## 二、核心操作

### 1. Heapify Up（上浮）

**用途**：插入新元素後，恢復堆性質

**過程**（以 Max Heap 為例）：
```
插入 8 到末尾：
       9
      / \
     7   6
    / \ / \
   3  2 5  8  ← 插入這裡

8 > 6（父節點），違反堆性質，交換：
       9
      / \
     7   8
    / \ / \
   3  2 5  6

8 < 9，滿足堆性質，停止
```

**代碼**：
```cpp
void heapifyUp(vector<int>& heap, int i) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] > heap[parent]) {  // Max Heap
            swap(heap[i], heap[parent]);
            i = parent;
        } else {
            break;
        }
    }
}
```

**複雜度**：O(log n)，最多上浮 tree height 次

---

### 2. Heapify Down（下沉）

**用途**：刪除堆頂後，恢復堆性質

**過程**（以 Max Heap 為例）：
```
刪除堆頂 9，用最後元素 2 替換：
       2  ← 用最後元素替換
      / \
     7   6
    / \
   3   5

2 < max(7, 6) = 7，違反堆性質，與 7 交換：
       7
      / \
     2   6
    / \
   3   5

2 < max(3, 5) = 5，與 5 交換：
       7
      / \
     5   6
    / \
   3   2

2 沒有子節點，停止
```

**代碼**：
```cpp
void heapifyDown(vector<int>& heap, int i, int size) {
    while (true) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        // 找出父、左、右中的最大值
        if (left < size && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < size && heap[right] > heap[largest]) {
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
```

**複雜度**：O(log n)

---

### 3. 基本操作總結

| 操作 | 時間複雜度 | 說明 |
|------|-----------|------|
| `insert(x)` | O(log n) | 插入到末尾，heapifyUp |
| `getMax()` / `getMin()` | O(1) | 直接返回堆頂 |
| `extractMax()` / `extractMin()` | O(log n) | 刪除堆頂，heapifyDown |
| `build(array)` | O(n) | 從陣列建堆（使用 heapifyDown） |

---

## 三、C++ `priority_queue` 使用

C++ STL 提供了現成的堆實現：`priority_queue`

### Max Heap（預設）

```cpp
#include <queue>

int main() {
    // Max Heap
    priority_queue<int> maxHeap;

    maxHeap.push(3);
    maxHeap.push(1);
    maxHeap.push(4);
    maxHeap.push(2);

    cout << maxHeap.top() << endl;  // 4（最大值）
    maxHeap.pop();                  // 刪除 4
    cout << maxHeap.top() << endl;  // 3
}
```

### Min Heap

方法 1：使用 `greater<int>`
```cpp
priority_queue<int, vector<int>, greater<int>> minHeap;

minHeap.push(3);
minHeap.push(1);
minHeap.push(4);

cout << minHeap.top() << endl;  // 1（最小值）
```

方法 2：存入負數（巧妙轉換）
```cpp
priority_queue<int> maxHeap;

maxHeap.push(-3);
maxHeap.push(-1);
maxHeap.push(-4);

cout << -maxHeap.top() << endl;  // 1（原始最小值）
```

### 自訂比較器

```cpp
// 自訂結構體
struct Task {
    int priority;
    string name;
};

// 自訂比較器（優先級高的先出）
struct Compare {
    bool operator()(const Task& a, const Task& b) {
        return a.priority < b.priority;  // Max Heap based on priority
    }
};

int main() {
    priority_queue<Task, vector<Task>, Compare> pq;

    pq.push({3, "Low"});
    pq.push({1, "High"});
    pq.push({2, "Medium"});

    cout << pq.top().name << endl;  // "Low" (priority=3)
}
```

**注意**：比較器返回 `true` 表示 `a` 的優先級**低於** `b`（反直覺！）

---

## 四、應用場景

### 1. Top K 問題

**問題**：找出陣列中第 K 大的元素

**解法**：使用大小為 K 的 **Min Heap**

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (int num : nums) {
        minHeap.push(num);

        if (minHeap.size() > k) {
            minHeap.pop();  // 保持堆大小為 k
        }
    }

    return minHeap.top();  // 第 K 大的元素
}
```

**為什麼用 Min Heap？**
```
找第 3 大，陣列 [3, 2, 1, 5, 6, 4]

過程：
push 3: [3]
push 2: [2, 3]
push 1: [1, 2, 3]
push 5: [1, 2, 3, 5] → pop 1 → [2, 3, 5]
push 6: [2, 3, 5, 6] → pop 2 → [3, 5, 6]
push 4: [3, 4, 5, 6] → pop 3 → [4, 5, 6]

堆頂 4 就是第 3 大的元素！
```

**複雜度**：O(n log k)，比排序 O(n log n) 更優（當 k 很小時）

---

### 2. 中位數維護

**問題**：動態插入數字，隨時查詢中位數

**解法**：使用**兩個堆**
- **Max Heap**（左半部分）：存較小的一半
- **Min Heap**（右半部分）：存較大的一半

```
範例：數字流 [1, 2, 3, 4, 5]

插入 1:
maxHeap: [1]
minHeap: []
中位數 = 1

插入 2:
maxHeap: [1]
minHeap: [2]
中位數 = (1+2)/2 = 1.5

插入 3:
maxHeap: [1, 2]
minHeap: [3]
中位數 = 2（maxHeap 堆頂）

插入 4:
maxHeap: [1, 2]
minHeap: [3, 4]
中位數 = (2+3)/2 = 2.5
```

**完整代碼**：見 LeetCode 295 題解

---

### 3. 任務調度

**問題**：多個任務有不同優先級，按優先級執行

```cpp
struct Task {
    int priority;
    string name;
};

struct Compare {
    bool operator()(const Task& a, const Task& b) {
        return a.priority < b.priority;  // 優先級高的先執行
    }
};

void scheduler(vector<Task>& tasks) {
    priority_queue<Task, vector<Task>, Compare> pq(tasks.begin(), tasks.end());

    while (!pq.empty()) {
        Task t = pq.top();
        pq.pop();
        cout << "執行任務: " << t.name << endl;
    }
}
```

---

## 五、LeetCode 題目詳解

### 1. LeetCode 215: Kth Largest Element in an Array

**題目**：找出第 K 大的元素

**解法 1：Min Heap（推薦）**

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;

        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        return minHeap.top();
    }
};
```

**複雜度**：O(n log k)

**解法 2：Max Heap**

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int> maxHeap(nums.begin(), nums.end());

        for (int i = 0; i < k - 1; i++) {
            maxHeap.pop();
        }

        return maxHeap.top();
    }
};
```

**複雜度**：O(n + k log n)

**解法 3：Quick Select（最優）**

複雜度 O(n)，但超出本章範圍。

---

### 2. LeetCode 295: Find Median from Data Stream

**題目**：設計一個資料結構，支援：
- `addNum(num)`：加入數字
- `findMedian()`：返回目前所有數字的中位數

**解法**：雙堆法

```cpp
class MedianFinder {
private:
    priority_queue<int> maxHeap;  // 存較小的一半
    priority_queue<int, vector<int>, greater<int>> minHeap;  // 存較大的一半

public:
    MedianFinder() {}

    void addNum(int num) {
        // 1. 先加入 maxHeap
        maxHeap.push(num);

        // 2. 將 maxHeap 堆頂移到 minHeap（保證 maxHeap 所有元素 ≤ minHeap）
        minHeap.push(maxHeap.top());
        maxHeap.pop();

        // 3. 平衡兩個堆的大小（maxHeap.size() == minHeap.size() 或 maxHeap.size() == minHeap.size() + 1）
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

**複雜度**：
- `addNum`: O(log n)
- `findMedian`: O(1)

**關鍵**：
- maxHeap 存較小的一半（堆頂是這一半的最大值）
- minHeap 存較大的一半（堆頂是這一半的最小值）
- 中位數就是兩個堆頂的平均值（或 maxHeap 堆頂）

---

### 3. LeetCode 347: Top K Frequent Elements

**題目**：找出陣列中出現頻率最高的 K 個元素

**解法**：Hash Map + Min Heap

```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // 1. 統計頻率
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }

        // 2. 使用 Min Heap（按頻率）
        auto cmp = [](pair<int, int>& a, pair<int, int>& b) {
            return a.second > b.second;  // Min Heap based on frequency
        };
        priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> minHeap(cmp);

        for (auto& p : freq) {
            minHeap.push(p);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        // 3. 提取結果
        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().first);
            minHeap.pop();
        }

        return result;
    }
};
```

**複雜度**：O(n log k)

---

### 4. LeetCode 253: Meeting Rooms II

**題目**：給定會議時間區間，求最少需要多少個會議室

**解法**：Min Heap 存儲會議結束時間

```cpp
class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;

        // 按開始時間排序
        sort(intervals.begin(), intervals.end());

        // Min Heap 存儲每個會議室的結束時間
        priority_queue<int, vector<int>, greater<int>> minHeap;

        for (auto& interval : intervals) {
            int start = interval[0], end = interval[1];

            // 如果最早結束的會議已經結束，可以復用該會議室
            if (!minHeap.empty() && minHeap.top() <= start) {
                minHeap.pop();
            }

            // 當前會議佔用一個會議室
            minHeap.push(end);
        }

        return minHeap.size();  // 堆的大小就是需要的會議室數量
    }
};
```

**範例**：
```
intervals = [[0,30], [5,10], [15,20]]

排序後：[[0,30], [5,10], [15,20]]

處理 [0,30]:
    minHeap: [30]
    會議室數: 1

處理 [5,10]:
    5 < 30，無法復用會議室
    minHeap: [10, 30]
    會議室數: 2

處理 [15,20]:
    15 > 10，可以復用會議室
    minHeap: [20, 30]
    會議室數: 2

答案：2
```

**複雜度**：O(n log n)

---

## 六、常見陷阱與技巧

### 陷阱 1：比較器方向混淆

```cpp
// 錯誤：想要 Max Heap，但寫成 Min Heap
priority_queue<int, vector<int>, greater<int>> pq;  // 這是 Min Heap！

// 正確：預設就是 Max Heap
priority_queue<int> pq;
```

### 陷阱 2：Top K 問題用錯堆

```cpp
// 錯誤：第 K 大用 Max Heap，效率低
priority_queue<int> maxHeap;
for (int num : nums) maxHeap.push(num);
for (int i = 0; i < k - 1; i++) maxHeap.pop();  // O(n log n + k log n)

// 正確：用大小為 K 的 Min Heap
priority_queue<int, vector<int>, greater<int>> minHeap;
for (int num : nums) {
    minHeap.push(num);
    if (minHeap.size() > k) minHeap.pop();  // O(n log k)
}
```

### 陷阱 3：忘記處理空堆

```cpp
// 錯誤：不檢查堆是否為空
int max = pq.top();  // 如果 pq 為空，未定義行為！

// 正確：先檢查
if (!pq.empty()) {
    int max = pq.top();
}
```

### 技巧 1：負數技巧

將 Max Heap 轉為 Min Heap：
```cpp
priority_queue<int> pq;
pq.push(-num);  // 存入負數
int minVal = -pq.top();  // 取出時變回正數
```

### 技巧 2：自訂比較器的 Lambda 表達式

```cpp
auto cmp = [](int a, int b) { return a > b; };  // Min Heap
priority_queue<int, vector<int>, decltype(cmp)> pq(cmp);
```

---

## 七、進階主題

### 1. 建堆（Heapify）的 O(n) 演算法

從陣列建堆，使用 **Bottom-Up Heapify**：

```cpp
void buildHeap(vector<int>& arr) {
    int n = arr.size();

    // 從最後一個非葉節點開始，向上 heapifyDown
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}
```

**為什麼是 O(n)？**
- 大部分節點在底層，heapifyDown 的距離很短
- 時間複雜度：T(n) = Σ(節點數 × 高度) = O(n)

### 2. Heap Sort

利用堆實現排序：

```cpp
void heapSort(vector<int>& arr) {
    // 1. 建堆 O(n)
    buildHeap(arr);

    // 2. 依次取出最大值 O(n log n)
    int n = arr.size();
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);  // 將最大值移到末尾
        heapifyDown(arr, 0, i);  // 恢復堆性質
    }
}
```

**複雜度**：O(n log n)

**空間**：O(1)（原地排序）

---

## 八、總結

### 核心操作複雜度

| 操作 | 時間複雜度 |
|------|-----------|
| 插入 | O(log n) |
| 取最值 | O(1) |
| 刪除最值 | O(log n) |
| 建堆 | O(n) |

### 適用場景

| 問題類型 | 是否適用 |
|---------|---------|
| Top K 問題 | ✅ 完美 |
| 動態維護最值 | ✅ 完美 |
| 中位數維護 | ✅ 雙堆法 |
| 完全排序 | ❌ 用快排或歸併 |
| 查找任意第 K 個元素 | ❌ 堆只能查最值 |

### C++ `priority_queue` 速查表

```cpp
// Max Heap
priority_queue<int> maxHeap;

// Min Heap
priority_queue<int, vector<int>, greater<int>> minHeap;

// 自訂比較器
auto cmp = [](int a, int b) { return a > b; };
priority_queue<int, vector<int>, decltype(cmp)> pq(cmp);

// 常用操作
pq.push(x);       // 插入
pq.top();         // 取堆頂
pq.pop();         // 刪除堆頂
pq.empty();       // 是否為空
pq.size();        // 大小
```

掌握 Heap，你就能高效解決所有需要動態維護極值的問題！

