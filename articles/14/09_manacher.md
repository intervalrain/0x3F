---
title: 14-9. Manacher (*)
order: 9
description: Manacher 算法 - O(n) 求最長回文子串
tags:
  - manacher
  - palindrome
  - advanced
author: Rain Hu
date: '2025-10-30'
draft: false
subscription: member
---

# 9. Manacher

Manacher 算法是解決最長回文子串問題的最優算法,時間複雜度為 O(n)。它通過巧妙地利用回文的對稱性,避免了中心擴展法的重複計算。

> **標註 (*):** 本章為進階主題,Manacher 算法思想精妙,適合深入學習。

## 問題回顧

**最長回文子串問題:**
- 輸入: 字串 s
- 輸出: s 中最長的回文子串

**之前的方法:**
- 暴力: O(n³)
- 中心擴展: O(n²)
- 動態規劃: O(n²)
- Manacher: **O(n)** ← 本章主題

## Manacher 算法原理

### 預處理: 統一奇偶長度

插入特殊字元 `#`,將所有回文統一為奇數長度:

```
原字串:  a b a
插入#:   # a # b # a #

原字串:  a b b a
插入#:   # a # b # b # a #

現在所有回文中心都是單個字元!
```

**實現:**

```cpp
string preprocess(string s) {
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }
    return t;
}

// "aba" -> "#a#b#a#"
// "abba" -> "#a#b#b#a#"
```

### 核心概念

#### 1. p[i] 陣列

`p[i]` = 以 i 為中心的最長回文半徑

```
t = "#a#b#a#"
     0123456

i=0: # (p[0]=1)
i=1: #a# (p[1]=2)
i=2: a#b (p[2]=1)
i=3: #a#b#a# (p[3]=4, 最長!)
i=4: b#a (p[4]=1)
i=5: #a# (p[5]=2)
i=6: # (p[6]=1)

p = [1, 2, 1, 4, 1, 2, 1]
```

#### 2. 最長回文子串的計算

```
p[i] - 1 = 原字串中以對應位置為中心的回文長度

示例:
t = "#a#b#a#"
p[3] = 4

回文在 t 中: t[3-3...3+3] = "#a#b#a#"
回文在原字串: "aba" (長度 = p[3]-1 = 3)
```

### Manacher 核心思想

**利用已知回文的對稱性,避免重複計算。**

維護:
- `center`: 已知回文中,最靠右的回文中心
- `right`: 該回文的右邊界

```
當前處理 i:
- 若 i < right: 利用對稱性, p[i] 至少為 p[mirror]
- 否則: 暴力擴展

mirror = 2 * center - i (i 關於 center 的對稱點)
```

## 完整實現

```cpp
class Manacher {
private:
    string preprocess(string s) {
        string t = "#";
        for (char c : s) {
            t += c;
            t += '#';
        }
        return t;
    }

public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";

        string t = preprocess(s);
        int n = t.length();
        vector<int> p(n, 0);

        int center = 0, right = 0;

        for (int i = 0; i < n; i++) {
            // 利用對稱性
            if (i < right) {
                int mirror = 2 * center - i;
                p[i] = min(right - i, p[mirror]);
            }

            // 嘗試擴展
            while (i - p[i] - 1 >= 0 &&
                   i + p[i] + 1 < n &&
                   t[i - p[i] - 1] == t[i + p[i] + 1]) {
                p[i]++;
            }

            // 更新 center 和 right
            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
        }

        // 找最大 p[i]
        int maxLen = 0, centerIndex = 0;
        for (int i = 0; i < n; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                centerIndex = i;
            }
        }

        // 計算原字串中的起始位置
        int start = (centerIndex - maxLen) / 2;
        return s.substr(start, maxLen);
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

## 視覺化過程

```
s = "babad"
t = "#b#a#b#a#d#"
     0123456789A  (A=10)

i=0: p[0]=0, 擴展到1
     center=0, right=1

i=1: i<right, mirror=-1(無效), p[1]=0
     擴展: #b# -> p[1]=1
     center=1, right=2

i=2: i>=right, p[2]=0
     擴展: b#a -> p[2]=1
     center=2, right=3

i=3: i>=right, p[3]=0
     擴展: #a#b#a# -> p[3]=3
     center=3, right=6

i=4: i<right(4<6), mirror=2, p[2]=1
     p[4]=min(6-4, 1)=1
     嘗試擴展: a#b#a (已是最大)
     不更新

i=5: i<right(5<6), mirror=1, p[1]=1
     p[5]=min(6-5, 1)=1
     擴展: #a#b#a# -> p[5]=3
     center=5, right=8

...

結果: p[3]=3 或 p[5]=3
回文: "bab" 或 "aba"
```

## 對稱性利用詳解

```
已知回文中心 center, 右邊界 right

處理 i (i < right):
    |<------ right - center ------>|
    C                              R
    |<- center-mirror ->|<- i-center ->|
    M                   C              i

因為 [C-r, C+r] 是回文:
- M 和 i 關於 C 對稱
- p[M] 的值可以參考

三種情況:
1. p[M] < right - i: p[i] = p[M]
2. p[M] > right - i: p[i] = right - i
3. p[M] = right - i: 需要擴展
```

## 時間複雜度分析

**關鍵觀察:** right 單調遞增

```
while 循環執行次數:
- 每次 while 執行, p[i] 增加, right 也增加
- right 最多增加 n 次
- 因此 while 總共執行 O(n) 次

總時間: O(n)
```

## 應用擴展

### 1. 統計回文子串數量

```cpp
int countSubstrings(string s) {
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }

    int n = t.length();
    vector<int> p(n, 0);
    int center = 0, right = 0;

    for (int i = 0; i < n; i++) {
        if (i < right) {
            int mirror = 2 * center - i;
            p[i] = min(right - i, p[mirror]);
        }

        while (i - p[i] - 1 >= 0 &&
               i + p[i] + 1 < n &&
               t[i - p[i] - 1] == t[i + p[i] + 1]) {
            p[i]++;
        }

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }

    // 每個 p[i] 貢獻 (p[i]+1)/2 個回文
    int count = 0;
    for (int i = 0; i < n; i++) {
        count += (p[i] + 1) / 2;
    }

    return count;
}

// 原理:
// p[i]=k 表示有 k 個不同長度的回文
// 在原字串中對應 (k+1)/2 個
```

### 2. 最長回文前綴

```cpp
string longestPalindromePrefix(string s) {
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }

    int n = t.length();
    vector<int> p(n, 0);
    int center = 0, right = 0;

    for (int i = 0; i < n; i++) {
        if (i < right) {
            int mirror = 2 * center - i;
            p[i] = min(right - i, p[mirror]);
        }

        while (i - p[i] - 1 >= 0 &&
               i + p[i] + 1 < n &&
               t[i - p[i] - 1] == t[i + p[i] + 1]) {
            p[i]++;
        }

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }

    // 找最長的回文前綴
    int maxLen = 0;
    for (int i = 0; i < n; i++) {
        if (i - p[i] == 0) {  // 從頭開始
            maxLen = max(maxLen, p[i]);
        }
    }

    return s.substr(0, maxLen);
}
```

## LeetCode 題目詳解

### [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";

        // 預處理
        string t = "#";
        for (char c : s) {
            t += c;
            t += '#';
        }

        int n = t.length();
        vector<int> p(n, 0);
        int center = 0, right = 0;

        // Manacher
        for (int i = 0; i < n; i++) {
            if (i < right) {
                int mirror = 2 * center - i;
                p[i] = min(right - i, p[mirror]);
            }

            while (i - p[i] - 1 >= 0 &&
                   i + p[i] + 1 < n &&
                   t[i - p[i] - 1] == t[i + p[i] + 1]) {
                p[i]++;
            }

            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
        }

        // 找最長
        int maxLen = 0, centerIndex = 0;
        for (int i = 0; i < n; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                centerIndex = i;
            }
        }

        int start = (centerIndex - maxLen) / 2;
        return s.substr(start, maxLen);
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

### [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

```cpp
class Solution {
public:
    int countSubstrings(string s) {
        string t = "#";
        for (char c : s) {
            t += c;
            t += '#';
        }

        int n = t.length();
        vector<int> p(n, 0);
        int center = 0, right = 0;

        for (int i = 0; i < n; i++) {
            if (i < right) {
                int mirror = 2 * center - i;
                p[i] = min(right - i, p[mirror]);
            }

            while (i - p[i] - 1 >= 0 &&
                   i + p[i] + 1 < n &&
                   t[i - p[i] - 1] == t[i + p[i] + 1]) {
                p[i]++;
            }

            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
        }

        int count = 0;
        for (int i = 0; i < n; i++) {
            count += (p[i] + 1) / 2;
        }

        return count;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

## 與中心擴展法對比

| 方法 | 時間複雜度 | 空間複雜度 | 難度 |
|------|-----------|-----------|------|
| 中心擴展 | O(n²) | O(1) | 簡單 |
| Manacher | O(n) | O(n) | 困難 |

**何時使用 Manacher:**
- 需要最優時間複雜度
- 處理超長字串
- 競賽中追求極致性能

**何時使用中心擴展:**
- 字串長度適中
- 追求代碼簡潔
- 時間限制寬鬆

## 常見陷阱與技巧

### 1. 預處理的必要性

```cpp
// 錯誤: 不預處理,需分奇偶討論
for (int i = 0; i < n; i++) {
    // 奇數長度
    // 偶數長度
}

// 正確: 預處理後統一處理
string t = preprocess(s);
```

### 2. 索引轉換

```cpp
// t 中的位置 -> 原字串位置
int start = (centerIndex - maxLen) / 2;

// 驗證:
// t = "#a#b#a#", centerIndex=3, maxLen=3
// start = (3-3)/2 = 0 ✓
```

### 3. 邊界檢查

```cpp
// 擴展時檢查邊界
while (i - p[i] - 1 >= 0 &&   // 左邊界
       i + p[i] + 1 < n &&     // 右邊界
       t[i - p[i] - 1] == t[i + p[i] + 1]) {
    p[i]++;
}
```

## 複雜度與優化

### 空間優化

```cpp
// 若只需最長回文長度,不需保存 s.substr()
// 可以只記錄 start 和 maxLen
int start = (centerIndex - maxLen) / 2;
int length = maxLen;

// 需要時再構建
return s.substr(start, length);
```

## 練習建議

1. **理解預處理:** 手工模擬奇偶統一
2. **追蹤對稱性:** 理解 mirror 的計算
3. **模擬過程:** 逐步追蹤 center 和 right
4. **實現模板:** 熟練掌握完整代碼
5. **對比優化:** 與中心擴展法對比性能

## 延伸閱讀

- 相關主題: **回文問題** (第 2 章)
- 下一章: **字串雜湊**
- 進階應用: **回文樹 (Palindrome Tree)**
