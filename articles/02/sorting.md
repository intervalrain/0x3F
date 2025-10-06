---
title: "排序演算法"
order: 1
description: "常見排序演算法：穩定性、原地排序，以及各種排序方法的比較"
tags: ["排序", "Sorting", "Bubble Sort", "Quick Sort", "Merge Sort"]
---

# 排序演算法

## 前言

排序是最基本且重要的演算法之一。了解各種排序演算法的特性，有助於在不同場景選擇最合適的方法。

---

## 排序的基本概念

### 穩定性 (Stability)

**定義**: 相同值的元素，排序後保持原有的相對順序。

```
原始: [(3, a), (1, b), (3, c), (2, d)]
       ↑              ↑
     相同值，a 在 c 前面

穩定排序: [(1, b), (2, d), (3, a), (3, c)]
                              ↑       ↑
                           a 仍在 c 前面

不穩定排序: [(1, b), (2, d), (3, c), (3, a)]
                              ↑       ↑
                           順序可能改變
```

**為什麼重要？**

```cpp
// 場景：先按年齡排序，再按分數排序
struct Student {
    string name;
    int age;
    int score;
};

vector<Student> students = {
    {"Alice", 20, 85},
    {"Bob", 22, 90},
    {"Carol", 20, 85}
};

// 使用穩定排序
sort(students.begin(), students.end(),
     [](const Student& a, const Student& b) {
         return a.age < b.age;
     });
// 再按分數排序
stable_sort(students.begin(), students.end(),
            [](const Student& a, const Student& b) {
                return a.score < b.score;
            });

// 結果：相同分數的學生，年齡順序保持不變
```

### 原地排序 (In-place)

**定義**: 只使用 O(1) 額外空間的排序。

```cpp
// 原地排序：直接在原陣列上操作
void bubbleSort(vector<int>& arr) {
    // 空間: O(1)
}

// 非原地排序：需要額外陣列
void mergeSort(vector<int>& arr) {
    // 空間: O(n)
    vector<int> temp(arr.size());
}
```

---

## 簡單排序 (O(n²))

### 1. Bubble Sort (冒泡排序)

**原理**: 重複比較相鄰元素，較大者往後移。

```cpp
void bubbleSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        // 優化：如果沒有交換，已排序
        if (!swapped) break;
    }
}
```

**過程示意**:
```
[5, 2, 8, 1, 9]

第 1 輪:
[2, 5, 8, 1, 9]  // 5 和 2 交換
[2, 5, 1, 8, 9]  // 8 和 1 交換
[2, 5, 1, 8, 9]  // 9 最大，到末尾

第 2 輪:
[2, 1, 5, 8, 9]  // 5 和 1 交換
[2, 1, 5, 8, 9]  // 8 第二大

...
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | 最佳 O(n), 平均/最壞 O(n²) |
| **空間複雜度** | O(1) |
| **穩定性** | 穩定 |
| **原地排序** | 是 |

**優點**: 簡單、穩定
**缺點**: 效率低

---

### 2. Selection Sort (選擇排序)

**原理**: 每次選擇最小值放到前面。

```cpp
void selectionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;

        // 找到最小值的索引
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        // 交換
        swap(arr[i], arr[minIdx]);
    }
}
```

**過程示意**:
```
[5, 2, 8, 1, 9]

第 1 輪: 找到最小值 1
[1, 2, 8, 5, 9]

第 2 輪: 找到第二小 2
[1, 2, 8, 5, 9]

第 3 輪: 找到 5
[1, 2, 5, 8, 9]

...
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(n²) (所有情況) |
| **空間複雜度** | O(1) |
| **穩定性** | **不穩定** |
| **原地排序** | 是 |

**優點**: 簡單、交換次數少
**缺點**: 不穩定、效率低

---

### 3. Insertion Sort (插入排序)

**原理**: 像打撲克牌，每次插入到正確位置。

```cpp
void insertionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        // 將 key 插入到正確位置
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }
}
```

**過程示意**:
```
[5, 2, 8, 1, 9]

i=1: 插入 2
[2, 5, 8, 1, 9]

i=2: 插入 8 (已在正確位置)
[2, 5, 8, 1, 9]

i=3: 插入 1
[1, 2, 5, 8, 9]

...
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | 最佳 O(n), 平均/最壞 O(n²) |
| **空間複雜度** | O(1) |
| **穩定性** | 穩定 |
| **原地排序** | 是 |

**優點**: 穩定、對幾乎有序的資料很快
**缺點**: 平均效率低

**應用**: 小資料集、幾乎有序的資料

---

## 高效排序 (O(n log n))

### 4. Merge Sort (合併排序)

**原理**: 分治法，將陣列分成兩半，分別排序後合併。

```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;

    // 合併
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    // 複製剩餘元素
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    // 複製回原陣列
    for (int i = 0; i < k; i++) {
        arr[left + i] = temp[i];
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void mergeSort(vector<int>& arr) {
    mergeSort(arr, 0, arr.size() - 1);
}
```

**過程示意**:
```
[5, 2, 8, 1, 9]

分割:
[5, 2]    [8, 1, 9]
[5] [2]   [8] [1, 9]
          [8] [1] [9]

合併:
[2, 5]    [1, 8] [9]
[2, 5]    [1, 8, 9]
[1, 2, 5, 8, 9]
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(n log n) (所有情況) |
| **空間複雜度** | O(n) |
| **穩定性** | 穩定 |
| **原地排序** | 否 |

**優點**: 穩定、效率穩定
**缺點**: 需要額外空間

---

### 5. Quick Sort (快速排序)

**原理**: 選擇 pivot，將小於 pivot 的放左邊，大於的放右邊。

```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void quickSort(vector<int>& arr) {
    quickSort(arr, 0, arr.size() - 1);
}
```

**過程示意**:
```
[5, 2, 8, 1, 9]  pivot = 9

partition:
[5, 2, 8, 1] [9]
 ↑小於9     pivot

繼續對 [5, 2, 8, 1] 排序，pivot = 1
[1] [5, 2, 8]

...
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | 最佳/平均 O(n log n), 最壞 O(n²) |
| **空間複雜度** | O(log n) (遞迴棧) |
| **穩定性** | **不穩定** |
| **原地排序** | 是 |

**優點**: 平均最快、原地排序
**缺點**: 不穩定、最壞 O(n²)

**優化**: 隨機選擇 pivot、三數取中

---

### 6. Heap Sort (堆積排序)

**原理**: 建立 Max Heap，依序取出最大值。

```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    // 建立 Max Heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 依序取出最大值
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(n log n) (所有情況) |
| **空間複雜度** | O(1) |
| **穩定性** | **不穩定** |
| **原地排序** | 是 |

**優點**: 原地排序、穩定 O(n log n)
**缺點**: 不穩定、實務上比 Quick Sort 慢

---

## 特殊排序

### 7. Counting Sort (計數排序)

**原理**: 統計每個值出現的次數。

```cpp
void countingSort(vector<int>& arr) {
    if (arr.empty()) return;

    int maxVal = *max_element(arr.begin(), arr.end());
    int minVal = *min_element(arr.begin(), arr.end());
    int range = maxVal - minVal + 1;

    vector<int> count(range, 0);
    vector<int> output(arr.size());

    // 計數
    for (int num : arr) {
        count[num - minVal]++;
    }

    // 累加
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    // 輸出
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - minVal] - 1] = arr[i];
        count[arr[i] - minVal]--;
    }

    arr = output;
}
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(n + k), k 為範圍 |
| **空間複雜度** | O(n + k) |
| **穩定性** | 穩定 |
| **原地排序** | 否 |

**適用**: 整數、範圍小

---

### 8. Bucket Sort (桶排序)

**原理**: 將元素分配到不同的桶中，分別排序。

```cpp
void bucketSort(vector<float>& arr) {
    int n = arr.size();
    vector<vector<float>> buckets(n);

    // 分配到桶中
    for (float num : arr) {
        int idx = n * num;
        buckets[idx].push_back(num);
    }

    // 對每個桶排序
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
    }

    // 合併
    int index = 0;
    for (auto& bucket : buckets) {
        for (float num : bucket) {
            arr[index++] = num;
        }
    }
}
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | 平均 O(n + k) |
| **空間複雜度** | O(n + k) |
| **穩定性** | 取決於內部排序 |
| **原地排序** | 否 |

**適用**: 均勻分布的資料

---

### 9. Radix Sort (基數排序)

**原理**: 從最低位開始，依次對每一位排序。

```cpp
void countingSortByDigit(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    vector<int> count(10, 0);

    for (int num : arr) {
        count[(num / exp) % 10]++;
    }

    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    arr = output;
}

void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());

    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(d * (n + k)), d 為位數 |
| **空間複雜度** | O(n + k) |
| **穩定性** | 穩定 |
| **原地排序** | 否 |

**適用**: 整數、固定位數

---

### 10. Shell Sort (希爾排序)

**原理**: 改良的插入排序，先對間隔較大的元素排序。

```cpp
void shellSort(vector<int>& arr) {
    int n = arr.size();

    // 間隔序列
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }

            arr[j] = temp;
        }
    }
}
```

| 特性 | 值 |
|-----|---|
| **時間複雜度** | O(n log n) ~ O(n²) |
| **空間複雜度** | O(1) |
| **穩定性** | **不穩定** |
| **原地排序** | 是 |

---

## 排序演算法比較

### 時間複雜度對比

| 演算法 | 最佳 | 平均 | 最壞 | 空間 | 穩定 | 原地 |
|-------|------|------|------|------|------|------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | ✓ | ✓ |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | ✗ | ✓ |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | ✓ | ✓ |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | ✓ | ✗ |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | ✗ | ✓ |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | ✗ | ✓ |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | ✓ | ✗ |
| **Radix Sort** | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | ✓ | ✗ |

### 選擇建議

| 場景 | 推薦演算法 |
|-----|----------|
| **小資料 (n < 50)** | Insertion Sort |
| **幾乎有序** | Insertion Sort |
| **需要穩定** | Merge Sort, Counting Sort |
| **記憶體受限** | Quick Sort, Heap Sort |
| **平均最快** | Quick Sort |
| **整數、範圍小** | Counting Sort |
| **保證 O(n log n)** | Merge Sort, Heap Sort |

---

## C++ STL 排序

```cpp
#include <algorithm>

vector<int> arr = {5, 2, 8, 1, 9};

// 1. sort - 不穩定，平均 O(n log n)
sort(arr.begin(), arr.end());

// 2. stable_sort - 穩定，O(n log n)
stable_sort(arr.begin(), arr.end());

// 3. partial_sort - 部分排序
partial_sort(arr.begin(), arr.begin() + 3, arr.end());

// 4. nth_element - 找第 n 大
nth_element(arr.begin(), arr.begin() + 2, arr.end());

// 5. 自訂比較
sort(arr.begin(), arr.end(), greater<int>());  // 降序

// 6. 自訂 struct
struct Student {
    string name;
    int score;
};

vector<Student> students;
sort(students.begin(), students.end(),
     [](const Student& a, const Student& b) {
         return a.score > b.score;
     });
```

---

## LeetCode 練習題

- [Sort an Array](https://leetcode.com/problems/sort-an-array/)
- [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
- [Sort Colors](https://leetcode.com/problems/sort-colors/)
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

---

## 重點總結

### 記憶技巧

- **穩定排序**: Bubble, Insertion, Merge, Counting, Radix
- **原地排序**: Bubble, Selection, Insertion, Quick, Heap, Shell
- **O(n log n) 保證**: Merge, Heap
- **最快平均**: Quick Sort
- **小資料**: Insertion Sort
- **整數專用**: Counting, Radix

### 實務建議

- **預設選擇**: C++ `sort()` (Quick Sort 變體)
- **需要穩定**: `stable_sort()`
- **Top K**: `nth_element()` 或 Heap
- **自行實作**: 除非有特殊需求，否則用 STL
