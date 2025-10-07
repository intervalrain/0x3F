---
title: "同向雙指針"
order: 4
description: "快慢指針技巧與經典題目"
tags: ["Two Pointers", "Same Direction", "同向指針", "快慢指針"]
---

# 同向雙指針 (Same Direction Two Pointers)

## 核心概念

**同向雙指針**（又稱**快慢指針**）是指兩個指針從**同一端**出發，**同向移動**，但移動速度或條件不同。

### 特點

- 兩個指針：`slow` 和 `fast`
- **同向移動**：都向右（或都向左）
- 移動速度：fast 通常比 slow 快
- 時間複雜度：O(n)
- 適合**原地修改**、**鏈表**問題

---

## 通用模板

### 模板 1：原地修改陣列

```cpp
// 同向雙指針模板（陣列）
int slow = 0;
for (int fast = 0; fast < n; fast++) {
    if (arr[fast] 滿足條件) {
        arr[slow] = arr[fast];
        slow++;
    }
}
// 返回 slow（新陣列長度）
```

### 模板 2：鏈表問題

```cpp
// 同向雙指針模板（鏈表）
ListNode* slow = head;
ListNode* fast = head;

while (fast && fast->next) {
    slow = slow->next;       // 慢指針走一步
    fast = fast->next->next; // 快指針走兩步
}
// slow 指向中點或檢測環
```

---

## 常見場景

### 場景 1：原地移除元素

**問題特徵**：移除陣列中的某些元素，要求 O(1) 空間。

**策略**：
- `slow` 指向下一個要填入的位置
- `fast` 遍歷陣列
- 當 `fast` 指向的元素滿足條件時，複製到 `slow` 位置

#### 範例 1：Remove Element

**問題**：[LeetCode 27](https://leetcode.com/problems/remove-element/)

原地移除陣列中所有等於 val 的元素，返回新長度。

```cpp
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int slow = 0;

        for (int fast = 0; fast < nums.size(); fast++) {
            // 保留不等於 val 的元素
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
        }

        return slow;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**圖解**：
```
nums = [3, 2, 2, 3], val = 3

fast=0: nums[0]=3 (跳過)         [3, 2, 2, 3], slow=0
fast=1: nums[1]=2 (保留)         [2, 2, 2, 3], slow=1
fast=2: nums[2]=2 (保留)         [2, 2, 2, 3], slow=2
fast=3: nums[3]=3 (跳過)         [2, 2, 2, 3], slow=2

結果: [2, 2, ...], 長度 2
```

#### 範例 2：Remove Duplicates from Sorted Array

**問題**：[LeetCode 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

移除有序陣列中的重複元素，每個元素只出現一次。

```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if (nums.empty()) return 0;

        int slow = 0;

        for (int fast = 1; fast < nums.size(); fast++) {
            // 遇到不同的元素
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }

        return slow + 1;  // 長度 = 索引 + 1
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**圖解**：
```
nums = [1, 1, 2, 2, 3]

slow=0, fast=1: 1==1 (跳過)      [1, 1, 2, 2, 3]
slow=0, fast=2: 2!=1             [1, 2, 2, 2, 3], slow=1
slow=1, fast=3: 2==2 (跳過)      [1, 2, 2, 2, 3]
slow=1, fast=4: 3!=2             [1, 2, 3, 2, 3], slow=2

結果: [1, 2, 3, ...], 長度 3
```

#### 範例 3：Move Zeroes

**問題**：[LeetCode 283](https://leetcode.com/problems/move-zeroes/)

將所有 0 移到陣列末尾，保持非零元素相對順序。

```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int slow = 0;

        // 將非零元素移到前面
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != 0) {
                nums[slow] = nums[fast];
                slow++;
            }
        }

        // 填充剩餘位置為 0
        while (slow < nums.size()) {
            nums[slow] = 0;
            slow++;
        }
    }
};
```

**優化版本**（減少寫入）：
```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int slow = 0;

        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != 0) {
                // 只在需要時交換
                if (slow != fast) {
                    swap(nums[slow], nums[fast]);
                }
                slow++;
            }
        }
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

---

### 場景 2：鏈表中點

**問題特徵**：找鏈表的中點。

**策略**：
- `slow` 走一步
- `fast` 走兩步
- 當 `fast` 到達終點，`slow` 在中點

#### 範例：Middle of the Linked List

**問題**：[LeetCode 876](https://leetcode.com/problems/middle-of-the-linked-list/)

返回鏈表的中間節點，若有兩個中點，返回第二個。

```cpp
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;

        while (fast && fast->next) {
            slow = slow->next;       // 慢指針走一步
            fast = fast->next->next; // 快指針走兩步
        }

        return slow;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**圖解**：
```
奇數長度: 1 → 2 → 3 → 4 → 5
slow:     1     2     3
fast:     1         3         5 (結束)
返回 3

偶數長度: 1 → 2 → 3 → 4
slow:     1     2     3
fast:     1         3     null (結束)
返回 3（第二個中點）
```

**變體：返回第一個中點**
```cpp
while (fast->next && fast->next->next) {
    slow = slow->next;
    fast = fast->next->next;
}
```

---

### 場景 3：檢測鏈表環

**問題特徵**：檢測鏈表是否有環，或找環的入口。

**策略**：
- 快慢指針同時出發
- 若有環，兩者會相遇
- 若無環，fast 會到達終點

#### 範例 1：Linked List Cycle

**問題**：[LeetCode 141](https://leetcode.com/problems/linked-list-cycle/)

檢測鏈表是否有環。

```cpp
class Solution {
public:
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) return false;

        ListNode* slow = head;
        ListNode* fast = head;

        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;

            // 相遇表示有環
            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**為什麼一定會相遇？**
- 若有環，fast 會先進入環
- 在環內，fast 每次比 slow 多走一步
- 相對速度為 1，一定會追上

#### 範例 2：Linked List Cycle II

**問題**：[LeetCode 142](https://leetcode.com/problems/linked-list-cycle-ii/)

找出環的入口節點。

```cpp
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;

        ListNode* slow = head;
        ListNode* fast = head;

        // 階段 1：檢測是否有環
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;

            if (slow == fast) {
                // 階段 2：找環的入口
                ListNode* ptr = head;
                while (ptr != slow) {
                    ptr = ptr->next;
                    slow = slow->next;
                }
                return ptr;
            }
        }

        return nullptr;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**數學證明**：

```
設：
  a = 起點到環入口的距離
  b = 環入口到相遇點的距離
  c = 相遇點到環入口的距離（沿環方向）

相遇時：
  slow 走的距離 = a + b
  fast 走的距離 = a + b + n(b + c)  // n 為 fast 繞環的圈數

因為 fast 速度是 slow 的兩倍：
  2(a + b) = a + b + n(b + c)
  a + b = n(b + c)
  a = n(b + c) - b
  a = (n-1)(b + c) + c

結論：
  從起點走 a 步 = 從相遇點走 (n-1) 圈 + c 步
  兩者會在環入口相遇
```

---

### 場景 4：刪除鏈表節點

**問題特徵**：刪除倒數第 n 個節點。

**策略**：
- fast 先走 n 步
- slow 和 fast 同時走
- 當 fast 到達終點，slow 在倒數第 n 個節點

#### 範例：Remove Nth Node From End of List

**問題**：[LeetCode 19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

刪除鏈表倒數第 n 個節點。

```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode(0);
        dummy->next = head;

        ListNode* slow = dummy;
        ListNode* fast = dummy;

        // fast 先走 n+1 步
        for (int i = 0; i <= n; i++) {
            fast = fast->next;
        }

        // slow 和 fast 同時走
        while (fast) {
            slow = slow->next;
            fast = fast->next;
        }

        // 刪除 slow->next
        ListNode* toDelete = slow->next;
        slow->next = slow->next->next;
        delete toDelete;

        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**為什麼 fast 走 n+1 步？**
```
1 → 2 → 3 → 4 → 5, n = 2（刪除倒數第 2 個，即 4）

fast 走 n+1=3 步: dummy → 1 → 2 → 3
slow:             dummy

同時走:
fast:             3 → 4 → 5 → null
slow:             dummy → 1 → 2 → 3

slow->next = 4（要刪除的節點）
```

---

### 場景 5：陣列分區

**問題特徵**：根據條件將陣列分為兩部分。

#### 範例：Partition Array

**問題**：將陣列分為兩部分，左邊 < pivot，右邊 >= pivot。

```cpp
int partition(vector<int>& arr, int pivot) {
    int slow = 0;

    for (int fast = 0; fast < arr.size(); fast++) {
        if (arr[fast] < pivot) {
            swap(arr[slow], arr[fast]);
            slow++;
        }
    }

    return slow;  // 分界點
}
```

**應用**：
- Quick Sort 的分區邏輯
- Kth Largest Element

---

## 快慢指針速度比較

| 問題 | slow 速度 | fast 速度 | 目的 |
|-----|----------|----------|------|
| 鏈表中點 | 1 步 | 2 步 | 找中點 |
| 檢測環 | 1 步 | 2 步 | 相遇檢測 |
| 原地修改 | 條件移動 | 每次移動 | 過濾元素 |
| 刪除倒數第 n 個 | 同速 | 先走 n 步 | 保持距離 |

---

## 經典題目

### Easy
- [LeetCode 26 - Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- [LeetCode 27 - Remove Element](https://leetcode.com/problems/remove-element/)
- [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
- [LeetCode 283 - Move Zeroes](https://leetcode.com/problems/move-zeroes/)
- [LeetCode 876 - Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

### Medium
- [LeetCode 19 - Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- [LeetCode 80 - Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)
- [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)
- [LeetCode 143 - Reorder List](https://leetcode.com/problems/reorder-list/)
- [LeetCode 234 - Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)
- [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)
- [LeetCode 457 - Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)

---

## 常見陷阱

### 1. 鏈表空指針檢查

```cpp
// ✗ 錯誤：未檢查 fast->next
while (fast) {
    slow = slow->next;
    fast = fast->next->next;  // fast->next 可能為 null
}

// ✓ 正確：檢查 fast 和 fast->next
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}
```

### 2. 陣列索引越界

```cpp
// ✗ 錯誤：slow 可能與 fast 相同
if (nums[fast] != nums[slow]) {
    slow++;
    nums[slow] = nums[fast];  // 可能自己賦值給自己
}

// ✓ 正確：先移動 slow
if (nums[fast] != nums[slow]) {
    slow++;
    nums[slow] = nums[fast];
}
```

### 3. 返回值錯誤

```cpp
// Remove Duplicates

// ✗ 錯誤：返回 slow（索引）
return slow;

// ✓ 正確：返回 slow + 1（長度）
return slow + 1;
```

### 4. Dummy 節點未刪除

```cpp
// ✗ 錯誤：忘記刪除 dummy
ListNode* dummy = new ListNode(0);
// ...
return dummy->next;  // 內存洩漏

// ✓ 正確：釋放 dummy
ListNode* result = dummy->next;
delete dummy;
return result;
```

---

## 進階技巧

### 1. 三指針技巧

某些問題需要三個指針。

```cpp
// Palindrome Linked List
// 1. 找中點（快慢指針）
// 2. 反轉後半部（三指針）
// 3. 比較兩半（雙指針）
```

### 2. 快指針速度可變

```cpp
// 有些問題 fast 走 3 步、4 步等
while (fast && fast->next && fast->next->next) {
    slow = slow->next;
    fast = fast->next->next->next;  // 走 3 步
}
```

### 3. 原地操作優化

```cpp
// Move Zeroes 優化版
// 只在必要時交換，減少寫入次數
if (slow != fast) {
    swap(nums[slow], nums[fast]);
}
```

---

## 同向雙指針 vs 滑動視窗

| 特性 | 同向雙指針 | 滑動視窗 |
|-----|----------|---------|
| **slow 移動** | 條件移動 | 收縮窗口 |
| **fast 移動** | 每次移動 | 擴展窗口 |
| **窗口概念** | 不明顯 | 明確的窗口 |
| **典型** | 原地修改、鏈表 | 子陣列、子字串 |

**關係**：滑動視窗是同向雙指針的特殊應用。

---

## 複雜度總結

| 問題類型 | 時間複雜度 | 空間複雜度 |
|---------|-----------|-----------|
| 原地移除 | O(n) | O(1) |
| 鏈表中點 | O(n) | O(1) |
| 檢測環 | O(n) | O(1) |
| 刪除節點 | O(n) | O(1) |

---

## 重點回顧

1. **同向雙指針** = 兩個指針同向移動，速度不同
2. **兩種主要應用**：
   - **陣列**：原地修改、過濾元素（slow 條件移動，fast 遍歷）
   - **鏈表**：找中點、檢測環（slow 走 1 步，fast 走 2 步）
3. **核心優勢**：
   - O(1) 空間複雜度
   - 一次遍歷 O(n)
   - 原地操作
4. **常見錯誤**：
   - 空指針檢查
   - 索引越界
   - 返回值錯誤
   - 內存洩漏

### 總結

03 章節的四種技巧：
1. **定長滑動視窗**：固定窗口大小
2. **不定長滑動視窗**：動態調整窗口
3. **雙向雙指針**：從兩端相向移動
4. **同向雙指針**：同向移動，速度不同

這些技巧都能將 O(n²) 優化到 O(n)，是處理陣列和鏈表問題的核心工具。