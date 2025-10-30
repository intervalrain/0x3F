---
title: 12-1. 同餘性質 - Modular Arithmetic
order: 1
description: 模運算的基本性質、模反元素與大數處理技巧
tags:
  - Number Theory
  - Modular Arithmetic
  - Modular Inverse
author: Rain Hu
date: '2025-10-30'
draft: false
---

# 1. 同餘性質 - Modular Arithmetic

## 模運算基礎

### 定義

對於整數 a 和正整數 m，**a mod m** 表示 a 除以 m 的餘數。

```
a = qm + r，其中 0 ≤ r < m
則 a mod m = r
```

**範例**：
- `17 mod 5 = 2`（17 = 3 × 5 + 2）
- `23 mod 7 = 2`（23 = 3 × 7 + 2）

### 同餘的定義

若兩個整數 a 和 b 除以 m 的餘數相同，則稱 a 和 b 模 m 同餘，記作：

```
a ≡ b (mod m)
```

**等價條件**：
1. `a mod m = b mod m`
2. `m | (a - b)`（m 整除 a - b）

**範例**：
- `17 ≡ 2 (mod 5)`
- `23 ≡ 2 (mod 7)`
- `100 ≡ 0 (mod 10)`

## 同餘的基本性質

### 1. 加法性質

```
(a + b) mod m = ((a mod m) + (b mod m)) mod m
```

**證明**：
設 a = q₁m + r₁，b = q₂m + r₂
```
a + b = (q₁ + q₂)m + (r₁ + r₂)
(a + b) mod m = (r₁ + r₂) mod m
              = ((a mod m) + (b mod m)) mod m
```

**C++ 實現**：

```cpp
// 安全的加法模運算
long long addMod(long long a, long long b, long long m) {
    return ((a % m) + (b % m)) % m;
}
```

### 2. 減法性質

```
(a - b) mod m = ((a mod m) - (b mod m) + m) mod m
```

**注意**：需要加 m 確保結果非負！

**C++ 實現**：

```cpp
// 安全的減法模運算
long long subMod(long long a, long long b, long long m) {
    return ((a % m) - (b % m) + m) % m;
}
```

**常見錯誤**：

```cpp
// 錯誤：可能產生負數
int result = (a - b) % m;  // 當 a < b 時，結果可能為負

// 正確：確保非負
int result = ((a - b) % m + m) % m;
```

### 3. 乘法性質

```
(a × b) mod m = ((a mod m) × (b mod m)) mod m
```

**C++ 實現**：

```cpp
// 基本乘法模運算
long long mulMod(long long a, long long b, long long m) {
    return ((a % m) * (b % m)) % m;
}

// 防止溢位的乘法模運算（適用於超大數）
long long mulModSafe(long long a, long long b, long long m) {
    return (__int128)a * b % m;
}
```

### 4. 冪運算性質

```
(a^n) mod m = ((a mod m)^n) mod m
```

這是**快速冪**算法的理論基礎（將在後續章節詳述）。

## 大數問題與防止溢位

### 為什麼需要模運算？

在競賽和實際應用中，計算結果常常非常大，超出基本數據類型的範圍：

```cpp
// 計算 100! 的結果有 158 位數字！
// long long 只能表示約 19 位數字
```

**解決方案**：在中間步驟就取模，防止溢位。

### 常見模數

#### 1e9 + 7 = 1000000007

```cpp
const int MOD = 1e9 + 7;
```

**為什麼選這個數？**
- 是質數（方便求模反元素）
- 小於 2³¹（int 範圍內）
- 2 × MOD² 在 long long 範圍內（防止乘法溢位）

#### 998244353

```cpp
const int MOD = 998244353;
```

**特殊性質**：
- 質數
- 998244353 = 119 × 2²³ + 1
- 支持快速數論變換（NTT）

### 為什麼用質數作為模數？

1. **模反元素存在**：當 m 為質數時，任何不被 m 整除的數都有模反元素
2. **費馬小定理可用**：`a^(m-1) ≡ 1 (mod m)`
3. **數學性質良好**：避免不必要的碰撞與衝突

## 負數取模的處理

### C++ 中的陷阱

C++ 標準規定：`a % b` 的符號與 `a` 相同。

```cpp
cout << -5 % 3 << endl;   // 輸出 -2（不是 1！）
cout << 5 % -3 << endl;   // 輸出 2
cout << -5 % -3 << endl;  // 輸出 -2
```

### 標準解法：確保非負

```cpp
int safeMod(int a, int m) {
    return ((a % m) + m) % m;
}

// 範例
safeMod(-5, 3);  // 返回 1
safeMod(-8, 5);  // 返回 2
```

**原理**：
- 若 `a % m` 為負，加 m 後變為正
- 若 `a % m` 為正，加 m 後再取模，結果不變

## 模反元素（Modular Inverse）

### 定義

對於整數 a 和模數 m，若存在整數 x 使得：

```
a × x ≡ 1 (mod m)
```

則稱 x 為 a 模 m 的**模反元素**（或乘法逆元），記作 `a⁻¹ (mod m)`。

**意義**：模反元素相當於模運算中的「除法」。

```
(b / a) mod m = (b × a⁻¹) mod m
```

### 存在條件

a 的模反元素存在 **當且僅當 gcd(a, m) = 1**（a 與 m 互質）。

### 方法 1：費馬小定理（當 m 為質數）

**費馬小定理**：若 p 為質數且 gcd(a, p) = 1，則：

```
a^(p-1) ≡ 1 (mod p)
```

兩邊同除以 a：

```
a^(p-2) ≡ a⁻¹ (mod p)
```

**實現**（需要快速冪）：

```cpp
const int MOD = 1e9 + 7;

// 快速冪
long long power(long long a, long long n, long long mod) {
    long long result = 1;
    a %= mod;
    while (n > 0) {
        if (n & 1) result = result * a % mod;
        a = a * a % mod;
        n >>= 1;
    }
    return result;
}

// 費馬小定理求模反元素（m 必須是質數）
long long modInverse(long long a, long long m) {
    return power(a, m - 2, m);
}

// 使用範例
long long inv = modInverse(3, MOD);  // 3 的模反元素
long long result = 10 * inv % MOD;    // 相當於 10/3 mod MOD
```

**時間複雜度**：O(log m)

### 方法 2：擴展歐幾里得算法

適用於任何 gcd(a, m) = 1 的情況（m 不必是質數）。

詳見「擴展歐幾里得」章節。

```cpp
// 擴展歐幾里得算法
long long exGCD(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1, y = 0;
        return a;
    }
    long long g = exGCD(b, a % b, y, x);
    y -= a / b * x;
    return g;
}

// 求模反元素
long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = exGCD(a, m, x, y);
    if (g != 1) return -1;  // 不存在模反元素
    return (x % m + m) % m;
}
```

**時間複雜度**：O(log min(a, m))

## 實戰範例

### 範例 1：計算組合數 C(n, k) mod m

```cpp
const int MOD = 1e9 + 7;
const int MAXN = 1e6 + 5;

long long fact[MAXN];  // 階乘
long long inv[MAXN];   // 階乘的模反元素

// 預處理
void precompute() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++) {
        fact[i] = fact[i-1] * i % MOD;
    }

    inv[MAXN-1] = modInverse(fact[MAXN-1], MOD);
    for (int i = MAXN - 2; i >= 0; i--) {
        inv[i] = inv[i+1] * (i+1) % MOD;
    }
}

// 計算 C(n, k)
long long C(int n, int k) {
    if (k > n || k < 0) return 0;
    return fact[n] * inv[k] % MOD * inv[n-k] % MOD;
}
```

### 範例 2：計算 (a / b) mod m

```cpp
const int MOD = 1e9 + 7;

long long divide(long long a, long long b) {
    return a * modInverse(b, MOD) % MOD;
}

// 範例：計算 (100 / 3) mod MOD
long long result = divide(100, 3);
```

## 完整模運算工具類

```cpp
template<int MOD>
class ModInt {
private:
    long long val;

public:
    ModInt(long long v = 0) : val((v % MOD + MOD) % MOD) {}

    ModInt operator+(const ModInt& other) const {
        return ModInt(val + other.val);
    }

    ModInt operator-(const ModInt& other) const {
        return ModInt(val - other.val);
    }

    ModInt operator*(const ModInt& other) const {
        return ModInt(val * other.val);
    }

    ModInt operator/(const ModInt& other) const {
        return *this * other.inv();
    }

    ModInt pow(long long n) const {
        ModInt result = 1, base = *this;
        while (n > 0) {
            if (n & 1) result = result * base;
            base = base * base;
            n >>= 1;
        }
        return result;
    }

    ModInt inv() const {
        return pow(MOD - 2);  // 費馬小定理
    }

    long long value() const { return val; }
};

// 使用範例
const int MOD = 1e9 + 7;
using Mint = ModInt<MOD>;

Mint a = 100;
Mint b = 3;
Mint c = a / b;  // 自動處理模反元素
cout << c.value() << endl;
```

## 常見陷阱與技巧

### 陷阱 1：中間結果溢位

```cpp
// 錯誤：乘法可能溢位
int result = (a * b) % MOD;

// 正確：先轉為 long long
long long result = (1LL * a * b) % MOD;
```

### 陷阱 2：負數取模

```cpp
// 錯誤：可能返回負數
int result = (a - b) % MOD;

// 正確：確保非負
int result = ((a - b) % MOD + MOD) % MOD;
```

### 陷阱 3：連續取模

```cpp
// 不必要的重複取模
result = (a % MOD + b % MOD) % MOD;
result = (result % MOD + c % MOD) % MOD;

// 優化：只在最後取模（注意不要溢位）
result = (a + b + c) % MOD;
```

### 技巧 1：預處理階乘與逆元

當需要多次計算組合數時，預處理可以將單次查詢從 O(n) 降至 O(1)。

### 技巧 2：使用模板類

封裝模運算為類，使代碼更簡潔、不易出錯。

## 複雜度分析

| 操作 | 時間複雜度 | 說明 |
|------|-----------|------|
| 加法/減法/乘法 | O(1) | 基本運算 |
| 模反元素（費馬小定理） | O(log m) | 需要快速冪 |
| 模反元素（擴展歐幾里得） | O(log m) | 適用於非質數模數 |
| 預處理 n! 的逆元 | O(n) | 倒推計算 |

## LeetCode 題目

### [1492. The kth Factor of n](https://leetcode.com/problems/the-kth-factor-of-n/)

**題意**：找到 n 的第 k 個因數（按升序）。

**思路**：枚舉到 √n，收集因數對。

```cpp
class Solution {
public:
    int kthFactor(int n, int k) {
        vector<int> factors;

        // 枚舉到 sqrt(n)
        for (int i = 1; i * i <= n; i++) {
            if (n % i == 0) {
                factors.push_back(i);
                if (i != n / i) {  // 避免重複（完全平方數）
                    factors.push_back(n / i);
                }
            }
        }

        sort(factors.begin(), factors.end());

        if (k > factors.size()) return -1;
        return factors[k - 1];
    }
};
```

**時間複雜度**：O(√n + d log d)，d 為因數個數
**空間複雜度**：O(d)

### [1015. Smallest Integer Divisible by K](https://leetcode.com/problems/smallest-integer-divisible-by-k/)

**題意**：找到最小的只由 1 組成的數，使其能被 K 整除。

**思路**：利用模運算性質，逐步累加。

```cpp
class Solution {
public:
    int smallestRepunitDivByK(int k) {
        // 如果 k 是偶數或能被 5 整除，不可能有解
        if (k % 2 == 0 || k % 5 == 0) return -1;

        int remainder = 0;
        for (int length = 1; length <= k; length++) {
            remainder = (remainder * 10 + 1) % k;
            if (remainder == 0) return length;
        }

        return -1;
    }
};
```

**關鍵觀察**：
- 數字 111...1（n 個 1）= (10^(n-1) + 10^(n-2) + ... + 1)
- 逐步構建：`next = prev * 10 + 1`
- 只需追蹤餘數，不需完整數字

**時間複雜度**：O(k)
**空間複雜度**：O(1)

### [2469. Convert the Temperature](https://leetcode.com/problems/convert-the-temperature/)

**題意**：將攝氏溫度轉換為開爾文和華氏溫度。

**思路**：簡單的數學轉換（與模運算關係較小，主要練習數值計算）。

```cpp
class Solution {
public:
    vector<double> convertTemperature(double celsius) {
        double kelvin = celsius + 273.15;
        double fahrenheit = celsius * 1.8 + 32.0;
        return {kelvin, fahrenheit};
    }
};
```

**時間複雜度**：O(1)
**空間複雜度**：O(1)

## 總結

模運算是數論的基礎，掌握以下要點：

1. **基本性質**：加減乘的模運算法則
2. **負數處理**：`((a % m) + m) % m` 確保非負
3. **防止溢位**：中間步驟取模、先除後乘
4. **模反元素**：費馬小定理（質數模數）、擴展歐幾里得（一般情況）
5. **常見模數**：1e9+7、998244353
6. **實用技巧**：預處理、封裝工具類

模運算是後續章節的基礎，務必熟練掌握！
