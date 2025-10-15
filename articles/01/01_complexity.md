---
title: 01-1. 複雜度分析
order: 1
description: 時間複雜度與空間複雜度的基本概念，以及如何根據 Constraints 分析最佳演算法
tags:
  - 複雜度
  - Big O
  - 效能分析
author: Rain Hu
date: '2025-10-09'
draft: false
---

# 複雜度 (Complexity)

## 時間複雜度 (Time Complexity)

時間複雜度用來衡量演算法執行所需的時間，通常使用大 O 記號 (Big O Notation) 來表示。

![complexity](https://miro.medium.com/v2/resize:fit:1358/0*sHLx8GgoVye4Ku2c.png)

### 常見的時間複雜度

- **O(1)** - 常數時間：不論輸入大小，執行時間固定
- **O(log n)** - 對數時間：如二分搜尋
- **O(n)** - 線性時間：需要遍歷所有元素一次
- **O(n log n)** - 線性對數時間：如合併排序、快速排序
- **O(n²)** - 平方時間：如冒泡排序、插入排序
- **O(2ⁿ)** - 指數時間：如遞迴計算費氏數列
- **O(n!)** - 階乘時間：如旅行推銷員問題的暴力解法

### 範例

```cpp
// O(1) - 常數時間
int getFirstElement(const vector<int>& arr) {
    return arr.empty() ? -1 : arr[0];
}

// O(n) - 線性時間
int findMax(const vector<int>& arr) {
    int maxVal = arr[0];
    for (int num : arr) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}

// O(n²) - 平方時間
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}
```

## 空間複雜度 (Space Complexity)

空間複雜度用來衡量演算法執行過程中所需的額外記憶體空間。

### 範例

```cpp
// O(1) 空間複雜度 - 只使用固定的變數
int sumArray(const vector<int>& arr) {
    int total = 0;
    for (int num : arr) {
        total += num;
    }
    return total;
}

// O(n) 空間複雜度 - 需要額外的陣列
vector<int> copyArray(const vector<int>& arr) {
    vector<int> newArr;
    for (int num : arr) {
        newArr.push_back(num);
    }
    return newArr;
}
```

### 整數溢位問題

在處理大數運算時，需要注意整數溢位 (Integer Overflow) 問題。根據前面提到的 2 的次方對應關係:

- `int` (32-bit): 約 -2e9 ~ 2e9
- `long long` (64-bit): 約 -9e18 ~ 9e18

**常見溢位情況:**

```cpp
// 範例 1: 兩數相加可能溢位
int a = 2000000000;  // 2e9
int b = 2000000000;  // 2e9
int sum = a + b;     // 溢位! 結果為負數

// 解決方法: 使用 long long
long long sum = (long long)a + b;  // 正確: 4000000000

// 範例 2: 計算階乘容易溢位
int factorial(int n) {
    long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
        // 21! 就會超過 long long 範圍
        if (result > 1e18) break;
    }
    return result;
}

// 範例 3: 平方運算溢位
int x = 100000;  // 1e5
int square = x * x;  // 溢位! 1e10 超過 int 範圍

// 解決方法
long long square = (long long)x * x;  // 正確

// 範例 4: 中點計算溢位 (常見於二分搜尋)
int left = 1000000000;
int right = 2000000000;
int mid = (left + right) / 2;  // 溢位!

// 正確寫法
int mid = left + (right - left) / 2;
```

**LeetCode 常用取模數與原因:**

在 LeetCode 中，當答案可能非常大時，題目通常會要求「回傳答案對 10⁹ + 7 取模的結果」。

```cpp
const int MOD = 1e9 + 7;  // 1000000007
```

**為什麼使用 1e9 + 7？**

1. **質數特性**: 1000000007 是質數，在模運算中有良好的數學性質
2. **適合 32 位元整數**: 小於 2³¹-1 (約 2.1e9)，可用 `int` 儲存
3. **避免溢位**: 兩個小於 1e9+7 的數相乘，結果小於 1e18，仍在 `long long` 範圍內
4. **國際慣例**: 競程常用，方便測資驗證

**取模運算技巧:**

```cpp
// 加法取模
int add(int a, int b) {
    return ((a % MOD) + (b % MOD)) % MOD;
}

// 乘法取模 (避免溢位)
int mul(int a, int b) {
    return ((long long)a * b) % MOD;
}

// 快速冪取模
long long power(long long base, int exp) {
    long long result = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % MOD;
        }
        base = (base * base) % MOD;
        exp /= 2;
    }
    return result;
}

// 範例: 計算組合數 C(n, k) mod 1e9+7
int combination(int n, int k) {
    if (k > n) return 0;
    long long numerator = 1;
    long long denominator = 1;

    for (int i = 0; i < k; i++) {
        numerator = (numerator * (n - i)) % MOD;
        denominator = (denominator * (i + 1)) % MOD;
    }

    // 使用費馬小定理計算模反元素
    return (numerator * power(denominator, MOD - 2)) % MOD;
}
```

**常見錯誤:**

```cpp
// 錯誤: 先計算再取模，可能溢位
int result = (a * b * c) % MOD;

// 正確: 每步都取模
int result = ((long long)a * b % MOD) * c % MOD;

// 錯誤: 減法可能產生負數
int result = (a - b) % MOD;

// 正確: 加上 MOD 再取模
int result = ((a - b) % MOD + MOD) % MOD;
```

## LeetCode 解題技巧：根據 Constraints 推測時間複雜度

在 LeetCode 中，每道題目都會給出 `Constraints`（限制條件），我們可以根據 `n` 的量級來推測**最優解的時間複雜度**，避免 TLE (Time Limit Exceeded)。

### 常見的 n 與時間複雜度對應表

| n 的範圍 | 建議的時間複雜度 | 可行的演算法 |
|---------|----------------|-------------|
| n ≤ 10 | O(n!) | 全排列、暴力搜尋 |
| n ≤ 20 | O(2ⁿ) | 狀態壓縮 DP、DFS + 剪枝 |
| n ≤ 100 | O(n³) | Floyd 演算法、三重迴圈 |
| n ≤ 1,000 | O(n²) | 雙重迴圈、DP |
| n ≤ 10,000 | O(n log n) | 排序、堆積、分治 |
| n ≤ 100,000 | O(n log n) | 快速排序、合併排序 |
| n ≤ 1,000,000 | O(n) | 單次遍歷、哈希表、雙指針 |
| n ≤ 10,000,000 | O(n) | 優化的線性演算法 |
| n > 10,000,000 | O(log n) 或 O(1) | 二分搜尋、數學公式 |

### 補充：2 的次方與數量級對應

在處理二進位相關問題時，了解 2 的次方對應的數量級很有幫助:

| 2 的次方 | 精確值 | 約等於 |
|---------|--------|--------|
| 2¹⁰ | 1,024 | ≈ 1e3 (10³) |
| 2²⁰ | 1,048,576 | ≈ 1e6 (10⁶) |
| 2³⁰ | 1,073,741,824 | ≈ 1e9 (10⁹) |

**32 位元整數範圍:**
- `int` 範圍: -2,147,483,648 ~ 2,147,483,647 (約 -2e9 ~ 2e9)
- `unsigned int` 範圍: 0 ~ 4,294,967,295 (約 0 ~ 4e9)

這個對應關係在以下情況特別有用:
- **位元操作**: 判斷是否會超過 32 位元
- **空間複雜度估算**: 計算陣列佔用的記憶體大小
- **整數溢位判斷**: 預估運算結果是否會超過 int 範圍

### 範例說明

```cpp
// 範例 1: Constraints: 1 <= n <= 10^5
// 建議使用 O(n) 或 O(n log n)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;  // O(n) 解法
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

// 範例 2: Constraints: 1 <= n <= 1000
// 可以使用 O(n²) 解法
int maxProfit(vector<int>& prices) {
    int n = prices.size();
    int maxProfit = 0;
    // O(n²) 在 n <= 1000 時可以接受
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            maxProfit = max(maxProfit, prices[j] - prices[i]);
        }
    }
    return maxProfit;
}
```

### 解題思路

1. **看到 Constraints，先評估時間複雜度**
   - `n <= 20` → 考慮暴力、回溯、狀態壓縮
   - `n <= 1000` → 考慮 O(n²) DP 或雙重迴圈
   - `n <= 10^5` → 必須 O(n log n) 或更優

2. **常見的優化方向**
   - 排序：O(n log n)
   - 哈希表：將 O(n²) 優化到 O(n)
   - 雙指針：將 O(n²) 優化到 O(n)
   - 二分搜尋：將 O(n) 優化到 O(log n)

3. **如果超時 (TLE)**
   - 檢查是否有不必要的重複計算
   - 考慮使用記憶化 (Memoization)
   - 嘗試更高效的資料結構

## 重點總結

- 時間複雜度關注執行時間的增長率
- 空間複雜度關注記憶體使用的增長率
- **根據 Constraints 推測最優時間複雜度，避免 TLE**
- 通常需要在時間和空間之間做出權衡
- 實際應用中，選擇合適的複雜度取決於問題的規模和限制
