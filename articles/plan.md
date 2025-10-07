# LeetCode 演算法學習計畫

本專案以 LeetCode 為目標，由淺入深學習演算法與資料結構。

---

## 進度總覽

- [x] **Section 01. 演算法基礎** (13 章節) ✅
- [x] **Section 02. 演算法策略** (8 章節) ✅
- [x] **Section 03. 滑動視窗與雙指針** (5 章節) ✅
- [x] **Section 04. 二分法** (4 章節) ✅
- [x] **Section 05. LinkedList, Binary Tree, Tree** (8 章節) ✅
- [x] **Section 06. Stack, Queue, Deque, 單調棧** (4 章節) ✅
- [x] **Section 07. 網格圖** (5 章節) ✅
- [x] **Section 08. 圖論** (12 章節) ✅
- [x] **Section 09. 位元運算** (6 章節) ✅
- [x] **Section 10. 動態規劃** (12 章節) ✅
- [x] **Section 11. 進階資料結構** (8 章節) ✅
- [x] **Section 12. 數論** (8 章節) ✅
- [x] **Section 13. 貪心法** (5 章節) ✅
- [x] **Section 14. 字串** (13 章節) ✅

---

## 詳細進度

### Section 01. 演算法基礎

**Config**: `演算法與資料結構的基礎概念`

- [x] **0. 入門 - 演算法與資料結構心法**
  - 重點：什麼是演算法、學習心法、基本資料結構概念

- [x] **1. 複雜度分析**
  - 重點：時間複雜度與空間複雜度、如何根據 Constraints 判斷必須符合的時間複雜度

- [x] **2. 資料結構概述**
  - 重點：Array、Linked List、Binary Tree 的基本操作與權衡

- [x] **3. 動態陣列 (Dynamic Array)**
  - 重點：擴容/縮容機制、邊界檢查、Amortized Analysis（攤銷分析）

- [x] **4. HashMap**
  - 重點：O(1) 查找原理、Hash 碰撞處理、負載因子、Chaining、紅黑樹

- [x] **5. 鏈表操作 (Linked List Operations)**
  - 重點：插入/刪除操作、雙向鏈表、Deque 的 O(1) 隨機存取（Two-level indexing）

- [x] **6. Stack & Queue**
  - 重點：LIFO、FIFO、應用場景（DFS/BFS、單調棧）

- [x] **7. Heap**
  - 重點：堆結構、Priority Queue、應用（Top K、Dijkstra）

- [x] **8. Tree**
  - 重點：二元樹遍歷、BST 操作、AVL/紅黑樹概述、Trie

- [x] **9. Graph**
  - 重點：鄰接矩陣 vs 鄰接表、DFS/BFS、Dijkstra、Bellman-Ford、Union-Find

- [x] **10. STL Containers**
  - 重點：vector、deque、set、map、unordered_set、unordered_map、multiset、multimap

- [x] **11. 進階資料結構 (Advanced Structures)**
  - 重點：Segment Tree、Fenwick Tree、單調棧/隊列、Union-Find、Skip List、Sparse Table

---

### Section 02. 演算法策略

**Config**: `演算法基礎`

- [x] **0. 演算法概述**
  - 重點：以「找某值」為例，說明如何選擇演算法（Linear Search、Binary Search、Hash Table）

- [x] **1. 排序演算法 (Sorting)**
  - 重點：10 種排序演算法、穩定性、In-place 排序、比較表與選擇指南

- [x] **2. 暴力法 (Brute Force)**
  - 重點：何時使用、剪枝與 Memoization 優化

- [x] **3. 分治法 (Divide and Conquer)**
  - 重點：Divide-Conquer-Combine 三步驟、Master Theorem、經典應用

- [x] **4. 動態規劃 (Dynamic Programming)**
  - 重點：Overlapping Subproblems、Optimal Substructure、Top-down vs Bottom-up

- [x] **5. 貪心法 (Greedy)**
  - 重點：Greedy Choice Property、經典問題、Greedy vs DP 判斷

- [x] **6. 回溯法 (Backtracking)**
  - 重點：DFS + Pruning + Backtracking、通用模板、Permutations/Combinations/N-Queens

- [x] **7. 分支界限法 (Branch and Bound)**
  - 重點：Branch + Bound + Pruning、0/1 Knapsack、TSP、搜尋策略

---

### Section 03. 滑動視窗與雙指針

**Config**: `實戰題解 - 經典題目詳解與思路分析`

- [x] **0. 滑動視窗與雙指針介紹**
  - 重點：核心概念、四種類型概覽、時間複雜度分析

- [x] **1. 定長滑動視窗 (Fixed-Length Sliding Window)**
  - 重點：三種維護策略
    - 維護索引
    - 維護值（和/計數）
    - 維護最大/最小值（單調隊列 Deque）
  - 經典題目：Sliding Window Maximum、Maximum Average Subarray I

- [x] **2. 不定長滑動視窗 (Variable-Length Sliding Window)**
  - 重點：三種場景
    - 求最長子陣列（while 不滿足條件 → while 後更新）
    - 求最短子陣列（while 滿足條件 → while 內更新）
    - 計數滿足條件的子陣列（count += right - left + 1）
  - 經典題目：Longest Substring Without Repeating Characters、Minimum Window Substring

- [x] **3. 雙向雙指針 (Opposite Two Pointers)**
  - 重點：從兩端相向移動
    - Two Sum 類問題
    - 容器問題（Container With Most Water）
    - 回文問題
    - 陣列排序（Sort Colors）
  - 經典題目：3Sum、Valid Palindrome

- [x] **4. 同向雙指針 (Same Direction Two Pointers)**
  - 重點：同向移動，速度不同
    - 原地移除元素（Remove Duplicates、Move Zeroes）
    - 鏈表中點（slow 走 1 步，fast 走 2 步）
    - 檢測鏈表環（Floyd's Cycle Detection）
    - 刪除倒數第 n 個節點（fast 先走 n 步）
  - 經典題目：Linked List Cycle、Remove Nth Node From End

---

## 學習重點

### 已完成部分特色

1. **01 - 演算法基礎**：涵蓋所有基礎資料結構，特別解釋了 Deque 的 O(1) 隨機存取原理、Amortized Analysis
2. **02 - 演算法策略**：從基礎排序到進階的 DP、Backtracking，包含完整模板與經典題目
3. **03 - 滑動視窗與雙指針**：系統化分類四種技巧，每種都有詳細模板、典型題目與陷阱說明

### 編寫風格

- ✅ 使用 C++ 作為主要語言
- ✅ 每篇都有 YAML front matter（title、order、description、tags）
- ✅ 定長滑動視窗使用兩段式模板（先建立窗口，再滑動）
- ✅ 提供詳細的圖解與複雜度分析
- ✅ 包含常見陷阱與進階技巧

---

## 統計

### 專案統計（已全部完成！🎉）
- **已完成 Sections**：14 個 ✅
- **已完成章節**：111+ 章
- **總文件數**：125+ 個 markdown 文件
- **涵蓋 LeetCode 題目**：200+ 題

### 技術規格
- **主要語言**：C++
- **文件結構**：Config.md + 章節 markdown
- **編寫風格**：YAML front matter + 詳細圖解 + 完整模板 + 經典題目

---

## 🎉 完成總結

本專案已全部完成！涵蓋從基礎到進階的完整演算法與資料結構知識體系：

### 核心主題
- **基礎建設**：資料結構、演算法策略、複雜度分析
- **經典技巧**：滑動窗口、雙指針、二分搜尋
- **資料結構**：LinkedList、Tree、Stack、Queue、Heap、Union Find、Trie、Segment Tree、Fenwick Tree
- **圖論**：DFS/BFS、最短路徑（Dijkstra、Bellman-Ford、Floyd-Warshall）、MST、拓撲排序、Tarjan
- **動態規劃**：背包問題、LIS/LCS、區間 DP、Tree DP、狀態機 DP、Bitmask DP
- **進階主題**：位元運算、數論、貪心法、字串演算法（KMP、Rabin-Karp、Manacher、AC 自動機）

### 學習成果
- ✅ 14 個完整主題 Section
- ✅ 111+ 詳細章節
- ✅ 200+ LeetCode 題目詳解
- ✅ 全部使用 C++ 實作
- ✅ 繁體中文撰寫
- ✅ 包含完整圖解、複雜度分析與常見陷阱

適合算法競賽準備、技術面試刷題、系統性學習資料結構與演算法！

---

*最後更新：2025-10-07*
*專案狀態：✅ 已全部完成*