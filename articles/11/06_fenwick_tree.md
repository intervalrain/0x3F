---
title: "Fenwick Tree (Binary Indexed Tree)"
order: 6
description: "樹狀陣列：動態維護前綴和的高效結構"
tags: ["Fenwick Tree", "BIT", "Binary Indexed Tree", "Prefix Sum"]
---

# Fenwick Tree (Binary Indexed Tree)

## 核心概念

Fenwick Tree（樹狀陣列），也稱為 Binary Indexed Tree (BIT)，是一種用於**動態維護前綴和**的資料結構。

**核心優勢**：
- 支援**單點修改** + **區間查詢**，都是 O(log n)
- 實現**簡單**，代碼量少
- 空間開銷小，只需 O(n)

**對比**：
- Prefix Sum：O(1) 查詢，但不支援修改
- Fenwick Tree：O(log n) 查詢 + O(log n) 修改
- Segment Tree：功能更強，但實現複雜

---

## 一、基本原理

### lowbit 操作

Fenwick Tree 的核心是 `lowbit(x)` 操作：

```cpp
int lowbit(int x) {
    return x & -x;
}
```

**含義**：返回 `x` 的二進位表示中**最低位的 1** 所代表的值

**範例**：
```
x = 6 (二進位: 0110)
-x = -6 (二補數: 1010)
x & -x = 0110 & 1010 = 0010 = 2

lowbit(6) = 2
lowbit(5) = 1 (0101 → 最低位 1)
lowbit(8) = 8 (1000 → 最低位 1)
lowbit(12) = 4 (1100 → 0100)
```

### 樹狀結構

Fenwick Tree 將陣列索引視為樹節點，每個節點負責一段區間的和。

```
索引（1-indexed）：  1  2  3  4  5  6  7  8
lowbit(i):          1  2  1  4  1  2  1  8

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

              8
             /|\
            / | \
           /  |  \
          4   6   7
         /|   |
        / |   |
       2  3   5
      /
     1

每個節點的父節點：parent(i) = i + lowbit(i)
每個節點的子節點：child(i) = i - lowbit(i)
```

### 前綴和計算

計算 `sum(1, i)`（1 到 i 的和）：

```
sum(7) = tree[7] + tree[6] + tree[4]

過程：
    i = 7: tree[7] 管理 [7, 7]
    i = 7 - lowbit(7) = 7 - 1 = 6
    i = 6: tree[6] 管理 [5, 6]
    i = 6 - lowbit(6) = 6 - 2 = 4
    i = 4: tree[4] 管理 [1, 4]
    i = 4 - lowbit(4) = 4 - 4 = 0（停止）

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

### 單點修改

修改 `arr[i]` 的值（增加 delta）：

```
update(3, delta):
    影響的節點：tree[3], tree[4], tree[8], ...

過程：
    i = 3: 更新 tree[3]
    i = 3 + lowbit(3) = 3 + 1 = 4
    i = 4: 更新 tree[4]
    i = 4 + lowbit(4) = 4 + 4 = 8
    i = 8: 更新 tree[8]
    i = 8 + lowbit(8) = 8 + 8 = 16（超出範圍，停止）
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

## 二、基礎實現

### C++ 模板

```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;

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
        while (index <= n) {
            tree[index] += delta;
            index += lowbit(index);
        }
    }

    // 前綴和查詢：sum(1, index)
    int query(int index) {
        int sum = 0;

        while (index > 0) {
            sum += tree[index];
            index -= lowbit(index);
        }

        return sum;
    }

    // 區間和查詢：sum(left, right)
    int rangeQuery(int left, int right) {
        return query(right) - query(left - 1);
    }

private:
    int lowbit(int x) {
        return x & -x;
    }
};
```

### 使用範例

```cpp
int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11};
    FenwickTree ft(arr);

    // 查詢前綴和
    cout << ft.query(3) << endl;  // 1+3+5 = 9

    // 區間和查詢
    cout << ft.rangeQuery(2, 4) << endl;  // 3+5+7 = 15

    // 單點修改：arr[2] += 2（0-indexed arr[2] = 5）
    ft.update(3, 2);  // 1-indexed

    // 修改後查詢
    cout << ft.rangeQuery(2, 4) << endl;  // 3+7+7 = 17
}
```

---

## 三、進階操作

### 1. 單點賦值（而非增量）

```cpp
void set(int index, int value) {
    int currentValue = rangeQuery(index, index);  // 查詢當前值
    int delta = value - currentValue;
    update(index, delta);
}
```

### 2. 區間修改 + 單點查詢（差分技巧）

使用**差分陣列**的思想：

```cpp
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

### 3. 二分搜尋（查找第 K 小的元素）

**應用**：動態維護元素，查找第 K 小

```cpp
int findKth(int k) {
    int index = 0;
    int bitMask = 1;

    // 找到最高位
    while (bitMask <= n) bitMask <<= 1;
    bitMask >>= 1;

    // 從高位到低位嘗試
    while (bitMask > 0) {
        int mid = index + bitMask;

        if (mid <= n && tree[mid] < k) {
            k -= tree[mid];
            index = mid;
        }

        bitMask >>= 1;
    }

    return index + 1;
}
```

---

## 四、複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 建構 | O(n log n) | O(n) |
| 單點修改 | O(log n) | - |
| 前綴和查詢 | O(log n) | - |
| 區間和查詢 | O(log n) | - |

**為什麼是 O(log n)？**
- `lowbit(i)` 每次操作會移動到更高/更低的層級
- 樹的高度 = O(log n)

---

## 五、LeetCode 題目詳解

### 1. LeetCode 307: Range Sum Query - Mutable

**題目**：支援單點修改和區間和查詢

**解法**：直接套用模板

```cpp
class NumArray {
private:
    FenwickTree ft;
    vector<int> nums;

public:
    NumArray(vector<int>& nums) : ft(nums.size()), nums(nums) {
        for (int i = 0; i < nums.size(); i++) {
            ft.update(i + 1, nums[i]);  // 1-indexed
        }
    }

    void update(int index, int val) {
        int delta = val - nums[index];
        nums[index] = val;
        ft.update(index + 1, delta);
    }

    int sumRange(int left, int right) {
        return ft.rangeQuery(left + 1, right + 1);
    }
};
```

**複雜度**：
- `update`: O(log n)
- `sumRange`: O(log n)

---

### 2. LeetCode 315: Count of Smaller Numbers After Self

**題目**：對於陣列中每個元素 `nums[i]`，計算有多少個 `nums[j]` 滿足 `j > i` 且 `nums[j] < nums[i]`

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

**解法**：離散化 + Fenwick Tree + 從右往左掃描

```cpp
class Solution {
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n);

        // 1. 離散化（將數值映射到 [1, n]）
        vector<int> sorted = nums;
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());

        unordered_map<int, int> rank;
        for (int i = 0; i < sorted.size(); i++) {
            rank[sorted[i]] = i + 1;  // 1-indexed
        }

        // 2. 從右往左掃描，用 Fenwick Tree 維護已出現數字的頻率
        FenwickTree ft(sorted.size());

        for (int i = n - 1; i >= 0; i--) {
            int r = rank[nums[i]];

            // 查詢比 nums[i] 小的數字出現次數（前綴和）
            result[i] = ft.query(r - 1);

            // 將 nums[i] 加入 Fenwick Tree
            ft.update(r, 1);
        }

        return result;
    }
};
```

**複雜度**：O(n log n)

**關鍵思路**：
1. 離散化處理大範圍數值
2. 從右往左掃描，動態維護已處理元素的頻率
3. 使用 Fenwick Tree 查詢前綴和（比當前元素小的數量）

---

### 3. LeetCode 493: Reverse Pairs

**題目**：計算有多少對 `(i, j)` 滿足 `i < j` 且 `nums[i] > 2 * nums[j]`

**範例**：
```
nums = [1, 3, 2, 3, 1]
輸出: 2
解釋：(3, 1) 和 (3, 1)
```

**解法 1：歸併排序（推薦）**

這題用歸併排序更簡潔，但我們展示 Fenwick Tree 解法。

**解法 2：離散化 + Fenwick Tree**

```cpp
class Solution {
public:
    int reversePairs(vector<int>& nums) {
        int n = nums.size();

        // 1. 離散化（需要包含 nums[i] 和 2*nums[i]）
        set<long long> allNums;
        for (int num : nums) {
            allNums.insert(num);
            allNums.insert((long long)num * 2);
        }

        unordered_map<long long, int> rank;
        int id = 1;
        for (long long num : allNums) {
            rank[num] = id++;
        }

        // 2. 從右往左掃描
        FenwickTree ft(allNums.size());
        int count = 0;

        for (int i = n - 1; i >= 0; i--) {
            // 查詢有多少數字 < nums[i]（即 rank < rank[nums[i]]）
            count += ft.query(rank[nums[i]] - 1);

            // 將 2*nums[i] 加入 Fenwick Tree
            ft.update(rank[(long long)nums[i] * 2], 1);
        }

        return count;
    }
};
```

**複雜度**：O(n log n)

---

## 六、Fenwick Tree vs Segment Tree

| 特性 | Fenwick Tree | Segment Tree |
|------|-------------|--------------|
| 實現難度 | 簡單（20 行代碼） | 複雜（50+ 行代碼） |
| 空間複雜度 | O(n) | O(4n) |
| 單點修改 | O(log n) | O(log n) |
| 區間查詢 | O(log n) | O(log n) |
| 區間修改 | ❌ 需要差分技巧 | ✅ Lazy Propagation |
| 支援操作 | 加法、乘法（有限） | 任意可結合操作（加、乘、最值、GCD 等） |
| 適用場景 | 單點修改 + 區間和查詢 | 複雜區間操作 |

**結論**：
- 簡單問題（單點修改 + 區間和）→ Fenwick Tree
- 複雜問題（區間修改、區間最值）→ Segment Tree

---

## 七、常見陷阱與技巧

### 陷阱 1：索引從 0 開始

```cpp
// 錯誤：Fenwick Tree 索引從 1 開始
FenwickTree ft(n);
ft.update(0, val);  // 錯誤！索引 0 無效

// 正確：轉換為 1-indexed
ft.update(i + 1, val);
```

### 陷阱 2：忘記離散化

當數值範圍很大（如 10^9）但數量很少（如 10^5）時，必須**離散化**：

```cpp
// 錯誤：直接用原始值
FenwickTree ft(1e9);  // 空間爆炸！

// 正確：離散化
vector<int> sorted = nums;
sort(sorted.begin(), sorted.end());
sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());

unordered_map<int, int> rank;
for (int i = 0; i < sorted.size(); i++) {
    rank[sorted[i]] = i + 1;
}

FenwickTree ft(sorted.size());
```

### 陷阱 3：整數溢位

```cpp
// 錯誤：累加可能溢位
int sum = 0;  // 可能不夠

// 正確：使用 long long
long long sum = 0;
```

### 技巧 1：差分陣列實現區間修改

```cpp
// 區間 [l, r] 全部加 delta
diff.update(l, delta);
diff.update(r + 1, -delta);

// 查詢某位置的值
int value = diff.query(i);
```

### 技巧 2：二維 Fenwick Tree

```cpp
class FenwickTree2D {
private:
    vector<vector<int>> tree;
    int m, n;

public:
    FenwickTree2D(int rows, int cols) : m(rows), n(cols) {
        tree.resize(m + 1, vector<int>(n + 1, 0));
    }

    void update(int r, int c, int delta) {
        for (int i = r; i <= m; i += lowbit(i)) {
            for (int j = c; j <= n; j += lowbit(j)) {
                tree[i][j] += delta;
            }
        }
    }

    int query(int r, int c) {
        int sum = 0;
        for (int i = r; i > 0; i -= lowbit(i)) {
            for (int j = c; j > 0; j -= lowbit(j)) {
                sum += tree[i][j];
            }
        }
        return sum;
    }

private:
    int lowbit(int x) { return x & -x; }
};
```

---

## 八、視覺化範例

### 完整操作過程

```
初始陣列 arr = [1, 3, 5, 7, 9, 11]（0-indexed）

建構 Fenwick Tree（1-indexed）：
    tree[1] = 1       (管理 [1,1])
    tree[2] = 1+3=4   (管理 [1,2])
    tree[3] = 5       (管理 [3,3])
    tree[4] = 1+3+5+7=16 (管理 [1,4])
    tree[5] = 9       (管理 [5,5])
    tree[6] = 9+11=20 (管理 [5,6])

查詢 sum(1, 5)：
    i=5: tree[5]=9
    i=5-lowbit(5)=4: tree[4]=16
    i=4-lowbit(4)=0: 停止
    結果：9+16=25 ✓ (1+3+5+7+9=25)

修改 arr[2]（1-indexed 的 3）增加 2：
    i=3: tree[3]+=2 → tree[3]=7
    i=3+lowbit(3)=4: tree[4]+=2 → tree[4]=18
    i=4+lowbit(4)=8: 超出範圍

修改後查詢 sum(1, 5)：
    i=5: tree[5]=9
    i=4: tree[4]=18
    結果：9+18=27 ✓ (1+3+7+7+9=27)
```

---

## 九、總結

### 核心公式

```cpp
// lowbit 操作
int lowbit(int x) {
    return x & -x;
}

// 單點修改
void update(int index, int delta) {
    while (index <= n) {
        tree[index] += delta;
        index += lowbit(index);
    }
}

// 前綴和查詢
int query(int index) {
    int sum = 0;
    while (index > 0) {
        sum += tree[index];
        index -= lowbit(index);
    }
    return sum;
}
```

### 適用場景

| 問題類型 | 是否適用 |
|---------|---------|
| 動態前綴和 | ✅ 完美 |
| 單點修改 + 區間查詢 | ✅ 完美 |
| 逆序對計數 | ✅ 完美 |
| 區間修改 + 區間查詢 | ⚠️ 需要差分或用 Segment Tree |
| 區間最值 | ❌ 用 Segment Tree |

### 記憶技巧

**lowbit 的意義**：
- `x & -x` 提取最低位的 1
- 決定了每個節點管理的區間長度

**操作方向**：
- `update`：向上（`i += lowbit(i)`）
- `query`：向下（`i -= lowbit(i)`）

掌握 Fenwick Tree，你就能高效解決所有動態前綴和問題！

