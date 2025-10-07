---
title: "拓撲排序 (Topological Sort)"
order: 3
description: "有向無環圖的線性排序 - Kahn 演算法與 DFS 方法"
tags: ["graph", "topological sort", "DAG", "Kahn algorithm"]
---

# 拓撲排序 (Topological Sort)

拓撲排序是將**有向無環圖 (DAG)** 的所有頂點排成一個線性序列，使得對於任意有向邊 (u, v)，u 都排在 v 之前。

## 基本概念

### 什麼是拓撲排序？

拓撲排序是 DAG 的一種線性排序，滿足：
- 如果存在邊 u → v，則 u 在 v 前面
- 只有 DAG 才有拓撲排序（有環則無解）
- 拓撲排序可能不唯一

### 應用場景

1. **任務排程**：確定任務的執行順序
2. **課程安排**：確定課程的修習順序
3. **編譯依賴**：確定模組的編譯順序
4. **製作流程**：確定製作步驟的先後

### 範例

```
課程依賴關係：
    0 → 1 → 3
    ↓   ↓
    2 → 4

一種拓撲排序：0 → 1 → 2 → 3 → 4
另一種排序：    0 → 2 → 1 → 3 → 4
（都是合法的）
```

## 方法 1：Kahn 演算法 (BFS)

### 核心思想

1. 計算所有節點的**入度 (in-degree)**
2. 將入度為 0 的節點加入隊列
3. 每次從隊列取出一個節點，將其鄰居的入度減 1
4. 如果鄰居入度變為 0，加入隊列
5. 重複直到隊列為空

### 實現

```cpp
class Solution {
public:
    vector<int> topologicalSort(int n, vector<vector<int>>& edges) {
        // 建圖
        vector<vector<int>> adj(n);
        vector<int> indegree(n, 0);

        for (auto& e : edges) {
            int u = e[0], v = e[1];
            adj[u].push_back(v);
            indegree[v]++;
        }

        // Kahn 演算法
        queue<int> q;
        vector<int> result;

        // 1. 將入度為 0 的節點入隊
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }

        // 2. BFS 處理
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);

            // 3. 減少鄰居的入度
            for (int neighbor : adj[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }

        // 4. 檢查是否有環（如果有環，result.size() < n）
        if (result.size() != n) {
            return {};  // 有環，無法拓撲排序
        }

        return result;
    }
};
```

### 視覺化過程

```
範例圖：
    0 → 1 → 3
    ↓   ↓
    2 → 4

入度：[0, 1, 1, 1, 2]

步驟 1：入度為 0 的節點：{0}
        隊列：[0]

步驟 2：處理 0，減少鄰居入度
        入度：[0, 0, 0, 1, 2]
        隊列：[1, 2]
        結果：[0]

步驟 3：處理 1
        入度：[0, 0, 0, 0, 1]
        隊列：[2, 3]
        結果：[0, 1]

步驟 4：處理 2
        入度：[0, 0, 0, 0, 0]
        隊列：[3, 4]
        結果：[0, 1, 2]

步驟 5：處理 3, 4
        結果：[0, 1, 2, 3, 4]
```

## 方法 2：DFS 後序遍歷

### 核心思想

1. DFS 遍歷圖，使用三色標記檢測環
2. 在後序位置（DFS 返回前）將節點加入結果
3. 反轉結果得到拓撲排序

### 實現

```cpp
class Solution {
private:
    // 0: 白色（未訪問）
    // 1: 灰色（正在訪問）
    // 2: 黑色（已完成）
    bool dfs(int node, vector<vector<int>>& adj, vector<int>& color,
             vector<int>& result) {
        color[node] = 1;  // 標記為灰色

        for (int neighbor : adj[node]) {
            if (color[neighbor] == 1) {
                return false;  // 有環
            }
            if (color[neighbor] == 0) {
                if (!dfs(neighbor, adj, color, result)) {
                    return false;
                }
            }
        }

        color[node] = 2;  // 標記為黑色
        result.push_back(node);  // 後序位置加入結果
        return true;
    }

public:
    vector<int> topologicalSort(int n, vector<vector<int>>& edges) {
        // 建圖
        vector<vector<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
        }

        vector<int> color(n, 0);
        vector<int> result;

        // DFS 所有節點
        for (int i = 0; i < n; i++) {
            if (color[i] == 0) {
                if (!dfs(i, adj, color, result)) {
                    return {};  // 有環
                }
            }
        }

        // 反轉結果
        reverse(result.begin(), result.end());
        return result;
    }
};
```

### 為什麼要反轉？

DFS 後序遍歷的順序是**完成時間的逆序**：
- 最後完成的節點（葉子節點）先加入結果
- 最先完成的節點（起始節點）後加入結果
- 因此需要反轉

```
DFS 後序：4 → 3 → 2 → 1 → 0
反轉後：  0 → 1 → 2 → 3 → 4（正確的拓撲排序）
```

## 兩種方法比較

| 特性 | Kahn (BFS) | DFS 後序 |
|------|-----------|---------|
| 數據結構 | Queue + 入度陣列 | 遞迴棧 + 顏色陣列 |
| 時間複雜度 | O(V + E) | O(V + E) |
| 空間複雜度 | O(V + E) | O(V + E) |
| 環檢測 | 通過結果長度 | 通過灰色節點 |
| 實現難度 | 簡單 | 中等 |
| 推薦度 | 高（LeetCode 常用） | 中 |

## LeetCode 題目詳解

### 1. [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

**題目**：判斷能否完成所有課程（檢測環）。

**解法**：Kahn 演算法

```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);

        // 建圖：[a, b] 表示要先修 b 才能修 a
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }

        queue<int> q;
        int count = 0;

        // 入度為 0 的課程可以先修
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }

        while (!q.empty()) {
            int course = q.front();
            q.pop();
            count++;

            for (int next : adj[course]) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }

        return count == numCourses;  // 所有課程都能修完
    }
};
```

**複雜度**：
- 時間：O(V + E)
- 空間：O(V + E)

### 2. [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**題目**：返回課程的修習順序。

**解法**：Kahn 演算法（記錄順序）

```cpp
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);

        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }

        queue<int> q;
        vector<int> result;

        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }

        while (!q.empty()) {
            int course = q.front();
            q.pop();
            result.push_back(course);  // 記錄順序

            for (int next : adj[course]) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }

        if (result.size() != numCourses) {
            return {};  // 有環
        }

        return result;
    }
};
```

### 3. [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)

**題目**：根據外星字典的單詞順序，推導字母順序。

**解法**：建圖 + 拓撲排序

```cpp
class Solution {
public:
    string alienOrder(vector<string>& words) {
        // 建圖
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> indegree;

        // 初始化：所有字母入度為 0
        for (string& word : words) {
            for (char c : word) {
                indegree[c] = 0;
            }
        }

        // 比較相鄰單詞，找出字母順序
        for (int i = 0; i < words.size() - 1; i++) {
            string word1 = words[i];
            string word2 = words[i + 1];
            int minLen = min(word1.size(), word2.size());

            // 檢查無效情況：word1 是 word2 的前綴但更長
            if (word1.size() > word2.size() &&
                word1.substr(0, minLen) == word2.substr(0, minLen)) {
                return "";
            }

            // 找第一個不同的字母
            for (int j = 0; j < minLen; j++) {
                char c1 = word1[j];
                char c2 = word2[j];
                if (c1 != c2) {
                    // c1 < c2（c1 在 c2 前面）
                    if (adj[c1].find(c2) == adj[c1].end()) {
                        adj[c1].insert(c2);
                        indegree[c2]++;
                    }
                    break;
                }
            }
        }

        // Kahn 演算法
        queue<char> q;
        for (auto& [c, deg] : indegree) {
            if (deg == 0) {
                q.push(c);
            }
        }

        string result;
        while (!q.empty()) {
            char c = q.front();
            q.pop();
            result += c;

            for (char next : adj[c]) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }

        // 檢查是否有環
        if (result.size() != indegree.size()) {
            return "";
        }

        return result;
    }
};
```

**關鍵點**：
1. 只比較相鄰單詞
2. 找到第一個不同字母即可確定順序
3. 注意無效情況（如 "abc" 在 "ab" 前面）

**複雜度**：
- 時間：O(C)，C 為所有單詞的總字符數
- 空間：O(1)，最多 26 個字母

### 4. [310. Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)

**題目**：找出能形成最小高度樹的根節點。

**解法**：反向拓撲排序（從葉子節點開始剝離）

```cpp
class Solution {
public:
    vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
        if (n == 1) return {0};

        // 建圖
        vector<unordered_set<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].insert(e[1]);
            adj[e[1]].insert(e[0]);
        }

        // 找出所有葉子節點（度為 1）
        queue<int> leaves;
        for (int i = 0; i < n; i++) {
            if (adj[i].size() == 1) {
                leaves.push(i);
            }
        }

        // 逐層剝離葉子節點
        int remaining = n;
        while (remaining > 2) {
            int size = leaves.size();
            remaining -= size;

            for (int i = 0; i < size; i++) {
                int leaf = leaves.front();
                leaves.pop();

                // 移除葉子節點，更新鄰居的度
                for (int neighbor : adj[leaf]) {
                    adj[neighbor].erase(leaf);
                    if (adj[neighbor].size() == 1) {
                        leaves.push(neighbor);
                    }
                }
            }
        }

        // 剩下的節點就是結果
        vector<int> result;
        while (!leaves.empty()) {
            result.push_back(leaves.front());
            leaves.pop();
        }
        return result;
    }
};
```

**關鍵洞察**：
- 最小高度樹的根節點在圖的「中心」
- 從外向內剝離葉子節點，最後剩下的 1-2 個節點就是中心

**複雜度**：
- 時間：O(V)
- 空間：O(V)

## 常見陷阱與技巧

### 陷阱

1. **忘記檢查環**
   ```cpp
   // 錯誤：沒檢查環
   return result;

   // 正確：檢查結果長度
   if (result.size() != n) return {};
   return result;
   ```

2. **邊的方向搞反**
   ```cpp
   // prerequisites[i] = [a, b] 表示要先修 b 才能修 a
   // 建圖時：b → a（不是 a → b）
   adj[b].push_back(a);
   ```

3. **DFS 方法忘記反轉**
   ```cpp
   // DFS 後序遍歷後必須反轉
   reverse(result.begin(), result.end());
   ```

4. **入度計算錯誤**
   ```cpp
   // 正確：指向該節點的邊數
   for (auto& [u, v] : edges) {
       indegree[v]++;  // v 的入度+1
   }
   ```

### 進階技巧

1. **字典序最小的拓撲排序**
   ```cpp
   // 使用優先隊列（小根堆）代替普通隊列
   priority_queue<int, vector<int>, greater<int>> pq;
   ```

2. **找出所有拓撲排序**
   ```cpp
   void findAllTopologicalSorts(/* ... */) {
       // 使用回溯法
       for (int i = 0; i < n; i++) {
           if (indegree[i] == 0 && !visited[i]) {
               // 選擇 i
               visited[i] = true;
               path.push_back(i);
               // 減少鄰居入度
               // 遞迴
               // 恢復狀態（回溯）
           }
       }
   }
   ```

3. **檢測唯一拓撲排序**
   ```cpp
   // 如果每次隊列中只有一個元素，則拓撲排序唯一
   bool hasUniqueTopo = true;
   while (!q.empty()) {
       if (q.size() > 1) hasUniqueTopo = false;
       // ...
   }
   ```

## 總結

### 拓撲排序特點

| 特性 | 說明 |
|------|------|
| 適用圖類型 | 有向無環圖 (DAG) |
| 時間複雜度 | O(V + E) |
| 空間複雜度 | O(V + E) |
| 環檢測 | 自動檢測 |
| 結果唯一性 | 可能不唯一 |

### 方法選擇

| 需求 | 推薦方法 |
|------|---------|
| 一般拓撲排序 | Kahn (BFS) |
| 需要路徑信息 | DFS |
| 字典序最小 | Kahn + 優先隊列 |
| 所有排序 | DFS + 回溯 |

**實戰建議**：
- LeetCode 中優先使用 Kahn 演算法（簡單直觀）
- 記住入度的計算和更新方式
- 注意邊的方向（依賴關係）
- 檢查環的存在性

下一章我們將學習 Dijkstra 演算法，解決單源最短路徑問題。
