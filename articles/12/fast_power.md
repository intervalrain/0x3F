---
title: "快速冪 - Modular Exponentiation"
order: 4
description: "快速冪算法、模快速冪與矩陣快速冪的原理與應用"
tags: ["Number Theory", "Fast Power", "Binary Exponentiation", "Matrix"]
---

# 4. 快速冪 - Modular Exponentiation

## 問題引入

**基礎問題**：計算 a^n（a 的 n 次方）

**樸素方法**：
```cpp
long long power_naive(long long a, int n) {
    long long result = 1;
    for (int i = 0; i < n; i++) {
        result *= a;
    }
    return result;
}
```

**時間複雜度**：O(n)
**問題**：
- n 很大時（如 10^9），太慢
- 結果容易溢位

**解決方案**：快速冪算法（Binary Exponentiation）

## 快速冪原理

### 分治思想

**核心觀察**：
```
a^n = {
    (a^(n/2))² × a,     if n is odd
    (a^(n/2))²,         if n is even
}
```

**範例**：計算 3^13
```
3^13 = 3^6 × 3^6 × 3
     = (3^3)² × (3^3)² × 3
     = ((3^1 × 3^1 × 3)²)² × ((3^1 × 3^1 × 3)²)² × 3
```

只需 6 次乘法（而非 12 次）！

### 二進制表示法

將指數用二進制表示：
```
13 = 1101₂ = 2³ + 2² + 2⁰ = 8 + 4 + 1
```

因此：
```
3^13 = 3^8 × 3^4 × 3^1
```

**通用公式**：
```
a^n = a^(b₀×2⁰) × a^(b₁×2¹) × a^(b₂×2²) × ...
```
其中 b₀, b₁, b₂, ... 是 n 的二進制位。

## 遞迴實現

```cpp
long long power(long long a, long long n) {
    if (n == 0) return 1;

    long long half = power(a, n / 2);

    if (n % 2 == 0) {
        return half * half;
    } else {
        return half * half * a;
    }
}
```

**優化版本**：
```cpp
long long power(long long a, long long n) {
    if (n == 0) return 1;
    if (n == 1) return a;

    if (n % 2 == 0) {
        long long half = power(a, n / 2);
        return half * half;
    } else {
        return a * power(a, n - 1);
    }
}
```

**時間複雜度**：O(log n)
**空間複雜度**：O(log n)（遞迴棧）

## 迭代實現（推薦）

### 基本版本

```cpp
long long power(long long a, long long n) {
    long long result = 1;

    while (n > 0) {
        if (n % 2 == 1) {  // n 是奇數
            result *= a;
        }
        a *= a;   // a 平方
        n /= 2;   // n 減半
    }

    return result;
}
```

### 位運算優化版本

```cpp
long long power(long long a, long long n) {
    long long result = 1;

    while (n > 0) {
        if (n & 1) {       // 檢查最低位
            result *= a;
        }
        a *= a;
        n >>= 1;           // 右移一位
    }

    return result;
}
```

**執行過程範例**（計算 3^13）：
```
n = 13 = 1101₂
初始：result = 1, a = 3

n = 1101₂ (13): n&1 = 1 → result = 1×3 = 3,   a = 3² = 9,   n = 110₂
n = 110₂  (6):  n&1 = 0 → result = 3,         a = 9² = 81,  n = 11₂
n = 11₂   (3):  n&1 = 1 → result = 3×81 = 243, a = 81² = 6561, n = 1₂
n = 1₂    (1):  n&1 = 1 → result = 243×6561 = 1594323, a = ..., n = 0

結果：3^13 = 1594323
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

## 模快速冪（Modular Exponentiation）

### 問題

計算 (a^n) mod m

**直接計算的問題**：
- a^n 可能非常大（超出 long long）
- 需要在計算過程中就取模

### 實現

```cpp
long long powerMod(long long a, long long n, long long mod) {
    long long result = 1;
    a %= mod;  // 預先取模

    while (n > 0) {
        if (n & 1) {
            result = result * a % mod;
        }
        a = a * a % mod;
        n >>= 1;
    }

    return result;
}
```

**關鍵點**：
1. 每次乘法後立即取模
2. 預先對 a 取模
3. 確保中間結果不溢位

### 處理負指數

計算 a^(-n) mod m = (a^(-1))^n mod m

需要先求模反元素：
```cpp
long long powerModNeg(long long a, long long n, long long mod) {
    if (n >= 0) return powerMod(a, n, mod);

    // 負指數：先求模反元素
    long long inv = powerMod(a, mod - 2, mod);  // 費馬小定理
    return powerMod(inv, -n, mod);
}
```

### 防止乘法溢位

當 a 和 mod 很大時，`a * a` 可能溢位。

**方法 1**：使用 __int128
```cpp
long long mulMod(long long a, long long b, long long mod) {
    return (__int128)a * b % mod;
}

long long powerMod(long long a, long long n, long long mod) {
    long long result = 1;
    a %= mod;

    while (n > 0) {
        if (n & 1) {
            result = mulMod(result, a, mod);
        }
        a = mulMod(a, a, mod);
        n >>= 1;
    }

    return result;
}
```

**方法 2**：快速乘（類似快速冪）
```cpp
long long mulMod(long long a, long long b, long long mod) {
    long long result = 0;
    a %= mod;

    while (b > 0) {
        if (b & 1) {
            result = (result + a) % mod;
        }
        a = (a + a) % mod;
        b >>= 1;
    }

    return result;
}
```

## 矩陣快速冪

### 問題引入：Fibonacci 數列

**定義**：
```
F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2)
```

**樸素遞迴**：O(2^n)，太慢
**動態規劃**：O(n)，但 n = 10^18 時仍太慢

**目標**：O(log n) 時間計算 F(n)

### 矩陣形式

觀察到：
```
[F(n+1)]   [1  1] [F(n)  ]
[F(n)  ] = [1  0] [F(n-1)]
```

因此：
```
[F(n+1)]   [1  1]ⁿ [F(1)]   [1  1]ⁿ [1]
[F(n)  ] = [1  0]  [F(0)] = [1  0]  [0]
```

只需計算矩陣的 n 次方！

### 矩陣乘法

```cpp
struct Matrix {
    long long mat[2][2];
    int n;

    Matrix(int _n = 2) : n(_n) {
        memset(mat, 0, sizeof(mat));
    }

    Matrix operator*(const Matrix& other) const {
        Matrix result(n);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < n; k++) {
                    result.mat[i][j] += mat[i][k] * other.mat[k][j];
                }
            }
        }
        return result;
    }
};
```

### 矩陣快速冪

```cpp
Matrix matrixPower(Matrix a, long long n) {
    Matrix result(a.n);
    // 單位矩陣
    for (int i = 0; i < a.n; i++) {
        result.mat[i][i] = 1;
    }

    while (n > 0) {
        if (n & 1) {
            result = result * a;
        }
        a = a * a;
        n >>= 1;
    }

    return result;
}
```

### Fibonacci 數列實現

```cpp
long long fibonacci(long long n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    Matrix base(2);
    base.mat[0][0] = base.mat[0][1] = base.mat[1][0] = 1;
    base.mat[1][1] = 0;

    Matrix result = matrixPower(base, n);

    return result.mat[1][0];  // F(n)
}
```

### 帶模數的矩陣快速冪

```cpp
const long long MOD = 1e9 + 7;

struct Matrix {
    long long mat[2][2];

    Matrix operator*(const Matrix& other) const {
        Matrix result;
        memset(result.mat, 0, sizeof(result.mat));

        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    result.mat[i][j] += mat[i][k] * other.mat[k][j] % MOD;
                    result.mat[i][j] %= MOD;
                }
            }
        }
        return result;
    }
};

long long fibonacciMod(long long n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    Matrix base;
    base.mat[0][0] = base.mat[0][1] = base.mat[1][0] = 1;
    base.mat[1][1] = 0;

    Matrix result;
    result.mat[0][0] = result.mat[1][1] = 1;
    result.mat[0][1] = result.mat[1][0] = 0;

    while (n > 0) {
        if (n & 1) result = result * base;
        base = base * base;
        n >>= 1;
    }

    return result.mat[1][0];
}
```

## 應用場景

### 1. 大數冪運算

計算 2^1000000 mod 1000000007

```cpp
long long result = powerMod(2, 1000000, 1000000007);
```

### 2. 模反元素（費馬小定理）

當 p 為質數時，a^(-1) ≡ a^(p-2) (mod p)

```cpp
long long modInverse(long long a, long long p) {
    return powerMod(a, p - 2, p);
}
```

### 3. 遞推數列的第 n 項

如 Fibonacci、Tribonacci 等線性遞推數列。

### 4. 圖論：路徑計數

計算圖中長度為 k 的路徑數（鄰接矩陣的 k 次方）。

## 常見陷阱與技巧

### 陷阱 1：溢位問題

```cpp
// 錯誤：可能溢位
long long result = a * a % mod;

// 正確：使用 __int128
long long result = (__int128)a * a % mod;
```

### 陷阱 2：負數取模

```cpp
// 錯誤：可能產生負數
a %= mod;

// 正確：確保非負
a = ((a % mod) + mod) % mod;
```

### 陷阱 3：指數為 0

```cpp
power(a, 0) = 1  // 任何數的 0 次方都是 1（包括 0⁰ = 1）
```

### 技巧 1：預處理小冪次

```cpp
const int MAXN = 100;
long long pow2[MAXN];

void precompute() {
    pow2[0] = 1;
    for (int i = 1; i < MAXN; i++) {
        pow2[i] = pow2[i-1] * 2 % MOD;
    }
}
```

### 技巧 2：組合使用

計算 (a^b)^c mod m = a^(bc) mod m（小心 bc 溢位）

```cpp
long long b_mod = b % (mod - 1);  // 費馬小定理
long long exp = b_mod * c % (mod - 1);
long long result = powerMod(a, exp, mod);
```

## 複雜度分析

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 快速冪（遞迴） | O(log n) | O(log n) |
| 快速冪（迭代） | O(log n) | O(1) |
| 模快速冪 | O(log n) | O(1) |
| 矩陣快速冪（k×k 矩陣） | O(k³ log n) | O(k²) |
| Fibonacci（矩陣） | O(log n) | O(1) |

## LeetCode 題目

### [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)

**題意**：計算 x^n（x 為浮點數，n 為整數）。

```cpp
class Solution {
public:
    double myPow(double x, int n) {
        long long N = n;  // 防止 -n 溢位（當 n = -2³¹）

        if (N < 0) {
            x = 1 / x;
            N = -N;
        }

        double result = 1;
        double base = x;

        while (N > 0) {
            if (N & 1) {
                result *= base;
            }
            base *= base;
            N >>= 1;
        }

        return result;
    }
};
```

**關鍵點**：
- 負指數：先取倒數
- int 的最小值 -2³¹ 取反會溢位，用 long long

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

### [372. Super Pow](https://leetcode.com/problems/super-pow/)

**題意**：計算 a^b mod 1337，其中 b 是一個非常大的數（用數組表示）。

**思路**：
- a^[1,2,3,4] = a^1234 = (a^123)^10 × a^4
- 遞迴處理

```cpp
class Solution {
private:
    const int MOD = 1337;

    int powerMod(int a, int n) {
        int result = 1;
        a %= MOD;

        while (n > 0) {
            if (n & 1) {
                result = result * a % MOD;
            }
            a = a * a % MOD;
            n >>= 1;
        }

        return result;
    }

public:
    int superPow(int a, vector<int>& b) {
        if (b.empty()) return 1;

        int lastDigit = b.back();
        b.pop_back();

        int part1 = powerMod(superPow(a, b), 10);
        int part2 = powerMod(a, lastDigit);

        return part1 * part2 % MOD;
    }
};
```

**數學原理**：
```
a^1234 = (a^123)^10 × a^4
```

**時間複雜度**：O(n log 10)，n 為 b 的位數
**空間複雜度**：O(n)（遞迴棧）

**迭代版本**：
```cpp
class Solution {
private:
    const int MOD = 1337;

    int powerMod(int a, int n) {
        int result = 1;
        a %= MOD;
        while (n > 0) {
            if (n & 1) result = result * a % MOD;
            a = a * a % MOD;
            n >>= 1;
        }
        return result;
    }

public:
    int superPow(int a, vector<int>& b) {
        int result = 1;

        for (int digit : b) {
            result = powerMod(result, 10) * powerMod(a, digit) % MOD;
        }

        return result;
    }
};
```

### [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)（矩陣快速冪）

**題意**：計算第 n 個 Fibonacci 數。

**方法 1：動態規劃** O(n)
```cpp
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;

        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }

        return prev1;
    }
};
```

**方法 2：矩陣快速冪** O(log n)
```cpp
class Solution {
private:
    vector<vector<long long>> multiply(
        const vector<vector<long long>>& A,
        const vector<vector<long long>>& B
    ) {
        vector<vector<long long>> C(2, vector<long long>(2));
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }

    vector<vector<long long>> matrixPower(
        vector<vector<long long>> A,
        int n
    ) {
        vector<vector<long long>> result = {{1, 0}, {0, 1}};

        while (n > 0) {
            if (n & 1) {
                result = multiply(result, A);
            }
            A = multiply(A, A);
            n >>= 1;
        }

        return result;
    }

public:
    int fib(int n) {
        if (n <= 1) return n;

        vector<vector<long long>> base = {{1, 1}, {1, 0}};
        vector<vector<long long>> result = matrixPower(base, n - 1);

        return result[0][0];
    }
};
```

**時間複雜度**：O(log n)
**空間複雜度**：O(1)

**何時使用矩陣快速冪？**
- n 非常大（如 n = 10^18）
- 需要模運算防止溢位
- 線性遞推關係

## 總結

快速冪是數論與算法中的重要技巧：

1. **基本快速冪**：O(log n) 計算 a^n，利用分治思想
2. **模快速冪**：防止溢位，每步取模
3. **矩陣快速冪**：解決線性遞推數列（如 Fibonacci）
4. **應用廣泛**：
   - 大數冪運算
   - 模反元素（費馬小定理）
   - 遞推數列
   - 圖論路徑計數
5. **實現技巧**：
   - 位運算優化
   - 防止溢位（__int128）
   - 處理負指數
   - 預處理小冪次

掌握快速冪是解決許多數論問題的關鍵工具！
