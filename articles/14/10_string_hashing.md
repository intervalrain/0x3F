---
title: 14-10. String Hashing
order: 10
description: 字串雜湊與前綴雜湊陣列
tags:
  - string-hashing
  - rolling-hash
  - prefix-hash
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 10. String Hashing

字串雜湊是一種將字串映射為整數的技術,允許 O(1) 時間比較子串,廣泛應用於字串匹配、重複檢測等問題。

## 字串雜湊原理

### 多項式雜湊

最常用的雜湊函數:

```
hash(s) = (s[0]×p^0 + s[1]×p^1 + ... + s[n-1]×p^(n-1)) mod m

其中:
- p: 質數基數 (31, 37, 53, 131 等)
- m: 模數 (1e9+7, 1e9+9, 2^64 等)
```

### 示例

```
s = "abc", p = 31, m = 1e9+7

hash = (97×1 + 98×31 + 99×961) mod m
     = (97 + 3038 + 95139) mod m
     = 98274 mod m
```

### 基本實現

```cpp
long long computeHash(string s) {
    const long long MOD = 1e9 + 7;
    const long long BASE = 31;

    long long hash = 0;
    long long pow = 1;

    for (char c : s) {
        hash = (hash + c * pow) % MOD;
        pow = (pow * BASE) % MOD;
    }

    return hash;
}
```

## 前綴雜湊陣列

### 核心思想

預處理字串的所有前綴雜湊值,實現 O(1) 查詢任意子串雜湊。

### 構建

```cpp
class StringHash {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 31;
    vector<long long> hash, pow;

public:
    StringHash(string s) {
        int n = s.length();
        hash.resize(n + 1, 0);
        pow.resize(n + 1, 1);

        // 計算前綴雜湊
        for (int i = 0; i < n; i++) {
            hash[i + 1] = (hash[i] + s[i] * pow[i]) % MOD;
            pow[i + 1] = (pow[i] * BASE) % MOD;
        }
    }

    // 獲取 s[l...r] 的雜湊值
    long long getHash(int l, int r) {
        long long result = (hash[r + 1] - hash[l] + MOD) % MOD;
        return result;
    }

    // 比較兩個子串
    bool equals(int l1, int r1, int l2, int r2) {
        if (r1 - l1 != r2 - l2) return false;

        long long hash1 = getHash(l1, r1);
        long long hash2 = getHash(l2, r2);

        // 需要調整為相同的 p 次冪
        int len1 = r1 - l1 + 1;
        int len2 = r2 - l2 + 1;

        if (l1 < l2) {
            hash1 = (hash1 * pow[l2 - l1]) % MOD;
        } else if (l2 < l1) {
            hash2 = (hash2 * pow[l1 - l2]) % MOD;
        }

        return hash1 == hash2;
    }
};

// 時間複雜度:
// - 構建: O(n)
// - 查詢: O(1)
```

### 子串雜湊計算

```
hash[0...i] = s[0]×p^0 + s[1]×p^1 + ... + s[i]×p^i

hash[l...r] = s[l]×p^0 + s[l+1]×p^1 + ... + s[r]×p^(r-l)
            = (hash[r+1] - hash[l]) / p^l

為避免除法,統一乘以 p^l:
hash[l...r] × p^l = hash[r+1] - hash[l]
```

## 雙重雜湊

使用兩個不同的雜湊函數降低碰撞機率。

```cpp
class DoubleStringHash {
private:
    const long long MOD1 = 1e9 + 7;
    const long long MOD2 = 1e9 + 9;
    const long long BASE1 = 31;
    const long long BASE2 = 37;

    vector<long long> hash1, hash2, pow1, pow2;

public:
    DoubleStringHash(string s) {
        int n = s.length();
        hash1.resize(n + 1, 0);
        hash2.resize(n + 1, 0);
        pow1.resize(n + 1, 1);
        pow2.resize(n + 1, 1);

        for (int i = 0; i < n; i++) {
            hash1[i + 1] = (hash1[i] + s[i] * pow1[i]) % MOD1;
            hash2[i + 1] = (hash2[i] + s[i] * pow2[i]) % MOD2;

            pow1[i + 1] = (pow1[i] * BASE1) % MOD1;
            pow2[i + 1] = (pow2[i] * BASE2) % MOD2;
        }
    }

    pair<long long, long long> getHash(int l, int r) {
        long long h1 = (hash1[r + 1] - hash1[l] + MOD1) % MOD1;
        long long h2 = (hash2[r + 1] - hash2[l] + MOD2) % MOD2;
        return {h1, h2};
    }

    bool equals(int l1, int r1, int l2, int r2) {
        if (r1 - l1 != r2 - l2) return false;

        auto [h1_1, h1_2] = getHash(l1, r1);
        auto [h2_1, h2_2] = getHash(l2, r2);

        // 調整次冪
        if (l1 < l2) {
            h1_1 = (h1_1 * pow1[l2 - l1]) % MOD1;
            h1_2 = (h1_2 * pow2[l2 - l1]) % MOD2;
        } else if (l2 < l1) {
            h2_1 = (h2_1 * pow1[l1 - l2]) % MOD1;
            h2_2 = (h2_2 * pow2[l1 - l2]) % MOD2;
        }

        return h1_1 == h2_1 && h1_2 == h2_2;
    }
};

// 碰撞機率: 約 1/10^18
```

## 應用場景

### 1. 快速子串比較

```cpp
StringHash sh("abcdefgh");

// 比較 "abc" 和 "def"
bool eq1 = sh.equals(0, 2, 3, 5);  // false

// 比較 "bcd" 和 "bcd"
bool eq2 = sh.equals(1, 3, 1, 3);  // true
```

### 2. 重複子串檢測

```cpp
vector<string> findDuplicates(string s, int len) {
    StringHash sh(s);
    unordered_map<long long, vector<int>> hashMap;

    for (int i = 0; i <= s.length() - len; i++) {
        long long h = sh.getHash(i, i + len - 1);
        hashMap[h].push_back(i);
    }

    vector<string> result;
    for (auto& [hash, positions] : hashMap) {
        if (positions.size() > 1) {
            result.push_back(s.substr(positions[0], len));
        }
    }

    return result;
}
```

### 3. 最長公共子串

```cpp
int longestCommonSubstring(string s1, string s2) {
    int left = 0, right = min(s1.length(), s2.length());
    int result = 0;

    while (left <= right) {
        int mid = (left + right) / 2;

        // 檢查是否存在長度為 mid 的公共子串
        if (hasCommonSubstring(s1, s2, mid)) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

bool hasCommonSubstring(string s1, string s2, int len) {
    StringHash sh1(s1), sh2(s2);
    unordered_set<long long> hashes;

    for (int i = 0; i <= s1.length() - len; i++) {
        hashes.insert(sh1.getHash(i, i + len - 1));
    }

    for (int i = 0; i <= s2.length() - len; i++) {
        if (hashes.count(sh2.getHash(i, i + len - 1))) {
            return true;
        }
    }

    return false;
}

// 時間複雜度: O((n+m) log min(n,m))
```

## LeetCode 題目詳解

### [1923. Longest Common Subpath](https://leetcode.com/problems/longest-common-subpath/)

```cpp
class Solution {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 100003;

    bool check(vector<vector<int>>& paths, int len) {
        unordered_map<long long, int> count;

        for (auto& path : paths) {
            unordered_set<long long> seen;
            long long hash = 0, pow = 1;

            // 第一個窗口
            for (int i = 0; i < len; i++) {
                hash = (hash * BASE + path[i]) % MOD;
                if (i < len - 1)
                    pow = (pow * BASE) % MOD;
            }
            seen.insert(hash);

            // 滾動窗口
            for (int i = len; i < path.size(); i++) {
                hash = ((hash - path[i - len] * pow % MOD + MOD) % MOD * BASE + path[i]) % MOD;
                seen.insert(hash);
            }

            // 計數
            for (long long h : seen) {
                count[h]++;
            }
        }

        // 檢查是否有雜湊出現在所有路徑中
        for (auto& [hash, cnt] : count) {
            if (cnt == paths.size())
                return true;
        }

        return false;
    }

public:
    int longestCommonSubpath(int n, vector<vector<int>>& paths) {
        int left = 0, right = 1e5;

        for (auto& path : paths) {
            right = min(right, (int)path.size());
        }

        int result = 0;

        while (left <= right) {
            int mid = (left + right) / 2;

            if (check(paths, mid)) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }
};

// 時間複雜度: O(N×M×log M)
// N = 路徑總長度, M = 最短路徑長度
```

### [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

使用雜湊找最長回文前綴:

```cpp
class Solution {
public:
    string shortestPalindrome(string s) {
        const long long MOD = 1e9 + 7;
        const long long BASE = 31;

        int n = s.length();
        long long hashL = 0, hashR = 0, pow = 1;
        int maxLen = 0;

        // 找最長回文前綴
        for (int i = 0; i < n; i++) {
            hashL = (hashL * BASE + s[i]) % MOD;
            hashR = (hashR + s[i] * pow) % MOD;
            pow = (pow * BASE) % MOD;

            if (hashL == hashR) {
                maxLen = i + 1;
            }
        }

        // 添加剩餘部分的反轉
        string suffix = s.substr(maxLen);
        reverse(suffix.begin(), suffix.end());

        return suffix + s;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

### [718. Maximum Length of Repeated Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)

```cpp
class Solution {
private:
    const long long MOD = 1e9 + 7;
    const long long BASE = 113;

    bool check(vector<int>& nums1, vector<int>& nums2, int len) {
        unordered_set<long long> hashes;
        long long hash = 0, pow = 1;

        // nums1 的雜湊
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + nums1[i]) % MOD;
            if (i < len - 1)
                pow = (pow * BASE) % MOD;
        }
        hashes.insert(hash);

        for (int i = len; i < nums1.size(); i++) {
            hash = ((hash - nums1[i - len] * pow % MOD + MOD) % MOD * BASE + nums1[i]) % MOD;
            hashes.insert(hash);
        }

        // nums2 的雜湊
        hash = 0;
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + nums2[i]) % MOD;
        }
        if (hashes.count(hash)) return true;

        for (int i = len; i < nums2.size(); i++) {
            hash = ((hash - nums2[i - len] * pow % MOD + MOD) % MOD * BASE + nums2[i]) % MOD;
            if (hashes.count(hash)) return true;
        }

        return false;
    }

public:
    int findLength(vector<int>& nums1, vector<int>& nums2) {
        int left = 0, right = min(nums1.size(), nums2.size());
        int result = 0;

        while (left <= right) {
            int mid = (left + right) / 2;

            if (check(nums1, nums2, mid)) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }
};

// 時間複雜度: O((m+n) log min(m,n))
// 空間複雜度: O(m+n)
```

## 質數選擇

### 常用組合

```cpp
// 單雜湊
const long long MOD = 1e9 + 7;  // 或 1e9 + 9
const long long BASE = 31;      // 或 37, 53, 131

// 雙雜湊
const long long MOD1 = 1e9 + 7;
const long long MOD2 = 1e9 + 9;
const long long BASE1 = 31;
const long long BASE2 = 37;

// 自然溢出 (unsigned long long)
// MOD = 2^64
// BASE = 任意質數
```

### 選擇原則

1. **BASE:** 略大於字元集大小的質數
   - 小寫字母: 31, 37
   - 所有字母: 53, 131
   - 數字: 適當選擇

2. **MOD:** 大質數,避免碰撞
   - 1e9+7, 1e9+9 (常用)
   - 或使用自然溢出

## 常見陷阱

### 1. 負數模運算

```cpp
// 錯誤
long long result = (hash[r] - hash[l]) % MOD;

// 正確
long long result = (hash[r] - hash[l] + MOD) % MOD;
```

### 2. 次冪對齊

```cpp
// 比較不同位置的子串時,需要調整次冪
// 見 StringHash::equals() 實現
```

### 3. 溢出處理

```cpp
// 每步取模
hash = (hash * BASE + c) % MOD;

// 或使用 long long 避免中間溢出
```

## 複雜度總結

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 構建前綴雜湊 | O(n) | O(n) |
| 查詢子串雜湊 | O(1) | - |
| 比較子串 | O(1) | - |
| 最長公共子串 | O(n log n) | O(n) |

## 練習建議

1. **理解原理:** 掌握多項式雜湊函數
2. **實現模板:** 熟練掌握前綴雜湊陣列
3. **處理碰撞:** 理解雙重雜湊的必要性
4. **應用練習:** 子串比較、重複檢測
5. **調參經驗:** 不同場景選擇合適的 p 和 m

## 延伸閱讀

- 相關主題: **Rabin-Karp** (第 6 章)
- 下一章: **AC 自動機**
- 進階主題: **後綴陣列**, **字串匹配**
