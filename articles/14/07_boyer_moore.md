---
title: 14-7. Boyer-Moore (*)
order: 7
description: Boyer-Moore 字串匹配算法
tags:
  - boyer-moore
  - string-matching
  - advanced
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 7. Boyer-Moore

Boyer-Moore 算法是一種高效的字串匹配算法,通過從右向左匹配和智能跳躍,在實務中表現優異,被廣泛應用於文本編輯器和搜尋工具。

> **標註 (*):** 本章為進階主題,重點介紹概念和核心思想,完整實現較為複雜。

## Boyer-Moore 算法原理

### 核心思想

與 KMP 從左向右不同,Boyer-Moore **從右向左**匹配:

```
text:    HERE IS A SIMPLE EXAMPLE
pattern:     EXAMPLE
             ↑
          從這裡開始比較
```

### 兩條規則

#### 1. 壞字元規則 (Bad Character Rule)

當不匹配發生時,根據文本中的"壞字元"決定跳躍距離。

```
text:    ...T...
pattern:   EXAMPLE
              ↑
          T 是壞字元

情況 1: T 在 pattern 中出現
  -> 將 pattern 中最右的 T 對齊

情況 2: T 不在 pattern 中
  -> 跳過整個 pattern 長度
```

#### 2. 好後綴規則 (Good Suffix Rule)

當不匹配發生時,利用已匹配的"好後綴"決定跳躍距離。

```
text:    ...XAMPLE
pattern:   EXAMPLE
            ↑
      已匹配: "AMPLE" (好後綴)

跳躍策略:
- 在 pattern 中找另一個 "AMPLE"
- 或找 "AMPLE" 的後綴在 pattern 前綴中出現
```

## 壞字元規則詳解

### 預處理

為每個字元記錄在模式串中最右出現的位置:

```cpp
vector<int> buildBadChar(string pattern) {
    vector<int> badChar(256, -1);  // ASCII 字元集

    for (int i = 0; i < pattern.length(); i++) {
        badChar[pattern[i]] = i;
    }

    return badChar;
}

// 示例:
// pattern = "EXAMPLE"
// badChar['E'] = 6 (最右位置)
// badChar['X'] = 1
// badChar['A'] = 2
// badChar['M'] = 3
// badChar['P'] = 4
// badChar['L'] = 5
// badChar['Z'] = -1 (不存在)
```

### 跳躍距離計算

```cpp
int shift = j - badChar[text[i + j]];

其中:
- j: pattern 中不匹配的位置
- text[i + j]: 文本中的壞字元

shift 可能為負,需與 1 取較大值
```

### 視覺化

```
text:    ...TXAMPLE
pattern:   EXAMPLE
              ↑
          j=5, text[i+5]='T'
          badChar['T'] = -1

shift = 5 - (-1) = 6
跳躍 6 位
```

## 好後綴規則詳解 (概念)

### 情況分析

```
已匹配後綴: "AMPLE"

情況 1: "AMPLE" 在 pattern 中其他位置出現
  -> 對齊到該位置

情況 2: "AMPLE" 不再出現,但其後綴 "PLE", "LE", "E" 在 pattern 前綴出現
  -> 對齊到前綴

情況 3: 都不滿足
  -> 跳過整個 pattern
```

### 預處理 (複雜,概念為主)

需要計算兩個陣列:
1. **suffix[i]:** 從位置 i 開始的後綴與 pattern 某個後綴的最長匹配長度
2. **shift[i]:** 基於好後綴規則的跳躍距離

**實現較為複雜**,實務中通常只使用壞字元規則的簡化版本。

## 簡化版 Boyer-Moore

實務中常用的簡化版本,只使用壞字元規則:

```cpp
class SimpleBoyerMoore {
private:
    vector<int> badChar;
    string pattern;

    void buildBadChar() {
        badChar.assign(256, -1);
        for (int i = 0; i < pattern.length(); i++) {
            badChar[pattern[i]] = i;
        }
    }

public:
    SimpleBoyerMoore(string p) : pattern(p) {
        buildBadChar();
    }

    vector<int> search(string text) {
        vector<int> result;
        int n = text.length(), m = pattern.length();

        int i = 0;
        while (i <= n - m) {
            int j = m - 1;

            // 從右向左匹配
            while (j >= 0 && pattern[j] == text[i + j]) {
                j--;
            }

            if (j < 0) {
                // 完全匹配
                result.push_back(i);
                i += (i + m < n) ? m - badChar[text[i + m]] : 1;
            } else {
                // 不匹配,使用壞字元規則
                int shift = j - badChar[text[i + j]];
                i += max(1, shift);
            }
        }

        return result;
    }
};

// 時間複雜度:
// - 最好: O(n/m) (大字母表,長 pattern)
// - 平均: O(n)
// - 最壞: O(nm) (小字母表)
```

## 視覺化匹配過程

```
text:    "GCTTCTGCTACCTTTTGCGCGCGCGCGGAA"
pattern: "GCGCG"

步驟 1:
  GCTTCTGCTACCTTTTGCGCGCGCGCGGAA
  GCGCG
      ↑ 不匹配 (T vs G)
  badChar['T'] = -1
  shift = 4 - (-1) = 5

步驟 2:
  GCTTCTGCTACCTTTTGCGCGCGCGCGGAA
       GCGCG
         ↑ 不匹配
  shift = ...

...繼續直到找到匹配
```

## 與其他算法的比較

### Boyer-Moore vs KMP

| 特性 | Boyer-Moore | KMP |
|------|------------|-----|
| 掃描方向 | 右到左 | 左到右 |
| 最好情況 | O(n/m) | O(n) |
| 最壞情況 | O(nm) | O(n) |
| 適合場景 | 大字母表,長 pattern | 小字母表,短 pattern |
| 實務表現 | 優秀 | 良好 |

### 適用場景

**Boyer-Moore 更好:**
- 大字母表 (英文文本)
- 長模式串
- 自然語言文本搜尋

**KMP 更好:**
- 小字母表 (DNA 序列: ACGT)
- 短模式串
- 需要保證最壞情況性能

## 實際應用

### 1. 文本編輯器的搜尋功能

```
大多數文本編輯器 (Vim, Emacs, VSCode) 使用 Boyer-Moore 變體
原因:
- 自然語言文本 (大字母表)
- 用戶搜尋通常是較長的單詞或短語
- 實際表現優於 KMP
```

### 2. grep 命令

```
GNU grep 使用 Boyer-Moore 作為核心算法之一
配合其他優化技術:
- 預過濾
- 並行處理
- SIMD 指令
```

### 3. 字串庫函數

```cpp
// 某些標準庫的 string::find() 實現
// 在特定條件下使用 Boyer-Moore
```

## LeetCode 題目 (概念應用)

### [28. Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

使用簡化版 Boyer-Moore:

```cpp
class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;

        int n = haystack.length(), m = needle.length();
        if (m > n) return -1;

        // 構建壞字元表
        vector<int> badChar(256, -1);
        for (int i = 0; i < m; i++) {
            badChar[needle[i]] = i;
        }

        int i = 0;
        while (i <= n - m) {
            int j = m - 1;

            while (j >= 0 && needle[j] == haystack[i + j]) {
                j--;
            }

            if (j < 0) {
                return i;  // 找到第一個匹配
            }

            int shift = j - badChar[haystack[i + j]];
            i += max(1, shift);
        }

        return -1;
    }
};

// 實務中,對於 LeetCode 題目,KMP 或內建函數通常更簡單
```

## 常見陷阱與技巧

### 1. 跳躍距離可能為負

```cpp
// 錯誤
int shift = j - badChar[text[i + j]];
i += shift;  // shift 可能 <= 0!

// 正確
i += max(1, shift);
```

### 2. 字元集大小

```cpp
// 對於 ASCII
vector<int> badChar(256, -1);

// 對於小寫字母
vector<int> badChar(26, -1);
// 使用 s[i] - 'a' 作為索引
```

### 3. 完整實現的複雜性

```cpp
// 完整的 Boyer-Moore (含好後綴規則) 實現複雜
// 實務中:
// - 簡單場景: 使用 KMP 或內建函數
// - 高性能需求: 使用現成庫 (如 Boost)
```

## 複雜度總結

| 情況 | 時間複雜度 | 說明 |
|------|-----------|------|
| 最好情況 | O(n/m) | 每次跳躍 m 個字元 |
| 平均情況 | O(n) | 隨機文本 |
| 最壞情況 | O(nm) | 小字母表,重複字元 |
| 預處理 | O(m + σ) | σ = 字母表大小 |

## 實務建議

### 何時使用 Boyer-Moore

1. **自然語言文本搜尋**
2. **長模式串 (> 10 字元)**
3. **性能優先場景**

### 何時使用其他算法

1. **小字母表:** 使用 KMP
2. **短模式串:** 使用樸素算法或內建函數
3. **多模式匹配:** 使用 Rabin-Karp 或 AC 自動機
4. **保證性能:** 使用 KMP

## 進階主題 (概念)

### Horspool 算法

Boyer-Moore 的簡化版本,只使用壞字元規則,但看文本中對應的字元:

```
更簡單,實務中性能接近完整 Boyer-Moore
```

### Sunday 算法

進一步簡化,看窗口後一個字元:

```
text:    ABCDEFGH
pattern: DEF
            ↑
       看 G (窗口後一個)
```

## 練習建議

1. **理解核心思想:** 從右向左匹配的優勢
2. **實現簡化版:** 只使用壞字元規則
3. **性能對比:** 與 KMP 在不同場景下對比
4. **實際應用:** 理解文本編輯器的搜尋實現

## 延伸閱讀

- 下一章: **Z-function** - 另一種線性匹配算法
- 相關主題: **KMP**, **Rabin-Karp**
- 進階主題: **Aho-Corasick** (多模式匹配)
- 實務參考: **GNU grep 源碼**
