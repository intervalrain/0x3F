---
title: "動態陣列"
order: 3
description: "動態陣列的擴縮容機制、索引邊界檢查，以及如何實作動態陣列"
tags: ["動態陣列", "Vector", "擴容", "Amortized"]
---

# 動態陣列 (Dynamic Array)

## 前言

靜態陣列的大小在編譯時就已經確定，無法動態調整。而**動態陣列**（如 C++ 的 `vector`）可以在執行時動態擴展或縮減容量。

```cpp
// 靜態陣列 - 大小固定
int arr[5] = {1, 2, 3, 4, 5};

// 動態陣列 - 大小可變
vector<int> vec;
vec.push_back(1);  // 動態擴展
```

---

## 動態擴容 (Dynamic Expansion)

### 為什麼需要擴容？

當元素數量超過陣列容量時，需要：
1. 分配一塊**更大的連續記憶體空間**
2. 將舊資料**複製**到新空間
3. 釋放舊記憶體

### 擴容策略

不同語言/實作有不同的擴容策略：

| 語言/實作 | 擴容策略 |
|----------|---------|
| **C++ vector** | 容量 × 2 |
| **Java ArrayList** | 容量 × 1.5 |
| **Python list** | `new_capacity = old_capacity + (old_capacity >> 3) + 6` |

### 為什麼選擇 2 倍擴容？

```cpp
// 初始容量為 1，每次 × 2
1 → 2 → 4 → 8 → 16 → 32 → 64 → 128 → ...

// 假設插入 n 個元素，擴容的總成本
// 複製次數：1 + 2 + 4 + 8 + ... + n/2 = n - 1
// 平攤到每次插入 = (n - 1) / n ≈ O(1)
```

**優點**：
- 擴容次數少：log₂(n) 次
- **攤銷時間複雜度** O(1)

**缺點**：
- 記憶體浪費較多（最多浪費 50%）

### 擴容過程示意

```
原陣列 (容量 4，已滿):
[1, 2, 3, 4]

插入第 5 個元素時，需要擴容：
1. 分配容量 8 的新陣列
   [_, _, _, _, _, _, _, _]

2. 複製舊資料
   [1, 2, 3, 4, _, _, _, _]

3. 插入新元素
   [1, 2, 3, 4, 5, _, _, _]

4. 釋放舊陣列
```

---

## 動態縮容 (Dynamic Shrinking)

### 為什麼需要縮容？

當元素數量遠小於容量時，會造成**記憶體浪費**。

### 縮容策略

```cpp
// 常見策略：當 size < capacity / 4 時，縮容為 capacity / 2
if (size < capacity / 4) {
    resize(capacity / 2);
}
```

**為什麼是 1/4 而不是 1/2？**

避免**頻繁擴縮容**（thrashing）：

```
假設 capacity = 100, size = 50

如果縮容閾值是 1/2：
1. size = 50 → 縮容到 capacity = 50
2. 插入 1 個 → size = 51 → 擴容到 capacity = 100
3. 刪除 1 個 → size = 50 → 縮容到 capacity = 50
4. 無限循環...

如果縮容閾值是 1/4：
1. size = 50，不縮容 (50 > 100/4)
2. 插入/刪除幾個元素，仍在安全範圍內
3. 只有 size < 25 時才縮容
```

---

## 索引邊界檢查 (Bounds Checking)

### 為什麼需要邊界檢查？

```cpp
vector<int> vec = {1, 2, 3};
cout << vec[5];  // 未定義行為 (UB)
```

存取超出範圍的索引會導致：
- **記憶體錯誤**
- **安全漏洞**
- **程式崩潰**

### C++ 的兩種存取方式

```cpp
vector<int> vec = {1, 2, 3};

// 方法 1: operator[] - 不檢查邊界（效能較好）
int x = vec[5];  // 未定義行為

// 方法 2: at() - 檢查邊界（會拋出異常）
try {
    int y = vec.at(5);  // 拋出 std::out_of_range
} catch (const std::out_of_range& e) {
    cerr << "Index out of range!" << endl;
}
```

### 自行實作邊界檢查

```cpp
int get(int index) {
    if (index < 0 || index >= size) {
        throw std::out_of_range("Index out of range");
    }
    return data[index];
}
```

---

## 實作動態陣列

### 基本結構

```cpp
template<typename T>
class DynamicArray {
private:
    T* data;          // 資料指標
    int size;         // 當前元素數量
    int capacity;     // 當前容量

public:
    DynamicArray() : data(nullptr), size(0), capacity(0) {}

    ~DynamicArray() {
        delete[] data;
    }
};
```

### 實作 push_back

```cpp
void push_back(const T& value) {
    // 1. 檢查是否需要擴容
    if (size == capacity) {
        resize(capacity == 0 ? 1 : capacity * 2);
    }

    // 2. 插入元素
    data[size++] = value;
}
```

### 實作擴容函數

```cpp
void resize(int newCapacity) {
    // 1. 分配新記憶體
    T* newData = new T[newCapacity];

    // 2. 複製舊資料
    for (int i = 0; i < size; i++) {
        newData[i] = data[i];
    }

    // 3. 釋放舊記憶體
    delete[] data;

    // 4. 更新指標和容量
    data = newData;
    capacity = newCapacity;
}
```

### 實作 pop_back

```cpp
void pop_back() {
    if (size == 0) {
        throw std::out_of_range("Array is empty");
    }

    // 1. 刪除最後一個元素
    size--;

    // 2. 檢查是否需要縮容
    if (size > 0 && size < capacity / 4) {
        resize(capacity / 2);
    }
}
```

### 實作索引存取

```cpp
// operator[] - 不檢查邊界
T& operator[](int index) {
    return data[index];
}

// at() - 檢查邊界
T& at(int index) {
    if (index < 0 || index >= size) {
        throw std::out_of_range("Index out of range");
    }
    return data[index];
}
```

### 完整實作

```cpp
template<typename T>
class DynamicArray {
private:
    T* data;
    int size;
    int capacity;

    void resize(int newCapacity) {
        T* newData = new T[newCapacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
        capacity = newCapacity;
    }

public:
    DynamicArray() : data(nullptr), size(0), capacity(0) {}

    ~DynamicArray() {
        delete[] data;
    }

    void push_back(const T& value) {
        if (size == capacity) {
            resize(capacity == 0 ? 1 : capacity * 2);
        }
        data[size++] = value;
    }

    void pop_back() {
        if (size == 0) {
            throw std::out_of_range("Array is empty");
        }
        size--;
        if (size > 0 && size < capacity / 4) {
            resize(capacity / 2);
        }
    }

    T& operator[](int index) {
        return data[index];
    }

    T& at(int index) {
        if (index < 0 || index >= size) {
            throw std::out_of_range("Index out of range");
        }
        return data[index];
    }

    int getSize() const { return size; }
    int getCapacity() const { return capacity; }
    bool isEmpty() const { return size == 0; }
};
```

---

## 時間複雜度分析

### 各操作的時間複雜度

| 操作 | 平均時間 | 最壞時間 | 說明 |
|-----|---------|---------|------|
| **push_back** | O(1) | O(n) | 需要擴容時為 O(n) |
| **pop_back** | O(1) | O(n) | 需要縮容時為 O(n) |
| **operator[]** | O(1) | O(1) | 直接索引存取 |
| **at()** | O(1) | O(1) | 索引存取 + 邊界檢查 |
| **insert (中間)** | O(n) | O(n) | 需要移動元素 |
| **erase (中間)** | O(n) | O(n) | 需要移動元素 |

### 攤銷分析 (Amortized Analysis)

雖然單次 `push_back` 可能需要 O(n)，但**攤銷到每次操作**仍是 O(1)。

**證明**：
```
假設插入 n 個元素：
- 擴容發生在: 1, 2, 4, 8, 16, ..., n/2
- 總複製次數: 1 + 2 + 4 + 8 + ... + n/2 = n - 1
- 攤銷成本: (n - 1) / n ≈ O(1)
```

---

## 實際應用

### C++ vector 的使用

```cpp
#include <vector>
using namespace std;

int main() {
    vector<int> vec;

    // 預先分配容量，避免多次擴容
    vec.reserve(100);

    // 檢查容量
    cout << "Size: " << vec.size() << endl;       // 0
    cout << "Capacity: " << vec.capacity() << endl; // 100

    // 插入元素
    vec.push_back(1);
    vec.push_back(2);

    // 縮減容量到實際大小
    vec.shrink_to_fit();
}
```

### LeetCode 中的應用

```cpp
// 問題：需要動態收集結果
vector<vector<int>> result;

void backtrack(vector<int>& nums, vector<int>& path) {
    result.push_back(path);  // 動態擴容
    // ...
}
```

---

## LeetCode 練習題

- [Design Dynamic Array](https://leetcode.com/problems/design-dynamic-array/) (類似題)
- [Implement Stack using Array](https://leetcode.com/problems/implement-stack-using-queues/)

---

## 延伸閱讀：什麼是攤銷分析 (Amortized Analysis)？

### 基本概念

**攤銷分析**是一種分析演算法時間複雜度的方法，它不看單次操作的最壞情況，而是看**一系列操作的平均成本**。

### 三種時間複雜度

| 分析方法 | 定義 | 範例 (動態陣列 push_back) |
|---------|------|------------------------|
| **最壞情況** | 單次操作的最大成本 | O(n) - 需要擴容時 |
| **平均情況** | 所有可能輸入的期望成本 | 取決於輸入分布 |
| **攤銷成本** | 一系列操作的平均成本 | O(1) |

### 為什麼需要攤銷分析？

有些操作偶爾很慢，但大部分時候很快。如果只看最壞情況，會**過於悲觀**。

```cpp
vector<int> vec;
vec.push_back(1);  // O(1) - 不需擴容
vec.push_back(2);  // O(n) - 需要擴容！
vec.push_back(3);  // O(1)
vec.push_back(4);  // O(1)
vec.push_back(5);  // O(n) - 又擴容了！
```

如果只看最壞情況 O(n)，會認為效能很差。但實際上，大部分操作都是 O(1)。

### 攤銷分析的三種方法

#### 1. 聚合分析 (Aggregate Analysis)

計算 n 次操作的**總成本**，再除以 n。

**範例：動態陣列的 n 次 push_back**

```
初始容量 = 1，每次 × 2

操作序列：
push_back(1)  → 擴容到 1，複製 0 個
push_back(2)  → 擴容到 2，複製 1 個
push_back(3)  → 擴容到 4，複製 2 個
push_back(4)  → 不擴容
push_back(5)  → 擴容到 8，複製 4 個
...

總複製次數（插入 n 個元素）：
0 + 1 + 2 + 4 + 8 + ... + n/2 = n - 1

總成本：
n（插入） + (n - 1)（複製） = 2n - 1

攤銷成本：
(2n - 1) / n ≈ 2 = O(1)
```

#### 2. 核算法 (Accounting Method)

為每次操作**預付**一些成本，用來支付未來的昂貴操作。

**範例：動態陣列**

```
策略：每次 push_back 收費 3 元

1 元：用於插入元素本身
2 元：存起來，用於未來的擴容

當需要擴容時（複製 n 個元素）：
- 每個元素都已預付 2 元
- 總共有 n × 2 = 2n 元
- 複製 n 個元素的成本是 n
- 2n - n = n，還有剩餘！

結論：每次收費 3 = O(1)，足以支付所有操作
```

#### 3. 勢能法 (Potential Method)

定義一個**勢能函數**，代表資料結構的「儲存能量」。

**範例：動態陣列**

```cpp
勢能函數：Φ = 2 × size - capacity

攤銷成本 = 實際成本 + Δ勢能

情況 1：不需擴容
- 實際成本：1（插入）
- Δ勢能：2 × 1 - 0 = 2
- 攤銷成本：1 + 2 = 3

情況 2：需要擴容（size = capacity = n）
- 實際成本：1 + n（插入 + 複製）
- Δ勢能：2(n+1) - 2n - (2n - n) = 2n + 2 - 2n - n = 2 - n
- 攤銷成本：(1 + n) + (2 - n) = 3

結論：無論哪種情況，攤銷成本都是 O(1)
```

### 攤銷分析 vs 平均分析

| 比較項目 | 攤銷分析 | 平均分析 |
|---------|---------|---------|
| **依賴輸入** | 不依賴 | 依賴輸入分布 |
| **保證** | 保證任何輸入序列 | 僅保證期望值 |
| **應用** | 資料結構操作序列 | 單次操作 |

**範例：快速排序**

```
平均分析：假設輸入隨機分布，期望 O(n log n)
攤銷分析：不適用（單次操作，沒有序列）
```

### 實際應用

**哪些資料結構/演算法使用攤銷分析？**

| 資料結構/操作 | 單次最壞 | 攤銷成本 |
|-------------|---------|---------|
| **動態陣列 push_back** | O(n) | O(1) |
| **HashMap 插入** | O(n) | O(1) |
| **Disjoint Set (路徑壓縮)** | O(log n) | O(α(n)) ≈ O(1) |
| **Splay Tree** | O(n) | O(log n) |
| **斐波那契堆 decrease-key** | O(log n) | O(1) |

### 視覺化理解

```
單次操作的成本波動：
成本
 ↑
 n |     *           *
   |    * *         * *
 1 | * *   * * * * *   * * * * ...
   └─────────────────────────────→ 時間
     1 2 3 4 5 6 7 8 9 ...

攤銷後的平均成本：
成本
 ↑
 3 | ─────────────────────────── 穩定在 O(1)
   |
 1 |
   └─────────────────────────────→ 時間
```

### 重要性

在 LeetCode 和實際開發中：
- **不要害怕偶爾的慢操作**（如擴容）
- **使用 vector 時無需過度優化**（已經是攤銷 O(1)）
- **理解攤銷分析**，避免錯誤的效能評估

---

## 重點總結

- **動態陣列**透過擴縮容機制，實現靈活的大小調整
- **擴容策略**：通常是 2 倍擴容，攤銷時間複雜度 O(1)
- **縮容閾值**：通常是 1/4，避免頻繁擴縮容
- **邊界檢查**：`at()` 安全但慢，`operator[]` 快但不安全
- **攤銷分析**：雖然單次可能 O(n)，但平均下來是 O(1)
- **攤銷分析三種方法**：聚合分析、核算法、勢能法
- 實務中使用 `vector::reserve()` 預先分配空間，避免多次擴容