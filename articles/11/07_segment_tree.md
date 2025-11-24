---
title: 11-7. Segment Tree Advanced
order: 7
description: 線段樹進階：Lazy Propagation 與動態開點
tags:
  - Segment Tree
  - Lazy Propagation
  - Range Query
  - Range Update
  - Dynamic Segment Tree
author: Rain Hu
date: '2025-10-11'
draft: false
subscription: member
---

# Segment Tree Advanced（線段樹進階）

## 前言

本章節為線段樹的進階內容，主要涵蓋：
- **Lazy Propagation（懶惰標記）**：高效處理區間修改
- **動態開點**：處理大範圍稀疏數據
- **複雜應用**：多種可結合操作的實現

**建議**：請先閱讀 [11-6. Fenwick Tree & Segment Tree](/articles/11/06_fenwick_tree_and_segment_tree) 瞭解基礎概念。

---

## 一、Lazy Propagation（懶惰標記）

### 二叉樹表示

每個節點代表一個區間 `[l, r]`：
- 左子節點：`[l, mid]`
- 右子節點：`[mid+1, r]`
- 葉節點：單個元素 `[i, i]`

```
原陣列: [2, 5, 1, 4, 9, 3]
索引:    0  1  2  3  4  5

線段樹（以區間和為例）：
                   [0,5]=24
                  /        \
            [0,2]=8        [3,5]=16
           /      \        /      \
      [0,1]=7   [2]=1  [3,4]=13  [5]=3
      /    \            /    \
   [0]=2  [1]=5     [3]=4  [4]=9

說明：
- 根節點 [0,5] 存儲整個陣列的和 24
- [0,2] 存儲前 3 個元素的和 8
- [3,4] 存儲 arr[3]+arr[4]=13
```

### 陣列表示

使用陣列存儲樹（類似 Heap）：

```
索引:  1     2      3      4     5     6    7    8   9   10  11
節點: [0,5] [0,2] [3,5] [0,1] [2]  [3,4] [5] [0] [1] [3] [4]

父子關係：
- parent(i) = i / 2
- left(i) = 2 * i
- right(i) = 2 * i + 1
```

**空間需求**：
- 完美二叉樹：2n - 1 個節點
- 實際分配：**4n**（保證足夠空間）

---

## 二、基本操作

### 1. 建樹（Build）

**思路**：遞迴分治
- 葉節點：直接賦值
- 非葉節點：左子樹 + 右子樹

```cpp
void build(int node, int start, int end) {
    if (start == end) {
        // 葉節點
        tree[node] = arr[start];
        return;
    }

    int mid = (start + end) / 2;
    int leftNode = 2 * node;
    int rightNode = 2 * node + 1;

    // 遞迴建立左右子樹
    build(leftNode, start, mid);
    build(rightNode, mid + 1, end);

    // 合併子節點信息
    tree[node] = tree[leftNode] + tree[rightNode];
}
```

**圖解**：

```
build(1, 0, 5):  // [0,5]
  ├─ build(2, 0, 2):  // [0,2]
  │   ├─ build(4, 0, 1):  // [0,1]
  │   │   ├─ build(8, 0, 0): tree[8]=2  // [0]
  │   │   ├─ build(9, 1, 1): tree[9]=5  // [1]
  │   │   └─ tree[4] = tree[8]+tree[9] = 7
  │   ├─ build(5, 2, 2): tree[5]=1  // [2]
  │   └─ tree[2] = tree[4]+tree[5] = 8
  ├─ build(3, 3, 5): ...
  └─ tree[1] = tree[2]+tree[3] = 24
```

**複雜度**：O(n)

---

### 2. 單點修改（Update）

**思路**：從根節點向下找到葉節點，修改後向上更新父節點

```cpp
void update(int node, int start, int end, int index, int value) {
    if (start == end) {
        // 找到目標葉節點
        tree[node] = value;
        return;
    }

    int mid = (start + end) / 2;
    int leftNode = 2 * node;
    int rightNode = 2 * node + 1;

    if (index <= mid) {
        // 目標在左子樹
        update(leftNode, start, mid, index, value);
    } else {
        // 目標在右子樹
        update(rightNode, mid + 1, end, index, value);
    }

    // 向上更新
    tree[node] = tree[leftNode] + tree[rightNode];
}
```

**圖解**：

```
修改 arr[4] = 10（原本是 9）：

路徑：[0,5] → [3,5] → [3,4] → [4]

    [0,5]=24 → 25
       ↓
    [3,5]=16 → 17
       ↓
    [3,4]=13 → 14
       ↓
     [4]=9 → 10
```

**複雜度**：O(log n)

---

### 3. 區間查詢（Query）

**思路**：
- 如果當前區間完全在查詢區間內 → 直接返回
- 否則遞迴查詢左右子樹，合併結果

```cpp
int query(int node, int start, int end, int L, int R) {
    // 當前區間完全不相交
    if (R < start || L > end) {
        return 0;  // 區間和的單位元
    }

    // 當前區間完全包含在查詢區間內
    if (L <= start && end <= R) {
        return tree[node];
    }

    // 部分重疊，遞迴查詢
    int mid = (start + end) / 2;
    int leftNode = 2 * node;
    int rightNode = 2 * node + 1;

    int leftSum = query(leftNode, start, mid, L, R);
    int rightSum = query(rightNode, mid + 1, end, L, R);

    return leftSum + rightSum;
}
```

**圖解**：

```
查詢 sum(1, 4)：

              [0,5]
             /     \
        [0,2]       [3,5]
       /    \       /    \
   [0,1]   [2]  [3,4]   [5]
   /  \         /  \
 [0] [1]      [3] [4]

路徑分析：
    [0,5]: 部分重疊 → 遞迴
    [0,2]: 部分重疊 → 遞迴
        [0,1]: 完全包含 → 返回 tree[4]=7
        [2]: 不相交 → 返回 0
    [3,5]: 部分重疊 → 遞迴
        [3,4]: 完全包含 → 返回 tree[6]=13
        [5]: 不相交 → 返回 0

結果：7 + 0 + 13 + 0 = 20 ✓
```

**複雜度**：O(log n)

---

## 三、完整基礎模板

```cpp
class SegmentTree {
private:
    vector<int> tree;
    int n;

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }

        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        build(arr, leftNode, start, mid);
        build(arr, rightNode, mid + 1, end);

        tree[node] = tree[leftNode] + tree[rightNode];
    }

    void update(int node, int start, int end, int index, int value) {
        if (start == end) {
            tree[node] = value;
            return;
        }

        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        if (index <= mid) {
            update(leftNode, start, mid, index, value);
        } else {
            update(rightNode, mid + 1, end, index, value);
        }

        tree[node] = tree[leftNode] + tree[rightNode];
    }

    int query(int node, int start, int end, int L, int R) {
        if (R < start || L > end) {
            return 0;
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        int leftSum = query(leftNode, start, mid, L, R);
        int rightSum = query(rightNode, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    SegmentTree(vector<int>& arr) : n(arr.size()) {
        tree.resize(4 * n, 0);
        build(arr, 1, 0, n - 1);
    }

    void update(int index, int value) {
        update(1, 0, n - 1, index, value);
    }

    int query(int L, int R) {
        return query(1, 0, n - 1, L, R);
    }
};
```

---

## 四、進階：Lazy Propagation（懶惰標記）

### 問題

如果需要**區間修改**（將 `[L, R]` 全部加上 `val`），基礎版本需要 O(n log n)，太慢！

**解決方案**：Lazy Propagation
- 修改時，只修改需要的節點，並打上**懶惰標記**
- 查詢時，再**下推標記**到子節點

### 核心思想

```
區間修改 [2, 4] 全部加 5：

不立即修改所有葉節點，而是在 [2,4] 節點打標記：
    lazy[node] = 5

查詢時才下推：
    如果遇到有標記的節點，先將標記下推到子節點
```

### 實現

```cpp
class SegmentTreeLazy {
private:
    vector<int> tree;
    vector<int> lazy;  // 懶惰標記
    int n;

    void pushDown(int node, int start, int end) {
        if (lazy[node] == 0) return;  // 沒有標記

        // 更新當前節點
        tree[node] += lazy[node] * (end - start + 1);

        // 如果不是葉節點，下推標記到子節點
        if (start != end) {
            int leftNode = 2 * node;
            int rightNode = 2 * node + 1;

            lazy[leftNode] += lazy[node];
            lazy[rightNode] += lazy[node];
        }

        // 清除當前節點的標記
        lazy[node] = 0;
    }

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }

        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        build(arr, leftNode, start, mid);
        build(arr, rightNode, mid + 1, end);

        tree[node] = tree[leftNode] + tree[rightNode];
    }

    void rangeUpdate(int node, int start, int end, int L, int R, int value) {
        // 先下推標記
        pushDown(node, start, end);

        // 不相交
        if (R < start || L > end) {
            return;
        }

        // 完全包含
        if (L <= start && end <= R) {
            lazy[node] += value;  // 打標記
            pushDown(node, start, end);  // 立即應用
            return;
        }

        // 部分重疊
        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        rangeUpdate(leftNode, start, mid, L, R, value);
        rangeUpdate(rightNode, mid + 1, end, L, R, value);

        // 向上更新（先下推子節點標記）
        pushDown(leftNode, start, mid);
        pushDown(rightNode, mid + 1, end);
        tree[node] = tree[leftNode] + tree[rightNode];
    }

    int query(int node, int start, int end, int L, int R) {
        // 先下推標記
        pushDown(node, start, end);

        if (R < start || L > end) {
            return 0;
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        int mid = (start + end) / 2;
        int leftNode = 2 * node;
        int rightNode = 2 * node + 1;

        int leftSum = query(leftNode, start, mid, L, R);
        int rightSum = query(rightNode, mid + 1, end, L, R);

        return leftSum + rightSum;
    }

public:
    SegmentTreeLazy(vector<int>& arr) : n(arr.size()) {
        tree.resize(4 * n, 0);
        lazy.resize(4 * n, 0);
        build(arr, 1, 0, n - 1);
    }

    void rangeUpdate(int L, int R, int value) {
        rangeUpdate(1, 0, n - 1, L, R, value);
    }

    int query(int L, int R) {
        return query(1, 0, n - 1, L, R);
    }
};
```

**複雜度**：
- 區間修改：O(log n)
- 區間查詢：O(log n)

---

## 五、進階：區間最值查詢

Segment Tree 可以支援任意**可結合**的操作（加法、最大值、最小值、GCD 等）。

### 區間最大值模板

```cpp
class SegmentTreeMax {
private:
    vector<int> tree;
    int n;

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }

        int mid = (start + end) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);

        // 合併：取最大值
        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

    void update(int node, int start, int end, int index, int value) {
        if (start == end) {
            tree[node] = value;
            return;
        }

        int mid = (start + end) / 2;

        if (index <= mid) {
            update(2 * node, start, mid, index, value);
        } else {
            update(2 * node + 1, mid + 1, end, index, value);
        }

        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int start, int end, int L, int R) {
        if (R < start || L > end) {
            return INT_MIN;  // 最大值的單位元
        }

        if (L <= start && end <= R) {
            return tree[node];
        }

        int mid = (start + end) / 2;
        int leftMax = query(2 * node, start, mid, L, R);
        int rightMax = query(2 * node + 1, mid + 1, end, L, R);

        return max(leftMax, rightMax);
    }

public:
    SegmentTreeMax(vector<int>& arr) : n(arr.size()) {
        tree.resize(4 * n);
        build(arr, 1, 0, n - 1);
    }

    void update(int index, int value) {
        update(1, 0, n - 1, index, value);
    }

    int query(int L, int R) {
        return query(1, 0, n - 1, L, R);
    }
};
```

---

## 六、LeetCode 題目詳解

### 1. LeetCode 307: Range Sum Query - Mutable

**題目**：支援單點修改和區間和查詢

**解法**：基礎 Segment Tree

```cpp
class NumArray {
private:
    SegmentTree st;

public:
    NumArray(vector<int>& nums) : st(nums) {}

    void update(int index, int val) {
        st.update(index, val);
    }

    int sumRange(int left, int right) {
        return st.query(left, right);
    }
};
```

---

### 2. LeetCode 715: Range Module

**題目**：設計一個資料結構，支援：
- `addRange(left, right)`：將 `[left, right)` 標記為已追蹤
- `queryRange(left, right)`：查詢 `[left, right)` 是否完全被追蹤
- `removeRange(left, right)`：將 `[left, right)` 標記為未追蹤

**解法**：Segment Tree + Lazy Propagation

```cpp
class RangeModule {
private:
    static const int MAX_RANGE = 1e9;
    unordered_map<int, bool> tree;  // 動態開點線段樹
    unordered_map<int, int> lazy;

    // 為了簡化，這裡展示基於離散化的版本
    map<int, int> intervals;  // 用平衡樹維護區間

public:
    RangeModule() {}

    void addRange(int left, int right) {
        auto it = intervals.upper_bound(left);

        if (it != intervals.begin()) {
            --it;
            if (it->second >= left) {
                left = it->first;
                right = max(right, it->second);
                intervals.erase(it);
            }
        }

        while (true) {
            it = intervals.lower_bound(left);
            if (it == intervals.end() || it->first > right) break;

            right = max(right, it->second);
            intervals.erase(it);
        }

        intervals[left] = right;
    }

    bool queryRange(int left, int right) {
        auto it = intervals.upper_bound(left);

        if (it == intervals.begin()) return false;
        --it;

        return it->second >= right;
    }

    void removeRange(int left, int right) {
        auto it = intervals.upper_bound(left);

        if (it != intervals.begin()) {
            --it;
            if (it->second > left) {
                int r = it->second;
                intervals[it->first] = left;

                if (r > right) {
                    intervals[right] = r;
                }
            }
        }

        while (true) {
            it = intervals.lower_bound(left);
            if (it == intervals.end() || it->first >= right) break;

            if (it->second > right) {
                intervals[right] = it->second;
            }

            intervals.erase(it);
        }
    }
};
```

**注意**：這題用 Segment Tree 實現較複雜，實際上用平衡樹（map）更簡潔。

---

### 3. LeetCode 732: My Calendar III

**題目**：實現一個日曆類，支援添加活動區間 `[start, end)`，返回當前最大重疊數

**範例**：
```
book(10, 20) → 1
book(50, 60) → 1
book(10, 40) → 2（[10, 20) 重疊 2 次）
book(5, 15) → 3（[10, 15) 重疊 3 次）
```

**解法**：差分 + Segment Tree（或 TreeMap）

```cpp
class MyCalendarThree {
private:
    map<int, int> delta;  // 差分

public:
    MyCalendarThree() {}

    int book(int start, int end) {
        delta[start]++;
        delta[end]--;

        int active = 0;
        int maxActive = 0;

        for (auto& [time, change] : delta) {
            active += change;
            maxActive = max(maxActive, active);
        }

        return maxActive;
    }
};
```

**使用 Segment Tree（區間修改 + 區間最大值）**：

這題用 Segment Tree 會更複雜，差分法更簡潔。

---

### 4. LeetCode 699: Falling Squares

**題目**：方塊從上方掉落到 x 軸上，返回每次掉落後的最大高度

**解法**：離散化 + Segment Tree（區間最大值 + 區間修改）

```cpp
class Solution {
public:
    vector<int> fallingSquares(vector<vector<int>>& positions) {
        // 離散化座標
        set<int> coords;
        for (auto& p : positions) {
            coords.insert(p[0]);
            coords.insert(p[0] + p[1]);
        }

        unordered_map<int, int> compress;
        int id = 0;
        for (int c : coords) {
            compress[c] = id++;
        }

        // Segment Tree（區間最大值 + 區間修改）
        int n = coords.size();
        vector<int> tree(4 * n, 0);
        vector<int> lazy(4 * n, 0);

        auto pushDown = [&](int node, int start, int end) {
            if (lazy[node] == 0) return;

            tree[node] = max(tree[node], lazy[node]);

            if (start != end) {
                lazy[2 * node] = max(lazy[2 * node], lazy[node]);
                lazy[2 * node + 1] = max(lazy[2 * node + 1], lazy[node]);
            }

            lazy[node] = 0;
        };

        function<void(int, int, int, int, int, int)> update =
            [&](int node, int start, int end, int L, int R, int height) {
            pushDown(node, start, end);

            if (R < start || L > end) return;

            if (L <= start && end <= R) {
                lazy[node] = height;
                pushDown(node, start, end);
                return;
            }

            int mid = (start + end) / 2;
            update(2 * node, start, mid, L, R, height);
            update(2 * node + 1, mid + 1, end, L, R, height);

            pushDown(2 * node, start, mid);
            pushDown(2 * node + 1, mid + 1, end);
            tree[node] = max(tree[2 * node], tree[2 * node + 1]);
        };

        function<int(int, int, int, int, int)> query =
            [&](int node, int start, int end, int L, int R) -> int {
            pushDown(node, start, end);

            if (R < start || L > end) return 0;

            if (L <= start && end <= R) {
                return tree[node];
            }

            int mid = (start + end) / 2;
            return max(query(2 * node, start, mid, L, R),
                      query(2 * node + 1, mid + 1, end, L, R));
        };

        vector<int> result;
        int maxHeight = 0;

        for (auto& p : positions) {
            int left = compress[p[0]];
            int right = compress[p[0] + p[1]] - 1;
            int size = p[1];

            int currentMax = query(1, 0, n - 1, left, right);
            int newHeight = currentMax + size;

            update(1, 0, n - 1, left, right, newHeight);

            maxHeight = max(maxHeight, newHeight);
            result.push_back(maxHeight);
        }

        return result;
    }
};
```

---

## 七、常見陷阱與技巧

### 陷阱 1：空間不足

```cpp
// 錯誤：只分配 2n
vector<int> tree(2 * n);

// 正確：分配 4n（保證足夠）
vector<int> tree(4 * n);
```

### 陷阱 2：單位元選擇錯誤

```cpp
// 區間和的單位元是 0
if (不相交) return 0;

// 區間最大值的單位元是 INT_MIN
if (不相交) return INT_MIN;

// 區間最小值的單位元是 INT_MAX
if (不相交) return INT_MAX;
```

### 陷阱 3：Lazy Propagation 忘記 pushDown

```cpp
// 錯誤：查詢前忘記下推標記
int query(...) {
    // 直接查詢 tree[node]  ✗
}

// 正確：先下推
int query(...) {
    pushDown(node, start, end);  // 必須！
    // 然後查詢
}
```

### 技巧 1：zkw Segment Tree（非遞迴）

```cpp
class zkwSegmentTree {
private:
    vector<int> tree;
    int n, size;

public:
    zkwSegmentTree(vector<int>& arr) {
        n = arr.size();
        size = 1;
        while (size < n) size <<= 1;

        tree.resize(2 * size, 0);

        for (int i = 0; i < n; i++) {
            tree[size + i] = arr[i];
        }

        for (int i = size - 1; i > 0; i--) {
            tree[i] = tree[2 * i] + tree[2 * i + 1];
        }
    }

    void update(int index, int value) {
        index += size;
        tree[index] = value;

        while (index > 1) {
            index >>= 1;
            tree[index] = tree[2 * index] + tree[2 * index + 1];
        }
    }

    int query(int L, int R) {
        L += size;
        R += size;
        int sum = 0;

        while (L <= R) {
            if (L & 1) sum += tree[L++];
            if (!(R & 1)) sum += tree[R--];
            L >>= 1;
            R >>= 1;
        }

        return sum;
    }
};
```

**優勢**：常數因子更小，速度更快

### 技巧 2：動態開點（處理大範圍稀疏數據）

當範圍很大（如 10^9）但實際使用的點很少時，使用動態開點：

```cpp
struct Node {
    int sum;
    Node *left, *right;

    Node() : sum(0), left(nullptr), right(nullptr) {}
};

class DynamicSegmentTree {
private:
    Node* root;
    int n;

    void update(Node*& node, int start, int end, int index, int value) {
        if (!node) node = new Node();

        if (start == end) {
            node->sum = value;
            return;
        }

        int mid = (start + end) / 2;

        if (index <= mid) {
            update(node->left, start, mid, index, value);
        } else {
            update(node->right, mid + 1, end, index, value);
        }

        int leftSum = node->left ? node->left->sum : 0;
        int rightSum = node->right ? node->right->sum : 0;
        node->sum = leftSum + rightSum;
    }

public:
    DynamicSegmentTree(int range) : n(range) {
        root = nullptr;
    }

    void update(int index, int value) {
        update(root, 0, n - 1, index, value);
    }

    // query 類似實現
};
```

---

## 八、總結

### 核心操作複雜度

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 建樹 | O(n) | O(4n) |
| 單點修改 | O(log n) | - |
| 區間查詢 | O(log n) | - |
| 區間修改（Lazy） | O(log n) | - |

### 適用場景

| 問題類型 | 是否適用 |
|---------|---------|
| 區間和查詢 + 單點修改 | 適合 |
| 區間最值查詢 | 適合 |
| 區間修改 + 區間查詢 | Lazy Propagation |
| 動態維護複雜信息 | 可結合的任意操作 |
| 靜態查詢 | 用 Prefix Sum 更簡單 |
| 單點修改簡單場景 | Fenwick Tree 更簡潔 |

### Segment Tree vs Fenwick Tree

| 特性 | Segment Tree | Fenwick Tree |
|------|-------------|--------------|
| 實現難度 | 複雜 | 簡單 |
| 代碼量 | 50+ 行 | 20 行 |
| 空間 | O(4n) | O(n) |
| 區間修改 | Lazy Propagation | 需要差分 |
| 支援操作 | 任意可結合操作 | 主要是加法 |
| 區間最值 | 適合 | 不支援 |

### 模板速查

```cpp
class SegmentTree {
    vector<int> tree;
    int n;

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(arr, 2*node, start, mid);
        build(arr, 2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    void update(int node, int start, int end, int index, int value) {
        if (start == end) {
            tree[node] = value;
            return;
        }
        int mid = (start + end) / 2;
        if (index <= mid) update(2*node, start, mid, index, value);
        else update(2*node+1, mid+1, end, index, value);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    int query(int node, int start, int end, int L, int R) {
        if (R < start || L > end) return 0;
        if (L <= start && end <= R) return tree[node];
        int mid = (start + end) / 2;
        return query(2*node, start, mid, L, R) +
               query(2*node+1, mid+1, end, L, R);
    }

public:
    SegmentTree(vector<int>& arr) : n(arr.size()) {
        tree.resize(4 * n);
        build(arr, 1, 0, n-1);
    }

    void update(int index, int value) {
        update(1, 0, n-1, index, value);
    }

    int query(int L, int R) {
        return query(1, 0, n-1, L, R);
    }
};
```

Segment Tree 是最強大的區間資料結構，掌握它就能解決幾乎所有區間問題！
