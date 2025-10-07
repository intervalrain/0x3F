---
title: "序列貪心"
order: 2
description: "序列上的貪心策略：排序、狀態維護與字典序問題"
tags: ["greedy", "array", "sorting", "monotonic-stack"]
---

# 2. 序列貪心

序列貪心是指在數組、字符串等序列結構上應用貪心策略。這類問題通常需要：
1. **排序後貪心**：先對序列排序，然後按順序做決策
2. **狀態維護**：維護一個或多個變量表示當前狀態，貪心地更新
3. **字典序貪心**：使用單調棧等結構維護字典序最優

## 問題類型一：排序 + 貪心

### 核心思想

通過排序建立處理順序，然後按順序貪心決策。

## LeetCode 455: Assign Cookies

### 問題描述

有一群孩子和一堆餅乾。每個孩子有貪心度 g[i]，每塊餅乾有大小 s[j]。當 s[j] >= g[i] 時，餅乾 j 可以滿足孩子 i。每個孩子最多只能得到一塊餅乾。求最多能滿足多少孩子。

### 貪心策略

**關鍵洞察**：
- 用小餅乾滿足貪心度小的孩子
- 這樣可以為貪心度大的孩子留下大餅乾

**正確性**：
```
假設最優解中，用大餅乾 s₁ 滿足小需求 g₁，
用小餅乾 s₂ 滿足大需求 g₂，其中 s₁ > s₂, g₁ < g₂

交換後：用 s₂ 滿足 g₁，用 s₁ 滿足 g₂
- 因為 s₂ >= g₁（原本 s₁ >= g₁，且 s₂ 能滿足 g₂ > g₁）
- 因為 s₁ > s₂ >= g₂
- 交換後仍是可行解，且不變差

因此貪心策略（小配小）是最優的。
```

### 實現

```cpp
class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        // 排序：孩子的貪心度和餅乾大小
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());

        int child = 0;  // 當前要滿足的孩子
        int cookie = 0; // 當前嘗試的餅乾

        while (child < g.size() && cookie < s.size()) {
            if (s[cookie] >= g[child]) {
                // 當前餅乾可以滿足當前孩子
                child++;
            }
            // 無論是否滿足，都移動到下一塊餅乾
            cookie++;
        }

        return child;
    }
};
```

### 視覺化

```
孩子貪心度：[1, 2, 3]
餅乾大小：  [1, 1, 2]

排序後都已經有序

匹配過程：
child=0, cookie=0: 1 >= 1 ✓ → child++, cookie++
child=1, cookie=1: 1 >= 2 ✗ → cookie++
child=1, cookie=2: 2 >= 2 ✓ → child++, cookie++

結果：滿足 2 個孩子
```

**時間複雜度**：O(n log n + m log m)，排序

**空間複雜度**：O(1)

**LeetCode 連結**：https://leetcode.com/problems/assign-cookies/

## 問題類型二：跳躍遊戲

### 核心思想

維護「當前能到達的最遠位置」，貪心地更新這個狀態。

## LeetCode 55: Jump Game

### 問題描述

給定數組 nums，每個元素表示在該位置的最大跳躍長度。判斷能否到達最後一個位置。

### 貪心策略

**關鍵洞察**：維護能到達的最遠位置 maxReach。
- 遍歷每個位置 i
- 如果 i > maxReach，說明無法到達位置 i
- 否則更新 maxReach = max(maxReach, i + nums[i])

### 實現

```cpp
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int maxReach = 0;

        for (int i = 0; i < nums.size(); i++) {
            // 如果當前位置超過了能到達的最遠距離
            if (i > maxReach) return false;

            // 更新能到達的最遠距離
            maxReach = max(maxReach, i + nums[i]);

            // 如果已經能到達終點，提前返回
            if (maxReach >= nums.size() - 1) return true;
        }

        return true;
    }
};
```

### 視覺化

```
nums = [2, 3, 1, 1, 4]
索引:   0  1  2  3  4

過程：
i=0: maxReach = max(0, 0+2) = 2
i=1: maxReach = max(2, 1+3) = 4 (可以到達終點！)

nums = [3, 2, 1, 0, 4]
索引:   0  1  2  3  4

過程：
i=0: maxReach = max(0, 0+3) = 3
i=1: maxReach = max(3, 1+2) = 3
i=2: maxReach = max(3, 2+1) = 3
i=3: maxReach = max(3, 3+0) = 3
i=4: 4 > 3，無法到達！
```

**時間複雜度**：O(n)

**空間複雜度**：O(1)

**LeetCode 連結**：https://leetcode.com/problems/jump-game/

## LeetCode 45: Jump Game II

### 問題描述

給定數組 nums（保證能到達終點），求到達終點的最少跳躍次數。

### 貪心策略

**關鍵洞察**：使用 BFS 的思想，但不使用隊列。
- 當前層：[currentStart, currentEnd]
- 下一層：能從當前層一步到達的所有位置
- 每次跳到下一層時，跳躍次數 +1

```cpp
class Solution {
public:
    int jump(vector<int>& nums) {
        if (nums.size() == 1) return 0;

        int jumps = 0;
        int currentEnd = 0;    // 當前跳躍能到達的最遠位置
        int maxReach = 0;      // 下一次跳躍能到達的最遠位置

        for (int i = 0; i < nums.size() - 1; i++) {
            // 更新下一次跳躍能到達的最遠位置
            maxReach = max(maxReach, i + nums[i]);

            // 到達當前跳躍的邊界
            if (i == currentEnd) {
                jumps++;
                currentEnd = maxReach;

                // 如果已經能到達終點，提前返回
                if (currentEnd >= nums.size() - 1) break;
            }
        }

        return jumps;
    }
};
```

### 視覺化

```
nums = [2, 3, 1, 1, 4]
索引:   0  1  2  3  4

跳躍過程：
第0次跳躍前：currentEnd = 0, maxReach = 0
  i=0: maxReach = max(0, 0+2) = 2
       到達邊界 i=0，跳躍！jumps=1, currentEnd=2

第1次跳躍後：currentEnd = 2, maxReach = 2
  i=1: maxReach = max(2, 1+3) = 4
  i=2: maxReach = max(4, 2+1) = 4
       到達邊界 i=2，跳躍！jumps=2, currentEnd=4

currentEnd >= 4，完成

層次結構：
第0層：[0]       (位置0)
第1層：[1, 2]    (從0可到達)
第2層：[3, 4]    (從1或2可到達)

最少跳躍次數：2
```

**時間複雜度**：O(n)

**空間複雜度**：O(1)

**LeetCode 連結**：https://leetcode.com/problems/jump-game-ii/

## 問題類型三：加油站問題

## LeetCode 134: Gas Station

### 問題描述

有 n 個加油站圍成一圈，gas[i] 表示在加油站 i 可以加的油量，cost[i] 表示從 i 開到 i+1 需要的油量。判斷能否從某個加油站出發繞一圈回到起點，如果可以返回起點索引。

### 貪心策略

**關鍵洞察**：
1. 如果總油量 < 總消耗，無解
2. 否則必有解（證明：總剩餘 >= 0，必存在一個起點）
3. 從 i 出發無法到達 j，則 i 到 j 之間的任何點作為起點都無法到達 j

**正確性證明**：

```
設 i 出發，到達 j 之前耗盡油：
- 累計剩餘油量：sum[i...j-1] < 0
- 對於 i < k < j，從 k 出發：
  sum[k...j-1] = sum[i...j-1] - sum[i...k-1]
  因為能從 i 到達 k，所以 sum[i...k-1] >= 0
  因此 sum[k...j-1] < sum[i...j-1] < 0
- 所以從 i 到 j 之間任何點出發都無法到達 j
- 下一個可能的起點是 j
```

### 實現

```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int totalGas = 0, totalCost = 0;
        int currentGas = 0;
        int start = 0;

        for (int i = 0; i < gas.size(); i++) {
            totalGas += gas[i];
            totalCost += cost[i];
            currentGas += gas[i] - cost[i];

            // 如果當前油量不足，無法到達下一站
            if (currentGas < 0) {
                // 從 i+1 重新開始
                start = i + 1;
                currentGas = 0;
            }
        }

        // 如果總油量 < 總消耗，無解
        return totalGas >= totalCost ? start : -1;
    }
};
```

### 視覺化

```
gas  = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]

累計剩餘：
i=0: gas-cost = 1-3 = -2 < 0 → 重置起點為1，currentGas=0
i=1: gas-cost = 2-4 = -2 < 0 → 重置起點為2，currentGas=0
i=2: gas-cost = 3-5 = -2 < 0 → 重置起點為3，currentGas=0
i=3: gas-cost = 4-1 = 3 ≥ 0 → currentGas=3
i=4: gas-cost = 5-2 = 3 ≥ 0 → currentGas=6

totalGas = 15, totalCost = 15 ✓
答案：從索引 3 出發

驗證：
從3出發：油量4，開到4需要1，剩3
到達4：  加油5，剩8，開到0需要2，剩6
到達0：  加油1，剩7，開到1需要3，剩4
到達1：  加油2，剩6，開到2需要4，剩2
到達2：  加油3，剩5，開到3需要5，剩0
到達3：  成功繞一圈！
```

**時間複雜度**：O(n)

**空間複雜度**：O(1)

**LeetCode 連結**：https://leetcode.com/problems/gas-station/

## 問題類型四：分發糖果

## LeetCode 135: Candy

### 問題描述

n 個孩子站成一排，每個孩子有評分 ratings[i]。分發糖果需滿足：
1. 每個孩子至少一顆糖
2. 評分高的孩子比相鄰的孩子得到更多糖果

求最少需要多少糖果。

### 貪心策略

**關鍵洞察**：分兩次遍歷
1. **從左到右**：確保右邊評分高的孩子比左邊多
2. **從右到左**：確保左邊評分高的孩子比右邊多
3. 每個位置取兩次遍歷的最大值

**正確性**：
```
左到右遍歷保證：ratings[i] > ratings[i-1] → candy[i] > candy[i-1]
右到左遍歷保證：ratings[i] > ratings[i+1] → candy[i] > candy[i+1]

取兩者最大值，同時滿足兩個方向的約束。
```

### 實現

```cpp
class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        vector<int> candies(n, 1);  // 每個孩子至少1顆

        // 從左到右：確保右邊評分高的比左邊多
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i-1]) {
                candies[i] = candies[i-1] + 1;
            }
        }

        // 從右到左：確保左邊評分高的比右邊多
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i+1]) {
                candies[i] = max(candies[i], candies[i+1] + 1);
            }
        }

        return accumulate(candies.begin(), candies.end(), 0);
    }
};
```

### 視覺化

```
ratings = [1, 0, 2]

初始化：candies = [1, 1, 1]

從左到右：
i=1: ratings[1]=0 < ratings[0]=1 → 不變
i=2: ratings[2]=2 > ratings[1]=0 → candies[2] = 1+1 = 2
結果：candies = [1, 1, 2]

從右到左：
i=1: ratings[1]=0 < ratings[2]=2 → 不變
i=0: ratings[0]=1 > ratings[1]=0 → candies[0] = max(1, 1+1) = 2
結果：candies = [2, 1, 2]

總糖果數：2 + 1 + 2 = 5
```

### 複雜例子

```
ratings = [1, 2, 87, 87, 87, 2, 1]

初始：   [1, 1,  1,  1,  1, 1, 1]

左到右：
1<2:     [1, 2,  1,  1,  1, 1, 1]
2<87:    [1, 2,  3,  1,  1, 1, 1]
87=87:   [1, 2,  3,  1,  1, 1, 1]
87=87:   [1, 2,  3,  1,  1, 1, 1]
87>2:    [1, 2,  3,  1,  1, 1, 1]
2>1:     [1, 2,  3,  1,  1, 2, 1]

右到左：
2>1:     [1, 2,  3,  1,  1, 2, 1]
87>2:    [1, 2,  3,  1,  1, 2, 1] (已是1)
87=87:   [1, 2,  3,  1,  1, 2, 1]
87=87:   [1, 2,  3,  1,  1, 2, 1]
87>87:   [1, 2,  3,  1,  1, 2, 1]
2<87:    [1, 2,  3,  1,  1, 2, 1]

總數：1+2+3+1+1+2+1 = 11
```

**時間複雜度**：O(n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/candy/

## 問題類型五：字典序貪心

### 核心思想

使用單調棧維護字典序最優的結果。

## LeetCode 402: Remove K Digits

### 問題描述

給定數字字符串 num 和整數 k，移除 k 位數字使得剩餘數字最小。

### 貪心策略

**關鍵洞察**：
- 從左到右，如果當前數字比棧頂小，就移除棧頂（讓高位變小）
- 使用單調遞增棧
- 移除前導零

```cpp
class Solution {
public:
    string removeKdigits(string num, int k) {
        string result;  // 當作棧使用

        for (char digit : num) {
            // 當前數字比棧頂小，且還有移除配額
            while (!result.empty() && k > 0 &&
                   result.back() > digit) {
                result.pop_back();
                k--;
            }
            result.push_back(digit);
        }

        // 如果還有移除配額，從尾部移除
        while (k > 0) {
            result.pop_back();
            k--;
        }

        // 移除前導零
        int start = 0;
        while (start < result.size() && result[start] == '0') {
            start++;
        }

        string answer = result.substr(start);
        return answer.empty() ? "0" : answer;
    }
};
```

### 視覺化

```
num = "1432219", k = 3

過程：
digit='1': result = "1"
digit='4': result = "14"
digit='3': 3 < 4，移除4，k=2
           result = "13"
digit='2': 2 < 3，移除3，k=1
           result = "12"
digit='2': 2 = 2，不移除
           result = "122"
digit='1': 1 < 2，移除2，k=0
           result = "121"
digit='9': result = "1219"

k=0，不再移除
結果："1219"
```

```
num = "10200", k = 1

過程：
digit='1': result = "1"
digit='0': 0 < 1，移除1，k=0
           result = "0"
digit='2': result = "02"
digit='0': result = "020"
digit='0': result = "0200"

移除前導零："200"
```

**時間複雜度**：O(n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/remove-k-digits/

## LeetCode 406: Queue Reconstruction by Height

### 問題描述

有 n 個人排隊，每個人用 [h, k] 表示：
- h：這個人的身高
- k：排在這個人前面且身高 >= h 的人數

給定打亂的隊列，重建原始隊列。

### 貪心策略

**關鍵洞察**：
1. 按身高降序排序，身高相同按 k 升序
2. 按順序插入到結果的第 k 個位置

**正確性**：
```
1. 先處理高個子，此時矮個子還沒插入，不影響 k 值
2. 插入矮個子時，只需考慮比他高的人（已插入的）
3. 因為按 h 降序，所以後插入的人不會影響已插入的人的 k 值
```

### 實現

```cpp
class Solution {
public:
    vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
        // 按身高降序，k 升序排序
        sort(people.begin(), people.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 if (a[0] != b[0]) return a[0] > b[0];
                 return a[1] < b[1];
             });

        vector<vector<int>> result;

        for (auto& person : people) {
            // 插入到第 k 個位置
            result.insert(result.begin() + person[1], person);
        }

        return result;
    }
};
```

### 視覺化

```
輸入：[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]

排序後（按h降序，k升序）：
[[7,0], [7,1], [6,1], [5,0], [5,2], [4,4]]

插入過程：
[7,0]: 插入位置0 → [[7,0]]
[7,1]: 插入位置1 → [[7,0], [7,1]]
[6,1]: 插入位置1 → [[7,0], [6,1], [7,1]]
[5,0]: 插入位置0 → [[5,0], [7,0], [6,1], [7,1]]
[5,2]: 插入位置2 → [[5,0], [7,0], [5,2], [6,1], [7,1]]
[4,4]: 插入位置4 → [[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]

結果：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

驗證：
[5,0]: 前面0個 >= 5 ✓
[7,0]: 前面0個 >= 7 ✓
[5,2]: 前面2個 >= 5 (7,7) ✓
[6,1]: 前面1個 >= 6 (7) ✓
[4,4]: 前面4個 >= 4 (5,7,5,6) ✓
[7,1]: 前面1個 >= 7 (7) ✓
```

**時間複雜度**：O(n²)，插入操作需要 O(n)

**空間複雜度**：O(n)

**優化**：使用鏈表或樹狀數組可以優化插入到 O(log n)

**LeetCode 連結**：https://leetcode.com/problems/queue-reconstruction-by-height/

## 問題類型六：特殊貪心策略

## LeetCode 316: Remove Duplicate Letters

### 問題描述

給定字符串 s，移除重複字母使得每個字母只出現一次，返回字典序最小的結果。

### 貪心策略

**關鍵洞察**：
1. 使用單調棧維護結果
2. 如果當前字符比棧頂小，且棧頂字符在後面還會出現，則移除棧頂
3. 使用 visited 避免重複添加

```cpp
class Solution {
public:
    string removeDuplicateLetters(string s) {
        vector<int> count(26, 0);  // 每個字符剩餘數量
        vector<bool> visited(26, false);  // 是否在結果中
        string result;

        // 統計每個字符出現次數
        for (char c : s) {
            count[c - 'a']++;
        }

        for (char c : s) {
            count[c - 'a']--;  // 當前字符已處理

            // 如果已經在結果中，跳過
            if (visited[c - 'a']) continue;

            // 如果當前字符比棧頂小，且棧頂字符後面還會出現
            while (!result.empty() &&
                   result.back() > c &&
                   count[result.back() - 'a'] > 0) {
                visited[result.back() - 'a'] = false;
                result.pop_back();
            }

            result.push_back(c);
            visited[c - 'a'] = true;
        }

        return result;
    }
};
```

### 視覺化

```
s = "bcabc"

初始：count = {a:1, b:2, c:2}

處理 'b':
  count['b']--
  result = "b"
  visited['b'] = true

處理 'c':
  count['c']--
  c > b，不移除
  result = "bc"
  visited['c'] = true

處理 'a':
  count['a']--
  a < c，且 count['c'] > 0，移除 c
  a < b，且 count['b'] > 0，移除 b
  result = "a"
  visited['a'] = true

處理 'b':
  count['b']--
  result = "ab"
  visited['b'] = true

處理 'c':
  count['c']--
  result = "abc"
  visited['c'] = true

結果："abc"
```

**時間複雜度**：O(n)

**空間複雜度**：O(1)，字符集大小固定

**LeetCode 連結**：https://leetcode.com/problems/remove-duplicate-letters/

## 常見陷阱與技巧

### 陷阱 1：排序標準錯誤

```cpp
// 問題：分配餅乾
// 錯誤：只排序孩子或只排序餅乾

// 正確：兩者都排序
sort(g.begin(), g.end());
sort(s.begin(), s.end());
```

### 陷阱 2：邊界條件

```cpp
// 問題：跳躍遊戲 II
// 錯誤：訪問越界

for (int i = 0; i < nums.size(); i++) {  // 錯誤！
    if (i == currentEnd) {
        jumps++;
        currentEnd = maxReach;
    }
}

// 正確：
for (int i = 0; i < nums.size() - 1; i++) {
    // 不需要處理最後一個元素
}
```

### 陷阱 3：重置條件

```cpp
// 問題：加油站
// 錯誤：忘記重置累計油量

if (currentGas < 0) {
    start = i + 1;
    // 忘記重置！
}

// 正確：
if (currentGas < 0) {
    start = i + 1;
    currentGas = 0;  // 必須重置
}
```

### 技巧 1：兩次遍歷

```cpp
// 問題：分發糖果
// 分兩個方向遍歷，分別滿足不同約束

// 左到右
for (int i = 1; i < n; i++) { ... }

// 右到左
for (int i = n-2; i >= 0; i--) { ... }
```

### 技巧 2：單調棧

```cpp
// 維護單調遞增/遞減的棧
while (!stack.empty() && stack.back() > current) {
    stack.pop_back();
}
stack.push_back(current);
```

### 技巧 3：狀態壓縮

```cpp
// 用少量變量維護狀態
int currentEnd = 0;   // 當前層的邊界
int maxReach = 0;     // 下一層能到達的最遠位置
int jumps = 0;        // 跳躍次數
```

## 總結

### 序列貪心的核心策略

| 問題類型 | 策略 | 典型題目 |
|----------|------|----------|
| 排序貪心 | 排序後按順序處理 | 分餅乾、重建隊列 |
| 狀態維護 | 維護最優狀態變量 | 跳躍遊戲、加油站 |
| 兩次遍歷 | 分別滿足不同約束 | 分發糖果 |
| 字典序貪心 | 單調棧 | 移除K位數字 |

### 時間複雜度對比

| 方法 | 時間複雜度 | 適用場景 |
|------|------------|----------|
| 排序 + 遍歷 | O(n log n) | 需要建立順序 |
| 單次遍歷 | O(n) | 狀態維護 |
| 兩次遍歷 | O(n) | 雙向約束 |
| 單調棧 | O(n) | 字典序最優 |

### LeetCode 題目總結

1. **455. Assign Cookies** - 排序貪心基礎
2. **55. Jump Game** - 狀態維護
3. **45. Jump Game II** - BFS 思想 + 貪心
4. **134. Gas Station** - 累計和 + 重置
5. **135. Candy** - 兩次遍歷
6. **402. Remove K Digits** - 單調棧
7. **406. Queue Reconstruction by Height** - 排序 + 插入

### 學習建議

1. **掌握排序**：明確排序標準，理解為什麼這樣排序
2. **狀態變量**：理解需要維護哪些狀態，如何更新
3. **證明正確性**：能夠解釋為什麼貪心策略是最優的
4. **單調棧**：熟練掌握單調棧在字典序問題中的應用
5. **邊界處理**：注意數組訪問邊界、重置條件等細節

序列貪心問題往往需要仔細分析問題結構，找到正確的貪心策略。掌握這些模式後，可以快速識別和解決相關問題。
