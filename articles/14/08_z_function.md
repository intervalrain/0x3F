---
title: 14-8. Z-function (*)
order: 8
description: Z-function 與 Z-algorithm
tags:
  - z-function
  - z-algorithm
  - advanced
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 8. Z-function

Z-function 是一種強大的字串處理工具,與 KMP 類似但更簡潔。Z-algorithm 可以在 O(n) 時間內計算 Z-function,並用於高效的字串匹配。

> **標註 (*):** 本章為進階主題,重點介紹核心概念和應用。

## Z-function 定義

對於字串 s,**Z-function z[i]** 定義為:

```
z[i] = s[0...] 與 s[i...] 的最長公共前綴 (LCP) 長度
```

**注意:** z[0] 通常定義為 0 或 n (無意義,因為是自己與自己比較)

### 示例

```
s = "aaabaab"

i=0: z[0] = 0 (定義)
i=1: s[0...]="aaabaab", s[1...]="aabaab"
     LCP = "aa", z[1] = 2
i=2: s[0...]="aaabaab", s[2...]="abaab"
     LCP = "a", z[2] = 1
i=3: s[0...]="aaabaab", s[3...]="baab"
     LCP = "", z[3] = 0
i=4: s[0...]="aaabaab", s[4...]="aab"
     LCP = "aab", z[4] = 3
i=5: s[0...]="aaabaab", s[5...]="ab"
     LCP = "a", z[5] = 1
i=6: s[0...]="aaabaab", s[6...]="b"
     LCP = "", z[6] = 0

z = [0, 2, 1, 0, 3, 1, 0]
```

### 視覺化

```
s = "aaabaab"
    0123456

z[1]=2: aa|abaab (前2個匹配)
z[2]=1: a|abaab  (前1個匹配)
z[3]=0: |baab    (不匹配)
z[4]=3: aab|aab  (前3個匹配)
```

## Z-algorithm 構建

### 樸素算法 O(n²)

```cpp
vector<int> z_function_naive(string s) {
    int n = s.length();
    vector<int> z(n, 0);

    for (int i = 1; i < n; i++) {
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
    }

    return z;
}
```

### Z-algorithm O(n)

核心思想:維護最右匹配區間 [l, r],利用對稱性避免重複比較。

```cpp
vector<int> z_function(string s) {
    int n = s.length();
    vector<int> z(n, 0);
    int l = 0, r = 0;  // [l, r]: 最右匹配區間

    for (int i = 1; i < n; i++) {
        if (i <= r) {
            // i 在區間內,利用對稱性
            z[i] = min(r - i + 1, z[i - l]);
        }

        // 嘗試擴展
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }

        // 更新 [l, r]
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }

    return z;
}

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

### 算法解析

```
維護 [l, r]: s[l...r] = s[0...r-l]

當處理 i 時:
1. 若 i > r: 直接暴力計算
2. 若 i <= r:
   - k = i - l (i 在 s[l...r] 中的相對位置)
   - s[i...r] 對應 s[k...r-l]
   - 因此 z[i] 至少為 min(z[k], r-i+1)
   - 然後嘗試擴展
```

### 視覺化過程

```
s = "aaabaab"

i=1:
  暴力計算: z[1] = 2
  更新 [l,r] = [1,2]

i=2:
  i <= r (2 <= 2)
  k = 2-1 = 1, z[1] = 2
  z[2] = min(2-2+1, 2) = min(1, 2) = 1
  嘗試擴展: s[1]='a' != s[3]='b'
  z[2] = 1
  更新 [l,r] = [2,2]

i=3:
  i > r (3 > 2)
  暴力計算: z[3] = 0
  不更新 [l,r]

i=4:
  i > r
  暴力計算: z[4] = 3
  更新 [l,r] = [4,6]
```

## 應用

### 1. 字串匹配

類似 KMP,將模式串和文本串組合:

```cpp
vector<int> stringMatching(string text, string pattern) {
    string s = pattern + "#" + text;  // # 不在原字串中
    vector<int> z = z_function(s);
    int m = pattern.length();

    vector<int> result;
    for (int i = m + 1; i < s.length(); i++) {
        if (z[i] == m) {
            result.push_back(i - m - 1);  // 在 text 中的位置
        }
    }

    return result;
}

// 示例:
// text = "abcabc", pattern = "abc"
// s = "abc#abcabc"
// z[4] = 3, z[7] = 3
// 匹配位置: 0, 3
```

### 2. 週期性檢測

```cpp
bool hasRepeatingPattern(string s) {
    vector<int> z = z_function(s);
    int n = s.length();

    for (int i = 1; i < n; i++) {
        if (i + z[i] == n && n % i == 0) {
            return true;  // 週期為 i
        }
    }

    return false;
}

// 示例:
// s = "abcabcabc"
// z[3] = 6, 3+6=9=n, 9%3=0
// 週期為 3 ("abc")
```

### 3. 最長公共前綴

```cpp
int longestCommonPrefix(string s1, string s2) {
    string s = s1 + "#" + s2;
    vector<int> z = z_function(s);

    int maxLCP = 0;
    for (int i = s1.length() + 1; i < s.length(); i++) {
        maxLCP = max(maxLCP, min(z[i], (int)s1.length()));
    }

    return maxLCP;
}
```

## LeetCode 題目詳解

### [28. Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

使用 Z-function:

```cpp
class Solution {
private:
    vector<int> z_function(string s) {
        int n = s.length();
        vector<int> z(n, 0);
        int l = 0, r = 0;

        for (int i = 1; i < n; i++) {
            if (i <= r)
                z[i] = min(r - i + 1, z[i - l]);

            while (i + z[i] < n && s[z[i]] == s[i + z[i]])
                z[i]++;

            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }
        }

        return z;
    }

public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;

        string s = needle + "#" + haystack;
        vector<int> z = z_function(s);
        int m = needle.length();

        for (int i = m + 1; i < s.length(); i++) {
            if (z[i] == m) {
                return i - m - 1;
            }
        }

        return -1;
    }
};

// 時間複雜度: O(n + m)
// 空間複雜度: O(n + m)
```

### [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)

```cpp
class Solution {
private:
    vector<int> z_function(string s) {
        int n = s.length();
        vector<int> z(n, 0);
        int l = 0, r = 0;

        for (int i = 1; i < n; i++) {
            if (i <= r)
                z[i] = min(r - i + 1, z[i - l]);

            while (i + z[i] < n && s[z[i]] == s[i + z[i]])
                z[i]++;

            if (i + z[i] - 1 > r) {
                l = i;
                r = i + z[i] - 1;
            }
        }

        return z;
    }

public:
    bool repeatedSubstringPattern(string s) {
        vector<int> z = z_function(s);
        int n = s.length();

        for (int i = 1; i < n; i++) {
            if (i + z[i] == n && n % i == 0) {
                return true;
            }
        }

        return false;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

## Z-function vs KMP

| 特性 | Z-function | KMP |
|------|-----------|-----|
| 定義 | 最長公共前綴 | 最長相同前後綴 |
| 實現難度 | 較簡單 | 中等 |
| 直觀性 | 更直觀 | 需理解失配函數 |
| 應用範圍 | 字串匹配, LCP | 字串匹配, 週期性 |
| 時間複雜度 | O(n) | O(n) |

**選擇建議:**
- **理解優先:** Z-function 更直觀
- **經典題目:** KMP 更常見
- **實際性能:** 相當,略有差異

## 常見陷阱與技巧

### 1. z[0] 的定義

```cpp
// 通常定義為 0
z[0] = 0;

// 有些資料定義為 n
z[0] = n;

// 實際使用中,z[0] 不重要
```

### 2. 組合字串時的分隔符

```cpp
// 使用 # 確保不在原字串中
string s = pattern + "#" + text;

// 或使用其他特殊字元
```

### 3. [l, r] 區間的更新時機

```cpp
// 只在擴展後更新
if (i + z[i] - 1 > r) {
    l = i;
    r = i + z[i] - 1;
}
```

## 複雜度分析

### 時間複雜度證明

```
關鍵觀察: r 單調遞增

while 循環總次數:
- 每次 while 執行, z[i] 增加, r 也增加
- r 最多增加 n 次
- 因此 while 總共執行 O(n) 次

總時間: O(n)
```

## 練習建議

1. **理解定義:** 手工計算小例子的 z 陣列
2. **模擬過程:** 逐步模擬 [l, r] 的維護
3. **實現模板:** 熟練掌握 Z-algorithm
4. **對比 KMP:** 理解兩者的異同
5. **應用練習:** 字串匹配, 週期性檢測

## 延伸閱讀

- 下一章: **Manacher 算法** - O(n) 最長回文
- 相關主題: **KMP**, **字串雜湊**
- 進階應用: **後綴陣列**, **字串問題**
