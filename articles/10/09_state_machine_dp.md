---
title: 10-9. State Machine DP
order: 9
description: 狀態機動態規劃：股票買賣系列問題
tags:
  - 動態規劃
  - 狀態機 DP
  - 股票問題
author: Rain Hu
date: '2025-10-30'
draft: false
---

# State Machine DP (狀態機 DP)

狀態機 DP 是一種將問題建模為**狀態機**,然後用動態規劃求解的方法。這類問題的特點是:存在多個狀態,狀態之間可以相互轉換,每次轉換可能有代價或收益。

## 核心概念

### 什麼是狀態機?

狀態機是一個包含以下要素的模型:
1. **狀態集合**: 系統可能處於的所有狀態
2. **狀態轉移**: 從一個狀態到另一個狀態的規則
3. **初始狀態**: 起始時的狀態
4. **終止狀態**: 目標狀態(可選)

### 股票買賣問題的狀態機

股票買賣系列問題是狀態機 DP 的經典應用:
- **狀態**: 持有股票 vs 不持有股票
- **轉移**: 買入、賣出、持有、冷凍
- **目標**: 最大化利潤

---

## 經典問題 1: 買賣股票的最佳時機 (Best Time to Buy and Sell Stock)

[LeetCode 121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

### 問題描述

給定一個數組 prices,其中 prices[i] 是第 i 天的股票價格。你只能選擇**某一天買入**這隻股票,並選擇在**未來的某一天賣出**。返回最大利潤。如果不能獲利,返回 0。

**範例:**
```
輸入: prices = [7,1,5,3,6,4]
輸出: 5
解釋: 在第 2 天(價格 = 1)買入,在第 5 天(價格 = 6)賣出,利潤 = 6-1 = 5
```

### 問題分析

最簡單的情況:**最多一次交易**。

**狀態定義:**
- `buy`: 持有股票時的最大利潤
- `sell`: 不持有股票時的最大利潤

**狀態轉移:**
```cpp
buy = max(buy, -prices[i])       // 買入或繼續持有
sell = max(sell, buy + prices[i]) // 賣出或繼續不持有
```

**初始化:**
```cpp
buy = -prices[0]   // 第 0 天買入
sell = 0           // 第 0 天不持有
```

### 解法實現

#### 解法 1: 狀態機 DP

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int buy = -prices[0];
        int sell = 0;

        for (int i = 1; i < prices.size(); i++) {
            buy = max(buy, -prices[i]);
            sell = max(sell, buy + prices[i]);
        }

        return sell;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

#### 解法 2: 貪心(更直觀)

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
};
```

---

## 經典問題 2: 買賣股票的最佳時機 II (Best Time to Buy and Sell Stock II)

[LeetCode 122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

### 問題描述

給定一個數組 prices,可以進行**多次交易**(買入和賣出一支股票一次視為一次交易)。但是,你不能同時參與多筆交易(必須先賣出再買入)。返回最大利潤。

**範例:**
```
輸入: prices = [7,1,5,3,6,4]
輸出: 7
解釋: 在第 2 天買入,第 3 天賣出,利潤 = 5-1 = 4
     在第 4 天買入,第 5 天賣出,利潤 = 6-3 = 3
     總利潤 = 4 + 3 = 7
```

### 問題分析

**無限次交易**,但同時只能持有一股。

**狀態定義:**
- `buy[i]`: 第 i 天持有股票的最大利潤
- `sell[i]`: 第 i 天不持有股票的最大利潤

**狀態轉移:**
```cpp
buy[i] = max(buy[i-1], sell[i-1] - prices[i])   // 繼續持有 或 買入
sell[i] = max(sell[i-1], buy[i-1] + prices[i])  // 繼續不持有 或 賣出
```

**狀態轉移圖:**
```
  buy[i-1] ─────────→ buy[i]
     ↑                  │
     │ -prices[i]       │ +prices[i]
     │                  ↓
  sell[i-1] ────────→ sell[i]
```

### 解法實現

#### 解法 1: 狀態機 DP

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int buy = -prices[0];
        int sell = 0;

        for (int i = 1; i < prices.size(); i++) {
            int newBuy = max(buy, sell - prices[i]);
            int newSell = max(sell, buy + prices[i]);
            buy = newBuy;
            sell = newSell;
        }

        return sell;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

#### 解法 2: 貪心

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        for (int i = 1; i < prices.size(); i++) {
            if (prices[i] > prices[i-1]) {
                profit += prices[i] - prices[i-1];
            }
        }
        return profit;
    }
};
```

**解釋:** 只要價格上漲就賣出,等同於把所有上漲段都捕獲。

---

## 經典問題 3: 買賣股票的最佳時機 III (Best Time to Buy and Sell Stock III)

[LeetCode 123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)

### 問題描述

給定一個數組 prices,最多完成**兩筆交易**。返回最大利潤。

**範例:**
```
輸入: prices = [3,3,5,0,0,3,1,4]
輸出: 6
解釋: 在第 4 天買入(價格 = 0),第 6 天賣出(價格 = 3),利潤 = 3
     在第 7 天買入(價格 = 1),第 8 天賣出(價格 = 4),利潤 = 3
     總利潤 = 3 + 3 = 6
```

### 問題分析

**最多 k=2 次交易**。

**狀態定義:**
- `buy1`: 第一次買入後的最大利潤
- `sell1`: 第一次賣出後的最大利潤
- `buy2`: 第二次買入後的最大利潤
- `sell2`: 第二次賣出後的最大利潤

**狀態轉移:**
```cpp
buy1 = max(buy1, -prices[i])
sell1 = max(sell1, buy1 + prices[i])
buy2 = max(buy2, sell1 - prices[i])
sell2 = max(sell2, buy2 + prices[i])
```

**狀態轉移圖:**
```
    -prices[i]        +prices[i]       -prices[i]       +prices[i]
 0 ──────────→ buy1 ──────────→ sell1 ──────────→ buy2 ──────────→ sell2
```

### 解法實現

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int buy1 = -prices[0], sell1 = 0;
        int buy2 = -prices[0], sell2 = 0;

        for (int i = 1; i < prices.size(); i++) {
            buy1 = max(buy1, -prices[i]);
            sell1 = max(sell1, buy1 + prices[i]);
            buy2 = max(buy2, sell1 - prices[i]);
            sell2 = max(sell2, buy2 + prices[i]);
        }

        return sell2;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

---

## 經典問題 4: 買賣股票的最佳時機 IV (Best Time to Buy and Sell Stock IV)

[LeetCode 188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)

### 問題描述

給定一個數組 prices 和一個整數 k,最多完成 **k 筆交易**。返回最大利潤。

**範例:**
```
輸入: k = 2, prices = [3,2,6,5,0,3]
輸出: 7
解釋: 在第 2 天買入,第 3 天賣出,利潤 = 6-2 = 4
     在第 5 天買入,第 6 天賣出,利潤 = 3-0 = 3
     總利潤 = 4 + 3 = 7
```

### 問題分析

這是最通用的情況:**最多 k 次交易**。

**狀態定義:**
- `buy[i][j]`: 第 i 天,進行了 j 次交易,持有股票的最大利潤
- `sell[i][j]`: 第 i 天,進行了 j 次交易,不持有股票的最大利潤

**狀態轉移:**
```cpp
buy[i][j] = max(buy[i-1][j], sell[i-1][j-1] - prices[i])
sell[i][j] = max(sell[i-1][j], buy[i-1][j] + prices[i])
```

**優化:** 如果 k ≥ n/2,等同於無限次交易(問題 II)。

### 解法實現

```cpp
class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        int n = prices.size();
        if (n <= 1 || k == 0) return 0;

        // 如果 k 很大,等同於無限次交易
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                if (prices[i] > prices[i-1]) {
                    profit += prices[i] - prices[i-1];
                }
            }
            return profit;
        }

        // DP
        vector<int> buy(k + 1, -prices[0]);
        vector<int> sell(k + 1, 0);

        for (int i = 1; i < n; i++) {
            for (int j = k; j >= 1; j--) {
                sell[j] = max(sell[j], buy[j] + prices[i]);
                buy[j] = max(buy[j], sell[j-1] - prices[i]);
            }
        }

        return sell[k];
    }
};
```

**時間複雜度:** O(n × k)
**空間複雜度:** O(k)

---

## 經典問題 5: 含冷凍期的買賣股票 (Best Time to Buy and Sell Stock with Cooldown)

[LeetCode 309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

### 問題描述

給定一個數組 prices,可以進行多次交易,但賣出股票後,你無法在第二天買入股票(即**冷凍期為 1 天**)。返回最大利潤。

**範例:**
```
輸入: prices = [1,2,3,0,2]
輸出: 3
解釋: 買入(價格 = 1),賣出(價格 = 2),利潤 = 1
     冷凍 1 天
     買入(價格 = 0),賣出(價格 = 2),利潤 = 2
     總利潤 = 1 + 2 = 3
```

### 問題分析

引入冷凍期後,狀態機變得更複雜。

**狀態定義:**
- `hold`: 持有股票
- `sold`: 剛賣出(進入冷凍期)
- `rest`: 不持有股票,不在冷凍期

**狀態轉移:**
```cpp
hold = max(hold, rest - prices[i])      // 繼續持有 或 從休息狀態買入
sold = hold + prices[i]                 // 賣出
rest = max(rest, sold)                  // 保持休息 或 從冷凍期恢復
```

**狀態轉移圖:**
```
        -prices[i]
  rest ──────────→ hold
   ↑                 │
   │ (1天後)         │ +prices[i]
   │                 ↓
  sold ←──────────  sold
```

### 解法實現

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;

        int hold = -prices[0];  // 持有股票
        int sold = 0;           // 剛賣出(冷凍)
        int rest = 0;           // 休息(可以買入)

        for (int i = 1; i < prices.size(); i++) {
            int newHold = max(hold, rest - prices[i]);
            int newSold = hold + prices[i];
            int newRest = max(rest, sold);

            hold = newHold;
            sold = newSold;
            rest = newRest;
        }

        return max(sold, rest);
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

---

## 經典問題 6: 含手續費的買賣股票 (Best Time to Buy and Sell Stock with Transaction Fee)

[LeetCode 714. Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

### 問題描述

給定一個數組 prices 和一個整數 fee(手續費),可以進行多次交易,但每次交易需要支付手續費。返回最大利潤。

**範例:**
```
輸入: prices = [1,3,2,8,4,9], fee = 2
輸出: 8
解釋: 最大利潤 = ((8-1)-2) + ((9-4)-2) = 8
```

### 問題分析

與無限次交易類似,但賣出時需要扣除手續費。

**狀態轉移:**
```cpp
buy = max(buy, sell - prices[i])
sell = max(sell, buy + prices[i] - fee)  // 賣出時扣手續費
```

### 解法實現

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices, int fee) {
        int buy = -prices[0];
        int sell = 0;

        for (int i = 1; i < prices.size(); i++) {
            int newBuy = max(buy, sell - prices[i]);
            int newSell = max(sell, buy + prices[i] - fee);
            buy = newBuy;
            sell = newSell;
        }

        return sell;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(1)

---

## 狀態機 DP 總結

### 股票問題對比

| 問題 | 限制 | 狀態數 | 複雜度 |
|------|------|--------|--------|
| 121 - 一次交易 | k = 1 | 2 | O(n) |
| 122 - 無限次 | k = ∞ | 2 | O(n) |
| 123 - 兩次 | k = 2 | 4 | O(n) |
| 188 - k 次 | k = k | 2k | O(n×k) |
| 309 - 冷凍期 | cooldown = 1 | 3 | O(n) |
| 714 - 手續費 | fee | 2 | O(n) |

### 狀態機設計步驟

1. **確定狀態集合**
   - 分析問題中的"狀態"
   - 持有/不持有、交易次數、冷凍期等

2. **畫出狀態轉移圖**
   - 哪些狀態可以互相轉移?
   - 轉移的代價是什麼?

3. **定義 DP 狀態**
   - `dp[i][state]`: 第 i 天處於 state 的最優值

4. **推導轉移方程**
   - 根據狀態轉移圖寫出方程

5. **初始化和邊界**
   - 第 0 天的初始狀態

### 關鍵技巧

1. **狀態壓縮**
   - 如果只依賴前一天,可以用變量代替數組

2. **優化特殊情況**
   - k ≥ n/2 時,等同於無限次交易

3. **注意更新順序**
   - 使用臨時變量避免覆蓋

4. **畫狀態轉移圖**
   - 有助於理解和推導方程

### 常見錯誤

1. **狀態定義不清**
   - 沒有明確每個狀態的含義

2. **轉移順序錯誤**
   - 新舊狀態混用

3. **初始化錯誤**
   - 第 0 天的狀態設置不對

4. **邊界情況遺漏**
   - k = 0, n = 0 等特殊情況

---

狀態機 DP 是動態規劃中非常實用的技巧,通過將問題建模為狀態機,可以清晰地表達狀態轉移關係。股票買賣系列問題是狀態機 DP 的經典應用,掌握這些問題的解法,能幫助你理解狀態機 DP 的精髓。
