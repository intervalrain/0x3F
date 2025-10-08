---
title: 05-3. Skip List
order: 3
description: '探索跳躍串列的設計原理與實作細節。理解多層索引結構如何實現 O(log n) 的搜尋、插入、刪除操作，以及隨機化層數的機率分析與實際應用場景。'
tags: ['Skip List', 'Data Structure', '跳躍串列', '資料結構', 'Probabilistic']
author: Rain Hu
date: ''
draft: true
---

# Skip List (跳表)

## 1. 基本概念

Skip List 是一種隨機化的數據結構，可以在 O(log n) 時間內完成查找、插入和刪除操作。它是平衡樹的一種替代方案，實現更簡單但性能相當。

### 1.1 為什麼需要 Skip List？

**有序鏈表的問題**：
```
1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8
```
查找元素需要 O(n) 時間。

**Skip List 的解決方案**：
通過建立多層索引，實現類似二分查找的效果。

```
Level 3:  1 -----------------> 8
Level 2:  1 ------> 4 ------> 8
Level 1:  1 -> 2 -> 4 -> 6 -> 8
Level 0:  1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8
```

### 1.2 核心思想

1. **多層鏈表**：最底層包含所有元素，上層是下層的子集
2. **隨機層數**：新節點的層數由隨機數決定（通常 p=0.5）
3. **快速查找**：從最高層開始，逐層向下查找

## 2. 實現

### 2.1 基本結構

```cpp
class Skiplist {
private:
    static const int MAX_LEVEL = 32;  // 最大層數
    static constexpr double P = 0.5;   // 晉升概率

    struct Node {
        int val;
        vector<Node*> next;  // next[i] 指向第 i 層的下一個節點

        Node(int v, int level) : val(v), next(level + 1, nullptr) {}
    };

    Node* head;  // 頭節點
    int level;   // 當前最大層數

    // 生成隨機層數
    int randomLevel() {
        int lvl = 0;
        while (lvl < MAX_LEVEL && (rand() / double(RAND_MAX)) < P) {
            lvl++;
        }
        return lvl;
    }

public:
    Skiplist() {
        head = new Node(-1, MAX_LEVEL);
        level = 0;
    }

    // 查找
    bool search(int target) {
        Node* curr = head;

        // 從最高層開始查找
        for (int i = level; i >= 0; i--) {
            // 在當前層向右移動，直到下一個節點大於等於 target
            while (curr->next[i] && curr->next[i]->val < target) {
                curr = curr->next[i];
            }
        }

        // 移動到最底層的下一個節點
        curr = curr->next[0];
        return curr && curr->val == target;
    }

    // 插入
    void add(int num) {
        vector<Node*> update(MAX_LEVEL + 1);  // 記錄每層需要更新的節點
        Node* curr = head;

        // 找到每層需要更新的位置
        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < num) {
                curr = curr->next[i];
            }
            update[i] = curr;
        }

        // 生成新節點的層數
        int newLevel = randomLevel();
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++) {
                update[i] = head;
            }
            level = newLevel;
        }

        // 創建新節點並插入
        Node* newNode = new Node(num, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->next[i] = update[i]->next[i];
            update[i]->next[i] = newNode;
        }
    }

    // 刪除
    bool erase(int num) {
        vector<Node*> update(MAX_LEVEL + 1);
        Node* curr = head;

        // 找到每層需要更新的位置
        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < num) {
                curr = curr->next[i];
            }
            update[i] = curr;
        }

        curr = curr->next[0];

        // 如果找不到目標值
        if (!curr || curr->val != num) {
            return false;
        }

        // 刪除節點
        for (int i = 0; i <= level; i++) {
            if (update[i]->next[i] != curr) {
                break;
            }
            update[i]->next[i] = curr->next[i];
        }

        delete curr;

        // 更新層數
        while (level > 0 && !head->next[level]) {
            level--;
        }

        return true;
    }

    // 顯示跳表結構（用於調試）
    void display() {
        for (int i = level; i >= 0; i--) {
            Node* curr = head->next[i];
            cout << "Level " << i << ": ";
            while (curr) {
                cout << curr->val << " ";
                curr = curr->next[i];
            }
            cout << endl;
        }
    }
};
```

### 2.2 LeetCode 1206: Design Skiplist

```cpp
class Skiplist {
private:
    static const int MAX_LEVEL = 16;
    static constexpr double P = 0.5;

    struct Node {
        int val;
        vector<Node*> next;
        Node(int v, int level) : val(v), next(level + 1, nullptr) {}
    };

    Node* head;
    int level;

    int randomLevel() {
        int lvl = 0;
        while (lvl < MAX_LEVEL && (rand() / double(RAND_MAX)) < P) {
            lvl++;
        }
        return lvl;
    }

public:
    Skiplist() {
        srand(time(nullptr));
        head = new Node(-1, MAX_LEVEL);
        level = 0;
    }

    bool search(int target) {
        Node* curr = head;
        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < target) {
                curr = curr->next[i];
            }
        }
        curr = curr->next[0];
        return curr && curr->val == target;
    }

    void add(int num) {
        vector<Node*> update(MAX_LEVEL + 1);
        Node* curr = head;

        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < num) {
                curr = curr->next[i];
            }
            update[i] = curr;
        }

        int newLevel = randomLevel();
        if (newLevel > level) {
            for (int i = level + 1; i <= newLevel; i++) {
                update[i] = head;
            }
            level = newLevel;
        }

        Node* newNode = new Node(num, newLevel);
        for (int i = 0; i <= newLevel; i++) {
            newNode->next[i] = update[i]->next[i];
            update[i]->next[i] = newNode;
        }
    }

    bool erase(int num) {
        vector<Node*> update(MAX_LEVEL + 1);
        Node* curr = head;

        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < num) {
                curr = curr->next[i];
            }
            update[i] = curr;
        }

        curr = curr->next[0];
        if (!curr || curr->val != num) {
            return false;
        }

        for (int i = 0; i <= level; i++) {
            if (update[i]->next[i] != curr) {
                break;
            }
            update[i]->next[i] = curr->next[i];
        }

        delete curr;

        while (level > 0 && !head->next[level]) {
            level--;
        }

        return true;
    }
};

/**
 * 使用示例：
 * Skiplist* obj = new Skiplist();
 * bool param_1 = obj->search(target);
 * obj->add(num);
 * bool param_2 = obj->erase(num);
 */
```

## 3. 時間複雜度分析

### 3.1 期望層數

對於 n 個元素的跳表，當 p = 0.5 時：
- 期望最大層數：O(log n)
- 每個節點的平均指針數：2

### 3.2 操作複雜度

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| Search | O(log n) | O(1) |
| Insert | O(log n) | O(1) |
| Delete | O(log n) | O(1) |
| Space | - | O(n) |

## 4. 與其他數據結構的比較

### 4.1 Skip List vs AVL Tree

| 特性 | Skip List | AVL Tree |
|------|-----------|----------|
| 實現複雜度 | 簡單 | 複雜（旋轉操作）|
| 查找 | O(log n) | O(log n) |
| 插入 | O(log n) | O(log n) |
| 刪除 | O(log n) | O(log n) |
| 空間 | O(n) | O(n) |
| 並發性 | 容易實現 | 困難 |
| 常數因子 | 較大 | 較小 |

### 4.2 Skip List vs Red-Black Tree

```cpp
// 性能對比示例
void comparePerformance() {
    const int N = 100000;

    // Skip List
    auto start = chrono::high_resolution_clock::now();
    Skiplist skiplist;
    for (int i = 0; i < N; i++) {
        skiplist.add(i);
    }
    auto end = chrono::high_resolution_clock::now();
    cout << "Skip List insert: "
         << chrono::duration_cast<chrono::milliseconds>(end - start).count()
         << "ms" << endl;

    // Red-Black Tree (std::set)
    start = chrono::high_resolution_clock::now();
    set<int> rbtree;
    for (int i = 0; i < N; i++) {
        rbtree.insert(i);
    }
    end = chrono::high_resolution_clock::now();
    cout << "RB Tree insert: "
         << chrono::duration_cast<chrono::milliseconds>(end - start).count()
         << "ms" << endl;
}
```

## 5. 進階實現

### 5.1 帶範圍查詢的 Skip List

```cpp
class SkiplistWithRange {
private:
    struct Node {
        int val;
        vector<Node*> next;
        Node(int v, int level) : val(v), next(level + 1, nullptr) {}
    };

    Node* head;
    int level;
    static const int MAX_LEVEL = 16;

    int randomLevel() {
        int lvl = 0;
        while (lvl < MAX_LEVEL && rand() % 2) {
            lvl++;
        }
        return lvl;
    }

public:
    SkiplistWithRange() {
        head = new Node(INT_MIN, MAX_LEVEL);
        level = 0;
    }

    // 範圍查詢 [left, right]
    vector<int> rangeQuery(int left, int right) {
        vector<int> result;
        Node* curr = head;

        // 找到 >= left 的第一個節點
        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < left) {
                curr = curr->next[i];
            }
        }

        curr = curr->next[0];

        // 收集 [left, right] 範圍內的所有值
        while (curr && curr->val <= right) {
            result.push_back(curr->val);
            curr = curr->next[0];
        }

        return result;
    }

    // 計算範圍內元素個數
    int countRange(int left, int right) {
        int count = 0;
        Node* curr = head;

        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->val < left) {
                curr = curr->next[i];
            }
        }

        curr = curr->next[0];

        while (curr && curr->val <= right) {
            count++;
            curr = curr->next[0];
        }

        return count;
    }
};
```

### 5.2 並發 Skip List

```cpp
class ConcurrentSkiplist {
private:
    struct Node {
        int val;
        vector<atomic<Node*>> next;
        mutex nodeLock;

        Node(int v, int level) : val(v), next(level + 1) {
            for (int i = 0; i <= level; i++) {
                next[i].store(nullptr);
            }
        }
    };

    Node* head;
    atomic<int> level;
    static const int MAX_LEVEL = 16;
    mutex listLock;

public:
    ConcurrentSkiplist() {
        head = new Node(INT_MIN, MAX_LEVEL);
        level.store(0);
    }

    bool search(int target) {
        Node* curr = head;

        for (int i = level.load(); i >= 0; i--) {
            Node* next = curr->next[i].load();
            while (next && next->val < target) {
                curr = next;
                next = curr->next[i].load();
            }
        }

        curr = curr->next[0].load();
        return curr && curr->val == target;
    }

    void add(int num) {
        lock_guard<mutex> lock(listLock);
        // ... 插入邏輯（帶鎖保護）
    }
};
```

## 6. 實際應用

### 6.1 Redis 中的 Skip List

Redis 的有序集合（Sorted Set）使用 Skip List 實現：

```cpp
// Redis Sorted Set 簡化版本
class SortedSet {
private:
    struct Node {
        string member;
        double score;
        vector<Node*> next;
        Node(const string& m, double s, int level)
            : member(m), score(s), next(level + 1, nullptr) {}
    };

    Node* head;
    unordered_map<string, double> dict;  // member -> score
    int level;

public:
    // 添加成員
    void zadd(const string& member, double score) {
        if (dict.count(member)) {
            zrem(member);  // 先刪除舊的
        }
        // ... 插入邏輯
        dict[member] = score;
    }

    // 獲取排名
    int zrank(const string& member) {
        if (!dict.count(member)) return -1;

        int rank = 0;
        Node* curr = head;
        double targetScore = dict[member];

        // 計算有多少個節點分數小於 target
        for (int i = level; i >= 0; i--) {
            while (curr->next[i] && curr->next[i]->score < targetScore) {
                curr = curr->next[i];
                rank++;
            }
        }

        return rank;
    }

    // 範圍查詢
    vector<string> zrange(int start, int end) {
        vector<string> result;
        Node* curr = head->next[0];

        int index = 0;
        while (curr && index <= end) {
            if (index >= start) {
                result.push_back(curr->member);
            }
            curr = curr->next[0];
            index++;
        }

        return result;
    }

    void zrem(const string& member) {
        // ... 刪除邏輯
        dict.erase(member);
    }
};
```

### 6.2 LevelDB 中的 MemTable

LevelDB 使用 Skip List 實現 MemTable：

```cpp
class MemTable {
private:
    Skiplist table;

public:
    // 插入 key-value
    void put(const string& key, const string& value) {
        string encoded = encodeEntry(key, value);
        table.add(hashCode(encoded));
    }

    // 查找 key
    string get(const string& key) {
        // ... 查找邏輯
        return "";
    }

private:
    string encodeEntry(const string& key, const string& value) {
        return key + ":" + value;
    }

    int hashCode(const string& s) {
        return hash<string>{}(s);
    }
};
```

## 7. 優缺點總結

### 7.1 優點

1. **實現簡單**：比平衡樹簡單得多
2. **並發友好**：容易實現無鎖或細粒度鎖
3. **性能穩定**：平均性能接近平衡樹
4. **空間效率**：平均每個節點只需 2 個指針
5. **範圍查詢高效**：底層是有序鏈表

### 7.2 缺點

1. **隨機性**：最壞情況可能退化到 O(n)
2. **空間開銷**：比簡單鏈表多 1 倍指針
3. **緩存不友好**：指針跳躍訪問
4. **不適合小數據**：常數因子較大

## 總結

Skip List 是一種優秀的數據結構：
- 提供 O(log n) 的查找、插入、刪除操作
- 實現比平衡樹簡單
- 適合並發場景
- 被 Redis、LevelDB 等系統廣泛使用

**使用建議**：
- 需要有序數據且並發訪問：使用 Skip List
- 需要嚴格的最壞情況保證：使用平衡樹
- 數據量小：使用簡單數組或鏈表
