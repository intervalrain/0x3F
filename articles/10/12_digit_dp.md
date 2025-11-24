---
title: 10-12. 數位 DP / Digit DP
order: 12
description: 使用數位動態規劃處理大範圍數字統計問題
tags:
  - 動態規劃
  - 數位 DP
  - Digit DP
  - 記憶化搜索
author: Rain Hu
date: '2025-11-23'
draft: false
---

# 數位 DP / Digit DP

數位 DP (Digit Dynamic Programming) 是一種專門用來解決**大範圍數字統計問題**的動態規劃技術。當數字範圍非常大（如 10^18）但需要統計符合某種「數位性質」的數字個數時，Digit DP 是最有效的方法。

## 核心概念

### 什麼時候使用 Digit DP？

1. **數字範圍非常大**：n 可能到 10^18，無法暴力枚舉
2. **統計 [0, n] 或 [L, R] 範圍內符合某種性質的數字個數**
3. **性質與每個數位 (digit) 相關**，例如：
   - 數位總和 ≤ K
   - 不能有連續相同的數位
   - 不能包含某個特定數位
   - 數位必須遞增/遞減
   - 某個數位出現的次數
   - 不能包含特定 pattern

### Digit DP 的核心思想

**逐位構造數字**：從最高位到最低位，依次決定每一位的數字。

**關鍵概念：tight (緊貼上界)**
- 當前面的位都「貼著」上界時，當前位最多只能選到上界的對應位
- 一旦某一位選了比上界小的數，後面的位就可以任意選 0~9

**範例說明：** 統計 [0, 234] 中的數字

```
上界: 234

構造第一位 (百位):
- 選 0, 1: 後面可以任意選 (loose)
- 選 2: 後面必須繼續受限 (tight)

假設選了 2，構造第二位 (十位):
- 選 0, 1, 2: 後面可以任意選
- 選 3: 後面必須繼續受限

假設選了 23，構造第三位 (個位):
- 只能選 0, 1, 2, 3, 4
```

### 標準狀態定義

```cpp
dp[pos][tight][leading_zero][state...]
```

| 參數 | 說明 |
|------|------|
| `pos` | 當前處理第幾位（從高位到低位，0-indexed） |
| `tight` | 是否緊貼上界：1 表示前面的位都選了上界的對應位 |
| `leading_zero` | 是否處於前導零狀態：1 表示前面都是 0（數字還沒「開始」） |
| `state...` | 問題相關的額外狀態（如前一位數字、數位和等） |

---

## 基礎模板

### 記憶化搜索版本

```cpp
class Solution {
private:
    string s;  // 上界的字串表示
    int memo[20][2][...];  // 記憶化陣列

    // pos: 當前位置
    // tight: 是否緊貼上界
    // state: 問題相關狀態
    int dfs(int pos, bool tight, int state) {
        // 遞迴終止：已處理完所有位
        if (pos == s.size()) {
            return /* 判斷當前數字是否合法 */;
        }

        // 記憶化查詢（只有非 tight 狀態才能記憶化）
        if (!tight && memo[pos][state] != -1) {
            return memo[pos][state];
        }

        // 當前位的上界
        int limit = tight ? (s[pos] - '0') : 9;
        int res = 0;

        // 枚舉當前位的所有可能
        for (int d = 0; d <= limit; d++) {
            int newState = /* 根據 d 更新狀態 */;
            res += dfs(pos + 1, tight && (d == limit), newState);
        }

        // 記憶化儲存
        if (!tight) {
            memo[pos][state] = res;
        }
        return res;
    }

public:
    int countNumbers(int n) {
        s = to_string(n);
        memset(memo, -1, sizeof(memo));
        return dfs(0, true, /* 初始狀態 */);
    }
};
```

### 區間查詢技巧

對於 [L, R] 區間查詢，使用**前綴和**思想：

```cpp
int countInRange(int L, int R) {
    return count(R) - count(L - 1);
}
```

注意 L = 0 的特殊情況需要額外處理。

---

## 經典問題 1：數位和不超過 K 的數字個數

### 問題描述

統計 [1, n] 中有多少個數字，其數位和不超過 K。

**範例：**
```
n = 20, K = 5
答案: 14 (1,2,3,4,5,10,11,12,13,14,20 等數位和 ≤ 5 的數)
```

### 問題分析

**狀態定義：**
- `dp[pos][sum][tight]`: 處理到第 pos 位，數位和為 sum，是否緊貼上界

**轉移：**
從當前位選 0~limit，累加數位和

### 解法實現

```cpp
class Solution {
private:
    string s;
    int K;
    int memo[20][200];  // pos, sum

    int dfs(int pos, int sum, bool tight) {
        // 數位和已超過 K，剪枝
        if (sum > K) return 0;

        // 遞迴終止
        if (pos == s.size()) {
            return 1;  // 數位和 ≤ K
        }

        // 記憶化
        if (!tight && memo[pos][sum] != -1) {
            return memo[pos][sum];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        int res = 0;

        for (int d = 0; d <= limit; d++) {
            res += dfs(pos + 1, sum + d, tight && (d == limit));
        }

        if (!tight) {
            memo[pos][sum] = res;
        }
        return res;
    }

public:
    int countDigitSum(int n, int k) {
        K = k;
        s = to_string(n);
        memset(memo, -1, sizeof(memo));
        return dfs(0, 0, true);
    }
};
```

**時間複雜度：** O(L × S × 10)，其中 L 是位數，S 是最大數位和
**空間複雜度：** O(L × S)

---

## 經典問題 2：統計數字 1 的出現次數

[LeetCode 233. Number of Digit One](https://leetcode.com/problems/number-of-digit-one/)

### 問題描述

給定一個整數 n，計算所有小於等於 n 的非負整數中數字 1 出現的個數。

**範例：**
```
輸入: n = 13
輸出: 6
解釋: 1, 10, 11, 12, 13 中，1 出現了 6 次
(1 有 1 個 1，10 有 1 個 1，11 有 2 個 1，12 有 1 個 1，13 有 1 個 1)
```

### 問題分析

這題需要統計「1 的總出現次數」，而不是「含有 1 的數字個數」。

**狀態定義：**
- `dp[pos][count][tight]`: 處理到第 pos 位，已經有 count 個 1，是否緊貼上界
- 返回值：(數字個數, 1 的總次數)

### 解法實現

```cpp
class Solution {
private:
    string s;
    // memo[pos][tight] = {count, ones}
    pair<long long, long long> memo[20][2];
    bool visited[20][2];

    // 返回 {符合條件的數字個數, 1 的總出現次數}
    pair<long long, long long> dfs(int pos, bool tight) {
        if (pos == s.size()) {
            return {1, 0};
        }

        if (!tight && visited[pos][0]) {
            return memo[pos][0];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        long long cnt = 0, ones = 0;

        for (int d = 0; d <= limit; d++) {
            auto [c, o] = dfs(pos + 1, tight && (d == limit));
            cnt += c;
            ones += o;
            if (d == 1) {
                ones += c;  // 當前位選 1，貢獻 c 個 1
            }
        }

        if (!tight) {
            memo[pos][0] = {cnt, ones};
            visited[pos][0] = true;
        }
        return {cnt, ones};
    }

public:
    int countDigitOne(int n) {
        if (n <= 0) return 0;
        s = to_string(n);
        memset(visited, false, sizeof(visited));
        return dfs(0, true).second;
    }
};
```

### 數學解法（更高效）

```cpp
class Solution {
public:
    int countDigitOne(int n) {
        if (n <= 0) return 0;

        long long count = 0;
        long long factor = 1;

        while (factor <= n) {
            long long lower = n - (n / factor) * factor;
            long long curr = (n / factor) % 10;
            long long higher = n / (factor * 10);

            if (curr == 0) {
                count += higher * factor;
            } else if (curr == 1) {
                count += higher * factor + lower + 1;
            } else {
                count += (higher + 1) * factor;
            }

            factor *= 10;
        }

        return count;
    }
};
```

**時間複雜度：** O(log n)
**空間複雜度：** O(1)

---

## 經典問題 3：不含連續 1 的非負整數

[LeetCode 600. Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/)

### 問題描述

給定一個正整數 n，返回範圍 [0, n] 內其二進制表示不包含連續 1 的整數個數。

**範例：**
```
輸入: n = 5
輸出: 5
解釋:
0 = 0b0
1 = 0b1
2 = 0b10
3 = 0b11 (有連續1，不算)
4 = 0b100
5 = 0b101
答案是 5
```

### 問題分析

這是在**二進制**上做 Digit DP。

**狀態定義：**
- `dp[pos][prev][tight]`: 處理到第 pos 位，前一位是 prev，是否緊貼上界

**合法條件：**
- 如果前一位是 1，當前位不能是 1

### 解法實現

```cpp
class Solution {
private:
    string bits;
    int memo[32][2];  // [pos][prev]

    int dfs(int pos, int prev, bool tight) {
        if (pos == bits.size()) {
            return 1;
        }

        if (!tight && memo[pos][prev] != -1) {
            return memo[pos][prev];
        }

        int limit = tight ? (bits[pos] - '0') : 1;
        int res = 0;

        for (int d = 0; d <= limit; d++) {
            // 如果前一位是 1 且當前也是 1，跳過
            if (prev == 1 && d == 1) continue;
            res += dfs(pos + 1, d, tight && (d == limit));
        }

        if (!tight) {
            memo[pos][prev] = res;
        }
        return res;
    }

public:
    int findIntegers(int n) {
        // 轉換為二進制字串
        bits = "";
        for (int x = n; x > 0; x >>= 1) {
            bits = char('0' + (x & 1)) + bits;
        }
        if (bits.empty()) bits = "0";

        memset(memo, -1, sizeof(memo));
        return dfs(0, 0, true);
    }
};
```

**時間複雜度：** O(log n)
**空間複雜度：** O(log n)

---

## 經典問題 4：統計特殊整數

[LeetCode 2376. Count Special Integers](https://leetcode.com/problems/count-special-integers/)

### 問題描述

如果一個正整數的所有數位都是**互不相同**的，我們稱它是「特殊整數」。給定正整數 n，返回 [1, n] 之間特殊整數的數目。

**範例：**
```
輸入: n = 20
輸出: 19
解釋: 除了 11 之外，1~20 的所有整數都是特殊整數
```

### 問題分析

需要記錄**已經使用過的數位**，用 bitmask 表示。

**狀態定義：**
- `dp[pos][mask][tight][started]`
- `mask`: 10 位 bitmask，表示哪些數位已被使用
- `started`: 是否已經開始（處理前導零）

### 解法實現

```cpp
class Solution {
private:
    string s;
    int memo[10][1024];  // [pos][mask]，只記憶化非 tight 狀態

    // started: 是否已開始（非前導零）
    int dfs(int pos, int mask, bool tight, bool started) {
        if (pos == s.size()) {
            return started ? 1 : 0;  // 只計算正整數
        }

        // 只有在非 tight 且已 started 時才能記憶化
        if (!tight && started && memo[pos][mask] != -1) {
            return memo[pos][mask];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        int res = 0;

        for (int d = 0; d <= limit; d++) {
            if (d == 0 && !started) {
                // 繼續前導零
                res += dfs(pos + 1, mask, tight && (d == limit), false);
            } else {
                // 檢查數位是否已被使用
                if (mask & (1 << d)) continue;
                res += dfs(pos + 1, mask | (1 << d), tight && (d == limit), true);
            }
        }

        if (!tight && started) {
            memo[pos][mask] = res;
        }
        return res;
    }

public:
    int countSpecialNumbers(int n) {
        s = to_string(n);
        memset(memo, -1, sizeof(memo));
        return dfs(0, 0, true, false);
    }
};
```

**時間複雜度：** O(L × 2^10 × 10)
**空間複雜度：** O(L × 2^10)

---

## 經典問題 5：給定數字集合構成的最大數字

[LeetCode 902. Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/)

### 問題描述

給定一個排序的字符串數組 digits，包含 '1' 到 '9' 的一部分數字。返回使用這些數字能生成的小於等於 n 的正整數個數。

**範例：**
```
輸入: digits = ["1","3","5","7"], n = 100
輸出: 20
解釋:
- 一位數: 1,3,5,7 (4個)
- 兩位數: 11,13,15,17,31,33,35,37,51,53,55,57,71,73,75,77 (16個)
- 三位數: 沒有 ≤100 的
總共 20 個
```

### 問題分析

只能使用給定的數位來構造數字。

**狀態定義：**
- `dp[pos][tight][started]`: 處理到第 pos 位，是否緊貼上界，是否已開始

### 解法實現

```cpp
class Solution {
private:
    string s;
    vector<int> ds;  // 可用的數位
    int memo[10];    // 只記憶化 !tight && started 的狀態

    int dfs(int pos, bool tight, bool started) {
        if (pos == s.size()) {
            return started ? 1 : 0;
        }

        if (!tight && started && memo[pos] != -1) {
            return memo[pos];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        int res = 0;

        // 選擇 0（繼續前導零）
        if (!started) {
            res += dfs(pos + 1, false, false);
        }

        // 選擇可用的數位
        for (int d : ds) {
            if (d > limit) break;
            res += dfs(pos + 1, tight && (d == limit), true);
        }

        if (!tight && started) {
            memo[pos] = res;
        }
        return res;
    }

public:
    int atMostNGivenDigitSet(vector<string>& digits, int n) {
        s = to_string(n);
        ds.clear();
        for (const string& d : digits) {
            ds.push_back(d[0] - '0');
        }
        memset(memo, -1, sizeof(memo));
        return dfs(0, true, false);
    }
};
```

**時間複雜度：** O(L × D)，其中 D 是可用數位個數
**空間複雜度：** O(L)

---

## 經典問題 6：統計整數數目

[LeetCode 2719. Count of Integers](https://leetcode.com/problems/count-of-integers/)

### 問題描述

給定兩個數字字符串 num1 和 num2，以及兩個整數 min_sum 和 max_sum。如果一個整數 x 滿足：
- num1 ≤ x ≤ num2
- min_sum ≤ digit_sum(x) ≤ max_sum

返回滿足條件的整數數目，結果對 10^9 + 7 取餘。

### 問題分析

這題結合了**區間查詢**和**數位和**限制。

**狀態定義：**
- `dp[pos][sum][tight]`: 處理到第 pos 位，數位和為 sum，是否緊貼上界

### 解法實現

```cpp
class Solution {
private:
    const int MOD = 1e9 + 7;
    int memo[23][401];  // pos, sum

    int dfs(const string& s, int pos, int sum, bool tight, int minSum, int maxSum) {
        // 數位和超過上限，剪枝
        if (sum > maxSum) return 0;

        if (pos == s.size()) {
            return (sum >= minSum && sum <= maxSum) ? 1 : 0;
        }

        if (!tight && memo[pos][sum] != -1) {
            return memo[pos][sum];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        long long res = 0;

        for (int d = 0; d <= limit; d++) {
            res += dfs(s, pos + 1, sum + d, tight && (d == limit), minSum, maxSum);
            res %= MOD;
        }

        if (!tight) {
            memo[pos][sum] = res;
        }
        return res;
    }

    int count(const string& s, int minSum, int maxSum) {
        memset(memo, -1, sizeof(memo));
        return dfs(s, 0, 0, true, minSum, maxSum);
    }

    // 將字串減 1
    string subtract(string s) {
        int i = s.size() - 1;
        while (i >= 0 && s[i] == '0') {
            s[i] = '9';
            i--;
        }
        if (i >= 0) s[i]--;
        // 去除前導零
        int start = 0;
        while (start < s.size() - 1 && s[start] == '0') start++;
        return s.substr(start);
    }

public:
    int count(string num1, string num2, int min_sum, int max_sum) {
        int r = count(num2, min_sum, max_sum);
        int l = count(subtract(num1), min_sum, max_sum);
        return (r - l + MOD) % MOD;
    }
};
```

**時間複雜度：** O(L × S × 10)
**空間複雜度：** O(L × S)

---

## 經典問題 7：範圍內數字的總波動度

[LeetCode 3753. Total Waviness of Numbers in Range II](https://leetcode.com/problems/total-waviness-of-numbers-in-range-ii/)

### 問題描述

給定兩個整數 `num1` 和 `num2`，表示閉區間 `[num1, num2]`。

**波動度 (Waviness) 定義：**
- 一個數字的波動度是其**波峰 (peak)** 和**波谷 (valley)** 的總數
- **波峰**：某一位數字**嚴格大於**其左右相鄰的兩位數字
- **波谷**：某一位數字**嚴格小於**其左右相鄰的兩位數字
- 數字的第一位和最後一位不能是波峰或波谷
- 少於 3 位的數字波動度為 0

返回範圍 `[num1, num2]` 內所有數字的波動度總和。

**範例 1：**
```
輸入: num1 = 120, num2 = 130
輸出: 3
解釋:
- 120: 中間數字 2 是波峰 (1 < 2 > 0)，波動度 = 1
- 121: 中間數字 2 是波峰 (1 < 2 > 1)，波動度 = 1
- 130: 中間數字 3 是波峰 (1 < 3 > 0)，波動度 = 1
- 其他數字 (122~129) 波動度為 0
總波動度 = 1 + 1 + 1 = 3
```

**範例 2：**
```
輸入: num1 = 1000, num2 = 1010
輸出: 0
解釋: 這個範圍內沒有數字包含波峰或波谷
```

### 問題分析

這是一道進階 Digit DP 問題，難點在於：
1. 需要追蹤「前兩位數字」來判斷趨勢變化
2. 需要同時返回「數字個數」和「波動度總和」

**波峰/波谷判斷邏輯：**
```
數字序列: ... a, b, c ...

波峰條件: a < b 且 b > c
- 即前一趨勢是「上升」，當前趨勢變為「下降」

波谷條件: a > b 且 b < c
- 即前一趨勢是「下降」，當前趨勢變為「上升」
```

**狀態定義：**
- `pos`: 當前數位位置 (0 到 18)
- `p`: 前兩位數字 (0-9，用 10 表示 0 且有 leading zero)
- `q`: 前一位數字 (0-9，用 10 表示 0 且有 leading zero) 
- `tight`: 是否緊貼上界

**返回值：**
返回 `pair<waviness, count>`：數字個數和波動度總和

**關鍵觀察：**
當我們在位置 `pos` 放置數字 `digit` 時，如果形成波峰/波谷，這個波峰/波谷會為**所有**從這裡延伸的後綴數字貢獻 1 點波動度。因此貢獻量是 `1 × 後綴數字個數`。

### 解法實現

```cpp
cclass Solution {
private:
    struct Result {
        long long waviness;
        long long valid;
        Result(int w, int v): waviness(w), valid(v) {}
        Result(): waviness(0LL), valid(0LL) {}
    };
    long long helper(long long num) {
        string s = to_string(num);
        Result dp[16][2][11][11]; // dp[pos][tight][prev2][prev1], use 10 to represents 0 with leading zeros.
        memset(dp, -1, sizeof(dp));  // -1 represents unvisited.

        // return {waviness, suffix number count}
        function<Result(int,int,int,int)> dfs = [&](int pos, int tight, int p, int q) {
            if (pos == s.size()) return Result(0, 1);
            auto& res = dp[pos][tight][p][q];
            if (res.waviness != -1) return res;
            res.waviness = res.valid = 0;

            int limit = tight ? s[pos] - '0' : 9;
            
            for (int d = 0; d <= limit; d++) {
                int ntight = tight && d == limit;
                bool is_leading_zero = p == 10 && q == 10 && d == 0;
                int np = is_leading_zero ? 10 : q;
                int nq = is_leading_zero ? 10 : d;

                auto [w, v] = dfs(pos + 1, ntight, np, nq);
                res.waviness += w;
                res.valid += v;

                if (p != 10 && q != 10) {
                    if ((p < q && q > d) || (p > q && q < d)) {
                        res.waviness += v;
                    }
                }
            }
            return res;
        };
        return dfs(0, 1, 10, 10).waviness;
    }
public:
    long long totalWaviness(long long num1, long long num2) {
        return helper(num2) - helper(num1 - 1);
    }
};
```

### 複雜度分析

**時間複雜度：** $O(D × 2 × 11 × 11) = O(D)$ 
- $D=\log_{10}(\text{num}) <= 16$
- 每個狀態只計算一次
- 狀態總數約為 15 × 2 × 3 × 2 × 2 ≈ 2500

**空間複雜度：** $O(D × 2 × 11 × 11) = O(D)$

### 核心技巧解析

#### 1. 返回 pair 的必要性

這題不能只返回波動度總和，因為當某位形成波峰/波谷時，其貢獻取決於「從該位延伸出去的數字有多少個」。

```cpp
// 當前位形成波峰/波谷時
total_waviness += current_contribution * res.valid;
//                                       ↑ 後綴數字的個數
```

#### 2. 前導零的處理

前導零需要特別處理：
- 前導零不應該參與趨勢計算
- 遇到前導零時，重置 `p = 10` 和 `q = 10`

```cpp
if (new_leading_zeros) {
    auto res = dp(idx + 1, new_tight, 10, 10);
    //                                ↑   ↑
    //                          0 且仍有 leading_zeros
}
```

#### 3. 波峰/波谷的判斷時機

波峰/波谷是在「前一位」形成的，但我們在處理「當前位」時才能確認：

```
... [前前一位] [前一位] [當前位] ...
        p        q       d

當 p > q 時， d 必須 > q，代表 q 是波峰；(先降後升)
當 p < q 時， d 必須 < q，代表 q 是波谷。(先升後降)
```

---

## 進階技巧

### 1. 處理前導零 (Leading Zero)

前導零需要特別處理，因為：
- `007` 和 `7` 是同一個數字
- 計算數位和時，前導零不應計入

```cpp
int dfs(int pos, int tight, int p, int q) {
    // started = false 表示還在前導零階段
    for (int d = 0; d <= limit; d++) {
        int ntight = tight && (d == limit);
        bool has_leading_zeros = (p == 10 && q == 10 && d == 0);
        
        int np = has_leading_zeros ? 10 : q;
        int nq = has_leading_zeros ? 10 : d;

        auto [w, v] = dfs(pos + 1, ntight, np, nq);
        if (p != 10 && q != 10) {
            if (p < q && q > d) res.waviness += v;
            else if (p > q && q < d) res.waviness += v;
        }
    }
}
```

### 2. 返回多個值

有時需要同時返回「數字個數」和「某種統計值」（如 1 的總次數）：

```cpp
pair<long long, long long> dfs(...) {
    // 返回 {count, sum}
    for (int d = 0; d <= limit; d++) {
        auto [c, s] = dfs(pos + 1, ...);
        count += c;
        sum += s + (d == 1 ? c : 0);  // 當前位是 1，貢獻 c 個 1
    }
    return {count, sum};
}
```

### 3. 大數處理

當 n 是字串形式的大數（如 10^200）時，直接用字串處理：

```cpp
int count(const string& n) {
    // n 是數字的字串表示
    return dfs(0, 0, true);
}
```

---

## Digit DP 總結

### 關鍵要點

1. **適用條件**
   - 數字範圍大（10^18 甚至更大）
   - 需要統計符合「數位性質」的數字
   - 區間查詢 [L, R]

2. **核心狀態**
   - `pos`: 當前處理的位置
   - `tight`: 是否緊貼上界
   - `leading_zero`: 前導零處理
   - `state`: 問題相關狀態

3. **實現技巧**
   - 從高位到低位遞迴
   - 只對 `tight = false` 的狀態記憶化
   - 區間查詢用 `count(R) - count(L-1)`

### 常見狀態設計

| 問題類型 | 狀態 |
|----------|------|
| 數位和 | `sum` |
| 前一位數字 | `prev` |
| 已使用數位 | `mask` (bitmask) |
| 是否已開始 | `started` |
| 特定數位出現次數 | `count` |
| 是否整除某數 | `remainder` |

### 複雜度分析

- **時間複雜度**: O(位數 × 狀態數 × 每個狀態的轉移)
  - 通常是 O(L × S × 10)
- **空間複雜度**: O(位數 × 狀態數)

### 練習題目

| 難度 | 題目 | 重點 |
|------|------|------|
| Medium | LC 233 - Number of Digit One | 統計特定數位 |
| Medium | LC 902 - Numbers At Most N | 限定數位集合 |
| Hard | LC 600 - No Consecutive Ones | 二進制 + prev |
| Hard | LC 1012 - Numbers With Repeated Digits | bitmask |
| Hard | LC 2376 - Count Special Integers | bitmask + 去重 |
| Hard | LC 2719 - Count of Integers | 區間 + 數位和 |
| Hard | LC 3753 - Total Waviness | 趨勢追蹤 + 返回 pair |

---

Digit DP 是處理大範圍數字統計問題的強大工具。掌握「逐位構造」和「tight 狀態」的核心思想後，大部分數位相關的計數問題都能迎刃而解。關鍵在於正確設計狀態和處理邊界條件（前導零、tight 轉移）。
