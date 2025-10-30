---
title: 09-5. Bit DP
order: 5
description: 狀態壓縮動態規劃與位元字典樹
tags:
  - bit manipulation
  - dynamic programming
  - bitmask DP
  - trie
  - 進階
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 5. Bit DP (位元動態規劃)

位元 DP（Bitmask DP）是一種使用位元來表示狀態的動態規劃技術，特別適合處理集合相關的問題。

## Bitmask DP (狀態壓縮 DP)

### 基本概念

當問題的狀態可以用一個小集合的子集來表示時，我們可以使用位元來編碼這些狀態，這樣可以：
1. 節省空間
2. 加速狀態轉移
3. 簡化程式碼

### 適用場景

- 集合元素數量較小（通常 n ≤ 20）
- 需要枚舉集合的所有子集
- 狀態可以用「選擇/不選擇」的組合表示
- 排列、組合問題

### 位元表示狀態

```
集合: {0, 1, 2, 3}

mask = 0101 (5) 表示選擇了元素 0 和 2
mask = 1111 (15) 表示選擇了所有元素
mask = 0000 (0) 表示空集合

檢查元素 i 是否被選擇: (mask >> i) & 1
設定元素 i 為選擇: mask | (1 << i)
移除元素 i: mask & ~(1 << i)
切換元素 i: mask ^ (1 << i)
```

### 經典範例：旅行商問題 (TSP)

**問題描述：**

有 n 個城市，已知城市之間的距離，從城市 0 出發，訪問所有城市一次後返回起點，求最短路徑。

**狀態定義：**

`dp[mask][i]` = 已訪問 mask 中的城市，當前在城市 i 的最短路徑

```cpp
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    const int INF = 1e9;

    // dp[mask][i] = 訪問 mask 中的城市，最後停在城市 i 的最短距離
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));

    // 起點：從城市 0 開始
    dp[1][0] = 0;

    // 枚舉所有狀態
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            // 如果城市 i 不在 mask 中，跳過
            if (!(mask & (1 << i))) continue;

            // 如果沒有到達城市 i 的路徑，跳過
            if (dp[mask][i] == INF) continue;

            // 嘗試訪問下一個城市 j
            for (int j = 0; j < n; j++) {
                // 如果城市 j 已經訪問過，跳過
                if (mask & (1 << j)) continue;

                // 更新狀態
                int new_mask = mask | (1 << j);
                dp[new_mask][j] = min(dp[new_mask][j],
                                     dp[mask][i] + dist[i][j]);
            }
        }
    }

    // 找到回到起點的最短路徑
    int result = INF;
    int all_visited = (1 << n) - 1;

    for (int i = 1; i < n; i++) {
        result = min(result, dp[all_visited][i] + dist[i][0]);
    }

    return result;
}
```

**狀態轉移示意圖（4 個城市）：**

```
起點: dp[0001][0] = 0

第 1 步: 從城市 0 出發
  dp[0011][1] = dp[0001][0] + dist[0][1]
  dp[0101][2] = dp[0001][0] + dist[0][2]
  dp[1001][3] = dp[0001][0] + dist[0][3]

第 2 步: 例如從 dp[0011][1]（訪問了 0,1，在 1）
  dp[0111][2] = min(dp[0111][2], dp[0011][1] + dist[1][2])
  dp[1011][3] = min(dp[1011][3], dp[0011][1] + dist[1][3])

...

最終: 所有城市都訪問過（mask = 1111）
  result = min(dp[1111][i] + dist[i][0]) for all i != 0
```

**時間複雜度：** O(n^2 × 2^n)
**空間複雜度：** O(n × 2^n)

### 經典範例：指派問題

**問題描述：**

有 n 個任務和 n 個工人，cost[i][j] 表示工人 i 完成任務 j 的成本。每個工人只能完成一個任務，每個任務只能被一個工人完成。求最小總成本。

```cpp
int assignmentProblem(vector<vector<int>>& cost) {
    int n = cost.size();
    const int INF = 1e9;

    // dp[mask] = 已分配 mask 中的任務的最小成本
    // 第 i 個任務分配給第 popcount(mask) 個工人
    vector<int> dp(1 << n, INF);
    dp[0] = 0;

    for (int mask = 0; mask < (1 << n); mask++) {
        int worker = __builtin_popcount(mask);  // 當前是第幾個工人

        // 枚舉下一個要分配的任務
        for (int task = 0; task < n; task++) {
            // 如果任務已分配，跳過
            if (mask & (1 << task)) continue;

            int new_mask = mask | (1 << task);
            dp[new_mask] = min(dp[new_mask],
                              dp[mask] + cost[worker][task]);
        }
    }

    return dp[(1 << n) - 1];
}
```

**時間複雜度：** O(n × 2^n)
**空間複雜度：** O(2^n)

## Bitwise Trie (位元字典樹)

位元字典樹（也稱為二進制 Trie）是一種用於處理整數 XOR 操作的資料結構。

### 基本結構

```cpp
class TrieNode {
public:
    TrieNode* children[2];  // 0 和 1 兩個子節點

    TrieNode() {
        children[0] = nullptr;
        children[1] = nullptr;
    }
};

class BitwiseTrie {
private:
    TrieNode* root;
    const int MAX_BITS = 31;  // 處理 32 位元整數

public:
    BitwiseTrie() {
        root = new TrieNode();
    }

    // 插入一個數字
    void insert(int num) {
        TrieNode* node = root;

        // 從最高位開始插入
        for (int i = MAX_BITS; i >= 0; i--) {
            int bit = (num >> i) & 1;

            if (node->children[bit] == nullptr) {
                node->children[bit] = new TrieNode();
            }

            node = node->children[bit];
        }
    }

    // 找出與 num XOR 值最大的數字
    int findMaxXor(int num) {
        TrieNode* node = root;
        int max_xor = 0;

        for (int i = MAX_BITS; i >= 0; i--) {
            int bit = (num >> i) & 1;

            // 優先選擇相反的位元（使 XOR 結果為 1）
            int opposite = 1 - bit;

            if (node->children[opposite] != nullptr) {
                max_xor |= (1 << i);
                node = node->children[opposite];
            } else {
                node = node->children[bit];
            }
        }

        return max_xor;
    }

    // 找出與 num XOR 值最小的數字
    int findMinXor(int num) {
        TrieNode* node = root;
        int min_xor = 0;

        for (int i = MAX_BITS; i >= 0; i--) {
            int bit = (num >> i) & 1;

            // 優先選擇相同的位元（使 XOR 結果為 0）
            if (node->children[bit] != nullptr) {
                node = node->children[bit];
            } else {
                min_xor |= (1 << i);
                node = node->children[1 - bit];
            }
        }

        return min_xor;
    }
};
```

### 應用範例

```cpp
// 使用範例
BitwiseTrie trie;

// 插入數字
trie.insert(3);   // 0011
trie.insert(10);  // 1010
trie.insert(5);   // 0101
trie.insert(25);  // 11001

// 找最大 XOR
int num = 11;  // 1011
int max_xor = trie.findMaxXor(num);  // 28 (11 ^ 25 = 1011 ^ 11001 = 10010)

cout << "Max XOR with " << num << " is: " << max_xor << endl;
```

## Gray Code (格雷碼)

### 定義

格雷碼是一個二進制數字系統，相鄰的兩個數值只有一個位元的差異。

### 生成方式

```cpp
vector<int> grayCode(int n) {
    int size = 1 << n;
    vector<int> result(size);

    for (int i = 0; i < size; i++) {
        result[i] = i ^ (i >> 1);
    }

    return result;
}

// 範例: n = 3
// 0: 000 ^ 000 = 000 (0)
// 1: 001 ^ 000 = 001 (1)
// 2: 010 ^ 001 = 011 (3)
// 3: 011 ^ 001 = 010 (2)
// 4: 100 ^ 010 = 110 (6)
// 5: 101 ^ 010 = 111 (7)
// 6: 110 ^ 011 = 101 (5)
// 7: 111 ^ 011 = 100 (4)
```

### 反向轉換（從格雷碼到二進制）

```cpp
int grayToBinary(int gray) {
    int binary = gray;

    while (gray >>= 1) {
        binary ^= gray;
    }

    return binary;
}

// 範例
int gray = 6;  // 110
int binary = grayToBinary(gray);  // 100 (4)
```

### 應用

1. **錯誤檢測：** 在資料傳輸中，相鄰數值只有一個位元差異，降低錯誤率
2. **卡諾圖：** 數位邏輯設計
3. **機械編碼器：** 位置編碼
4. **演算法問題：** 生成特定順序的序列

## LeetCode 題目

### 題目 1: 847. Shortest Path Visiting All Nodes

**題目連結：** https://leetcode.com/problems/shortest-path-visiting-all-nodes/

**題目描述：**

給定一個無向圖，返回訪問所有節點的最短路徑長度。可以從任意節點開始，可以重複訪問節點和邊。

**範例：**

```
輸入: graph = [[1,2,3],[0],[0],[0]]
輸出: 4
解釋: 從節點 1 開始: 1 -> 0 -> 2 -> 0 -> 3

輸入: graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]
輸出: 4
解釋: 從節點 0 開始: 0 -> 1 -> 4 -> 2 -> 3
```

**解法：**

```cpp
class Solution {
public:
    int shortestPathLength(vector<vector<int>>& graph) {
        int n = graph.size();
        int all_visited = (1 << n) - 1;

        // BFS with state (node, visited_mask)
        queue<pair<int, int>> q;
        set<pair<int, int>> visited;

        // 可以從任意節點開始
        for (int i = 0; i < n; i++) {
            int mask = 1 << i;
            q.push({i, mask});
            visited.insert({i, mask});
        }

        int steps = 0;

        while (!q.empty()) {
            int size = q.size();

            for (int i = 0; i < size; i++) {
                auto [node, mask] = q.front();
                q.pop();

                // 如果訪問了所有節點
                if (mask == all_visited) {
                    return steps;
                }

                // 訪問相鄰節點
                for (int next : graph[node]) {
                    int new_mask = mask | (1 << next);
                    auto state = make_pair(next, new_mask);

                    if (visited.find(state) == visited.end()) {
                        visited.insert(state);
                        q.push(state);
                    }
                }
            }

            steps++;
        }

        return -1;
    }
};
```

**解析：**

使用 BFS + 位元遮罩：
- 狀態：`(node, mask)`，表示當前在 node，已訪問 mask 中的節點
- 從所有節點開始搜尋（因為可以從任意節點開始）
- 當 mask 包含所有節點時，返回步數

**時間複雜度：** O(n^2 × 2^n)
**空間複雜度：** O(n × 2^n)

### 題目 2: 943. Find the Shortest Superstring

**題目連結：** https://leetcode.com/problems/find-the-shortest-superstring/

**題目描述：**

給定一個字串陣列 A，找到最短的字串 S，使得 A 中的每個字串都是 S 的子字串。

**範例：**

```
輸入: A = ["alex","loves","leetcode"]
輸出: "alexlovesleetcode"
解釋: 所有字串都是 "alexlovesleetcode" 的子字串

輸入: A = ["catg","ctaagt","gcta","ttca","atgcatc"]
輸出: "gctaagttcatgcatc"
```

**解法：**

```cpp
class Solution {
public:
    string shortestSuperstring(vector<string>& words) {
        int n = words.size();

        // overlap[i][j] = words[i] 和 words[j] 的最大重疊長度
        vector<vector<int>> overlap(n, vector<int>(n, 0));

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) continue;

                // 計算 words[i] 和 words[j] 的重疊
                int max_overlap = min(words[i].length(), words[j].length());
                for (int k = max_overlap; k >= 0; k--) {
                    if (words[i].substr(words[i].length() - k) ==
                        words[j].substr(0, k)) {
                        overlap[i][j] = k;
                        break;
                    }
                }
            }
        }

        // dp[mask][i] = 訪問 mask 中的字串，最後一個是 i 的最短長度
        const int INF = 1e9;
        vector<vector<int>> dp(1 << n, vector<int>(n, INF));
        vector<vector<int>> parent(1 << n, vector<int>(n, -1));

        // 初始化：從每個字串開始
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = words[i].length();
        }

        // DP
        for (int mask = 1; mask < (1 << n); mask++) {
            for (int i = 0; i < n; i++) {
                if (!(mask & (1 << i))) continue;
                if (dp[mask][i] == INF) continue;

                // 嘗試添加下一個字串 j
                for (int j = 0; j < n; j++) {
                    if (mask & (1 << j)) continue;

                    int new_mask = mask | (1 << j);
                    int new_len = dp[mask][i] + (int)words[j].length() - overlap[i][j];

                    if (new_len < dp[new_mask][j]) {
                        dp[new_mask][j] = new_len;
                        parent[new_mask][j] = i;
                    }
                }
            }
        }

        // 找到最短長度和結束字串
        int all_mask = (1 << n) - 1;
        int min_len = INF;
        int last = -1;

        for (int i = 0; i < n; i++) {
            if (dp[all_mask][i] < min_len) {
                min_len = dp[all_mask][i];
                last = i;
            }
        }

        // 重建路徑
        vector<int> path;
        int mask = all_mask;
        while (last != -1) {
            path.push_back(last);
            int prev = parent[mask][last];
            mask ^= (1 << last);
            last = prev;
        }

        reverse(path.begin(), path.end());

        // 建構結果
        string result = words[path[0]];
        for (int i = 1; i < path.size(); i++) {
            int prev = path[i - 1];
            int curr = path[i];
            result += words[curr].substr(overlap[prev][curr]);
        }

        return result;
    }
};
```

**時間複雜度：** O(n^2 × 2^n)
**空間複雜度：** O(n × 2^n)

### 題目 3: 1125. Smallest Sufficient Team

**題目連結：** https://leetcode.com/problems/smallest-sufficient-team/

**題目描述：**

公司需要一個專案團隊，每個人有不同的技能。給定所需技能列表和每個人的技能，找到最小的團隊，使其具備所有所需技能。

**範例：**

```
輸入:
req_skills = ["java","nodejs","reactjs"]
people = [["java"],["nodejs"],["nodejs","reactjs"]]
輸出: [0,2]
解釋: 選擇 person 0 (java) 和 person 2 (nodejs, reactjs)
```

**解法：**

```cpp
class Solution {
public:
    vector<int> smallestSufficientTeam(vector<string>& req_skills,
                                       vector<vector<string>>& people) {
        int n_skills = req_skills.size();
        int n_people = people.size();

        // 將技能名稱映射到位元位置
        unordered_map<string, int> skill_id;
        for (int i = 0; i < n_skills; i++) {
            skill_id[req_skills[i]] = i;
        }

        // 將每個人的技能轉換為位元遮罩
        vector<int> people_skills(n_people, 0);
        for (int i = 0; i < n_people; i++) {
            for (const string& skill : people[i]) {
                people_skills[i] |= (1 << skill_id[skill]);
            }
        }

        // dp[mask] = 達到技能集 mask 的最小團隊
        int all_skills = (1 << n_skills) - 1;
        vector<vector<int>> dp(1 << n_skills);
        dp[0] = {};

        for (int mask = 0; mask < (1 << n_skills); mask++) {
            if (mask != 0 && dp[mask].empty()) continue;

            // 嘗試添加每個人
            for (int i = 0; i < n_people; i++) {
                int new_mask = mask | people_skills[i];

                if (new_mask == mask) continue;  // 這個人沒有新技能

                if (dp[new_mask].empty() ||
                    dp[new_mask].size() > dp[mask].size() + 1) {
                    dp[new_mask] = dp[mask];
                    dp[new_mask].push_back(i);
                }
            }
        }

        return dp[all_skills];
    }
};
```

**時間複雜度：** O(n_people × 2^n_skills)
**空間複雜度：** O(2^n_skills)

### 題目 4: 421. Maximum XOR of Two Numbers in an Array

**題目連結：** https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/

**題目描述：**

給定一個整數陣列，找出陣列中兩個數字的最大 XOR 值。

**範例：**

```
輸入: nums = [3,10,5,25,2,8]
輸出: 28
解釋: 最大 XOR 是 5 ^ 25 = 28

輸入: nums = [14,70,53,83,49,91,36,80,92,51,66,70]
輸出: 127
```

**解法：**

```cpp
class Solution {
private:
    class TrieNode {
    public:
        TrieNode* children[2];

        TrieNode() {
            children[0] = nullptr;
            children[1] = nullptr;
        }
    };

    TrieNode* root;
    const int MAX_BITS = 31;

    void insert(int num) {
        TrieNode* node = root;

        for (int i = MAX_BITS; i >= 0; i--) {
            int bit = (num >> i) & 1;

            if (node->children[bit] == nullptr) {
                node->children[bit] = new TrieNode();
            }

            node = node->children[bit];
        }
    }

    int findMaxXor(int num) {
        TrieNode* node = root;
        int max_xor = 0;

        for (int i = MAX_BITS; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int opposite = 1 - bit;

            if (node->children[opposite] != nullptr) {
                max_xor |= (1 << i);
                node = node->children[opposite];
            } else {
                node = node->children[bit];
            }
        }

        return max_xor;
    }

public:
    int findMaximumXOR(vector<int>& nums) {
        root = new TrieNode();

        // 插入所有數字
        for (int num : nums) {
            insert(num);
        }

        // 找最大 XOR
        int max_xor = 0;
        for (int num : nums) {
            max_xor = max(max_xor, findMaxXor(num));
        }

        return max_xor;
    }
};
```

**解析：**

使用位元字典樹：
1. 將所有數字插入 Trie（從最高位開始）
2. 對於每個數字，在 Trie 中貪心地選擇相反的位元，使 XOR 最大

```
範例: nums = [3, 10, 5, 25]

插入 3 (00011):
  Root -> 0 -> 0 -> 0 -> 1 -> 1

插入 10 (01010):
  Root -> 0 -> 1 -> 0 -> 1 -> 0

插入 5 (00101):
  Root -> 0 -> 0 -> 1 -> 0 -> 1

插入 25 (11001):
  Root -> 1 -> 1 -> 0 -> 0 -> 1

查詢 5 (00101) 的最大 XOR:
  位 4 (0): 選擇 1 → XOR 第 4 位 = 1
  位 3 (0): 選擇 1 → XOR 第 3 位 = 1
  位 2 (1): 選擇 0 → XOR 第 2 位 = 1
  位 1 (0): 選擇 0 → XOR 第 1 位 = 0
  位 0 (1): 選擇 0 → XOR 第 0 位 = 1
  結果: 11100 = 28 (5 ^ 25)
```

**時間複雜度：** O(n × L)，L 是位元數（32）
**空間複雜度：** O(n × L)

### 題目 5: 89. Gray Code

**題目連結：** https://leetcode.com/problems/gray-code/

（已在 bitwise_tricks.md 中介紹）

## 複雜度分析

### Bitmask DP
- **時間複雜度：** 通常為 O(n × 2^n) 或 O(n^2 × 2^n)
- **空間複雜度：** O(2^n) 或 O(n × 2^n)
- **適用範圍：** n ≤ 20（2^20 ≈ 100 萬）

### Bitwise Trie
- **插入：** O(L)，L 是位元數
- **查詢：** O(L)
- **空間：** O(n × L)

## 常見陷阱

### 1. 狀態數量爆炸

```cpp
// 危險：n = 25 時，2^25 = 33 百萬，可能 TLE 或 MLE
int n = 25;
vector<int> dp(1 << n);  // 128 MB！
```

### 2. 忘記檢查位元是否已設定

```cpp
// 錯誤
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        // 沒有檢查 i 是否在 mask 中
        dp[mask][i] = ...;  // 錯誤！
    }
}

// 正確
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;  // 檢查位元
        dp[mask][i] = ...;
    }
}
```

### 3. 位移溢位

```cpp
// 危險：當 n = 31 時，1 << 31 會溢位
int all_mask = 1 << n;

// 正確
int all_mask = (1 << n) - 1;
// 或使用 long long
long long all_mask = 1LL << n;
```

## 優化技巧

### 1. 只枚舉必要的狀態

```cpp
// 不需要枚舉所有 2^n 個狀態
// 使用 BFS/DFS 只訪問可達的狀態

queue<int> q;
set<int> visited;

q.push(initial_state);
visited.insert(initial_state);

while (!q.empty()) {
    int mask = q.front();
    q.pop();

    // 只處理可達的狀態
    for (int next_mask : get_next_states(mask)) {
        if (visited.find(next_mask) == visited.end()) {
            visited.insert(next_mask);
            q.push(next_mask);
        }
    }
}
```

### 2. 狀態壓縮

```cpp
// 如果某些狀態是等價的，可以進一步壓縮
// 例如：旋轉、鏡像對稱的狀態
```

### 3. 預處理

```cpp
// 預先計算所有可能的狀態轉移
vector<vector<int>> transitions(1 << n);

for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if (!(mask & (1 << i))) {
            transitions[mask].push_back(mask | (1 << i));
        }
    }
}
```

## 小結

位元 DP 和相關技術是解決組合優化問題的強大工具：

1. **Bitmask DP：** 適合集合相關的動態規劃問題
2. **Bitwise Trie：** 高效處理 XOR 相關問題
3. **Gray Code：** 相鄰數值只有一個位元差異的編碼

關鍵要點：
- 適用於小規模問題（n ≤ 20）
- 使用位元表示狀態可以節省空間和時間
- 需要注意溢位和狀態數量
- 結合其他演算法（BFS、DFS）可以進一步優化

掌握這些技巧能夠：
- 解決 NP-hard 問題的小規模實例
- 優化演算法的時間和空間複雜度
- 在競賽和實際開發中靈活應用
