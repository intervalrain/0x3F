---
title: 06-2. 下一個更大元素 (Next Greater Element)
order: 2
description: '掌握單調棧解決 Next Greater Element 問題的核心技巧。從暴力解法到 O(n) 優化，理解單調遞減棧的工作原理，並應用於循環陣列、溫度預測、股票跨度等經典題型。'
tags: ['Monotonic Stack', 'Next Greater Element', 'LeetCode', '單調棧', '陣列']
author: Rain Hu
date: ''
draft: true
---

# 下一個更大元素 (Next Greater Element)

## 核心概念

**Next Greater Element (NGE)** 問題：給定一個陣列，對於每個元素，找到它右邊第一個比它大的元素。

### 暴力解法的問題

```cpp
// 暴力解法：O(n²)
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[j] > nums[i]) {
                result[i] = nums[j];
                break;
            }
        }
    }

    return result;
}
```

**問題：** 時間複雜度 O(n²)，效率太低。

### 單調棧優化

使用**單調遞減棧**可以將時間複雜度優化到 O(n)。

**核心思想：**
- 維護一個從棧底到棧頂**遞減**的棧
- 當遇到一個更大的元素時，棧中所有小於它的元素都找到了 NGE
- 每個元素最多入棧一次、出棧一次，總時間複雜度 O(n)

```cpp
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存儲索引

    for (int i = 0; i < n; i++) {
        // 當前元素比棧頂元素大，找到了棧頂的 NGE
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }

    return result;
}
```

### 工作原理示例

```
nums = [2, 1, 2, 4, 3]

i=0, num=2:
  Stack: [0]  (存的是索引)
  result: [-1, -1, -1, -1, -1]

i=1, num=1:
  1 < 2, 不彈出
  Stack: [0, 1]
  result: [-1, -1, -1, -1, -1]

i=2, num=2:
  2 > 1, 彈出索引1, result[1] = 2
  2 = 2, 不彈出索引0
  Stack: [0, 2]
  result: [-1, 2, -1, -1, -1]

i=3, num=4:
  4 > 2, 彈出索引2, result[2] = 4
  4 > 2, 彈出索引0, result[0] = 4
  Stack: [3]
  result: [4, 2, 4, -1, -1]

i=4, num=3:
  3 < 4, 不彈出
  Stack: [3, 4]
  result: [4, 2, 4, -1, -1]

最終結果: [4, 2, 4, -1, -1]
```

---

## LeetCode 496: Next Greater Element I

**問題：** 給定兩個沒有重複元素的陣列 `nums1` 和 `nums2`，其中 `nums1` 是 `nums2` 的子集。找出 `nums1` 中每個元素在 `nums2` 中的下一個比它大的值。

**示例：**
```
Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]
Explanation:
  4 在 nums2 中沒有更大的元素，返回 -1
  1 的下一個更大元素是 3
  2 在 nums2 中沒有更大的元素，返回 -1
```

### 解法：單調棧 + 哈希表

```cpp
class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        // Step 1: 使用單調棧找出 nums2 中每個元素的 NGE
        unordered_map<int, int> nge;  // num -> next greater element
        stack<int> st;

        for (int num : nums2) {
            // 當前元素比棧頂大，找到了棧頂的 NGE
            while (!st.empty() && num > st.top()) {
                nge[st.top()] = num;
                st.pop();
            }
            st.push(num);
        }

        // Step 2: 查詢 nums1 中每個元素的 NGE
        vector<int> result;
        for (int num : nums1) {
            result.push_back(nge.count(num) ? nge[num] : -1);
        }

        return result;
    }
};
```

**時間複雜度：** O(m + n)，m 和 n 分別是 nums1 和 nums2 的長度
**空間複雜度：** O(n)

### 詳細過程

```
nums2 = [1, 3, 4, 2]

num=1: Stack=[1]
num=3: 3>1, nge[1]=3, Stack=[3]
num=4: 4>3, nge[3]=4, Stack=[4]
num=2: 2<4, Stack=[4,2]

哈希表: {1->3, 3->4}

查詢 nums1=[4,1,2]:
  4: 不在哈希表中 -> -1
  1: nge[1] = 3
  2: 不在哈希表中 -> -1

結果: [-1, 3, -1]
```

---

## LeetCode 503: Next Greater Element II

**問題：** 給定一個循環陣列，找出每個元素的下一個更大元素。循環陣列意味著陣列的末尾連接到開頭。

**示例：**
```
Input: nums = [1,2,1]
Output: [2,-1,2]
Explanation:
  第一個 1 的下一個更大元素是 2
  2 是最大的，沒有更大的，返回 -1
  最後一個 1 的下一個更大元素是 2（循環）
```

### 解法：單調棧 + 循環遍歷

**核心思想：** 將陣列遍歷兩次，模擬循環效果。

```cpp
class Solution {
public:
    vector<int> nextGreaterElements(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;  // 存儲索引

        // 遍歷兩次陣列，模擬循環
        for (int i = 0; i < 2 * n; i++) {
            int num = nums[i % n];  // 取模實現循環

            // 當前元素比棧頂大，找到了棧頂的 NGE
            while (!st.empty() && num > nums[st.top()]) {
                int idx = st.top();
                st.pop();
                result[idx] = num;
            }

            // 只在第一輪時將索引壓入棧
            if (i < n) {
                st.push(i);
            }
        }

        return result;
    }
};
```

**時間複雜度：** O(n)，雖然遍歷 2n 次，但每個元素最多入棧出棧一次
**空間複雜度：** O(n)

### 為什麼遍歷兩次？

```
nums = [1, 2, 1]

第一次遍歷 (i=0 to 2):
  找到前面元素的 NGE

第二次遍歷 (i=3 to 5):
  i=3: nums[3%3]=nums[0]=1, 為後面的元素提供循環的數據
  i=4: nums[4%3]=nums[1]=2
  i=5: nums[5%3]=nums[2]=1

模擬效果: [1, 2, 1, 1, 2, 1]
這樣最後一個 1 也能找到它的 NGE (2)
```

### 詳細過程

```
nums = [1, 2, 1]

第一輪遍歷:
i=0, num=1: Stack=[0]
i=1, num=2: 2>1, result[0]=2, Stack=[1]
i=2, num=1: 1<2, Stack=[1,2]

第二輪遍歷:
i=3, num=nums[0]=1: 1<2, Stack=[1,2]
i=4, num=nums[1]=2:
  2>1, result[2]=2
  2=2, 不彈出
  不壓入 (i>=n)
  Stack=[1]
i=5, num=nums[2]=1: 1<2, 不壓入, Stack=[1]

結果: [2, -1, 2]
```

---

## LeetCode 739: Daily Temperatures

**問題：** 給定一個整數陣列 `temperatures`，表示每天的溫度，返回一個陣列 `answer`，其中 `answer[i]` 是指在第 `i` 天之後，才會有更高的溫度。如果氣溫在這之後都不會升高，請在該位置用 `0` 來代替。

**示例：**
```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
Explanation:
  Day 0: 73 -> 下一個更高溫度在 Day 1 (74), 相差 1 天
  Day 1: 74 -> 下一個更高溫度在 Day 2 (75), 相差 1 天
  Day 2: 75 -> 下一個更高溫度在 Day 6 (76), 相差 4 天
  ...
```

### 解法：單調遞減棧

```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        stack<int> st;  // 存儲索引（單調遞減棧）

        for (int i = 0; i < n; i++) {
            // 當前溫度比棧頂高，找到了棧頂日期的答案
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int prevDay = st.top();
                st.pop();
                result[prevDay] = i - prevDay;  // 計算天數差
            }
            st.push(i);
        }

        return result;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

### 詳細過程

```
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]

i=0, T=73: Stack=[0]

i=1, T=74:
  74>73, result[0]=1-0=1
  Stack=[1]

i=2, T=75:
  75>74, result[1]=2-1=1
  Stack=[2]

i=3, T=71:
  71<75, Stack=[2,3]

i=4, T=69:
  69<71, Stack=[2,3,4]

i=5, T=72:
  72>69, result[4]=5-4=1
  72>71, result[3]=5-3=2
  72<75, Stack=[2,5]

i=6, T=76:
  76>72, result[5]=6-5=1
  76>75, result[2]=6-2=4
  Stack=[6]

i=7, T=73:
  73<76, Stack=[6,7]

最終: result=[1,1,4,2,1,1,0,0]
```

---

## LeetCode 901: Online Stock Span

**問題：** 設計一個算法，收集某些股票的每日報價，並返回該股票當日價格的跨度。當日股票價格的跨度被定義為股票價格小於或等於今天價格的最大連續日數（從今天開始往回數，包括今天）。

**示例：**
```
Input: ["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
       [[], [100], [80], [60], [70], [60], [75], [85]]
Output: [null, 1, 1, 1, 2, 1, 4, 6]

Explanation:
Day 0: 100, span=1 (只有自己)
Day 1: 80, span=1 (80<100)
Day 2: 60, span=1 (60<80)
Day 3: 70, span=2 (70>=60, 包括 day 2,3)
Day 4: 60, span=1 (60<70)
Day 5: 75, span=4 (75>=60,70,60,75, 包括 day 2,3,4,5)
Day 6: 85, span=6 (85>=所有之前的價格)
```

### 解法：單調遞減棧

```cpp
class StockSpanner {
private:
    stack<pair<int, int>> st;  // {price, span}

public:
    StockSpanner() {
    }

    int next(int price) {
        int span = 1;

        // 合併所有小於等於當前價格的跨度
        while (!st.empty() && st.top().first <= price) {
            span += st.top().second;
            st.pop();
        }

        st.push({price, span});
        return span;
    }
};

/**
 * Your StockSpanner object will be instantiated and called as such:
 * StockSpanner* obj = new StockSpanner();
 * int param_1 = obj->next(price);
 */
```

**時間複雜度：** 每次調用 `next` 的均攤時間複雜度是 O(1)
**空間複雜度：** O(n)

### 核心思想

```
維護單調遞減棧，棧中存儲 {price, span}

當遇到更大的價格時：
1. 彈出所有小於等於當前價格的元素
2. 累加它們的 span
3. 壓入新的 {price, span}

示例：
prices: [100, 80, 60, 70, 60, 75, 85]

price=100: Stack=[(100,1)], span=1
price=80:  Stack=[(100,1),(80,1)], span=1
price=60:  Stack=[(100,1),(80,1),(60,1)], span=1
price=70:  彈出(60,1), span=1+1=2
           Stack=[(100,1),(80,1),(70,2)]
price=60:  Stack=[(100,1),(80,1),(70,2),(60,1)], span=1
price=75:  彈出(60,1),(70,2), span=1+1+2=4
           Stack=[(100,1),(80,1),(75,4)]
price=85:  彈出(75,4),(80,1), span=1+4+1=6
           Stack=[(100,1),(85,6)]
```

---

## LeetCode 1019: Next Greater Node In Linked List

**問題：** 給定一個單鏈表，返回一個陣列，其中每個元素表示原鏈表中對應位置節點的下一個更大節點的值。

**示例：**
```
Input: [2,1,5]
Output: [5,5,0]

Input: [2,7,4,3,5]
Output: [7,0,5,5,0]
```

### 解法 1：轉換為陣列 + 單調棧

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    vector<int> nextLargerNodes(ListNode* head) {
        // Step 1: 將鏈表轉換為陣列
        vector<int> nums;
        ListNode* curr = head;
        while (curr) {
            nums.push_back(curr->val);
            curr = curr->next;
        }

        // Step 2: 使用單調遞減棧
        int n = nums.size();
        vector<int> result(n, 0);
        stack<int> st;  // 存儲索引

        for (int i = 0; i < n; i++) {
            while (!st.empty() && nums[i] > nums[st.top()]) {
                int idx = st.top();
                st.pop();
                result[idx] = nums[i];
            }
            st.push(i);
        }

        return result;
    }
};
```

**時間複雜度：** O(n)
**空間複雜度：** O(n)

### 解法 2：反向遍歷（需要先知道長度）

```cpp
class Solution {
public:
    vector<int> nextLargerNodes(ListNode* head) {
        // Step 1: 計算鏈表長度
        int n = 0;
        ListNode* curr = head;
        while (curr) {
            n++;
            curr = curr->next;
        }

        // Step 2: 從右到左處理（使用遞迴）
        vector<int> result(n, 0);
        stack<int> st;
        helper(head, 0, result, st);
        return result;
    }

private:
    void helper(ListNode* node, int idx, vector<int>& result, stack<int>& st) {
        if (node == nullptr) return;

        // 先處理後面的節點（相當於從右到左）
        helper(node->next, idx + 1, result, st);

        // 彈出所有小於等於當前值的元素
        while (!st.empty() && st.top() <= node->val) {
            st.pop();
        }

        // 棧頂就是下一個更大的元素
        result[idx] = st.empty() ? 0 : st.top();
        st.push(node->val);
    }
};
```

---

## 單調棧的變體

### 1. 找前一個更大元素

```cpp
vector<int> previousGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 單調遞減棧

    for (int i = 0; i < n; i++) {
        // 彈出所有小於等於當前元素的
        while (!st.empty() && nums[st.top()] <= nums[i]) {
            st.pop();
        }
        // 棧頂就是前一個更大的元素
        if (!st.empty()) {
            result[i] = nums[st.top()];
        }
        st.push(i);
    }

    return result;
}

// 示例: nums = [2, 1, 2, 4, 3]
// result = [-1, -1, -1, -1, 4]
```

### 2. 找下一個更小元素

```cpp
vector<int> nextSmallerElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 單調遞增棧

    for (int i = 0; i < n; i++) {
        // 當前元素比棧頂小，找到了棧頂的 NSE
        while (!st.empty() && nums[i] < nums[st.top()]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }

    return result;
}

// 示例: nums = [4, 2, 3, 1, 5]
// result = [2, 1, 1, -1, -1]
```

### 3. 找前一個更小元素

```cpp
vector<int> previousSmallerElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 單調遞增棧

    for (int i = 0; i < n; i++) {
        // 彈出所有大於等於當前元素的
        while (!st.empty() && nums[st.top()] >= nums[i]) {
            st.pop();
        }
        // 棧頂就是前一個更小的元素
        if (!st.empty()) {
            result[i] = nums[st.top()];
        }
        st.push(i);
    }

    return result;
}

// 示例: nums = [4, 2, 3, 1, 5]
// result = [-1, -1, 2, -1, 1]
```

---

## 單調棧模板總結

### 基本框架

```cpp
vector<int> monotonicStack(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // 存儲索引

    for (int i = 0; i < n; i++) {
        // 根據需求調整條件
        while (!st.empty() && CONDITION) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];  // 或其他操作
        }
        st.push(i);
    }

    return result;
}
```

### 四種常見類型

| 問題類型 | 棧的單調性 | 條件 | 應用 |
|---------|-----------|------|------|
| Next Greater | 遞減 | `nums[i] > nums[st.top()]` | 496, 503, 739 |
| Next Smaller | 遞增 | `nums[i] < nums[st.top()]` | 84, 85 |
| Prev Greater | 遞減 | `nums[st.top()] <= nums[i]` | 901 |
| Prev Smaller | 遞增 | `nums[st.top()] >= nums[i]` | 84, 85 |

---

## 總結

### 核心要點

1. **單調棧的本質**：
   - 維護一個單調性的棧（遞增或遞減）
   - 每個元素最多入棧一次、出棧一次
   - 總時間複雜度 O(n)

2. **適用場景**：
   - 找下一個/前一個更大/更小的元素
   - 計算跨度問題
   - 柱狀圖相關問題（下一章）

3. **選擇棧的單調性**：
   - 找更大元素 -> 單調遞減棧
   - 找更小元素 -> 單調遞增棧

4. **循環陣列處理**：
   - 遍歷兩次陣列，使用取模操作
   - 只在第一輪時將索引壓入棧

### 時間複雜度分析

雖然有嵌套的 while 循環，但：
- 每個元素最多入棧一次：n 次
- 每個元素最多出棧一次：n 次
- 總操作數：2n = O(n)

### 相關題目

- [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
- [503. Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/)
- [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
- [901. Online Stock Span](https://leetcode.com/problems/online-stock-span/)
- [1019. Next Greater Node In Linked List](https://leetcode.com/problems/next-greater-node-in-linked-list/)

在下一章中，我們將學習單調棧的進階應用：計算矩形面積。
