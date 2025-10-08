---
title: 13-3. Heap + 貪心
order: 3
description: 優先隊列在貪心算法中的應用：Huffman編碼、任務調度與掃描線
tags:
  - greedy
  - heap
  - priority-queue
  - sweep-line
author: Rain Hu
date: ''
draft: true
---

# 3. Heap + 貪心

優先隊列（堆）是貪心算法中最常用的數據結構之一。它能高效地維護「當前最優」的元素，非常適合需要動態選擇最優元素的貪心問題。

## 核心思想

**為什麼使用堆？**
- 需要動態地選擇最大/最小元素
- O(log n) 的插入和刪除操作
- O(1) 的查看最值操作

**典型場景**：
1. Huffman 編碼：每次合併頻率最小的兩個節點
2. 任務調度：每次選擇優先級最高的任務
3. 會議室分配：維護最早結束的會議
4. 掃描線算法：處理事件點

## 問題類型一：Huffman 編碼

### 原理

**Huffman 編碼**是一種最優的前綴編碼，用於數據壓縮。

**核心思想**：
- 頻率高的字符使用短編碼
- 頻率低的字符使用長編碼
- 構建最優二叉樹

### 貪心策略

**關鍵洞察**：每次合併頻率最小的兩個節點。

**正確性證明**（交換論證）：
```
設最優樹 T*，設頻率最小的兩個字符為 a, b

引理：在最優樹中，a 和 b 必定是兄弟節點且在最深層

證明（反證法）：
假設 a, b 不是最深層的兄弟節點
設最深層有兩個兄弟節點 x, y
因為 freq(a) <= freq(x) 且 freq(b) <= freq(y)

交換 a, x 和 b, y 的位置：
- 因為 a, b 頻率更小，放在更深層（路徑更長）不會增加總代價
- 因此交換後的樹不會比原樹差
- 重複此過程，可以將 a, b 移動到最深層

結論：貪心策略（合併最小頻率）是正確的
```

### 實現

```cpp
struct HuffmanNode {
    int freq;
    char ch;
    HuffmanNode *left, *right;

    HuffmanNode(int f, char c = '\0')
        : freq(f), ch(c), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;  // 小根堆
    }
};

class HuffmanCoding {
public:
    HuffmanNode* buildHuffmanTree(vector<pair<char, int>>& data) {
        // 優先隊列：小根堆
        priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> pq;

        // 將所有字符加入堆
        for (auto& [ch, freq] : data) {
            pq.push(new HuffmanNode(freq, ch));
        }

        // 合併節點直到只剩一個（根節點）
        while (pq.size() > 1) {
            HuffmanNode* left = pq.top(); pq.pop();
            HuffmanNode* right = pq.top(); pq.pop();

            // 創建新的內部節點
            HuffmanNode* parent = new HuffmanNode(
                left->freq + right->freq
            );
            parent->left = left;
            parent->right = right;

            pq.push(parent);
        }

        return pq.top();
    }

    // 生成編碼表
    void generateCodes(HuffmanNode* root, string code,
                      unordered_map<char, string>& codes) {
        if (!root) return;

        // 葉子節點：記錄編碼
        if (!root->left && !root->right) {
            codes[root->ch] = code;
            return;
        }

        generateCodes(root->left, code + "0", codes);
        generateCodes(root->right, code + "1", codes);
    }
};
```

### 視覺化

```
字符頻率：a:5, b:9, c:12, d:13, e:16, f:45

構建過程：
1. 合併 a(5) 和 b(9) → ab(14)
   堆：[c(12), d(13), ab(14), e(16), f(45)]

2. 合併 c(12) 和 d(13) → cd(25)
   堆：[ab(14), e(16), cd(25), f(45)]

3. 合併 ab(14) 和 e(16) → abe(30)
   堆：[cd(25), abe(30), f(45)]

4. 合併 cd(25) 和 abe(30) → cdabe(55)
   堆：[f(45), cdabe(55)]

5. 合併 f(45) 和 cdabe(55) → root(100)

最終樹：
          root(100)
         /         \
      f(45)      cdabe(55)
                 /        \
             cd(25)     abe(30)
            /    \      /     \
          c(12) d(13) ab(14) e(16)
                      /   \
                    a(5) b(9)

編碼：
f: 0
c: 100
d: 101
a: 1100
b: 1101
e: 111

平均編碼長度 = (5*4 + 9*4 + 12*3 + 13*3 + 16*3 + 45*1) / 100
            = 2.24 bits/字符
```

**時間複雜度**：O(n log n)，n 次堆操作

**空間複雜度**：O(n)

## LeetCode 1167: Minimum Cost to Connect Sticks

### 問題描述

有 n 根木棍，每根長度為 sticks[i]。每次可以連接兩根木棍，代價為兩根木棍長度之和。求連接所有木棍的最小代價。

**分析**：這是 Huffman 編碼的變體。

### 貪心策略

每次連接最短的兩根木棍，這樣短的木棍被計算的次數最多（在樹的深層）。

```cpp
class Solution {
public:
    int connectSticks(vector<int>& sticks) {
        // 小根堆
        priority_queue<int, vector<int>, greater<int>> pq;

        for (int stick : sticks) {
            pq.push(stick);
        }

        int totalCost = 0;

        while (pq.size() > 1) {
            int first = pq.top(); pq.pop();
            int second = pq.top(); pq.pop();

            int cost = first + second;
            totalCost += cost;

            pq.push(cost);  // 合併後的木棍放回堆
        }

        return totalCost;
    }
};
```

### 視覺化

```
sticks = [2, 4, 3]

堆：[2, 3, 4]

第1次合併：
  取出 2 和 3，合併成 5
  代價 = 5
  堆：[4, 5]

第2次合併：
  取出 4 和 5，合併成 9
  代價 = 9
  堆：[9]

總代價：5 + 9 = 14

解釋：
第一次合併：2 + 3 = 5
第二次合併：5 + 4 = 9
總代價：5 + 9 = 14

如果先合併 2 和 4：
第一次：2 + 4 = 6
第二次：6 + 3 = 9
總代價：6 + 9 = 15 (更差)
```

**時間複雜度**：O(n log n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/minimum-cost-to-connect-sticks/

## 問題類型二：任務調度

## LeetCode 621: Task Scheduler

### 問題描述

有 n 個任務，每個任務用字符 A-Z 表示。每個任務執行需要 1 單位時間。兩個相同任務之間必須間隔至少 n 個單位時間。求完成所有任務的最少時間。

### 貪心策略

**關鍵洞察**：
1. 優先處理頻率最高的任務
2. 使用冷卻隊列記錄正在冷卻的任務
3. 如果所有任務都在冷卻，則等待

**方法一：模擬 + 優先隊列**

```cpp
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        // 統計每個任務的頻率
        unordered_map<char, int> freq;
        for (char task : tasks) {
            freq[task]++;
        }

        // 大根堆：頻率高的優先
        priority_queue<int> pq;
        for (auto& [task, count] : freq) {
            pq.push(count);
        }

        int time = 0;

        while (!pq.empty()) {
            vector<int> temp;  // 暫存本輪執行的任務
            int cycle = n + 1; // 一個週期的長度

            // 在一個週期內盡可能執行任務
            for (int i = 0; i < cycle && (!pq.empty() || !temp.empty()); i++) {
                time++;

                if (!pq.empty()) {
                    int count = pq.top();
                    pq.pop();

                    if (count > 1) {
                        temp.push_back(count - 1);
                    }
                }
                // 如果 pq 為空，則 idle（等待）
            }

            // 將本輪執行的任務放回堆
            for (int count : temp) {
                pq.push(count);
            }
        }

        return time;
    }
};
```

**方法二：數學公式**

```cpp
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        // 統計頻率
        vector<int> freq(26, 0);
        for (char task : tasks) {
            freq[task - 'A']++;
        }

        // 找到最大頻率
        int maxFreq = *max_element(freq.begin(), freq.end());

        // 統計有多少任務達到最大頻率
        int maxCount = count(freq.begin(), freq.end(), maxFreq);

        // 計算最少時間
        // (maxFreq - 1) * (n + 1) + maxCount
        int minTime = (maxFreq - 1) * (n + 1) + maxCount;

        // 如果任務很多，可能不需要 idle
        return max(minTime, (int)tasks.size());
    }
};
```

### 視覺化

```
tasks = ['A','A','A','B','B','B'], n = 2

頻率：A:3, B:3
maxFreq = 3, maxCount = 2

公式計算：
(3-1) * (2+1) + 2 = 2 * 3 + 2 = 8

實際排程：
A → B → idle → A → B → idle → A → B
1   2    3     4   5    6     7   8

總時間：8

解釋：
- 最大頻率是 3（A 和 B 都出現 3 次）
- 需要 3-1 = 2 個週期
- 每個週期長度 n+1 = 3
- 最後一個週期放 2 個任務（A 和 B）
```

```
tasks = ['A','A','A','B','B','B'], n = 0

頻率：A:3, B:3
maxFreq = 3, maxCount = 2

公式計算：
(3-1) * (0+1) + 2 = 2 * 1 + 2 = 4
實際任務數：6

取最大值：max(4, 6) = 6

實際排程：
A → A → A → B → B → B
（不需要 idle，因為 n=0）
```

**時間複雜度**：
- 方法一：O(n)
- 方法二：O(1)（字符集固定）

**空間複雜度**：O(1)

**LeetCode 連結**：https://leetcode.com/problems/task-scheduler/

## 問題類型三：會議室問題

## LeetCode 253: Meeting Rooms II

### 問題描述

給定會議時間區間，求最少需要多少間會議室。

**分析**：這是區間分組問題，使用堆維護每間會議室的結束時間。

```cpp
class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;

        // 按開始時間排序
        sort(intervals.begin(), intervals.end());

        // 小根堆：維護每間會議室的結束時間
        priority_queue<int, vector<int>, greater<int>> pq;

        for (auto& interval : intervals) {
            // 如果最早結束的會議室已經空閒
            if (!pq.empty() && pq.top() <= interval[0]) {
                pq.pop();  // 重用這間會議室
            }
            // 記錄會議室的新結束時間
            pq.push(interval[1]);
        }

        return pq.size();
    }
};
```

### 視覺化

```
meetings = [[0,30],[5,10],[15,20]]

排序後：[[0,30], [5,10], [15,20]]

處理過程：
1. [0,30]: 堆為空，分配會議室1
   堆：[30]

2. [5,10]: 堆頂30 > 5，需要新會議室2
   堆：[10, 30]

3. [15,20]: 堆頂10 <= 15，重用會議室2
   堆：[20, 30]

結果：需要 2 間會議室

時間軸：
會議室1：[=============0-30=============]
會議室2：     [==5-10==]  [==15-20==]
時間：    0    5   10  15  20       30
```

**時間複雜度**：O(n log n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/meeting-rooms-ii/

## LeetCode 759: Employee Free Time

### 問題描述

給定每個員工的工作時間區間列表，求所有員工的共同空閒時間。

### 貪心策略

1. 合併所有員工的工作時間
2. 按開始時間排序並合併重疊區間
3. 空閒時間 = 合併後區間之間的間隙

```cpp
class Solution {
public:
    vector<Interval> employeeFreeTime(vector<vector<Interval>>& schedule) {
        vector<Interval> intervals;

        // 收集所有工作區間
        for (auto& employee : schedule) {
            for (auto& interval : employee) {
                intervals.push_back(interval);
            }
        }

        // 按開始時間排序
        sort(intervals.begin(), intervals.end(),
             [](const Interval& a, const Interval& b) {
                 return a.start < b.start;
             });

        // 合併區間
        vector<Interval> merged;
        merged.push_back(intervals[0]);

        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i].start <= merged.back().end) {
                merged.back().end = max(merged.back().end,
                                       intervals[i].end);
            } else {
                merged.push_back(intervals[i]);
            }
        }

        // 找空閒時間（間隙）
        vector<Interval> freeTime;
        for (int i = 1; i < merged.size(); i++) {
            freeTime.push_back(Interval(merged[i-1].end,
                                       merged[i].start));
        }

        return freeTime;
    }
};
```

**LeetCode 連結**：https://leetcode.com/problems/employee-free-time/

## 問題類型四：IPO 問題

## LeetCode 502: IPO

### 問題描述

有 n 個項目，每個項目需要最少資本 capital[i]，能獲得利潤 profits[i]。初始資本為 w，最多可以完成 k 個項目。求最大化最終資本。

### 貪心策略

**關鍵洞察**：
1. 每次選擇當前資本能承擔的項目中，利潤最大的
2. 使用兩個堆：
   - 小根堆（按資本）：存儲尚未解鎖的項目
   - 大根堆（按利潤）：存儲當前可做的項目

```cpp
class Solution {
public:
    int findMaximizedCapital(int k, int w,
                            vector<int>& profits,
                            vector<int>& capital) {
        int n = profits.size();

        // 項目：{capital, profit}
        vector<pair<int, int>> projects;
        for (int i = 0; i < n; i++) {
            projects.push_back({capital[i], profits[i]});
        }

        // 按資本需求排序
        sort(projects.begin(), projects.end());

        // 大根堆：可做項目的利潤
        priority_queue<int> pq;

        int i = 0;
        while (k > 0) {
            // 將所有當前資本能做的項目加入堆
            while (i < n && projects[i].first <= w) {
                pq.push(projects[i].second);
                i++;
            }

            // 如果沒有可做的項目，退出
            if (pq.empty()) break;

            // 做利潤最大的項目
            w += pq.top();
            pq.pop();
            k--;
        }

        return w;
    }
};
```

### 視覺化

```
k = 2, w = 0
profits = [1, 2, 3]
capital = [0, 1, 1]

項目排序（按capital）：
[(0,1), (1,2), (1,3)]

過程：
初始資本 w = 0

第1次選擇：
  解鎖：capital <= 0 的項目 → (0,1)
  堆：[1]
  選擇：profit = 1
  w = 0 + 1 = 1

第2次選擇：
  解鎖：capital <= 1 的項目 → (1,2), (1,3)
  堆：[3, 2]
  選擇：profit = 3
  w = 1 + 3 = 4

結果：最終資本 = 4
```

**時間複雜度**：O(n log n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/ipo/

## 問題類型五：掃描線算法 (Sweep Line)

### 核心思想

將區間問題轉換為事件點問題：
- 開始事件：+1
- 結束事件：-1
- 掃描時間軸，維護當前狀態

### 應用場景

1. 計算最大重疊區間數
2. 天際線問題
3. 區間覆蓋問題

## LeetCode 218: The Skyline Problem

### 問題描述

給定建築物的位置和高度 [left, right, height]，求天際線的輪廓線。

### 貪心策略

**關鍵洞察**：
1. 使用掃描線處理關鍵點（建築物的左右邊界）
2. 使用多重集合（multiset）維護當前高度
3. 當最大高度變化時，記錄關鍵點

```cpp
class Solution {
public:
    vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
        vector<pair<int, int>> events;  // {x, height}

        // 創建事件點
        for (auto& b : buildings) {
            events.push_back({b[0], -b[2]});  // 開始：負高度
            events.push_back({b[1], b[2]});   // 結束：正高度
        }

        // 排序：x 升序，高度特殊處理
        sort(events.begin(), events.end());

        multiset<int> heights;  // 當前所有建築的高度
        heights.insert(0);      // 地面高度

        vector<vector<int>> result;
        int prevMax = 0;

        for (auto& [x, h] : events) {
            if (h < 0) {
                // 建築開始：加入高度
                heights.insert(-h);
            } else {
                // 建築結束：移除高度
                heights.erase(heights.find(h));
            }

            int currentMax = *heights.rbegin();  // 當前最大高度

            // 如果最大高度改變，記錄關鍵點
            if (currentMax != prevMax) {
                result.push_back({x, currentMax});
                prevMax = currentMax;
            }
        }

        return result;
    }
};
```

### 視覺化

```
buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]

事件點：
x=2:  +10 (開始)
x=3:  +15 (開始)
x=5:  +12 (開始)
x=7:  -15 (結束)
x=9:  -10 (結束)
x=12: -12 (結束)
x=15: +10 (開始)
x=19: +8  (開始)
x=20: -10 (結束)
x=24: -8  (結束)

掃描過程：
x=2:  heights={0,10}, max=10 → 輸出 [2,10]
x=3:  heights={0,10,15}, max=15 → 輸出 [3,15]
x=5:  heights={0,10,12,15}, max=15 → 不輸出
x=7:  heights={0,10,12}, max=12 → 輸出 [7,12]
x=9:  heights={0,12}, max=12 → 不輸出
x=12: heights={0}, max=0 → 輸出 [12,0]
x=15: heights={0,10}, max=10 → 輸出 [15,10]
x=19: heights={0,8,10}, max=10 → 不輸出
x=20: heights={0,8}, max=8 → 輸出 [20,8]
x=24: heights={0}, max=0 → 輸出 [24,0]

結果：[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
```

**時間複雜度**：O(n log n)

**空間複雜度**：O(n)

**LeetCode 連結**：https://leetcode.com/problems/the-skyline-problem/

## 掃描線模板

```cpp
// 通用掃描線模板
vector<Result> sweepLine(vector<Event>& events) {
    // 1. 創建事件點
    vector<pair<int, int>> points;  // {position, change}

    // 2. 排序事件點
    sort(points.begin(), points.end());

    // 3. 維護狀態（使用堆、集合等）
    multiset<int> state;
    vector<Result> result;

    // 4. 掃描處理
    for (auto& [pos, change] : points) {
        // 更新狀態
        if (change > 0) {
            state.insert(change);
        } else {
            state.erase(state.find(-change));
        }

        // 檢查是否需要記錄結果
        if (/* 狀態改變 */) {
            result.push_back(/* 當前狀態 */);
        }
    }

    return result;
}
```

## 常見陷阱與技巧

### 陷阱 1：堆的類型錯誤

```cpp
// 錯誤：需要小根堆但用了大根堆
priority_queue<int> pq;  // 默認是大根堆

// 正確：
priority_queue<int, vector<int>, greater<int>> pq;  // 小根堆
```

### 陷阱 2：忘記更新堆

```cpp
// 問題：會議室分配
if (!pq.empty() && pq.top() <= interval[0]) {
    pq.pop();  // 移除舊的結束時間
}
pq.push(interval[1]);  // 別忘記加入新的結束時間！
```

### 陷阱 3：掃描線事件順序

```cpp
// 建築開始和結束在同一位置時的處理
// 開始事件應該先處理（使用負高度來保證排序正確）

events.push_back({b[0], -b[2]});  // 開始：負高度
events.push_back({b[1], b[2]});   // 結束：正高度
```

### 技巧 1：自定義比較器

```cpp
// 優先隊列自定義比較
struct Compare {
    bool operator()(const Node& a, const Node& b) {
        return a.value > b.value;  // 小根堆
    }
};
priority_queue<Node, vector<Node>, Compare> pq;
```

### 技巧 2：使用 multiset

```cpp
// 需要維護有序集合並支持重複元素
multiset<int> ms;
ms.insert(10);
ms.insert(10);  // 允許重複
ms.erase(ms.find(10));  // 只刪除一個
```

### 技巧 3：數學公式優化

```cpp
// 任務調度問題可以用公式直接計算
int minTime = (maxFreq - 1) * (n + 1) + maxCount;
return max(minTime, (int)tasks.size());
```

## 總結

### Heap + 貪心的核心策略

| 問題類型 | 堆的作用 | 典型題目 |
|----------|----------|----------|
| Huffman 編碼 | 選最小頻率 | 連接木棍 |
| 任務調度 | 選最大頻率/優先級 | 任務調度器 |
| 區間分組 | 維護結束時間 | 會議室 II |
| 項目選擇 | 選最大利潤 | IPO |
| 掃描線 | 維護當前狀態 | 天際線 |

### 時間複雜度對比

| 方法 | 時間複雜度 | 適用場景 |
|------|------------|----------|
| 單個堆 | O(n log n) | 簡單選擇 |
| 雙堆 | O(n log n) | 動態解鎖 |
| 掃描線 + multiset | O(n log n) | 複雜狀態維護 |

### LeetCode 題目總結

1. **1167. Minimum Cost to Connect Sticks** - Huffman 編碼
2. **621. Task Scheduler** - 任務調度
3. **253. Meeting Rooms II** - 會議室分配
4. **502. IPO** - 雙堆貪心
5. **218. The Skyline Problem** - 掃描線
6. **759. Employee Free Time** - 區間合併

### 學習建議

1. **掌握堆操作**：熟練使用優先隊列的各種操作
2. **理解貪心策略**：明確為什麼選擇最大/最小是正確的
3. **多種數據結構**：根據需求選擇堆、multiset 等
4. **掃描線思想**：將區間問題轉換為事件點問題
5. **證明正確性**：能夠解釋為什麼貪心策略是最優的

Heap + 貪心是處理動態最優選擇問題的強大組合。掌握這些模式後，可以高效解決大量實際問題。
