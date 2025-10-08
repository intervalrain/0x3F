---
title: 13-1. 區間問題
order: 1
description: 貪心法在區間問題中的應用：調度、覆蓋、分組與合併
tags:
  - greedy
  - interval
  - sorting
author: Rain Hu
date: ''
draft: true
---

# 1. 區間問題

區間問題是貪心法最經典的應用場景之一。這類問題通常涉及時間區間、數字區間或其他形式的區間，需要選擇、合併或分組區間以達到某種最優目標。

## 核心思想

區間問題的貪心策略通常基於以下排序標準之一：

1. **按結束時間排序**：選擇最多不重疊區間
2. **按起始時間排序**：合併區間、插入區間
3. **按長度或其他屬性排序**：特定問題的特殊需求

## 問題類型一：區間調度 (Activity Selection)

### 問題描述

給定 n 個活動，每個活動有起始時間和結束時間 [start, end)。選擇最多數量的互不重疊的活動。

### 貪心策略

**關鍵洞察**：選擇結束時間最早的活動，這樣可以為後續活動留出最多的時間。

### 正確性證明（交換論證）

```
設貪心解為 G = {g₁, g₂, ..., gₖ}（按結束時間排序）
設最優解為 O = {o₁, o₂, ..., oₘ}（假設 m > k）

證明 m = k：
1. 設 g₁ 是結束時間最早的活動
2. 如果 o₁ = g₁，則剩餘問題規模縮小
3. 如果 o₁ ≠ g₁，則 end(g₁) ≤ end(o₁)
   - 將 O 中的 o₁ 替換為 g₁
   - 因為 end(g₁) ≤ end(o₁)，所以不會與 o₂ 衝突
   - 得到新解 O'，仍是最優解
4. 重複此過程，可將 O 轉換為 G
5. 因此 k = m，貪心解就是最優解
```

### 實現

```cpp
class Solution {
public:
    // 區間調度：選擇最多不重疊區間
    int maxNonOverlapping(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;

        // 按結束時間排序
        sort(intervals.begin(), intervals.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });

        int count = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.size(); i++) {
            // 如果當前區間起始時間 >= 上一個結束時間
            if (intervals[i][0] >= lastEnd) {
                count++;
                lastEnd = intervals[i][1];
            }
        }

        return count;
    }
};
```

### 時間複雜度

- **時間複雜度**：O(n log n)，主要是排序
- **空間複雜度**：O(1)，不考慮排序的額外空間

### 視覺化示例

```
活動：    |---A---|
              |---B---|
                  |---C---|
                      |---D---|
時間軸：  0   1   2   3   4   5

按結束時間排序：A → B → C → D

選擇過程：
1. 選 A（結束於 2）
2. B 起始於 1 < 2，跳過
3. C 起始於 2 ≥ 2，選擇（結束於 4）
4. D 起始於 3 < 4，跳過

結果：選擇 A 和 C，共 2 個
```

## LeetCode 435: Non-overlapping Intervals

**題目**：給定區間集合，移除最少數量的區間使得剩餘區間不重疊。

**分析**：等價於「選擇最多不重疊區間」，答案是 `總數 - 最多不重疊區間數`。

```cpp
class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;

        // 按結束時間排序
        sort(intervals.begin(), intervals.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });

        int keep = 1;  // 保留的區間數
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] >= lastEnd) {
                keep++;
                lastEnd = intervals[i][1];
            }
        }

        return intervals.size() - keep;
    }
};
```

**LeetCode 連結**：https://leetcode.com/problems/non-overlapping-intervals/

## LeetCode 452: Minimum Number of Arrows to Burst Balloons

**題目**：在坐標軸上有許多氣球，每個氣球佔據區間 [start, end]。射出一支箭可以戳破所有包含該座標的氣球。求最少需要多少支箭。

**分析**：等價於「將區間分組，每組內區間有交集」，組數 = 最少箭數。

**貪心策略**：按結束時間排序，每次在當前可戳破的區間末尾射箭。

```cpp
class Solution {
public:
    int findMinArrowShots(vector<vector<int>>& points) {
        if (points.empty()) return 0;

        // 按結束時間排序
        sort(points.begin(), points.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });

        int arrows = 1;
        int lastEnd = points[0][1];

        for (int i = 1; i < points.size(); i++) {
            // 如果當前氣球起始位置 > 上一支箭的位置
            if (points[i][0] > lastEnd) {
                arrows++;
                lastEnd = points[i][1];
            }
            // 否則當前氣球可以被上一支箭戳破
        }

        return arrows;
    }
};
```

**注意**：與 435 的區別是邊界條件：
- 435：`intervals[i][0] >= lastEnd`（不重疊）
- 452：`points[i][0] > lastEnd`（可以在邊界相交）

**LeetCode 連結**：https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/

## 問題類型二：區間覆蓋 (Interval Covering)

### 問題描述

給定目標區間 [target_start, target_end] 和一組區間，選擇最少數量的區間完全覆蓋目標區間。

### 貪心策略

1. 按起始時間排序
2. 對於當前未覆蓋位置，選擇能覆蓋它且延伸最遠的區間

### 實現模板

```cpp
class Solution {
public:
    int minIntervalsToCover(int target_start, int target_end,
                            vector<vector<int>>& intervals) {
        // 按起始時間排序
        sort(intervals.begin(), intervals.end());

        int count = 0;
        int current = target_start;  // 當前需要覆蓋的位置
        int i = 0;

        while (current < target_end) {
            int maxReach = current;

            // 找所有能覆蓋 current 的區間中，延伸最遠的
            while (i < intervals.size() &&
                   intervals[i][0] <= current) {
                maxReach = max(maxReach, intervals[i][1]);
                i++;
            }

            // 如果無法延伸，無解
            if (maxReach == current) return -1;

            count++;
            current = maxReach;
        }

        return count;
    }
};
```

### 視覺化

```
目標：  [=================]  (0 到 10)
        0                 10

區間：  |----A----|          (0 到 3)
            |----B----|      (2 到 5)
                |----C----| (4 到 8)
                    |----D----| (6 到 11)

選擇過程：
1. current = 0，選擇能覆蓋 0 且延伸最遠的 → A (到 3)
2. current = 3，選擇能覆蓋 3 且延伸最遠的 → C (到 8)
3. current = 8，選擇能覆蓋 8 且延伸最遠的 → D (到 11)
4. current = 11 ≥ 10，完成

結果：需要 3 個區間 (A, C, D)
```

## LeetCode 1024: Video Stitching

**題目**：有若干視頻片段，每個片段覆蓋時間區間 [start, end)。要求拼接出 [0, time] 的完整視頻，返回最少需要的片段數。

```cpp
class Solution {
public:
    int videoStitching(vector<vector<int>>& clips, int time) {
        // 按起始時間排序
        sort(clips.begin(), clips.end());

        int count = 0;
        int current = 0;
        int i = 0;

        while (current < time) {
            int maxReach = current;

            // 找所有起始時間 <= current 的片段中，結束時間最大的
            while (i < clips.size() && clips[i][0] <= current) {
                maxReach = max(maxReach, clips[i][1]);
                i++;
            }

            // 無法延伸，無解
            if (maxReach == current) return -1;

            count++;
            current = maxReach;
        }

        return count;
    }
};
```

**時間複雜度**：O(n log n)

**LeetCode 連結**：https://leetcode.com/problems/video-stitching/

## LeetCode 1326: Minimum Number of Taps to Open to Water a Garden

**題目**：花園長度 n，位置 i 的水龍頭可以澆灌 [i - ranges[i], i + ranges[i]]。求最少需要打開多少個水龍頭才能澆灌 [0, n]。

**分析**：轉換為區間覆蓋問題。

```cpp
class Solution {
public:
    int minTaps(int n, vector<int>& ranges) {
        // 將水龍頭轉換為區間
        vector<vector<int>> intervals;
        for (int i = 0; i <= n; i++) {
            int left = max(0, i - ranges[i]);
            int right = min(n, i + ranges[i]);
            if (left < right) {  // 有效區間
                intervals.push_back({left, right});
            }
        }

        // 按起始位置排序
        sort(intervals.begin(), intervals.end());

        int count = 0;
        int current = 0;
        int i = 0;

        while (current < n) {
            int maxReach = current;

            while (i < intervals.size() &&
                   intervals[i][0] <= current) {
                maxReach = max(maxReach, intervals[i][1]);
                i++;
            }

            if (maxReach == current) return -1;

            count++;
            current = maxReach;
        }

        return count;
    }
};
```

**LeetCode 連結**：https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/

## 問題類型三：區間分組 (Interval Partitioning)

### 問題描述

將區間分成若干組，每組內的區間互不重疊。求最少需要多少組。

### 貪心策略

**關鍵洞察**：需要的組數 = 任意時刻同時進行的活動最大數量。

**方法一：優先隊列**
- 按起始時間排序
- 使用優先隊列維護每組的最早結束時間
- 對於新區間，如果能加入已有組（不重疊），則加入；否則新開一組

**方法二：掃描線**
- 將區間轉換為事件（開始 +1，結束 -1）
- 排序後掃描，維護當前活動數量
- 最大值即為所需組數

### 實現（優先隊列版本）

```cpp
class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        // 按起始時間排序
        sort(intervals.begin(), intervals.end());

        // 優先隊列：維護每組的最早結束時間（小根堆）
        priority_queue<int, vector<int>, greater<int>> pq;

        for (auto& interval : intervals) {
            // 如果當前區間可以加入某個已有組
            if (!pq.empty() && pq.top() < interval[0]) {
                pq.pop();  // 移除舊的結束時間
            }
            // 加入新的結束時間（可能是新組，也可能是更新舊組）
            pq.push(interval[1]);
        }

        return pq.size();  // 組數 = 堆的大小
    }
};
```

### 實現（掃描線版本）

```cpp
class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        map<int, int> events;  // 時間 -> 變化量

        for (auto& interval : intervals) {
            events[interval[0]]++;      // 區間開始
            events[interval[1] + 1]--;  // 區間結束（注意 +1）
        }

        int maxGroups = 0;
        int currentGroups = 0;

        for (auto& [time, change] : events) {
            currentGroups += change;
            maxGroups = max(maxGroups, currentGroups);
        }

        return maxGroups;
    }
};
```

### 視覺化

```
區間：  |----A----|
            |----B----|
                |----C----|
        |----D----|

時間軸：0   1   2   3   4   5

掃描線：
時間 0: +1 (A開始, D開始) → 當前2個
時間 1: +1 (B開始) → 當前3個
時間 2: -1 (A結束) +1 (C開始) → 當前3個
時間 3: -1 (D結束, B結束) → 當前1個
時間 4: -1 (C結束) → 當前0個

最大同時進行數 = 3，需要 3 組
```

## LeetCode 253: Meeting Rooms II

**題目**：給定會議時間區間，求最少需要多少間會議室。

```cpp
class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;

        // 方法一：優先隊列
        sort(intervals.begin(), intervals.end());
        priority_queue<int, vector<int>, greater<int>> pq;

        for (auto& interval : intervals) {
            if (!pq.empty() && pq.top() <= interval[0]) {
                pq.pop();
            }
            pq.push(interval[1]);
        }

        return pq.size();
    }

    // 方法二：掃描線
    int minMeetingRooms_SweepLine(vector<vector<int>>& intervals) {
        vector<pair<int, int>> events;
        for (auto& interval : intervals) {
            events.push_back({interval[0], 1});   // 開始
            events.push_back({interval[1], -1});  // 結束
        }

        sort(events.begin(), events.end());

        int maxRooms = 0, currentRooms = 0;
        for (auto& [time, change] : events) {
            currentRooms += change;
            maxRooms = max(maxRooms, currentRooms);
        }

        return maxRooms;
    }
};
```

**LeetCode 連結**：https://leetcode.com/problems/meeting-rooms-ii/

## 問題類型四：合併區間 (Merge Intervals)

### 問題描述

給定一組區間，合併所有重疊的區間。

### 貪心策略

1. 按起始時間排序
2. 依序處理每個區間：
   - 如果與前一個區間重疊，合併
   - 否則，加入結果

### 實現

```cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};

        // 按起始時間排序
        sort(intervals.begin(), intervals.end());

        vector<vector<int>> result;
        result.push_back(intervals[0]);

        for (int i = 1; i < intervals.size(); i++) {
            // 如果當前區間與結果中最後一個區間重疊
            if (intervals[i][0] <= result.back()[1]) {
                // 合併：更新結束時間
                result.back()[1] = max(result.back()[1],
                                      intervals[i][1]);
            } else {
                // 不重疊：加入新區間
                result.push_back(intervals[i]);
            }
        }

        return result;
    }
};
```

### 視覺化

```
輸入：  |----A----|
            |----B----|
                        |--C--|
                            |----D----|

排序後（按起始時間）：A → B → C → D

處理過程：
1. 加入 A：[1, 3]
2. B 與 A 重疊：合併為 [1, 4]
3. C 不重疊：加入 [6, 7]
4. D 與 C 重疊：合併為 [6, 9]

結果：[[1, 4], [6, 9]]
```

**時間複雜度**：O(n log n)

**LeetCode 連結**：https://leetcode.com/problems/merge-intervals/

## LeetCode 56: Merge Intervals

見上方實現。

## LeetCode 57: Insert Interval

**題目**：給定已排序且不重疊的區間列表，插入一個新區間並合併所有重疊區間。

**貪心策略**：
1. 加入所有在新區間之前的區間
2. 合併所有與新區間重疊的區間
3. 加入所有在新區間之後的區間

```cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals,
                               vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0;
        int n = intervals.size();

        // 1. 加入所有在 newInterval 之前的區間
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.push_back(intervals[i]);
            i++;
        }

        // 2. 合併所有與 newInterval 重疊的區間
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.push_back(newInterval);

        // 3. 加入所有在 newInterval 之後的區間
        while (i < n) {
            result.push_back(intervals[i]);
            i++;
        }

        return result;
    }
};
```

**視覺化**：

```
原區間：[1,2]  [3,5]  [6,7]  [8,10]  [12,16]
新區間：              [4,8]

步驟 1：加入 [1,2]（結束於 2 < 4）
步驟 2：合併 [3,5], [6,7], [8,10] 與 [4,8]
        → 合併為 [3,10]
步驟 3：加入 [12,16]

結果：[[1,2], [3,10], [12,16]]
```

**時間複雜度**：O(n)，只需遍歷一次

**LeetCode 連結**：https://leetcode.com/problems/insert-interval/

## 常見陷阱與技巧

### 陷阱 1：排序標準錯誤

```cpp
// 錯誤：區間調度按起始時間排序
sort(intervals.begin(), intervals.end(),
     [](auto& a, auto& b) { return a[0] < b[0]; });

// 反例：
// [1, 100], [2, 3], [4, 5]
// 按起始時間會選 [1, 100]，只選 1 個
// 正確應選 [2, 3] 和 [4, 5]，共 2 個
```

### 陷阱 2：邊界條件處理

```cpp
// 區間重疊的判斷：
// [1, 3] 和 [3, 5]

// 情況 1：邊界算重疊（如氣球問題）
if (a[0] <= b[1] && b[0] <= a[1])

// 情況 2：邊界不算重疊（如不重疊區間）
if (a[0] < b[1] && b[0] < a[1])
```

### 陷阱 3：區間端點類型

```cpp
// [start, end) 左閉右開
// [start, end] 閉區間

// 合併時注意：
// [1, 3) 和 [3, 5) 不重疊
// [1, 3] 和 [3, 5] 重疊（在 3 處）
```

### 技巧 1：轉換問題

```cpp
// 「最多選擇」 = 「最少移除」
max_select = total - min_remove

// 「最少覆蓋」可以轉換為「最遠延伸」
```

### 技巧 2：優先隊列維護狀態

```cpp
// 區間分組問題：
// 優先隊列維護每組的最早結束時間
priority_queue<int, vector<int>, greater<int>> pq;
```

### 技巧 3：掃描線算法

```cpp
// 將區間轉換為事件：
map<int, int> events;
events[start]++;  // 開始事件
events[end]--;    // 結束事件

// 掃描時間軸：
for (auto& [time, change] : events) {
    current += change;
    maxConcurrent = max(maxConcurrent, current);
}
```

## 進階技巧：區間樹

對於需要動態插入/刪除區間並查詢的問題，可以使用區間樹（Interval Tree）：

```cpp
// 區間樹節點
struct IntervalTreeNode {
    int start, end;
    int max_end;  // 子樹中最大的結束時間
    IntervalTreeNode *left, *right;
};

// 查詢與區間 [x, y] 重疊的所有區間
// 時間複雜度：O(k + log n)，k 是結果數量
```

## 總結

### 區間問題的核心策略

| 問題類型 | 排序依據 | 貪心策略 |
|----------|----------|----------|
| 區間調度 | 結束時間 | 選最早結束 |
| 區間覆蓋 | 起始時間 | 選最遠延伸 |
| 區間分組 | 起始時間 | 優先隊列 |
| 合併區間 | 起始時間 | 依序合併 |

### 時間複雜度對比

| 方法 | 時間複雜度 | 適用場景 |
|------|------------|----------|
| 排序 + 貪心 | O(n log n) | 靜態區間 |
| 優先隊列 | O(n log n) | 動態選擇 |
| 掃描線 | O(n log n) | 計數問題 |
| 區間樹 | O(k + log n) | 動態查詢 |

### LeetCode 題目總結

1. **435. Non-overlapping Intervals** - 區間調度基礎
2. **452. Minimum Number of Arrows to Burst Balloons** - 區間調度變體
3. **56. Merge Intervals** - 合併區間
4. **57. Insert Interval** - 插入並合併
5. **1024. Video Stitching** - 區間覆蓋
6. **1326. Minimum Number of Taps** - 區間覆蓋變體

### 學習建議

1. **掌握基礎**：從區間調度開始，理解「按結束時間排序」的證明
2. **理解轉換**：學會將問題轉換為區間問題（如水龍頭 → 區間）
3. **注意邊界**：仔細處理開閉區間、重疊判斷
4. **多種方法**：嘗試優先隊列、掃描線等不同實現
5. **證明正確性**：能夠解釋為什麼貪心策略是正確的

區間問題是貪心法的經典應用，掌握這些模式後，可以解決大量相關問題。
