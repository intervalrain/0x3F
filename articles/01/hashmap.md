---
title: "HashMap 原理"
order: 4
description: "HashMap 的 O(1) 查找原理、哈希衝突解決、負載因子與擴容機制"
tags: ["HashMap", "Hash Table", "哈希衝突", "負載因子", "Amortized"]
---

# HashMap 原理

## 前言

HashMap (哈希表) 是最常用的資料結構之一，能在 **O(1)** 時間內完成查找、插入、刪除操作。

```cpp
unordered_map<string, int> map;
map["Alice"] = 90;      // O(1) 插入
int score = map["Alice"]; // O(1) 查找
```

**核心問題**：為什麼 HashMap 的查找是 O(1)？

---

## HashMap 的原理

### 基本概念

HashMap 的核心思想：
1. 使用**哈希函數**將 key 轉換為陣列索引
2. 直接透過索引存取資料（O(1)）

```cpp
// 簡化示意
int hash(string key) {
    // 將 key 轉換為數字
    return someHashFunction(key) % capacity;
}

// 插入
int index = hash("Alice");  // 假設得到 3
array[3] = 90;

// 查找
int index = hash("Alice");  // 同樣是 3
return array[3];            // O(1) 直接存取
```

### 為什麼是 O(1)？

因為 HashMap 底層是**陣列**，透過索引直接存取是 O(1)。

```
Key: "Alice"  →  hash("Alice") = 3  →  array[3] = 90
                 ↑ O(1)              ↑ O(1)
```

---

## 哈希衝突 (Hash Collision)

### 什麼是哈希衝突？

不同的 key 可能產生相同的 hash 值。

```cpp
hash("Alice") = 3
hash("Bob")   = 3  // 衝突！
```

### 為什麼會發生衝突？

- **鴿籠原理**：key 的空間 >> 陣列容量
- 例如：無限個字串 → 有限個陣列索引

```
無限個可能的字串
    ↓ hash function
有限個陣列索引 (0 ~ capacity-1)

必然會有多個 key 對應到同一個索引
```

---

## 解決哈希衝突的方法

### 1. 鏈表法 (Separate Chaining)

每個陣列位置存放一個**鏈表**，將所有衝突的 key-value 存在同一個鏈表中。

```
陣列索引:
[0] → nullptr
[1] → (key1, val1) → (key2, val2) → nullptr
[2] → nullptr
[3] → (Alice, 90) → (Bob, 85) → nullptr  // 衝突，形成鏈表
[4] → (Carol, 95) → nullptr
```

**實作**：

```cpp
struct Node {
    string key;
    int value;
    Node* next;
};

class HashMap {
private:
    vector<Node*> table;  // 陣列，每個元素是鏈表的頭
    int capacity;

public:
    void put(string key, int value) {
        int index = hash(key);
        Node* head = table[index];

        // 檢查 key 是否已存在
        for (Node* curr = head; curr; curr = curr->next) {
            if (curr->key == key) {
                curr->value = value;  // 更新
                return;
            }
        }

        // 插入新節點（頭插法）
        Node* newNode = new Node{key, value, head};
        table[index] = newNode;
    }

    int get(string key) {
        int index = hash(key);
        for (Node* curr = table[index]; curr; curr = curr->next) {
            if (curr->key == key) {
                return curr->value;
            }
        }
        return -1;  // 找不到
    }
};
```

**時間複雜度**：
- 平均：O(1)
- 最壞：O(n)（所有 key 都衝突，退化成鏈表）

### 2. 紅黑樹優化 (Java HashMap)

當鏈表長度 ≥ 8 時，Java 的 HashMap 會將鏈表轉換為**紅黑樹**。

```
鏈表長度 < 8:
[3] → (k1, v1) → (k2, v2) → ... → nullptr

鏈表長度 ≥ 8:
[3] → 紅黑樹
      /    \
    節點   節點
```

**優點**：
- 最壞時間複雜度從 O(n) 降到 O(log n)

**為什麼選 8？**
- 權衡：紅黑樹的常數因子較大
- 實務上，負載因子控制得當，鏈表很少超過 8

### 3. 開放定址法 (Open Addressing)

不使用鏈表，直接在陣列中尋找下一個空位。

```cpp
// 線性探測
int index = hash(key);
while (table[index] != nullptr && table[index].key != key) {
    index = (index + 1) % capacity;  // 往下找
}
table[index] = {key, value};
```

**缺點**：
- 刪除操作複雜
- 容易產生聚集 (clustering)

---

## 負載因子 (Load Factor)

### 定義

```
負載因子 = 元素數量 / 陣列容量
Load Factor = size / capacity
```

### 為什麼重要？

- 負載因子**太高** → 衝突增加 → 效能下降
- 負載因子**太低** → 記憶體浪費

### 常見設定

| 實作 | 預設負載因子 | 擴容時機 |
|-----|------------|---------|
| **Java HashMap** | 0.75 | size ≥ capacity × 0.75 |
| **C++ unordered_map** | 1.0 | size ≥ capacity |
| **Python dict** | 2/3 | size ≥ capacity × 2/3 |

**為什麼選 0.75？**
- 平衡：空間利用率 vs 衝突機率
- 實驗證明：0.75 是較佳的折衷點

---

## 擴容機制

### 為什麼需要擴容？

當負載因子超過閾值時，需要擴容以降低衝突機率。

### 擴容過程

```cpp
void resize() {
    int oldCapacity = capacity;
    capacity *= 2;  // 容量翻倍

    vector<Node*> oldTable = table;
    table = vector<Node*>(capacity, nullptr);

    // 重新哈希 (rehash) 所有元素
    for (int i = 0; i < oldCapacity; i++) {
        for (Node* curr = oldTable[i]; curr; ) {
            Node* next = curr->next;

            // 計算新索引
            int newIndex = hash(curr->key);

            // 插入新位置（頭插法）
            curr->next = table[newIndex];
            table[newIndex] = curr;

            curr = next;
        }
    }
}
```

### 擴容成本

```
假設有 n 個元素：
- 每次擴容需要重新哈希所有元素：O(n)
- 擴容發生時機：capacity = 1, 2, 4, 8, ..., n
- 總成本：1 + 2 + 4 + 8 + ... + n ≈ 2n
- 攤銷成本：2n / n = O(1)
```

---

## 為什麼查找仍是 O(1)？

### 關鍵因素

1. **負載因子控制**
   - 保持負載因子 ≤ 0.75
   - 衝突機率低，鏈表長度短

2. **擴容機制**
   - 動態調整容量
   - 保持 O(1) 平均效能

3. **攤銷分析 (Amortized Analysis)**
   - 雖然單次擴容是 O(n)
   - 但攤銷到每次操作仍是 O(1)

### 攤銷分析

```
插入 n 個元素：
- 普通插入：n 次 × O(1) = O(n)
- 擴容成本：1 + 2 + 4 + ... + n/2 ≈ n
- 總成本：O(n) + O(n) = O(2n)
- 平均每次插入：O(2n) / n = O(1)
```

### 實際時間複雜度

| 情況 | 時間複雜度 | 條件 |
|-----|----------|------|
| **平均** | O(1) | 負載因子控制得當 |
| **最壞** | O(n) | 所有 key 衝突（極少發生） |
| **攤銷** | O(1) | 包含擴容成本 |

---

## 實作完整 HashMap

```cpp
class HashMap {
private:
    struct Node {
        string key;
        int value;
        Node* next;
        Node(string k, int v) : key(k), value(v), next(nullptr) {}
    };

    vector<Node*> table;
    int size;
    int capacity;
    float loadFactor;

    int hash(const string& key) {
        // 簡單的哈希函數
        int h = 0;
        for (char c : key) {
            h = h * 31 + c;
        }
        return abs(h) % capacity;
    }

    void resize() {
        int oldCapacity = capacity;
        capacity *= 2;

        vector<Node*> oldTable = table;
        table = vector<Node*>(capacity, nullptr);
        size = 0;

        for (int i = 0; i < oldCapacity; i++) {
            for (Node* curr = oldTable[i]; curr; ) {
                Node* next = curr->next;
                put(curr->key, curr->value);
                delete curr;
                curr = next;
            }
        }
    }

public:
    HashMap(int cap = 16, float lf = 0.75)
        : capacity(cap), loadFactor(lf), size(0) {
        table.resize(capacity, nullptr);
    }

    void put(string key, int value) {
        if ((float)size / capacity >= loadFactor) {
            resize();
        }

        int index = hash(key);
        Node* head = table[index];

        // 檢查是否已存在
        for (Node* curr = head; curr; curr = curr->next) {
            if (curr->key == key) {
                curr->value = value;
                return;
            }
        }

        // 插入新節點
        Node* newNode = new Node(key, value);
        newNode->next = head;
        table[index] = newNode;
        size++;
    }

    int get(string key) {
        int index = hash(key);
        for (Node* curr = table[index]; curr; curr = curr->next) {
            if (curr->key == key) {
                return curr->value;
            }
        }
        return -1;
    }

    bool remove(string key) {
        int index = hash(key);
        Node* curr = table[index];
        Node* prev = nullptr;

        while (curr) {
            if (curr->key == key) {
                if (prev) {
                    prev->next = curr->next;
                } else {
                    table[index] = curr->next;
                }
                delete curr;
                size--;
                return true;
            }
            prev = curr;
            curr = curr->next;
        }
        return false;
    }

    int getSize() const { return size; }
    int getCapacity() const { return capacity; }
};
```

---

## C++ unordered_map 使用

```cpp
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> map;

    // 插入
    map["Alice"] = 90;
    map.insert({"Bob", 85});

    // 查找
    if (map.count("Alice")) {
        cout << map["Alice"] << endl;
    }

    // 遍歷
    for (auto& [key, value] : map) {
        cout << key << ": " << value << endl;
    }

    // 刪除
    map.erase("Alice");

    // 檢查容量
    cout << "Size: " << map.size() << endl;
    cout << "Bucket count: " << map.bucket_count() << endl;
    cout << "Load factor: " << map.load_factor() << endl;
}
```

---

## LeetCode 中的應用

```cpp
// 問題：Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;  // value -> index
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

// 問題：Group Anagrams
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> map;
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        map[key].push_back(s);
    }

    vector<vector<string>> result;
    for (auto& [key, group] : map) {
        result.push_back(group);
    }
    return result;
}
```

---

## LeetCode 練習題

- [Two Sum](https://leetcode.com/problems/two-sum/)
- [Group Anagrams](https://leetcode.com/problems/group-anagrams/)
- [Design HashMap](https://leetcode.com/problems/design-hashmap/)
- [Valid Anagram](https://leetcode.com/problems/valid-anagram/)

---

## 重點總結

- **HashMap 查找是 O(1)** 因為底層是陣列，透過哈希函數直接定位
- **哈希衝突**透過鏈表法（或紅黑樹）解決
- **負載因子**控制衝突機率，通常設為 0.75
- **擴容機制**保持效能，攤銷時間複雜度 O(1)
- **實務上**：使用 `unordered_map`，比 `map` 快
- **攤銷分析**：雖然單次擴容 O(n)，但平均下來仍是 O(1)