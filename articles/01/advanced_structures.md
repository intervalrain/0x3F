---
title: "進階資料結構"
order: 11
description: "LeetCode 中常用的進階資料結構：Trie、Segment Tree、Fenwick Tree、Monotonic Stack 等"
tags: ["Trie", "Segment Tree", "Fenwick Tree", "Monotonic Stack", "Disjoint Set"]
---

# 進階資料結構

## 前言

除了 STL 提供的基本容器外，LeetCode 中還會用到一些特殊的資料結構。本章介紹這些進階結構的原理與應用。

---

## Trie (字典樹)

### 概念

**Trie** 是一種樹狀結構，用於高效儲存和查詢**字串集合**。

```
插入: "app", "apple", "apply"

Trie 結構:
        root
         |
         a
         |
         p
         |
         p (end)
        / \
       l   l
       |   |
       e   y (end)
       |
     (end)

每條從 root 到標記節點的路徑代表一個單詞
```

### 實作

```cpp
class TrieNode {
public:
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

    // 插入單詞
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

    // 搜尋完整單詞
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

    // 搜尋前綴
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

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **insert** | O(m) - m 為字串長度 |
| **search** | O(m) |
| **startsWith** | O(m) |

**vs HashMap**:

| 操作 | Trie | HashMap |
|-----|------|---------|
| **搜尋單詞** | O(m) | O(m) |
| **前綴搜尋** | O(m) | O(n·m) 需遍歷所有 |
| **空間** | O(總字符數) | O(單詞數) |

### 應用

- **自動補全**
- **拼寫檢查**
- **IP 路由**

### LeetCode 題目

- [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [Word Search II](https://leetcode.com/problems/word-search-ii/)
- [Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

---

## Segment Tree (線段樹)

### 概念

**Segment Tree** 用於高效處理**區間查詢**和**區間更新**。

```
陣列: [1, 3, 5, 7, 9, 11]

Segment Tree (儲存區間和):
           36[0-5]
          /        \
      9[0-2]      27[3-5]
      /    \      /     \
   4[0-1] 5[2] 16[3-4] 11[5]
   /   \        /   \
 1[0] 3[1]    7[3] 9[4]

每個節點代表一個區間的統計資訊（和、最大值、最小值等）
```

### 實作

```cpp
class SegmentTree {
private:
    vector<int> tree;
    vector<int> arr;
    int n;

    void build(int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(leftChild, start, mid);
            build(rightChild, mid + 1, end);

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            arr[idx] = val;
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (idx <= mid) {
                update(leftChild, start, mid, idx, val);
            } else {
                update(rightChild, mid + 1, end, idx, val);
            }

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) {
            return 0;  // 區間不重疊
        }
        if (l <= start && end <= r) {
            return tree[node];  // 完全包含
        }

        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        int leftSum = query(leftChild, start, mid, l, r);
        int rightSum = query(rightChild, mid + 1, end, l, r);

        return leftSum + rightSum;
    }

public:
    SegmentTree(vector<int>& nums) {
        n = nums.size();
        arr = nums;
        tree.resize(4 * n);
        build(0, 0, n - 1);
    }

    void update(int idx, int val) {
        update(0, 0, n - 1, idx, val);
    }

    int sumRange(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }
};
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **build** | O(n) |
| **update** | O(log n) |
| **query** | O(log n) |

**空間複雜度**: O(4n) ≈ O(n)

### 應用

- **區間和查詢**
- **區間最大/最小值**
- **區間更新**

### LeetCode 題目

- [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

---

## Fenwick Tree / Binary Indexed Tree (樹狀陣列)

### 概念

**Fenwick Tree** 是 Segment Tree 的簡化版本，專門用於**區間和**查詢。

```
陣列: [1, 3, 5, 7, 9, 11]

Fenwick Tree (索引從 1 開始):
索引:  1  2  3  4  5  6
tree: [1, 4, 5, 16, 9, 20]

tree[i] 儲存 [i - lowbit(i) + 1, i] 的和
lowbit(i) = i & (-i)
```

### 實作

```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;

    int lowbit(int x) {
        return x & (-x);
    }

public:
    FenwickTree(int size) {
        n = size;
        tree.resize(n + 1, 0);
    }

    // 單點更新：arr[idx] += delta
    void update(int idx, int delta) {
        idx++;  // 轉換為 1-indexed
        while (idx <= n) {
            tree[idx] += delta;
            idx += lowbit(idx);
        }
    }

    // 前綴和查詢：sum(arr[0...idx])
    int query(int idx) {
        idx++;  // 轉換為 1-indexed
        int sum = 0;
        while (idx > 0) {
            sum += tree[idx];
            idx -= lowbit(idx);
        }
        return sum;
    }

    // 區間和查詢：sum(arr[left...right])
    int rangeQuery(int left, int right) {
        return query(right) - (left > 0 ? query(left - 1) : 0);
    }
};
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **update** | O(log n) |
| **query** | O(log n) |

**vs Segment Tree**:

| 特性 | Segment Tree | Fenwick Tree |
|-----|-------------|--------------|
| **實作難度** | 較複雜 | 較簡單 |
| **功能** | 更通用 | 僅區間和 |
| **空間** | O(4n) | O(n) |
| **常數因子** | 較大 | 較小 |

### 應用

- **區間和查詢**
- **逆序對計數**

### LeetCode 題目

- [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

---

## Monotonic Stack (單調棧)

### 概念

**單調棧**維持棧內元素的單調性，用於解決「下一個更大/更小元素」問題。

### 單調遞減棧

```cpp
// 找每個元素右邊第一個更大的元素
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存索引，維持單調遞減

    for (int i = 0; i < n; i++) {
        // 當前元素比棧頂大，找到答案
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }

    return result;
}
```

**範例**:
```
nums = [2, 1, 2, 4, 3]

i=0: stack=[0]
i=1: 1<2, stack=[0,1]
i=2: 2>1, result[1]=2, 2==2, stack=[0,2]
i=3: 4>2, result[2]=4, 4>2, result[0]=4, stack=[3]
i=4: 3<4, stack=[3,4]

result = [4, 2, 4, -1, -1]
```

### 應用

#### 1. Daily Temperatures

```cpp
vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> result(n, 0);
    stack<int> st;

    for (int i = 0; i < n; i++) {
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

#### 2. Largest Rectangle in Histogram

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    heights.push_back(0);  // 哨兵

    for (int i = 0; i < heights.size(); i++) {
        while (!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()];
            st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }

    return maxArea;
}
```

### LeetCode 題目

- [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

---

## Monotonic Queue (單調隊列)

### 概念

**單調隊列**維持隊列內元素的單調性，常用於**滑動窗口**問題。

### 滑動窗口最大值

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;  // 存索引，維持單調遞減
    vector<int> result;

    for (int i = 0; i < nums.size(); i++) {
        // 移除超出窗口的元素
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }

        // 維持單調遞減
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }

        dq.push_back(i);

        // 窗口形成後記錄結果
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}
```

**範例**:
```
nums = [1,3,-1,-3,5,3,6,7], k = 3

i=0: dq=[0]
i=1: 3>1, dq=[1]
i=2: -1<3, dq=[1,2], window=[1,3,-1], max=3

i=3: -3<-1, dq=[1,2,3], window=[3,-1,-3], max=3
i=4: 5>-3,5>-1,5>3, dq=[4], window=[-1,-3,5], max=5
i=5: 3<5, dq=[4,5], window=[-3,5,3], max=5
i=6: 6>3,6>5, dq=[6], window=[5,3,6], max=6
i=7: 7>6, dq=[7], window=[3,6,7], max=7

result = [3,3,5,5,6,7]
```

### LeetCode 題目

- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)

---

## Disjoint Set / Union-Find (並查集)

### 概念

**Union-Find** 用於處理**動態連通性**問題。

### 實作

```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    int count;  // 連通分量個數

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    // 路徑壓縮
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    // 按秩合併
    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        count--;
        return true;
    }

    bool isConnected(int x, int y) {
        return find(x) == find(y);
    }

    int getCount() {
        return count;
    }
};
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **find** | 攤銷 O(α(n)) ≈ O(1) |
| **unite** | 攤銷 O(α(n)) ≈ O(1) |

α(n) 是 Ackermann 函數的反函數，增長極慢，實際上可視為常數。

### 應用

- **檢測無向圖的環**
- **最小生成樹 (Kruskal)**
- **連通分量計數**

### LeetCode 題目

- [Number of Provinces](https://leetcode.com/problems/number-of-provinces/)
- [Redundant Connection](https://leetcode.com/problems/redundant-connection/)
- [Accounts Merge](https://leetcode.com/problems/accounts-merge/)

---

## Skip List (跳躍表)

### 概念

**Skip List** 是一種隨機化資料結構，可以視為多層鏈表。

```
Level 3: 1 ----------------> 9
Level 2: 1 ------> 5 ------> 9
Level 1: 1 -> 3 -> 5 -> 7 -> 9
Level 0: 1 -> 3 -> 5 -> 7 -> 9

透過跳躍，達到 O(log n) 的查找效率
```

### 特性

| 操作 | 時間複雜度 |
|-----|----------|
| **search** | 平均 O(log n) |
| **insert** | 平均 O(log n) |
| **delete** | 平均 O(log n) |

**vs 平衡樹**:
- 實作更簡單
- 不需要旋轉操作
- Redis 使用 Skip List 實作有序集合

### LeetCode 題目

- [Design Skiplist](https://leetcode.com/problems/design-skiplist/)

---

## Sparse Table (稀疏表)

### 概念

**Sparse Table** 用於**靜態區間查詢**（不支援更新）。

### 實作 (RMQ - Range Minimum Query)

```cpp
class SparseTable {
private:
    vector<vector<int>> st;
    vector<int> lg;

public:
    SparseTable(vector<int>& arr) {
        int n = arr.size();
        int maxLog = log2(n) + 1;

        st.assign(n, vector<int>(maxLog));
        lg.resize(n + 1);

        // 預處理 log
        for (int i = 2; i <= n; i++) {
            lg[i] = lg[i / 2] + 1;
        }

        // st[i][j] = min(arr[i...i+2^j-1])
        for (int i = 0; i < n; i++) {
            st[i][0] = arr[i];
        }

        for (int j = 1; j < maxLog; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
            }
        }
    }

    int query(int l, int r) {
        int j = lg[r - l + 1];
        return min(st[l][j], st[r - (1 << j) + 1][j]);
    }
};
```

### 時間複雜度

| 操作 | 時間複雜度 |
|-----|----------|
| **build** | O(n log n) |
| **query** | O(1) |

**應用**: 靜態 RMQ、LCA (Lowest Common Ancestor)

---

## 總結對比

| 資料結構 | 主要用途 | 時間複雜度 |
|---------|---------|----------|
| **Trie** | 字串前綴搜尋 | O(m) |
| **Segment Tree** | 動態區間查詢 | O(log n) |
| **Fenwick Tree** | 動態區間和 | O(log n) |
| **Monotonic Stack** | 下一個更大元素 | O(n) |
| **Monotonic Queue** | 滑動窗口最值 | O(n) |
| **Union-Find** | 動態連通性 | O(α(n)) ≈ O(1) |
| **Skip List** | 有序集合 | O(log n) 平均 |
| **Sparse Table** | 靜態區間查詢 | O(1) 查詢 |

---

## 學習建議

### 優先級

1. **必學**: Monotonic Stack/Queue, Union-Find
2. **重要**: Trie, Segment Tree, Fenwick Tree
3. **進階**: Skip List, Sparse Table

### LeetCode 頻率

| 結構 | 出現頻率 |
|-----|---------|
| **Monotonic Stack** | 高 |
| **Union-Find** | 高 |
| **Trie** | 中 |
| **Segment Tree** | 中低 |
| **Fenwick Tree** | 低 |

---

## 重點總結

- **Trie**: 字串問題首選
- **Segment Tree / Fenwick Tree**: 區間查詢/更新
- **Monotonic Stack/Queue**: 單調性相關問題
- **Union-Find**: 連通性問題
- 大部分 LeetCode 題目用基本資料結構即可解決
- 進階結構用於優化或特定問題
