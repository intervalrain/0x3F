---
title: 11-6. Fenwick Tree & Segment Tree
order: 6
description: 區間資料結構：從權衡取捨到最佳化方案
tags:
  - Fenwick Tree
  - Segment Tree
  - Binary Indexed Tree
  - Range Query
  - Dynamic Programming
author: Rain Hu
date: '2025-10-11'
draft: false
---

# Fenwick Tree & Segment Tree

## 前言：Query vs Update 的權衡取捨

### 問題的本質

對於動態序列，我們需要支援兩種基本操作：
- **Query（查詢）**：取得區間信息（和、最值等）
- **Update（修改）**：修改單點或區間

在實際應用中，這兩種操作的**頻率**決定了最佳資料結構的選擇。

---

### 基礎方案的權衡

#### **場景 1：Immutable Container / Low Frequency Update**

```cpp
// Prefix Sum（前綴和）
vector<int> prefix = {0};
for (int num : nums) {
    prefix.push_back(prefix.back() + num);
}

// Query: O(1)
int sum = prefix[r+1] - prefix[l];

// Update: O(n) - 需要重建整個 prefix
```

**特性**：
- Query: **O(1)** 
- Update: **O(n)** 
- **適用**：查詢頻繁，修改罕見

---

#### **場景 2：Mutable Container / High Frequency Update**

```cpp
// 普通陣列
vector<int> arr(n);

// Update: O(1)
arr[i] = value;

// Query: O(n) - 需要遍歷累加
int sum = 0;
for (int i = l; i <= r; i++) {
    sum += arr[i];
}
```

**特性**：
- Query: **O(n)** 
- Update: **O(1)** 
- **適用**：修改頻繁，查詢罕見

---

#### **場景 3：Balanced Case - Query 和 Update 頻率相當**

**問題**：如何兼顧兩者？

**解決方案**：
- 🎯 **Fenwick Tree（樹狀陣列）**
- 🎯 **Segment Tree（線段樹）**

兩者都能達到 **O(log n)** 的平衡效率

---

### 視覺化對比

#### **Array（數組）**
```
8               o
7             o
6           o
5         o
4       o
3     o
2   o
1 o 
0 1 2 3 4 5 6 7 8  -> nums[i]  
```

#### **Prefix Sum（前綴和）**

```
8               o
7             o o
6           o o o
5         x o o o  以 prefix[5] 為例(見 x 處)，代表它包含了 sum[1:5]
4       o x o o o  若要求 sum[3:5] 可以用 sum[1:5] - sum[1:2]
3     o o x o o o  也就是 prefix[5] - prefix[2]
2   * o o x o o o
1 o * o o x o o o
0 1 2 3 4 5 6 7 8  -> prefix[i]  
    ▲     ▲ 
    │     └─ prefix[5]
    └─ prefix[2]     

Query: O(1) → sum(l,r) = prefix[r] - prefix[l-1]
Update: O(n) → 需要重建整個 prefix
```

**結構特點**：
- 每個節點依賴所有前面的節點
- 修改一個元素 → 影響後續所有前綴和w
```
8               o
7             o o
6           o o o
5         x x x x  若要修改 prefix[5] 代表要將包含他的 prefix[5:] 進行修改
4       o o o o o  (見 x 處) 
3     o o o o o o  
2   o o o o o o o
1 o o o o o o o o
0 1 2 3 4 5 6 7 8  -> prefix[i] 
```
---

#### **Fenwick Tree（樹狀陣列）**

```
8               o
7             o o
6           o   o
5         o o   o        Fenwick Tree 取數組與前綴合的特性的 tradeoff 用 bit 的特殊性質做成一個「半滿」樹
4       o       o
3     o o       o
2   o   o       o        update → i += lsb(i)
1 o o   o       o        query  ← i -= lsb(i)
0 1 2 3 4 5 6 7 8

bit[i] 儲存長度為 lsb(i) 的區間和

Query: O(log n)  → 向下跳躍累加
Update: O(log n) → 向上跳躍更新
```

**結構特點**：
- 利用二進位特性，建構樹狀層級結構
- 每個節點只管理部分區間
- 修改一個元素 → 只影響 O(log n) 個節點

**核心操作**：
```cpp
int lsb(int x) { return x & -x; }  // 提取最低位的 1
```

- lsb 是 Least Significant Bit，表示最低位的 1
```
1110001101011000    x
0001110010100111   ~x
0001110010101000   ~x + 1 == -x
================
0000000000001000   <- lsb(x)
```

**查詢**
```
8               o
7             x o
6           x   o
5         o x   o    求 query(7) = bit(7) + bit(6) + bit(4)
4       x       o    
3     o x       o    7 = 0b0111  <- 減去最低位數的 1 (aka. lsb)
2   o   x       o    6 = 0b0110   ∴ next_index = index - lsb(index)
1 o o   X       o    4 = 0b0100 
0 1 2 3 4 5 6 7 8
```
**修改**

```
8               o
7             o o
6           o   o
5         o o   o    update(3) => update(3) + update(4) + update(7)        
4       o       o    
3     x x       x    3 = 0b0011  <- 加上最低位數的 1 (aka. lsb)
2   o   o       o    4 = 0b0100   ∴ next_index = 
1 o o   o       o    8 = 0b1000
0 1 2 3 4 5 6 7 8
```

---

#### **三者對比總覽**

| 方案 | Query | Update | 空間 | 適用場景 |
|------|-------|--------|------|----------|
| **Prefix Sum** | O(1) | O(n) | O(n) | 靜態查詢 / 低頻修改 |
| **普通陣列** | O(n) | O(1) | O(n) | 高頻修改 / 低頻查詢 |
| **Fenwick Tree** | O(log n) | O(log n) | O(n) | **平衡場景** |
| **Segment Tree** | O(log n) | O(log n) | O(4n) | **複雜區間操作** |

* 註：Fenwick 只能求和，Segment Tree 可以求和、求最大值、最小值。

---

## 一、Fenwick Tree（樹狀陣列 / Binary Indexed Tree）

### 1.1 核心原理： LSB 操作

```cpp
int lsb(int x) {
    return x & -x;  // 提取最低位的 1
}
```

**含義**：返回 `x` 的二進位表示中**最低位的 1** 所代表的值

**範例**：
```
x = 6 (二進位: 0110)
-x = -6 (二補數: 1010)
x & -x = 0110 & 1010 = 0010 = 2

lsb(6) = 2
lsb(5) = 1 (0101 → 最低位 1)
lsb(8) = 8 (1000 → 最低位 1)
lsb(12) = 4 (1100 → 0100)
```

---

### 1.2 樹狀結構

Fenwick Tree 將陣列索引視為樹節點，每個節點負責一段區間的和。

| 索引 | 二進位表示 | LSB |
|:--:|:--:|:--:|
| 1 | 0001 | 1 |
| 2 | 0010 | 2 |
| 3 | 0011 | 1 |
| 4 | 0100 | 4 |
| 5 | 0101 | 1 |
| 6 | 0110 | 2 |
| 7 | 0111 | 1 |
| 8 | 1000 | 8 |

```
     i: 1  2  3  4  5  6  7  8
lsb(i): 1  2  1  4  1  2  1  8  <-  lsb 正好代表從 i 往前包含的個數

8               o
7             o o
6           o   o
5         o o   o  
4       x       o    
3     o x       o  
2   o   x       o  
1 o o   x       o  
0 1 2 3 4 5 6 7 8
        ▲ 
        └─ lsb(4) = 4,   tree[4] = sum[1:4]

樹狀結構（每個節點負責的區間）：
tree[1] 管理 [1, 1]      (長度 1)
tree[2] 管理 [1, 2]      (長度 2)
tree[3] 管理 [3, 3]      (長度 1)
tree[4] 管理 [1, 4]      (長度 4)
tree[5] 管理 [5, 5]      (長度 1)
tree[6] 管理 [5, 6]      (長度 2)
tree[7] 管理 [7, 7]      (長度 1)
tree[8] 管理 [1, 8]      (長度 8)
```

**圖解**：

```
樹形結構（父子關係）：

              8                      1000 
             /|\                      /|\   
            / | \                    / | \  
           /  |  \                  /  |  \ 
          4   6   7              100 110 111
         /|   |                  / |   |    
        / |   |                 /  |   |    
       2  3   5               10  11 101    
      /                      /            
     1                      1             

每個節點的父節點：parent(i) = i + lsb(i)
每個節點的子節點：child(i) = i - lsb(i)
```

---

### 1.3 基礎操作

#### **前綴和查詢**

計算 `sum(1, i)`（1 到 i 的和）：

```cpp
int query(int i) {
    int sum = 0;
    while (i > 0) {
        sum += tree[i];
        i -= lsb(i);  // 向下跳躍
    }
    return sum;
}
```

**範例**：
```
sum(7) = tree[7] + tree[6] + tree[4]

過程：
    i = 7: tree[7] 管理 [7, 7]
    i = 7 - lsb(7) = 7 - 1 = 6
    i = 6: tree[6] 管理 [5, 6]
    i = 6 - lsb(6) = 6 - 2 = 4
    i = 4: tree[4] 管理 [1, 4]
    i = 4 - lsb(4) = 4 - 4 = 0（停止）

結果：sum(7) = tree[7] + tree[6] + tree[4]
            = [7,7] + [5,6] + [1,4]
            = [1,7]  ✓
```

**圖解**：

```
查詢 sum(7)：

    7 → 6 → 4 → 0
    ↓   ↓   ↓
   [7] [5,6] [1,4]

路徑長度 = O(log n)
```

---

#### **單點修改**

修改 `arr[i]` 的值（增加 delta）：

```cpp
void update(int i, int delta) {
    while (i <= n) {
        tree[i] += delta;
        i += lsb(i);  // 向上跳躍
    }
}
```

**範例**：
```
update(3, delta):
    影響的節點：tree[3], tree[4], tree[8], ...

過程：
    i = 3: 更新 tree[3]
    i = 3 + lsb(3) = 3 + 1 = 4
    i = 4: 更新 tree[4]
    i = 4 + lsb(4) = 4 + 4 = 8
    i = 8: 更新 tree[8]
    i = 8 + lsb(8) = 8 + 8 = 16（超出範圍，停止）
```

**圖解**：

```
更新 arr[3]，需要更新路徑：

    3 → 4 → 8
    ↑   ↑   ↑
  向上傳播影響

路徑長度 = O(log n)
```

---

### 1.4 完整模板

```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;

    int lsb(int x) {
        return x & -x;
    }

public:
    // 建構函數：1-indexed
    FenwickTree(int size) : n(size) {
        tree.resize(n + 1, 0);  // 索引從 1 開始
    }

    // 從陣列建構
    FenwickTree(vector<int>& arr) : n(arr.size()) {
        tree.resize(n + 1, 0);
        for (int i = 0; i < n; i++) {
            update(i + 1, arr[i]);  // 1-indexed
        }
    }

    // 單點修改：將 index 位置增加 delta
    void update(int index, int delta) {
        while (index < tree.size()) {  // 也可以寫 while (index <= n)
            tree[index] += delta;
            index += lsb(index);
        }
    }

    // 前綴和查詢：sum(1, index)
    int query(int index) {
        int sum = 0;
        while (index > 0) {
            sum += tree[index];
            index -= lsb(index);
        }
        return sum;
    }

    // 區間和查詢：sum(left, right)
    int rangeQuery(int left, int right) {
        return query(right) - query(left - 1);     // 是不是很像 prefix(right) - prefix(left-1)
    }
};
```

---

### 1.5 應用實戰：LeetCode 315 - Count of Smaller Numbers After Self

#### **題目**

對於陣列中每個元素 `nums[i]`，計算有多少個 `nums[j]` 滿足 `j > i` 且 `nums[j] < nums[i]`

**範例**：
```
nums = [5, 2, 6, 1]
輸出: [2, 1, 1, 0]

解釋：
    5 的右邊比它小的：2, 1（共 2 個）
    2 的右邊比它小的：1（共 1 個）
    6 的右邊比它小的：1（共 1 個）
    1 的右邊比它小的：無（0 個）
```

#### **解法：離散化 + Fenwick Tree + 從右往左掃描**

```cpp
class Tree {
private:
    vector<int> bit;
    unordered_map<int,int> map;

    int lsb(int a) {
        return a & -a;
    }

public:
    Tree(vector<int>& nums) {
        int n = nums.size() + 1;
        bit.assign(n, 0);

        // 離散化：將數值映射到 [1, k]
        set<int> st(nums.begin(), nums.end());
        int i = 1;      // 注意是 1-index
        for (auto it = st.begin(); it != st.end(); it++, i++) {
            map[*it] = i;  // 數值 → 排名映射
        }
    }

    // 前綴和查詢
    int query(int i) {
        int sum = 0;
        while (i) {
            sum += bit[i];
            i -= lsb(i);
        }
        return sum;
    }

    // 單點增加
    void increment(int i) {
        while (i < bit.size()) {
            bit[i]++;
            i += lsb(i);
        }
    }

    // 查詢 + 更新
    int get(int num) {
        int idx = map[num];
        int res = query(idx - 1);  // 查詢比 num 小的數量
        increment(idx);            // 將 num 加入統計
        return res;
    }
};

class Solution {
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        Tree* root = new Tree(nums);
        vector<int> res(n);

        // 從右往左掃描
        for (int i = n - 1; i >= 0; i--) {
            res[i] = root->get(nums[i]);
        }

        return res;
    }
};
```

#### **解題思路**：

1. **離散化**：
   - 將數值映射到 [1, k] 範圍（k 為不同數字個數）
   - 避免空間浪費（如數值範圍 10^9 但只有 10^5 個數）

2. **從右往左掃描**：
   - 維護已處理元素的頻率統計
   - 當前元素的答案 = 已處理元素中比它小的數量

3. **Fenwick Tree 的作用**：
   - `query(idx-1)`：查詢排名 < idx 的元素總數（即比當前數小）
   - `increment(idx)`：將當前數加入頻率統計

**複雜度**：
- 時間：O(n log k)，k 為不同數字個數
- 空間：O(k)

---

## 二、Segment Tree（線段樹）

### 2.1 核心概念

Segment Tree（線段樹）是一種**功能最強大**的區間資料結構，支援：
- **區間查詢**：O(log n)（區間和、最值、GCD 等）
- **單點修改**：O(log n)
- **區間修改**：O(log n)（配合 Lazy Propagation）

**核心思想**：
- 每個節點代表一個**區間**
- 父節點的區間是子節點區間的合併
- 使用**分治**思想處理區間操作

---

### 2.2 樹的結構

#### **二叉樹表示**

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

#### **陣列表示**

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

### 2.3 基礎操作

#### **1. 建樹（Build）**

```cpp
void build(vector<int>& arr, int node, int start, int end) {
    if (start == end) {
        // 葉節點
        tree[node] = arr[start];
        return;
    }

    int mid = (start + end) / 2;
    int leftNode = 2 * node;
    int rightNode = 2 * node + 1;

    // 遞迴建立左右子樹
    build(arr, leftNode, start, mid);
    build(arr, rightNode, mid + 1, end);

    // 合併子節點信息
    tree[node] = tree[leftNode] + tree[rightNode];
}
```

**複雜度**：O(n)

---

#### **2. 單點修改（Update）**

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

**複雜度**：O(log n)

---

#### **3. 區間查詢（Query）**

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

**複雜度**：O(log n)

---

### 2.4 完整基礎模板

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

## 三、進階變體：zkw 線段樹

### 3.1 核心思想

zkw 線段樹是一種**非遞迴實現**的線段樹，利用**完全二叉樹**的陣列表示，避免遞迴開銷。

**優勢**：
- 常數因子更小（無遞迴開銷）
- 代碼簡潔（30 行左右）
- 空間 O(2n)
- 速度比遞迴版快 2-3 倍

---

### 3.2 結構說明
- 主要的差異在於，zkw 的線段樹是**完美二叉樹(perfact binary tree)**，而一般線段樹是**完全二叉樹(complete binary tree)**。
- zkw 的線段樹的子樹，都代表自己的值
- 父節點與子節點的關係為 `left = parent << 1`, `right = parent << 1 | 1`
- 最底層我們要放下整個數組，令底層的長度是 m，數組長度是 n。
  - 滿足 m 為 $2^n$，且 m >= n
  - `for (m = 1; m < n; m <<= 1);` 

**圖解**
```
                1  (十進制)                              1  (二進制) 
        2               3                 10                        11
    4       5       6       7        100         101          110         111
  8   9  10  11  12  13  14  15   1000  1001  1010  1011  1100  1101  1110  1111

```


**視覺化**：
```
令原數組是 [2,5,1,4,9,3]
                _
        _               _
    _       _       _       _
  2   5   1   4   9   3   _   _
 8(2) 9(5) 12(4) 13(9)  ◀─ 數組都放在最下面一排，換言之 tree[m+0:m+n-1] = nums[0:n-1]

 葉節點層從索引 m 開始
```

- 向上更新，父節點是兩個子節點的和或最大值、最小值或最大公因數等等。我們以和為例。
```
令原數組是 [2,5,1,4,9,3]
               24  ◀─ 代表 sum[0:n-1] 
       12              12
    7       5      12       0
  2   5   1   4   9   3   0   0

 葉節點層從索引 m 開始
```

---

### 3.3 完整實現

```cpp
class zkwSegmentTree {
private:
    vector<int> arr;
    int m;  // 大於等於 n 的最小 2 的冪

public:
    zkwSegmentTree(vector<int>& nums) {
        int n = nums.size();

        // 找到最小的 2^k >= n
        for (m = 1; m < n; m <<= 1);

        // 分配 2*m 空間
        arr.assign(m << 1, 0);

        // 建樹：葉節點從 m 開始
        for (int i = 0; i < n; i++) {
            arr[m + i] = nums[i];
        }

        // 向上構建
        for (int i = m - 1; i > 0; i--) {
            arr[i] = arr[i << 1] + arr[i << 1 | 1];
        }
    }

    // 單點修改
    void update(int index, int delta) {
        index += m;

        // 向上更新
        while (index > 1) {
            arr[index] += delta; 
            index >>= 1;
        }
    }

    // 區間查詢 [l, r]
    int query(int l, int r) {
        l += m;
        r += m;
        int sum = 0;

        while (l <= r) {
            if (l & 1) sum += arr[l++];      // 左邊界是右子節點
            if (!(r & 1)) sum += arr[r--];   // 右邊界是左子節點
            l >>= 1;
            r >>= 1;
        }

        return sum;
    }
};
```

---

### 3.4 zkw 查詢原理圖解

```
查詢 query(1, 4)：（0-indexed，對應葉節點 9, 10, 11, 12）

步驟 1：l=9, r=12
    l=9 是奇數（右子節點）→ 加入 arr[9]，l=10
    r=12 是偶數（左子節點）→ 加入 arr[12]，r=11
    l=10>>1=5, r=11>>1=5

步驟 2：l=5, r=5
    l=5 是奇數 → 加入 arr[5]，l=6
    r=5 是奇數 → 不處理
    l > r，結束

結果：arr[9] + arr[12] + arr[5] = nums[1] + nums[4] + sum(nums[2:3])
```

---

## 四、全面對比

### 4.1 複雜度對比

| 資料結構 | Query | Update | 空間 | 代碼量 | 實現難度 |
|---------|-------|--------|------|--------|----------|
| **Prefix Sum** | O(1) | O(n) | O(n) | 5 行 | 極簡 |
| **普通陣列** | O(n) | O(1) | O(n) | 2 行 | 極簡 |
| **Fenwick Tree** | O(log n) | O(log n) | O(n) | 20 行 | 簡單 |
| **Segment Tree** | O(log n) | O(log n) | O(4n) | 50+ 行 | 複雜 |
| **zkw Segment Tree** | O(log n) | O(log n) | O(2n) | 30 行 | 中等 |

---

### 4.2 功能對比

| 功能 | Prefix Sum | Fenwick Tree | Segment Tree | zkw Tree |
|------|-----------|-------------|--------------|----------|
| **單點修改** | ❌ | ✅ | ✅ | ✅ |
| **區間查詢** | ✅ | ✅ | ✅ | ✅ |
| **區間修改** | ❌ | ⚠️ 需差分 | ✅ Lazy | ⚠️ 需差分 |
| **區間最值** | ❌ | ❌ | ✅ | ✅ |
| **支援操作** | 加法 | 加法為主 | 任意可結合 | 任意可結合 |

---

### 4.3 選擇指南

```cpp
// 決策樹
if (不需要修改 || 修改非常罕見) {
    return "Prefix Sum";
} else if (經常修改) {
    return "Array"
}

if (只需要 "區間和查詢 + 單點修改") {
    if (追求代碼簡潔) {
        return "Fenwick Tree";
    } else if (追求性能) {
        return "zkw Segment Tree";  
    }
}

if (需要 "區間修改 + 區間查詢") {
    return "Segment Tree with Lazy Propagation";
}
```

---

## 五、常見陷阱與技巧

### 5.1 Fenwick Tree 陷阱

#### **陷阱 1：索引從 0 開始**

```cpp
// 錯誤：Fenwick Tree 索引從 1 開始
FenwickTree ft(n);
ft.update(0, val);  // 錯誤！索引 0 無效

// 正確：轉換為 1-indexed
ft.update(i + 1, val);
```

#### **陷阱 2：忘記離散化**

當數值範圍很大（如 10^9）但數量很少（如 10^5）時，必須**離散化**：

```cpp
// 錯誤：直接用原始值
FenwickTree ft(1e9);  // 空間爆炸！

// 正確：離散化
set<int> st(nums.begin(), nums.end());
unordered_map<int, int> rank;
int i = 1;
for (int num : st) {
    rank[num] = i++;
}

FenwickTree ft(st.size());
```

---

### 5.2 Segment Tree 陷阱

#### **陷阱 1：空間不足**

```cpp
// 錯誤：只分配 2n
vector<int> tree(2 * n);

// 正確：分配 4n（保證足夠）
vector<int> tree(4 * n);
```

#### **陷阱 2：單位元選擇錯誤**

```cpp
// 區間和的單位元是 0
if (不相交) return 0;

// 區間最大值的單位元是 INT_MIN
if (不相交) return INT_MIN;

// 區間最小值的單位元是 INT_MAX
if (不相交) return INT_MAX;
```

---

### 5.3 技巧：差分陣列實現區間修改

```cpp
// 使用 Fenwick Tree 維護差分陣列
class FenwickTreeRangeUpdate {
private:
    FenwickTree diff;  // 存儲差分陣列

public:
    FenwickTreeRangeUpdate(int n) : diff(n) {}

    // 區間修改：將 [left, right] 全部加上 delta
    void rangeUpdate(int left, int right, int delta) {
        diff.update(left, delta);
        diff.update(right + 1, -delta);
    }

    // 單點查詢
    int query(int index) {
        return diff.query(index);
    }
};
```

---

## 六、總結

### 核心思想回顧

- **Prefix Sum**：犧牲修改效率，換取 O(1) 查詢
- **Fenwick Tree**：用 lsb 特性，實現 O(log n) 的平衡
- **Segment Tree**：分治思想，支援任意可結合操作
- **zkw Segment Tree**：非遞迴優化，速度更快

---

### 適用場景總覽

| 問題類型 | 最佳方案 |
|---------|---------|
| 靜態前綴和 | Prefix Sum |
| 動態前綴和 | Fenwick Tree |
| 逆序對計數 | Fenwick Tree |
| 區間最值 | Segment Tree / zkw |
| 區間修改 + 查詢 | Segment Tree (Lazy) |
| 高性能區間操作 | zkw Segment Tree |
