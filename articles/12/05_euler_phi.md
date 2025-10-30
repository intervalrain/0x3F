---
title: 12-5. 歐拉函數 - Euler's Phi Function (*)
order: 5
description: 歐拉函數的定義、計算與應用（進階主題）
tags:
  - Number Theory
  - Euler Phi
  - Euler's Theorem
  - Advanced
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 5. 歐拉函數 - Euler's Phi Function (**)

> **註**：本章節為進階主題，重點在概念理解。

## 歐拉函數的定義

**歐拉函數 φ(n)**（Euler's Totient Function）表示小於或等於 n 的正整數中，與 n **互質**的數的個數。

**數學定義**：
```
φ(n) = |{x ∈ ℕ : 1 ≤ x ≤ n, gcd(x, n) = 1}|
```

**範例**：
```
φ(1) = 1    (1 與 1 互質)
φ(2) = 1    (1 與 2 互質)
φ(3) = 2    (1, 2 與 3 互質)
φ(4) = 2    (1, 3 與 4 互質)
φ(5) = 4    (1, 2, 3, 4 與 5 互質)
φ(6) = 2    (1, 5 與 6 互質)
φ(8) = 4    (1, 3, 5, 7 與 8 互質)
φ(10) = 4   (1, 3, 7, 9 與 10 互質)
```

## 基本性質

### 1. 質數的歐拉函數

若 p 是質數：
```
φ(p) = p - 1
```

**證明**：1, 2, 3, ..., p-1 都與 p 互質（p 只被 1 和自己整除）。

### 2. 質數冪的歐拉函數

若 p 是質數：
```
φ(p^k) = p^k - p^(k-1) = p^k × (1 - 1/p)
```

**證明**：
- 1 到 p^k 中，不與 p^k 互質的數是 p 的倍數
- p 的倍數有：p, 2p, 3p, ..., p^(k-1) × p，共 p^(k-1) 個
- 因此 φ(p^k) = p^k - p^(k-1)

**範例**：
```
φ(8) = φ(2³) = 2³ - 2² = 8 - 4 = 4
φ(9) = φ(3²) = 3² - 3¹ = 9 - 3 = 6
φ(25) = φ(5²) = 5² - 5¹ = 25 - 5 = 20
```

### 3. 積性函數

**重要性質**：若 gcd(a, b) = 1（a 與 b 互質），則：
```
φ(a × b) = φ(a) × φ(b)
```

這使得我們可以通過質因數分解計算 φ(n)。

## 計算公式

### 通用公式

若 n 的質因數分解為：
```
n = p₁^k₁ × p₂^k₂ × ... × pₘ^kₘ
```

則：
```
φ(n) = n × (1 - 1/p₁) × (1 - 1/p₂) × ... × (1 - 1/pₘ)
```

或等價於：
```
φ(n) = n × ∏(pᵢ - 1) / ∏pᵢ
```

**推導**：
```
φ(n) = φ(p₁^k₁) × φ(p₂^k₂) × ... × φ(pₘ^kₘ)
     = p₁^k₁(1 - 1/p₁) × p₂^k₂(1 - 1/p₂) × ... × pₘ^kₘ(1 - 1/pₘ)
     = p₁^k₁ × p₂^k₂ × ... × pₘ^kₘ × (1 - 1/p₁)(1 - 1/p₂)...(1 - 1/pₘ)
     = n × (1 - 1/p₁)(1 - 1/p₂)...(1 - 1/pₘ)
```

### 範例計算

**範例 1**：計算 φ(12)
```
12 = 2² × 3
φ(12) = 12 × (1 - 1/2) × (1 - 1/3)
      = 12 × 1/2 × 2/3
      = 4

驗證：與 12 互質的數有 1, 5, 7, 11，共 4 個 ✓
```

**範例 2**：計算 φ(60)
```
60 = 2² × 3 × 5
φ(60) = 60 × (1 - 1/2) × (1 - 1/3) × (1 - 1/5)
      = 60 × 1/2 × 2/3 × 4/5
      = 16
```

## 單個數的 φ(n) 計算

### 方法：質因數分解

```cpp
long long phi(long long n) {
    long long result = n;

    // 質因數分解
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            // i 是 n 的質因數
            while (n % i == 0) {
                n /= i;
            }
            // result *= (1 - 1/i) = result * (i-1) / i
            result = result / i * (i - 1);
        }
    }

    // n > 1 說明 n 本身是質數
    if (n > 1) {
        result = result / n * (n - 1);
    }

    return result;
}
```

**時間複雜度**：O(√n)

**關鍵點**：
- `result = result / i * (i - 1)` 而非 `result = result * (i - 1) / i`（避免浮點誤差）
- 先除後乘，防止溢位

## 批量計算：篩法

### 線性篩計算 φ(1) 到 φ(n)

```cpp
vector<long long> phiTable(int n) {
    vector<long long> phi(n + 1);
    vector<int> primes;
    vector<bool> is_prime(n + 1, true);

    phi[1] = 1;

    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
            phi[i] = i - 1;  // 質數的 φ
        }

        for (int j = 0; j < primes.size() && i * primes[j] <= n; j++) {
            int p = primes[j];
            is_prime[i * p] = false;

            if (i % p == 0) {
                // p 是 i 的因數
                phi[i * p] = phi[i] * p;
                break;
            } else {
                // p 與 i 互質
                phi[i * p] = phi[i] * (p - 1);
            }
        }
    }

    return phi;
}
```

**時間複雜度**：O(n)
**空間複雜度**：O(n)

**核心思想**：
- 利用歐拉篩的線性性質
- 根據 `i % p` 是否為 0，分兩種情況計算

## 歐拉定理（Euler's Theorem）

### 定理陳述

若 gcd(a, n) = 1（a 與 n 互質），則：
```
a^φ(n) ≡ 1 (mod n)
```

**意義**：a 的 φ(n) 次方模 n 等於 1。

### 範例

```
a = 3, n = 10
gcd(3, 10) = 1 ✓
φ(10) = 4

3⁴ = 81 ≡ 1 (mod 10) ✓
```

### 應用：簡化大指數

計算 a^k mod n 時，若 gcd(a, n) = 1：
```
a^k ≡ a^(k mod φ(n)) (mod n)
```

**範例**：計算 3^1000000 mod 10
```
φ(10) = 4
1000000 mod 4 = 0
3^1000000 ≡ 3⁰ = 1 (mod 10)

驗證：3^4 = 81 ≡ 1 (mod 10)
     (3^4)^250000 = 1^250000 = 1 ✓
```

## 費馬小定理（Fermat's Little Theorem）

### 定理陳述

費馬小定理是歐拉定理在 **n 為質數** 時的特例。

若 p 為質數且 gcd(a, p) = 1，則：
```
a^(p-1) ≡ 1 (mod p)
```

**推導**：
- 當 p 為質數時，φ(p) = p - 1
- 根據歐拉定理：a^φ(p) ≡ 1 (mod p)
- 即：a^(p-1) ≡ 1 (mod p)

### 等價形式

對於任意整數 a 和質數 p：
```
a^p ≡ a (mod p)
```

**證明**：
- 若 p | a，則兩邊都為 0
- 若 p ∤ a，則 a^(p-1) ≡ 1，兩邊乘 a 得 a^p ≡ a

### 應用：模反元素

當 p 為質數時，a 模 p 的逆元：
```
a^(-1) ≡ a^(p-2) (mod p)
```

**證明**：
```
a × a^(p-2) = a^(p-1) ≡ 1 (mod p)
```

**實現**：
```cpp
long long modInverse(long long a, long long p) {
    // p 必須是質數
    return powerMod(a, p - 2, p);
}
```

## 實用應用

### 應用 1：RSA 加密

RSA 加密的核心基於歐拉定理：
```
選擇兩個大質數 p 和 q
n = p × q
φ(n) = (p - 1)(q - 1)

加密：c = m^e mod n
解密：m = c^d mod n，其中 ed ≡ 1 (mod φ(n))
```

### 應用 2：簡化模冪運算

計算 a^b mod n，當 b 很大時：
```cpp
long long powerModLarge(long long a, long long b, long long n) {
    if (gcd(a, n) != 1) {
        // 處理不互質的情況（較複雜）
        return powerMod(a, b, n);
    }

    long long phi_n = phi(n);
    long long exp = b % phi_n;

    return powerMod(a, exp, n);
}
```

### 應用 3：循環節長度

求 1/n 的十進制循環節長度（當 gcd(10, n) = 1）：
```
循環節長度 | φ(n)
```

**範例**：
```
1/7 = 0.142857142857... (循環節長度 6)
φ(7) = 6 ✓
```

## 樸素計算（暴力枚舉）

僅用於理解與驗證，效率低。

```cpp
long long phi_naive(long long n) {
    long long count = 0;
    for (long long i = 1; i <= n; i++) {
        if (gcd(i, n) == 1) {
            count++;
        }
    }
    return count;
}
```

**時間複雜度**：O(n log n)

## 常見陷阱與技巧

### 陷阱 1：整數除法精度

```cpp
// 錯誤：浮點誤差
result = result * (1 - 1.0 / p);

// 正確：整數運算
result = result / p * (p - 1);
```

### 陷阱 2：溢位

```cpp
// 可能溢位
result = result * (p - 1) / p;

// 正確：先除後乘
result = result / p * (p - 1);
```

### 技巧 1：φ(n) 的性質

```
φ(1) = 1
φ(p) = p - 1  (p 為質數)
φ(2n) = φ(n)  (n 為奇數)
```

### 技巧 2：利用積性函數

若已知 φ(a) 和 φ(b)，且 gcd(a, b) = 1：
```cpp
long long phi_ab = phi_a * phi_b;
```

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 單個 φ(n)（質因數分解） | O(√n) | O(1) |
| 批量計算 φ(1..n)（篩法） | O(n) | O(n) |
| 樸素枚舉 | O(n log n) | O(1) |

## LeetCode 相關題目

### [858. Mirror Reflection](https://leetcode.com/problems/mirror-reflection/)

**題意**：正方形房間，光從 (0, 0) 以 45° 角射出，遇到牆壁反射，問最終到達哪個接收器。

**思路**：問題等價於找最小的 k，使得光線路徑長度為整數倍邊長。涉及互質概念。

```cpp
class Solution {
public:
    int mirrorReflection(int p, int q) {
        // 找到最小的 m, n 使得 mp = nq
        // 即找到 p 和 q 的最小公倍數

        int g = gcd(p, q);
        p /= g;
        q /= g;

        // 根據 p, q 的奇偶性判斷
        if (p % 2 == 1 && q % 2 == 1) return 1;
        if (p % 2 == 1 && q % 2 == 0) return 0;
        return 2;
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**數學分析**：
- 化簡到最簡分數（互質）
- 根據奇偶性判斷最終位置

**時間複雜度**：O(log min(p, q))
**空間複雜度**：O(1)

## 總結

歐拉函數是數論中的重要工具：

1. **定義**：φ(n) 表示 ≤ n 且與 n 互質的正整數個數
2. **計算公式**：φ(n) = n × ∏(1 - 1/pᵢ)
3. **單個計算**：O(√n) 質因數分解
4. **批量計算**：O(n) 線性篩
5. **歐拉定理**：a^φ(n) ≡ 1 (mod n)（a 與 n 互質）
6. **費馬小定理**：a^(p-1) ≡ 1 (mod p)（p 為質數）
7. **應用**：
   - 模反元素（費馬小定理）
   - RSA 加密
   - 簡化大指數模運算
   - 循環節問題

歐拉函數是理解現代密碼學和高級數論的基礎！
