---
title: 06-4. LRU 與 LFU Cache 設計
order: 4
description: '使用 Stack、Queue、Deque 實現 LRU 與 LFU 緩存淘汰策略。深入理解雙向鏈表與哈希表結合的設計技巧，實現 O(1) 時間複雜度的高效緩存系統。'
tags: ['LRU', 'LFU', 'Cache', 'Design', 'Hash Map', 'Doubly Linked List', '緩存設計']
author: Rain Hu
date: '2025-10-15'
draft: false
subscription: member
---

# LRU 與 LFU Cache 設計

## 概述

Cache（緩存）是計算機系統中用於加速數據訪問的重要組件。當緩存空間有限時，需要**緩存淘汰策略**來決定刪除哪些數據。

**兩種常見策略：**
1. **LRU (Least Recently Used)**：淘汰最久未使用的數據
2. **LFU (Least Frequently Used)**：淘汰使用頻率最低的數據

這兩種設計都與 Stack、Queue、Deque 的思想緊密相關。

---

## LeetCode 146: LRU Cache

### 問題描述

設計一個 LRU 緩存，支持以下操作：
- `get(key)`：獲取 key 的 value，如果不存在返回 -1
- `put(key, value)`：插入或更新 key-value，當容量滿時刪除最久未使用的元素

**要求：** 兩個操作都必須在 **O(1)** 時間複雜度內完成。

**示例：**
```
LRUCache cache = new LRUCache(2);

cache.put(1, 1);    // cache: {1=1}
cache.put(2, 2);    // cache: {1=1, 2=2}
cache.get(1);       // 返回 1，cache: {2=2, 1=1}
cache.put(3, 3);    // 淘汰 key 2，cache: {1=1, 3=3}
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 淘汰 key 1，cache: {3=3, 4=4}
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回 3
cache.get(4);       // 返回 4
```

### 核心思想

**數據結構：**
1. **哈希表 (unordered_map)**：實現 O(1) 查找
2. **雙向鏈表 (doubly linked list)**：實現 O(1) 插入/刪除，並維護訪問順序

```
HashMap:                Doubly Linked List:
key -> node*       head <-> node1 <-> node2 <-> ... <-> tail
                   (最近使用)                    (最久未使用)
```

**操作邏輯：**
- **get(key)**：移動節點到鏈表頭部（標記為最近使用）
- **put(key, value)**：
  - 如果 key 已存在：更新 value，移到頭部
  - 如果 key 不存在：插入新節點到頭部，若超出容量則刪除尾部節點

### 實現

```cpp
class LRUCache {
private:
    struct Node {
        int key;
        int value;
        Node* prev;
        Node* next;
        Node(int k = 0, int v = 0) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };

    int capacity;
    unordered_map<int, Node*> cache;  // key -> node
    Node* head;  // dummy head (最近使用)
    Node* tail;  // dummy tail (最久未使用)

    // 添加節點到頭部（最近使用）
    void addToHead(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }

    // 移除節點
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    // 移動節點到頭部（標記為最近使用）
    void moveToHead(Node* node) {
        removeNode(node);
        addToHead(node);
    }

    // 移除尾部節點（最久未使用）
    Node* removeTail() {
        Node* node = tail->prev;
        removeNode(node);
        return node;
    }

public:
    LRUCache(int capacity) : capacity(capacity) {
        // 創建 dummy head 和 tail
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;  // key 不存在
        }

        Node* node = cache[key];
        moveToHead(node);  // 移到頭部（標記為最近使用）
        return node->value;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            // key 已存在，更新 value 並移到頭部
            Node* node = cache[key];
            node->value = value;
            moveToHead(node);
        } else {
            // 新增 key
            Node* node = new Node(key, value);
            cache[key] = node;
            addToHead(node);

            if (cache.size() > capacity) {
                // 超出容量，刪除最久未使用的節點（尾部）
                Node* removed = removeTail();
                cache.erase(removed->key);
                delete removed;
            }
        }
    }

    ~LRUCache() {
        // 清理內存
        Node* curr = head;
        while (curr) {
            Node* next = curr->next;
            delete curr;
            curr = next;
        }
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
```

**時間複雜度：** O(1) for both get and put
**空間複雜度：** O(capacity)

### 詳細過程示例

```
capacity = 2

Step 1: put(1, 1)
  head <-> (1,1) <-> tail
  cache: {1 -> node1}

Step 2: put(2, 2)
  head <-> (2,2) <-> (1,1) <-> tail
  cache: {1 -> node1, 2 -> node2}

Step 3: get(1) = 1
  移動 (1,1) 到頭部
  head <-> (1,1) <-> (2,2) <-> tail
  cache: {1 -> node1, 2 -> node2}

Step 4: put(3, 3)
  容量滿，刪除尾部 (2,2)
  添加 (3,3) 到頭部
  head <-> (3,3) <-> (1,1) <-> tail
  cache: {1 -> node1, 3 -> node3}

Step 5: get(2) = -1 (不存在)

Step 6: put(4, 4)
  容量滿，刪除尾部 (1,1)
  添加 (4,4) 到頭部
  head <-> (4,4) <-> (3,3) <-> tail
  cache: {3 -> node3, 4 -> node4}
```

### 為什麼需要 Dummy Head 和 Tail？

```cpp
// 沒有 dummy node 的插入操作
void addToHead(Node* node) {
    if (head == nullptr) {
        head = tail = node;  // 特殊處理空鏈表
    } else {
        node->next = head;
        head->prev = node;
        head = node;
    }
}

// 有 dummy node 的插入操作（更簡潔）
void addToHead(Node* node) {
    node->prev = head;
    node->next = head->next;
    head->next->prev = node;
    head->next = node;
}
```

**優勢：**
- 統一處理邊界情況
- 不需要判斷空鏈表
- 代碼更簡潔、可讀性更好

### 使用 STL list 的簡化版本

```cpp
class LRUCache {
private:
    int capacity;
    list<pair<int, int>> cache;  // list of (key, value)
    unordered_map<int, list<pair<int, int>>::iterator> map;  // key -> iterator

public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (map.find(key) == map.end()) {
            return -1;
        }

        // 移到前面（最近使用）
        auto it = map[key];
        int value = it->second;
        cache.erase(it);
        cache.push_front({key, value});
        map[key] = cache.begin();

        return value;
    }

    void put(int key, int value) {
        if (map.find(key) != map.end()) {
            // 更新已存在的 key
            cache.erase(map[key]);
        } else if (cache.size() >= capacity) {
            // 移除最久未使用的（尾部）
            int oldKey = cache.back().first;
            cache.pop_back();
            map.erase(oldKey);
        }

        // 添加到前面（最近使用）
        cache.push_front({key, value});
        map[key] = cache.begin();
    }
};
```

**優點：**
- 使用 STL，代碼更短
- 不需要手動管理內存

**缺點：**
- 性能略遜於手動實現（但差異很小）
- 面試時可能需要展示對鏈表的理解

---

## LeetCode 460: LFU Cache

### 問題描述

設計一個 LFU 緩存，支持以下操作：
- `get(key)`：獲取 key 的 value，如果不存在返回 -1
- `put(key, value)`：插入或更新 key-value，當容量滿時刪除使用頻率最低的元素

**淘汰策略：**
- 刪除**使用頻率最低**的元素
- 如果有多個頻率相同的，刪除**最久未使用**的（LRU）

**示例：**
```
LFUCache cache = new LFUCache(2);

cache.put(1, 1);   // cache: {1=1(freq:1)}
cache.put(2, 2);   // cache: {1=1(freq:1), 2=2(freq:1)}
cache.get(1);      // 返回 1，cache: {1=1(freq:2), 2=2(freq:1)}
cache.put(3, 3);   // 淘汰 key 2（頻率最低），cache: {1=1(freq:2), 3=3(freq:1)}
cache.get(2);      // 返回 -1 (未找到)
cache.get(3);      // 返回 3，cache: {1=1(freq:2), 3=3(freq:2)}
cache.put(4, 4);   // 淘汰 key 1（兩者頻率相同，1 更久未使用）
                   // cache: {3=3(freq:2), 4=4(freq:1)}
cache.get(1);      // 返回 -1 (未找到)
cache.get(3);      // 返回 3
cache.get(4);      // 返回 4
```

### 核心思想

**數據結構：**
1. `keyValue`: key -> (value, frequency)
2. `freqMap`: frequency -> list of keys（同頻率的 keys，按 LRU 順序）
3. `keyPos`: key -> iterator（在 freqMap 中的位置）
4. `minFreq`: 當前最小頻率

```
cache: key -> (value, freq)
freqMap:
  freq=1: [key3, key4]  (最近到最久)
  freq=2: [key1, key2]
minFreq = 1
```

### 實現

```cpp
class LFUCache {
private:
    int capacity;
    int minFreq;  // 當前最小頻率

    // key -> (value, frequency)
    unordered_map<int, pair<int, int>> keyValue;

    // key -> iterator in freqMap
    unordered_map<int, list<int>::iterator> keyPos;

    // frequency -> list of keys (LRU order)
    unordered_map<int, list<int>> freqMap;

    void updateFreq(int key) {
        int freq = keyValue[key].second;
        int value = keyValue[key].first;

        // 從舊頻率列表中移除
        freqMap[freq].erase(keyPos[key]);
        if (freqMap[freq].empty()) {
            freqMap.erase(freq);
            // 如果刪除的是最小頻率，更新 minFreq
            if (minFreq == freq) {
                minFreq++;
            }
        }

        // 添加到新頻率列表（頭部 = 最近使用）
        freq++;
        keyValue[key].second = freq;
        freqMap[freq].push_front(key);
        keyPos[key] = freqMap[freq].begin();
    }

public:
    LFUCache(int capacity) : capacity(capacity), minFreq(0) {}

    int get(int key) {
        if (capacity == 0 || keyValue.find(key) == keyValue.end()) {
            return -1;
        }

        updateFreq(key);
        return keyValue[key].first;
    }

    void put(int key, int value) {
        if (capacity == 0) return;

        if (keyValue.find(key) != keyValue.end()) {
            // 更新已存在的 key
            keyValue[key].first = value;
            updateFreq(key);
        } else {
            // 新增 key
            if (keyValue.size() >= capacity) {
                // 移除使用頻率最低且最久未使用的
                int oldKey = freqMap[minFreq].back();
                freqMap[minFreq].pop_back();
                keyValue.erase(oldKey);
                keyPos.erase(oldKey);
            }

            // 添加新 key（頻率為 1）
            keyValue[key] = {value, 1};
            freqMap[1].push_front(key);
            keyPos[key] = freqMap[1].begin();
            minFreq = 1;
        }
    }
};

/**
 * Your LFUCache object will be instantiated and called as such:
 * LFUCache* obj = new LFUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
```

**時間複雜度：** O(1) for both get and put
**空間複雜度：** O(capacity)

### 詳細過程示例

```
capacity = 2

Step 1: put(1, 1)
  keyValue: {1 -> (1, 1)}
  freqMap: {1 -> [1]}
  minFreq = 1

Step 2: put(2, 2)
  keyValue: {1 -> (1, 1), 2 -> (2, 1)}
  freqMap: {1 -> [2, 1]}
  minFreq = 1

Step 3: get(1) = 1
  更新 key=1 的頻率：1 -> 2
  keyValue: {1 -> (1, 2), 2 -> (2, 1)}
  freqMap: {1 -> [2], 2 -> [1]}
  minFreq = 1

Step 4: put(3, 3)
  容量滿，刪除 minFreq=1 的最久未使用的 key=2
  添加 key=3，頻率為 1
  keyValue: {1 -> (1, 2), 3 -> (3, 1)}
  freqMap: {1 -> [3], 2 -> [1]}
  minFreq = 1

Step 5: get(2) = -1 (不存在)

Step 6: get(3) = 3
  更新 key=3 的頻率：1 -> 2
  keyValue: {1 -> (1, 2), 3 -> (3, 2)}
  freqMap: {2 -> [3, 1]}
  minFreq = 2

Step 7: put(4, 4)
  容量滿，刪除 minFreq=2 的最久未使用的 key=1
  添加 key=4，頻率為 1
  keyValue: {3 -> (3, 2), 4 -> (4, 1)}
  freqMap: {1 -> [4], 2 -> [3]}
  minFreq = 1
```

### 為什麼需要三個 HashMap？

```cpp
keyValue:  快速訪問 value 和 frequency         O(1)
keyPos:    快速在 freqMap 中刪除節點           O(1)
freqMap:   維護每個頻率的 keys（LRU 順序）     O(1)
```

**如果只用兩個 HashMap：**
```cpp
// 沒有 keyPos
freqMap[freq].erase(key);  // O(n) 需要遍歷 list 找到 key
```

### 關鍵點

#### 1. 何時更新 minFreq？

```cpp
if (freqMap[freq].empty()) {
    freqMap.erase(freq);
    if (minFreq == freq) {
        minFreq++;  // 只在刪除最小頻率時更新
    }
}
```

**為什麼 minFreq 只需要 ++？**
- 當刪除 minFreq 的所有 keys 時，下一個頻率必然是 minFreq + 1
- 因為我們是逐步增加頻率的（每次 +1）

#### 2. 為什麼 put 新 key 時 minFreq = 1？

```cpp
minFreq = 1;  // 新 key 的頻率總是 1
```

---

## LRU vs LFU 比較

| 特性 | LRU | LFU |
|------|-----|-----|
| **淘汰策略** | 最久未使用 | 使用頻率最低 |
| **時間複雜度** | O(1) get/put | O(1) get/put |
| **空間複雜度** | O(capacity) | O(capacity) |
| **數據結構** | HashMap + Doubly Linked List | 3 個 HashMap + Lists |
| **實現難度** | 中等 | 較難 |
| **適用場景** | 時間局部性強（如頁面訪問） | 熱點數據（如熱門視頻） |
| **優點** | 實現簡單、符合直覺 | 考慮訪問頻率，更精確 |
| **缺點** | 不考慮訪問頻率 | 新數據容易被淘汰 |

### 應用場景

#### LRU 適用於：
- **網頁瀏覽器緩存**：最近訪問的頁面很可能再次訪問
- **操作系統頁面置換**：最近使用的頁面短期內再次使用概率高
- **數據庫查詢緩存**：最近查詢的數據通常會再次查詢

#### LFU 適用於：
- **內容分發網絡 (CDN)**：熱門內容需要長期保留
- **視頻網站**：熱門視頻被頻繁訪問
- **推薦系統**：熱點商品緩存

---

## 相關變體題目

### 1. LRU Cache with TTL (Time To Live)

```cpp
class LRUCacheWithTTL {
private:
    struct Node {
        int key;
        int value;
        time_t expireTime;
        Node* prev;
        Node* next;
        Node(int k = 0, int v = 0, time_t t = 0)
            : key(k), value(v), expireTime(t), prev(nullptr), next(nullptr) {}
    };

    int capacity;
    int ttl;  // time to live (秒)
    unordered_map<int, Node*> cache;
    Node* head;
    Node* tail;

    bool isExpired(Node* node) {
        return time(nullptr) > node->expireTime;
    }

public:
    LRUCacheWithTTL(int capacity, int ttl) : capacity(capacity), ttl(ttl) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;
        }

        Node* node = cache[key];

        // 檢查是否過期
        if (isExpired(node)) {
            removeNode(node);
            cache.erase(key);
            delete node;
            return -1;
        }

        moveToHead(node);
        return node->value;
    }

    void put(int key, int value) {
        time_t expireTime = time(nullptr) + ttl;

        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->value = value;
            node->expireTime = expireTime;
            moveToHead(node);
        } else {
            Node* node = new Node(key, value, expireTime);
            cache[key] = node;
            addToHead(node);

            if (cache.size() > capacity) {
                Node* removed = removeTail();
                cache.erase(removed->key);
                delete removed;
            }
        }
    }

    // ... (其他輔助函數與標準 LRU 相同)
};
```

### 2. LRU Cache with Priority

某些 key 有優先級，高優先級的 key 不會被淘汰：

```cpp
class PriorityLRUCache {
private:
    unordered_map<int, int> priority;  // key -> priority

    void put(int key, int value, int pri = 0) {
        priority[key] = pri;
        // ... 標準 LRU 邏輯

        // 淘汰時跳過高優先級的 key
        if (cache.size() > capacity) {
            Node* curr = tail->prev;
            while (curr != head && priority[curr->key] > 0) {
                curr = curr->prev;
            }
            if (curr != head) {
                removeNode(curr);
                cache.erase(curr->key);
                delete curr;
            }
        }
    }
};
```

---

## 總結

### 核心要點

#### LRU Cache
1. **數據結構**：HashMap + Doubly Linked List
2. **關鍵操作**：
   - get/put 都需要移動節點到頭部
   - 容量滿時刪除尾部節點
3. **Dummy Head/Tail**：簡化邊界處理
4. **時間複雜度**：O(1)

#### LFU Cache
1. **數據結構**：3 個 HashMap (keyValue, keyPos, freqMap) + minFreq
2. **關鍵操作**：
   - 更新頻率時需要在不同 list 間移動
   - 維護 minFreq 用於快速淘汰
3. **同頻率內使用 LRU**：list 的頭部是最近使用的
4. **時間複雜度**：O(1)

### 實現技巧

1. **使用 Dummy Node**：
   ```cpp
   head = new Node();
   tail = new Node();
   head->next = tail;
   tail->prev = head;
   ```

2. **Iterator 作為 HashMap Value**：
   ```cpp
   unordered_map<int, list<int>::iterator> map;
   ```

3. **統一的節點操作**：
   ```cpp
   addToHead(node);
   removeNode(node);
   moveToHead(node);
   ```

### 選擇建議

| 場景 | 推薦 |
|------|------|
| 實現簡單 | LRU |
| 需要考慮訪問頻率 | LFU |
| 時間局部性強 | LRU |
| 熱點數據明顯 | LFU |
| 新數據頻繁更新 | LRU |
| 長期熱門數據 | LFU |

### 相關題目

- [146. LRU Cache](https://leetcode.com/problems/lru-cache/)
- [460. LFU Cache](https://leetcode.com/problems/lfu-cache/)
- [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system/)

LRU 和 LFU 是系統設計中非常重要的緩存淘汰策略，理解它們的實現原理對於設計高效的緩存系統至關重要。
