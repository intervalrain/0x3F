---
title: 05-6. Tree + Backtracking
order: 6
description: '結合樹形結構與回溯算法，解決路徑搜尋、組合問題、決策樹等經典題型。掌握樹上回溯的模板與技巧，學習如何在樹中尋找所有可能的解。'
tags: ['Tree', 'Backtracking', 'Path Sum', 'DFS', '樹', '回溯']
author: Rain Hu
date: '2025-10-30'
draft: false
---

# Tree + Backtracking (樹 + 回溯)

## 1. 基本概念

樹的回溯問題通常涉及：
- 尋找從根到葉的所有路徑
- 尋找滿足特定條件的路徑
- 路徑和問題
- 組合問題

**回溯模板**：
```cpp
void backtrack(TreeNode* node, vector<int>& path, vector<vector<int>>& result) {
    if (!node) return;

    // 選擇：將當前節點加入路徑
    path.push_back(node->val);

    // 終止條件：到達葉節點
    if (!node->left && !node->right) {
        result.push_back(path);
    }

    // 遞迴：探索左右子樹
    backtrack(node->left, path, result);
    backtrack(node->right, path, result);

    // 撤銷選擇：回溯
    path.pop_back();
}
```

## 2. 路徑和問題

### 2.1 路徑總和 II

找出所有從根到葉且節點值之和等於目標和的路徑。

```cpp
// LeetCode 113. Path Sum II
class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> result;
        vector<int> path;
        backtrack(root, targetSum, path, result);
        return result;
    }

private:
    void backtrack(TreeNode* node, int targetSum,
                   vector<int>& path, vector<vector<int>>& result) {
        if (!node) return;

        // 選擇：將當前節點加入路徑
        path.push_back(node->val);

        // 終止條件：到達葉節點且路徑和等於目標和
        if (!node->left && !node->right && targetSum == node->val) {
            result.push_back(path);
        }

        // 遞迴：探索左右子樹
        backtrack(node->left, targetSum - node->val, path, result);
        backtrack(node->right, targetSum - node->val, path, result);

        // 撤銷選擇：回溯
        path.pop_back();
    }
};
```

**時間複雜度**: O(n²)，最壞情況需要複製 n 條路徑，每條路徑長度為 O(n)
**空間複雜度**: O(n)，遞迴調用棧

### 2.2 路徑總和 III

找出路徑和等於目標值的路徑總數（路徑不需要從根節點開始，也不需要在葉節點結束）。

```cpp
// LeetCode 437. Path Sum III
class Solution {
public:
    int pathSum(TreeNode* root, int targetSum) {
        if (!root) return 0;

        // 以當前節點為起點的路徑數 + 左子樹的結果 + 右子樹的結果
        return pathSumFrom(root, targetSum) +
               pathSum(root->left, targetSum) +
               pathSum(root->right, targetSum);
    }

private:
    // 計算以 node 為起點的路徑數
    int pathSumFrom(TreeNode* node, long targetSum) {
        if (!node) return 0;

        int count = 0;
        if (node->val == targetSum) {
            count = 1;
        }

        count += pathSumFrom(node->left, targetSum - node->val);
        count += pathSumFrom(node->right, targetSum - node->val);

        return count;
    }
};

// 優化版本：使用前綴和 + HashMap
class Solution {
public:
    int pathSum(TreeNode* root, int targetSum) {
        unordered_map<long, int> prefixSum;  // prefixSum -> count
        prefixSum[0] = 1;  // 初始化：空路徑的和為 0
        return dfs(root, 0, targetSum, prefixSum);
    }

private:
    int dfs(TreeNode* node, long currSum, int targetSum,
            unordered_map<long, int>& prefixSum) {
        if (!node) return 0;

        currSum += node->val;

        // 查找是否存在前綴和，使得 currSum - prefixSum = targetSum
        int count = prefixSum[currSum - targetSum];

        // 更新前綴和
        prefixSum[currSum]++;

        // 遞迴處理左右子樹
        count += dfs(node->left, currSum, targetSum, prefixSum);
        count += dfs(node->right, currSum, targetSum, prefixSum);

        // 回溯：移除當前節點的貢獻
        prefixSum[currSum]--;

        return count;
    }
};
```

## 3. 二元樹的所有路徑

### 3.1 基本路徑問題

```cpp
// LeetCode 257. Binary Tree Paths
class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> result;
        if (!root) return result;

        string path = to_string(root->val);
        dfs(root, path, result);
        return result;
    }

private:
    void dfs(TreeNode* node, string path, vector<string>& result) {
        // 到達葉節點
        if (!node->left && !node->right) {
            result.push_back(path);
            return;
        }

        // 探索左子樹
        if (node->left) {
            dfs(node->left, path + "->" + to_string(node->left->val), result);
        }

        // 探索右子樹
        if (node->right) {
            dfs(node->right, path + "->" + to_string(node->right->val), result);
        }
    }
};

// 方法2：使用 vector<int> 存儲路徑
class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> result;
        vector<int> path;
        backtrack(root, path, result);
        return result;
    }

private:
    void backtrack(TreeNode* node, vector<int>& path, vector<string>& result) {
        if (!node) return;

        path.push_back(node->val);

        if (!node->left && !node->right) {
            result.push_back(pathToString(path));
        }

        backtrack(node->left, path, result);
        backtrack(node->right, path, result);

        path.pop_back();
    }

    string pathToString(const vector<int>& path) {
        string result = to_string(path[0]);
        for (int i = 1; i < path.size(); i++) {
            result += "->" + to_string(path[i]);
        }
        return result;
    }
};
```

### 3.2 根到葉的數字之和

```cpp
// LeetCode 129. Sum Root to Leaf Numbers
class Solution {
public:
    int sumNumbers(TreeNode* root) {
        return dfs(root, 0);
    }

private:
    int dfs(TreeNode* node, int currentSum) {
        if (!node) return 0;

        currentSum = currentSum * 10 + node->val;

        // 到達葉節點
        if (!node->left && !node->right) {
            return currentSum;
        }

        // 遞迴計算左右子樹
        return dfs(node->left, currentSum) + dfs(node->right, currentSum);
    }
};
```

## 4. 從葉到根的路徑

### 4.1 葉子相似的樹

```cpp
// LeetCode 872. Leaf-Similar Trees
class Solution {
public:
    bool leafSimilar(TreeNode* root1, TreeNode* root2) {
        vector<int> leaves1, leaves2;
        getLeaves(root1, leaves1);
        getLeaves(root2, leaves2);
        return leaves1 == leaves2;
    }

private:
    void getLeaves(TreeNode* node, vector<int>& leaves) {
        if (!node) return;

        if (!node->left && !node->right) {
            leaves.push_back(node->val);
            return;
        }

        getLeaves(node->left, leaves);
        getLeaves(node->right, leaves);
    }
};
```

## 5. 路徑判斷

### 5.1 檢查路徑是否存在

```cpp
// 檢查是否存在從根到葉的路徑，使得路徑上的節點值形成給定的序列
class Solution {
public:
    bool isValidSequence(TreeNode* root, vector<int>& arr) {
        return dfs(root, arr, 0);
    }

private:
    bool dfs(TreeNode* node, vector<int>& arr, int index) {
        if (!node || index >= arr.size() || node->val != arr[index]) {
            return false;
        }

        // 到達葉節點，檢查是否匹配完整序列
        if (!node->left && !node->right) {
            return index == arr.size() - 1;
        }

        // 探索左右子樹
        return dfs(node->left, arr, index + 1) ||
               dfs(node->right, arr, index + 1);
    }
};
```

### 5.2 二元樹中的偽回文路徑

```cpp
// LeetCode 1457. Pseudo-Palindromic Paths in a Binary Tree
class Solution {
public:
    int pseudoPalindromicPaths(TreeNode* root) {
        return dfs(root, 0);
    }

private:
    int dfs(TreeNode* node, int path) {
        if (!node) return 0;

        // 使用位運算記錄每個數字出現的奇偶性
        path ^= (1 << node->val);

        // 到達葉節點
        if (!node->left && !node->right) {
            // 檢查是否最多只有一個數字出現奇數次
            return (path & (path - 1)) == 0 ? 1 : 0;
        }

        return dfs(node->left, path) + dfs(node->right, path);
    }
};
```

## 6. 組合與子集問題

### 6.1 二元樹的所有子路徑

```cpp
// 生成二元樹的所有子路徑（不僅限於根到葉）
class Solution {
public:
    vector<vector<int>> allPaths(TreeNode* root) {
        vector<vector<int>> result;
        vector<int> path;
        generatePaths(root, path, result);
        return result;
    }

private:
    void generatePaths(TreeNode* node, vector<int>& path,
                      vector<vector<int>>& result) {
        if (!node) return;

        path.push_back(node->val);

        // 添加當前路徑（非空）
        if (!path.empty()) {
            result.push_back(path);
        }

        generatePaths(node->left, path, result);
        generatePaths(node->right, path, result);

        path.pop_back();
    }
};
```

### 6.2 路徑中的最大值

```cpp
// 找出從根到葉的所有路徑中，路徑最大值最小的那條路徑
class Solution {
public:
    int minMaxPathSum(TreeNode* root) {
        int result = INT_MAX;
        dfs(root, INT_MIN, result);
        return result;
    }

private:
    void dfs(TreeNode* node, int maxVal, int& result) {
        if (!node) return;

        maxVal = max(maxVal, node->val);

        // 到達葉節點
        if (!node->left && !node->right) {
            result = min(result, maxVal);
            return;
        }

        dfs(node->left, maxVal, result);
        dfs(node->right, maxVal, result);
    }
};
```

## 7. 高級回溯問題

### 7.1 分割樹使和相等

```cpp
// LeetCode 663. Equal Tree Partition
class Solution {
public:
    bool checkEqualTree(TreeNode* root) {
        unordered_multiset<int> seen;
        int totalSum = getSum(root, seen);

        // 移除根節點的和（因為不能在根節點處分割）
        seen.erase(seen.find(totalSum));

        // 檢查是否存在子樹和等於總和的一半
        return totalSum % 2 == 0 && seen.count(totalSum / 2);
    }

private:
    int getSum(TreeNode* node, unordered_multiset<int>& seen) {
        if (!node) return 0;

        int sum = node->val +
                  getSum(node->left, seen) +
                  getSum(node->right, seen);

        seen.insert(sum);
        return sum;
    }
};
```

### 7.2 二元樹的最長連續序列

```cpp
// LeetCode 298. Binary Tree Longest Consecutive Sequence
class Solution {
public:
    int longestConsecutive(TreeNode* root) {
        int maxLen = 0;
        dfs(root, nullptr, 0, maxLen);
        return maxLen;
    }

private:
    void dfs(TreeNode* node, TreeNode* parent, int length, int& maxLen) {
        if (!node) return;

        // 如果當前節點值 = 父節點值 + 1，則延續序列
        length = (parent && node->val == parent->val + 1) ? length + 1 : 1;

        maxLen = max(maxLen, length);

        dfs(node->left, node, length, maxLen);
        dfs(node->right, node, length, maxLen);
    }
};

// LeetCode 549. Binary Tree Longest Consecutive Sequence II
// 允許遞增或遞減序列
class Solution {
public:
    int longestConsecutive(TreeNode* root) {
        int maxLen = 0;
        dfs(root, maxLen);
        return maxLen;
    }

private:
    // 返回 {increasing_length, decreasing_length}
    pair<int, int> dfs(TreeNode* node, int& maxLen) {
        if (!node) return {0, 0};

        int inc = 1, dec = 1;  // 遞增和遞減長度

        if (node->left) {
            auto [leftInc, leftDec] = dfs(node->left, maxLen);
            if (node->val == node->left->val + 1) {
                dec = leftDec + 1;
            } else if (node->val == node->left->val - 1) {
                inc = leftInc + 1;
            }
        }

        if (node->right) {
            auto [rightInc, rightDec] = dfs(node->right, maxLen);
            if (node->val == node->right->val + 1) {
                dec = max(dec, rightDec + 1);
            } else if (node->val == node->right->val - 1) {
                inc = max(inc, rightInc + 1);
            }
        }

        // 更新最大長度（連接左右子樹）
        maxLen = max(maxLen, inc + dec - 1);

        return {inc, dec};
    }
};
```

## 8. 實戰技巧

### 8.1 回溯模板總結

```cpp
// 模板1：收集所有路徑
void backtrack(TreeNode* node, vector<int>& path, vector<vector<int>>& result) {
    if (!node) return;

    path.push_back(node->val);

    if (isLeaf(node)) {
        result.push_back(path);
    }

    backtrack(node->left, path, result);
    backtrack(node->right, path, result);

    path.pop_back();  // 回溯
}

// 模板2：累積計算（不需要回溯）
int dfs(TreeNode* node, int accumulated) {
    if (!node) return 0;

    accumulated = updateAccumulated(node, accumulated);

    if (isLeaf(node)) {
        return accumulated;
    }

    return dfs(node->left, accumulated) + dfs(node->right, accumulated);
}

// 模板3：使用全局變量記錄結果
void dfs(TreeNode* node, int& globalResult, int currentState) {
    if (!node) return;

    updateState(node, currentState);

    if (isLeaf(node)) {
        globalResult = max(globalResult, currentState);
    }

    dfs(node->left, globalResult, currentState);
    dfs(node->right, globalResult, currentState);

    restoreState(currentState);  // 如果需要回溯
}
```

### 8.2 常見優化技巧

1. **使用字符串拼接代替 vector**：減少回溯操作
2. **使用位運算**：記錄狀態更高效
3. **提前剪枝**：不滿足條件時立即返回
4. **使用前綴和**：優化路徑和問題

```cpp
// 優化示例：使用位運算記錄訪問狀態
void dfs(TreeNode* node, int visited, vector<int>& result) {
    if (!node) return;

    // 檢查是否訪問過
    if (visited & (1 << node->val)) {
        return;  // 剪枝
    }

    visited |= (1 << node->val);

    if (isLeaf(node)) {
        result.push_back(countBits(visited));
    }

    dfs(node->left, visited, result);
    dfs(node->right, visited, result);
}
```

## 總結

### 關鍵要點

1. **回溯三步驟**：
   - 選擇：將當前節點加入路徑
   - 探索：遞迴處理子樹
   - 撤銷：移除當前節點（回溯）

2. **終止條件**：
   - 通常是到達葉節點
   - 有時需要在中間節點也記錄結果

3. **狀態傳遞**：
   - 使用參數傳遞：路徑、累積和等
   - 使用全局變量：記錄最優解

4. **優化技巧**：
   - 提前剪枝
   - 使用位運算
   - HashMap 記錄中間結果

### 複雜度分析

- **時間複雜度**：通常是 O(n) 或 O(n²)，取決於是否需要複製路徑
- **空間複雜度**：O(h)，h 是樹的高度（遞迴調用棧）
