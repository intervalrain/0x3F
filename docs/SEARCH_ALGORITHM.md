# 🔍 搜尋演算法說明

## 搜尋引擎：Fuse.js

我們使用 [Fuse.js](https://www.fusejs.io/) 實現模糊搜尋功能，這是一個輕量級的前端搜尋引擎。

---

## 搜尋原則

### 1. 搜尋範圍與權重

搜尋會掃描以下欄位，並根據權重排序結果：

| 欄位 | 權重 | 說明 | 範例 |
|------|------|------|------|
| **title** | 50% | 文章標題 | "01-7. Heap 與 Priority Queue" |
| **tags** | 30% | 文章標籤 | ["Heap", "Priority Queue"] |
| **description** | 15% | 文章描述 | "Heap 的原理、實作與應用..." |
| **excerpt** | 5% | 文章摘要 | 前 200 字內容 |

**權重說明：**
- 標題匹配的結果會排在最前面
- 標籤匹配次之
- 描述和內容匹配排在後面

### 2. 模糊匹配參數

```typescript
{
  threshold: 0.4,              // 匹配閾值
  distance: 100,               // 搜尋距離
  minMatchCharLength: 1,       // 最小匹配字符
  findAllMatches: true,        // 找出所有匹配
  ignoreLocation: true,        // 忽略匹配位置
  isCaseSensitive: false,      // 不區分大小寫
}
```

#### `threshold: 0.4` - 匹配閾值

- **範圍**: 0.0 (完全匹配) ~ 1.0 (匹配任何東西)
- **設定**: 0.4 (允許 40% 的差異)
- **影響**: 值越小越嚴格，越大越寬鬆

**範例：**
```
threshold: 0.0  → "Priority Queue" 只能精確匹配 "Priority Queue"
threshold: 0.3  → "Priority Queue" 可以匹配 "Priority Que"
threshold: 0.4  → "Priority Queue" 可以匹配 "priority queue", "Prior Queue"
threshold: 0.6  → "Priority Queue" 可以匹配 "Prioty Qu"
```

#### `distance: 100` - 搜尋距離

- **說明**: 允許匹配的最大字符距離
- **設定**: 100 個字符
- **影響**: 增加可以找到遠距離匹配的機會

**範例：**
```
搜尋 "heap" 在標題中的位置：
distance: 10  → 只能在前 10 個字符內找到
distance: 100 → 可以在整個標題中找到
```

#### `minMatchCharLength: 1` - 最小匹配長度

- **說明**: 至少需要匹配的字符數
- **設定**: 1 個字符
- **影響**: 支援單字符搜尋（如 "O", "N" 等）

#### `ignoreLocation: true` - 忽略位置

- **說明**: 不考慮匹配在字串中的位置
- **影響**: "Queue" 可以在 "Priority Queue" 任何位置匹配

#### `isCaseSensitive: false` - 不區分大小寫

- **說明**: 忽略大小寫
- **影響**: "priority" = "Priority" = "PRIORITY"

---

## 搜尋行為範例

### ✅ 成功匹配的案例

#### 1. 完全匹配
```
搜尋: "Priority Queue"
結果: "01-7. Heap 與 Priority Queue" ⭐⭐⭐⭐⭐
      "11-3. Heap (Priority Queue)"  ⭐⭐⭐⭐⭐
```

#### 2. 部分匹配
```
搜尋: "priority"
結果: "01-7. Heap 與 Priority Queue" ⭐⭐⭐⭐
      "11-3. Heap (Priority Queue)"  ⭐⭐⭐⭐
```

#### 3. 拼寫容錯
```
搜尋: "prioty queue"  (拼錯)
結果: "01-7. Heap 與 Priority Queue" ⭐⭐⭐
      "11-3. Heap (Priority Queue)"  ⭐⭐⭐
```

#### 4. 順序無關
```
搜尋: "queue priority"  (順序相反)
結果: "01-7. Heap 與 Priority Queue" ⭐⭐⭐
      "11-3. Heap (Priority Queue)"  ⭐⭐⭐
```

#### 5. 中文搜尋
```
搜尋: "單調棧"
結果: "06-0. Stack, Queue, Deque, 單調棧介紹" ⭐⭐⭐⭐⭐
      "06-2. 下一個更大元素 (Next Greater Element)" ⭐⭐⭐⭐
```

#### 6. 標籤匹配
```
搜尋: "LRU"
結果: 包含 "LRU" 標籤的所有文章
```

---

## 搜尋技巧

### 1. 多關鍵字搜尋

Fuse.js 會自動將多個關鍵字拆分並匹配：

```
搜尋: "heap priority"
→ 找到同時包含 "heap" 和 "priority" 的文章
```

### 2. 精確搜尋 vs 模糊搜尋

```
精確搜尋:  "Binary Search"    → 高分匹配
模糊搜尋:  "Binar Serch"      → 中等分匹配
          "BS"                → 低分匹配
```

### 3. 縮寫搜尋

```
搜尋: "DP"      → 找到 "Dynamic Programming" 相關文章
搜尋: "DFS"     → 找到 "Depth First Search" 相關文章
搜尋: "BFS"     → 找到 "Breadth First Search" 相關文章
```

### 4. 中英混搜

```
搜尋: "dynamic 規劃"  → 可以找到動態規劃相關文章
搜尋: "二分 search"   → 可以找到二分搜尋相關文章
```

---

## 排序規則

搜尋結果按照以下順序排列：

1. **分數最高** - Fuse.js 計算的相關性分數
2. **權重優先** - 標題匹配 > 標籤匹配 > 描述匹配 > 內容匹配
3. **完全匹配優先** - 完全匹配排在模糊匹配前面

### 分數計算範例

```typescript
搜尋: "priority queue"

文章 A: "Priority Queue 實作"
  - title 完全匹配: 0.0 分 (最好)

文章 B: "Heap 與 Priority Queue"
  - title 部分匹配: 0.2 分

文章 C: "資料結構概論"
  - tags 包含 "Priority Queue": 0.3 分

文章 D: "演算法導論"
  - excerpt 提到 "priority queue": 0.5 分

排序: A → B → C → D
```

---

## 效能優化

### 索引大小
- **文章數量**: 112 篇
- **索引大小**: ~100KB
- **載入時機**: 首次打開搜尋時

### 搜尋速度
- **即時搜尋**: 每次輸入立即顯示結果
- **結果限制**: 最多顯示 10 筆結果
- **時間複雜度**: O(n) 線性掃描，但 n 很小（112）

---

## 常見問題

### Q1: 為什麼搜尋 "priority queue" 找不到文章？

**A**: 可能的原因：
1. ✅ **已修復**: `threshold` 設定太嚴格（0.3 → 0.4）
2. ✅ **已修復**: `minMatchCharLength` 設定太高（2 → 1）
3. 檢查文章是否標記為 `draft: true`

### Q2: 如何提高搜尋準確度？

**A**:
1. 使用文章標題中的完整關鍵字
2. 搜尋標籤（如 "LRU", "Stack", "DP"）
3. 使用多個關鍵字縮小範圍

### Q3: 支援正則表達式嗎？

**A**:
不支援。Fuse.js 使用模糊匹配算法，不支援正則表達式。

### Q4: 如何搜尋特定章節的文章？

**A**:
可以在搜尋關鍵字中包含章節編號：
```
搜尋: "06 stack"  → 找到第 6 章的 Stack 相關文章
搜尋: "10 dp"     → 找到第 10 章的 DP 相關文章
```

---

## 未來改進方向

### 1. 高亮顯示匹配文字
```typescript
// 使用 includeMatches: true 的數據
// 在搜尋結果中高亮顯示匹配的關鍵字
```

### 2. 搜尋歷史
```typescript
// 記錄最近的搜尋記錄
localStorage.setItem('search-history', JSON.stringify(history));
```

### 3. 熱門搜尋
```typescript
// 統計搜尋頻率，顯示熱門關鍵字
```

### 4. 分類過濾
```typescript
// 按章節、標籤、難度篩選結果
```

### 5. 同義詞支援
```typescript
// "陣列" = "array"
// "鏈表" = "linked list"
// "堆疊" = "stack"
```

---

## 參考資源

- [Fuse.js 官方文檔](https://www.fusejs.io/)
- [Fuse.js API 參數說明](https://www.fusejs.io/api/options.html)
- [模糊搜尋演算法](https://en.wikipedia.org/wiki/Approximate_string_matching)
