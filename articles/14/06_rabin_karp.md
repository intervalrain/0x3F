---
title: 14-6. Rabin-Karp (*)
order: 6
description: 基於滾動雜湊的字串匹配算法
tags:
  - rabin-karp
  - rolling-hash
  - advanced
author: Rain Hu
date: ''
draft: true
---

# 6. Rabin-Karp

Rabin-Karp 算法是一種基於雜湊的字串匹配算法,通過 Rolling Hash (滾動雜湊) 技術實現高效匹配。特別適合多模式匹配和重複子串檢測。

> **標註 (*):** 本章為進階主題,重點介紹概念和實用技巧。

## Rabin-Karp 算法原理

### 核心思想

1. **雜湊比較:** 不直接比較字串,而是比較雜湊值
2. **滾動更新:** O(1) 時間更新滑動窗口的雜湊值
3. **衝突處理:** 雜湊值相同時,再進行實際字串比較

### Rolling Hash (滾動雜湊)

**多項式雜湊函數:**

```
hash(s) = (s[0]×p^0 + s[1]×p^1 + ... + s[n-1]×p^(n-1)) mod m

其中:
- p: 質數基數 (通常用 31, 37, 53 等)
- m: 模數 (通常用大質數,如 1e9+7, 1e9+9)
```

**示例:**

```
s = "abc", p = 31, m = 1e9+7

hash = (97×31^0 + 98×31^1 + 99×31^2) mod m
     = (97 + 3038 + 95139) mod m
     = 98274 mod m
```

## 滾動更新公式

### 移除第一個字元,加入新字元

```
舊窗口: s[i...i+m-1]
新窗口: s[i+1...i+m]

hash_new = (hash_old - s[i]×p^0) / p + s[i+m]×p^(m-1)
        = (hash_old - s[i]) / p + s[i+m]×p^(m-1)

為避免除法,改為:
hash_new = (hash_old - s[i]×pow) × p + s[i+m]
其中 pow = p^(m-1)
```

### 視覺化

```
text = "abcde", pattern = "bcd" (長度 3)

窗口1: abc
hash1 = a×p^0 + b×p^1 + c×p^2

窗口2: bcd
移除 a: (hash1 - a×p^0) / p = b×p^0 + c×p^1
加入 d: b×p^0 + c×p^1 + d×p^2
```

## 實現

### 基本版本

```cpp
class Solution {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 31;

public:
    vector<int> rabinKarp(string text, string pattern) {
        vector<int> result;
        int n = text.length(), m = pattern.length();

        if (m > n) return result;

        // 計算 BASE^(m-1) mod MOD
        long long pow = 1;
        for (int i = 0; i < m - 1; i++) {
            pow = (pow * BASE) % MOD;
        }

        // 計算 pattern 的雜湊
        long long patternHash = 0;
        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * BASE + pattern[i]) % MOD;
        }

        // 計算第一個窗口的雜湊
        long long textHash = 0;
        for (int i = 0; i < m; i++) {
            textHash = (textHash * BASE + text[i]) % MOD;
        }

        // 比較第一個窗口
        if (textHash == patternHash) {
            if (text.substr(0, m) == pattern)  // 確認
                result.push_back(0);
        }

        // 滾動窗口
        for (int i = m; i < n; i++) {
            // 移除最左字元
            textHash = (textHash - text[i - m] * pow % MOD + MOD) % MOD;
            // 滑動並加入新字元
            textHash = (textHash * BASE + text[i]) % MOD;

            // 比較
            if (textHash == patternHash) {
                if (text.substr(i - m + 1, m) == pattern)
                    result.push_back(i - m + 1);
            }
        }

        return result;
    }
};

// 時間複雜度: O(n + m) 平均, O(nm) 最壞 (衝突)
// 空間複雜度: O(1)
```

### 模板類

```cpp
class RollingHash {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 31;
    long long hashValue;
    long long pow;
    int windowSize;

public:
    RollingHash(int size) : windowSize(size), hashValue(0), pow(1) {
        for (int i = 0; i < size - 1; i++) {
            pow = (pow * BASE) % MOD;
        }
    }

    // 計算字串的雜湊
    long long computeHash(const string& s) {
        long long h = 0;
        for (char c : s) {
            h = (h * BASE + c) % MOD;
        }
        return h;
    }

    // 初始化窗口
    void init(const string& s, int start) {
        hashValue = 0;
        for (int i = start; i < start + windowSize; i++) {
            hashValue = (hashValue * BASE + s[i]) % MOD;
        }
    }

    // 滾動更新
    void roll(char remove, char add) {
        hashValue = (hashValue - remove * pow % MOD + MOD) % MOD;
        hashValue = (hashValue * BASE + add) % MOD;
    }

    long long getHash() const {
        return hashValue;
    }
};
```

## 雙重雜湊 (Double Hashing)

使用兩個不同的雜湊函數,降低碰撞機率。

```cpp
class DoubleHash {
private:
    const long long MOD1 = 1e9 + 7;
    const long long MOD2 = 1e9 + 9;
    const long long BASE1 = 31;
    const long long BASE2 = 37;

    long long hash1, hash2;
    long long pow1, pow2;
    int size;

public:
    DoubleHash(int n) : size(n) {
        pow1 = pow2 = 1;
        for (int i = 0; i < n - 1; i++) {
            pow1 = (pow1 * BASE1) % MOD1;
            pow2 = (pow2 * BASE2) % MOD2;
        }
    }

    pair<long long, long long> computeHash(const string& s) {
        long long h1 = 0, h2 = 0;
        for (char c : s) {
            h1 = (h1 * BASE1 + c) % MOD1;
            h2 = (h2 * BASE2 + c) % MOD2;
        }
        return {h1, h2};
    }

    void init(const string& s, int start) {
        hash1 = hash2 = 0;
        for (int i = start; i < start + size; i++) {
            hash1 = (hash1 * BASE1 + s[i]) % MOD1;
            hash2 = (hash2 * BASE2 + s[i]) % MOD2;
        }
    }

    void roll(char remove, char add) {
        hash1 = (hash1 - remove * pow1 % MOD1 + MOD1) % MOD1;
        hash1 = (hash1 * BASE1 + add) % MOD1;

        hash2 = (hash2 - remove * pow2 % MOD2 + MOD2) % MOD2;
        hash2 = (hash2 * BASE2 + add) % MOD2;
    }

    pair<long long, long long> getHash() const {
        return {hash1, hash2};
    }
};

// 碰撞機率: 1 / (MOD1 × MOD2) ≈ 1 / 10^18
```

## 應用場景

### 1. 多模式匹配

```cpp
vector<int> multiPatternSearch(string text, vector<string>& patterns) {
    unordered_map<long long, string> patternHashes;
    RollingHash rh(patterns[0].length());

    // 計算所有模式串的雜湊
    for (string& pattern : patterns) {
        long long h = rh.computeHash(pattern);
        patternHashes[h] = pattern;
    }

    vector<int> result;
    int n = text.length(), m = patterns[0].length();

    rh.init(text, 0);
    if (patternHashes.count(rh.getHash())) {
        result.push_back(0);
    }

    for (int i = m; i < n; i++) {
        rh.roll(text[i - m], text[i]);
        if (patternHashes.count(rh.getHash())) {
            result.push_back(i - m + 1);
        }
    }

    return result;
}
```

### 2. 重複子串檢測

```cpp
string longestDuplicateSubstring(string s) {
    int left = 1, right = s.length() - 1;
    string result = "";

    while (left <= right) {
        int mid = (left + right) / 2;

        string dup = findDuplicate(s, mid);
        if (!dup.empty()) {
            result = dup;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

string findDuplicate(string& s, int len) {
    const long long MOD = 1e9 + 7;
    const long long BASE = 26;

    long long pow = 1;
    for (int i = 0; i < len - 1; i++) {
        pow = (pow * BASE) % MOD;
    }

    unordered_set<long long> seen;
    long long hash = 0;

    for (int i = 0; i < len; i++) {
        hash = (hash * BASE + (s[i] - 'a')) % MOD;
    }
    seen.insert(hash);

    for (int i = len; i < s.length(); i++) {
        hash = (hash - (s[i - len] - 'a') * pow % MOD + MOD) % MOD;
        hash = (hash * BASE + (s[i] - 'a')) % MOD;

        if (seen.count(hash)) {
            return s.substr(i - len + 1, len);
        }
        seen.insert(hash);
    }

    return "";
}
```

## LeetCode 題目詳解

### [28. Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

使用 Rabin-Karp 解法:

```cpp
class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;

        const long long MOD = 1e9 + 7;
        const long long BASE = 31;
        int n = haystack.length(), m = needle.length();

        if (m > n) return -1;

        long long pow = 1;
        for (int i = 0; i < m - 1; i++) {
            pow = (pow * BASE) % MOD;
        }

        long long needleHash = 0, textHash = 0;

        for (int i = 0; i < m; i++) {
            needleHash = (needleHash * BASE + needle[i]) % MOD;
            textHash = (textHash * BASE + haystack[i]) % MOD;
        }

        if (textHash == needleHash && haystack.substr(0, m) == needle)
            return 0;

        for (int i = m; i < n; i++) {
            textHash = (textHash - haystack[i - m] * pow % MOD + MOD) % MOD;
            textHash = (textHash * BASE + haystack[i]) % MOD;

            if (textHash == needleHash) {
                if (haystack.substr(i - m + 1, m) == needle)
                    return i - m + 1;
            }
        }

        return -1;
    }
};
```

### [187. Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/)

```cpp
class Solution {
public:
    vector<string> findRepeatedDnaSequences(string s) {
        if (s.length() <= 10) return {};

        const long long BASE = 4;  // A,C,G,T -> 0,1,2,3
        const long long MOD = 1e9 + 7;
        int len = 10;

        // 字元映射
        unordered_map<char, int> charMap = {
            {'A', 0}, {'C', 1}, {'G', 2}, {'T', 3}
        };

        long long pow = 1;
        for (int i = 0; i < len - 1; i++) {
            pow = (pow * BASE) % MOD;
        }

        unordered_map<long long, int> hashCount;
        vector<string> result;

        long long hash = 0;
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + charMap[s[i]]) % MOD;
        }
        hashCount[hash]++;

        for (int i = len; i < s.length(); i++) {
            hash = (hash - charMap[s[i - len]] * pow % MOD + MOD) % MOD;
            hash = (hash * BASE + charMap[s[i]]) % MOD;

            if (++hashCount[hash] == 2) {
                result.push_back(s.substr(i - len + 1, len));
            }
        }

        return result;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

### [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)

二分 + Rabin-Karp:

```cpp
class Solution {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 26;

    string findDuplicate(string& s, int len) {
        if (len == 0) return "";

        long long pow = 1;
        for (int i = 0; i < len - 1; i++) {
            pow = (pow * BASE) % MOD;
        }

        unordered_set<long long> seen;
        long long hash = 0;

        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + (s[i] - 'a')) % MOD;
        }
        seen.insert(hash);

        for (int i = len; i < s.length(); i++) {
            hash = (hash - (s[i - len] - 'a') * pow % MOD + MOD) % MOD;
            hash = (hash * BASE + (s[i] - 'a')) % MOD;

            if (seen.count(hash)) {
                return s.substr(i - len + 1, len);
            }
            seen.insert(hash);
        }

        return "";
    }

public:
    string longestDupSubstring(string s) {
        int left = 1, right = s.length() - 1;
        string result = "";

        while (left <= right) {
            int mid = (left + right) / 2;
            string dup = findDuplicate(s, mid);

            if (!dup.empty()) {
                result = dup;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }
};

// 時間複雜度: O(n log n)
// 空間複雜度: O(n)
```

## 常見陷阱與技巧

### 1. 選擇合適的質數

```cpp
// 常用質數組合:
const long long MOD = 1e9 + 7;  // 或 1e9 + 9
const long long BASE = 31;      // 或 37, 53, 131

// 避免使用小質數 (容易碰撞)
// 避免使用 2 的冪次 (分布不均)
```

### 2. 處理負數模運算

```cpp
// 錯誤: 可能產生負數
hash = (hash - remove * pow) % MOD;

// 正確: 加 MOD 確保非負
hash = (hash - remove * pow % MOD + MOD) % MOD;
```

### 3. 溢出處理

```cpp
// 使用 long long
long long hash = 0;

// 每步取模
hash = (hash * BASE + c) % MOD;

// 或使用 unsigned long long 自然溢出 (某些場景)
```

### 4. 雜湊衝突

```cpp
// 必須確認實際字串相等
if (hash1 == hash2) {
    if (s1.substr(i, m) == s2.substr(j, m)) {
        // 真正匹配
    }
}

// 或使用雙重雜湊降低碰撞
```

## 複雜度總結

| 操作 | 時間複雜度 | 備註 |
|------|-----------|------|
| 計算雜湊 | O(m) | 模式串長度 |
| 滾動更新 | O(1) | 每次更新 |
| 總體匹配 | O(n+m) 平均 | 無衝突時 |
| 最壞情況 | O(nm) | 頻繁衝突 |

## Rabin-Karp vs KMP

| 特性 | Rabin-Karp | KMP |
|------|-----------|-----|
| 時間複雜度 | O(n+m) 平均 | O(n+m) 保證 |
| 空間複雜度 | O(1) | O(m) |
| 多模式匹配 | 容易擴展 | 較困難 |
| 實現難度 | 簡單 | 中等 |
| 適用場景 | 多模式, 重複檢測 | 單模式, 週期性 |

## 練習建議

1. **理解滾動雜湊:** 手工計算滾動更新過程
2. **實現模板:** 掌握基本和雙重雜湊版本
3. **處理衝突:** 練習正確處理雜湊碰撞
4. **應用練習:** 重複子串, 多模式匹配

## 延伸閱讀

- 下一章: **Boyer-Moore 算法**
- 相關主題: **字串雜湊** (第 10 章)
- 進階主題: **AC 自動機** (多模式匹配)
