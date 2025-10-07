---
title: "3. Suffix Tree, Suffix Array (*)"
order: 3
description: "後綴樹與後綴陣列的基礎與應用"
tags: ["suffix-tree", "suffix-array", "advanced"]
---

# 3. Suffix Tree, Suffix Array

後綴樹（Suffix Tree）和後綴陣列（Suffix Array）是處理字串問題的強大工具，適用於子串搜尋、最長公共子串等問題。本章重點介紹概念和實用的後綴陣列。

> **標註 (*)：** 本章為進階主題，重點在於理解概念和應用，完整實現較為複雜。

## 後綴（Suffix）的定義

字串 s 的後綴是指從某個位置 i 到結尾的子串。

```
字串: "banana"

所有後綴:
0: banana
1: anana
2: nana
3: ana
4: na
5: a

共 6 個後綴（長度為 n）
```

## 後綴陣列（Suffix Array）

### 定義

**後綴陣列（SA）** 是所有後綴按字典序排序後的索引陣列。

```
字串: "banana"

後綴排序:
5: a         -> SA[0] = 5
3: ana       -> SA[1] = 3
1: anana     -> SA[2] = 1
0: banana    -> SA[3] = 0
4: na        -> SA[4] = 4
2: nana      -> SA[5] = 2

SA = [5, 3, 1, 0, 4, 2]
```

### 樸素構建方法

直接對所有後綴排序：

```cpp
vector<int> buildSuffixArray(string s) {
    int n = s.length();
    vector<int> sa(n);

    // 初始化索引
    for (int i = 0; i < n; i++)
        sa[i] = i;

    // 按後綴字典序排序
    sort(sa.begin(), sa.end(), [&](int i, int j) {
        return s.substr(i) < s.substr(j);
    });

    return sa;
}

// 時間複雜度：O(n² log n)
// - 排序：O(n log n)
// - 每次比較：O(n)
// 空間複雜度：O(n)
```

**問題：** 對於長字串效率太低！

### 倍增法（Doubling Algorithm）

更高效的構建方法，時間複雜度 O(n log² n)。

#### 核心思想

1. 首先按第 1 個字元排序
2. 然後按前 2 個字元排序
3. 然後按前 4 個字元排序
4. ...以此類推，每次加倍

#### 實現（簡化版）

```cpp
class SuffixArray {
private:
    string s;
    int n;
    vector<int> sa, rank, tmp;

public:
    SuffixArray(string str) : s(str), n(str.length()) {
        sa.resize(n);
        rank.resize(n);
        tmp.resize(n);

        build();
    }

    void build() {
        // 初始化：按第一個字元排序
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            rank[i] = s[i];
        }

        // 倍增
        for (int k = 1; k < n; k *= 2) {
            // 按 (rank[i], rank[i+k]) 排序
            auto cmp = [&](int i, int j) {
                if (rank[i] != rank[j])
                    return rank[i] < rank[j];
                int ri = (i + k < n) ? rank[i + k] : -1;
                int rj = (j + k < n) ? rank[j + k] : -1;
                return ri < rj;
            };

            sort(sa.begin(), sa.end(), cmp);

            // 更新 rank
            tmp[sa[0]] = 0;
            for (int i = 1; i < n; i++) {
                tmp[sa[i]] = tmp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) ? 1 : 0);
            }
            rank = tmp;
        }
    }

    vector<int> getSuffixArray() {
        return sa;
    }
};

// 時間複雜度：O(n log² n)
// 空間複雜度：O(n)
```

#### 視覺化過程

```
字串: "banana"

k=1 (按前 1 個字元):
  rank: [1, 0, 2, 0, 2, 0]
  sa:   [1, 3, 5, 0, 2, 4]
  後綴: anana, ana, a, banana, nana, na

k=2 (按前 2 個字元):
  rank: [3, 1, 4, 0, 5, 2]
  sa:   [5, 3, 1, 0, 4, 2]
  後綴: a, ana, anana, banana, na, nana

k=4 (已完成):
  最終 SA = [5, 3, 1, 0, 4, 2]
```

### 更高效的算法

- **SA-IS 算法：** O(n) 時間，但實現複雜
- **DC3 算法：** O(n) 時間，分治思想
- **實務應用：** 通常使用現成的庫（如 libdivsufsort）

## 最長公共前綴陣列（LCP Array）

### 定義

**LCP[i]** = SA[i] 和 SA[i-1] 對應後綴的最長公共前綴長度。

```
字串: "banana"
SA = [5, 3, 1, 0, 4, 2]

後綴:
SA[0] = 5: a
SA[1] = 3: ana       -> LCP[1] = 1 (a)
SA[2] = 1: anana     -> LCP[2] = 3 (ana)
SA[3] = 0: banana    -> LCP[3] = 0
SA[4] = 4: na        -> LCP[4] = 0
SA[5] = 2: nana      -> LCP[5] = 2 (na)

LCP = [0, 1, 3, 0, 0, 2]
```

### Kasai 算法（O(n) 構建 LCP）

```cpp
vector<int> buildLCP(string s, vector<int>& sa) {
    int n = s.length();
    vector<int> lcp(n, 0);
    vector<int> rank(n);

    // 構建 rank (SA 的逆)
    for (int i = 0; i < n; i++)
        rank[sa[i]] = i;

    int h = 0;  // 當前 LCP 長度

    for (int i = 0; i < n; i++) {
        if (rank[i] > 0) {
            int j = sa[rank[i] - 1];  // 前一個後綴

            // 從上一次的 h-1 開始比較
            while (i + h < n && j + h < n && s[i + h] == s[j + h])
                h++;

            lcp[rank[i]] = h;

            if (h > 0) h--;  // 下一個後綴的 LCP 至少為 h-1
        }
    }

    return lcp;
}

// 時間複雜度：O(n)
// 空間複雜度：O(n)
```

#### 為什麼是 O(n)？

關鍵觀察：h 最多增加 n 次（每次 while 循環），最多減少 n 次（每次 h--）。

```
總操作數 = h 的增加次數 + h 的減少次數
         <= n + n = 2n
         = O(n)
```

## 後綴樹（Suffix Tree）

### 概念

後綴樹是一種壓縮的 Trie，包含所有後綴。

```
字串: "banana$" ($ 為終止符)

後綴樹（簡化）:
         root
        / | \
       a  b  n
      / \  \  \
     $  na$ anana$ a
             \     \
             na$   na$
               \     \
               $     $
```

### 特性

- **節點數：** O(n)
- **構建時間：** O(n)（Ukkonen 算法）
- **空間：** O(n)，但常數較大

### Ukkonen 算法（概念）

線上構建後綴樹的經典算法：

1. **漸進式構建：** 從左到右掃描字串
2. **後綴鏈接：** 加速插入
3. **活動點：** 追蹤當前位置

**完整實現非常複雜**，實務中通常使用現成庫。

### 後綴樹 vs 後綴陣列

| 特性 | 後綴樹 | 後綴陣列 |
|------|--------|---------|
| 構建時間 | O(n) | O(n log² n) 或 O(n) |
| 空間 | O(n)，常數大 | O(n)，常數小 |
| 實現難度 | 困難 | 中等 |
| 查詢子串 | O(m) | O(m log n) |
| 最長公共子串 | O(n) | O(n) |

**建議：** 競賽中優先使用後綴陣列（實現簡單，空間小）。

## 應用場景

### 1. 最長公共子串（LCS）

對於兩個字串 s1 和 s2，求最長公共子串。

```cpp
// 使用後綴陣列 + LCP
string longestCommonSubstring(string s1, string s2) {
    // 組合字串：s1 + '#' + s2
    string s = s1 + "#" + s2;
    int n1 = s1.length(), n = s.length();

    SuffixArray sa(s);
    vector<int> suffix = sa.getSuffixArray();
    vector<int> lcp = buildLCP(s, suffix);

    int maxLen = 0, pos = 0;

    for (int i = 1; i < n; i++) {
        int idx1 = suffix[i - 1];
        int idx2 = suffix[i];

        // 確保一個來自 s1，一個來自 s2
        bool from_s1 = (idx1 < n1) != (idx2 < n1);

        if (from_s1 && lcp[i] > maxLen) {
            maxLen = lcp[i];
            pos = suffix[i];
        }
    }

    return s.substr(pos, maxLen);
}

// 時間複雜度：O((n1 + n2) log² (n1 + n2))
// 空間複雜度：O(n1 + n2)
```

**視覺化：**
```
s1 = "abcde"
s2 = "xbcdz"
s = "abcde#xbcdz"

後綴陣列中相鄰的後綴:
  "bcde#xbcdz"  (來自 s1)
  "bcdz"        (來自 s2)
  LCP = 3 ("bcd")

結果: "bcd"
```

### 2. 最長重複子串

找到在字串中出現至少兩次的最長子串。

```cpp
string longestRepeatedSubstring(string s) {
    SuffixArray sa(s);
    vector<int> suffix = sa.getSuffixArray();
    vector<int> lcp = buildLCP(s, suffix);

    int maxLen = 0, pos = 0;

    for (int i = 1; i < s.length(); i++) {
        if (lcp[i] > maxLen) {
            maxLen = lcp[i];
            pos = suffix[i];
        }
    }

    return s.substr(pos, maxLen);
}

// 時間複雜度：O(n log² n)
// 空間複雜度：O(n)
```

**原理：** LCP[i] 表示 SA[i] 和 SA[i-1] 的公共前綴，即重複子串。

### 3. 字串匹配

在文本中查找模式串的所有出現位置。

```cpp
vector<int> patternMatching(string text, string pattern) {
    string s = text;
    int n = text.length(), m = pattern.length();

    SuffixArray sa(s);
    vector<int> suffix = sa.getSuffixArray();

    vector<int> result;

    // 二分搜尋：找到第一個 >= pattern 的後綴
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        string suf = s.substr(suffix[mid], min(m, n - suffix[mid]));

        if (suf < pattern) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 從 left 開始，檢查所有匹配的後綴
    for (int i = left; i < n; i++) {
        string suf = s.substr(suffix[i], min(m, n - suffix[i]));
        if (suf == pattern) {
            result.push_back(suffix[i]);
        } else {
            break;  // 已排序，不匹配就停止
        }
    }

    return result;
}

// 時間複雜度：O(n log² n + m log n + k)
//   - 構建 SA: O(n log² n)
//   - 二分搜尋: O(m log n)
//   - 收集結果: O(k)，k 為匹配數
```

## LeetCode 題目詳解

### [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)

**題目：** 找到最長重複子串。

**解法 1：後綴陣列（概念）**

```cpp
// 使用上述 longestRepeatedSubstring 函數
class Solution {
public:
    string longestDupSubstring(string s) {
        // 完整實現需要後綴陣列
        // 這裡提供概念性代碼

        int n = s.length();
        vector<int> sa(n), rank(n), tmp(n);

        // 構建後綴陣列（簡化）
        // ...

        // 構建 LCP 陣列
        // ...

        // 找最大 LCP
        int maxLen = 0, pos = 0;
        // for (int i = 1; i < n; i++) {
        //     if (lcp[i] > maxLen) {
        //         maxLen = lcp[i];
        //         pos = sa[i];
        //     }
        // }

        // return s.substr(pos, maxLen);

        // 實際提交時使用下面的二分+雜湊解法
        return "";
    }
};
```

**解法 2：二分 + Rabin-Karp（實用）**

```cpp
class Solution {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 26;

    bool hasDuplicate(string& s, int len, string& result) {
        if (len == 0) return false;

        unordered_set<long long> seen;
        long long hash = 0, pow = 1;

        // 計算第一個窗口的雜湊
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + (s[i] - 'a')) % MOD;
            if (i < len - 1)
                pow = (pow * BASE) % MOD;
        }
        seen.insert(hash);

        // 滑動窗口
        for (int i = len; i < s.length(); i++) {
            // 移除最左字元，加入新字元
            hash = (hash - (s[i - len] - 'a') * pow % MOD + MOD) % MOD;
            hash = (hash * BASE + (s[i] - 'a')) % MOD;

            if (seen.count(hash)) {
                result = s.substr(i - len + 1, len);
                return true;
            }
            seen.insert(hash);
        }

        return false;
    }

public:
    string longestDupSubstring(string s) {
        // 二分長度
        int left = 1, right = s.length() - 1;
        string result = "";

        while (left <= right) {
            int mid = (left + right) / 2;
            string temp;

            if (hasDuplicate(s, mid, temp)) {
                result = temp;
                left = mid + 1;     // 嘗試更長
            } else {
                right = mid - 1;    // 縮短
            }
        }

        return result;
    }
};

// 時間複雜度：O(n log n)
// 空間複雜度：O(n)
```

### [718. Maximum Length of Repeated Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)

**題目：** 找到兩個陣列的最長公共子陣列。

**解法 1：動態規劃**

```cpp
class Solution {
public:
    int findLength(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(), n = nums2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        int maxLen = 0;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    maxLen = max(maxLen, dp[i][j]);
                }
            }
        }

        return maxLen;
    }
};

// 時間複雜度：O(mn)
// 空間複雜度：O(mn)
```

**解法 2：後綴陣列（概念）**

```cpp
// 將兩個陣列轉為字串，中間用特殊字元分隔
// 然後應用最長公共子串算法

class Solution {
public:
    int findLength(vector<int>& nums1, vector<int>& nums2) {
        // 轉為字串（使用字元映射）
        string s1, s2;
        for (int x : nums1) s1 += char(x + 1);  // 避免 '\0'
        for (int x : nums2) s2 += char(x + 1);

        // 組合
        string s = s1 + "\xff" + s2;  // 使用特殊字元分隔

        // 後綴陣列 + LCP（實現略）
        // ...

        return 0;  // 返回最大 LCP
    }
};
```

## 常見陷阱與技巧

### 1. 終止符的使用

```cpp
// 錯誤：沒有終止符，可能導致後綴重複
string s = "banana";

// 正確：添加終止符（確保所有後綴唯一）
string s = "banana$";
```

### 2. 組合多個字串時的分隔符

```cpp
// 錯誤：使用字串中可能出現的字元
string s = s1 + " " + s2;  // 如果 s1 或 s2 包含空格？

// 正確：使用特殊字元
string s = s1 + "#" + s2;  // 確保 # 不在原字串中
```

### 3. 後綴陣列的實現選擇

```cpp
// 競賽中：
// - 簡單題目：使用樸素 O(n² log n) 方法
// - 複雜題目：使用二分+雜湊替代後綴陣列
// - 或使用模板（提前準備好倍增法）
```

## 複雜度總結

| 操作 | 時間複雜度 | 備註 |
|------|-----------|------|
| 構建後綴陣列（樸素） | O(n² log n) | 簡單實現 |
| 構建後綴陣列（倍增） | O(n log² n) | 實用方法 |
| 構建後綴陣列（SA-IS） | O(n) | 實現複雜 |
| 構建 LCP（Kasai） | O(n) | 常用 |
| 最長重複子串 | O(n log² n) | SA + LCP |
| 最長公共子串 | O((n+m) log² (n+m)) | 組合字串 |
| 字串匹配 | O(n log² n + m log n) | SA + 二分 |

## 實務建議

### 競賽中的使用

1. **簡單問題：** 直接使用 DP 或其他簡單方法
2. **複雜問題：** 考慮二分+雜湊（更容易實現）
3. **必須用 SA：** 準備好模板（倍增法）

### 模板準備

```cpp
// 最小化的後綴陣列模板
class SuffixArray {
    // ... 倍增法實現 ...
};

// 最小化的 LCP 構建
vector<int> buildLCP(string s, vector<int>& sa) {
    // ... Kasai 算法 ...
}
```

## 練習建議

1. **理解概念：** 先理解後綴、排序、LCP 的含義
2. **手工模擬：** 在小字串上手工構建 SA 和 LCP
3. **實現樸素算法：** 先實現 O(n² log n) 版本
4. **學習倍增法：** 理解倍增的思想
5. **應用練習：** 使用 SA 解決實際問題

## 延伸閱讀

- 下一章：**編輯距離** - 近似字串匹配
- 相關主題：**字串匹配**、**動態規劃**
- 進階主題：**後綴樹的 Ukkonen 算法**
- 替代方案：**字串雜湊**（第 10 章）
