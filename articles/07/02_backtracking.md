---
title: 07-2. Backtracking
order: 2
description: '結合網格圖與回溯算法，解決單詞搜索、路徑規劃等複雜問題。學習狀態恢復、剪枝優化、Trie 樹加速等進階技巧，掌握在網格中搜索所有可能解的方法。'
tags: ['Backtracking', 'Grid', 'Word Search', 'DFS', 'Trie', '回溯', '網格圖']
author: Rain Hu
date: ''
draft: true
---

# Backtracking

回溯（Backtracking）是在網格圖中搜索所有可能路徑的重要技巧。與普通的 DFS 不同，回溯需要：
1. **嘗試所有可能的選擇**
2. **在遞迴返回時恢復狀態**（撤銷選擇）
3. **通常需要找到所有解或最優解**

## 核心模板

```cpp
void backtrack(參數) {
    // 1. 終止條件
    if (滿足結束條件) {
        記錄結果;
        return;
    }

    // 2. 遍歷所有選擇
    for (每個可能的選擇) {
        // 3. 做選擇
        標記已訪問;

        // 4. 遞迴
        backtrack(下一步);

        // 5. 撤銷選擇（回溯）
        取消標記;
    }
}
```

## LeetCode 79: Word Search

### 題目描述

給定一個 m × n 的字符網格和一個字符串 word，判斷 word 是否存在於網格中。單詞必須按照字母順序，通過相鄰的單元格內的字母構成（相鄰單元格是水平或垂直方向）。同一個單元格內的字母不允許被重複使用。

**範例**：
```
輸入: board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
], word = "ABCCED"
輸出: true

輸入: board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
], word = "SEE"
輸出: true

輸入: board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
], word = "ABCB"
輸出: false
```

### 思路

1. 遍歷網格，找到與 word 第一個字符匹配的位置作為起點
2. 從起點開始 DFS + 回溯，嘗試匹配剩餘字符
3. 使用 visited 陣列或原地標記防止重複訪問
4. **關鍵**：遞迴返回時要恢復狀態（回溯）

### 圖解

```
找 "ABCCED"

初始狀態:          找到 A:            找到 B:
A B C E           [A] B C E          [A][B] C E
S F C S            S  F C S           S  F C S
A D E E            A  D E E           A  D E E

找到 C:            找到 C:            找到 E:
[A][B][C] E       [A][B][C] E        [A][B][C][E]
 S  F [C] S        S  F [C] S         S  F [C] S
 A  D  E  E        A  D [E] E         A  D [E] E

找到 D:            成功!
[A][B][C][E]      [A][B][C][C][E][D]
 S  F [C] S
 A [D][E] E
```

### 解法

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    bool backtrack(vector<vector<char>>& board, string& word, int index, int x, int y) {
        // 終止條件：已匹配完所有字符
        if (index == word.size()) {
            return true;
        }

        // 邊界檢查或字符不匹配
        if (x < 0 || x >= m || y < 0 || y >= n ||
            board[x][y] != word[index]) {
            return false;
        }

        // 做選擇：標記當前格子為已訪問
        char temp = board[x][y];
        board[x][y] = '#';  // 使用特殊字符標記

        // 遞迴：嘗試四個方向
        bool found = false;
        for (int i = 0; i < 4; i++) {
            if (backtrack(board, word, index + 1, x + dx[i], y + dy[i])) {
                found = true;
                break;  // 找到一條路徑即可
            }
        }

        // 撤銷選擇：回溯，恢復狀態
        board[x][y] = temp;

        return found;
    }

public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || word.empty()) return false;
        m = board.size();
        n = board[0].size();

        // 嘗試從每個格子開始
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word[0]) {
                    if (backtrack(board, word, 0, i, j)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
};
```

### 優化：提前剪枝

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;

    bool backtrack(vector<vector<char>>& board, string& word, int index, int x, int y) {
        if (index == word.size()) return true;
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] != word[index]) {
            return false;
        }

        char temp = board[x][y];
        board[x][y] = '#';

        for (int i = 0; i < 4; i++) {
            if (backtrack(board, word, index + 1, x + dx[i], y + dy[i])) {
                board[x][y] = temp;  // 恢復後返回
                return true;
            }
        }

        board[x][y] = temp;
        return false;
    }

public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || word.empty()) return false;
        m = board.size();
        n = board[0].size();

        // 優化：統計字符頻率，提前判斷是否可能存在
        unordered_map<char, int> boardCount, wordCount;
        for (const auto& row : board) {
            for (char c : row) {
                boardCount[c]++;
            }
        }

        for (char c : word) {
            wordCount[c]++;
            if (wordCount[c] > boardCount[c]) {
                return false;  // 字符數量不足
            }
        }

        // 優化：如果結尾字符出現次數少，反轉 word
        if (boardCount[word[0]] > boardCount[word.back()]) {
            reverse(word.begin(), word.end());
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (backtrack(board, word, 0, i, j)) {
                    return true;
                }
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(m × n × 4^L)，其中 L 是 word 的長度
**空間複雜度**：O(L)，遞迴深度

---

## LeetCode 212: Word Search II

### 題目描述

給定一個 m × n 的字符網格和一個字符串陣列 words，返回所有同時在網格和 words 中出現的單詞。

**範例**：
```
輸入: board = [
  ["o","a","a","n"],
  ["e","t","a","e"],
  ["i","h","k","r"],
  ["i","f","l","v"]
], words = ["oath","pea","eat","rain"]
輸出: ["eat","oath"]
```

### 思路

如果對每個 word 都執行 Word Search，時間複雜度會非常高。更好的方法是使用 **Trie（字典樹）**：

1. 將所有 words 建成 Trie
2. 在網格上 DFS，同時在 Trie 上匹配
3. 找到完整單詞時記錄結果
4. 使用回溯避免重複訪問

### Trie 節點定義

```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    string word;  // 如果是單詞結尾，存儲完整單詞

    TrieNode() : word("") {}
};

class Trie {
public:
    TrieNode* root;

    Trie() {
        root = new TrieNode();
    }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->word = word;  // 標記單詞結尾
    }
};
```

### 解法

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;
    vector<string> result;

    void backtrack(vector<vector<char>>& board, int x, int y, TrieNode* node) {
        // 邊界檢查
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] == '#') {
            return;
        }

        char c = board[x][y];

        // 在 Trie 中找不到對應字符
        if (!node->children.count(c)) {
            return;
        }

        node = node->children[c];

        // 找到一個完整單詞
        if (!node->word.empty()) {
            result.push_back(node->word);
            node->word = "";  // 避免重複添加
        }

        // 做選擇：標記為已訪問
        board[x][y] = '#';

        // 遞迴：四個方向
        for (int i = 0; i < 4; i++) {
            backtrack(board, x + dx[i], y + dy[i], node);
        }

        // 撤銷選擇：回溯
        board[x][y] = c;

        // 優化：如果當前節點沒有子節點，可以刪除（剪枝）
        if (node->children.empty()) {
            // 這裡可以刪除節點，但需要在父節點操作
            // 為簡化，這裡省略
        }
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        if (board.empty() || words.empty()) return {};
        m = board.size();
        n = board[0].size();

        // 構建 Trie
        Trie trie;
        for (const string& word : words) {
            trie.insert(word);
        }

        // 從每個格子開始 DFS
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                backtrack(board, i, j, trie.root);
            }
        }

        return result;
    }
};
```

### 優化版本（帶剪枝）

```cpp
class Solution {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        string word;
    };

    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;
    vector<string> result;

    void backtrack(vector<vector<char>>& board, int x, int y, TrieNode* parent, char c) {
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] != c) {
            return;
        }

        TrieNode* node = parent->children[c];

        // 找到單詞
        if (!node->word.empty()) {
            result.push_back(node->word);
            node->word = "";  // 去重
        }

        // 剪枝：如果沒有子節點，不需要繼續
        if (node->children.empty()) {
            return;
        }

        // 標記已訪問
        board[x][y] = '#';

        // 只遍歷 Trie 中存在的字符（優化）
        for (auto& [nextChar, nextNode] : node->children) {
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i];
                int ny = y + dy[i];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    board[nx][ny] == nextChar) {
                    backtrack(board, nx, ny, node, nextChar);
                }
            }
        }

        // 回溯
        board[x][y] = c;
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        if (board.empty() || words.empty()) return {};
        m = board.size();
        n = board[0].size();

        // 構建 Trie
        TrieNode* root = new TrieNode();
        for (const string& word : words) {
            TrieNode* node = root;
            for (char c : word) {
                if (!node->children.count(c)) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }
            node->word = word;
        }

        // 從每個格子開始搜索
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                char c = board[i][j];
                if (root->children.count(c)) {
                    backtrack(board, i, j, root, c);
                }
            }
        }

        return result;
    }
};
```

**時間複雜度**：O(m × n × 4^L)，其中 L 是最長單詞的長度
**空間複雜度**：O(N × L)，N 是單詞數量，Trie 的空間

---

## LeetCode 980: Unique Paths III

### 題目描述

在二維網格上，有以下值：
- 1：起點
- 2：終點
- 0：可以走的空格
- -1：障礙物

從起點走到終點，要求走過**所有**非障礙格子恰好一次。返回滿足條件的路徑數量。

**範例**：
```
輸入: grid = [
  [1,0,0,0],
  [0,0,0,0],
  [0,0,2,-1]
]
輸出: 2
解釋: 有 2 條路徑可以走過所有非障礙格子
```

### 思路

1. 先統計所有非障礙格子的數量（包括起點和終點）
2. 從起點開始 DFS + 回溯
3. 到達終點時，檢查是否走過所有格子
4. 回溯時恢復狀態

### 圖解

```
起點=1, 終點=2, 空格=0, 障礙=-1

路徑 1:
1→0→0→0     [1]→ 0 → 0 → 0     [1][2][3][4]
↓           ↓                   ↓
0  0 0 0    0   0   0   0       [8][7][6][5]
↓  ↓
0  0 2 -1   [9][10][2][-1]

路徑 2:
1  0 0 0    [1][2][3][4]
↓  ↓         ↓   ↓
0  0 0 0    [8][7][6][5]
↓           ↓
0  0 2 -1   [9][10][2][-1]
```

### 解法

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;
    int totalCells;  // 需要走過的總格子數
    int paths;       // 路徑數量

    void backtrack(vector<vector<int>>& grid, int x, int y, int count) {
        // 邊界檢查或遇到障礙/已訪問
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] < 0) {
            return;
        }

        // 到達終點
        if (grid[x][y] == 2) {
            // 檢查是否走過所有格子
            if (count == totalCells) {
                paths++;
            }
            return;
        }

        // 做選擇：標記為已訪問
        int temp = grid[x][y];
        grid[x][y] = -2;  // 使用負數標記已訪問

        // 遞迴：四個方向
        for (int i = 0; i < 4; i++) {
            backtrack(grid, x + dx[i], y + dy[i], count + 1);
        }

        // 撤銷選擇：回溯
        grid[x][y] = temp;
    }

public:
    int uniquePathsIII(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();

        int startX = 0, startY = 0;
        totalCells = 0;
        paths = 0;

        // 統計需要走過的格子數，找到起點
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] >= 0) {
                    totalCells++;  // 0, 1, 2 都要走過
                }
                if (grid[i][j] == 1) {
                    startX = i;
                    startY = j;
                }
            }
        }

        backtrack(grid, startX, startY, 0);
        return paths;
    }
};
```

### 優化：狀態壓縮（適用於小網格）

對於小規模網格（m × n ≤ 20），可以使用位運算壓縮訪問狀態：

```cpp
class Solution {
private:
    const int dx[4] = {-1, 1, 0, 0};
    const int dy[4] = {0, 0, -1, 1};
    int m, n;
    int endX, endY;
    int targetMask;  // 所有非障礙格子的位元遮罩

    int backtrack(vector<vector<int>>& grid, int x, int y, int mask) {
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == -1) {
            return 0;
        }

        int idx = x * n + y;

        // 已訪問過
        if (mask & (1 << idx)) {
            return 0;
        }

        // 到達終點
        if (x == endX && y == endY) {
            return (mask | (1 << idx)) == targetMask ? 1 : 0;
        }

        // 標記已訪問
        mask |= (1 << idx);

        int count = 0;
        for (int i = 0; i < 4; i++) {
            count += backtrack(grid, x + dx[i], y + dy[i], mask);
        }

        return count;
    }

public:
    int uniquePathsIII(vector<vector<int>>& grid) {
        if (grid.empty()) return 0;
        m = grid.size();
        n = grid[0].size();

        int startX = 0, startY = 0;
        targetMask = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] != -1) {
                    targetMask |= (1 << (i * n + j));
                }
                if (grid[i][j] == 1) {
                    startX = i;
                    startY = j;
                } else if (grid[i][j] == 2) {
                    endX = i;
                    endY = j;
                }
            }
        }

        return backtrack(grid, startX, startY, 0);
    }
};
```

**時間複雜度**：O(4^(m×n))，最壞情況
**空間複雜度**：O(m × n)，遞迴深度

---

## 總結

### 回溯的關鍵要素

1. **做選擇**：標記當前狀態
2. **遞迴探索**：繼續下一步
3. **撤銷選擇**：恢復狀態（回溯）
4. **終止條件**：找到解或無解

### DFS vs 回溯

| 特性 | DFS | 回溯 |
|------|-----|------|
| 狀態恢復 | 不需要 | 需要 |
| 目標 | 遍歷/搜索 | 找所有解 |
| 標記方式 | 永久標記 | 臨時標記 |
| 複雜度 | 通常較低 | 通常較高 |

### 優化技巧

1. **提前剪枝**：統計字符頻率、判斷可行性
2. **Trie 優化**：多字符串搜索使用 Trie
3. **狀態壓縮**：小規模問題使用位運算
4. **反轉搜索**：從出現頻率低的字符開始

### 練習建議

1. 理解回溯的本質：嘗試所有可能性
2. 掌握狀態恢復的時機和方法
3. 注意與普通 DFS 的區別
4. 學會使用 Trie 優化多字符串問題
