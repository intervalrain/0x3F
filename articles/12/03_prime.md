---
title: 12-3. Prime - 質數
order: 3
description: 質數判定、埃拉托斯特尼篩法、質因數分解與歐拉篩法
tags:
  - Number Theory
  - Prime
  - Sieve
  - Factorization
author: Rain Hu
date: ''
draft: true
---

# 3. Prime - 質數

## 質數的定義與性質

### 定義

**質數（Prime Number）**：大於 1 的自然數，只能被 1 和自己整除。

**範例**：2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, ...

**合數（Composite Number）**：大於 1 且不是質數的自然數。

### 基本性質

1. **2 是唯一的偶質數**
2. **所有大於 2 的質數都是奇數**
3. **1 既不是質數也不是合數**
4. **質數有無窮多個**（歐幾里得證明）
5. **算術基本定理**：任何大於 1 的整數都可唯一分解為質數的乘積

### 算術基本定理（Fundamental Theorem of Arithmetic）

任何大於 1 的整數 n 都可以唯一表示為（不考慮順序）：

```
n = p₁^k₁ × p₂^k₂ × ... × pₘ^kₘ
```

其中 p₁, p₂, ..., pₘ 為質數，k₁, k₂, ..., kₘ 為正整數。

**範例**：
```
60 = 2² × 3 × 5
100 = 2² × 5²
128 = 2⁷
```

## 質數判定

### 方法 1：試除法（樸素）

檢查 2 到 n-1 是否有因數。

```cpp
bool isPrime_naive(int n) {
    if (n < 2) return false;
    for (int i = 2; i < n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
```

**時間複雜度**：O(n)
**缺點**：效率太低

### 方法 2：優化試除法（只檢查到 √n）

**關鍵觀察**：如果 n 有因數，必有一個不大於 √n。

**證明**：
假設 n = a × b，且 a ≤ b
如果 a > √n，則 b = n/a < n/√n = √n
矛盾於 a ≤ b
所以至少有一個因數 ≤ √n

```cpp
bool isPrime(int n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;  // 排除偶數

    // 只檢查奇數到 sqrt(n)
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}
```

**時間複雜度**：O(√n)
**空間複雜度**：O(1)

**優化點**：
1. 特判 2
2. 排除所有偶數
3. 只檢查奇數
4. 循環條件用 `i * i <= n` 而非 `i <= sqrt(n)`（避免浮點運算）

### 方法 3：只檢查質數因子

進一步優化：只需檢查質數因子即可。

```cpp
// 需要預先準備質數表
bool isPrime(int n, const vector<int>& primes) {
    if (n < 2) return false;
    for (int p : primes) {
        if (p * p > n) break;
        if (n % p == 0) return false;
    }
    return true;
}
```

## 埃拉托斯特尼篩法（Sieve of Eratosthenes）

### 原理

「篩去」所有合數，剩下的就是質數。

**步驟**：
1. 建立 2 到 n 的數列
2. 從最小的質數 2 開始
3. 標記 2 的所有倍數（4, 6, 8, ...）為合數
4. 找到下一個未標記的數（3），標記其所有倍數
5. 重複直到 √n

**圖解**：
```
初始：2  3  4  5  6  7  8  9  10 11 12 13 14 15
標記2: 2  3  ×  5  ×  7  ×  9  ×  11 ×  13 ×  15
標記3: 2  3  ×  5  ×  7  ×  ×  ×  11 ×  13 ×  ×
標記5: 2  3  ×  5  ×  7  ×  ×  ×  11 ×  13 ×  ×
結果： 2  3     5     7           11    13
```

### 基本實現

```cpp
vector<bool> sieve(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;

    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            // 標記 i 的所有倍數為合數
            for (int j = i * i; j <= n; j += i) {
                is_prime[j] = false;
            }
        }
    }

    return is_prime;
}

// 獲取所有質數
vector<int> getPrimes(int n) {
    vector<bool> is_prime = sieve(n);
    vector<int> primes;

    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
        }
    }

    return primes;
}
```

**關鍵優化**：
1. 從 `i * i` 開始標記（更小的倍數已被標記）
2. 只需篩到 √n

### 時間複雜度分析

**時間複雜度**：O(n log log n)

**分析**：
- 對每個質數 p，標記 n/p 個倍數
- 總操作數：n/2 + n/3 + n/5 + n/7 + ... = n × (1/2 + 1/3 + 1/5 + ...)
- 質數倒數和 ≈ log log n
- 因此複雜度為 O(n log log n)

**空間複雜度**：O(n)

### 優化：只篩奇數

偶數（除了 2）都是合數，可以只篩奇數。

```cpp
vector<int> sieveOdd(int n) {
    vector<int> primes;
    if (n >= 2) primes.push_back(2);

    vector<bool> is_prime(n/2 + 1, true);  // 只存奇數

    // i 對應的實際數字是 2*i + 1
    for (int i = 1; 2*i*(i+1) <= n/2; i++) {
        if (is_prime[i]) {
            int p = 2 * i + 1;
            primes.push_back(p);

            // 標記 p 的奇數倍數
            for (int j = 2*i*(i+1); j < is_prime.size(); j += p) {
                is_prime[j] = false;
            }
        }
    }

    // 剩餘的質數
    for (int i = (n/2)/p; i < is_prime.size(); i++) {
        if (is_prime[i]) {
            primes.push_back(2 * i + 1);
        }
    }

    return primes;
}
```

**優勢**：
- 空間減半
- 速度提升約 2 倍

## 質因數分解（Prime Factorization）

### 試除法

```cpp
vector<pair<int, int>> factorize(int n) {
    vector<pair<int, int>> factors;  // {質因數, 指數}

    // 處理因數 2
    if (n % 2 == 0) {
        int count = 0;
        while (n % 2 == 0) {
            count++;
            n /= 2;
        }
        factors.push_back({2, count});
    }

    // 處理奇數因數
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) {
            int count = 0;
            while (n % i == 0) {
                count++;
                n /= i;
            }
            factors.push_back({i, count});
        }
    }

    // n > 1 說明 n 本身是質數
    if (n > 1) {
        factors.push_back({n, 1});
    }

    return factors;
}

// 簡化版：只返回質因數（不計指數）
vector<int> primeFactors(int n) {
    vector<int> factors;

    for (int i = 2; i * i <= n; i++) {
        while (n % i == 0) {
            factors.push_back(i);
            n /= i;
        }
    }

    if (n > 1) factors.push_back(n);

    return factors;
}
```

**時間複雜度**：O(√n)
**空間複雜度**：O(log n)（質因數個數）

### 應用 1：計算因數個數

若 n = p₁^k₁ × p₂^k₂ × ... × pₘ^kₘ，則：

```
因數個數 = (k₁ + 1) × (k₂ + 1) × ... × (kₘ + 1)
```

```cpp
int countDivisors(int n) {
    auto factors = factorize(n);
    int count = 1;

    for (auto [prime, exp] : factors) {
        count *= (exp + 1);
    }

    return count;
}
```

**範例**：
```
60 = 2² × 3 × 5
因數個數 = (2+1) × (1+1) × (1+1) = 12
因數：1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60
```

### 應用 2：計算因數和

```
因數和 = (1 + p₁ + p₁² + ... + p₁^k₁) × (1 + p₂ + ... + p₂^k₂) × ...
```

利用等比數列求和公式：

```cpp
long long sumOfDivisors(int n) {
    auto factors = factorize(n);
    long long sum = 1;

    for (auto [p, k] : factors) {
        // 等比數列求和：(p^(k+1) - 1) / (p - 1)
        long long term = (pow(p, k + 1) - 1) / (p - 1);
        sum *= term;
    }

    return sum;
}
```

## 歐拉篩法（Sieve of Euler / Linear Sieve）

### 原理

埃拉托斯特尼篩法中，一個合數可能被多個質因數標記（例如 30 被 2, 3, 5 標記）。

**歐拉篩法**確保每個合數只被其**最小質因數**標記一次，達到 O(n) 時間複雜度。

### 實現

```cpp
vector<int> linearSieve(int n) {
    vector<int> primes;
    vector<bool> is_prime(n + 1, true);

    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
        }

        // 用 i 和已知質數標記合數
        for (int j = 0; j < primes.size() && i * primes[j] <= n; j++) {
            is_prime[i * primes[j]] = false;

            // 關鍵：當 primes[j] 是 i 的因數時停止
            if (i % primes[j] == 0) break;
        }
    }

    return primes;
}
```

**核心思想**：
- 每個合數 n 被其最小質因數 p 和 n/p 標記
- 當 `i % primes[j] == 0` 時，`primes[j]` 是 i 的最小質因數
- 此時停止，確保 `i * primes[j]` 只被 `primes[j]` 標記一次

### 執行過程範例

```
i=2: primes=[2], 標記 2*2=4
i=3: primes=[2,3], 標記 3*2=6, 3*3=9
i=4: primes=[2,3], 標記 4*2=8, 停止（4%2==0）
i=5: primes=[2,3,5], 標記 5*2=10, 5*3=15, 5*5=25
i=6: primes=[2,3,5], 標記 6*2=12, 停止（6%2==0）
...
```

**時間複雜度**：O(n)（每個數被標記恰好一次）
**空間複雜度**：O(n)

### 歐拉篩 vs 埃拉托斯特尼篩

| 特性 | 埃拉托斯特尼篩 | 歐拉篩 |
|------|--------------|--------|
| 時間複雜度 | O(n log log n) | O(n) |
| 空間複雜度 | O(n) | O(n) |
| 實現難度 | 簡單 | 中等 |
| 常數因子 | 小 | 較大 |
| 實際表現 | n ≤ 10⁷ 更快 | n > 10⁸ 更優 |

**建議**：
- 一般情況：使用埃拉托斯特尼篩（簡單高效）
- 極大範圍：使用歐拉篩（理論更優）

## 餘數定理（Wilson's Theorem）

**威爾遜定理**：p 為質數當且僅當：

```
(p - 1)! ≡ -1 (mod p)
```

**範例**：
```
p = 5: 4! = 24 ≡ -1 (mod 5) ✓
p = 7: 6! = 720 ≡ -1 (mod 7) ✓
```

**應用**：質數判定（但計算階乘太慢，實用性低）

## 常見陷阱與技巧

### 陷阱 1：2 的特殊性

```cpp
// 錯誤：遺漏 2
for (int i = 3; i <= n; i += 2) {
    if (isPrime(i)) primes.push_back(i);
}

// 正確：特判 2
if (n >= 2) primes.push_back(2);
for (int i = 3; i <= n; i += 2) {
    if (isPrime(i)) primes.push_back(i);
}
```

### 陷阱 2：邊界情況

```cpp
isPrime(0) = false
isPrime(1) = false
isPrime(2) = true  // 唯一的偶質數
```

### 技巧 1：區間篩法

篩 [L, R] 範圍內的質數（L, R 很大但 R-L 較小）。

```cpp
vector<bool> segmentedSieve(long long L, long long R) {
    long long limit = sqrt(R) + 1;
    vector<int> primes = sieve(limit);  // 小範圍質數

    vector<bool> is_prime(R - L + 1, true);

    for (int p : primes) {
        // 找到 >= L 的最小 p 的倍數
        long long start = max(p * p, (L + p - 1) / p * p);
        for (long long j = start; j <= R; j += p) {
            is_prime[j - L] = false;
        }
    }

    if (L == 1) is_prime[0] = false;

    return is_prime;
}
```

### 技巧 2：預處理最小質因數

```cpp
vector<int> smallest_prime_factor(int n) {
    vector<int> spf(n + 1);
    for (int i = 1; i <= n; i++) spf[i] = i;

    for (int i = 2; i * i <= n; i++) {
        if (spf[i] == i) {  // i 是質數
            for (int j = i * i; j <= n; j += i) {
                if (spf[j] == j) spf[j] = i;
            }
        }
    }

    return spf;
}

// 快速質因數分解
vector<int> factorize_fast(int n, const vector<int>& spf) {
    vector<int> factors;
    while (n > 1) {
        factors.push_back(spf[n]);
        n /= spf[n];
    }
    return factors;
}
```

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 質數判定（試除法） | O(√n) | O(1) |
| 埃拉托斯特尼篩 | O(n log log n) | O(n) |
| 歐拉篩 | O(n) | O(n) |
| 質因數分解 | O(√n) | O(log n) |
| 區間篩法 | O((R-L) × √R) | O(R-L + √R) |

## LeetCode 題目

### [204. Count Primes](https://leetcode.com/problems/count-primes/)

**題意**：計算小於 n 的質數個數。

**思路**：埃拉托斯特尼篩法。

```cpp
class Solution {
public:
    int countPrimes(int n) {
        if (n <= 2) return 0;

        vector<bool> is_prime(n, true);
        is_prime[0] = is_prime[1] = false;

        for (int i = 2; i * i < n; i++) {
            if (is_prime[i]) {
                for (int j = i * i; j < n; j += i) {
                    is_prime[j] = false;
                }
            }
        }

        return count(is_prime.begin(), is_prime.end(), true);
    }
};
```

**時間複雜度**：O(n log log n)
**空間複雜度**：O(n)

### [263. Ugly Number](https://leetcode.com/problems/ugly-number/)

**題意**：判斷一個數是否只包含質因數 2, 3, 5。

```cpp
class Solution {
public:
    bool isUgly(int n) {
        if (n <= 0) return false;

        // 除盡 2, 3, 5
        while (n % 2 == 0) n /= 2;
        while (n % 3 == 0) n /= 3;
        while (n % 5 == 0) n /= 5;

        return n == 1;
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

### [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)

**題意**：找第 n 個 Ugly Number（只含質因數 2, 3, 5）。

**思路**：動態規劃 + 三指針。

```cpp
class Solution {
public:
    int nthUglyNumber(int n) {
        vector<int> ugly(n);
        ugly[0] = 1;

        int i2 = 0, i3 = 0, i5 = 0;

        for (int i = 1; i < n; i++) {
            int next2 = ugly[i2] * 2;
            int next3 = ugly[i3] * 3;
            int next5 = ugly[i5] * 5;

            int next = min({next2, next3, next5});
            ugly[i] = next;

            // 更新指針（可能多個同時更新）
            if (next == next2) i2++;
            if (next == next3) i3++;
            if (next == next5) i5++;
        }

        return ugly[n - 1];
    }
};
```

**核心思想**：
- 每個 Ugly Number 都是由更小的 Ugly Number × 2/3/5 得到
- 維護三個指針，每次選最小值

**時間複雜度**：O(n)
**空間複雜度**：O(n)

### [650. 2 Keys Keyboard](https://leetcode.com/problems/2-keys-keyboard/)

**題意**：最少需要多少步操作，將單個字符 'A' 變成 n 個 'A'（只能複製全部和粘貼）。

**思路**：質因數分解。每個質因數 p 需要 p 步操作。

```cpp
class Solution {
public:
    int minSteps(int n) {
        int steps = 0;

        // 質因數分解
        for (int i = 2; i * i <= n; i++) {
            while (n % i == 0) {
                steps += i;
                n /= i;
            }
        }

        if (n > 1) steps += n;

        return steps;
    }
};
```

**數學原理**：
- 若 n = p（質數），需要 p 步（1 次複製 + p-1 次粘貼）
- 若 n = a × b，可以先得到 a 個 'A'，再複製 b 次
- 總步數 = 質因數之和

**範例**：
```
n = 12 = 2² × 3
步數 = 2 + 2 + 3 = 7
過程：A → AA → AAAA → AAAAAAAAA → AAAAAAAAAAAA
```

**時間複雜度**：O(√n)
**空間複雜度**：O(1)

## 總結

質數是數論的核心概念：

1. **質數判定**：試除法 O(√n)，只需檢查到 √n
2. **埃拉托斯特尼篩**：O(n log log n)，篩出所有質數
3. **歐拉篩**：O(n) 線性時間，每個合數只被標記一次
4. **質因數分解**：O(√n) 試除法，應用廣泛
5. **因數計算**：利用質因數分解，快速求因數個數和因數和
6. **實用技巧**：預處理最小質因數、區間篩法、只篩奇數

掌握質數相關算法是解決許多數論問題的關鍵！
