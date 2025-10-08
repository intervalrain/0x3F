---
title: 10-7. 狀態壓縮 DP / Bitmask DP
order: 7
description: 使用位元運算進行狀態壓縮的動態規劃
tags:
  - 動態規劃
  - 狀態壓縮
  - Bitmask DP
  - 位元運算
author: Rain Hu
date: ''
draft: true
---

# 狀態壓縮 DP / Bitmask DP

狀態壓縮 DP 是一種使用**位元 (bit) 來表示狀態集合**的動態規劃技術。當問題涉及的集合元素數量較小(通常 n ≤ 20)時,可以用一個整數的二進制位來表示集合的狀態,從而大幅簡化狀態表示和轉移。

## 核心概念

### 什麼時候使用狀態壓縮?

1. 問題涉及**集合**或**子集**
2. 集合大小較小: **n ≤ 20** (因為 2²⁰ ≈ 10⁶ 可接受)
3. 需要記錄"哪些元素被訪問/選擇/使用"
4. 狀態之間有集合的包含關係

### 位元表示集合

用一個整數的二進制表示來表示集合:
- 第 i 位為 1 表示元素 i 在集合中
- 第 i 位為 0 表示元素 i 不在集合中

**範例:**
```
集合 {0, 2, 3}:
二進制: 1101 (從右到左第 0, 2, 3 位為 1)
十進制: 13

空集 {}:
二進制: 0000
十進制: 0

全集 {0, 1, 2, 3}:
二進制: 1111
十進制: 15 = (1 << 4) - 1
```

## 位元運算基礎

```cpp
// 檢查第 i 位是否為 1
bool contains(int mask, int i) {
    return (mask >> i) & 1;
    // 或: return mask & (1 << i);
}

// 設置第 i 位為 1(添加元素 i)
int add(int mask, int i) {
    return mask | (1 << i);
}

// 設置第 i 位為 0(刪除元素 i)
int remove(int mask, int i) {
    return mask & ~(1 << i);
}

// 翻轉第 i 位
int toggle(int mask, int i) {
    return mask ^ (1 << i);
}

// 集合大小(popcount - 二進制中 1 的個數)
int count(int mask) {
    return __builtin_popcount(mask);
}

// 枚舉所有子集
for (int subset = mask; subset > 0; subset = (subset - 1) & mask) {
    // subset 是 mask 的子集
}

// 枚舉所有大小為 n 的集合
int total = (1 << n);
for (int mask = 0; mask < total; mask++) {
    // mask 表示一個集合
}
```

## 狀態定義模式

```cpp
dp[mask]        // 集合狀態為 mask 時的最優解
dp[i][mask]     // 考慮前 i 個元素,集合狀態為 mask 的最優解
dp[mask][j]     // 集合狀態為 mask,當前位置為 j 的最優解
```

---

## 經典問題 1: 訪問所有節點的最短路徑 (Shortest Path Visiting All Nodes)

[LeetCode 847. Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/)

### 問題描述

給定一個無向連通圖,有 n 個節點,編號為 0 到 n-1。返回訪問所有節點所需的最短路徑長度。你可以從任何節點開始和結束,可以重複訪問節點,並且可以重複使用邊。

**範例:**
```
輸入: graph = [[1,2,3],[0],[0],[0]]
輸出: 4
解釋: 一種可能的路徑是 [1,0,2,0,3]
```

### 問題分析

這是一道典型的狀態壓縮 DP + BFS 問題。

**狀態定義:**
- `dp[mask][i]`: 訪問過的節點集合為 mask,當前在節點 i 的最短路徑長度

**BFS 方法:**
- 狀態: (當前節點, 訪問過的節點集合)
- 目標: 到達 (任意節點, 全集)

### 解法實現

```cpp
class Solution {
public:
    int shortestPathLength(vector<vector<int>>& graph) {
        int n = graph.size();
        int target = (1 << n) - 1;  // 全集

        // dp[mask][i]: 狀態為 mask,當前在 i 的最短距離
        vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX));
        queue<pair<int, int>> q;  // (節點, mask)

        // 可以從任何節點開始
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = 0;
            q.push({i, 1 << i});
        }

        while (!q.empty()) {
            auto [u, mask] = q.front();
            q.pop();

            // 如果已經訪問了所有節點
            if (mask == target) {
                return dp[mask][u];
            }

            // 遍歷所有相鄰節點
            for (int v : graph[u]) {
                int newMask = mask | (1 << v);
                int newDist = dp[mask][u] + 1;

                if (newDist < dp[newMask][v]) {
                    dp[newMask][v] = newDist;
                    q.push({v, newMask});
                }
            }
        }

        return -1;  // 理論上不會到達這裡
    }
};
```

**時間複雜度:** O(2ⁿ × n²)
**空間複雜度:** O(2ⁿ × n)

---

## 經典問題 2: 最短超級字符串 (Find the Shortest Superstring)

[LeetCode 943. Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring/)

### 問題描述

給定一個字符串數組 words,找出一個最短的字符串,使得 words 中的每個字符串都是它的子串。

**範例:**
```
輸入: words = ["alex","loves","leetcode"]
輸出: "alexlovesleetcode"
解釋: "alex", "loves", "leetcode" 都是 "alexlovesleetcode" 的子串
```

### 問題分析

這是一個組合優化問題,需要找到合併所有字符串的最優順序。

**預處理:**
計算 `overlap[i][j]`: 將 words[j] 接在 words[i] 後面時,可以重疊的最大長度。

**狀態定義:**
- `dp[mask][i]`: 已經使用了 mask 中的字符串,最後一個是 i 時的最短長度

**狀態轉移:**
```cpp
dp[mask | (1<<j)][j] = min(dp[mask | (1<<j)][j],
                           dp[mask][i] + words[j].length() - overlap[i][j])
```

### 解法實現

```cpp
class Solution {
private:
    // 計算 b 接在 a 後面可以重疊多少
    int getOverlap(const string& a, const string& b) {
        int maxOverlap = min(a.length(), b.length());
        for (int len = maxOverlap; len >= 1; len--) {
            if (a.substr(a.length() - len) == b.substr(0, len)) {
                return len;
            }
        }
        return 0;
    }

public:
    string shortestSuperstring(vector<string>& words) {
        int n = words.size();

        // 預處理重疊長度
        vector<vector<int>> overlap(n, vector<int>(n, 0));
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    overlap[i][j] = getOverlap(words[i], words[j]);
                }
            }
        }

        // dp[mask][i]: 使用 mask 集合,最後一個是 i 的最短長度
        vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX/2));
        vector<vector<int>> parent(1 << n, vector<int>(n, -1));

        // 初始化:只使用一個字符串
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = words[i].length();
        }

        // DP
        for (int mask = 1; mask < (1 << n); mask++) {
            for (int i = 0; i < n; i++) {
                if (!(mask & (1 << i))) continue;
                if (dp[mask][i] == INT_MAX/2) continue;

                for (int j = 0; j < n; j++) {
                    if (mask & (1 << j)) continue;

                    int newMask = mask | (1 << j);
                    int newLen = dp[mask][i] + words[j].length() - overlap[i][j];

                    if (newLen < dp[newMask][j]) {
                        dp[newMask][j] = newLen;
                        parent[newMask][j] = i;
                    }
                }
            }
        }

        // 找到最優解
        int fullMask = (1 << n) - 1;
        int minLen = INT_MAX;
        int lastIdx = -1;

        for (int i = 0; i < n; i++) {
            if (dp[fullMask][i] < minLen) {
                minLen = dp[fullMask][i];
                lastIdx = i;
            }
        }

        // 回溯構造答案
        string result;
        int mask = fullMask;
        int curr = lastIdx;

        while (curr != -1) {
            int prev = parent[mask][curr];
            if (prev == -1) {
                result = words[curr] + result;
            } else {
                int overlapLen = overlap[prev][curr];
                result = words[curr].substr(overlapLen) + result;
            }

            mask ^= (1 << curr);
            curr = prev;
        }

        return result;
    }
};
```

**時間複雜度:** O(2ⁿ × n² + n² × L),其中 L 是字符串平均長度
**空間複雜度:** O(2ⁿ × n)

---

## 經典問題 3: 最小不兼容 (Minimum Incompatibility)

[LeetCode 1681. Minimum Incompatibility](https://leetcode.com/problems/minimum-incompatibility/)

### 問題描述

給定一個整數數組 nums 和一個整數 k。你需要將這個數組劃分為 k 個相同大小的子集,使得不兼容性之和最小。一個子集的不兼容性是子集中最大值和最小值的差值。

**範例:**
```
輸入: nums = [1,2,1,4], k = 2
輸出: 4
解釋: 劃分為 [1,2] 和 [1,4]
     不兼容性 = (2-1) + (4-1) = 1 + 3 = 4
```

### 問題分析

**狀態定義:**
- `dp[mask]`: 已經分配了 mask 中元素的最小不兼容性總和

**預處理:**
枚舉所有大小為 n/k 的子集,計算其不兼容性(如果有效)。

### 解法實現

```cpp
class Solution {
public:
    int minimumIncompatibility(vector<int>& nums, int k) {
        int n = nums.size();
        int groupSize = n / k;

        // 預處理:計算所有有效子集的不兼容性
        vector<int> incomp(1 << n, -1);

        for (int mask = 0; mask < (1 << n); mask++) {
            if (__builtin_popcount(mask) != groupSize) continue;

            // 提取子集中的元素
            vector<int> subset;
            for (int i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    subset.push_back(nums[i]);
                }
            }

            // 檢查是否有重複元素
            sort(subset.begin(), subset.end());
            bool valid = true;
            for (int i = 1; i < subset.size(); i++) {
                if (subset[i] == subset[i-1]) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                incomp[mask] = subset.back() - subset[0];
            }
        }

        // DP
        vector<int> dp(1 << n, INT_MAX);
        dp[0] = 0;

        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] == INT_MAX) continue;

            // 枚舉所有可以添加的子集
            int remaining = ((1 << n) - 1) ^ mask;

            for (int subset = remaining; subset > 0; subset = (subset - 1) & remaining) {
                if (__builtin_popcount(subset) != groupSize) continue;
                if (incomp[subset] == -1) continue;

                dp[mask | subset] = min(dp[mask | subset],
                                       dp[mask] + incomp[subset]);
            }
        }

        int result = dp[(1 << n) - 1];
        return result == INT_MAX ? -1 : result;
    }
};
```

**時間複雜度:** O(3ⁿ)
**空間複雜度:** O(2ⁿ)

---

## 經典問題 4: 最小充足團隊 (Smallest Sufficient Team)

[LeetCode 1125. Smallest Sufficient Team](https://leetcode.com/problems/smallest-sufficient-team/)

### 問題描述

給定一個所需技能列表 req_skills,和一個人員列表 people,其中 people[i] 包含第 i 個人的技能列表。

找出任何充足的團隊,使得團隊中每個人的技能集合的並集包含所有必需的技能。返回團隊人員的索引,保證團隊大小最小。

**範例:**
```
輸入:
req_skills = ["java","nodejs","reactjs"]
people = [["java"],["nodejs"],["nodejs","reactjs"]]

輸出: [0,2]
解釋: 第 0 人有 java,第 2 人有 nodejs 和 reactjs
```

### 問題分析

**技能編碼:**
每個技能用一個位表示,每個人的技能集合用一個 mask 表示。

**狀態定義:**
- `dp[mask]`: 覆蓋技能集 mask 所需的最少人數

### 解法實現

```cpp
class Solution {
public:
    vector<int> smallestSufficientTeam(vector<string>& req_skills,
                                       vector<vector<string>>& people) {
        int n = req_skills.size();
        int m = people.size();

        // 技能到位的映射
        unordered_map<string, int> skillId;
        for (int i = 0; i < n; i++) {
            skillId[req_skills[i]] = i;
        }

        // 每個人的技能 mask
        vector<int> personSkills(m, 0);
        for (int i = 0; i < m; i++) {
            for (const string& skill : people[i]) {
                personSkills[i] |= (1 << skillId[skill]);
            }
        }

        // dp[mask]: 覆蓋 mask 技能的最小團隊
        vector<vector<int>> dp(1 << n);
        dp[0] = {};

        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask].empty() && mask != 0) continue;

            for (int i = 0; i < m; i++) {
                int newMask = mask | personSkills[i];
                if (newMask == mask) continue;  // 沒有新技能

                if (dp[newMask].empty() ||
                    dp[newMask].size() > dp[mask].size() + 1) {
                    dp[newMask] = dp[mask];
                    dp[newMask].push_back(i);
                }
            }
        }

        return dp[(1 << n) - 1];
    }
};
```

**時間複雜度:** O(2ⁿ × m)
**空間複雜度:** O(2ⁿ × m)

---

## 狀態壓縮 DP 總結

### 關鍵要點

1. **適用條件**
   - 集合大小 n ≤ 20
   - 涉及子集、集合操作
   - 需要記錄"哪些元素被使用"

2. **位元運算**
   - 掌握基本的位操作
   - 枚舉子集的技巧
   - popcount 計算集合大小

3. **狀態定義**
   - `dp[mask]`: 集合狀態
   - `dp[mask][i]`: 集合狀態 + 額外維度
   - mask 從 0 到 2ⁿ-1

4. **常見應用**
   - TSP (旅行商問題)
   - 集合覆蓋
   - 訪問所有節點
   - 組合優化

### 位運算技巧

```cpp
// 常用操作
(1 << n) - 1          // 全集 (n 個元素)
mask & (1 << i)       // 檢查第 i 位
mask | (1 << i)       // 添加第 i 個元素
mask & ~(1 << i)      // 刪除第 i 個元素
mask ^ (1 << i)       // 翻轉第 i 位
__builtin_popcount(mask)  // 集合大小

// 枚舉子集
for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
    // sub 是 mask 的子集
}
```

### 複雜度分析

- **時間複雜度:** 通常是 O(2ⁿ × n) 或 O(2ⁿ × n²)
  - 2ⁿ 個狀態
  - 每個狀態的轉移時間

- **空間複雜度:** O(2ⁿ) 或 O(2ⁿ × n)

### 常見錯誤

1. **集合大小超過限制**
   - n > 20 時,2ⁿ 太大,會 TLE 或 MLE

2. **位運算錯誤**
   - 優先級問題(需要加括號)
   - 左移溢出

3. **子集枚舉錯誤**
   - 枚舉順序不對
   - 漏掉空集或全集

4. **狀態轉移遺漏**
   - 沒有考慮所有可能的轉移

---

狀態壓縮 DP 是處理小規模集合問題的強大工具,雖然時間複雜度較高(指數級),但在 n ≤ 20 時仍然實用。掌握位運算和狀態壓縮技巧,可以優雅地解決許多看似複雜的組合優化問題。
