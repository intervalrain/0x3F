---
title: 09-2. Advanced Bitwise Operations
order: 2
description: 進階位元運算技巧：位元遮罩、漢明距離、子集枚舉
tags:
  - bit manipulation
  - bitmask
  - subset enumeration
  - 進階
author: Rain Hu
date: '2025-10-26'
draft: false
---

# 2. Advanced Bitwise Operations (進階位元運算)

在掌握基本位元運算後，我們來學習更進階的技巧，包括位元遮罩、漢明距離和子集枚舉。

## Bit Masking (位元遮罩)

位元遮罩是使用特定的位元模式來操作或檢查特定位元的技術。

### 基本操作

#### 1. 設定特定位元 (Set Bit)

將第 `i` 位元設定為 1：

```cpp
int setBit(int x, int i) {
    return x | (1 << i);
}

// 範例
int x = 0b1010;  // 10
int y = setBit(x, 2);  // 0b1110 = 14

// 詳細過程：
  1010  (x)
| 0100  (1 << 2)
──────
  1110  (結果)
```

**簡寫形式：**

```cpp
x |= (1 << i);  // 設定第 i 位元
```

#### 2. 清除特定位元 (Clear Bit)

將第 `i` 位元設定為 0：

```cpp
int clearBit(int x, int i) {
    return x & ~(1 << i);
}

// 範例
int x = 0b1110;  // 14
int y = clearBit(x, 2);  // 0b1010 = 10

// 詳細過程：
  1110  (x)
& 1011  (~(1 << 2))
──────
  1010  (結果)
```

**簡寫形式：**

```cpp
x &= ~(1 << i);  // 清除第 i 位元
```

#### 3. 切換特定位元 (Toggle Bit)

翻轉第 `i` 位元（0 變 1，1 變 0）：

```cpp
int toggleBit(int x, int i) {
    return x ^ (1 << i);
}

// 範例
int x = 0b1010;  // 10
int y = toggleBit(x, 2);  // 0b1110 = 14
int z = toggleBit(y, 2);  // 0b1010 = 10（切回來）

// 詳細過程：
  1010  (x)
^ 0100  (1 << 2)
──────
  1110  (結果)
```

**簡寫形式：**

```cpp
x ^= (1 << i);  // 切換第 i 位元
```

#### 4. 檢查特定位元 (Check Bit)

檢查第 `i` 位元是否為 1：

```cpp
bool checkBit(int x, int i) {
    return (x >> i) & 1;
    // 或
    // return (x & (1 << i)) != 0;
}

// 範例
int x = 0b1010;  // 10
bool b0 = checkBit(x, 0);  // false (位元 0 是 0)
bool b1 = checkBit(x, 1);  // true  (位元 1 是 1)
bool b2 = checkBit(x, 2);  // false (位元 2 是 0)
bool b3 = checkBit(x, 3);  // true  (位元 3 是 1)
```

### 綜合範例

```cpp
class BitMask {
private:
    int mask;

public:
    BitMask() : mask(0) {}

    // 設定第 i 位元
    void set(int i) {
        mask |= (1 << i);
    }

    // 清除第 i 位元
    void clear(int i) {
        mask &= ~(1 << i);
    }

    // 切換第 i 位元
    void toggle(int i) {
        mask ^= (1 << i);
    }

    // 檢查第 i 位元
    bool test(int i) const {
        return (mask >> i) & 1;
    }

    // 取得遮罩值
    int getValue() const {
        return mask;
    }

    // 設定多個位元
    void setRange(int from, int to) {
        for (int i = from; i <= to; i++) {
            set(i);
        }
    }

    // 計算 1 的個數
    int count() const {
        return __builtin_popcount(mask);
    }
};

// 使用範例
BitMask bm;
bm.set(0);     // 0001
bm.set(2);     // 0101
bm.toggle(1);  // 0111
bm.clear(0);   // 0110
cout << bm.getValue() << endl;  // 6
cout << bm.count() << endl;     // 2
```

## Hamming Distance (漢明距離)

漢明距離是指兩個等長字串對應位置上不同字符的個數。

### 定義

對於兩個整數，漢明距離是其二進制表示中不同位元的數量。

```
範例:
x = 1:   0 0 0 1
y = 4:   0 1 0 0
         ↑ ↑   ↑
漢明距離 = 2
```

### 計算方法

```cpp
int hammingDistance(int x, int y) {
    // 方法 1: XOR + popcount
    return __builtin_popcount(x ^ y);

    // 方法 2: 手動計算
    // int xor_result = x ^ y;
    // int count = 0;
    // while (xor_result) {
    //     count += xor_result & 1;
    //     xor_result >>= 1;
    // }
    // return count;
}

// 詳細過程：
// x = 1:   0001
// y = 4:   0100
// x ^ y:   0101  (有 2 個 1，所以距離為 2)
```

### 應用場景

1. **錯誤檢測與修正：** 檢測資料傳輸中的錯誤
2. **相似度計算：** 衡量兩個資料的相似程度
3. **基因序列比對：** 比較 DNA 序列的差異
4. **資訊理論：** 編碼理論中的重要概念

## Subset Enumeration (子集枚舉)

使用位元來表示集合的子集是一個強大的技巧，常用於動態規劃和組合問題。

### 位元表示子集

對於集合 `{0, 1, 2, ..., n-1}`，可以使用 n 位元的整數來表示其子集：

```
集合: {0, 1, 2, 3}

位元表示:
0000 (0)  → {}           空集合
0001 (1)  → {0}
0010 (2)  → {1}
0011 (3)  → {0, 1}
0100 (4)  → {2}
0101 (5)  → {0, 2}
0110 (6)  → {1, 2}
0111 (7)  → {0, 1, 2}
1000 (8)  → {3}
1001 (9)  → {0, 3}
1010 (10) → {1, 3}
1011 (11) → {0, 1, 3}
1100 (12) → {2, 3}
1101 (13) → {0, 2, 3}
1110 (14) → {1, 2, 3}
1111 (15) → {0, 1, 2, 3} 全集合
```

### 枚舉所有子集

```cpp
// 枚舉 {0, 1, ..., n-1} 的所有子集
void enumerateSubsets(int n) {
    int total = 1 << n;  // 2^n 個子集

    for (int mask = 0; mask < total; mask++) {
        cout << "Subset " << mask << ": {";

        bool first = true;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {  // 檢查第 i 個元素是否在子集中
                if (!first) cout << ", ";
                cout << i;
                first = false;
            }
        }

        cout << "}" << endl;
    }
}

// 範例: n = 3
// 輸出:
// Subset 0: {}
// Subset 1: {0}
// Subset 2: {1}
// Subset 3: {0, 1}
// Subset 4: {2}
// Subset 5: {0, 2}
// Subset 6: {1, 2}
// Subset 7: {0, 1, 2}
```

### 枚舉特定大小的子集

```cpp
// 枚舉大小為 k 的所有子集
void enumerateKSubsets(int n, int k) {
    int total = 1 << n;

    for (int mask = 0; mask < total; mask++) {
        if (__builtin_popcount(mask) == k) {
            // 處理大小為 k 的子集
            printSubset(mask, n);
        }
    }
}
```

### 枚舉子集的子集

這是一個非常重要的技巧：給定一個集合的子集 `mask`，枚舉它的所有子集。

```cpp
// 枚舉 mask 的所有子集
void enumerateSubmasks(int mask) {
    // 方法 1: 從 mask 開始遞減
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
        // 處理子集 sub
        cout << bitset<8>(sub) << endl;
    }
    // 別忘了空集合
    cout << bitset<8>(0) << endl;

    // 方法 2: 更簡潔的寫法（包含空集合）
    // for (int sub = mask; ; sub = (sub - 1) & mask) {
    //     // 處理子集 sub
    //     if (sub == 0) break;
    // }
}

// 範例: mask = 0b1011 (11)
// 輸出的子集:
// 1011 (11) → {0, 1, 3}
// 1010 (10) → {1, 3}
// 1001 (9)  → {0, 3}
// 1000 (8)  → {3}
// 0011 (3)  → {0, 1}
// 0010 (2)  → {1}
// 0001 (1)  → {0}
// 0000 (0)  → {}
```

**原理解析：**

```
假設 mask = 1011

Step 1: sub = 1011
Step 2: sub = (1011 - 1) & 1011 = 1010 & 1011 = 1010
Step 3: sub = (1010 - 1) & 1011 = 1001 & 1011 = 1001
Step 4: sub = (1001 - 1) & 1011 = 1000 & 1011 = 1000
Step 5: sub = (1000 - 1) & 1011 = 0111 & 1011 = 0011
...
```

### 複雜度分析

- **枚舉所有子集：** O(2^n)
- **枚舉 mask 的所有子集：** O(3^n) 對於所有 mask 的總時間
  - 每個元素有 3 種狀態：不在 mask 中、在 mask 中但不在 sub 中、在 sub 中

## LeetCode 題目

### 題目 1: 78. Subsets

**題目連結：** https://leetcode.com/problems/subsets/

**題目描述：**

給定一個不含重複元素的整數陣列 `nums`，返回該陣列所有可能的子集。

**範例：**

```
輸入: nums = [1, 2, 3]
輸出:
[
  [],
  [1],
  [2],
  [1, 2],
  [3],
  [1, 3],
  [2, 3],
  [1, 2, 3]
]
```

**解法：**

```cpp
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        int total = 1 << n;  // 2^n 個子集
        vector<vector<int>> result;

        // 枚舉所有可能的子集
        for (int mask = 0; mask < total; mask++) {
            vector<int> subset;

            // 檢查每個位元
            for (int i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    subset.push_back(nums[i]);
                }
            }

            result.push_back(subset);
        }

        return result;
    }
};
```

**解析：**

使用 n 位元的整數表示子集：
- 位元為 1：該元素在子集中
- 位元為 0：該元素不在子集中

```
nums = [1, 2, 3]

mask = 000 (0) → []
mask = 001 (1) → [1]
mask = 010 (2) → [2]
mask = 011 (3) → [1, 2]
mask = 100 (4) → [3]
mask = 101 (5) → [1, 3]
mask = 110 (6) → [2, 3]
mask = 111 (7) → [1, 2, 3]
```

**時間複雜度：** O(n × 2^n)
**空間複雜度：** O(n × 2^n)

### 題目 2: 90. Subsets II

**題目連結：** https://leetcode.com/problems/subsets-ii/

**題目描述：**

給定一個可能包含重複元素的整數陣列 `nums`，返回該陣列所有可能的子集（不能包含重複的子集）。

**範例：**

```
輸入: nums = [1, 2, 2]
輸出:
[
  [],
  [1],
  [1, 2],
  [1, 2, 2],
  [2],
  [2, 2]
]
```

**解法：**

```cpp
class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());  // 先排序
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }

private:
    void backtrack(vector<int>& nums, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        result.push_back(current);

        for (int i = start; i < nums.size(); i++) {
            // 跳過重複元素
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }

            current.push_back(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.pop_back();
        }
    }
};
```

**解析：**

這題需要去重，不適合直接使用位元枚舉（因為相同的數字會產生相同的子集）。使用回溯法配合去重：

```
nums = [1, 2, 2] (排序後)

遞迴樹:
                    []
         /          |         \
       [1]         [2]        [2]← 跳過（與前一個 2 重複）
      /   \         |
  [1,2]  [1,2]   [2,2]
    |      ↑
 [1,2,2]  跳過
```

**時間複雜度：** O(n × 2^n)
**空間複雜度：** O(n)（遞迴深度）

### 題目 3: 698. Partition to K Equal Sum Subsets

**題目連結：** https://leetcode.com/problems/partition-to-k-equal-sum-subsets/

**題目描述：**

給定一個整數陣列 `nums` 和一個整數 `k`，判斷是否可以將這個陣列分成 `k` 個非空子集，使得每個子集的元素和相等。

**範例：**

```
輸入: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
輸出: true
解釋: 可以分成 [5], [1, 4], [2, 3], [2, 3]
```

**解法：**

```cpp
class Solution {
public:
    bool canPartitionKSubsets(vector<int>& nums, int k) {
        int sum = accumulate(nums.begin(), nums.end(), 0);

        // 如果總和不能被 k 整除，直接返回 false
        if (sum % k != 0) return false;

        int target = sum / k;
        int n = nums.size();

        // 如果有任何數字大於目標，無法分組
        for (int num : nums) {
            if (num > target) return false;
        }

        // 排序（從大到小），加速剪枝
        sort(nums.begin(), nums.end(), greater<int>());

        vector<int> buckets(k, 0);
        return backtrack(nums, buckets, 0, target);
    }

private:
    bool backtrack(vector<int>& nums, vector<int>& buckets,
                   int index, int target) {
        // 所有數字都已分配
        if (index == nums.size()) {
            // 檢查所有桶是否都等於目標
            for (int bucket : buckets) {
                if (bucket != target) return false;
            }
            return true;
        }

        // 嘗試將當前數字放入每個桶
        for (int i = 0; i < buckets.size(); i++) {
            // 剪枝：如果當前桶加上這個數字會超過目標，跳過
            if (buckets[i] + nums[index] > target) {
                continue;
            }

            // 剪枝：如果當前桶和前一個桶相同，跳過（避免重複計算）
            if (i > 0 && buckets[i] == buckets[i - 1]) {
                continue;
            }

            // 放入當前桶
            buckets[i] += nums[index];

            // 遞迴處理下一個數字
            if (backtrack(nums, buckets, index + 1, target)) {
                return true;
            }

            // 回溯
            buckets[i] -= nums[index];
        }

        return false;
    }
};
```

**解析：**

這是一個 NP-hard 問題，使用回溯法配合剪枝：

```
nums = [4, 3, 2, 3, 5, 2, 1], k = 4
sum = 20, target = 5

排序後: [5, 4, 3, 3, 2, 2, 1]

嘗試分組:
bucket 0: 5 ✓
bucket 1: 4, 1 ✓
bucket 2: 3, 2 ✓
bucket 3: 3, 2 ✓
```

**時間複雜度：** O(k^n)（最壞情況）
**空間複雜度：** O(n)

### 題目 4: 1239. Maximum Length of a Concatenated String with Unique Characters

**題目連結：** https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/

**題目描述：**

給定一個字串陣列 `arr`，返回所有可能的串接字串中，包含唯一字符的最長字串的長度。

**範例：**

```
輸入: arr = ["un", "iq", "ue"]
輸出: 4
解釋: 所有可能的串接是 "", "un", "iq", "ue", "uniq", "ique"
     最長的包含唯一字符的是 "uniq"，長度為 4

輸入: arr = ["cha", "r", "act", "ers"]
輸出: 6
解釋: 可能的答案是 "chaers" 或 "acters"
```

**解法：**

```cpp
class Solution {
public:
    int maxLength(vector<string>& arr) {
        // 使用位元遮罩表示字符集
        vector<int> masks;
        vector<int> lengths;

        // 預處理：為每個字串建立位元遮罩
        for (const string& s : arr) {
            int mask = 0;
            bool valid = true;

            for (char c : s) {
                int bit = c - 'a';
                if (mask & (1 << bit)) {
                    // 字串內部有重複字符
                    valid = false;
                    break;
                }
                mask |= (1 << bit);
            }

            if (valid) {
                masks.push_back(mask);
                lengths.push_back(s.length());
            }
        }

        int maxLen = 0;
        int n = masks.size();
        int total = 1 << n;

        // 枚舉所有子集
        for (int subset = 0; subset < total; subset++) {
            int combined = 0;
            int length = 0;
            bool valid = true;

            for (int i = 0; i < n; i++) {
                if (subset & (1 << i)) {
                    // 檢查是否有字符衝突
                    if (combined & masks[i]) {
                        valid = false;
                        break;
                    }
                    combined |= masks[i];
                    length += lengths[i];
                }
            }

            if (valid) {
                maxLen = max(maxLen, length);
            }
        }

        return maxLen;
    }
};
```

**解析：**

使用位元遮罩表示字符集：
- 每個位元代表一個字母（'a' 到 'z'）
- 位元為 1：該字母出現過
- 位元為 0：該字母未出現

```
範例: arr = ["un", "iq", "ue"]

"un" → mask = 0b...00010100000100000000 (位元 'n' 和 'u')
"iq" → mask = 0b...00000001000000001000 (位元 'i' 和 'q')
"ue" → mask = 0b...00000000000000010010 (位元 'e' 和 'u')

檢查 "un" + "iq":
  0b...00010100000100000000  (un)
& 0b...00000001000000001000  (iq)
  ────────────────────────
  0b...00000000000000000000  (無衝突，可以組合)

檢查 "un" + "ue":
  0b...00010100000100000000  (un)
& 0b...00000000000000010010  (ue)
  ────────────────────────
  0b...00000000000000000000  (無衝突，但 "u" 在兩邊都有！)

實際上需要更仔細檢查...
正確的 "un" mask: 位元 13 (n) 和 20 (u) → 0b...100000010000000000000
正確的 "ue" mask: 位元 4 (e) 和 20 (u) → 0b...100000000000000010000
合併會發現位元 20 衝突
```

**時間複雜度：** O(n × 2^n)
**空間複雜度：** O(n)

## 進階技巧

### 1. 位元遮罩動態規劃

```cpp
// 經典問題：旅行商問題 (TSP)
// dp[mask][i] = 訪問 mask 中的城市，最後停在城市 i 的最短路徑

int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX));

    // 起點
    dp[1][0] = 0;

    // 枚舉所有狀態
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;
            if (dp[mask][i] == INT_MAX) continue;

            // 嘗試訪問下一個城市
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;

                int new_mask = mask | (1 << j);
                dp[new_mask][j] = min(dp[new_mask][j],
                                     dp[mask][i] + dist[i][j]);
            }
        }
    }

    // 找到回到起點的最短路徑
    int result = INT_MAX;
    for (int i = 0; i < n; i++) {
        result = min(result, dp[(1 << n) - 1][i] + dist[i][0]);
    }

    return result;
}
```

### 2. 集合運算

```cpp
// 並集
int union_set = mask1 | mask2;

// 交集
int intersect = mask1 & mask2;

// 差集（mask1 中有但 mask2 中沒有）
int difference = mask1 & ~mask2;

// 對稱差（XOR，兩個集合的並集減去交集）
int symmetric_diff = mask1 ^ mask2;

// 補集（假設全集是低 n 位元）
int complement = ((1 << n) - 1) ^ mask;

// 子集測試
bool is_subset = (mask1 & mask2) == mask1;

// 超集測試
bool is_superset = (mask1 & mask2) == mask2;
```

## 常見陷阱

### 1. 位移超出範圍

```cpp
// 錯誤：如果 i >= 32，結果未定義
int mask = 1 << i;

// 正確：先檢查範圍
if (i < 32) {
    int mask = 1 << i;
}
```

### 2. 有符號整數溢位

```cpp
// 錯誤：1 << 31 在有符號整數中會溢位
int mask = 1 << 31;

// 正確：使用無符號整數
unsigned int mask = 1U << 31;
// 或
long long mask = 1LL << 31;
```

### 3. 忘記處理空集合

```cpp
// 枚舉子集時別忘了空集合
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // ...
}
// 這個迴圈不包含空集合 (sub = 0)

// 正確的做法
for (int sub = mask; ; sub = (sub - 1) & mask) {
    // ...
    if (sub == 0) break;
}
```

## 小結

進階位元運算技巧包括：
1. **位元遮罩：** 靈活操作特定位元
2. **漢明距離：** 衡量兩個數字的差異
3. **子集枚舉：** 使用位元表示集合，高效枚舉子集

這些技巧在動態規劃、組合問題和圖論中都有廣泛應用。掌握子集枚舉尤其重要，因為它是狀態壓縮 DP 的基礎。
