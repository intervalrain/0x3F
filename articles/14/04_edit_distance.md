---
title: "4. Approximate String Matching"
order: 4
description: "編輯距離與近似字串匹配"
tags: ["edit-distance", "dp", "levenshtein"]
---

# 4. Approximate String Matching

編輯距離（Edit Distance）是衡量兩個字串相似度的重要指標，廣泛應用於拼寫檢查、DNA 序列比對、模糊搜尋等領域。

## 編輯距離（Edit Distance / Levenshtein Distance）

### 定義

**編輯距離**是將一個字串轉換為另一個字串所需的最少單字元編輯操作次數。

### 三種操作

1. **插入（Insert）：** 插入一個字元
2. **刪除（Delete）：** 刪除一個字元
3. **替換（Replace）：** 替換一個字元

### 示例

```
s1 = "horse"
s2 = "ros"

操作序列:
horse → rorse (替換 h → r)
rorse → rose  (刪除 r)
rose  → ros   (刪除 e)

編輯距離 = 3
```

## 動態規劃解法

### 狀態定義

`dp[i][j]` = s1[0...i-1] 和 s2[0...j-1] 的編輯距離

### 狀態轉移

```cpp
if (s1[i-1] == s2[j-1]):
    dp[i][j] = dp[i-1][j-1]              // 字元相同，不需操作

else:
    dp[i][j] = 1 + min(
        dp[i-1][j],      // 刪除 s1[i-1]
        dp[i][j-1],      // 插入 s2[j-1]
        dp[i-1][j-1]     // 替換 s1[i-1] → s2[j-1]
    )
```

### 邊界條件

```cpp
dp[0][j] = j    // s1 為空，需插入 j 個字元
dp[i][0] = i    // s2 為空，需刪除 i 個字元
```

### 完整實現

```cpp
class Solution {
public:
    int minDistance(string s1, string s2) {
        int m = s1.length(), n = s2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        // 初始化邊界
        for (int i = 0; i <= m; i++)
            dp[i][0] = i;
        for (int j = 0; j <= n; j++)
            dp[0][j] = j;

        // 填表
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + min({
                        dp[i - 1][j],      // 刪除
                        dp[i][j - 1],      // 插入
                        dp[i - 1][j - 1]   // 替換
                    });
                }
            }
        }

        return dp[m][n];
    }
};

// 時間複雜度：O(mn)
// 空間複雜度：O(mn)
```

### 視覺化過程

```
s1 = "horse", s2 = "ros"

DP 表格:
       ""  r  o  s
    "" 0   1  2  3
    h  1   1  2  3
    o  2   2  1  2
    r  3   2  2  2
    s  4   3  3  2
    e  5   4  4  3

填充過程 (i=1, j=1):
  s1[0]='h', s2[0]='r' (不同)
  dp[1][1] = 1 + min(
      dp[0][1] = 1,  // 刪除 h
      dp[1][0] = 1,  // 插入 r
      dp[0][0] = 0   // 替換 h→r
  ) = 1

最終結果: dp[5][3] = 3
```

### 操作解釋

```cpp
dp[i-1][j] + 1:     // 刪除 s1[i-1]
    s1[0...i-1] → s2[0...j-1]
    需要先將 s1[0...i-2] → s2[0...j-1]（dp[i-1][j]）
    然後刪除 s1[i-1]（+1）

dp[i][j-1] + 1:     // 插入 s2[j-1]
    s1[0...i-1] → s2[0...j-1]
    需要先將 s1[0...i-1] → s2[0...j-2]（dp[i][j-1]）
    然後插入 s2[j-1]（+1）

dp[i-1][j-1] + 1:   // 替換 s1[i-1] → s2[j-1]
    s1[0...i-1] → s2[0...j-1]
    需要先將 s1[0...i-2] → s2[0...j-2]（dp[i-1][j-1]）
    然後替換 s1[i-1]（+1）
```

## 空間優化

### 滾動陣列

只需保留兩行：

```cpp
int minDistance(string s1, string s2) {
    int m = s1.length(), n = s2.length();
    vector<int> prev(n + 1), curr(n + 1);

    // 初始化第一行
    for (int j = 0; j <= n; j++)
        prev[j] = j;

    for (int i = 1; i <= m; i++) {
        curr[0] = i;  // 第一列

        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + min({
                    prev[j],      // 刪除
                    curr[j - 1],  // 插入
                    prev[j - 1]   // 替換
                });
            }
        }

        swap(prev, curr);
    }

    return prev[n];
}

// 時間複雜度：O(mn)
// 空間複雜度：O(min(m, n))
```

### 進一步優化（一維陣列）

```cpp
int minDistance(string s1, string s2) {
    // 確保 s2 是較短的字串（優化空間）
    if (s1.length() < s2.length())
        swap(s1, s2);

    int m = s1.length(), n = s2.length();
    vector<int> dp(n + 1);

    // 初始化
    for (int j = 0; j <= n; j++)
        dp[j] = j;

    for (int i = 1; i <= m; i++) {
        int prev = dp[0];  // 保存 dp[i-1][j-1]
        dp[0] = i;

        for (int j = 1; j <= n; j++) {
            int temp = dp[j];  // 保存 dp[i-1][j]

            if (s1[i - 1] == s2[j - 1]) {
                dp[j] = prev;
            } else {
                dp[j] = 1 + min({
                    dp[j],      // 刪除（原 dp[i-1][j]）
                    dp[j - 1],  // 插入（dp[i][j-1]）
                    prev        // 替換（原 dp[i-1][j-1]）
                });
            }

            prev = temp;
        }
    }

    return dp[n];
}

// 時間複雜度：O(mn)
// 空間複雜度：O(min(m, n))
```

## 相似度變形

### 1. 只允許刪除

**問題：** 只能刪除字元，求最少操作次數。

```cpp
class Solution {
public:
    int minDeleteOperations(string s1, string s2) {
        int m = s1.length(), n = s2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        // 邊界
        for (int i = 0; i <= m; i++)
            dp[i][0] = i;  // 刪除所有字元
        for (int j = 1; j <= n; j++)
            dp[0][j] = INT_MAX / 2;  // 無法通過刪除得到

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = dp[i - 1][j] + 1;  // 只能刪除 s1[i-1]
                }
            }
        }

        return dp[m][n];
    }
};
```

### 2. 刪除使兩字串相同

**問題：** 可以刪除兩個字串的字元，求最少刪除次數。

```cpp
class Solution {
public:
    int minDistance(string s1, string s2) {
        int m = s1.length(), n = s2.length();

        // 找最長公共子序列（LCS）
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        int lcs = dp[m][n];
        return (m - lcs) + (n - lcs);
    }
};

// LCS = 最長公共子序列
// 刪除次數 = (m - LCS) + (n - LCS)
```

### 3. 不同權重的操作

```cpp
// 插入代價 = 1
// 刪除代價 = 2
// 替換代價 = 3

int minDistanceWeighted(string s1, string s2) {
    int m = s1.length(), n = s2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 0; i <= m; i++)
        dp[i][0] = i * 2;  // 刪除代價
    for (int j = 0; j <= n; j++)
        dp[0][j] = j * 1;  // 插入代價

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = min({
                    dp[i - 1][j] + 2,      // 刪除
                    dp[i][j - 1] + 1,      // 插入
                    dp[i - 1][j - 1] + 3   // 替換
                });
            }
        }
    }

    return dp[m][n];
}
```

## 序列比對（Sequence Alignment）

編輯距離的擴展，常用於生物信息學。

### Needleman-Wunsch 算法

```cpp
// 相似度評分矩陣
int match = 1;       // 匹配得分
int mismatch = -1;   // 不匹配得分
int gap = -2;        // 空位罰分

int sequenceAlignment(string s1, string s2) {
    int m = s1.length(), n = s2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    // 初始化（空位罰分）
    for (int i = 0; i <= m; i++)
        dp[i][0] = i * gap;
    for (int j = 0; j <= n; j++)
        dp[0][j] = j * gap;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int score = (s1[i - 1] == s2[j - 1]) ? match : mismatch;

            dp[i][j] = max({
                dp[i - 1][j - 1] + score,  // 匹配/不匹配
                dp[i - 1][j] + gap,        // s1 插入空位
                dp[i][j - 1] + gap         // s2 插入空位
            });
        }
    }

    return dp[m][n];  // 最大相似度得分
}
```

## 應用場景

### 1. 拼寫檢查

找到字典中與輸入最相似的單詞：

```cpp
string spellCheck(string input, vector<string>& dictionary) {
    string bestMatch = "";
    int minDist = INT_MAX;

    for (string& word : dictionary) {
        int dist = editDistance(input, word);
        if (dist < minDist) {
            minDist = dist;
            bestMatch = word;
        }
    }

    return bestMatch;
}
```

### 2. DNA 序列比對

```cpp
// DNA 序列：A, C, G, T
string dna1 = "ACGTACGT";
string dna2 = "ACGTAGCT";

// 使用序列比對算法
int similarity = sequenceAlignment(dna1, dna2);
```

### 3. 模糊搜尋

```cpp
// 找到編輯距離 <= k 的所有字串
vector<string> fuzzySearch(string query, vector<string>& corpus, int k) {
    vector<string> result;

    for (string& text : corpus) {
        if (editDistance(query, text) <= k) {
            result.push_back(text);
        }
    }

    return result;
}
```

## LeetCode 題目詳解

### [72. Edit Distance](https://leetcode.com/problems/edit-distance/)

**題目：** 計算編輯距離。

```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 0; i <= m; i++)
            dp[i][0] = i;
        for (int j = 0; j <= n; j++)
            dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + min({
                        dp[i - 1][j],
                        dp[i][j - 1],
                        dp[i - 1][j - 1]
                    });
                }
            }
        }

        return dp[m][n];
    }
};

// 時間複雜度：O(mn)
// 空間複雜度：O(mn)
```

### [583. Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)

**題目：** 刪除兩個字串的字元使其相同，求最少刪除次數。

```cpp
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();

        // 找 LCS
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        int lcs = dp[m][n];
        return m + n - 2 * lcs;
    }
};

// 時間複雜度：O(mn)
// 空間複雜度：O(mn)
```

### [712. Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**題目：** 刪除字元使兩字串相同，最小化刪除字元的 ASCII 和。

```cpp
class Solution {
public:
    int minimumDeleteSum(string s1, string s2) {
        int m = s1.length(), n = s2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        // 初始化：累積 ASCII 和
        for (int i = 1; i <= m; i++)
            dp[i][0] = dp[i - 1][0] + s1[i - 1];
        for (int j = 1; j <= n; j++)
            dp[0][j] = dp[0][j - 1] + s2[j - 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min(
                        dp[i - 1][j] + s1[i - 1],  // 刪除 s1[i-1]
                        dp[i][j - 1] + s2[j - 1]   // 刪除 s2[j-1]
                    );
                }
            }
        }

        return dp[m][n];
    }
};

// 時間複雜度：O(mn)
// 空間複雜度：O(mn)
```

### [161. One Edit Distance](https://leetcode.com/problems/one-edit-distance/)

**題目：** 判斷兩字串是否恰好差一次編輯。

```cpp
class Solution {
public:
    bool isOneEditDistance(string s, string t) {
        int m = s.length(), n = t.length();

        // 長度差超過 1，不可能
        if (abs(m - n) > 1)
            return false;

        // 確保 s 是較短的
        if (m > n)
            return isOneEditDistance(t, s);

        for (int i = 0; i < m; i++) {
            if (s[i] != t[i]) {
                if (m == n) {
                    // 替換：後續必須完全相同
                    return s.substr(i + 1) == t.substr(i + 1);
                } else {
                    // 插入：s[i...] == t[i+1...]
                    return s.substr(i) == t.substr(i + 1);
                }
            }
        }

        // 所有字元相同，只有長度差 1 才符合
        return m + 1 == n;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(n)（substr）
```

**優化版本（不使用 substr）：**

```cpp
class Solution {
public:
    bool isOneEditDistance(string s, string t) {
        int m = s.length(), n = t.length();

        if (abs(m - n) > 1)
            return false;

        if (m > n)
            return isOneEditDistance(t, s);

        for (int i = 0; i < m; i++) {
            if (s[i] != t[i]) {
                if (m == n) {
                    // 替換
                    for (int j = i + 1; j < m; j++) {
                        if (s[j] != t[j])
                            return false;
                    }
                    return true;
                } else {
                    // 插入
                    for (int j = i; j < m; j++) {
                        if (s[j] != t[j + 1])
                            return false;
                    }
                    return true;
                }
            }
        }

        return m + 1 == n;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

## 常見陷阱與技巧

### 1. 邊界條件

```cpp
// 錯誤：忘記初始化邊界
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        // dp[i][0] 和 dp[0][j] 未初始化！
    }
}

// 正確：初始化邊界
for (int i = 0; i <= m; i++)
    dp[i][0] = i;
for (int j = 0; j <= n; j++)
    dp[0][j] = j;
```

### 2. 索引偏移

```cpp
// 注意 dp[i][j] 對應 s1[i-1] 和 s2[j-1]
if (s1[i - 1] == s2[j - 1]) {  // 不是 s1[i] == s2[j]
    dp[i][j] = dp[i - 1][j - 1];
}
```

### 3. 空間優化時的變數保存

```cpp
// 使用滾動陣列時，需要臨時變數保存 dp[i-1][j-1]
int prev = dp[0];
for (int j = 1; j <= n; j++) {
    int temp = dp[j];  // 保存 dp[i-1][j]
    // ... 更新 dp[j] ...
    prev = temp;       // 下一輪的 dp[i-1][j-1]
}
```

### 4. 與 LCS 的關係

```cpp
// 編輯距離（只能刪除）= m + n - 2 * LCS
int editDistance_delete_only = m + n - 2 * lcs(s1, s2);

// 編輯距離（三種操作）!= 與 LCS 的簡單關係
```

## 複雜度總結

| 問題 | 時間複雜度 | 空間複雜度 | 備註 |
|------|-----------|-----------|------|
| 編輯距離（標準） | O(mn) | O(mn) | 基本 DP |
| 編輯距離（優化） | O(mn) | O(min(m,n)) | 滾動陣列 |
| 只能刪除 | O(mn) | O(mn) | 類似 LCS |
| 序列比對 | O(mn) | O(mn) | Needleman-Wunsch |
| 恰好一次編輯 | O(n) | O(1) | 不需 DP |

## 實務應用

### 自動補全與拼寫檢查

```cpp
// Google 搜尋、IDE 自動補全
// 找到編輯距離最小的候選詞

vector<string> suggestions(string input, vector<string>& dict, int k) {
    vector<pair<int, string>> candidates;

    for (string& word : dict) {
        int dist = editDistance(input, word);
        candidates.push_back({dist, word});
    }

    sort(candidates.begin(), candidates.end());

    vector<string> result;
    for (int i = 0; i < min(k, (int)candidates.size()); i++) {
        result.push_back(candidates[i].second);
    }

    return result;
}
```

## 練習建議

1. **理解 DP 狀態：** 先理解 dp[i][j] 的含義
2. **手工模擬：** 在小例子上填 DP 表格
3. **掌握變形：** 練習不同的變形問題
4. **空間優化：** 熟練掌握滾動陣列
5. **實際應用：** 實現拼寫檢查等應用

## 延伸閱讀

- 下一章：**KMP 算法** - 精確字串匹配
- 相關主題：**動態規劃**、**最長公共子序列**
- 進階主題：**Damerau-Levenshtein 距離**（允許交換相鄰字元）
