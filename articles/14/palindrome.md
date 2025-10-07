---
title: "2. 回文 - Palindrome"
order: 2
description: "回文字串的判定與相關問題"
tags: ["palindrome", "two-pointers", "dp", "expand-around-center"]
---

# 2. 回文 - Palindrome

回文（Palindrome）是指正讀和反讀都相同的字串，如 "aba"、"racecar"。回文問題是字串演算法中的經典問題，涉及多種解法技巧。

## 回文的定義與判定

### 定義

一個字串 s 是回文，當且僅當：
- `s[i] == s[n-1-i]` 對所有 `0 <= i < n/2` 成立

### 基本判定

```cpp
// 方法 1: 雙指針
bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right])
            return false;
        left++;
        right--;
    }
    return true;
}

// 方法 2: 反轉比較
bool isPalindrome(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    return s == rev;
}

// 時間複雜度：O(n)
// 空間複雜度：O(1) / O(n)
```

### 忽略非字母數字字元的回文判定

```cpp
bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;

    while (left < right) {
        // 跳過非字母數字字元
        while (left < right && !isalnum(s[left]))
            left++;
        while (left < right && !isalnum(s[right]))
            right--;

        // 比較（忽略大小寫）
        if (tolower(s[left]) != tolower(s[right]))
            return false;

        left++;
        right--;
    }

    return true;
}

// 示例："A man, a plan, a canal: Panama" -> true
```

## 中心擴展法（Expand Around Center）

最長回文子串的經典解法，時間複雜度 O(n²)。

### 核心思想

- 回文有中心點
- 從每個可能的中心向兩側擴展
- 需考慮奇數和偶數長度

### 實現

```cpp
class Solution {
private:
    // 從中心向兩側擴展
    int expandAroundCenter(string s, int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;    // 回文長度
    }

public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";

        int start = 0, maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            // 奇數長度回文（中心為單個字元）
            int len1 = expandAroundCenter(s, i, i);

            // 偶數長度回文（中心為兩個字元之間）
            int len2 = expandAroundCenter(s, i, i + 1);

            int len = max(len1, len2);

            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }

        return s.substr(start, maxLen);
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(1)
```

### 視覺化過程

```
字串: "babad"

i=0 (b):
  奇數: b (長度1)
  偶數: - (長度0)

i=1 (a):
  奇數: bab (長度3) ✓
  偶數: - (長度0)

i=2 (b):
  奇數: aba (長度3) ✓
  偶數: - (長度0)

i=3 (a):
  奇數: a (長度1)
  偶數: - (長度0)

i=4 (d):
  奇數: d (長度1)
  偶數: - (長度0)

結果: "bab" 或 "aba"
```

### 奇數 vs 偶數長度

```
奇數長度 (中心為字元):
    a b a
      ↑
    中心

偶數長度 (中心為空隙):
    a b b a
      ↑↑
     中心

統一處理：
  奇數: expandAroundCenter(s, i, i)
  偶數: expandAroundCenter(s, i, i+1)
```

## 動態規劃法（DP）

### 狀態定義

`dp[i][j]` = s[i...j] 是否為回文

### 狀態轉移

```cpp
dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]

邊界條件：
- dp[i][i] = true (單個字元)
- dp[i][i+1] = (s[i] == s[i+1]) (兩個字元)
```

### 實現

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.length();
        if (n < 2) return s;

        vector<vector<bool>> dp(n, vector<bool>(n, false));

        int start = 0, maxLen = 1;

        // 初始化：單個字元都是回文
        for (int i = 0; i < n; i++)
            dp[i][i] = true;

        // 按長度遞增填表
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s[i] == s[j]) {
                    if (len == 2) {
                        dp[i][j] = true;
                    } else {
                        dp[i][j] = dp[i + 1][j - 1];
                    }

                    if (dp[i][j] && len > maxLen) {
                        start = i;
                        maxLen = len;
                    }
                }
            }
        }

        return s.substr(start, maxLen);
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n²)
```

### DP 表格填充過程

```
字串: "babad"

DP 表格 (dp[i][j]):
    0 1 2 3 4
  0 T F T F F
  1   T F T F
  2     T F F
  3       T F
  4         T

填充順序（按長度）:
  len=1: 對角線 (全部 true)
  len=2: dp[0][1], dp[1][2], ...
  len=3: dp[0][2], dp[1][3], ...
  ...
```

## Manacher 算法預告

Manacher 算法可以在 **O(n)** 時間內找到最長回文子串，是回文問題的最優解。

### 核心思想（簡介）

1. **預處理：** 插入特殊字元 `#`，統一奇偶長度
2. **利用對稱性：** 避免重複計算
3. **維護右邊界：** 動態更新回文範圍

```
原字串:  a b a
插入#:   # a # b # a #

現在所有回文都是奇數長度！
```

詳細內容見後續章節「9. Manacher 算法」。

## 回文子串應用

### 1. 最長回文子串（Longest Palindromic Substring）

已在上面介紹，三種方法：
- 中心擴展：O(n²) 時間，O(1) 空間
- DP：O(n²) 時間，O(n²) 空間
- Manacher：O(n) 時間，O(n) 空間

### 2. 最長回文子序列（Longest Palindromic Subsequence）

子序列可以不連續，使用 DP 解決。

```cpp
class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.length();
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // 單個字元的最長回文子序列長度為 1
        for (int i = 0; i < n; i++)
            dp[i][i] = 1;

        // 按長度遞增
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s[i] == s[j]) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[0][n - 1];
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n²)
```

**狀態轉移：**
```
s[i] == s[j]:
  dp[i][j] = dp[i+1][j-1] + 2

s[i] != s[j]:
  dp[i][j] = max(dp[i+1][j], dp[i][j-1])
```

**視覺化：**
```
字串: "bbbab"

DP 表格:
    0 1 2 3 4
  0 1 2 3 3 4
  1   1 2 2 3
  2     1 1 3
  3       1 2
  4         1

結果: dp[0][4] = 4 ("bbbb")
```

### 3. 回文分割（Palindrome Partitioning）

將字串分割成若干回文子串。

#### 3.1 分割方案（所有可能）

```cpp
class Solution {
private:
    vector<vector<string>> result;
    vector<string> path;

    bool isPalindrome(string& s, int start, int end) {
        while (start < end) {
            if (s[start] != s[end])
                return false;
            start++;
            end--;
        }
        return true;
    }

    void backtrack(string& s, int start) {
        if (start == s.length()) {
            result.push_back(path);
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1);
                path.pop_back();
            }
        }
    }

public:
    vector<vector<string>> partition(string s) {
        backtrack(s, 0);
        return result;
    }
};

// 時間複雜度：O(n · 2^n) - 最壞情況，每個位置都可以切
// 空間複雜度：O(n) - 遞迴深度
```

**優化：預計算回文表**

```cpp
class Solution {
private:
    vector<vector<string>> result;
    vector<string> path;
    vector<vector<bool>> isPalin;

    void computePalindrome(string& s) {
        int n = s.length();
        isPalin.assign(n, vector<bool>(n, false));

        for (int i = 0; i < n; i++)
            isPalin[i][i] = true;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j]) {
                    isPalin[i][j] = (len == 2) || isPalin[i + 1][j - 1];
                }
            }
        }
    }

    void backtrack(string& s, int start) {
        if (start == s.length()) {
            result.push_back(path);
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalin[start][end]) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1);
                path.pop_back();
            }
        }
    }

public:
    vector<vector<string>> partition(string s) {
        computePalindrome(s);
        backtrack(s, 0);
        return result;
    }
};

// 預處理：O(n²)
// 回溯：O(n · 2^n)
```

#### 3.2 最少分割次數

```cpp
class Solution {
public:
    int minCut(string s) {
        int n = s.length();

        // 預計算回文表
        vector<vector<bool>> isPalin(n, vector<bool>(n, false));
        for (int i = 0; i < n; i++)
            isPalin[i][i] = true;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j]) {
                    isPalin[i][j] = (len == 2) || isPalin[i + 1][j - 1];
                }
            }
        }

        // dp[i] = s[0...i] 的最少分割次數
        vector<int> dp(n, 0);

        for (int i = 0; i < n; i++) {
            if (isPalin[0][i]) {
                dp[i] = 0;          // 整個是回文，不需分割
            } else {
                dp[i] = i;          // 最多分割 i 次

                for (int j = 0; j < i; j++) {
                    if (isPalin[j + 1][i]) {
                        dp[i] = min(dp[i], dp[j] + 1);
                    }
                }
            }
        }

        return dp[n - 1];
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n²)
```

## LeetCode 題目詳解

### [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**題目：** 判斷字串是否為回文（忽略非字母數字，不區分大小寫）。

```cpp
class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            while (left < right && !isalnum(s[left]))
                left++;
            while (left < right && !isalnum(s[right]))
                right--;

            if (tolower(s[left]) != tolower(s[right]))
                return false;

            left++;
            right--;
        }

        return true;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

### [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**題目：** 找到最長回文子串。

**解法 1：中心擴展**

```cpp
class Solution {
private:
    int expandAroundCenter(string& s, int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";

        int start = 0, maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = max(len1, len2);

            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }

        return s.substr(start, maxLen);
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(1)
```

**解法 2：動態規劃**（見上述 DP 部分）

### [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

**題目：** 計算所有回文子串的數量。

**解法 1：中心擴展**

```cpp
class Solution {
private:
    int countPalindrome(string& s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            count++;
            left--;
            right++;
        }
        return count;
    }

public:
    int countSubstrings(string s) {
        int total = 0;

        for (int i = 0; i < s.length(); i++) {
            total += countPalindrome(s, i, i);       // 奇數
            total += countPalindrome(s, i, i + 1);   // 偶數
        }

        return total;
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(1)
```

**解法 2：動態規劃**

```cpp
class Solution {
public:
    int countSubstrings(string s) {
        int n = s.length();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        int count = 0;

        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
            count++;
        }

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s[i] == s[j]) {
                    dp[i][j] = (len == 2) || dp[i + 1][j - 1];
                    if (dp[i][j]) count++;
                }
            }
        }

        return count;
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n²)
```

### [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)

**題目：** 分割字串使每個子串都是回文。

```cpp
class Solution {
private:
    vector<vector<string>> result;
    vector<string> path;
    vector<vector<bool>> isPalin;

    void computePalindrome(string& s) {
        int n = s.length();
        isPalin.assign(n, vector<bool>(n, false));

        for (int i = 0; i < n; i++)
            isPalin[i][i] = true;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j]) {
                    isPalin[i][j] = (len == 2) || isPalin[i + 1][j - 1];
                }
            }
        }
    }

    void backtrack(string& s, int start) {
        if (start == s.length()) {
            result.push_back(path);
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalin[start][end]) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1);
                path.pop_back();
            }
        }
    }

public:
    vector<vector<string>> partition(string s) {
        computePalindrome(s);
        backtrack(s, 0);
        return result;
    }
};

// 時間複雜度：O(n · 2^n)
// 空間複雜度：O(n²)
```

### [516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**題目：** 找到最長回文子序列。

```cpp
class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.length();
        vector<vector<int>> dp(n, vector<int>(n, 0));

        for (int i = 0; i < n; i++)
            dp[i][i] = 1;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s[i] == s[j]) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[0][n - 1];
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n²)
```

**空間優化（滾動陣列）：**

```cpp
class Solution {
public:
    int longestPalindromeSubseq(string s) {
        int n = s.length();
        vector<int> dp(n, 1);
        vector<int> prev(n, 0);

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                int temp = dp[i];

                if (s[i] == s[j]) {
                    dp[i] = prev[i + 1] + 2;
                } else {
                    dp[i] = max(dp[i + 1], prev[i]);
                }

                prev[i] = temp;
            }
        }

        return dp[0];
    }
};

// 時間複雜度：O(n²)
// 空間複雜度：O(n)
```

## 常見陷阱與技巧

### 1. 中心擴展的邊界處理

```cpp
// 錯誤：忘記處理偶數長度
for (int i = 0; i < n; i++) {
    int len = expandAroundCenter(s, i, i);  // 只考慮奇數
}

// 正確：同時考慮奇數和偶數
for (int i = 0; i < n; i++) {
    int len1 = expandAroundCenter(s, i, i);
    int len2 = expandAroundCenter(s, i, i + 1);
    int len = max(len1, len2);
}
```

### 2. DP 的填表順序

```cpp
// 錯誤：按 i, j 順序填（依賴關係錯誤）
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // dp[i][j] 依賴 dp[i+1][j-1]，但可能還未計算！
    }
}

// 正確：按長度遞增填（保證依賴已計算）
for (int len = 2; len <= n; len++) {
    for (int i = 0; i <= n - len; i++) {
        int j = i + len - 1;
        // dp[i+1][j-1] 長度為 len-2，已經計算過
    }
}
```

### 3. 子串 vs 子序列

```cpp
// 子串（連續）
"abcde" 的子串: "abc", "bcd", "cde", ...

// 子序列（可不連續）
"abcde" 的子序列: "ace", "bd", "abde", ...

// 回文子串：必須連續
// 回文子序列：可以不連續
```

### 4. 字串索引計算

```cpp
// 中心擴展後計算起始位置
int len = right - left - 1;         // 回文長度
int start = left + 1;               // 起始索引

// 或從中心計算
int start = i - (len - 1) / 2;

// 示例：
// i=2, len=5 (例如 "abcba")
// start = 2 - (5-1)/2 = 2 - 2 = 0 ✓
```

## 複雜度總結

| 問題 | 方法 | 時間複雜度 | 空間複雜度 |
|------|------|-----------|-----------|
| 最長回文子串 | 中心擴展 | O(n²) | O(1) |
| 最長回文子串 | DP | O(n²) | O(n²) |
| 最長回文子串 | Manacher | O(n) | O(n) |
| 回文子串計數 | 中心擴展 | O(n²) | O(1) |
| 回文子串計數 | DP | O(n²) | O(n²) |
| 最長回文子序列 | DP | O(n²) | O(n²) 或 O(n) |
| 回文分割（方案） | 回溯+預處理 | O(n·2^n) | O(n²) |
| 回文分割（最少） | DP | O(n²) | O(n²) |

## 練習建議

1. **基礎判定：** 先掌握雙指針判定回文
2. **中心擴展：** 理解奇偶長度的統一處理
3. **動態規劃：** 注意填表順序和依賴關係
4. **回溯應用：** 結合預處理優化回溯
5. **進階優化：** 學習 Manacher 算法（後續章節）

## 延伸閱讀

- 下一章：**後綴樹/陣列** - 高級字串結構
- 相關主題：**動態規劃**、**回溯**
- 進階主題：**Manacher 算法**（第 9 章）
