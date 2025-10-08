---
title: 05-2. LRU/LFU Cache
order: 2
description: '完整解析 LRU 與 LFU 緩存淘汰策略的實作方法。使用雙向鏈表與哈希表實現 O(1) 時間複雜度的緩存操作，深入理解 get、put 操作的設計原理與優化技巧。'
tags: ['LRU', 'LFU', 'Cache', 'Hash Map', 'Doubly Linked List', '緩存', '哈希表']
author: Rain Hu
date: ''
draft: true
---

# LRU/LFU Cache

## 1. LRU Cache (Least Recently Used)

### 1.1 原理

LRU Cache 淘汰最久未使用的數據。需要支持：
- O(1) 時間獲取數據
- O(1) 時間插入/更新數據
- 當容量滿時，刪除最久未使用的數據

**數據結構**：
- HashMap：存儲 key 到節點的映射
- Doubly Linked List：維護使用順序（最近使用的在頭部，最久未使用的在尾部）

```
HashMap:        Doubly Linked List:
key -> node     head <-> node1 <-> node2 <-> ... <-> tail
               (最近)                            (最久)
```

### 1.2 實現

```cpp
// LeetCode 146. LRU Cache
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
    Node* head;  // dummy head
    Node* tail;  // dummy tail

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

    // 移動節點到頭部
    void moveToHead(Node* node) {
        removeNode(node);
        addToHead(node);
    }

    // 移除尾部節點
    Node* removeTail() {
        Node* node = tail->prev;
        removeNode(node);
        return node;
    }

public:
    LRUCache(int capacity) : capacity(capacity) {
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
        moveToHead(node);  // 更新為最近使用
        return node->value;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            // key 已存在，更新值並移到頭部
            Node* node = cache[key];
            node->value = value;
            moveToHead(node);
        } else {
            // 新增 key
            Node* node = new Node(key, value);
            cache[key] = node;
            addToHead(node);

            if (cache.size() > capacity) {
                // 超過容量，移除最久未使用的節點
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
 * 使用示例：
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
```

### 1.3 操作示例

```cpp
LRUCache cache(2);  // 容量為 2

cache.put(1, 1);  // cache: {1=1}
cache.put(2, 2);  // cache: {1=1, 2=2}
cache.get(1);     // 返回 1，cache: {2=2, 1=1}
cache.put(3, 3);  // 淘汰 key 2，cache: {1=1, 3=3}
cache.get(2);     // 返回 -1 (未找到)
cache.put(4, 4);  // 淘汰 key 1，cache: {3=3, 4=4}
cache.get(1);     // 返回 -1 (未找到)
cache.get(3);     // 返回 3
cache.get(4);     // 返回 4
```

### 1.4 簡化版本（使用 list）

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
            // 移除最久未使用的
            int oldKey = cache.back().first;
            cache.pop_back();
            map.erase(oldKey);
        }

        // 添加到前面
        cache.push_front({key, value});
        map[key] = cache.begin();
    }
};
```

## 2. LFU Cache (Least Frequently Used)

### 2.1 原理

LFU Cache 淘汰使用頻率最低的數據。如果有多個頻率相同的，淘汰最久未使用的。

**數據結構**：
- HashMap：key -> (value, frequency)
- HashMap：frequency -> list of keys（同頻率的 keys）
- 維護最小頻率 minFreq

```
cache: key -> (value, freq)
freqMap: freq -> [key1, key2, ...]
minFreq: 當前最小頻率
```

### 2.2 實現

```cpp
// LeetCode 460. LFU Cache
class LFUCache {
private:
    int capacity;
    int minFreq;

    // key -> (value, frequency)
    unordered_map<int, pair<int, int>> keyValue;

    // key -> iterator in freqMap
    unordered_map<int, list<int>::iterator> keyPos;

    // frequency -> list of keys
    unordered_map<int, list<int>> freqMap;

    void updateFreq(int key) {
        int freq = keyValue[key].second;
        int value = keyValue[key].first;

        // 從舊頻率列表中移除
        freqMap[freq].erase(keyPos[key]);
        if (freqMap[freq].empty()) {
            freqMap.erase(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }

        // 添加到新頻率列表
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

            // 添加新 key
            keyValue[key] = {value, 1};
            freqMap[1].push_front(key);
            keyPos[key] = freqMap[1].begin();
            minFreq = 1;
        }
    }
};

/**
 * 使用示例：
 * LFUCache* obj = new LFUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
```

### 2.3 操作示例

```cpp
LFUCache cache(2);  // 容量為 2

cache.put(1, 1);   // cache: {1=1(freq:1)}
cache.put(2, 2);   // cache: {1=1(freq:1), 2=2(freq:1)}
cache.get(1);      // 返回 1，cache: {1=1(freq:2), 2=2(freq:1)}
cache.put(3, 3);   // 淘汰 key 2（頻率最低），cache: {1=1(freq:2), 3=3(freq:1)}
cache.get(2);      // 返回 -1 (未找到)
cache.get(3);      // 返回 3，cache: {1=1(freq:2), 3=3(freq:2)}
cache.put(4, 4);   // 淘汰 key 1（兩者頻率相同，但1更久未使用）
                   // cache: {3=3(freq:2), 4=4(freq:1)}
cache.get(1);      // 返回 -1 (未找到)
cache.get(3);      // 返回 3
cache.get(4);      // 返回 4
```

## 3. LRU vs LFU 比較

| 特性 | LRU | LFU |
|------|-----|-----|
| 淘汰策略 | 最久未使用 | 使用頻率最低 |
| 時間複雜度 | O(1) get/put | O(1) get/put |
| 空間複雜度 | O(capacity) | O(capacity) |
| 數據結構 | HashMap + Doubly Linked List | 多個 HashMap + Lists |
| 實現複雜度 | 中等 | 較複雜 |
| 適用場景 | 時間局部性強 | 熱點數據訪問 |

## 4. 變體問題

### 4.1 LRU Cache with Expiration Time

```cpp
class LRUCacheWithExpiration {
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

    void addToHead(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }

    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void moveToHead(Node* node) {
        removeNode(node);
        addToHead(node);
    }

    Node* removeTail() {
        Node* node = tail->prev;
        removeNode(node);
        return node;
    }

    bool isExpired(Node* node) {
        return time(nullptr) > node->expireTime;
    }

public:
    LRUCacheWithExpiration(int capacity, int ttl) : capacity(capacity), ttl(ttl) {
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
};
```

### 4.2 Thread-Safe LRU Cache

```cpp
class ThreadSafeLRUCache {
private:
    // ... (相同的 Node 定義和基本結構)
    mutable mutex mtx;  // 互斥鎖

public:
    int get(int key) {
        lock_guard<mutex> lock(mtx);
        // ... (LRU get 實現)
    }

    void put(int key, int value) {
        lock_guard<mutex> lock(mtx);
        // ... (LRU put 實現)
    }
};
```

## 5. 實際應用

### 5.1 數據庫查詢緩存

```cpp
class DatabaseCache {
private:
    LRUCache cache;
    Database* db;

public:
    DatabaseCache(int capacity, Database* database)
        : cache(capacity), db(database) {}

    string query(const string& sql) {
        int key = hash<string>{}(sql);
        int cachedResult = cache.get(key);

        if (cachedResult != -1) {
            // 緩存命中
            return decodeResult(cachedResult);
        }

        // 緩存未命中，查詢數據庫
        string result = db->execute(sql);
        cache.put(key, encodeResult(result));
        return result;
    }

private:
    int encodeResult(const string& result) {
        // 將結果編碼為整數
        return 0;  // 簡化示例
    }

    string decodeResult(int encoded) {
        // 將整數解碼為結果
        return "";  // 簡化示例
    }
};
```

### 5.2 HTTP 緩存

```cpp
class HTTPCache {
private:
    LRUCache cache;

public:
    HTTPCache(int capacity) : cache(capacity) {}

    string getPage(const string& url) {
        int key = hash<string>{}(url);
        int cachedPage = cache.get(key);

        if (cachedPage != -1) {
            cout << "Cache hit: " << url << endl;
            return decodePage(cachedPage);
        }

        cout << "Cache miss: " << url << endl;
        string page = fetchFromNetwork(url);
        cache.put(key, encodePage(page));
        return page;
    }

private:
    string fetchFromNetwork(const string& url) {
        // 從網絡獲取頁面
        return "<html>...</html>";
    }

    int encodePage(const string& page) { return 0; }
    string decodePage(int encoded) { return ""; }
};
```

## 總結

### LRU Cache 關鍵點：
1. HashMap + Doubly Linked List
2. 使用 dummy head/tail 簡化邊界處理
3. get/put 都是 O(1) 操作
4. 最近使用的在頭部，最久未使用的在尾部

### LFU Cache 關鍵點：
1. 維護頻率映射和位置映射
2. 追蹤最小頻率 minFreq
3. 同頻率內使用 LRU 策略
4. 實現比 LRU 更複雜

### 選擇建議：
- **時間局部性強**：選擇 LRU（如頁面訪問、最近文檔）
- **熱點數據明顯**：選擇 LFU（如熱門商品、視頻）
- **需要簡單實現**：選擇 LRU
- **需要精確頻率統計**：選擇 LFU
