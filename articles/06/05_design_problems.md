---
title: 06-5. 其他常見設計題
order: 5
description: '深入探討使用 Stack、Queue、Deque 解決的經典設計問題。包含最小棧、最大棧、滑動窗口最大值、實現隊列與棧的相互轉換等面試常見題型。'
tags: ['Design', 'Stack', 'Queue', 'Min Stack', 'Sliding Window', 'Design Problems', '設計題']
author: Rain Hu
date: '2025-10-15'
draft: false
---

# 其他常見設計題

## 概述

Stack 和 Queue 相關的設計題在面試中非常常見。這些題目考察：
1. 數據結構的靈活運用
2. 時間空間複雜度的權衡
3. 系統設計思維

本章將介紹常見的設計題型和解決方案。

---

## LeetCode 155: Min Stack

### 問題描述

設計一個支持 push、pop、top 操作的棧，並能在**常數時間**內檢索到最小元素。

**實現函數：**
- `push(x)`: 將元素 x 推入棧中
- `pop()`: 刪除棧頂元素
- `top()`: 獲取棧頂元素
- `getMin()`: 檢索棧中的最小元素

**示例：**
```
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   // 返回 -3
minStack.pop();
minStack.top();      // 返回 0
minStack.getMin();   // 返回 -2
```

### 解法 1：雙棧法

**核心思想：** 使用兩個棧，一個存數據，一個存當前最小值。

```cpp
class MinStack {
private:
    stack<int> dataStack;  // 存儲數據
    stack<int> minStack;   // 存儲最小值

public:
    MinStack() {
    }

    void push(int val) {
        dataStack.push(val);

        // minStack 存儲當前最小值
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.top());  // 重複壓入當前最小值
        }
    }

    void pop() {
        dataStack.pop();
        minStack.pop();
    }

    int top() {
        return dataStack.top();
    }

    int getMin() {
        return minStack.top();
    }
};
```

**時間複雜度：** O(1) for all operations
**空間複雜度：** O(n)

**過程示例：**
```
push(-2):
  dataStack: [-2]
  minStack:  [-2]

push(0):
  dataStack: [-2, 0]
  minStack:  [-2, -2]

push(-3):
  dataStack: [-2, 0, -3]
  minStack:  [-2, -2, -3]

getMin() = -3

pop():
  dataStack: [-2, 0]
  minStack:  [-2, -2]

getMin() = -2
```

### 解法 2：優化空間（只存變化的最小值）

```cpp
class MinStack {
private:
    stack<int> dataStack;
    stack<int> minStack;  // 只在最小值變化時壓入

public:
    MinStack() {
    }

    void push(int val) {
        dataStack.push(val);

        // 只在新最小值出現時壓入
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        }
    }

    void pop() {
        // 如果彈出的是最小值，minStack 也要彈出
        if (dataStack.top() == minStack.top()) {
            minStack.pop();
        }
        dataStack.pop();
    }

    int top() {
        return dataStack.top();
    }

    int getMin() {
        return minStack.top();
    }
};
```

**優勢：** minStack 只存儲變化的最小值，節省空間。

### 解法 3：單棧法（存差值）

```cpp
class MinStack {
private:
    stack<long long> st;  // 存儲與最小值的差值
    long long minVal;     // 當前最小值

public:
    MinStack() {
    }

    void push(int val) {
        if (st.empty()) {
            st.push(0LL);
            minVal = val;
        } else {
            // 存儲差值
            st.push((long long)val - minVal);
            if (val < minVal) {
                minVal = val;
            }
        }
    }

    void pop() {
        long long diff = st.top();
        st.pop();

        // 如果差值為負，說明彈出的是最小值
        if (diff < 0) {
            minVal = minVal - diff;  // 恢復之前的最小值
        }
    }

    int top() {
        long long diff = st.top();
        if (diff < 0) {
            return minVal;  // 當前元素就是最小值
        } else {
            return minVal + diff;
        }
    }

    int getMin() {
        return minVal;
    }
};
```

**優勢：** 只用一個棧，空間優化。

---

## LeetCode 716: Max Stack

### 問題描述

設計一個最大棧，支持 push、pop、top、peekMax 和 popMax 操作。

**實現函數：**
- `push(x)`: 將元素 x 推入棧中
- `pop()`: 刪除棧頂元素並返回
- `top()`: 獲取棧頂元素
- `peekMax()`: 檢索棧中的最大元素
- `popMax()`: 刪除棧中的最大元素並返回

**示例：**
```
MaxStack stack = new MaxStack();
stack.push(5);
stack.push(1);
stack.push(5);
stack.top();       // 返回 5
stack.popMax();    // 返回 5
stack.top();       // 返回 1
stack.peekMax();   // 返回 5
stack.pop();       // 返回 1
stack.top();       // 返回 5
```

### 解法：雙棧 + 輔助棧

```cpp
class MaxStack {
private:
    stack<int> dataStack;
    stack<int> maxStack;

public:
    MaxStack() {
    }

    void push(int x) {
        dataStack.push(x);

        if (maxStack.empty() || x >= maxStack.top()) {
            maxStack.push(x);
        } else {
            maxStack.push(maxStack.top());
        }
    }

    int pop() {
        int val = dataStack.top();
        dataStack.pop();
        maxStack.pop();
        return val;
    }

    int top() {
        return dataStack.top();
    }

    int peekMax() {
        return maxStack.top();
    }

    int popMax() {
        int maxVal = maxStack.top();
        stack<int> buffer;

        // 將元素臨時移到 buffer，直到找到最大值
        while (dataStack.top() != maxVal) {
            buffer.push(dataStack.top());
            dataStack.pop();
            maxStack.pop();
        }

        // 刪除最大值
        dataStack.pop();
        maxStack.pop();

        // 恢復其他元素
        while (!buffer.empty()) {
            push(buffer.top());
            buffer.pop();
        }

        return maxVal;
    }
};
```

**時間複雜度：**
- push, pop, top, peekMax: O(1)
- popMax: O(n)

**空間複雜度：** O(n)

---

## LeetCode 232: Implement Queue using Stacks

### 問題描述

使用兩個棧實現一個隊列。

**實現函數：**
- `push(x)`: 將元素 x 推到隊列的末尾
- `pop()`: 從隊列的開頭移除並返回元素
- `peek()`: 返回隊列開頭的元素
- `empty()`: 如果隊列為空，返回 true

### 解法：雙棧法

**核心思想：**
- `inStack`: 用於 push 操作
- `outStack`: 用於 pop 和 peek 操作
- 當 outStack 為空時，將 inStack 的元素全部移到 outStack

```cpp
class MyQueue {
private:
    stack<int> inStack;   // 用於入隊
    stack<int> outStack;  // 用於出隊

    // 將 inStack 的元素移到 outStack
    void transfer() {
        while (!inStack.empty()) {
            outStack.push(inStack.top());
            inStack.pop();
        }
    }

public:
    MyQueue() {
    }

    void push(int x) {
        inStack.push(x);
    }

    int pop() {
        if (outStack.empty()) {
            transfer();
        }
        int val = outStack.top();
        outStack.pop();
        return val;
    }

    int peek() {
        if (outStack.empty()) {
            transfer();
        }
        return outStack.top();
    }

    bool empty() {
        return inStack.empty() && outStack.empty();
    }
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue* obj = new MyQueue();
 * obj->push(x);
 * int param_2 = obj->pop();
 * int param_3 = obj->peek();
 * bool param_4 = obj->empty();
 */
```

**時間複雜度：**
- push: O(1)
- pop, peek: Amortized O(1)

**空間複雜度：** O(n)

**過程示例：**
```
push(1):
  inStack: [1]
  outStack: []

push(2):
  inStack: [1, 2]
  outStack: []

peek():
  transfer() -> outStack: [2, 1]
  inStack: []
  return 1

push(3):
  inStack: [3]
  outStack: [2, 1]

pop():
  outStack: [2]
  return 1

pop():
  outStack: []
  return 2

pop():
  transfer() -> outStack: [3]
  return 3
```

---

## LeetCode 225: Implement Stack using Queues

### 問題描述

使用隊列實現一個棧。

**實現函數：**
- `push(x)`: 將元素 x 壓入棧頂
- `pop()`: 移除並返回棧頂元素
- `top()`: 返回棧頂元素
- `empty()`: 如果棧為空，返回 true

### 解法 1：雙隊列法

```cpp
class MyStack {
private:
    queue<int> q1;
    queue<int> q2;

public:
    MyStack() {
    }

    void push(int x) {
        // 將新元素加到 q2
        q2.push(x);

        // 將 q1 的所有元素移到 q2
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }

        // 交換 q1 和 q2
        swap(q1, q2);
    }

    int pop() {
        int val = q1.front();
        q1.pop();
        return val;
    }

    int top() {
        return q1.front();
    }

    bool empty() {
        return q1.empty();
    }
};
```

**時間複雜度：**
- push: O(n)
- pop, top, empty: O(1)

### 解法 2：單隊列法

```cpp
class MyStack {
private:
    queue<int> q;

public:
    MyStack() {
    }

    void push(int x) {
        int n = q.size();
        q.push(x);

        // 將前面的元素移到後面
        for (int i = 0; i < n; i++) {
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

**過程示例：**
```
push(1):
  q: [1]

push(2):
  q: [2]
  移動 1 次: [2, 1]

push(3):
  q: [3]
  移動 2 次: [3, 2, 1]

top() = 3
pop() -> q: [2, 1]
```

---

## LeetCode 239: Sliding Window Maximum

### 問題描述

給定一個陣列和滑動窗口的大小 k，找出所有滑動窗口裡的最大值。

**示例：**
```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
  Window position          Max
  [1  3  -1] -3  5  3  6  7   3
   1 [3  -1  -3] 5  3  6  7   3
   1  3 [-1  -3  5] 3  6  7   5
   1  3  -1 [-3  5  3] 6  7   5
   1  3  -1  -3 [5  3  6] 7   6
   1  3  -1  -3  5 [3  6  7]  7
```

### 解法：單調遞減隊列（Deque）

**核心思想：** 維護一個單調遞減的雙端隊列，存儲索引。

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> result;
        deque<int> dq;  // 存儲索引，維護單調遞減

        for (int i = 0; i < nums.size(); i++) {
            // 移除超出窗口範圍的索引
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }

            // 移除所有小於當前元素的索引（維護單調遞減）
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
};
```

**時間複雜度：** O(n)，每個元素最多入隊出隊一次
**空間複雜度：** O(k)

**詳細過程：**
```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

i=0, num=1:
  dq: [0]

i=1, num=3:
  3 > 1, 彈出 0
  dq: [1]

i=2, num=-1:
  -1 < 3, 不彈出
  dq: [1, 2]
  窗口形成，max = nums[1] = 3

i=3, num=-3:
  -3 < -1, 不彈出
  dq: [1, 2, 3]
  max = nums[1] = 3

i=4, num=5:
  索引 1 < 4-3+1=2, 彈出 1
  5 > -1, 彈出 2
  5 > -3, 彈出 3
  dq: [4]
  max = nums[4] = 5

i=5, num=3:
  3 < 5, 不彈出
  dq: [4, 5]
  max = nums[4] = 5

i=6, num=6:
  6 > 3, 彈出 5
  6 > 5, 彈出 4
  dq: [6]
  max = nums[6] = 6

i=7, num=7:
  7 > 6, 彈出 6
  dq: [7]
  max = nums[7] = 7

結果: [3, 3, 5, 5, 6, 7]
```

### 為什麼使用 Deque？

```
需要的操作：
1. 從前端移除過期的索引    -> pop_front()
2. 從後端移除較小的元素    -> pop_back()
3. 在後端添加新索引        -> push_back()
4. 查看前端最大值          -> front()

只有 Deque 能高效支持兩端操作！
```

---

## LeetCode 341: Flatten Nested List Iterator

### 問題描述

給定一個嵌套的整數列表，實現一個迭代器將其扁平化。

**示例：**
```
Input: [[1,1],2,[1,1]]
Output: [1,1,2,1,1]

Input: [1,[4,[6]]]
Output: [1,4,6]
```

### 解法：使用 Stack

```cpp
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * class NestedInteger {
 *   public:
 *     // Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     bool isInteger() const;
 *
 *     // Return the single integer that this NestedInteger holds, if it holds a single integer
 *     // The result is undefined if this NestedInteger holds a nested list
 *     int getInteger() const;
 *
 *     // Return the nested list that this NestedInteger holds, if it holds a nested list
 *     // The result is undefined if this NestedInteger holds a single integer
 *     const vector<NestedInteger> &getList() const;
 * };
 */

class NestedIterator {
private:
    stack<NestedInteger> st;

public:
    NestedIterator(vector<NestedInteger> &nestedList) {
        // 反向壓入棧（確保從左到右的順序）
        for (int i = nestedList.size() - 1; i >= 0; i--) {
            st.push(nestedList[i]);
        }
    }

    int next() {
        int val = st.top().getInteger();
        st.pop();
        return val;
    }

    bool hasNext() {
        while (!st.empty()) {
            NestedInteger curr = st.top();

            if (curr.isInteger()) {
                return true;
            }

            // 如果是列表，展開並壓入棧
            st.pop();
            vector<NestedInteger> list = curr.getList();
            for (int i = list.size() - 1; i >= 0; i--) {
                st.push(list[i]);
            }
        }

        return false;
    }
};

/**
 * Your NestedIterator object will be instantiated and called as such:
 * NestedIterator i(nestedList);
 * while (i.hasNext()) cout << i.next();
 */
```

**時間複雜度：**
- next(): O(1)
- hasNext(): Amortized O(1)

**空間複雜度：** O(d)，d 是最大嵌套深度

**過程示例：**
```
Input: [[1,1],2,[1,1]]

初始化:
  st: [[1,1], 2, [1,1]] (反向壓入)

hasNext():
  curr = [1,1] (列表)
  展開: st: [1, 1, 2, [1,1]]

next() = 1
  st: [1, 2, [1,1]]

next() = 1
  st: [2, [1,1]]

next() = 2
  st: [[1,1]]

hasNext():
  curr = [1,1] (列表)
  展開: st: [1, 1]

next() = 1
next() = 1
```

---

## LeetCode 636: Exclusive Time of Functions

### 問題描述

給定一個單線程 CPU 的日誌，計算每個函數的獨佔時間。

**日誌格式：** `function_id:start_or_end:timestamp`

**示例：**
```
Input: n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]
Output: [3,4]
Explanation:
  Function 0: 時間 0-1, 6 (總共 3)
  Function 1: 時間 2-5 (總共 4)
```

### 解法：Stack

```cpp
class Solution {
public:
    vector<int> exclusiveTime(int n, vector<string>& logs) {
        vector<int> result(n, 0);
        stack<int> st;  // 存儲 function id
        int prevTime = 0;

        for (const string& log : logs) {
            // 解析日誌
            int pos1 = log.find(':');
            int pos2 = log.find(':', pos1 + 1);

            int id = stoi(log.substr(0, pos1));
            string type = log.substr(pos1 + 1, pos2 - pos1 - 1);
            int time = stoi(log.substr(pos2 + 1));

            if (type == "start") {
                // 累加前一個函數的時間
                if (!st.empty()) {
                    result[st.top()] += time - prevTime;
                }
                st.push(id);
                prevTime = time;
            } else {  // "end"
                int currId = st.top();
                st.pop();
                result[currId] += time - prevTime + 1;
                prevTime = time + 1;
            }
        }

        return result;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

**詳細過程：**
```
logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]

"0:start:0":
  st: [0]
  prevTime = 0

"1:start:2":
  result[0] += 2 - 0 = 2
  st: [0, 1]
  prevTime = 2

"1:end:5":
  result[1] += 5 - 2 + 1 = 4
  st: [0]
  prevTime = 6

"0:end:6":
  result[0] += 6 - 6 + 1 = 1
  st: []
  prevTime = 7

結果: [3, 4]
```

---

## 設計題總結

### 核心數據結構選擇

| 問題類型 | 推薦數據結構 | 關鍵技巧 |
|---------|-------------|---------|
| Min/Max Stack | 雙棧 | 輔助棧維護最小/最大值 |
| 用棧實現隊列 | 雙棧 | inStack + outStack |
| 用隊列實現棧 | 單隊列/雙隊列 | 旋轉隊列元素 |
| 滑動窗口最大值 | 單調隊列 (Deque) | 維護單調遞減 |
| 嵌套迭代器 | Stack | DFS 展開嵌套結構 |
| 函數調用時間 | Stack | 模擬函數調用棧 |

### 常見技巧

#### 1. 雙棧技巧
```cpp
stack<int> dataStack;  // 主棧
stack<int> auxStack;   // 輔助棧（存最小值/最大值）
```

#### 2. 單調隊列
```cpp
deque<int> dq;  // 維護單調性
// 從前端移除過期元素
// 從後端移除不符合單調性的元素
```

#### 3. 用棧實現隊列
```cpp
stack<int> inStack, outStack;
// inStack: push 操作
// outStack: pop/peek 操作
// 懶惰轉移：只在 outStack 為空時轉移
```

#### 4. Amortized O(1)
```
雖然某次操作可能是 O(n)，但平均下來每個操作是 O(1)
例如：用棧實現隊列的 pop 操作
```

### 實現要點

#### Min/Max Stack
- **核心**：輔助棧同步維護最小/最大值
- **優化**：只在值變化時壓入輔助棧

#### 用棧實現隊列
- **核心**：雙棧轉移
- **優化**：懶惰轉移（outStack 空時才轉移）

#### 滑動窗口最大值
- **核心**：單調遞減隊列
- **關鍵**：
  1. 從前端移除過期索引
  2. 從後端移除較小元素
  3. 前端始終是最大值

#### 嵌套迭代器
- **核心**：用棧展開嵌套結構
- **關鍵**：反向壓入確保順序

---

## 相關題目

### 基礎設計題
- [155. Min Stack](https://leetcode.com/problems/min-stack/)
- [716. Max Stack](https://leetcode.com/problems/max-stack/)
- [232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
- [225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)

### 進階設計題
- [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- [341. Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator/)
- [636. Exclusive Time of Functions](https://leetcode.com/problems/exclusive-time-of-functions/)
- [895. Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack/)

### 相關變體
- [1381. Design a Stack With Increment Operation](https://leetcode.com/problems/design-a-stack-with-increment-operation/)
- [1429. First Unique Number](https://leetcode.com/problems/first-unique-number/)
- [362. Design Hit Counter](https://leetcode.com/problems/design-hit-counter/)

---

## 總結

### 核心思想

1. **輔助數據結構**：使用額外的棧/隊列維護額外信息（最小值、最大值等）
2. **單調性維護**：單調棧/隊列解決滑動窗口、最值問題
3. **延遲操作**：懶惰轉移、批量操作提高效率
4. **數據結構轉換**：用棧實現隊列、用隊列實現棧

### 時間複雜度分析

- **O(1)**：push, pop, top（基本操作）
- **Amortized O(1)**：用棧實現隊列的 pop（平均 O(1)）
- **O(n)**：滑動窗口（線性掃描）
- **O(k)**：Min Stack 空間（k 個元素）

### 面試建議

1. **理解需求**：
   - 時間複雜度要求
   - 空間複雜度限制
   - 特殊操作需求

2. **選擇數據結構**：
   - 需要 LIFO -> Stack
   - 需要 FIFO -> Queue
   - 需要兩端操作 -> Deque

3. **優化技巧**：
   - 雙棧/雙隊列
   - 單調性維護
   - 懶惰操作

4. **邊界情況**：
   - 空棧/空隊列
   - 單元素情況
   - 容量限制

掌握這些設計題的核心思想和實現技巧，能夠幫助你在面試中快速解決類似問題。
