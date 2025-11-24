---
title: 15-1. LeetCode 78. Subsets - 九種解法詳解與效能分析
order: 1
description: 深入探討子集生成問題的九種不同實作方式，包含 DFS、位元運算、BFS、DP 等，並進行效能基準測試
tags:
  - backtracking
  - bit-manipulation
  - dfs
  - bfs
  - dynamic-programming
  - divide-and-conquer
author: Rain Hu
date: '2025-11-19'
draft: false
subscription: member
---

# 15-1. LeetCode 78. Subsets - 九種解法詳解與效能分析

## 問題描述

給定一個**不含重複元素**的整數陣列 `nums`，返回該陣列所有可能的子集（冪集）。

**注意：** 解集不能包含重複的子集。可以按**任意順序**返回解集。

**範例：**
```
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

對於長度為 n 的陣列，子集總數為 2^n 個（包含空集合）。

---

## 核心概念

子集生成問題是組合問題的經典案例，可以從多個角度思考：

1. **選擇視角**：對每個元素，選擇「要」或「不要」
2. **順序視角**：從左到右依次決定加入哪些元素
3. **位元視角**：用二進位表示每個元素的選取狀態
4. **遞增視角**：從空集開始，逐步添加元素構建新子集

這些不同的視角對應了不同的實作方法。

---

## 方法一：DFS 回溯（Start Index）

### 核心思想

從位置 `start` 開始，依次嘗試選擇每個元素加入當前路徑，然後遞迴處理後續元素。每次遞迴都將當前路徑加入結果集。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> path;
    function<void(int)> dfs = [&](int start) {
        res.push_back(path);  // 將當前路徑加入結果
        for (int i = start; i < nums.size(); i++) {
            path.push_back(nums[i]);
            dfs(i + 1);  // 遞迴處理下一個位置
            path.pop_back();  // 回溯
        }
    };
    dfs(0);
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 共有 2^n 個子集
  - 每個子集平均長度為 n/2，複製到結果需要 O(n/2)
  - 總時間為 O(2^n × n)

- **空間複雜度：** O(n)
  - 遞迴深度最多 n 層
  - 不計算輸出空間，只需 O(n) 的遞迴棧空間和路徑空間

### 特點

- 最符合直覺的回溯解法
- 生成的子集順序：按字典序從小到大
- 適合理解回溯框架的學習者

---

## 方法二：DFS 二元樹枚舉

### 核心思想

將問題視為二元決策樹：對每個元素 `nums[i]`，有「選」和「不選」兩種選擇。遞迴到葉子節點時，將當前路徑加入結果。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> path;
    function<void(int)> dfs = [&](int i) {
        if (i == nums.size()) {
            res.push_back(path);  // 到達葉子節點
            return;
        }
        // 不選 nums[i]
        dfs(i + 1);
        // 選 nums[i]
        path.push_back(nums[i]);
        dfs(i + 1);
        path.pop_back();
    };
    dfs(0);
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 二元決策樹共有 2^n 個葉子節點
  - 每個葉子節點需要 O(n) 時間複製路徑

- **空間複雜度：** O(n)
  - 遞迴深度恰好為 n

### 特點

- 決策樹結構清晰，易於理解
- 先探索「不選」的分支，後探索「選」的分支
- 生成順序與方法一不同

---

## 方法三：位元運算枚舉

### 核心思想

用 n 位元的二進位數表示子集：第 i 位為 1 表示選擇 `nums[i]`，為 0 表示不選。枚舉所有 2^n 個二進位數即可得到所有子集。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    int n = nums.size();
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> path;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                path.push_back(nums[i]);
            }
        }
        res.push_back(path);
    }
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 外層迴圈 2^n 次
  - 內層檢查 n 個位元

- **空間複雜度：** O(1)
  - 不計算輸出，只需常數額外空間

### 特點

- 不使用遞迴，代碼簡潔
- 適合處理元素數量較少的情況（n ≤ 20）
- 生成順序為二進位遞增順序
- 易於理解位元操作的應用

---

## 方法四：迭代 + 棧模擬

### 核心思想

用棧模擬方法一的遞迴過程，將遞迴改為迭代實現。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    stack<pair<int, vector<int>>> st;
    st.push({0, {}});
    while (!st.empty()) {
        auto [idx, path] = st.top();
        st.pop();
        res.push_back(path);
        for (int i = nums.size() - 1; i >= idx; i--) {
            path.push_back(nums[i]);
            st.push({i + 1, path});
            path.pop_back();
        }
    }
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 每個子集都會被處理一次

- **空間複雜度：** O(n × 2^n)
  - 棧中可能同時存在多個路徑
  - 最壞情況下棧的大小接近 O(2^n)

### 特點

- 避免了遞迴，適合對遞迴深度有限制的環境
- 空間開銷較大，需要存儲中間狀態
- 從右向左遍歷以保持與遞迴版本相同的順序

---

## 方法五：Gray Code 位元枚舉

### 核心思想

使用 Gray Code（格雷碼）順序枚舉所有子集。Gray Code 的特點是相鄰兩個數只有一個位元不同，這意味著相鄰子集只差一個元素。

格雷碼的生成公式：`gray = n ^ (n >> 1)`

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    int n = nums.size();
    for (int g = 0; g < (1 << n); g++) {
        int mask = g ^ (g >> 1);  // 將 g 轉換為 Gray Code
        vector<int> path;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                path.push_back(nums[i]);
            }
        }
        res.push_back(path);
    }
    return res;
}
```

### Gray Code 生成示例

```cpp
//  g    gray code (mask)      subset
// 000    000 ^ 000 = 000       []
// 001    001 ^ 000 = 001       [1]
// 010    010 ^ 001 = 011       [1,2]
// 011    011 ^ 001 = 010       [2]
// 100    100 ^ 010 = 110       [2,3]
// 101    101 ^ 010 = 111       [1,2,3]
// 110    110 ^ 011 = 101       [1,3]
// 111    111 ^ 011 = 100       [3]
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 與普通位元枚舉相同

- **空間複雜度：** O(1)
  - 不計算輸出空間

### 特點

- 相鄰子集只差一個元素，適合需要漸進式變化的場景
- 在硬體設計中廣泛應用
- 生成順序獨特，有特殊的應用價值

---

## 方法六：Cascade（迭代構建）

### 核心思想

從空集開始，每次加入一個新元素時，將現有所有子集複製一份，並在複製的子集中加入新元素。這類似於 Haskell 的 `foldr` 操作。

**構建過程：**
```
初始: [[]]
加入1: [[], [1]]
加入2: [[], [1], [2], [1,2]]
加入3: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res = {{}};  // 從空集開始
    auto merge = [&](int num) {
        vector<vector<int>> a = res;  // 複製現有子集
        for (auto s : a) {
            s.push_back(num);
            res.push_back(s);
        }
    };
    for (const auto& num : nums) {
        merge(num);
    }
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 第 i 次迭代處理 2^i 個子集
  - 總時間：Σ(i=0 to n-1) 2^i × (平均子集長度) ≈ O(n × 2^n)

- **空間複雜度：** O(2^n)
  - 需要額外空間複製子集

### 特點

- 非常直觀，易於理解
- 適合函數式編程思維
- 空間開銷較大，需要複製子集
- 生成順序為層次遞增

---

## 方法七：BFS（廣度優先搜尋）

### 核心思想

與 Cascade 方法類似，但更強調 BFS 的層次遍歷概念。每一層代表加入一個新元素後的所有可能子集。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res = {{}};
    for (int num : nums) {
        int size = res.size();  // 記錄當前層的大小
        for (int i = 0; i < size; i++) {
            vector<int> subset = res[i];
            subset.push_back(num);
            res.push_back(subset);
        }
    }
    return res;
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 與 Cascade 相同

- **空間複雜度：** O(1)
  - 不計算輸出，只需常數額外空間
  - 直接在結果集上操作，不需要額外複製

### 特點

- 與 Cascade 本質相同，但實作更簡潔
- 強調層次遍歷的 BFS 思想
- 適合理解 BFS 在組合問題中的應用

---

## 方法八：動態規劃

### 核心思想

定義 `dp[i]` 為前 i 個元素的所有子集。轉移方程為：

```
dp[i+1] = dp[i] ∪ {s ∪ {nums[i]} | s ∈ dp[i]}
```

即：前 i+1 個元素的子集 = 前 i 個元素的子集 + 前 i 個元素的子集都加上 nums[i]。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<vector<int>>> dp(n + 1);
    dp[0] = {{}};  // 空集

    for (int i = 0; i < n; i++) {
        dp[i + 1] = dp[i];  // 繼承前 i 個元素的子集
        for (auto subset : dp[i]) {
            subset.push_back(nums[i]);
            dp[i + 1].push_back(subset);
        }
    }
    return dp[n];
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 每個元素處理所有前綴子集

- **空間複雜度：** O(n × 2^n)
  - 需要存儲所有中間狀態 dp[0] 到 dp[n]

### 特點

- 明確的動態規劃結構
- 適合理解 DP 在組合問題中的應用
- 空間開銷較大，不適合大規模數據

---

## 方法九：分治法（Divide and Conquer）

### 核心思想

將陣列分為左右兩部分，分別求出左半部分和右半部分的所有子集，然後將它們組合起來。

**遞迴關係：**
```
subsets([1,2,3,4]) = combine(subsets([1,2]), subsets([3,4]))
```

組合方式：左邊的每個子集 × 右邊的每個子集。

### 實作

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    function<vector<vector<int>>(int, int)> divide = [&](int left, int right) -> vector<vector<int>> {
        if (left >= right) {
            return {{}};  // 空區間返回空集
        }
        if (left + 1 == right) {
            return {{}, {nums[left]}};  // 單元素
        }

        int mid = (left + right) / 2;
        auto leftSubsets = divide(left, mid);
        auto rightSubsets = divide(mid, right);

        vector<vector<int>> res;
        for (const auto& ls : leftSubsets) {
            for (const auto& rs : rightSubsets) {
                vector<int> combined = ls;
                combined.insert(combined.end(), rs.begin(), rs.end());
                res.push_back(combined);
            }
        }
        return res;
    };

    return divide(0, nums.size());
}
```

### 複雜度分析

- **時間複雜度：** O(n × 2^n)
  - 遞迴樹高度為 log n
  - 每層處理 2^n 個子集
  - 總時間仍為 O(n × 2^n)

- **空間複雜度：** O(n × 2^n)
  - 遞迴深度 O(log n)
  - 但需要存儲中間結果

### 特點

- 經典的分治思想
- 適合並行化處理
- 空間開銷較大
- 適合理解分治法的應用

---

## 效能基準測試

我們對九種方法進行了效能測試，以下是測試結果：

### 測試環境

- 編譯器：g++ -std=c++17 -O2
- 測試數據：輸入大小從 8 到 16

### 測試結果

#### n = 8（256 個子集）

| 方法 | 時間（μs/op） |
|------|---------------|
| DFS (binary tree) | **14** |
| DFS (start index) | **18** |
| BFS | 26 |
| Iterative Stack | 32 |
| Divide and Conquer | 33 |
| Gray Code | 40 |
| Bit Manipulation | 41 |
| Cascade | 41 |
| Dynamic Programming | 52 |

#### n = 12（4096 個子集）

| 方法 | 時間（μs/op） |
|------|---------------|
| DFS (binary tree) | **206** |
| DFS (start index) | **209** |
| BFS | 460 |
| Divide and Conquer | 485 |
| Iterative Stack | 553 |
| Cascade | 675 |
| Dynamic Programming | 862 |
| Bit Manipulation | 869 |
| Gray Code | 882 |

#### n = 16（65536 個子集）

| 方法 | 時間（μs/op） |
|------|---------------|
| DFS (binary tree) | **3608** |
| DFS (start index) | **3650** |
| Divide and Conquer | 8196 |
| BFS | 8242 |
| Iterative Stack | 9588 |
| Cascade | 12210 |
| Dynamic Programming | 15734 |
| Bit Manipulation | 16777 |
| Gray Code | 16889 |

### 測試分析

#### 效能排名

1. **頂尖效能（推薦使用）：**
   - DFS (binary tree) 和 DFS (start index) 在所有規模下都表現最佳
   - 效能差異極小，可視為同一檔次

2. **優秀效能：**
   - BFS 和 Divide and Conquer 在大規模數據下表現良好
   - n=16 時僅比 DFS 慢約 2-2.3 倍

3. **中等效能：**
   - Iterative Stack 和 Cascade 表現中規中矩
   - 適合對遞迴深度有限制的場景

4. **較慢效能：**
   - Bit Manipulation、Gray Code 和 DP 在大規模下明顯較慢
   - n=16 時比 DFS 慢約 4-5 倍

#### 關鍵洞察

1. **DFS 方法勝出的原因：**
   - 遞迴調用開銷小
   - 直接操作路徑，無需頻繁複製子集
   - 編譯器優化效果好

2. **位元運算方法較慢的原因：**
   - 雖然理論上簡潔，但每次都要檢查 n 個位元
   - 生成子集時需要動態分配 vector
   - 缺少剪枝優化

3. **BFS 和 Divide & Conquer 的優勢：**
   - 適合並行化（雖然本測試是單執行緒）
   - 程式碼結構清晰
   - 在大規模下仍有不錯表現

4. **Cascade 和 DP 的劣勢：**
   - 需要大量複製子集
   - 記憶體分配開銷大
   - 空間局部性差

---

## 方法選擇建議

### 面試推薦

1. **DFS (start index)** - 最推薦
   - 效能最佳
   - 代碼簡潔
   - 符合回溯框架
   - 易於擴展到其他組合問題

2. **BFS / Cascade** - 次推薦
   - 思路直觀，易於理解
   - 適合展示對 BFS 的理解

### 實際應用推薦

1. **小規模數據（n ≤ 15）：** DFS (start index)
2. **需要並行處理：** Divide and Conquer
3. **需要迭代實現：** BFS
4. **需要特殊順序：** Gray Code

### 學習推薦順序

1. **初學者：** Cascade / BFS → 理解子集構建過程
2. **進階：** DFS (start index) → 掌握回溯框架
3. **深入：** Bit Manipulation → 理解位元運算應用
4. **擴展：** Gray Code、Divide and Conquer → 學習特殊技巧

---

## 擴展問題

1. **LeetCode 90. Subsets II：** 陣列包含重複元素
   - 需要排序 + 剪枝避免重複子集

2. **子集和問題（Subset Sum）：** 找出和為目標值的子集
   - 可用 DP 或回溯 + 剪枝

3. **k-子集問題：** 只生成大小為 k 的子集
   - 在回溯中加入長度限制

---

## 總結

子集生成問題展示了多種演算法思維的應用：

- **回溯法（DFS）：** 最高效、最實用
- **位元運算：** 簡潔但效能一般
- **BFS/Cascade：** 直觀易懂
- **DP：** 展示動態規劃思想
- **分治：** 適合並行化

在實際應用中，應根據問題規模、是否需要並行、對順序的要求等因素選擇合適的方法。對於大多數情況，**DFS (start index)** 是最佳選擇。

---

## 相關資源

- [LeetCode 78. Subsets](https://leetcode.com/problems/subsets/)
- [LeetCode 90. Subsets II](https://leetcode.com/problems/subsets-ii/)
