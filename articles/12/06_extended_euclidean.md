---
title: 12-6. 擴展歐幾里得 - Extended Euclidean Algorithm (*)
order: 6
description: 擴展歐幾里得算法、線性同餘方程與中國餘數定理（進階主題）
tags:
  - Number Theory
  - Extended GCD
  - CRT
  - Linear Congruence
  - Advanced
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 6. 擴展歐幾里得 - Extended Euclidean Algorithm (**)

> **註**：本章節為進階主題，重點在概念理解與基本應用。

## 擴展歐幾里得算法（Extended GCD）

### 回顧：貝祖等式

**貝祖等式（Bézout's Identity）**：對於任意整數 a 和 b，存在整數 x 和 y 使得：

```
ax + by = gcd(a, b)
```

擴展歐幾里得算法就是用來**求解這個方程**的算法。

### 算法原理

**基礎情況**：當 b = 0 時
```
gcd(a, 0) = a
ax + 0y = a
```
顯然 x = 1, y = 0（y 可以是任意值）

**遞迴情況**：假設我們已經求出
```
bx₁ + (a mod b)y₁ = gcd(b, a mod b)
```

由於 `a mod b = a - ⌊a/b⌋ × b`，代入得：
```
bx₁ + (a - ⌊a/b⌋ × b)y₁ = gcd(a, b)
ay₁ + b(x₁ - ⌊a/b⌋y₁) = gcd(a, b)
```

對比 `ax + by = gcd(a, b)`，得到：
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
```

### 執行範例

求解 `12x + 18y = gcd(12, 18) = 6`

```
exGCD(12, 18)
  → exGCD(18, 12)  (swap for convenience)
    → exGCD(12, 6)
      → exGCD(6, 0)
        返回: g=6, x=1, y=0
        (6×1 + 0×0 = 6 ✓)

      回代: x=0, y=1-2×0=1
      返回: g=6, x=0, y=1
      (12×0 + 6×1 = 6 ✓)

    回代: x=1, y=0-1×1=-1
    返回: g=6, x=1, y=-1
    (18×1 + 12×(-1) = 6 ✓)

  交換回來: x=-1, y=1
  (12×(-1) + 18×1 = 6 ✓)
```

**驗證**：12 × (-1) + 18 × 1 = -12 + 18 = 6 ✓

### 解的通解

若 (x₀, y₀) 是 `ax + by = gcd(a, b)` 的一組解，則通解為：

```
x = x₀ + k × (b / gcd(a, b))
y = y₀ - k × (a / gcd(a, b))
```

其中 k 為任意整數。

**證明**：
```
a(x₀ + kb/g) + b(y₀ - ka/g) = ax₀ + by₀ + k(ab/g - ab/g) = g
```

**範例**：`12x + 18y = 6`
- 特解：x₀ = -1, y₀ = 1
- 通解：x = -1 + 3k, y = 1 - 2k（k ∈ ℤ）

```
k = 0: x = -1, y = 1   → 12×(-1) + 18×1 = 6 ✓
k = 1: x = 2, y = -1   → 12×2 + 18×(-1) = 6 ✓
k = -1: x = -4, y = 3  → 12×(-4) + 18×3 = 6 ✓
```

## 應用 1：求模反元素

### 問題

求 a 模 m 的逆元，即求 x 使得：
```
ax ≡ 1 (mod m)
```

轉化為：
```
ax + my = 1
```

**有解條件**：gcd(a, m) = 1（a 與 m 互質）

### 實現

```cpp
long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = exGCD(a, m, x, y);

    if (g != 1) {
        return -1;  // 逆元不存在
    }

    // 確保結果為正
    return (x % m + m) % m;
}
```

### 範例

求 3 模 7 的逆元：
```
3x + 7y = 1
exGCD(3, 7) → x = -2, y = 1
3×(-2) + 7×1 = 1 ✓

x = -2 ≡ 5 (mod 7)

驗證：3 × 5 = 15 ≡ 1 (mod 7) ✓
```

### 與費馬小定理的比較

| 方法 | 條件 | 時間複雜度 |
|------|------|-----------|
| 擴展歐幾里得 | gcd(a, m) = 1 | O(log m) |
| 費馬小定理 | m 為質數 | O(log m) |

**優勢**：
- 擴展歐幾里得適用於任何模數（不必是質數）
- 費馬小定理僅適用於質數模數，但實現簡單

## 應用 2：求解線性同餘方程

### 問題

求解：
```
ax ≡ b (mod m)
```

轉化為：
```
ax + my = b
```

### 有解條件

**定理**：`ax ≡ b (mod m)` 有解 **當且僅當 gcd(a, m) | b**。

### 求解步驟

1. 計算 g = gcd(a, m)
2. 檢查 g | b，若不滿足則無解
3. 方程兩邊除以 g：`(a/g)x ≡ (b/g) (mod m/g)`
4. 用擴展歐幾里得求 `(a/g)x₀ + (m/g)y₀ = 1`
5. 特解：x = x₀ × (b/g)
6. 通解：x = x₀ × (b/g) + k × (m/g)，k ∈ ℤ

### 實現

```cpp
// 求解 ax ≡ b (mod m)
// 返回最小非負整數解，若無解返回 -1
long long solveLinearCongruence(long long a, long long b, long long m) {
    long long x, y;
    long long g = exGCD(a, m, x, y);

    if (b % g != 0) {
        return -1;  // 無解
    }

    // 特解
    x = x * (b / g) % m;

    // 確保非負
    x = (x % m + m) % m;

    return x;
}

// 返回所有解（在 [0, m) 範圍內）
vector<long long> solveLinearCongruenceAll(long long a, long long b, long long m) {
    long long x, y;
    long long g = exGCD(a, m, x, y);

    if (b % g != 0) {
        return {};  // 無解
    }

    // 特解
    x = x * (b / g) % m;
    x = (x % m + m) % m;

    // 共有 g 個解
    vector<long long> solutions;
    long long step = m / g;

    for (int i = 0; i < g; i++) {
        solutions.push_back((x + i * step) % m);
    }

    return solutions;
}
```

### 範例

**範例 1**：求解 `6x ≡ 9 (mod 15)`

```
g = gcd(6, 15) = 3
9 % 3 = 0 ✓ (有解)

化簡：2x ≡ 3 (mod 5)

exGCD(2, 5) → x₀ = -2, y₀ = 1
2×(-2) + 5×1 = 1

特解：x = -2 × 3 = -6 ≡ 4 (mod 5)

在 [0, 15) 範圍內的所有解：
x = 4, 9, 14 (共 3 個，等於 gcd)

驗證：
6×4 = 24 ≡ 9 (mod 15) ✓
6×9 = 54 ≡ 9 (mod 15) ✓
6×14 = 84 ≡ 9 (mod 15) ✓
```

**範例 2**：求解 `4x ≡ 6 (mod 10)`

```
g = gcd(4, 10) = 2
6 % 2 = 0 ✓ (有解)

化簡：2x ≡ 3 (mod 5)

exGCD(2, 5) → x₀ = -2
特解：x = -2 × 3 = -6 ≡ 4 (mod 5)

在 [0, 10) 範圍內：x = 4, 9

驗證：
4×4 = 16 ≡ 6 (mod 10) ✓
4×9 = 36 ≡ 6 (mod 10) ✓
```

## 中國餘數定理（Chinese Remainder Theorem, CRT）

### 問題

求解同餘方程組：
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₙ (mod mₙ)
```

### 條件

模數兩兩互質：gcd(mᵢ, mⱼ) = 1（i ≠ j）

### 定理

若 m₁, m₂, ..., mₙ 兩兩互質，則方程組有唯一解（模 M = m₁m₂...mₙ）：

```
x ≡ a₁M₁y₁ + a₂M₂y₂ + ... + aₙMₙyₙ (mod M)
```

其中：
- M = m₁ × m₂ × ... × mₙ
- Mᵢ = M / mᵢ
- yᵢ 滿足 Mᵢyᵢ ≡ 1 (mod mᵢ)（Mᵢ 的模 mᵢ 逆元）

### 實現

```cpp
// 求解中國餘數定理
// a: 餘數數組，m: 模數數組
// 返回最小非負整數解，若無解返回 -1
long long CRT(vector<long long> a, vector<long long> m) {
    int n = a.size();

    // 計算 M
    long long M = 1;
    for (int i = 0; i < n; i++) {
        M *= m[i];
    }

    long long result = 0;

    for (int i = 0; i < n; i++) {
        long long Mi = M / m[i];

        // 求 Mi 的模 m[i] 逆元
        long long yi = modInverse(Mi, m[i]);

        if (yi == -1) {
            return -1;  // 理論上不會發生（模數互質）
        }

        result = (result + a[i] * Mi % M * yi % M) % M;
    }

    return (result % M + M) % M;
}
```

### 範例

求解：
```
x ≡ 2 (mod 3)
x ≡ 3 (mod 5)
x ≡ 2 (mod 7)
```

**步驟**：

1. M = 3 × 5 × 7 = 105

2. 計算 Mᵢ 和 yᵢ：
   ```
   M₁ = 105/3 = 35
   M₁y₁ ≡ 1 (mod 3) → 35y₁ ≡ 1 (mod 3) → 2y₁ ≡ 1 (mod 3) → y₁ = 2

   M₂ = 105/5 = 21
   M₂y₂ ≡ 1 (mod 5) → 21y₂ ≡ 1 (mod 5) → 1y₂ ≡ 1 (mod 5) → y₂ = 1

   M₃ = 105/7 = 15
   M₃y₃ ≡ 1 (mod 7) → 15y₃ ≡ 1 (mod 7) → 1y₃ ≡ 1 (mod 7) → y₃ = 1
   ```

3. 計算解：
   ```
   x = 2×35×2 + 3×21×1 + 2×15×1
     = 140 + 63 + 30
     = 233
     ≡ 23 (mod 105)
   ```

**驗證**：
```
23 ÷ 3 = 7 ... 2 ✓
23 ÷ 5 = 4 ... 3 ✓
23 ÷ 7 = 3 ... 2 ✓
```

### 擴展 CRT（模數不互質）

當模數不兩兩互質時，需要使用擴展中國餘數定理（較複雜，不在本章範圍）。

**基本思路**：
1. 兩兩合併方程
2. 對於 `x ≡ a₁ (mod m₁)` 和 `x ≡ a₂ (mod m₂)`
3. 轉化為 `m₁k + a₁ = m₂j + a₂`
4. 用擴展歐幾里得求解

## 應用場景

### 1. 密碼學：RSA 算法

RSA 解密過程需要求模反元素：
```
ed ≡ 1 (mod φ(n))
```
用擴展歐幾里得求 d。

### 2. 組合數學：計算大組合數

計算 C(n, k) mod m（m 不是質數）：
- 分解 m = p₁^k₁ × p₂^k₂ × ...
- 分別計算 C(n, k) mod pᵢ^kᵢ
- 用 CRT 合併結果

### 3. 日期問題

求滿足多個週期條件的最小時刻：
```
x ≡ 1 (mod 7)  (星期一)
x ≡ 0 (mod 4)  (季度開始)
x ≡ 5 (mod 12) (6月)
```

## 常見陷阱與技巧

### 陷阱 1：解可能是負數

```cpp
// 錯誤：可能返回負數
return x;

// 正確：確保非負
return (x % m + m) % m;
```

### 陷阱 2：溢位

在 CRT 中，`a[i] * Mi * yi` 可能溢位：

```cpp
// 分步取模
result = (result + a[i] * Mi % M * yi % M) % M;

// 或使用 __int128
result = (result + (__int128)a[i] * Mi % M * yi % M) % M;
```

### 技巧 1：檢查互質

```cpp
bool checkCoprime(vector<long long>& m) {
    for (int i = 0; i < m.size(); i++) {
        for (int j = i + 1; j < m.size(); j++) {
            if (gcd(m[i], m[j]) != 1) {
                return false;
            }
        }
    }
    return true;
}
```

### 技巧 2：快速冪求逆元

對於質數模數，費馬小定理更快：
```cpp
// 擴展歐幾里得：O(log m)
long long inv1 = modInverse_exgcd(a, p);

// 費馬小定理：O(log p)，但常數更小
long long inv2 = powerMod(a, p - 2, p);
```

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 擴展歐幾里得 | O(log min(a, b)) | O(log min(a, b)) 遞迴 |
| 求模反元素 | O(log m) | O(log m) |
| 線性同餘方程 | O(log m) | O(1) |
| CRT（n 個方程） | O(n log M) | O(1) |

## LeetCode 相關題目

### [365. Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)

**題意**：有兩個水壺（容量 x 和 y），能否量出目標水量 target？

**思路**：根據貝祖等式，能量出的水量是 gcd(x, y) 的倍數。

```cpp
class Solution {
public:
    bool canMeasureWater(int x, int y, int target) {
        if (x + y < target) return false;
        if (x == target || y == target || x + y == target) return true;

        // 根據貝祖等式
        return target % gcd(x, y) == 0;
    }

private:
    int gcd(int a, int b) {
        return b ? gcd(b, a % b) : a;
    }
};
```

**數學原理**：
- 通過填水、倒水、轉移水等操作
- 能得到的水量形式為 `ax + by`（a, b 為整數）
- 根據貝祖等式，這些水量恰好是 gcd(x, y) 的倍數

**時間複雜度**：O(log min(x, y))
**空間複雜度**：O(1)

## 總結

擴展歐幾里得算法是數論的強大工具：

1. **核心功能**：求解 `ax + by = gcd(a, b)`
2. **時間複雜度**：O(log min(a, b))
3. **主要應用**：
   - 求模反元素（任意模數）
   - 線性同餘方程：`ax ≡ b (mod m)`
   - 中國餘數定理（CRT）
   - RSA 加密解密

4. **關鍵概念**：
   - 貝祖等式保證解的存在性
   - 通解形式：x = x₀ + kt
   - CRT 要求模數兩兩互質

5. **實用技巧**：
   - 確保結果非負
   - 注意溢位處理
   - 質數模數可用費馬小定理

擴展歐幾里得是解決高級數論問題的關鍵技術！
