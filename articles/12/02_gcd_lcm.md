---
title: 12-2. GCD/LCM - 最大公因數與最小公倍數
order: 2
description: 輾轉相除法、擴展歐幾里得算法與貝祖等式
tags:
  - Number Theory
  - GCD
  - LCM
  - Euclidean Algorithm
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 2. GCD/LCM - 最大公因數與最小公倍數

## 最大公因數（GCD）

### 定義

兩個整數 a 和 b 的**最大公因數**（Greatest Common Divisor）是能同時整除 a 和 b 的最大正整數，記作 `gcd(a, b)`。

**範例**：
- gcd(12, 18) = 6
- gcd(15, 25) = 5
- gcd(7, 13) = 1（互質）

### 基本性質

1. **交換律**：gcd(a, b) = gcd(b, a)
2. **結合律**：gcd(a, gcd(b, c)) = gcd(gcd(a, b), c)
3. **與 0 的關係**：gcd(a, 0) = a
4. **倍數性質**：gcd(ka, kb) = k × gcd(a, b)
5. **模運算性質**：gcd(a, b) = gcd(b, a mod b)（歐幾里得算法的核心）

### 樸素方法：枚舉法

從 min(a, b) 開始向下枚舉，找到第一個能同時整除 a 和 b 的數。

```cpp
int gcd_naive(int a, int b) {
    int min_val = min(a, b);
    for (int i = min_val; i >= 1; i--) {
        if (a % i == 0 && b % i == 0) {
            return i;
        }
    }
    return 1;
}
```

**時間複雜度**：O(min(a, b))
**缺點**：效率太低，不實用

## 輾轉相除法（Euclidean Algorithm）

### 核心定理

```
gcd(a, b) = gcd(b, a mod b)
```

**證明**：
設 d = gcd(a, b)，則 d | a 且 d | b

由於 `a = qb + r`（其中 r = a mod b），可得：
```
r = a - qb
```

因為 d | a 且 d | b，所以 d | (a - qb)，即 d | r

反之，設 d' = gcd(b, r)，則 d' | b 且 d' | r
```
a = qb + r
```
因為 d' | b 且 d' | r，所以 d' | a

因此 gcd(a, b) = gcd(b, r) = gcd(b, a mod b)

### 遞迴實現

```cpp
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// 或使用三元運算符
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}
```

**執行過程範例**：
```
gcd(48, 18)
= gcd(18, 48 % 18)
= gcd(18, 12)
= gcd(12, 18 % 12)
= gcd(12, 6)
= gcd(6, 12 % 6)
= gcd(6, 0)
= 6
```

### 迭代實現

```cpp
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 或使用 swap
int gcd(int a, int b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}
```

### C++ 標準庫

```cpp
#include <numeric>

// C++17
int g = std::gcd(a, b);

// GCC 編譯器內建
int g = __gcd(a, b);
```

### 時間複雜度分析

**定理（Lamé's Theorem）**：輾轉相除法的迭代次數不超過較小數的位數的 5 倍。

更精確地，時間複雜度為 **O(log min(a, b))**。

**證明思路**：
每兩次迭代，較大的數至少減半：
- 若 b ≤ a/2，則 a mod b < a/2
- 若 b > a/2，則 a mod b = a - b < a/2

因此迭代次數為 O(log min(a, b))。

## 最小公倍數（LCM）

### 定義

兩個整數 a 和 b 的**最小公倍數**（Least Common Multiple）是能同時被 a 和 b 整除的最小正整數，記作 `lcm(a, b)`。

**範例**：
- lcm(12, 18) = 36
- lcm(4, 6) = 12
- lcm(7, 5) = 35

### 與 GCD 的關係

**重要公式**：
```
lcm(a, b) × gcd(a, b) = a × b
```

因此：
```
lcm(a, b) = (a × b) / gcd(a, b)
```

**證明思路**：
設 a = p₁^a₁ × p₂^a₂ × ... × pₙ^aₙ
設 b = p₁^b₁ × p₂^b₂ × ... × pₙ^bₙ

則：
```
gcd(a, b) = p₁^min(a₁,b₁) × p₂^min(a₂,b₂) × ... × pₙ^min(aₙ,bₙ)
lcm(a, b) = p₁^max(a₁,b₁) × p₂^max(a₂,b₂) × ... × pₙ^max(aₙ,bₙ)
```

因為 min(x, y) + max(x, y) = x + y，所以：
```
gcd(a, b) × lcm(a, b) = a × b
```

### 實現（防止溢位）

```cpp
// 錯誤：可能溢位
long long lcm_wrong(long long a, long long b) {
    return a * b / gcd(a, b);
}

// 正確：先除後乘
long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;
}

// C++17 標準庫
#include <numeric>
long long l = std::lcm(a, b);
```

**為什麼先除後乘？**
- `a * b` 可能溢位
- `a / gcd(a, b)` 一定是整數（gcd 整除 a）
- `(a / gcd(a, b)) * b` 不易溢位

## 擴展歐幾里得算法（Extended Euclidean Algorithm）

### 目標

求解方程：
```
ax + by = gcd(a, b)
```

找到整數解 x 和 y。

### 貝祖等式（Bézout's Identity）

**定理**：對於任意整數 a 和 b，存在整數 x 和 y 使得：
```
ax + by = gcd(a, b)
```

擴展歐幾里得算法就是用來求解這個方程的。

### 算法原理

**遞迴基礎**：
當 b = 0 時，gcd(a, 0) = a
```
ax + 0y = a
```
顯然 x = 1, y = 0

**遞迴步驟**：
假設我們已經求出：
```
bx₁ + (a mod b)y₁ = gcd(b, a mod b)
```

因為 `a mod b = a - ⌊a/b⌋ × b`，代入得：
```
bx₁ + (a - ⌊a/b⌋ × b)y₁ = gcd(a, b)
ay₁ + b(x₁ - ⌊a/b⌋y₁) = gcd(a, b)
```

對比 `ax + by = gcd(a, b)`，得：
```
x = y₁
y = x₁ - ⌊a/b⌋y₁
```

### 實現

```cpp
// 返回 gcd(a, b)，並求出 x, y 使得 ax + by = gcd(a, b)
long long exGCD(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }

    long long x1, y1;
    long long g = exGCD(b, a % b, x1, y1);

    x = y1;
    y = x1 - (a / b) * y1;

    return g;
}

// 使用範例
long long x, y;
long long g = exGCD(12, 18, x, y);
// g = 6, 12*x + 18*y = 6
// 一組解：x = -1, y = 1 (12*(-1) + 18*1 = 6)
```

**驗證**：
```
12 × (-1) + 18 × 1 = -12 + 18 = 6 ✓
```

### 執行過程範例

求解 `12x + 18y = gcd(12, 18)`：

```
exGCD(12, 18)
  → exGCD(18, 12)
    → exGCD(12, 6)
      → exGCD(6, 0)
        返回: g=6, x=1, y=0

      回代: x=0, y=1-(12/6)*0=1
      返回: g=6, x=0, y=1

    回代: x=1, y=0-(18/12)*1=-1
    返回: g=6, x=1, y=-1

  回代: x=-1, y=1-(12/18)*(-1)=1
  返回: g=6, x=-1, y=1
```

結果：12×(-1) + 18×1 = 6

### 應用 1：求模反元素

求 a 模 m 的逆元，即求 x 使得：
```
ax ≡ 1 (mod m)
```

轉化為：
```
ax + my = 1
```

有解條件：gcd(a, m) = 1

```cpp
long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = exGCD(a, m, x, y);

    if (g != 1) return -1;  // 逆元不存在

    return (x % m + m) % m;  // 確保非負
}

// 使用範例
long long inv = modInverse(3, 7);
// 3 * inv ≡ 1 (mod 7)
// inv = 5 (因為 3 * 5 = 15 ≡ 1 (mod 7))
```

### 應用 2：求解線性同餘方程

求解：
```
ax ≡ b (mod m)
```

轉化為：
```
ax + my = b
```

**有解條件**：gcd(a, m) | b

```cpp
bool solveLinearCongruence(long long a, long long b, long long m,
                           long long &x) {
    long long x0, y0;
    long long g = exGCD(a, m, x0, y0);

    if (b % g != 0) return false;  // 無解

    // 特解
    x = x0 * (b / g) % m;
    x = (x % m + m) % m;

    // 通解：x = x + k * (m / g)，k 為任意整數
    return true;
}
```

## 多個數的 GCD/LCM

### 多個數的 GCD

```cpp
// 遞迴計算
int gcd_multiple(vector<int>& nums) {
    int result = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        result = gcd(result, nums[i]);
        if (result == 1) break;  // 提前終止
    }
    return result;
}

// 使用 accumulate
#include <numeric>
int g = accumulate(nums.begin(), nums.end(), 0, gcd<int, int>);
```

### 多個數的 LCM

```cpp
long long lcm_multiple(vector<long long>& nums) {
    long long result = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        result = lcm(result, nums[i]);
        // 注意：可能會溢位
    }
    return result;
}
```

**注意**：LCM 增長很快，容易溢位！

## 常見陷阱與技巧

### 陷阱 1：LCM 溢位

```cpp
// 錯誤
int lcm = a * b / gcd(a, b);

// 正確：先除後乘
long long lcm = a / gcd(a, b) * b;
```

### 陷阱 2：負數處理

```cpp
// GCD 的絕對值版本
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : abs(a);
}
```

### 陷阱 3：邊界情況

```cpp
gcd(0, a) = a
gcd(a, a) = a
gcd(1, a) = 1
```

### 技巧 1：判斷互質

```cpp
bool isCoprime(int a, int b) {
    return gcd(a, b) == 1;
}
```

### 技巧 2：化簡分數

```cpp
void simplifyFraction(int &numerator, int &denominator) {
    int g = gcd(numerator, denominator);
    numerator /= g;
    denominator /= g;
}
```

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 輾轉相除法（GCD） | O(log min(a, b)) | O(1) 迭代 / O(log n) 遞迴 |
| LCM | O(log min(a, b)) | O(1) |
| 擴展歐幾里得 | O(log min(a, b)) | O(log n) |
| n 個數的 GCD | O(n log max(nums)) | O(1) |

## LeetCode 題目

### [1071. Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/)

**題意**：找兩個字符串的「最大公因字符串」。

**思路**：如果存在 GCD 字符串，則 `str1 + str2 == str2 + str1`，且長度為 `gcd(len1, len2)`。

```cpp
class Solution {
public:
    string gcdOfStrings(string str1, string str2) {
        // 檢查是否存在 GCD 字符串
        if (str1 + str2 != str2 + str1) {
            return "";
        }

        // GCD 字符串的長度是兩字符串長度的 GCD
        int len = gcd(str1.length(), str2.length());
        return str1.substr(0, len);
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**時間複雜度**：O(n + m + log(min(n, m)))
**空間複雜度**：O(n + m)（字符串拼接）

### [1979. Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array/)

**題意**：找數組中最大值和最小值的 GCD。

```cpp
class Solution {
public:
    int findGCD(vector<int>& nums) {
        int minVal = *min_element(nums.begin(), nums.end());
        int maxVal = *max_element(nums.begin(), nums.end());
        return gcd(minVal, maxVal);
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**時間複雜度**：O(n + log(max))
**空間複雜度**：O(1)

### [914. X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/)

**題意**：判斷能否將牌分成若干組，每組至少 2 張且相同數字。

**思路**：所有數字的出現次數的 GCD ≥ 2。

```cpp
class Solution {
public:
    bool hasGroupsSizeX(vector<int>& deck) {
        unordered_map<int, int> count;
        for (int card : deck) {
            count[card]++;
        }

        int g = 0;
        for (auto& [card, cnt] : count) {
            g = gcd(g, cnt);
        }

        return g >= 2;
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**關鍵觀察**：gcd(0, a) = a，所以初始化為 0 沒問題。

**時間複雜度**：O(n log n)
**空間複雜度**：O(n)

### [365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)

**題意**：有兩個水壺（容量 x 和 y），能否量出目標水量 target？

**思路**：根據貝祖等式，能量出的水量是 gcd(x, y) 的倍數。

```cpp
class Solution {
public:
    bool canMeasureWater(int x, int y, int target) {
        // 總容量不夠
        if (x + y < target) return false;

        // 特殊情況
        if (x == target || y == target || x + y == target) {
            return true;
        }

        // 根據貝祖等式：能量出的水量必須是 gcd(x, y) 的倍數
        return target % gcd(x, y) == 0;
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**數學原理**：
- 通過填水、倒水、倒入另一個壺等操作
- 能得到的水量形式為：`ax + by`（a, b 為整數）
- 根據貝祖等式，能得到所有 gcd(x, y) 的倍數
- 因此條件是：target ≤ x + y 且 gcd(x, y) | target

**時間複雜度**：O(log(min(x, y)))
**空間複雜度**：O(1)

## 總結

GCD/LCM 是數論的核心工具：

1. **輾轉相除法**：O(log n) 求 GCD，效率極高
2. **LCM 公式**：`lcm(a, b) = a / gcd(a, b) * b`（先除後乘防溢位）
3. **擴展歐幾里得**：求解線性同餘方程、模反元素
4. **貝祖等式**：`ax + by = gcd(a, b)` 一定有整數解
5. **應用場景**：分數化簡、週期問題、組合數學

掌握 GCD/LCM 是學習後續數論主題的基礎！
