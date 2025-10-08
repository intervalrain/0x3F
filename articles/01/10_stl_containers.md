---
title: 01-10. C++ STL 容器
order: 10
description: 'C++ STL 常用容器介紹：set, map, unordered_map, unordered_set 等'
tags:
  - STL
  - set
  - map
  - unordered_map
  - multiset
  - C++
author: Rain Hu
date: ''
draft: true
---

# C++ STL 容器

## 前言

**STL (Standard Template Library)** 提供了豐富的容器和演算法，是 C++ 程式設計的重要工具。

---

## 序列容器 (Sequence Containers)

### vector

動態陣列。

```cpp
#include <vector>
using namespace std;

vector<int> vec = {1, 2, 3};

// 基本操作
vec.push_back(4);      // [1, 2, 3, 4]
vec.pop_back();        // [1, 2, 3]
vec.insert(vec.begin(), 0);  // [0, 1, 2, 3]
vec.erase(vec.begin());      // [1, 2, 3]

// 存取
int x = vec[0];        // 1 (不檢查邊界)
int y = vec.at(1);     // 2 (檢查邊界)
int first = vec.front();  // 1
int last = vec.back();    // 3

// 其他
vec.clear();           // 清空
vec.resize(10);        // 調整大小
vec.reserve(100);      // 預留容量
```

| 操作 | 時間複雜度 |
|-----|----------|
| **push_back** | 攤銷 O(1) |
| **pop_back** | O(1) |
| **insert** | O(n) |
| **erase** | O(n) |
| **operator[]** | O(1) |

**應用**: 最常用的容器，適合大部分場景

---

### deque

雙端隊列。

```cpp
#include <deque>

deque<int> dq = {1, 2, 3};

dq.push_front(0);   // [0, 1, 2, 3]
dq.push_back(4);    // [0, 1, 2, 3, 4]
dq.pop_front();     // [1, 2, 3, 4]
dq.pop_back();      // [1, 2, 3]

int x = dq[1];      // 2
```

| 操作 | 時間複雜度 |
|-----|----------|
| **push_front/back** | O(1) |
| **pop_front/back** | O(1) |
| **operator[]** | O(1) |
| **insert** | O(n) |

**應用**: 需要雙端操作時使用

---

### list

雙向鏈表。

```cpp
#include <list>

list<int> lst = {1, 2, 3};

lst.push_front(0);
lst.push_back(4);
lst.insert(lst.begin(), 10);

// 遍歷
for (int x : lst) {
    cout << x << " ";
}

// 不支援隨機存取
// int x = lst[0];  // 錯誤！
```

| 操作 | 時間複雜度 |
|-----|----------|
| **push_front/back** | O(1) |
| **insert (已知位置)** | O(1) |
| **erase (已知位置)** | O(1) |
| **存取** | O(n) |

**應用**: 需要頻繁插入/刪除時使用

---

## 關聯容器 (Associative Containers)

### set

有序集合（紅黑樹實作）。

```cpp
#include <set>

set<int> s = {3, 1, 4, 1, 5};  // 自動排序且去重

// 插入
s.insert(2);

// 刪除
s.erase(1);

// 查找
if (s.count(3)) {  // 存在返回 1，不存在返回 0
    cout << "Found!" << endl;
}

auto it = s.find(4);
if (it != s.end()) {
    cout << "Found: " << *it << endl;
}

// 遍歷（有序）
for (int x : s) {
    cout << x << " ";  // 2 3 4 5
}

// 範圍查詢
auto lower = s.lower_bound(3);  // >= 3 的第一個元素
auto upper = s.upper_bound(3);  // > 3 的第一個元素
```

| 操作 | 時間複雜度 |
|-----|----------|
| **insert** | O(log n) |
| **erase** | O(log n) |
| **find** | O(log n) |
| **count** | O(log n) |

**特點**:
- 自動排序
- 不允許重複
- 底層：紅黑樹

**應用**: 需要有序且唯一的資料

---

### multiset

允許重複的有序集合。

```cpp
#include <set>

multiset<int> ms = {1, 2, 2, 3, 3, 3};

ms.insert(2);  // {1, 2, 2, 2, 3, 3, 3}

// count 返回元素個數
cout << ms.count(2) << endl;  // 3

// erase 刪除所有相同元素
ms.erase(2);  // {1, 3, 3, 3}

// 只刪除一個
auto it = ms.find(3);
if (it != ms.end()) {
    ms.erase(it);  // {1, 3, 3}
}
```

**應用**: 需要維護有序且允許重複的資料

---

### map

鍵值對（紅黑樹實作）。

```cpp
#include <map>

map<string, int> mp;

// 插入
mp["Alice"] = 90;
mp["Bob"] = 85;
mp.insert({"Carol", 95});

// 存取
int score = mp["Alice"];  // 90

// 如果 key 不存在，會自動創建並初始化為 0
int unknown = mp["Unknown"];  // 0

// 安全查找
if (mp.count("Alice")) {
    cout << mp["Alice"] << endl;
}

auto it = mp.find("Bob");
if (it != mp.end()) {
    cout << it->first << ": " << it->second << endl;
}

// 遍歷（按 key 排序）
for (auto& [name, score] : mp) {
    cout << name << ": " << score << endl;
}
// Alice: 90
// Bob: 85
// Carol: 95

// 刪除
mp.erase("Bob");
```

| 操作 | 時間複雜度 |
|-----|----------|
| **insert** | O(log n) |
| **erase** | O(log n) |
| **find** | O(log n) |
| **operator[]** | O(log n) |

**特點**:
- 按 key 排序
- key 唯一
- 底層：紅黑樹

**應用**: 需要有序的鍵值對

---

### multimap

允許重複 key 的 map。

```cpp
#include <map>

multimap<string, int> mm;

mm.insert({"Alice", 90});
mm.insert({"Alice", 85});  // 允許重複 key
mm.insert({"Bob", 95});

// 查找所有 Alice
auto range = mm.equal_range("Alice");
for (auto it = range.first; it != range.second; ++it) {
    cout << it->first << ": " << it->second << endl;
}
// Alice: 90
// Alice: 85

// 不支援 operator[]
// int x = mm["Alice"];  // 錯誤！
```

**應用**: 一個 key 對應多個 value

---

## 無序容器 (Unordered Containers)

### unordered_set

無序集合（哈希表實作）。

```cpp
#include <unordered_set>

unordered_set<int> us = {3, 1, 4, 1, 5};

// 插入
us.insert(2);

// 查找
if (us.count(3)) {
    cout << "Found!" << endl;
}

// 遍歷（無序）
for (int x : us) {
    cout << x << " ";  // 順序不確定
}

// 刪除
us.erase(1);
```

| 操作 | 平均時間 | 最壞時間 |
|-----|---------|---------|
| **insert** | O(1) | O(n) |
| **erase** | O(1) | O(n) |
| **find** | O(1) | O(n) |

**特點**:
- 無序
- 不允許重複
- 底層：哈希表

**vs set**:

| 特性 | set | unordered_set |
|-----|-----|---------------|
| **排序** | 有序 | 無序 |
| **底層** | 紅黑樹 | 哈希表 |
| **查找** | O(log n) | O(1) 平均 |
| **範圍查詢** | 支援 | 不支援 |

**應用**: 只需要查找，不需要排序

---

### unordered_multiset

允許重複的無序集合。

```cpp
#include <unordered_set>

unordered_multiset<int> ums = {1, 2, 2, 3, 3, 3};

ums.insert(2);  // {1, 2, 2, 2, 3, 3, 3}
cout << ums.count(2) << endl;  // 3
```

---

### unordered_map

無序鍵值對（哈希表實作）。

```cpp
#include <unordered_map>

unordered_map<string, int> um;

// 插入
um["Alice"] = 90;
um["Bob"] = 85;

// 查找
if (um.count("Alice")) {
    cout << um["Alice"] << endl;
}

// 遍歷（無序）
for (auto& [name, score] : um) {
    cout << name << ": " << score << endl;
}
```

| 操作 | 平均時間 | 最壞時間 |
|-----|---------|---------|
| **insert** | O(1) | O(n) |
| **erase** | O(1) | O(n) |
| **find** | O(1) | O(n) |
| **operator[]** | O(1) | O(n) |

**vs map**:

| 特性 | map | unordered_map |
|-----|-----|---------------|
| **排序** | 有序 | 無序 |
| **底層** | 紅黑樹 | 哈希表 |
| **查找** | O(log n) | O(1) 平均 |
| **範圍查詢** | 支援 | 不支援 |

**應用**: LeetCode 中最常用，快速查找

---

### unordered_multimap

允許重複 key 的無序 map。

```cpp
#include <unordered_map>

unordered_multimap<string, int> umm;

umm.insert({"Alice", 90});
umm.insert({"Alice", 85});

auto range = umm.equal_range("Alice");
for (auto it = range.first; it != range.second; ++it) {
    cout << it->first << ": " << it->second << endl;
}
```

---

## 容器適配器 (Container Adapters)

### stack

```cpp
#include <stack>

stack<int> st;

st.push(1);
st.push(2);
int top = st.top();  // 2
st.pop();
bool empty = st.empty();
```

**底層**: 預設使用 `deque`，也可用 `vector` 或 `list`

---

### queue

```cpp
#include <queue>

queue<int> q;

q.push(1);
q.push(2);
int front = q.front();  // 1
int back = q.back();    // 2
q.pop();
```

**底層**: 預設使用 `deque`

---

### priority_queue

```cpp
#include <queue>

// Max Heap
priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(4);
int top = pq.top();  // 4

// Min Heap
priority_queue<int, vector<int>, greater<int>> minPq;
minPq.push(3);
minPq.push(1);
int top = minPq.top();  // 1
```

**底層**: 使用 `vector` + heap 演算法

---

## 其他容器

### array (C++11)

固定大小陣列。

```cpp
#include <array>

array<int, 5> arr = {1, 2, 3, 4, 5};

int x = arr[0];
int size = arr.size();  // 5

// 支援範圍 for
for (int x : arr) {
    cout << x << " ";
}
```

**vs vector**:
- `array` 固定大小，編譯時確定
- `vector` 動態大小

---

### forward_list

單向鏈表。

```cpp
#include <forward_list>

forward_list<int> fl = {1, 2, 3};

fl.push_front(0);  // [0, 1, 2, 3]

// 不支援 push_back, size()
```

**應用**: 記憶體受限且只需單向遍歷

---

### bitset

位元集合。

```cpp
#include <bitset>

bitset<8> bs("10101010");

bs.set(0);       // 設置第 0 位為 1
bs.reset(1);     // 設置第 1 位為 0
bs.flip(2);      // 翻轉第 2 位

bool bit = bs[3];  // 查詢第 3 位
int count = bs.count();  // 1 的個數
```

**應用**: 狀態壓縮、位元運算

---

## 選擇容器的建議

### 流程圖

```
需要快速查找？
├─ Yes → 需要排序？
│        ├─ Yes → set / map
│        └─ No  → unordered_set / unordered_map
│
└─ No  → 需要雙端操作？
         ├─ Yes → deque
         └─ No  → 需要頻繁插入/刪除中間元素？
                  ├─ Yes → list
                  └─ No  → vector
```

### 對照表

| 需求 | 推薦容器 |
|-----|---------|
| **快速查找 + 有序** | `set` / `map` |
| **快速查找 + 無序** | `unordered_set` / `unordered_map` |
| **動態陣列** | `vector` |
| **雙端操作** | `deque` |
| **頻繁中間插入刪除** | `list` |
| **先進先出** | `queue` |
| **後進先出** | `stack` |
| **優先級** | `priority_queue` |

---

## LeetCode 中的應用

### unordered_map

```cpp
// Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}
```

### set

```cpp
// Contains Duplicate
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num)) {
            return true;
        }
        seen.insert(num);
    }
    return false;
}
```

### map

```cpp
// Top K Frequent Elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }

    priority_queue<pair<int, int>> pq;
    for (auto& [num, count] : freq) {
        pq.push({count, num});
    }

    vector<int> result;
    for (int i = 0; i < k; i++) {
        result.push_back(pq.top().second);
        pq.pop();
    }

    return result;
}
```

---

## LeetCode 練習題

- [Two Sum](https://leetcode.com/problems/two-sum/)
- [Group Anagrams](https://leetcode.com/problems/group-anagrams/)
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [LRU Cache](https://leetcode.com/problems/lru-cache/)
- [Design HashSet](https://leetcode.com/problems/design-hashset/)

---

## 重點總結

### 常用容器
- **vector**: 最常用，動態陣列
- **unordered_map**: LeetCode 最常用，O(1) 查找
- **set/map**: 需要排序時使用
- **priority_queue**: Top K 問題

### 時間複雜度對比

| 容器 | 查找 | 插入 | 刪除 | 排序 |
|-----|------|------|------|------|
| **vector** | O(n) | O(1) 尾部 | O(n) | 否 |
| **set** | O(log n) | O(log n) | O(log n) | 是 |
| **unordered_set** | O(1) | O(1) | O(1) | 否 |
| **map** | O(log n) | O(log n) | O(log n) | 是 |
| **unordered_map** | O(1) | O(1) | O(1) | 否 |

### 記憶技巧
- **unordered_** = 哈希表 = 快但無序
- **multi** = 允許重複
- 預設選 `vector` 和 `unordered_map`，除非有特殊需求
