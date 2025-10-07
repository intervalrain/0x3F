---
title: "Tree DP"
order: 8
description: "樹上的動態規劃問題"
tags: ["動態規劃", "Tree DP", "樹", "DFS"]
---

# Tree DP

Tree DP 是在樹結構上進行的動態規劃。樹的遞迴結構使得動態規劃非常自然:通過後序遍歷,我們可以先計算子樹的 DP 值,再計算當前節點的 DP 值。

## 核心概念

### 樹 DP 的特點

1. **遞迴結構**: 樹天然具有遞迴結構
2. **後序遍歷**: 先處理子節點,再處理父節點
3. **狀態定義**: 通常 `dp[u]` 表示以 u 為根的子樹的最優解
4. **轉移方向**: 從子節點向父節點轉移

### 基本模板

```cpp
void dfs(TreeNode* node) {
    if (!node) return;

    // 後序遍歷:先處理子節點
    dfs(node->left);
    dfs(node->right);

    // 根據子節點的 DP 值計算當前節點的 DP 值
    dp[node] = function(dp[node->left], dp[node->right]);
}
```

---

## 經典問題 1: 打家劫舍 III (House Robber III)

[LeetCode 337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

### 問題描述

小偷發現了一個新的可行竊的地區。這個地區的房屋排列像一棵二叉樹。如果兩個直接相連的房子在同一天被打劫,就會觸發警報。計算在不觸動警報的情況下,小偷一晚能夠盜取的最高金額。

**範例:**
```
輸入: root = [3,2,3,null,3,null,1]
      3
     / \
    2   3
     \   \
      3   1
輸出: 7
解釋: 小偷可以偷 3 + 3 + 1 = 7
```

### 問題分析

這是一道經典的樹上 DP 問題。

**狀態定義:**
對於每個節點,有兩種狀態:
- `rob`: 偷這個節點的最大金額
- `notRob`: 不偷這個節點的最大金額

**狀態轉移:**
設當前節點為 u,左子節點為 L,右子節點為 R:

1. **偷 u**:
   - 不能偷 L 和 R
   - `rob[u] = u.val + notRob[L] + notRob[R]`

2. **不偷 u**:
   - L 和 R 可偷可不偷,取最大值
   - `notRob[u] = max(rob[L], notRob[L]) + max(rob[R], notRob[R])`

### 解法實現

#### 解法 1: 記憶化搜索

```cpp
class Solution {
private:
    unordered_map<TreeNode*, int> robMemo, notRobMemo;

    void dfs(TreeNode* node) {
        if (!node) return;

        dfs(node->left);
        dfs(node->right);

        // 偷當前節點
        robMemo[node] = node->val +
                        notRobMemo[node->left] +
                        notRobMemo[node->right];

        // 不偷當前節點
        notRobMemo[node] = max(robMemo[node->left], notRobMemo[node->left]) +
                           max(robMemo[node->right], notRobMemo[node->right]);
    }

public:
    int rob(TreeNode* root) {
        notRobMemo[nullptr] = 0;
        robMemo[nullptr] = 0;

        dfs(root);

        return max(robMemo[root], notRobMemo[root]);
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(n)

#### 解法 2: 返回 pair (更簡潔)

```cpp
class Solution {
private:
    // 返回 {rob, notRob}
    pair<int, int> dfs(TreeNode* node) {
        if (!node) return {0, 0};

        auto [robL, notRobL] = dfs(node->left);
        auto [robR, notRobR] = dfs(node->right);

        // 偷當前節點:不能偷子節點
        int rob = node->val + notRobL + notRobR;

        // 不偷當前節點:子節點可偷可不偷
        int notRob = max(robL, notRobL) + max(robR, notRobR);

        return {rob, notRob};
    }

public:
    int rob(TreeNode* root) {
        auto [rob, notRob] = dfs(root);
        return max(rob, notRob);
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(h),h 為樹高

---

## 經典問題 2: 二叉樹的直徑 (Diameter of Binary Tree)

[LeetCode 543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

### 問題描述

給定一棵二叉樹,你需要計算它的直徑長度。一棵二叉樹的直徑長度是任意兩個節點路徑長度中的最大值。這條路徑可能穿過也可能不穿過根節點。

**範例:**
```
輸入:
      1
     / \
    2   3
   / \
  4   5
輸出: 3
解釋: 路徑 [4,2,1,3] 或 [5,2,1,3],長度為 3
```

### 問題分析

**狀態定義:**
- `depth[u]`: 從節點 u 往下的最大深度

**直徑計算:**
對於每個節點 u,經過 u 的最長路徑 = 左子樹深度 + 右子樹深度

**關鍵:** 在計算深度的同時更新直徑。

### 解法實現

```cpp
class Solution {
private:
    int diameter = 0;

    int depth(TreeNode* node) {
        if (!node) return 0;

        // 計算左右子樹的深度
        int leftDepth = depth(node->left);
        int rightDepth = depth(node->right);

        // 更新直徑(經過當前節點的最長路徑)
        diameter = max(diameter, leftDepth + rightDepth);

        // 返回當前節點的深度
        return 1 + max(leftDepth, rightDepth);
    }

public:
    int diameterOfBinaryTree(TreeNode* root) {
        depth(root);
        return diameter;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(h)

---

## 經典問題 3: 二叉樹中的最大路徑和 (Binary Tree Maximum Path Sum)

[LeetCode 124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

### 問題描述

給定一個非空二叉樹,返回其最大路徑和。路徑被定義為從樹中任意節點出發,沿父節點-子節點連接,達到任意節點的序列。路徑至少包含一個節點,且不一定經過根節點。

**範例:**
```
輸入: root = [-10,9,20,null,null,15,7]
       -10
       /  \
      9   20
         /  \
        15   7
輸出: 42
解釋: 路徑 15 → 20 → 7,和為 42
```

### 問題分析

這題比直徑問題更復雜,因為要考慮節點值可能為負。

**狀態定義:**
- `maxGain[u]`: 從節點 u 出發向下的最大路徑和(只能選一個分支)

**路徑和計算:**
對於每個節點 u,經過 u 的最大路徑和 = u.val + maxGain[L] + maxGain[R]
但是 `maxGain` 可能為負,可以選擇不走子樹。

### 解法實現

```cpp
class Solution {
private:
    int maxSum = INT_MIN;

    int maxGain(TreeNode* node) {
        if (!node) return 0;

        // 計算左右子樹的最大貢獻(負數則不選)
        int leftGain = max(0, maxGain(node->left));
        int rightGain = max(0, maxGain(node->right));

        // 更新全局最大路徑和(經過當前節點)
        int pathSum = node->val + leftGain + rightGain;
        maxSum = max(maxSum, pathSum);

        // 返回當前節點的最大貢獻(只能選一個分支)
        return node->val + max(leftGain, rightGain);
    }

public:
    int maxPathSum(TreeNode* root) {
        maxGain(root);
        return maxSum;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(h)

---

## 經典問題 4: 監控二叉樹 (Binary Tree Cameras)

[LeetCode 968. Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras/)

### 問題描述

給定一個二叉樹,我們在樹的節點上安裝監控攝像頭。每個攝像頭可以監視其父節點、自身及其直接子節點。計算監控樹的所有節點所需的最小攝像頭數量。

**範例:**
```
輸入: [0,0,null,0,0]
        0
       /
      0
       \
        0
       /
      0
輸出: 1
解釋: 在根節點的子節點安裝一個攝像頭可以監控所有節點
```

### 問題分析

這是一道較難的樹 DP 問題。

**狀態定義:**
對於每個節點,有三種狀態:
- `0`: 節點未被覆蓋
- `1`: 節點被覆蓋(但沒有攝像頭)
- `2`: 節點有攝像頭

**狀態轉移:**
對於節點 u,根據左右子節點的狀態決定:
- 如果有子節點未被覆蓋,u 必須放攝像頭
- 如果所有子節點都被覆蓋且沒有攝像頭,u 可以不放(讓父節點放)
- 如果有子節點有攝像頭,u 被覆蓋

**貪心策略:** 從葉子節點開始,盡量在父節點放攝像頭(一個攝像頭能覆蓋三個節點)。

### 解法實現

```cpp
class Solution {
private:
    int cameras = 0;

    // 返回節點狀態: 0-未覆蓋, 1-被覆蓋, 2-有攝像頭
    int dfs(TreeNode* node) {
        if (!node) return 1;  // 空節點視為已覆蓋

        int left = dfs(node->left);
        int right = dfs(node->right);

        // 如果有子節點未被覆蓋,當前節點必須放攝像頭
        if (left == 0 || right == 0) {
            cameras++;
            return 2;
        }

        // 如果有子節點有攝像頭,當前節點被覆蓋
        if (left == 2 || right == 2) {
            return 1;
        }

        // 兩個子節點都被覆蓋但沒有攝像頭
        // 當前節點不放攝像頭(等父節點放)
        return 0;
    }

public:
    int minCameraCover(TreeNode* root) {
        // 如果根節點未被覆蓋,需要放攝像頭
        if (dfs(root) == 0) {
            cameras++;
        }
        return cameras;
    }
};
```

**時間複雜度:** O(n)
**空間複雜度:** O(h)

---

## Tree DP 總結

### 關鍵要點

1. **後序遍歷**
   - 先處理子節點,再處理父節點
   - DFS 的返回值通常是 DP 狀態

2. **狀態定義**
   - `dp[u]`: 以 u 為根的子樹的最優解
   - 有時需要多個狀態(如選/不選)

3. **轉移方向**
   - 從葉子節點向根節點
   - 父節點的狀態由子節點決定

4. **常見模式**
   - 返回單個值(深度、路徑和等)
   - 返回 pair/tuple(多個狀態)
   - 使用全局變量更新答案

### 解題模板

```cpp
// 模板 1: 返回單個值
int dfs(TreeNode* node) {
    if (!node) return base_case;

    int leftDP = dfs(node->left);
    int rightDP = dfs(node->right);

    // 更新全局答案(可選)
    globalAnswer = update(globalAnswer, leftDP, rightDP);

    // 返回當前節點的 DP 值
    return function(leftDP, rightDP);
}

// 模板 2: 返回多個狀態
pair<int, int> dfs(TreeNode* node) {
    if (!node) return {base1, base2};

    auto [left1, left2] = dfs(node->left);
    auto [right1, right2] = dfs(node->right);

    int state1 = function1(left1, left2, right1, right2);
    int state2 = function2(left1, left2, right1, right2);

    return {state1, state2};
}
```

### 常見問題類型

| 問題類型 | 狀態定義 | 範例 |
|----------|----------|------|
| 路徑和 | 經過/不經過當前節點 | Max Path Sum |
| 選擇問題 | 選/不選當前節點 | House Robber III |
| 距離/深度 | 以當前節點為根的深度 | Diameter, Height |
| 覆蓋問題 | 節點的覆蓋狀態 | Tree Cameras |

### 常見錯誤

1. **遍歷順序錯誤**
   - 必須後序遍歷(先子節點再父節點)

2. **邊界條件處理**
   - 空節點的返回值
   - 葉子節點的特殊處理

3. **狀態更新位置**
   - 在遞迴前還是遞迴後更新?

4. **全局變量使用**
   - 記得在函數開始時初始化

### 複雜度分析

- **時間複雜度:** O(n)
  - 每個節點訪問一次

- **空間複雜度:** O(h)
  - h 是樹的高度
  - 遞迴調用棧的深度

---

Tree DP 是動態規劃在樹結構上的自然應用,利用樹的遞迴性質,可以優雅地解決許多看似複雜的問題。掌握後序遍歷和狀態定義是解決 Tree DP 問題的關鍵。
