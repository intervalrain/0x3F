---
title: 05-7. Segment Tree
order: 7
description: '學習線段樹的構建與應用，解決區間查詢與更新問題。掌握區間和、區間最值、懶惰標記等進階技巧，實現高效的範圍操作與動態查詢。'
tags: ['Segment Tree', 'Range Query', 'Lazy Propagation', '線段樹', '區間查詢']
author: Rain Hu
date: ''
draft: true
---

# Segment Tree (線段樹)

## 1. 基本概念

### 1.1 什麼是線段樹？

線段樹是一種二元樹，用於高效處理區間查詢和修改問題。每個節點代表一個區間，葉節點代表單個元素。

```
原始數組: [1, 3, 5, 7, 9, 11]

線段樹結構:
            [0,5]:36
           /        \
      [0,2]:9      [3,5]:27
      /    \        /    \
   [0,1]:4 [2]:5 [3,4]:16 [5]:11
   /   \          /    \
[0]:1 [1]:3    [3]:7  [4]:9
```

### 1.2 核心操作

- **Build**: O(n) - 構建線段樹
- **Query**: O(log n) - 查詢區間
- **Update**: O(log n) - 更新元素

### 1.3 應用場景

- 區間和查詢
- 區間最大/最小值查詢
- 區間修改（單點更新、區間更新）
- RMQ（Range Minimum/Maximum Query）問題

## 2. 基礎實現

### 2.1 區間和查詢

```cpp
class SegmentTree {
private:
    vector<int> tree;  // 線段樹數組
    int n;             // 原始數組大小

    // 構建線段樹
    void build(vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            // 葉節點
            tree[node] = nums[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            // 遞迴構建左右子樹
            build(nums, leftChild, start, mid);
            build(nums, rightChild, mid + 1, end);

            // 父節點 = 左子節點 + 右子節點
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    // 單點更新
    void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            // 找到要更新的葉節點
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (idx <= mid) {
                // 更新左子樹
                updateHelper(leftChild, start, mid, idx, val);
            } else {
                // 更新右子樹
                updateHelper(rightChild, mid + 1, end, idx, val);
            }

            // 更新父節點
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    // 區間查詢
    int queryHelper(int node, int start, int end, int L, int R) {
        if (R < start || end < L) {
            // 完全不重疊
            return 0;
        }

        if (L <= start && end <= R) {
            // 完全包含
            return tree[node];
        }

        // 部分重疊，分別查詢左右子樹
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        int leftSum = queryHelper(leftChild, start, mid, L, R);
        int rightSum = queryHelper(rightChild, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    SegmentTree(vector<int>& nums) {
        n = nums.size();
        tree.resize(4 * n);  // 線段樹最多需要 4n 的空間
        build(nums, 0, 0, n - 1);
    }

    // 更新索引 idx 的值為 val
    void update(int idx, int val) {
        updateHelper(0, 0, n - 1, idx, val);
    }

    // 查詢區間 [L, R] 的和
    int query(int L, int R) {
        return queryHelper(0, 0, n - 1, L, R);
    }
};

// 使用示例
int main() {
    vector<int> nums = {1, 3, 5, 7, 9, 11};
    SegmentTree segTree(nums);

    cout << segTree.query(1, 3) << endl;  // 輸出: 15 (3+5+7)

    segTree.update(1, 10);
    cout << segTree.query(1, 3) << endl;  // 輸出: 22 (10+5+7)

    return 0;
}
```

### 2.2 LeetCode 題目應用

```cpp
// LeetCode 307. Range Sum Query - Mutable
class NumArray {
private:
    vector<int> tree;
    int n;

    void build(vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(nums, leftChild, start, mid);
            build(nums, rightChild, mid + 1, end);

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (idx <= mid) {
                updateHelper(leftChild, start, mid, idx, val);
            } else {
                updateHelper(rightChild, mid + 1, end, idx, val);
            }

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    int queryHelper(int node, int start, int end, int L, int R) {
        if (R < start || end < L) {
            return 0;
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        int mid = (start + end) / 2;
        int leftSum = queryHelper(2 * node + 1, start, mid, L, R);
        int rightSum = queryHelper(2 * node + 2, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    NumArray(vector<int>& nums) {
        n = nums.size();
        if (n > 0) {
            tree.resize(4 * n);
            build(nums, 0, 0, n - 1);
        }
    }

    void update(int index, int val) {
        updateHelper(0, 0, n - 1, index, val);
    }

    int sumRange(int left, int right) {
        return queryHelper(0, 0, n - 1, left, right);
    }
};
```

## 3. 區間最大/最小值查詢

```cpp
class SegmentTreeRMQ {
private:
    vector<int> tree;
    int n;

    void build(vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(nums, leftChild, start, mid);
            build(nums, rightChild, mid + 1, end);

            // 父節點存儲子節點的最小值
            tree[node] = min(tree[leftChild], tree[rightChild]);
        }
    }

    void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            if (idx <= mid) {
                updateHelper(leftChild, start, mid, idx, val);
            } else {
                updateHelper(rightChild, mid + 1, end, idx, val);
            }

            tree[node] = min(tree[leftChild], tree[rightChild]);
        }
    }

    int queryHelper(int node, int start, int end, int L, int R) {
        if (R < start || end < L) {
            return INT_MAX;  // 不重疊返回最大值
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        int mid = (start + end) / 2;
        int leftMin = queryHelper(2 * node + 1, start, mid, L, R);
        int rightMin = queryHelper(2 * node + 2, mid + 1, end, L, R);

        return min(leftMin, rightMin);
    }

public:
    SegmentTreeRMQ(vector<int>& nums) {
        n = nums.size();
        tree.resize(4 * n);
        build(nums, 0, 0, n - 1);
    }

    void update(int idx, int val) {
        updateHelper(0, 0, n - 1, idx, val);
    }

    int queryMin(int L, int R) {
        return queryHelper(0, 0, n - 1, L, R);
    }
};
```

## 4. 區間更新（Lazy Propagation）

### 4.1 懶惰標記

對於區間更新問題，如果每次都更新到葉節點會很慢。使用懶惰標記（Lazy Propagation）可以將更新推遲到需要時才執行。

```cpp
class SegmentTreeLazy {
private:
    vector<long long> tree;  // 線段樹
    vector<long long> lazy;  // 懶惰標記
    int n;

    void build(vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            build(nums, leftChild, start, mid);
            build(nums, rightChild, mid + 1, end);

            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }

    // 下推懶惰標記
    void pushDown(int node, int start, int end) {
        if (lazy[node] != 0) {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;

            // 更新左子節點
            tree[leftChild] += lazy[node] * (mid - start + 1);
            lazy[leftChild] += lazy[node];

            // 更新右子節點
            tree[rightChild] += lazy[node] * (end - mid);
            lazy[rightChild] += lazy[node];

            // 清除當前節點的懶惰標記
            lazy[node] = 0;
        }
    }

    // 區間更新：將 [L, R] 區間的每個元素加上 val
    void updateRangeHelper(int node, int start, int end, int L, int R, int val) {
        if (R < start || end < L) {
            return;  // 完全不重疊
        }

        if (L <= start && end <= R) {
            // 完全包含，更新當前節點並標記懶惰
            tree[node] += (long long)val * (end - start + 1);
            lazy[node] += val;
            return;
        }

        // 部分重疊，下推懶惰標記並遞迴更新
        pushDown(node, start, end);

        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;

        updateRangeHelper(leftChild, start, mid, L, R, val);
        updateRangeHelper(rightChild, mid + 1, end, L, R, val);

        tree[node] = tree[leftChild] + tree[rightChild];
    }

    // 區間查詢
    long long queryHelper(int node, int start, int end, int L, int R) {
        if (R < start || end < L) {
            return 0;
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        pushDown(node, start, end);

        int mid = (start + end) / 2;
        long long leftSum = queryHelper(2 * node + 1, start, mid, L, R);
        long long rightSum = queryHelper(2 * node + 2, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    SegmentTreeLazy(vector<int>& nums) {
        n = nums.size();
        tree.resize(4 * n);
        lazy.resize(4 * n);
        build(nums, 0, 0, n - 1);
    }

    // 區間更新：將 [L, R] 的每個元素加上 val
    void updateRange(int L, int R, int val) {
        updateRangeHelper(0, 0, n - 1, L, R, val);
    }

    // 查詢區間 [L, R] 的和
    long long query(int L, int R) {
        return queryHelper(0, 0, n - 1, L, R);
    }
};

// 使用示例
int main() {
    vector<int> nums = {1, 3, 5, 7, 9, 11};
    SegmentTreeLazy segTree(nums);

    cout << segTree.query(1, 3) << endl;  // 輸出: 15

    segTree.updateRange(1, 3, 10);  // 將 [1, 3] 的每個元素加 10
    cout << segTree.query(1, 3) << endl;  // 輸出: 45

    return 0;
}
```

### 4.2 LeetCode 題目應用

```cpp
// LeetCode 732. My Calendar III
class MyCalendarThree {
private:
    map<int, int> timeline;  // 時間線差分數組

public:
    MyCalendarThree() {}

    int book(int start, int end) {
        timeline[start]++;
        timeline[end]--;

        int maxBooking = 0;
        int currentBooking = 0;

        for (auto& [time, count] : timeline) {
            currentBooking += count;
            maxBooking = max(maxBooking, currentBooking);
        }

        return maxBooking;
    }
};

// 使用線段樹的版本
class MyCalendarThree {
private:
    unordered_map<int, int> tree;  // 稀疏線段樹
    unordered_map<int, int> lazy;

    void pushDown(int node, int start, int end) {
        if (lazy.count(node)) {
            int mid = (start + end) / 2;
            int leftChild = 2 * node;
            int rightChild = 2 * node + 1;

            tree[leftChild] += lazy[node];
            tree[rightChild] += lazy[node];
            lazy[leftChild] += lazy[node];
            lazy[rightChild] += lazy[node];

            lazy.erase(node);
        }
    }

    void update(int node, int start, int end, int L, int R) {
        if (R < start || end < L) return;

        if (L <= start && end <= R) {
            tree[node]++;
            lazy[node]++;
            return;
        }

        pushDown(node, start, end);

        int mid = (start + end) / 2;
        update(2 * node, start, mid, L, R);
        update(2 * node + 1, mid + 1, end, L, R);

        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

public:
    MyCalendarThree() {}

    int book(int start, int end) {
        update(1, 0, 1e9, start, end - 1);
        return tree[1];
    }
};
```

## 5. 動態開點線段樹

對於值域很大的問題，可以使用動態開點線段樹來節省空間。

```cpp
class DynamicSegmentTree {
private:
    struct Node {
        int sum;
        Node *left, *right;
        Node() : sum(0), left(nullptr), right(nullptr) {}
    };

    Node* root;
    int n;

    void update(Node*& node, int start, int end, int idx, int val) {
        if (!node) node = new Node();

        if (start == end) {
            node->sum = val;
            return;
        }

        int mid = (start + end) / 2;

        if (idx <= mid) {
            update(node->left, start, mid, idx, val);
        } else {
            update(node->right, mid + 1, end, idx, val);
        }

        int leftSum = node->left ? node->left->sum : 0;
        int rightSum = node->right ? node->right->sum : 0;
        node->sum = leftSum + rightSum;
    }

    int query(Node* node, int start, int end, int L, int R) {
        if (!node || R < start || end < L) {
            return 0;
        }

        if (L <= start && end <= R) {
            return node->sum;
        }

        int mid = (start + end) / 2;
        int leftSum = query(node->left, start, mid, L, R);
        int rightSum = query(node->right, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    DynamicSegmentTree(int size) : n(size), root(nullptr) {}

    void update(int idx, int val) {
        update(root, 0, n - 1, idx, val);
    }

    int query(int L, int R) {
        return query(root, 0, n - 1, L, R);
    }
};
```

## 6. 線段樹的變體

### 6.1 支持區間最大子段和

```cpp
class SegmentTreeMaxSum {
private:
    struct Node {
        int sum;        // 區間和
        int maxSum;     // 最大子段和
        int prefixMax;  // 最大前綴和
        int suffixMax;  // 最大後綴和
    };

    vector<Node> tree;
    int n;

    Node merge(const Node& left, const Node& right) {
        Node result;
        result.sum = left.sum + right.sum;
        result.prefixMax = max(left.prefixMax, left.sum + right.prefixMax);
        result.suffixMax = max(right.suffixMax, right.sum + left.suffixMax);
        result.maxSum = max({left.maxSum, right.maxSum,
                            left.suffixMax + right.prefixMax});
        return result;
    }

    void build(vector<int>& nums, int node, int start, int end) {
        if (start == end) {
            int val = nums[start];
            tree[node] = {val, val, val, val};
        } else {
            int mid = (start + end) / 2;
            build(nums, 2 * node + 1, start, mid);
            build(nums, 2 * node + 2, mid + 1, end);
            tree[node] = merge(tree[2 * node + 1], tree[2 * node + 2]);
        }
    }

public:
    SegmentTreeMaxSum(vector<int>& nums) {
        n = nums.size();
        tree.resize(4 * n);
        build(nums, 0, 0, n - 1);
    }

    int getMaxSum() {
        return tree[0].maxSum;
    }
};
```

## 7. 複雜度分析與總結

### 7.1 時間複雜度

| 操作 | 時間複雜度 |
|------|-----------|
| Build | O(n) |
| Query | O(log n) |
| Update (單點) | O(log n) |
| Update (區間) | O(log n) |

### 7.2 空間複雜度

- **完全線段樹**: O(4n)
- **動態開點**: O(k log n)，k 為操作次數

### 7.3 應用場景

1. **區間查詢**：區間和、最大/最小值、GCD
2. **區間修改**：單點更新、區間加法、區間賦值
3. **RMQ 問題**：Range Minimum/Maximum Query
4. **區間覆蓋**：日曆問題、掃描線算法

### 7.4 與其他數據結構的比較

| 數據結構 | 構建 | 查詢 | 更新 | 空間 |
|---------|------|------|------|------|
| 線段樹 | O(n) | O(log n) | O(log n) | O(n) |
| 樹狀數組 | O(n log n) | O(log n) | O(log n) | O(n) |
| 稀疏表 | O(n log n) | O(1) | - | O(n log n) |

**選擇建議**：
- 需要區間修改：線段樹 > 樹狀數組
- 只需要區間查詢：稀疏表 > 線段樹
- 實現簡單：樹狀數組 > 線段樹
- 功能強大：線段樹 > 樹狀數組

## 總結

線段樹是一種強大的數據結構：
- 支持高效的區間查詢和修改
- 使用懶惰標記優化區間更新
- 動態開點節省空間
- 適用於各種區間問題

**關鍵技巧**：
1. 樹節點數組大小為 4n
2. 左子節點：2*node+1，右子節點：2*node+2
3. 懶惰標記用於區間更新
4. 動態開點用於大值域問題
