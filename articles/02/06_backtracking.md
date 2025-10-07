---
title: "Backtracking (回溯法)"
order: 6
description: "回溯法：窮舉所有可能解，遇到不可行就回退"
tags: ["Backtracking", "回溯法", "DFS", "剪枝"]
---

# Backtracking (回溯法)

## 前言

**Backtracking (回溯法)** 是一種透過**嘗試所有可能性**，在發現當前路徑不可行時**回退**的演算法策略。

---

## 核心思想

### 定義

回溯法 = **DFS + 剪枝 + 回退**

```
嘗試 → 檢查 → 可行？
              ├─ Yes → 繼續深入
              └─ No  → 回退，嘗試下一個
```

### 模板

```cpp
void backtrack(路徑, 選擇列表) {
    if (滿足結束條件) {
        result.add(路徑);
        return;
    }
    
    for (選擇 : 選擇列表) {
        做選擇;
        backtrack(路徑, 選擇列表);
        撤銷選擇;  // 回溯
    }
}
```

---

## 經典問題

### 1. 全排列 (Permutations)

**問題**: 生成所有排列

```cpp
class Solution {
private:
    vector<vector<int>> result;
    
    void backtrack(vector<int>& nums, vector<int>& path, vector<bool>& used) {
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }
        
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;  // 剪枝
            
            // 做選擇
            path.push_back(nums[i]);
            used[i] = true;
            
            // 遞迴
            backtrack(nums, path, used);
            
            // 撤銷選擇（回溯）
            path.pop_back();
            used[i] = false;
        }
    }
    
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<int> path;
        vector<bool> used(nums.size(), false);
        backtrack(nums, path, used);
        return result;
    }
};
```

**決策樹**:
```
[]
├─ [1]
│  ├─ [1,2]
│  │  └─ [1,2,3] ✓
│  └─ [1,3]
│     └─ [1,3,2] ✓
├─ [2]
│  └─ ...
└─ [3]
   └─ ...
```

---

### 2. 組合 (Combinations)

**問題**: 從 n 個數中選 k 個

```cpp
class Solution {
private:
    vector<vector<int>> result;
    
    void backtrack(int n, int k, int start, vector<int>& path) {
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        
        for (int i = start; i <= n; i++) {
            path.push_back(i);
            backtrack(n, k, i + 1, path);  // i+1 避免重複
            path.pop_back();
        }
    }
    
public:
    vector<vector<int>> combine(int n, int k) {
        vector<int> path;
        backtrack(n, k, 1, path);
        return result;
    }
};
```

**剪枝優化**:
```cpp
for (int i = start; i <= n - (k - path.size()) + 1; i++) {
    // 剩餘位置不夠，提前剪枝
}
```

---

### 3. 子集 (Subsets)

**問題**: 生成所有子集

```cpp
class Solution {
private:
    vector<vector<int>> result;
    
    void backtrack(vector<int>& nums, int start, vector<int>& path) {
        result.push_back(path);  // 每個狀態都是一個子集
        
        for (int i = start; i < nums.size(); i++) {
            path.push_back(nums[i]);
            backtrack(nums, i + 1, path);
            path.pop_back();
        }
    }
    
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<int> path;
        backtrack(nums, 0, path);
        return result;
    }
};
```

**決策樹**:
```
[]
├─ [1]
│  ├─ [1,2]
│  │  └─ [1,2,3]
│  └─ [1,3]
├─ [2]
│  └─ [2,3]
└─ [3]
```

---

### 4. N 皇后 (N-Queens)

**問題**: 在 n×n 棋盤上放置 n 個皇后，互不攻擊

```cpp
class Solution {
private:
    vector<vector<string>> result;
    
    bool isValid(vector<string>& board, int row, int col, int n) {
        // 檢查列
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        
        // 檢查左上對角線
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        
        // 檢查右上對角線
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        
        return true;
    }
    
    void backtrack(vector<string>& board, int row, int n) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (!isValid(board, row, col, n)) continue;
            
            board[row][col] = 'Q';
            backtrack(board, row + 1, n);
            board[row][col] = '.';
        }
    }
    
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<string> board(n, string(n, '.'));
        backtrack(board, 0, n);
        return result;
    }
};
```

---

### 5. 數獨求解 (Sudoku Solver)

```cpp
class Solution {
private:
    bool isValid(vector<vector<char>>& board, int row, int col, char num) {
        // 檢查行
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) return false;
        }
        
        // 檢查列
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) return false;
        }
        
        // 檢查 3x3 方格
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;
        for (int i = startRow; i < startRow + 3; i++) {
            for (int j = startCol; j < startCol + 3; j++) {
                if (board[i][j] == num) return false;
            }
        }
        
        return true;
    }
    
    bool backtrack(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != '.') continue;
                
                for (char num = '1'; num <= '9'; num++) {
                    if (!isValid(board, i, j, num)) continue;
                    
                    board[i][j] = num;
                    if (backtrack(board)) return true;
                    board[i][j] = '.';  // 回溯
                }
                
                return false;  // 1-9 都不行
            }
        }
        
        return true;  // 全部填完
    }
    
public:
    void solveSudoku(vector<vector<char>>& board) {
        backtrack(board);
    }
};
```

---

## 剪枝技巧

### 1. 可行性剪枝

提前判斷當前路徑是否可行。

```cpp
if (!isValid(...)) continue;  // 跳過不可行的選擇
```

### 2. 最優性剪枝

如果當前解已經比已知最優解差，提前終止。

```cpp
if (currentCost >= bestCost) return;  // 剪枝
```

### 3. 重複剪枝

避免生成重複的解。

```cpp
// 排序 + 去重
sort(nums.begin(), nums.end());
if (i > start && nums[i] == nums[i - 1]) continue;
```

---

## 回溯法的時間複雜度

### 常見問題的複雜度

| 問題 | 時間複雜度 | 說明 |
|-----|----------|------|
| **全排列** | O(n! × n) | n! 個排列，每個 O(n) 複製 |
| **組合** | O(C(n,k) × k) | C(n,k) 個組合 |
| **子集** | O(2^n × n) | 2^n 個子集 |
| **N 皇后** | O(n!) | 近似 n! |

**特點**: 時間複雜度通常很高，但透過剪枝可以大幅優化。

---

## 回溯法的模板

### 通用模板

```cpp
class Solution {
private:
    vector<路徑類型> result;
    
    void backtrack(參數, 路徑, 選擇列表) {
        // 結束條件
        if (滿足條件) {
            result.push_back(路徑);
            return;
        }
        
        // 遍歷選擇列表
        for (選擇 : 選擇列表) {
            // 剪枝
            if (不滿足條件) continue;
            
            // 做選擇
            路徑.add(選擇);
            
            // 遞迴
            backtrack(參數, 路徑, 新選擇列表);
            
            // 撤銷選擇（回溯）
            路徑.remove(選擇);
        }
    }
    
public:
    返回類型 solve(輸入參數) {
        路徑 path;
        backtrack(參數, path, 選擇列表);
        return result;
    }
};
```

---

## LeetCode 練習題

### 基礎
- [Subsets](https://leetcode.com/problems/subsets/)
- [Permutations](https://leetcode.com/problems/permutations/)
- [Combinations](https://leetcode.com/problems/combinations/)

### 中等
- [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)
- [Combination Sum](https://leetcode.com/problems/combination-sum/)
- [Word Search](https://leetcode.com/problems/word-search/)

### 困難
- [N-Queens](https://leetcode.com/problems/n-queens/)
- [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)
- [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)

---

## 重點總結

### 回溯法特點
- **窮舉所有可能**
- **遇到不可行就回退**
- **需要撤銷選擇**

### 關鍵要素
1. **路徑**: 已經做的選擇
2. **選擇列表**: 當前可以做的選擇
3. **結束條件**: 何時記錄結果

### 優化技巧
- **剪枝**: 提前排除不可行的分支
- **排序**: 便於去重和剪枝
- **記憶化**: 避免重複計算

### 使用場景
- 排列、組合、子集
- 棋盤問題 (N 皇后、數獨)
- 字串分割
- 圖的路徑搜尋

### 記憶技巧
- 回溯 = DFS + 撤銷
- 三部曲：做選擇 → 遞迴 → 撤銷
- 結構固定，套模板即可
