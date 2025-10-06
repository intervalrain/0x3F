---
title: "Greedy (貪心法)"
order: 5
description: "貪心法的核心思想：局部最優解導向全域最優解"
tags: ["Greedy", "貪心法", "局部最優"]
---

# Greedy (貪心法)

## 前言

**Greedy (貪心法)** 是一種在每一步都選擇**當前最優解**的演算法策略，期望透過局部最優達到全域最優。

---

## 核心思想

### 定義

每一步都做出**當下看起來最好的選擇**，不回頭修改。

```
問題：湊出 63 元，硬幣有 50, 20, 10, 5, 1

貪心法：
1. 選 50 → 剩 13
2. 選 10 → 剩 3
3. 選 1 × 3 → 完成

結果：5 個硬幣
```

### 貪心 vs DP

| 特性 | 貪心法 | DP |
|-----|-------|---|
| **決策** | 局部最優 | 考慮所有子問題 |
| **回溯** | 不回溯 | 可能需要 |
| **正確性** | 不一定正確 | 一定正確 |
| **效率** | 通常 O(n) | 通常 O(n²) |

**重要**: 貪心法不一定能得到最優解！

---

## 貪心法的特性

### 1. 貪心選擇性質

局部最優選擇能導致全域最優解。

### 2. 最優子結構

問題的最優解包含子問題的最優解。

### 3. 無後效性

當前的選擇不影響之前的選擇。

---

## 經典貪心問題

### 1. 找零錢 (Coin Change)

**問題**: 用最少硬幣湊出金額

```cpp
// 假設硬幣面額: 25, 10, 5, 1
int coinChange(int amount) {
    vector<int> coins = {25, 10, 5, 1};
    int count = 0;
    
    for (int coin : coins) {
        count += amount / coin;
        amount %= coin;
    }
    
    return count;
}
```

**注意**: 只有在**特定硬幣系統**下貪心法才正確！

**反例**:
```
硬幣: {1, 3, 4}, 金額 = 6

貪心法: 4 + 1 + 1 = 3 個
最優解: 3 + 3 = 2 個  ← 貪心法失敗！
```

---

### 2. 活動選擇 (Activity Selection)

**問題**: 選擇最多不重疊的活動

```cpp
struct Activity {
    int start, end;
};

int activitySelection(vector<Activity>& activities) {
    // 按結束時間排序
    sort(activities.begin(), activities.end(),
         [](const Activity& a, const Activity& b) {
             return a.end < b.end;
         });
    
    int count = 1;
    int lastEnd = activities[0].end;
    
    for (int i = 1; i < activities.size(); i++) {
        if (activities[i].start >= lastEnd) {
            count++;
            lastEnd = activities[i].end;
        }
    }
    
    return count;
}
```

**貪心策略**: 每次選擇最早結束的活動

**時間複雜度**: O(n log n)

---

### 3. 跳躍遊戲 (Jump Game)

**問題**: 能否跳到最後一個位置

```cpp
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    
    return true;
}
```

**貪心策略**: 維護能達到的最遠位置

---

### 4. 分配餅乾 (Assign Cookies)

```cpp
int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    
    int i = 0, j = 0;
    while (i < g.size() && j < s.size()) {
        if (s[j] >= g[i]) {
            i++;
        }
        j++;
    }
    
    return i;
}
```

**貪心策略**: 用最小的餅乾滿足最小的胃口

---

### 5. 加油站 (Gas Station)

```cpp
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalGas = 0, currentGas = 0;
    int start = 0;
    
    for (int i = 0; i < gas.size(); i++) {
        totalGas += gas[i] - cost[i];
        currentGas += gas[i] - cost[i];
        
        if (currentGas < 0) {
            start = i + 1;
            currentGas = 0;
        }
    }
    
    return totalGas >= 0 ? start : -1;
}
```

**貪心策略**: 如果從 i 到 j 失敗，則從 i 到 j 之間的任何點都無法到達 j+1

---

## 區間問題

### 1. 會議室 (Meeting Rooms)

**問題**: 最少需要幾間會議室

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    
    for (auto& interval : intervals) {
        starts.push_back(interval[0]);
        ends.push_back(interval[1]);
    }
    
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    
    int rooms = 0, endPtr = 0;
    
    for (int start : starts) {
        if (start < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    
    return rooms;
}
```

---

### 2. 無重疊區間 (Non-overlapping Intervals)

```cpp
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    // 按結束時間排序
    sort(intervals.begin(), intervals.end(),
         [](const vector<int>& a, const vector<int>& b) {
             return a[1] < b[1];
         });
    
    int count = 0;
    int end = intervals[0][1];
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < end) {
            count++;  // 需要移除
        } else {
            end = intervals[i][1];
        }
    }
    
    return count;
}
```

---

## 貪心法的證明

### 證明策略

1. **貪心選擇性質**
   - 證明貪心選擇在最優解中

2. **最優子結構**
   - 證明剩餘問題也有最優子結構

3. **反證法**
   - 假設存在更優解，推導矛盾

### 範例：活動選擇問題

**定理**: 選擇最早結束的活動是最優的

**證明**:
```
假設最優解中第一個活動是 a_k，貪心選擇是 a_1
因為 a_1 最早結束，所以 a_1.end ≤ a_k.end

將最優解中的 a_k 替換為 a_1:
- 不會產生衝突（a_1 更早結束）
- 留給後續活動的時間更多
→ 仍是最優解

因此貪心選擇正確
```

---

## 貪心法 vs DP 的選擇

### 何時用貪心？

✓ 局部最優 = 全域最優
✓ 不需要回溯
✓ 問題有貪心選擇性質

### 何時用 DP？

✓ 貪心法不正確
✓ 需要考慮所有可能
✓ 有重疊子問題

### 判斷技巧

```cpp
// 嘗試貪心法
1. 定義貪心策略
2. 寫幾個測試案例
3. 如果都正確 → 可能是貪心
4. 如果有反例 → 用 DP
```

---

## 常見貪心策略

### 1. 排序

```cpp
// 按某個標準排序，然後貪心選擇
sort(arr.begin(), arr.end());
```

**應用**: 活動選擇、區間問題

### 2. 優先隊列

```cpp
priority_queue<int> pq;
// 每次選擇最大/最小
```

**應用**: Huffman 編碼、Dijkstra

### 3. 雙指針

```cpp
int left = 0, right = n - 1;
// 從兩端向中間貪心
```

**應用**: 兩數之和、接雨水

---

## LeetCode 練習題

### 基礎
- [Assign Cookies](https://leetcode.com/problems/assign-cookies/)
- [Lemonade Change](https://leetcode.com/problems/lemonade-change/)
- [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

### 中等
- [Jump Game](https://leetcode.com/problems/jump-game/)
- [Jump Game II](https://leetcode.com/problems/jump-game-ii/)
- [Gas Station](https://leetcode.com/problems/gas-station/)
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

### 困難
- [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/)

---

## 重點總結

### 貪心法特點
- **每步選最優**: 不回頭
- **不一定正確**: 需要證明
- **效率高**: 通常 O(n) 或 O(n log n)

### 適用場景
- 活動選擇
- 區間問題
- 最短路徑 (Dijkstra)
- 最小生成樹 (Kruskal, Prim)

### 判斷方法
1. 定義貪心策略
2. 測試簡單案例
3. 嘗試找反例
4. 如果找不到反例 → 嘗試證明
5. 如果找到反例 → 用 DP

### 記憶技巧
- 看到「最多/最少」→ 考慮貪心
- 看到「區間」→ 通常排序 + 貪心
- 看到「選擇」→ 貪心或 DP
- 貪心失敗 → 改用 DP
