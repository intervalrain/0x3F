---
title: 05-1. 基礎操作
order: 1
description: '深入介紹鏈表的基本操作，包含新增、刪除、反轉、合併等核心技巧。透過 LeetCode 經典題目學習雙指針、快慢指針、虛擬節點等實用技巧，掌握鏈表操作的時間與空間複雜度分析。'
tags: ['Linked List', 'Two Pointers', '鏈表', '雙指針', 'LeetCode']
author: Rain Hu
date: ''
draft: true
---

# Linked List 基礎操作

## 1. Reverse Linked List

### 1.1 迭代法

反轉鏈表的核心思想是改變每個節點的指向。

```
原始: 1 -> 2 -> 3 -> 4 -> NULL
反轉: NULL <- 1 <- 2 <- 3 <- 4
```

```cpp
// LeetCode 206. Reverse Linked List
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;

        while (curr != nullptr) {
            ListNode* next = curr->next;  // 保存下一個節點
            curr->next = prev;            // 反轉當前節點的指向
            prev = curr;                  // prev 移動到當前節點
            curr = next;                  // curr 移動到下一個節點
        }

        return prev;  // prev 現在指向新的頭節點
    }
};
```

**時間複雜度**: O(n)
**空間複雜度**: O(1)

### 1.2 遞迴法

```cpp
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Base case: 空鏈表或只有一個節點
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // 遞迴反轉後面的鏈表
        ListNode* newHead = reverseList(head->next);

        // 將當前節點的下一個節點指向當前節點
        head->next->next = head;
        head->next = nullptr;

        return newHead;
    }
};
```

**時間複雜度**: O(n)
**空間複雜度**: O(n) - 遞迴調用棧

### 1.3 反轉區間 [m, n]

```cpp
// LeetCode 92. Reverse Linked List II
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        if (left == right) return head;

        ListNode dummy(0);
        dummy.next = head;
        ListNode* pre = &dummy;

        // 移動到 left 的前一個節點
        for (int i = 1; i < left; i++) {
            pre = pre->next;
        }

        // 開始反轉
        ListNode* curr = pre->next;
        ListNode* next = nullptr;

        for (int i = 0; i < right - left; i++) {
            next = curr->next;
            curr->next = next->next;
            next->next = pre->next;
            pre->next = next;
        }

        return dummy.next;
    }
};
```

## 2. Node Deletion

### 2.1 刪除指定值的節點

```cpp
// LeetCode 203. Remove Linked List Elements
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        // 使用 dummy node 簡化邊界情況
        ListNode dummy(0);
        dummy.next = head;
        ListNode* curr = &dummy;

        while (curr->next != nullptr) {
            if (curr->next->val == val) {
                ListNode* temp = curr->next;
                curr->next = curr->next->next;
                delete temp;  // 釋放內存
            } else {
                curr = curr->next;
            }
        }

        return dummy.next;
    }
};
```

### 2.2 刪除倒數第 N 個節點

```cpp
// LeetCode 19. Remove Nth Node From End of List
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* fast = &dummy;
        ListNode* slow = &dummy;

        // fast 先走 n+1 步
        for (int i = 0; i <= n; i++) {
            fast = fast->next;
        }

        // fast 和 slow 一起走，直到 fast 到達末尾
        while (fast != nullptr) {
            fast = fast->next;
            slow = slow->next;
        }

        // 刪除 slow->next
        ListNode* temp = slow->next;
        slow->next = slow->next->next;
        delete temp;

        return dummy.next;
    }
};
```

### 2.3 刪除重複節點

```cpp
// LeetCode 83. Remove Duplicates from Sorted List
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        if (!head) return head;

        ListNode* curr = head;

        while (curr->next != nullptr) {
            if (curr->val == curr->next->val) {
                ListNode* temp = curr->next;
                curr->next = curr->next->next;
                delete temp;
            } else {
                curr = curr->next;
            }
        }

        return head;
    }
};

// LeetCode 82. Remove Duplicates from Sorted List II
// 刪除所有重複的節點
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* prev = &dummy;

        while (head != nullptr) {
            // 如果當前節點與下一個節點值相同
            if (head->next != nullptr && head->val == head->next->val) {
                // 跳過所有值相同的節點
                while (head->next != nullptr && head->val == head->next->val) {
                    head = head->next;
                }
                prev->next = head->next;
            } else {
                prev = prev->next;
            }
            head = head->next;
        }

        return dummy.next;
    }
};
```

## 3. Node Insertion

### 3.1 插入到排序鏈表

```cpp
// LeetCode 147. Insertion Sort List
class Solution {
public:
    ListNode* insertionSortList(ListNode* head) {
        ListNode dummy(0);
        ListNode* curr = head;

        while (curr != nullptr) {
            ListNode* prev = &dummy;
            ListNode* next = curr->next;

            // 找到插入位置
            while (prev->next != nullptr && prev->next->val < curr->val) {
                prev = prev->next;
            }

            // 插入節點
            curr->next = prev->next;
            prev->next = curr;
            curr = next;
        }

        return dummy.next;
    }
};
```

## 4. Cycle Detection (Floyd's Algorithm)

### 4.1 檢測環

Floyd's Cycle Detection Algorithm (龜兔賽跑算法)：
- 使用快慢指針
- 慢指針每次移動一步，快指針每次移動兩步
- 如果有環，快慢指針最終會相遇

```cpp
// LeetCode 141. Linked List Cycle
class Solution {
public:
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) return false;

        ListNode* slow = head;
        ListNode* fast = head;

        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;

            if (slow == fast) {
                return true;  // 有環
            }
        }

        return false;  // 無環
    }
};
```

### 4.2 找到環的起點

```cpp
// LeetCode 142. Linked List Cycle II
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;

        ListNode* slow = head;
        ListNode* fast = head;

        // 第一階段：檢測是否有環
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;

            if (slow == fast) {
                // 第二階段：找到環的起點
                slow = head;
                while (slow != fast) {
                    slow = slow->next;
                    fast = fast->next;
                }
                return slow;  // 環的起點
            }
        }

        return nullptr;  // 無環
    }
};
```

**原理**：
```
假設：
- 頭節點到環起點的距離為 a
- 環起點到相遇點的距離為 b
- 相遇點到環起點的距離為 c

相遇時：
- 慢指針走的距離：a + b
- 快指針走的距離：a + b + c + b = a + 2b + c

因為快指針速度是慢指針的兩倍：
2(a + b) = a + 2b + c
=> a = c

所以從頭節點和相遇點同時出發，會在環起點相遇。
```

## 5. Merge Linked Lists

### 5.1 合併兩個排序鏈表

```cpp
// LeetCode 21. Merge Two Sorted Lists
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;

        while (l1 != nullptr && l2 != nullptr) {
            if (l1->val <= l2->val) {
                curr->next = l1;
                l1 = l1->next;
            } else {
                curr->next = l2;
                l2 = l2->next;
            }
            curr = curr->next;
        }

        // 連接剩餘的節點
        curr->next = (l1 != nullptr) ? l1 : l2;

        return dummy.next;
    }
};
```

### 5.2 合併 K 個排序鏈表

```cpp
// LeetCode 23. Merge k Sorted Lists
class Solution {
public:
    // 方法1：使用最小堆
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) {
            return a->val > b->val;
        };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);

        // 將每個鏈表的頭節點加入堆
        for (auto head : lists) {
            if (head != nullptr) {
                pq.push(head);
            }
        }

        ListNode dummy(0);
        ListNode* curr = &dummy;

        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();

            curr->next = node;
            curr = curr->next;

            if (node->next != nullptr) {
                pq.push(node->next);
            }
        }

        return dummy.next;
    }

    // 方法2：分治法
    ListNode* mergeKLists2(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        return merge(lists, 0, lists.size() - 1);
    }

private:
    ListNode* merge(vector<ListNode*>& lists, int left, int right) {
        if (left == right) return lists[left];
        if (left > right) return nullptr;

        int mid = left + (right - left) / 2;
        ListNode* l1 = merge(lists, left, mid);
        ListNode* l2 = merge(lists, mid + 1, right);

        return mergeTwoLists(l1, l2);
    }

    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if (!l1) return l2;
        if (!l2) return l1;

        if (l1->val < l2->val) {
            l1->next = mergeTwoLists(l1->next, l2);
            return l1;
        } else {
            l2->next = mergeTwoLists(l1, l2->next);
            return l2;
        }
    }
};
```

## 6. 其他經典問題

### 6.1 回文鏈表

```cpp
// LeetCode 234. Palindrome Linked List
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        if (!head || !head->next) return true;

        // 1. 找到中點
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // 2. 反轉後半部分
        ListNode* secondHalf = reverseList(slow->next);

        // 3. 比較前半部分和後半部分
        ListNode* p1 = head;
        ListNode* p2 = secondHalf;
        bool result = true;

        while (result && p2 != nullptr) {
            if (p1->val != p2->val) {
                result = false;
            }
            p1 = p1->next;
            p2 = p2->next;
        }

        // 4. 恢復鏈表（可選）
        slow->next = reverseList(secondHalf);

        return result;
    }

private:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
};
```

### 6.2 相交鏈表

```cpp
// LeetCode 160. Intersection of Two Linked Lists
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (!headA || !headB) return nullptr;

        ListNode* pA = headA;
        ListNode* pB = headB;

        // 當 pA 和 pB 相遇時，就是交點
        // 如果沒有交點，最終都會指向 nullptr
        while (pA != pB) {
            pA = (pA == nullptr) ? headB : pA->next;
            pB = (pB == nullptr) ? headA : pB->next;
        }

        return pA;
    }
};
```

## 總結

Linked List 的基礎操作包括：
1. **反轉**：迭代法（三指針）和遞迴法
2. **刪除**：使用 dummy node 簡化邊界情況
3. **插入**：找到正確位置後調整指針
4. **環檢測**：Floyd's Algorithm（快慢指針）
5. **合併**：使用堆或分治法

**關鍵技巧**：
- 使用 dummy node 處理頭節點的特殊情況
- 快慢指針技巧（找中點、檢測環）
- 注意內存釋放（C++ 中使用 delete）
- 畫圖理解指針的移動過程
