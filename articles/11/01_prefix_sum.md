---
title: 11-1. Prefix Sum & Difference Array
order: 1
description: 前綴和與差分陣列：用空間換時間的經典範例
tags:
  - Prefix Sum
  - Difference Array
  - Array
  - Preprocessing
author: Rain Hu
date: ''
draft: true
---

# Prefix Sum & Difference Array

## 核心概念

Prefix Sum（前綴和）和 Difference Array（差分陣列）是一對互補的技巧：
- **Prefix Sum**：優化**區間查詢**，將 O(n) 降至 O(1)
- **Difference Array**：優化**區間修改**，將 O(n) 降至 O(1)

兩者都是用 **O(n) 空間** 換取 **O(1) 時間** 的經典範例。

---

## 一、Prefix Sum（前綴和）

### 定義

對於陣列 `arr[0...n-1]`，定義前綴和陣列 `prefix[]`：

```
prefix[i] = arr[0] + arr[1] + ... + arr[i]
```

特別地，`prefix[-1] = 0`（邊界處理）。

### 圖解

```
原陣列 arr:     [2,  4,  1,  5,  3]
索引:            0   1   2   3   4

前綴和 prefix:  [2,  6,  7, 12, 15]
                 ↑   ↑   ↑   ↑   ↑
                 2  2+4 2+4+1 ... sum(0~4)

查詢 sum(1, 3):
    = arr[1] + arr[2] + arr[3]
    = 4 + 1 + 5
    = 10

使用前綴和：
    = prefix[3] - prefix[0]
    = 12 - 2
    = 10  ✓
```

### 區間和公式

```cpp
sum(l, r) = prefix[r] - prefix[l-1]
```

**邊界處理**：為了避免 `l=0` 時 `prefix[-1]` 越界，通常：
- 方法 1：額外處理 `if (l == 0)`
- 方法 2：使用 **1-indexed**，`prefix[0] = 0`（推薦）

### C++ 模板實現

```cpp
class PrefixSum {
private:
    vector<int> prefix;

public:
    // 建構函數：預處理前綴和
    PrefixSum(vector<int>& arr) {
        int n = arr.size();
        prefix.resize(n + 1, 0);  // prefix[0] = 0

        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
    }

    // 查詢區間和 [l, r]
    int sumRange(int l, int r) {
        return prefix[r + 1] - prefix[l];
    }
};

// 使用範例
int main() {
    vector<int> arr = {2, 4, 1, 5, 3};
    PrefixSum ps(arr);

    cout << ps.sumRange(1, 3) << endl;  // 4+1+5 = 10
    cout << ps.sumRange(0, 4) << endl;  // 2+4+1+5+3 = 15
}
```

### 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 預處理 | O(n) | O(n) |
| 區間查詢 | O(1) | - |

### 進階：前綴和的變形

#### 1. 前綴積（Prefix Product）

```cpp
prefix[i] = arr[0] * arr[1] * ... * arr[i]
product(l, r) = prefix[r] / prefix[l-1]  // 注意除零
```

#### 2. 前綴 XOR

```cpp
prefix[i] = arr[0] ^ arr[1] ^ ... ^ arr[i]
xor(l, r) = prefix[r] ^ prefix[l-1]  // XOR 性質：a^a = 0
```

#### 3. 前綴最大值/最小值

```cpp
prefixMax[i] = max(arr[0], arr[1], ..., arr[i])
// 但這無法支援區間最大值查詢，需要 Segment Tree
```

---

## 二、Difference Array（差分陣列）

### 定義

對於陣列 `arr[0...n-1]`，定義差分陣列 `diff[]`：

```
diff[i] = arr[i] - arr[i-1]  (i > 0)
diff[0] = arr[0]
```

### 核心性質

**還原原陣列**：
```
arr[i] = diff[0] + diff[1] + ... + diff[i]
```

也就是說，`arr` 是 `diff` 的前綴和！

### 圖解

```
原陣列 arr:    [3,  5,  2,  6,  4]
索引:           0   1   2   3   4

差分 diff:     [3,  2, -3,  4, -2]
                ↑   ↑   ↑   ↑   ↑
               a[0] 5-3 2-5 6-2 4-6

還原過程（前綴和）：
    arr[0] = diff[0] = 3
    arr[1] = diff[0] + diff[1] = 3 + 2 = 5
    arr[2] = 3 + 2 - 3 = 2
    arr[3] = 3 + 2 - 3 + 4 = 6
    arr[4] = 3 + 2 - 3 + 4 - 2 = 4  ✓
```

### 區間修改操作

**問題**：將 `arr[l...r]` 全部加上 `val`

**暴力**：O(n)
```cpp
for (int i = l; i <= r; i++) {
    arr[i] += val;
}
```

**差分陣列**：O(1)
```cpp
diff[l] += val;
diff[r + 1] -= val;  // 注意邊界
```

**原理**：
```
arr[i] 變化量 = diff[0] + diff[1] + ... + diff[i]

修改 diff[l] += val:
    → arr[l], arr[l+1], ..., arr[n-1] 全部 +val

修改 diff[r+1] -= val:
    → arr[r+1], arr[r+2], ..., arr[n-1] 全部 -val

兩者結合：只有 arr[l...r] 增加 val  ✓
```

### C++ 模板實現

```cpp
class DifferenceArray {
private:
    vector<int> diff;
    int n;

public:
    // 建構函數
    DifferenceArray(vector<int>& arr) {
        n = arr.size();
        diff.resize(n + 1, 0);  // 多分配一個防止越界

        diff[0] = arr[0];
        for (int i = 1; i < n; i++) {
            diff[i] = arr[i] - arr[i - 1];
        }
    }

    // 區間修改：將 [l, r] 全部加上 val
    void rangeAdd(int l, int r, int val) {
        diff[l] += val;
        diff[r + 1] -= val;
    }

    // 還原陣列（所有修改完成後調用）
    vector<int> getArray() {
        vector<int> arr(n);
        arr[0] = diff[0];

        for (int i = 1; i < n; i++) {
            arr[i] = arr[i - 1] + diff[i];
        }

        return arr;
    }
};

// 使用範例
int main() {
    vector<int> arr = {3, 5, 2, 6, 4};
    DifferenceArray da(arr);

    da.rangeAdd(1, 3, 2);  // [1, 3] 加 2
    da.rangeAdd(0, 2, -1); // [0, 2] 減 1

    vector<int> result = da.getArray();
    // 原陣列: [3, 5, 2, 6, 4]
    // +2到[1,3]: [3, 7, 4, 8, 4]
    // -1到[0,2]: [2, 6, 3, 8, 4]

    for (int x : result) cout << x << " ";  // 2 6 3 8 4
}
```

### 複雜度分析

| 操作 | 時間複雜度 |
|------|-----------|
| 建構 | O(n) |
| 區間修改 | O(1) |
| 還原陣列 | O(n) |

---

## 應用場景對比

| 問題類型 | 適合的方法 | 複雜度 |
|---------|-----------|--------|
| 多次區間查詢，無修改 | Prefix Sum | O(n) + O(1) per query |
| 多次區間修改，最後才查詢 | Difference Array | O(1) per update + O(n) restore |
| 多次區間查詢 + 修改 | Fenwick Tree / Segment Tree | O(log n) per operation |

---

## LeetCode 題目詳解

### 1. LeetCode 303: Range Sum Query - Immutable

**題目**：給定陣列 `nums`，多次查詢區間和 `sumRange(l, r)`。

**解法**：直接套用 Prefix Sum 模板

```cpp
class NumArray {
private:
    vector<int> prefix;

public:
    NumArray(vector<int>& nums) {
        int n = nums.size();
        prefix.resize(n + 1, 0);

        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};
```

**複雜度**：
- 建構：O(n)
- 查詢：O(1)

---

### 2. LeetCode 560: Subarray Sum Equals K

**題目**：找出和為 `k` 的連續子陣列個數。

**核心思想**：
```
sum(i, j) = k
⇒ prefix[j] - prefix[i-1] = k
⇒ prefix[i-1] = prefix[j] - k
```

使用 Hash Map 記錄每個前綴和出現的次數！

**解法**：

```cpp
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> prefixCount;
        prefixCount[0] = 1;  // 空前綴

        int prefixSum = 0;
        int count = 0;

        for (int num : nums) {
            prefixSum += num;

            // 尋找 prefix[i-1] = prefixSum - k
            if (prefixCount.count(prefixSum - k)) {
                count += prefixCount[prefixSum - k];
            }

            prefixCount[prefixSum]++;
        }

        return count;
    }
};
```

**範例**：
```
nums = [1, 2, 3], k = 3

i=0: prefixSum=1, map={0:1, 1:1}, count=0
i=1: prefixSum=3, map={0:1, 1:1, 3:1}, count=1 (找到 3-3=0)
i=2: prefixSum=6, map={0:1, 1:1, 3:1, 6:1}, count=2 (找到 6-3=3)

答案：2 (子陣列 [3] 和 [1,2])
```

**複雜度**：O(n) 時間，O(n) 空間

---

### 3. LeetCode 1109: Corporate Flight Bookings

**題目**：給定 `n` 個航班，`bookings[i] = [first, last, seats]` 表示從航班 `first` 到 `last`（包含）都要增加 `seats` 個座位。求最終每個航班的座位數。

**解法**：典型的**差分陣列**應用！

```cpp
class Solution {
public:
    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
        vector<int> diff(n + 2, 0);  // 1-indexed, 多一個防止越界

        // 區間修改：O(1) per operation
        for (auto& b : bookings) {
            int first = b[0], last = b[1], seats = b[2];
            diff[first] += seats;
            diff[last + 1] -= seats;
        }

        // 還原陣列：前綴和
        vector<int> answer(n);
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += diff[i];
            answer[i - 1] = sum;
        }

        return answer;
    }
};
```

**複雜度**：O(m + n)，m 為 bookings 數量

---

### 4. LeetCode 370: Range Addition (Premium)

**題目**：初始陣列全為 0，給定多個操作 `[start, end, inc]`，將 `[start, end]` 全部加上 `inc`。求最終陣列。

**解法**：差分陣列模板題

```cpp
class Solution {
public:
    vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {
        vector<int> diff(length + 1, 0);

        // 差分陣列：區間修改 O(1)
        for (auto& u : updates) {
            int start = u[0], end = u[1], inc = u[2];
            diff[start] += inc;
            diff[end + 1] -= inc;
        }

        // 還原陣列
        vector<int> result(length);
        int sum = 0;
        for (int i = 0; i < length; i++) {
            sum += diff[i];
            result[i] = sum;
        }

        return result;
    }
};
```

**複雜度**：O(n + m)

---

### 5. LeetCode 1314: Matrix Block Sum (進階應用)

**題目**：給定矩陣 `mat` 和 `k`，對於每個 `(i, j)`，計算以其為中心、邊長為 `2k+1` 的正方形區域和。

**思路**：這題需要用到 **2D Prefix Sum**，我們會在下一章詳細講解，這裡先提一下思路。

**核心**：
```
answer[i][j] = sum of mat[r][c]
               where max(0, i-k) ≤ r ≤ min(m-1, i+k)
                     max(0, j-k) ≤ c ≤ min(n-1, j+k)
```

使用二維前綴和可以在 O(1) 時間內查詢任意子矩陣的和。

---

## 常見陷阱與技巧

### 陷阱 1：邊界越界

```cpp
// 錯誤：忘記處理邊界
int sum(int l, int r) {
    return prefix[r] - prefix[l - 1];  // l=0 時 prefix[-1] 越界！
}

// 正確：使用 1-indexed 或特判
int sum(int l, int r) {
    return prefix[r + 1] - prefix[l];  // prefix[0] = 0
}
```

### 陷阱 2：差分陣列忘記還原

```cpp
// 錯誤：直接用 diff 當結果
return diff;  // 這是差分陣列，不是最終陣列！

// 正確：必須還原（前綴和）
vector<int> result(n);
result[0] = diff[0];
for (int i = 1; i < n; i++) {
    result[i] = result[i - 1] + diff[i];
}
return result;
```

### 陷阱 3：整數溢位

```cpp
// 錯誤：前綴和可能溢位
vector<int> prefix(n);  // int 可能不夠

// 正確：使用 long long
vector<long long> prefix(n);
```

### 技巧 1：前綴和 + Hash Map

很多題目需要結合前綴和與 Hash Map：
- LeetCode 560: Subarray Sum Equals K
- LeetCode 974: Subarray Sums Divisible by K
- LeetCode 523: Continuous Subarray Sum

模板：
```cpp
unordered_map<int, int> prefixCount;
prefixCount[0] = 1;  // 空前綴

int prefixSum = 0;
for (int num : nums) {
    prefixSum += num;
    // 查詢是否存在 prefix[i] = prefixSum - target
    if (prefixCount.count(prefixSum - target)) {
        // 找到了！
    }
    prefixCount[prefixSum]++;
}
```

### 技巧 2：差分陣列處理多次區間修改

當題目有 **大量區間修改 + 最後一次查詢** 時，優先考慮差分陣列：

```cpp
// 模板
vector<int> diff(n + 1, 0);

// 多次區間修改
for (auto& op : operations) {
    int l = op[0], r = op[1], val = op[2];
    diff[l] += val;
    diff[r + 1] -= val;
}

// 還原一次即可
vector<int> result(n);
result[0] = diff[0];
for (int i = 1; i < n; i++) {
    result[i] = result[i - 1] + diff[i];
}
```

---

## 進階：前綴和的高階應用

### 1. 子陣列和的性質

```cpp
// 判斷是否存在和為 k 的子陣列
bool hasSubarraySum(vector<int>& nums, int k) {
    unordered_set<int> prefixSet;
    prefixSet.insert(0);

    int prefixSum = 0;
    for (int num : nums) {
        prefixSum += num;
        if (prefixSet.count(prefixSum - k)) {
            return true;
        }
        prefixSet.insert(prefixSum);
    }

    return false;
}
```

### 2. 前綴和 + 排序（計數問題）

```cpp
// LeetCode 493: Reverse Pairs
// 計算有多少對 (i, j) 使得 i < j 且 nums[i] > 2 * nums[j]
```

這需要結合**歸併排序**或**樹狀陣列**，我們會在後續章節介紹。

---

## 總結

| 技巧 | 適用場景 | 核心操作 | 複雜度 |
|------|---------|---------|--------|
| **Prefix Sum** | 靜態陣列，頻繁區間查詢 | 預處理 + O(1) 查詢 | 預處理 O(n)，查詢 O(1) |
| **Difference Array** | 多次區間修改 + 一次還原 | O(1) 修改 + O(n) 還原 | 每次修改 O(1) |

**核心思想**：
- Prefix Sum：用空間換時間，犧牲 O(n) 空間獲得 O(1) 查詢
- Difference Array：延遲更新，批量處理修改操作

**何時使用**：
- 題目有"區間和"、"子陣列和"關鍵字 → Prefix Sum
- 題目有"區間修改"、"批量更新"關鍵字 → Difference Array
- 兩者都需要 → Fenwick Tree / Segment Tree（下一章）

掌握這兩個技巧，你已經可以解決大量的陣列區間問題了！
