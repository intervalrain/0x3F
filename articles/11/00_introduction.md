---
title: 11-0. 進階資料結構概論
order: 0
description: 理解時間與空間的權衡，選擇合適的資料結構
tags:
  - Data Structure
  - Time Complexity
  - Space Complexity
author: Rain Hu
date: '2025-10-08'
draft: false
---

# 進階資料結構概論

## 核心思想：Time-Space Trade-off

在演算法設計中，最重要的概念之一就是**時間與空間的權衡**（Time-Space Trade-off）。我們經常面臨一個選擇：

- **犧牲空間換取時間**：透過預處理和額外的儲存空間，加速查詢操作
- **犧牲時間換取空間**：減少記憶體使用，但可能需要更多的計算時間

### 經典範例：查詢區間和

假設有一個陣列 `arr = [2, 4, 1, 5, 3]`，需要多次查詢區間和 `sum(l, r)`：

```
查詢 1: sum(0, 2) = 2 + 4 + 1 = 7
查詢 2: sum(1, 4) = 4 + 1 + 5 + 3 = 13
查詢 3: sum(2, 3) = 1 + 5 = 6
...
```

**方法 1：暴力計算**
- 時間：O(n) per query
- 空間：O(1)
- 總時間：O(q·n)，q 為查詢次數

**方法 2：前綴和（Prefix Sum）**
- 預處理：O(n)
- 查詢時間：O(1)
- 空間：O(n)
- 總時間：O(n + q)

當 q 很大時，方法 2 明顯更優！這就是典型的**用空間換時間**。

### 權衡的三個維度

```
         預處理時間
              ↓
        [Preprocessing]
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
查詢時間          額外空間使用
[Query Time]      [Space Usage]
```

選擇資料結構時，需要考慮：

1. **預處理成本**：建立資料結構需要多少時間？
2. **查詢效率**：單次操作（查詢/更新）需要多少時間？
3. **空間開銷**：需要額外使用多少記憶體？

## 如何選擇合適的資料結構？

### 問題分析框架

在選擇資料結構前，先問自己這些問題：

#### 1. 操作類型

- **只讀查詢**（唯讀）：Prefix Sum、2D Prefix Sum
- **動態更新 + 查詢**：Fenwick Tree、Segment Tree
- **集合合併 + 連通性查詢**：Union Find
- **字串匹配 + 前綴查詢**：Trie
- **優先級排序 + 動態取最值**：Heap

#### 2. 操作頻率

```
操作模式決策樹：

查詢頻率 >> 更新頻率
    → 預處理型資料結構（Prefix Sum）

更新頻率 ≈ 查詢頻率
    → 動態型資料結構（Fenwick Tree, Segment Tree）

單次操作，資料量大
    → 簡單資料結構（Array, Hash Map）
```

#### 3. 資料特性

| 資料特性 | 適合的資料結構 |
|---------|--------------|
| 靜態陣列，頻繁區間查詢 | Prefix Sum |
| 二維矩陣，子矩陣查詢 | 2D Prefix Sum |
| 動態陣列，區間和查詢 | Fenwick Tree |
| 需要區間修改 | Segment Tree (Lazy Propagation) |
| 集合合併問題 | Union Find |
| 字串集合，前綴匹配 | Trie |
| 動態維護最大/最小值 | Heap |

#### 4. 複雜度要求

如果題目有明確的時間/空間限制：
- `n ≤ 10⁵, q ≤ 10⁵` → O(log n) per query 即可
- `n ≤ 10⁶, q ≤ 10⁶` → 需要 O(1) or O(log n) per query
- `n ≤ 10³` → 甚至 O(n) per query 也可接受

## 本章涵蓋的資料結構

以下是本章將深入探討的 7 種進階資料結構，依照複雜度和應用場景排列：

### 1. Prefix Sum（前綴和）

```
特性：預處理換查詢速度
預處理：O(n)
查詢：O(1)
空間：O(n)
```

**適用場景**：
- 陣列不變，需要頻繁查詢區間和
- 子陣列和問題
- 區間平均值

**經典題目**：
- LeetCode 303: Range Sum Query - Immutable
- LeetCode 560: Subarray Sum Equals K

---

### 2. Difference Array（差分陣列）

```
特性：區間修改優化
區間修改：O(1)
還原陣列：O(n)
空間：O(n)
```

**適用場景**：
- 多次區間加減操作
- 最後才需要完整陣列

**經典題目**：
- LeetCode 1109: Corporate Flight Bookings
- LeetCode 370: Range Addition

---

### 3. 2D Prefix Sum（二維前綴和）

```
特性：二維區間查詢
預處理：O(m·n)
查詢：O(1)
空間：O(m·n)
```

**適用場景**：
- 矩陣子區域和查詢
- 二維範圍計數

**經典題目**：
- LeetCode 304: Range Sum Query 2D - Immutable
- LeetCode 1314: Matrix Block Sum

---

### 4. Heap（堆）

```
特性：動態維護極值
插入：O(log n)
取最值：O(1)
刪除最值：O(log n)
空間：O(n)
```

**適用場景**：
- Top K 問題
- 中位數維護
- 任務調度（按優先級）

**經典題目**：
- LeetCode 215: Kth Largest Element
- LeetCode 295: Find Median from Data Stream
- LeetCode 347: Top K Frequent Elements

---

### 5. Union Find（並查集）

```
特性：集合合併與查詢
find：O(α(n)) ≈ O(1)
union：O(α(n)) ≈ O(1)
空間：O(n)
```

**適用場景**：
- 連通性判斷
- 動態圖的連通分量
- 環檢測

**經典題目**：
- LeetCode 200: Number of Islands
- LeetCode 684: Redundant Connection
- LeetCode 721: Accounts Merge

---

### 6. Trie（字典樹）

```
特性：字串查詢與前綴匹配
插入：O(L)，L 為字串長度
查詢：O(L)
空間：O(總字元數)
```

**適用場景**：
- 字串查詢
- 前綴匹配
- 字串集合操作
- XOR 最大值（Bitwise Trie）

**經典題目**：
- LeetCode 208: Implement Trie
- LeetCode 212: Word Search II
- LeetCode 421: Maximum XOR of Two Numbers

---

### 7. Fenwick Tree（樹狀陣列）

```
特性：動態前綴和
更新：O(log n)
查詢：O(log n)
空間：O(n)
```

**適用場景**：
- 動態陣列的區間和查詢
- 單點修改 + 區間查詢
- 逆序對計數

**經典題目**：
- LeetCode 307: Range Sum Query - Mutable
- LeetCode 315: Count of Smaller Numbers After Self

---

### 8. Segment Tree（線段樹）

```
特性：功能最強的區間資料結構
建樹：O(n)
單點修改：O(log n)
區間查詢：O(log n)
區間修改：O(log n) with Lazy Propagation
空間：O(4n)
```

**適用場景**：
- 區間最值查詢
- 區間修改 + 區間查詢
- 複雜的區間操作（需要合併信息）

**經典題目**：
- LeetCode 307: Range Sum Query - Mutable
- LeetCode 715: Range Module
- LeetCode 732: My Calendar III

---

## 資料結構比較總表

| 資料結構 | 預處理 | 查詢 | 更新 | 空間 | 特點 |
|---------|-------|------|------|------|------|
| Prefix Sum | O(n) | O(1) | ✗ | O(n) | 靜態陣列，最快查詢 |
| 2D Prefix Sum | O(mn) | O(1) | ✗ | O(mn) | 二維版本 |
| Heap | O(n) | O(1)* | O(log n) | O(n) | *僅 peek，動態極值 |
| Union Find | O(n) | O(α(n)) | O(α(n)) | O(n) | 集合合併 |
| Trie | O(總長) | O(L) | O(L) | O(總字元數) | 字串專用 |
| Fenwick Tree | O(n) | O(log n) | O(log n) | O(n) | 實現簡單 |
| Segment Tree | O(n) | O(log n) | O(log n) | O(4n) | 功能最強 |

## 實戰選擇策略

### 場景 1：區間和問題

```
是否需要更新？
    No  → Prefix Sum
    Yes → 是否需要區間修改？
            No  → Fenwick Tree
            Yes → Segment Tree (Lazy Propagation)
```

### 場景 2：動態極值

```
只需要最大/最小值？
    Yes → Heap (priority_queue)
    No  → 需要任意位置的值？
            → Segment Tree (區間最值查詢)
```

### 場景 3：連通性問題

```
需要維護路徑？
    No  → Union Find
    Yes → DFS/BFS or 複雜圖演算法
```

### 場景 4：字串匹配

```
前綴匹配 or 字典查詢？
    Yes → Trie
    No  → Hash Map or KMP/AC自動機
```

## 學習路徑建議

### 初學者（必須掌握）
1. **Prefix Sum** - 最基礎，理解預處理的意義
2. **Heap** - C++ STL 直接支援，容易上手
3. **Union Find** - 模板簡單，應用廣泛

### 進階（強烈推薦）
4. **Trie** - 字串問題的利器
5. **2D Prefix Sum** - 二維問題的延伸
6. **Fenwick Tree** - 動態區間問題的首選

### 高階（競賽必備）
7. **Segment Tree** - 最強大，但也最複雜

## 常見陷阱與注意事項

### 1. 邊界處理

```cpp
// Prefix Sum 常見錯誤
int sum(int l, int r) {
    return prefix[r] - prefix[l-1];  // l=0 時會越界！
}

// 正確做法：prefix[0] = 0, 陣列從 prefix[1] 開始
int sum(int l, int r) {
    return prefix[r+1] - prefix[l];  // 統一使用 1-indexed
}
```

### 2. 資料結構選擇失誤

```cpp
// 錯誤：用 Segment Tree 解決靜態區間和
// 正確：直接用 Prefix Sum，O(1) 查詢

// 錯誤：用陣列暴力維護動態最值
// 正確：用 Heap 或 Segment Tree
```

### 3. 空間複雜度爆炸

```cpp
// Trie 在字元集大時空間開銷巨大
// 26 個小寫字母：每個節點 26 個指標
// 考慮使用 map<char, TrieNode*> 而非 array
```

### 4. Lazy Propagation 忘記下推

```cpp
// Segment Tree 區間修改時
void update(int l, int r, int val) {
    // 忘記先 pushDown(node)，導致標記未下推
    if (lazy[node] != 0) pushDown(node);  // 必須！
    // ...
}
```

## 本章學習目標

完成本章後，你將能夠：

1. ✅ 理解時間與空間的權衡，選擇合適的資料結構
2. ✅ 熟練使用 Prefix Sum 解決靜態區間問題
3. ✅ 運用 Heap 解決 Top K 和優先級問題
4. ✅ 使用 Union Find 處理連通性和集合合併
5. ✅ 應用 Trie 解決字串前綴和字典問題
6. ✅ 掌握 Fenwick Tree 處理動態區間和
7. ✅ 理解 Segment Tree 的強大功能和實現原理
8. ✅ 在 LeetCode 上解決 30+ 相關題目

## 下一步

從最簡單的 **Prefix Sum** 開始，逐步建立對資料結構的直覺，理解它們解決問題的核心思想。記住：

> **沒有最好的資料結構，只有最適合的資料結構。**

讓我們開始這趟進階資料結構的學習之旅！
