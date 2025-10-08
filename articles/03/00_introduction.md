---
title: 03-0. 滑動視窗與雙指針介紹
order: 0
description: 滑動視窗與雙指針的核心概念、使用場景與解題模板
tags:
  - Sliding Window
  - Two Pointers
  - 滑動視窗
  - 雙指針
author: Rain Hu
date: '2025-10-08'
draft: false
---

# 滑動視窗與雙指針

## 前言

**滑動視窗 (Sliding Window)** 和 **雙指針 (Two Pointers)** 是處理陣列/字串問題最常用的技巧，能將 O(n²) 的暴力解優化到 O(n)。

---

## 核心概念

### 滑動視窗

**定義**: 在陣列上維護一個「窗口」，透過移動窗口的左右邊界來尋找答案。

```
陣列: [1, 3, -1, -3, 5, 3, 6, 7]
窗口大小 k = 3

窗口 1: [1, 3, -1] -3  5  3  6  7
窗口 2:  1 [3, -1, -3] 5  3  6  7
窗口 3:  1  3 [-1, -3, 5] 3  6  7
...
```

**特點**:
- 窗口在陣列上「滑動」
- 只需遍歷一次 O(n)
- 適合連續子陣列問題

### 雙指針

**定義**: 使用兩個指針在陣列上移動來解決問題。

```
類型 1: 雙向（相向）
left →              ← right
[1, 2, 3, 4, 5, 6, 7]

類型 2: 同向（快慢指針）
slow →  fast →
[1, 2, 3, 4, 5, 6, 7]
```

**特點**:
- 指針可以同向或反向移動
- 降低時間複雜度
- 通常需要先排序

---

## 滑動視窗 vs 雙指針

| 特性 | 滑動視窗 | 雙指針 |
|-----|---------|--------|
| **適用** | 連續子陣列 | 可以不連續 |
| **窗口** | 明確的窗口 | 可能沒有窗口概念 |
| **移動** | 左右邊界移動 | 兩個指針獨立移動 |
| **典型** | 最大/最小子陣列 | Two Sum, 回文 |

**關係**: 滑動視窗可視為雙指針的特殊應用（同向雙指針）。

---

## 問題分類

### 1. 定長滑動視窗

窗口大小**固定**。

```
問題: 找出所有大小為 k 的子陣列的最大值

[1, 3, -1, -3, 5, 3, 6, 7], k = 3
窗口: [1, 3, -1]     → 最大值 3
窗口: [3, -1, -3]    → 最大值 3
窗口: [-1, -3, 5]    → 最大值 5
...
```

**模板**:
```cpp
// 建立 window
for (int i = 0; i < k; i++) {
    加入 arr[i] 到窗口;  // 移動右指針
}
更新答案;

for (int i = k; i < n; i++) {
    加入 arr[i] 到窗口;       // 移動右指針
    移除 arr[i - k] 從窗口;   // 移動左指針
    更新答案;
}
```

### 2. 不定長滑動視窗

窗口大小**可變**，滿足某個條件。

```
問題: 找出和 ≥ target 的最短子陣列

[2, 3, 1, 2, 4, 3], target = 7

窗口: [2, 3, 1, 2]  → 和 = 8 ≥ 7, 長度 4
窗口: [4, 3]        → 和 = 7 ≥ 7, 長度 2 ✓
```

**模板**:
```cpp
int left = 0;
for (int right = 0; right < n; right++) {
    加入 arr[right] 到窗口;

    while (窗口不符合條件) {
        移除 arr[left];
        left++;
    }

    更新答案;
}
```

### 3. 雙向雙指針

兩個指針**相向移動**。

```
問題: Two Sum (有序陣列)

[1, 2, 3, 4, 6], target = 6

left=0, right=4: 1 + 6 = 7 > 6 → right--
left=0, right=3: 1 + 4 = 5 < 6 → left++
left=1, right=3: 2 + 4 = 6 ✓
```

**模板**:
```cpp
int left = 0, right = n - 1;
while (left < right) {
    if (條件滿足) {
        處理結果;
        left++; right--;
    } else if (需要增大) {
        left++;
    } else {
        right--;
    }
}
```

### 4. 同向雙指針

兩個指針**同向移動**（快慢指針）。

```
問題: 移除重複元素

[1, 1, 2, 2, 3], 移除重複

slow = 0, fast = 0: [1, 1, 2, 2, 3]
slow = 0, fast = 1: [1, 1, 2, 2, 3] (重複，跳過)
slow = 1, fast = 2: [1, 2, 2, 2, 3]
slow = 2, fast = 3: [1, 2, 2, 2, 3] (重複，跳過)
slow = 2, fast = 4: [1, 2, 3, 2, 3]

結果: [1, 2, 3]
```

**模板**:
```cpp
int slow = 0;
for (int fast = 0; fast < n; fast++) {
    if (arr[fast] 滿足條件) {
        arr[slow] = arr[fast];
        slow++;
    }
}
```

---

## 時間複雜度分析

### 為什麼是 O(n)？

雖然有兩層循環，但**每個元素最多被訪問兩次**（進入窗口一次，離開窗口一次）。

```cpp
int left = 0;
for (int right = 0; right < n; right++) {  // right 訪問每個元素一次
    // ...
    while (條件) {
        left++;  // left 最多訪問每個元素一次
    }
}
```

**總操作數**: n (right) + n (left) = 2n = O(n)

---

## 常見維護內容

### 1. 維護索引

```cpp
// 記錄窗口範圍
int left = 0, right = 0;
```

### 2. 維護值（和、計數）

```cpp
// 維護窗口內元素的和
int sum = 0;
for (int right = 0; right < n; right++) {
    sum += arr[right];
    // ...
    sum -= arr[left];
}
```

### 3. 維護最大/最小值

```cpp
// 使用 deque 維護窗口最大值
deque<int> dq;  // 單調遞減隊列
for (int i = 0; i < n; i++) {
    // 移除超出窗口的元素
    while (!dq.empty() && dq.front() < i - k + 1) {
        dq.pop_front();
    }

    // 維護單調性
    while (!dq.empty() && arr[dq.back()] < arr[i]) {
        dq.pop_back();
    }

    dq.push_back(i);

    // 窗口最大值
    if (i >= k - 1) {
        maxVal = arr[dq.front()];
    }
}
```

### 4. 維護字符計數

```cpp
// 使用 hash map 維護窗口內字符計數
unordered_map<char, int> window;
for (int right = 0; right < n; right++) {
    window[s[right]]++;
    // ...
    window[s[left]]--;
    if (window[s[left]] == 0) {
        window.erase(s[left]);
    }
}
```

---

## 識別滑動視窗問題的關鍵詞

### 明確提示

- 「連續子陣列」
- 「子字串」
- 「窗口大小為 k」
- 「最長/最短」滿足條件的子陣列

### 隱含提示

- 問題涉及**連續**元素
- 需要優化暴力 O(n²) 解法
- 求**極值**（最大、最小、最長、最短）

---

## 常見陷阱

### 1. 邊界條件

```cpp
// 錯誤：窗口還沒形成就處理
for (int i = 0; i < n; i++) {
    處理窗口;  // ✗ 窗口可能還沒到 k 個元素
}

// 正確：檢查窗口是否形成
for (int i = 0; i < n; i++) {
    if (i >= k - 1) {  // ✓ 窗口已形成
        處理窗口;
    }
}
```

### 2. 忘記更新窗口狀態

```cpp
// 錯誤：忘記移除左邊元素
while (窗口不滿足條件) {
    left++;  // ✗ 沒有更新窗口狀態
}

// 正確：先更新狀態
while (窗口不滿足條件) {
    移除 arr[left];  // ✓ 更新狀態
    left++;
}
```

### 3. 條件判斷錯誤

```cpp
// 注意 < 還是 <=
while (left < right)   // 雙向雙指針
while (left <= right)  // 二分搜尋
```

---

## 解題步驟

### 通用流程

1. **識別問題類型**
   - 定長？不定長？
   - 雙向？同向？

2. **選擇模板**
   - 套用對應的模板

3. **確定維護內容**
   - 維護什麼狀態？
   - 如何更新狀態？

4. **處理邊界**
   - 窗口何時形成？
   - 何時更新答案？

5. **優化**
   - 能否提前終止？
   - 能否剪枝？

---

## 經典題目預覽

### 定長滑動視窗
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

### 不定長滑動視窗
- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

### 雙向雙指針
- [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

### 同向雙指針
- [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- [Move Zeroes](https://leetcode.com/problems/move-zeroes/)

---

## 重點總結

### 核心優勢

- **降低複雜度**: O(n²) → O(n)
- **空間效率**: 通常 O(1) 或 O(k)
- **易於實作**: 模板化

### 適用場景

- 連續子陣列/子字串問題
- 需要快速查找極值
- 陣列/鏈表的原地操作

### 記憶技巧

- **定長窗口** = 固定 k，右移窗口
- **不定長窗口** = while 收縮 left
- **雙向雙指針** = left < right
- **同向雙指針** = slow/fast

### 下一步

接下來的章節將深入探討每種類型的詳細模板、經典題目和變化技巧。
