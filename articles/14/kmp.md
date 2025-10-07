---
title: "5. KMP - Knuth-Morris-Pratt"
order: 5
description: "KMP 字串匹配算法詳解"
tags: ["kmp", "string-matching", "pattern-matching"]
---

# 5. KMP - Knuth-Morris-Pratt

KMP 算法是經典的字串匹配算法，由 Knuth、Morris 和 Pratt 於 1977 年提出。它通過預處理模式串，避免重複比較，將時間複雜度從 O(nm) 優化到 O(n+m)。

## 字串匹配問題

### 問題定義

給定文本串 text 和模式串 pattern，找到 pattern 在 text 中所有出現的位置。

```
text:    "abcabcabcabc"
pattern: "abcabc"

匹配位置: 0, 3, 6
```

### 樸素算法

```cpp
vector<int> naiveSearch(string text, string pattern) {
    vector<int> result;
    int n = text.length(), m = pattern.length();

    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j])
                break;
        }
        if (j == m)
            result.push_back(i);
    }

    return result;
}

// 時間複雜度：O(nm)
// 最壞情況：text="aaa...a", pattern="aaa...ab"
```

**問題：** 當不匹配時，從頭開始重新比較，浪費已知信息！

## 為什麼需要 KMP

### 樸素算法的問題

```
text:    a b a b a b a c
pattern: a b a b a c

i=0: a b a b a b a c
     a b a b a c
           ↑ 不匹配

樸素：回退到 i=1，重新從 pattern[0] 開始
KMP：利用已匹配信息，從 pattern[2] 繼續！
```

### KMP 的核心思想

當不匹配發生時：
1. **不回退文本指針**（i 不回退）
2. **模式串指針跳到合適位置**（利用前綴函數）
3. **避免重複比較**

## KMP 算法原理

### 前綴函數（Prefix Function / Failure Function）

#### 定義

`next[i]` = pattern[0...i] 的**最長相同真前綴後綴**的長度

- **真前綴：** 不包含整個字串的前綴
- **真後綴：** 不包含整個字串的後綴

#### 示例

```
pattern = "ababa"

i=0: "a"
  前綴: 無
  後綴: 無
  next[0] = 0

i=1: "ab"
  前綴: "a"
  後綴: "b"
  無相同
  next[1] = 0

i=2: "aba"
  前綴: "a", "ab"
  後綴: "a", "ba"
  相同: "a" (長度1)
  next[2] = 1

i=3: "abab"
  前綴: "a", "ab", "aba"
  後綴: "b", "ab", "bab"
  相同: "ab" (長度2)
  next[3] = 2

i=4: "ababa"
  前綴: "a", "ab", "aba", "abab"
  後綴: "a", "ba", "aba", "baba"
  相同: "a", "aba"
  最長: "aba" (長度3)
  next[4] = 3

next = [0, 0, 1, 2, 3]
```

### next 陣列的含義

```
pattern = "a b a b a c"
next    = [0 0 1 2 3 0]
           ↑
當 pattern[5]='c' 不匹配時:
- 已匹配: "ababa" (next[4]=3)
- 跳到: pattern[3] 繼續比較
- 原因: "ababa" 的前 3 個字元 "aba" == 後 3 個字元 "aba"
```

## KMP 實現

### 構建 next 陣列

```cpp
vector<int> buildNext(string pattern) {
    int m = pattern.length();
    vector<int> next(m, 0);

    // next[0] = 0（單個字元無真前綴後綴）
    int j = 0;  // 當前最長相同前綴後綴的長度

    for (int i = 1; i < m; i++) {
        // 不匹配時，回退到 next[j-1]
        while (j > 0 && pattern[i] != pattern[j]) {
            j = next[j - 1];
        }

        // 匹配，長度+1
        if (pattern[i] == pattern[j]) {
            j++;
        }

        next[i] = j;
    }

    return next;
}

// 時間複雜度：O(m)
// 空間複雜度：O(m)
```

#### 視覺化過程

```
pattern = "ababaca"

i=0: next[0] = 0 (初始化)

i=1: pattern[1]='b', pattern[0]='a' (不匹配)
     j=0, next[1] = 0

i=2: pattern[2]='a', pattern[0]='a' (匹配)
     j=1, next[2] = 1

i=3: pattern[3]='b', pattern[1]='b' (匹配)
     j=2, next[3] = 2

i=4: pattern[4]='a', pattern[2]='a' (匹配)
     j=3, next[4] = 3

i=5: pattern[5]='c', pattern[3]='b' (不匹配)
     回退: j = next[3-1] = next[2] = 1
     pattern[5]='c', pattern[1]='b' (不匹配)
     回退: j = next[1-1] = next[0] = 0
     pattern[5]='c', pattern[0]='a' (不匹配)
     j=0, next[5] = 0

i=6: pattern[6]='a', pattern[0]='a' (匹配)
     j=1, next[6] = 1

next = [0, 0, 1, 2, 3, 0, 1]
```

### KMP 匹配過程

```cpp
vector<int> KMP(string text, string pattern) {
    vector<int> result;
    int n = text.length(), m = pattern.length();

    if (m == 0) return result;

    // 構建 next 陣列
    vector<int> next = buildNext(pattern);

    int j = 0;  // pattern 的指針

    for (int i = 0; i < n; i++) {
        // 不匹配時，回退 j
        while (j > 0 && text[i] != pattern[j]) {
            j = next[j - 1];
        }

        // 匹配
        if (text[i] == pattern[j]) {
            j++;
        }

        // 完全匹配
        if (j == m) {
            result.push_back(i - m + 1);
            j = next[j - 1];  // 繼續查找下一個匹配
        }
    }

    return result;
}

// 時間複雜度：O(n + m)
// 空間複雜度：O(m)
```

### 完整模板

```cpp
class KMP {
private:
    string pattern;
    vector<int> next;

    void buildNext() {
        int m = pattern.length();
        next.assign(m, 0);

        int j = 0;
        for (int i = 1; i < m; i++) {
            while (j > 0 && pattern[i] != pattern[j]) {
                j = next[j - 1];
            }
            if (pattern[i] == pattern[j]) {
                j++;
            }
            next[i] = j;
        }
    }

public:
    KMP(string p) : pattern(p) {
        buildNext();
    }

    vector<int> search(string text) {
        vector<int> result;
        int n = text.length(), m = pattern.length();

        int j = 0;
        for (int i = 0; i < n; i++) {
            while (j > 0 && text[i] != pattern[j]) {
                j = next[j - 1];
            }
            if (text[i] == pattern[j]) {
                j++;
            }
            if (j == m) {
                result.push_back(i - m + 1);
                j = next[j - 1];
            }
        }

        return result;
    }

    int count(string text) {
        return search(text).size();
    }

    bool contains(string text) {
        return !search(text).empty();
    }
};
```

## 視覺化匹配過程

```
text    = "ababcababa"
pattern = "ababa"
next    = [0, 0, 1, 2, 3]

步驟1:
  a b a b c a b a b a
  a b a b a
          ↑ 不匹配 (i=4, j=4)
  j = next[4-1] = next[3] = 2

步驟2:
  a b a b c a b a b a
      a b a b a
          ↑ 不匹配 (i=4, j=2)
  j = next[2-1] = next[1] = 0

步驟3:
  a b a b c a b a b a
          a b a b a
          ↑ 不匹配 (i=4, j=0)
  j 保持為 0，i++

步驟4:
  a b a b c a b a b a
            a b a b a
                    ↑ 匹配！(i=9, j=5)
  找到匹配: 位置 5
```

## 時間複雜度分析

### 構建 next 陣列

```
for i from 1 to m-1:
    while j > 0 && pattern[i] != pattern[j]:
        j = next[j-1]
    ...
```

**關鍵觀察：** j 只會增加（最多 m 次），減少（最多 m 次）
- 總操作數 = O(m)

### 匹配過程

```
for i from 0 to n-1:
    while j > 0 && text[i] != pattern[j]:
        j = next[j-1]
    ...
```

**關鍵觀察：** j 只會增加（最多 n 次），減少（最多 n 次）
- 總操作數 = O(n)

**總時間複雜度：** O(n + m)

## 應用

### 1. 週期性檢測

判斷字串是否由重複子串構成。

```cpp
bool hasRepeatingPattern(string s) {
    int n = s.length();
    vector<int> next = buildNext(s);

    // 如果 next[n-1] > 0 且 n % (n - next[n-1]) == 0
    // 則字串由週期為 (n - next[n-1]) 的子串重複構成

    int len = next[n - 1];
    if (len > 0 && n % (n - len) == 0) {
        return true;
    }

    return false;
}

// 示例:
// "abababab" -> next[7] = 6, 8 % (8-6) = 0 -> true
// "abcabc"   -> next[5] = 3, 6 % (6-3) = 0 -> true
// "abcde"    -> next[4] = 0 -> false
```

**原理：**
```
s = "abababab"
next = [0, 0, 1, 2, 3, 4, 5, 6]
       a b a b a b a b
         ↑_____↑ 前綴
             ↑_____↑ 後綴

最長相同前綴後綴長度 = 6
週期長度 = 8 - 6 = 2
週期子串 = "ab"
```

### 2. 子串搜尋（多次查詢）

```cpp
// 預處理一次，多次查詢
KMP kmp("pattern");
kmp.search(text1);
kmp.search(text2);
kmp.search(text3);
```

### 3. 最短回文前綴

給定字串 s，在前面添加最少字元使其成為回文。

```cpp
string shortestPalindrome(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());

    // 找 s 和 rev 的最長公共前綴後綴
    string combined = s + "#" + rev;
    vector<int> next = buildNext(combined);

    int overlap = next[combined.length() - 1];

    // 需要添加的字元 = rev 的前 (n - overlap) 個字元
    return rev.substr(0, s.length() - overlap) + s;
}

// 示例:
// s = "aacecaaa"
// rev = "aaacecaa"
// combined = "aacecaaa#aaacecaa"
// overlap = 最長公共部分長度
// 結果: "aaacecaaa" (前面加 "aa")
```

## LeetCode 題目詳解

### [28. Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

**題目：** 找到模式串第一次出現的位置（實現 strStr）。

```cpp
class Solution {
private:
    vector<int> buildNext(string pattern) {
        int m = pattern.length();
        vector<int> next(m, 0);

        int j = 0;
        for (int i = 1; i < m; i++) {
            while (j > 0 && pattern[i] != pattern[j]) {
                j = next[j - 1];
            }
            if (pattern[i] == pattern[j]) {
                j++;
            }
            next[i] = j;
        }

        return next;
    }

public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;

        int n = haystack.length(), m = needle.length();
        vector<int> next = buildNext(needle);

        int j = 0;
        for (int i = 0; i < n; i++) {
            while (j > 0 && haystack[i] != needle[j]) {
                j = next[j - 1];
            }
            if (haystack[i] == needle[j]) {
                j++;
            }
            if (j == m) {
                return i - m + 1;
            }
        }

        return -1;
    }
};

// 時間複雜度：O(n + m)
// 空間複雜度：O(m)
```

### [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)

**題目：** 判斷字串是否由重複子串構成。

```cpp
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        int n = s.length();
        vector<int> next(n, 0);

        // 構建 next 陣列
        int j = 0;
        for (int i = 1; i < n; i++) {
            while (j > 0 && s[i] != s[j]) {
                j = next[j - 1];
            }
            if (s[i] == s[j]) {
                j++;
            }
            next[i] = j;
        }

        // 檢查週期性
        int len = next[n - 1];
        return len > 0 && n % (n - len) == 0;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(n)
```

**替代解法（不使用 KMP）：**

```cpp
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        // 將 s 複製兩次，移除首尾字元
        // 如果 s 仍在其中，說明 s 由重複子串構成
        string doubled = s + s;
        return doubled.substr(1, doubled.length() - 2).find(s) != string::npos;
    }
};

// 時間複雜度：O(n²)（substr + find）
// 空間複雜度：O(n)
```

### [796. Rotate String](https://leetcode.com/problems/rotate-string/)

**題目：** 判斷 s 能否通過旋轉得到 goal。

```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        if (s.length() != goal.length())
            return false;

        // s 的所有旋轉都是 s+s 的子串
        string doubled = s + s;
        return doubled.find(goal) != string::npos;
    }
};

// 時間複雜度：O(n²)（find）
// 空間複雜度：O(n)
```

**使用 KMP 優化：**

```cpp
class Solution {
private:
    vector<int> buildNext(string pattern) {
        int m = pattern.length();
        vector<int> next(m, 0);

        int j = 0;
        for (int i = 1; i < m; i++) {
            while (j > 0 && pattern[i] != pattern[j]) {
                j = next[j - 1];
            }
            if (pattern[i] == pattern[j]) {
                j++;
            }
            next[i] = j;
        }

        return next;
    }

    bool KMPSearch(string text, string pattern) {
        int n = text.length(), m = pattern.length();
        vector<int> next = buildNext(pattern);

        int j = 0;
        for (int i = 0; i < n; i++) {
            while (j > 0 && text[i] != pattern[j]) {
                j = next[j - 1];
            }
            if (text[i] == pattern[j]) {
                j++;
            }
            if (j == m) {
                return true;
            }
        }

        return false;
    }

public:
    bool rotateString(string s, string goal) {
        if (s.length() != goal.length())
            return false;

        string doubled = s + s;
        return KMPSearch(doubled, goal);
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(n)
```

### [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**題目：** 在字串前添加最少字元使其成為回文。

```cpp
class Solution {
private:
    vector<int> buildNext(string s) {
        int n = s.length();
        vector<int> next(n, 0);

        int j = 0;
        for (int i = 1; i < n; i++) {
            while (j > 0 && s[i] != s[j]) {
                j = next[j - 1];
            }
            if (s[i] == s[j]) {
                j++;
            }
            next[i] = j;
        }

        return next;
    }

public:
    string shortestPalindrome(string s) {
        string rev = s;
        reverse(rev.begin(), rev.end());

        // 使用 # 分隔，避免重疊
        string combined = s + "#" + rev;
        vector<int> next = buildNext(combined);

        int overlap = next[combined.length() - 1];

        // 需要添加的部分
        return rev.substr(0, s.length() - overlap) + s;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(n)
```

**視覺化：**
```
s = "aacecaaa"
rev = "aaacecaa"

combined = "aacecaaa#aaacecaa"
           a a c e c a a a # a a a c e c a a
next:      0 1 0 0 0 1 2 2 0 1 2 2 2 0 0 1 2

overlap = next[16] = 2
需添加 = rev[0...5] = "aaacec"
結果 = "aaacecaacecaaa" (錯誤)

正確理解:
overlap = 2 表示 "aa" 匹配
需添加 = s.length() - overlap = 8 - 2 = 6
添加 rev[0...5] = "aaacec"
結果 = "aaacecaacecaaa"
```

## 常見陷阱與技巧

### 1. next 陣列的索引

```cpp
// 注意：回退到 next[j-1]，不是 next[j]
while (j > 0 && pattern[i] != pattern[j]) {
    j = next[j - 1];  // 正確
    // j = next[j];   // 錯誤！
}
```

### 2. 邊界條件

```cpp
// 空模式串
if (pattern.empty()) return {0};  // 或其他合適的處理

// 模式串比文本長
if (pattern.length() > text.length()) return {};
```

### 3. 找所有匹配 vs 找第一個匹配

```cpp
// 找第一個匹配：找到後立即返回
if (j == m) {
    return i - m + 1;
}

// 找所有匹配：繼續搜尋
if (j == m) {
    result.push_back(i - m + 1);
    j = next[j - 1];  // 繼續
}
```

### 4. next 陣列的兩種定義

```cpp
// 定義 1: next[i] = pattern[0...i] 的最長相同前綴後綴長度
// 定義 2: next[i] = pattern[0...i-1] 的最長相同前綴後綴長度

// 本文使用定義 1（更直觀）
// 有些資料使用定義 2（索引偏移）
```

## 複雜度總結

| 操作 | 時間複雜度 | 空間複雜度 | 備註 |
|------|-----------|-----------|------|
| 構建 next 陣列 | O(m) | O(m) | m = pattern 長度 |
| KMP 匹配 | O(n) | O(1) | 不含 next 陣列 |
| 總體 | O(n + m) | O(m) | 線性時間 |
| 樸素算法 | O(nm) | O(1) | 最壞情況 |

## KMP vs 其他算法

| 算法 | 時間複雜度 | 空間複雜度 | 適用場景 |
|------|-----------|-----------|---------|
| 樸素算法 | O(nm) | O(1) | 短模式串 |
| KMP | O(n+m) | O(m) | 通用，穩定 |
| Rabin-Karp | O(n+m) 平均 | O(1) | 多模式匹配 |
| Boyer-Moore | O(n/m) 最好 | O(m) | 長模式串 |

## 練習建議

1. **理解 next 陣列：** 手工計算小例子的 next 陣列
2. **模擬匹配過程：** 逐步模擬 KMP 匹配
3. **實現模板：** 熟練掌握 KMP 模板代碼
4. **應用練習：** 週期性、回文等變形問題
5. **對比理解：** 理解 KMP vs 樸素算法的差異

## 延伸閱讀

- 下一章：**Rabin-Karp 算法** - 基於雜湊的字串匹配
- 相關主題：**Z-function**（類似 KMP 的思想）
- 進階主題：**AC 自動機**（多模式匹配）
