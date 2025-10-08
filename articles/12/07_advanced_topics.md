---
title: 12-7. 進階主題 - Möbius / Segmented Sieve (*)
order: 7
description: 莫比烏斯函數、分段篩法與米勒-拉賓素性測試（進階主題概覽）
tags:
  - Number Theory
  - Möbius
  - Segmented Sieve
  - Miller-Rabin
  - Advanced
author: Rain Hu
date: ''
draft: true
---

# 7. 進階主題 - Möbius / Segmented Sieve (**)

> **註**：本章節為進階主題，主要提供概念介紹，不深入實現細節。

## 莫比烏斯函數（Möbius Function）

### 定義

莫比烏斯函數 μ(n) 定義如下：

```
μ(n) = {
    1,           if n = 1
    0,           if n 有平方因數（如 4, 8, 9, 12, ...）
    (-1)^k,      if n = p₁p₂...pₖ（k 個不同質因數）
}
```

**範例**：
```
μ(1) = 1
μ(2) = -1     (1 個質因數)
μ(3) = -1     (1 個質因數)
μ(4) = 0      (4 = 2²，有平方因數)
μ(5) = -1     (1 個質因數)
μ(6) = 1      (6 = 2×3，2 個質因數)
μ(7) = -1     (1 個質因數)
μ(8) = 0      (8 = 2³，有平方因數)
μ(9) = 0      (9 = 3²，有平方因數)
μ(10) = 1     (10 = 2×5，2 個質因數)
```

### 計算方法

**單個數 μ(n)**：

```cpp
int mobius(int n) {
    if (n == 1) return 1;

    // 質因數分解
    int count = 0;  // 質因數個數

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            count++;
            n /= i;

            // 有平方因數
            if (n % i == 0) return 0;
        }
    }

    // n > 1 說明還有一個質因數
    if (n > 1) count++;

    // (-1)^count
    return (count % 2 == 0) ? 1 : -1;
}
```

**時間複雜度**：O(√n)

**批量計算（線性篩）**：

```cpp
vector<int> mobiusTable(int n) {
    vector<int> mu(n + 1);
    vector<int> primes;
    vector<bool> is_prime(n + 1, true);

    mu[1] = 1;

    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
            mu[i] = -1;  // 質數只有一個質因數
        }

        for (int j = 0; j < primes.size() && i * primes[j] <= n; j++) {
            int p = primes[j];
            is_prime[i * p] = false;

            if (i % p == 0) {
                mu[i * p] = 0;  // 有平方因數
                break;
            } else {
                mu[i * p] = -mu[i];  // 增加一個質因數
            }
        }
    }

    return mu;
}
```

**時間複雜度**：O(n)

### 重要性質

#### 1. 莫比烏斯反演公式

若 f(n) = Σ(d|n) g(d)，則：
```
g(n) = Σ(d|n) μ(d) × f(n/d)
```

這是莫比烏斯反演的基礎。

#### 2. 與歐拉函數的關係

```
φ(n) = Σ(d|n) μ(d) × (n/d)
```

#### 3. 求和性質

```
Σ(d|n) μ(d) = {
    1,  if n = 1
    0,  if n > 1
}
```

### 應用：容斥原理

莫比烏斯函數常用於容斥原理的計算。

**範例**：計算 [1, n] 中與 m 互質的數的個數

```cpp
long long countCoprime(long long n, long long m) {
    // 分解 m 的質因數
    vector<int> primes = getPrimeFactors(m);

    long long result = n;

    // 容斥原理
    int k = primes.size();
    for (int mask = 1; mask < (1 << k); mask++) {
        long long product = 1;
        int bits = 0;

        for (int i = 0; i < k; i++) {
            if (mask & (1 << i)) {
                product *= primes[i];
                bits++;
            }
        }

        // 容斥：奇加偶減
        if (bits % 2 == 1) {
            result -= n / product;
        } else {
            result += n / product;
        }
    }

    return result;
}
```

## 分段篩法（Segmented Sieve）

### 問題背景

標準埃拉托斯特尼篩法的空間複雜度為 O(n)。當 n 很大（如 10¹²）時，內存不足。

**分段篩法**：將大區間分成小段，逐段篩選。

### 應用場景

1. 篩選區間 [L, R] 內的質數（L, R 很大但 R - L 較小）
2. 節省空間（只需 O(√R + (R-L)) 空間）

### 基本思路

**關鍵觀察**：要篩 [L, R] 範圍的質數，只需用 ≤ √R 的質數去篩。

**步驟**：
1. 用標準篩法找出所有 ≤ √R 的質數
2. 用這些質數去標記 [L, R] 範圍內的合數
3. 剩下的就是 [L, R] 內的質數

### 實現

```cpp
vector<long long> segmentedSieve(long long L, long long R) {
    // 步驟 1：找出所有 <= sqrt(R) 的質數
    long long limit = sqrt(R) + 1;
    vector<bool> is_prime_small(limit + 1, true);
    vector<long long> primes;

    for (long long i = 2; i <= limit; i++) {
        if (is_prime_small[i]) {
            primes.push_back(i);
            for (long long j = i * i; j <= limit; j += i) {
                is_prime_small[j] = false;
            }
        }
    }

    // 步驟 2：篩 [L, R] 範圍
    vector<bool> is_prime(R - L + 1, true);

    for (long long p : primes) {
        // 找到 >= L 的最小 p 的倍數
        long long start = max(p * p, (L + p - 1) / p * p);

        for (long long j = start; j <= R; j += p) {
            is_prime[j - L] = false;
        }
    }

    // 特殊處理 1
    if (L == 1) is_prime[0] = false;

    // 步驟 3：收集質數
    vector<long long> result;
    for (long long i = L; i <= R; i++) {
        if (is_prime[i - L]) {
            result.push_back(i);
        }
    }

    return result;
}
```

### 複雜度分析

- **時間複雜度**：O(√R log log √R + (R - L) log log R)
- **空間複雜度**：O(√R + (R - L))

### 範例

篩選 [1000000, 1000100] 範圍內的質數：

```cpp
vector<long long> primes = segmentedSieve(1000000, 1000100);

// 不需要建立大小為 1000100 的數組，只需 100 + √1000100 ≈ 1100
```

## 米勒-拉賓素性測試（Miller-Rabin Primality Test）

### 問題背景

對於非常大的數（如 10¹⁸），試除法 O(√n) 太慢。

**米勒-拉賓測試**：一種概率性質數判定算法，速度快且準確率高。

### 算法原理

基於**費馬小定理**的變形。

**費馬小定理**：若 p 為質數，則對所有 a：
```
a^(p-1) ≡ 1 (mod p)
```

**米勒-拉賓擴展**：
將 p - 1 表示為 2^r × d（d 為奇數），則：
```
a^d ≡ 1 (mod p)
或
a^(2^i × d) ≡ -1 (mod p)，對某個 0 ≤ i < r
```

若存在 a 不滿足上述條件，則 p 一定是合數。

### 實現（概念版）

```cpp
// 快速冪（見前面章節）
long long powerMod(long long a, long long n, long long mod);

bool millerRabin(long long n, int k = 5) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0) return false;

    // 將 n-1 表示為 2^r × d
    long long d = n - 1;
    int r = 0;
    while (d % 2 == 0) {
        d /= 2;
        r++;
    }

    // 測試 k 次
    for (int i = 0; i < k; i++) {
        long long a = 2 + rand() % (n - 3);  // 隨機選 a ∈ [2, n-2]
        long long x = powerMod(a, d, n);

        if (x == 1 || x == n - 1) continue;

        bool composite = true;
        for (int j = 0; j < r - 1; j++) {
            x = powerMod(x, 2, n);
            if (x == n - 1) {
                composite = false;
                break;
            }
        }

        if (composite) return false;
    }

    return true;  // 可能是質數
}
```

### 確定性版本

對於特定範圍，選擇特定的 a 可以保證正確性：

| 範圍 | 測試基 |
|------|--------|
| n < 2,047 | a = 2 |
| n < 1,373,653 | a = 2, 3 |
| n < 9,080,191 | a = 31, 73 |
| n < 2⁵⁰ | a = 2, 3, 5, 7, 11, 13, 17 |

```cpp
bool isPrime_deterministic(long long n) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0) return false;

    // 測試基（適用於 n < 2^50）
    vector<long long> bases = {2, 3, 5, 7, 11, 13, 17};

    long long d = n - 1;
    int r = 0;
    while (d % 2 == 0) {
        d /= 2;
        r++;
    }

    for (long long a : bases) {
        if (a >= n) continue;

        long long x = powerMod(a, d, n);
        if (x == 1 || x == n - 1) continue;

        bool composite = true;
        for (int j = 0; j < r - 1; j++) {
            x = powerMod(x, 2, n);
            if (x == n - 1) {
                composite = false;
                break;
            }
        }

        if (composite) return false;
    }

    return true;
}
```

### 複雜度分析

- **時間複雜度**：O(k log³ n)，k 為測試次數
- **準確率**：k 次測試後，錯誤率 ≤ 4^(-k)
  - k = 5：錯誤率 < 0.1%
  - k = 10：錯誤率 < 0.0001%

### 應用場景

1. 大數質數判定（RSA 密鑰生成）
2. 競賽中的質數檢測（當 n 很大時）
3. 概率算法的基礎

## Pollard's Rho 算法

### 問題

對大數進行質因數分解（試除法太慢）。

### 基本思想

利用「生日悖論」找到非平凡因數。

**核心**：尋找兩個數 x 和 y，使得 gcd(|x - y|, n) > 1。

### 算法框架（概念）

```cpp
long long pollardRho(long long n) {
    if (n % 2 == 0) return 2;

    long long x = rand() % n;
    long long y = x;
    long long c = rand() % n;
    long long d = 1;

    // Floyd 判圈算法
    while (d == 1) {
        x = (powerMod(x, 2, n) + c) % n;
        y = (powerMod(y, 2, n) + c) % n;
        y = (powerMod(y, 2, n) + c) % n;

        d = gcd(abs(x - y), n);
    }

    return (d != n) ? d : pollardRho(n);  // 重試
}

// 完整質因數分解
void factorize(long long n, vector<long long>& factors) {
    if (n == 1) return;

    if (isPrime(n)) {  // 米勒-拉賓測試
        factors.push_back(n);
        return;
    }

    long long d = pollardRho(n);
    factorize(d, factors);
    factorize(n / d, factors);
}
```

### 複雜度

- **期望時間複雜度**：O(n^(1/4))
- 比試除法 O(√n) 快得多（對大數）

### 應用

- 分解大合數（如 RSA 破解）
- 求大數的所有因數

## 其他進階主題

### 1. 原根（Primitive Root）

**定義**：若 gcd(g, n) = 1 且 g 的階為 φ(n)，則 g 是 n 的原根。

**應用**：離散對數、密碼學

### 2. 離散對數（Discrete Logarithm）

求解 g^x ≡ h (mod p)，已知 g, h, p，求 x。

**算法**：Baby-step Giant-step，時間複雜度 O(√p)

### 3. 二次剩餘（Quadratic Residue）

求解 x² ≡ a (mod p)

**算法**：Tonelli-Shanks 算法

### 4. 連分數（Continued Fractions）

有理數逼近、Pell 方程求解

## 實戰建議

### 何時使用進階算法？

| 問題 | n 範圍 | 推薦算法 |
|------|--------|---------|
| 質數判定 | n ≤ 10⁶ | 試除法 |
| 質數判定 | 10⁶ < n ≤ 10¹² | 米勒-拉賓 |
| 篩質數 | n ≤ 10⁷ | 埃拉托斯特尼篩 |
| 篩質數 | n ≤ 10⁸ | 歐拉篩 |
| 篩質數（區間） | L, R ≤ 10¹² | 分段篩 |
| 質因數分解 | n ≤ 10⁶ | 試除法 |
| 質因數分解 | n > 10¹² | Pollard's Rho |

### 學習路徑

```
基礎數論（GCD, 質數, 模運算）
    ↓
快速冪、歐拉函數、擴展歐幾里得
    ↓
篩法優化（歐拉篩、分段篩）
    ↓
概率算法（米勒-拉賓）
    ↓
進階主題（莫比烏斯、Pollard's Rho）
```

## 總結

進階數論主題概覽：

1. **莫比烏斯函數**：
   - 用於容斥原理
   - 莫比烏斯反演
   - 線性篩 O(n) 計算

2. **分段篩法**：
   - 空間優化
   - 適用於大區間 [L, R]
   - 空間 O(√R + (R-L))

3. **米勒-拉賓測試**：
   - 概率性質數判定
   - 時間 O(k log³ n)
   - 確定性版本（特定範圍）

4. **Pollard's Rho**：
   - 大數質因數分解
   - 期望 O(n^(1/4))
   - 配合米勒-拉賓使用

5. **其他主題**：
   - 原根、離散對數
   - 二次剩餘
   - 連分數

這些進階主題在競賽和密碼學中有重要應用，建議在掌握基礎數論後逐步學習！
