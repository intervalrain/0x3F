---
title: 09-3. Bit Library - STL
order: 3
description: C++ STL 位元函式庫：bitset 與 GCC Built-in Functions
tags:
  - bit manipulation
  - bitset
  - STL
  - GCC builtin
author: Rain Hu
date: '2025-10-26'
draft: false
---

# 3. Bit Library - STL

C++ 標準函式庫和編譯器提供了許多方便的位元操作工具，能夠大幅簡化位元運算的程式碼。

## bitset<N> 容器

`bitset` 是 C++ STL 提供的固定大小的位元集合，提供了豐富的位元操作介面。

### 宣告與初始化

```cpp
#include <bitset>
using namespace std;

// 宣告一個 8 位元的 bitset，預設全為 0
bitset<8> bits1;

// 從整數初始化
bitset<8> bits2(42);  // 00101010

// 從字串初始化
bitset<8> bits3("10101100");

// 從字串初始化（指定起始位置和長度）
string str = "0110101";
bitset<8> bits4(str, 1, 4);  // 從位置 1 開始取 4 個字符: "1101" → 00001101

// 使用 unsigned long long 初始化
bitset<64> bits5(0xFFFFFFFFULL);
```

### 基本操作

#### 1. set() - 設定位元

```cpp
bitset<8> bits;

// 設定所有位元為 1
bits.set();  // 11111111

// 設定第 i 位元為 1
bits.set(3);  // 設定第 3 位元

// 設定第 i 位元為指定值
bits.set(2, false);  // 設定第 2 位元為 0
bits.set(5, true);   // 設定第 5 位元為 1

// 範例
bitset<8> b;
b.set(0);     // 00000001
b.set(3);     // 00001001
b.set(7);     // 10001001
```

#### 2. reset() - 清除位元

```cpp
bitset<8> bits("11111111");

// 清除所有位元（設為 0）
bits.reset();  // 00000000

// 清除第 i 位元
bits.set();    // 11111111
bits.reset(3); // 11110111

// 範例
bitset<8> b("10101010");
b.reset(1);  // 10101000
b.reset(3);  // 10100000
```

#### 3. flip() - 翻轉位元

```cpp
bitset<8> bits("10101010");

// 翻轉所有位元
bits.flip();  // 01010101

// 翻轉第 i 位元
bits.flip(0);  // 01010100
bits.flip(7);  // 11010100

// 範例
bitset<4> b("1010");
b.flip();    // 0101
b.flip(0);   // 0100
b.flip(1);   // 0110
```

#### 4. test() - 檢查位元

```cpp
bitset<8> bits("10101010");

// 檢查第 i 位元是否為 1
bool is_set = bits.test(1);  // true
bool is_clear = bits.test(0);  // false

// 範例
bitset<8> b("10001001");
cout << b.test(0) << endl;  // 1 (true)
cout << b.test(1) << endl;  // 0 (false)
cout << b.test(3) << endl;  // 1 (true)
cout << b.test(7) << endl;  // 1 (true)
```

### 查詢操作

#### 1. count() - 計算 1 的個數

```cpp
bitset<8> bits("10101010");
int ones = bits.count();  // 4

// 範例
bitset<8> b1("11111111");
cout << b1.count() << endl;  // 8

bitset<8> b2("10001000");
cout << b2.count() << endl;  // 2
```

#### 2. size() - 取得位元數量

```cpp
bitset<8> bits;
size_t n = bits.size();  // 8

bitset<32> bits32;
size_t m = bits32.size();  // 32
```

#### 3. any() - 檢查是否有任何位元為 1

```cpp
bitset<8> bits1("00000000");
bool has_one1 = bits1.any();  // false

bitset<8> bits2("00000001");
bool has_one2 = bits2.any();  // true

// 範例
bitset<8> b("00000000");
cout << b.any() << endl;   // 0 (false)
b.set(0);
cout << b.any() << endl;   // 1 (true)
```

#### 4. none() - 檢查是否所有位元都為 0

```cpp
bitset<8> bits1("00000000");
bool all_zero1 = bits1.none();  // true

bitset<8> bits2("00000001");
bool all_zero2 = bits2.none();  // false

// 範例
bitset<8> b("00000000");
cout << b.none() << endl;  // 1 (true)
b.set(0);
cout << b.none() << endl;  // 0 (false)
```

#### 5. all() - 檢查是否所有位元都為 1（C++11）

```cpp
bitset<8> bits1("11111111");
bool all_one1 = bits1.all();  // true

bitset<8> bits2("11111110");
bool all_one2 = bits2.all();  // false

// 範例
bitset<8> b;
b.set();
cout << b.all() << endl;   // 1 (true)
b.reset(0);
cout << b.all() << endl;   // 0 (false)
```

### 位元運算子

bitset 支援所有位元運算子：

```cpp
bitset<8> b1("10101010");
bitset<8> b2("11001100");

// AND
bitset<8> and_result = b1 & b2;  // 10001000

// OR
bitset<8> or_result = b1 | b2;   // 11101110

// XOR
bitset<8> xor_result = b1 ^ b2;  // 01100110

// NOT
bitset<8> not_result = ~b1;      // 01010101

// 左移
bitset<8> left_shift = b1 << 2;  // 10101000

// 右移
bitset<8> right_shift = b1 >> 2; // 00101010

// 複合運算子
b1 &= b2;  // b1 = b1 & b2
b1 |= b2;  // b1 = b1 | b2
b1 ^= b2;  // b1 = b1 ^ b2
b1 <<= 2;  // b1 = b1 << 2
b1 >>= 2;  // b1 = b1 >> 2
```

### 存取操作

#### 1. operator[] - 存取單一位元

```cpp
bitset<8> bits("10101010");

// 讀取
bool bit0 = bits[0];  // false (0)
bool bit1 = bits[1];  // true (1)

// 寫入
bits[0] = 1;  // 10101011
bits[7] = 0;  // 00101011

// 鏈式操作
bits[0].flip();  // 翻轉第 0 位元
```

### 轉換操作

#### 1. to_ulong() - 轉換為 unsigned long

```cpp
bitset<8> bits("00101010");
unsigned long value = bits.to_ulong();  // 42

// 注意：如果 bitset 的值超過 unsigned long 的範圍會拋出異常
bitset<64> large_bits;
large_bits.set();
// unsigned long val = large_bits.to_ulong();  // 可能拋出 overflow_error
```

#### 2. to_ullong() - 轉換為 unsigned long long（C++11）

```cpp
bitset<64> bits("0000000000000000000000000000000000000000000000000000000000101010");
unsigned long long value = bits.to_ullong();  // 42
```

#### 3. to_string() - 轉換為字串

```cpp
bitset<8> bits(42);
string str = bits.to_string();  // "00101010"

// 指定字符
string str2 = bits.to_string('0', '1');  // "00101010"
string str3 = bits.to_string('.', '#');  // "..#.#.#."
```

### 輸入輸出

```cpp
bitset<8> bits;

// 輸出
cout << bits << endl;  // 00000000

// 輸入（從字串讀取）
cin >> bits;  // 輸入: 10101010

// 格式化輸出
bitset<16> b(42);
cout << "Binary: " << b << endl;                    // Binary: 0000000000101010
cout << "Decimal: " << b.to_ulong() << endl;        // Decimal: 42
cout << "Hex: " << hex << b.to_ulong() << endl;     // Hex: 2a
```

### 完整範例

```cpp
#include <iostream>
#include <bitset>
using namespace std;

int main() {
    // 初始化
    bitset<8> b1(42);           // 00101010
    bitset<8> b2("11001100");   // 11001100

    // 基本操作
    cout << "b1: " << b1 << endl;
    cout << "b2: " << b2 << endl;
    cout << endl;

    // 位元運算
    cout << "b1 & b2: " << (b1 & b2) << endl;  // 00001000
    cout << "b1 | b2: " << (b1 | b2) << endl;  // 11101110
    cout << "b1 ^ b2: " << (b1 ^ b2) << endl;  // 11100110
    cout << "~b1: " << ~b1 << endl;            // 11010101
    cout << endl;

    // 位移
    cout << "b1 << 2: " << (b1 << 2) << endl;  // 10101000
    cout << "b1 >> 2: " << (b1 >> 2) << endl;  // 00001010
    cout << endl;

    // 查詢
    cout << "b1.count(): " << b1.count() << endl;  // 3
    cout << "b1.any(): " << b1.any() << endl;      // 1
    cout << "b1.none(): " << b1.none() << endl;    // 0
    cout << "b1.all(): " << b1.all() << endl;      // 0
    cout << endl;

    // 修改
    b1.set(0);     // 00101011
    b1.reset(1);   // 00101001
    b1.flip(2);    // 00101101

    cout << "After modifications: " << b1 << endl;  // 00101101
    cout << "Decimal: " << b1.to_ulong() << endl;   // 45

    return 0;
}
```

## GCC Built-in Functions

GCC 編譯器提供了一系列高效的位元操作內建函數，這些函數通常會被編譯成單一的 CPU 指令。

### 1. __builtin_popcount(x) - 計算 1 的個數

計算 `x` 的二進制表示中 1 的個數（Population Count / Hamming Weight）。

```cpp
int x = 0b10101010;  // 10101010
int ones = __builtin_popcount(x);  // 4

// 範例
cout << __builtin_popcount(0) << endl;        // 0
cout << __builtin_popcount(1) << endl;        // 1
cout << __builtin_popcount(7) << endl;        // 3 (0b111)
cout << __builtin_popcount(15) << endl;       // 4 (0b1111)
cout << __builtin_popcount(255) << endl;      // 8 (0b11111111)

// 不同資料型態的版本
__builtin_popcount(x);      // unsigned int
__builtin_popcountl(x);     // unsigned long
__builtin_popcountll(x);    // unsigned long long
```

**實作原理：**

在現代 CPU 上，這個函數會被編譯成 `POPCNT` 指令（單一時鐘週期）。

### 2. __builtin_clz(x) - 計算前導 0 的個數

計算 `x` 的二進制表示中，從最高位開始連續 0 的個數（Count Leading Zeros）。

```cpp
int x = 0b00001010;  // 8 位元視角：00001010
int leading_zeros = __builtin_clz(x);

// 注意：__builtin_clz 作用於 32 位元整數
// 00000000000000000000000000001010 (32 位元)
// 有 28 個前導 0

cout << __builtin_clz(1) << endl;      // 31 (0x00000001)
cout << __builtin_clz(2) << endl;      // 30 (0x00000010)
cout << __builtin_clz(4) << endl;      // 29 (0x00000100)
cout << __builtin_clz(8) << endl;      // 28 (0x00001000)
cout << __builtin_clz(16) << endl;     // 27 (0x00010000)

// 不同資料型態的版本
__builtin_clz(x);      // unsigned int (32 bits)
__builtin_clzl(x);     // unsigned long
__builtin_clzll(x);    // unsigned long long (64 bits)

// 注意：x = 0 時結果未定義！
// if (x == 0) return -1;  // 或其他處理方式
// return __builtin_clz(x);
```

**應用：找到最高位的 1**

```cpp
int find_msb_position(int x) {
    if (x == 0) return -1;
    return 31 - __builtin_clz(x);
}

// 範例
cout << find_msb_position(0b1010) << endl;    // 3
cout << find_msb_position(0b100000) << endl;  // 5
cout << find_msb_position(1) << endl;         // 0
```

### 3. __builtin_ctz(x) - 計算後綴 0 的個數

計算 `x` 的二進制表示中，從最低位開始連續 0 的個數（Count Trailing Zeros）。

```cpp
int x = 0b00101000;  // 40
int trailing_zeros = __builtin_ctz(x);  // 3

// 範例
cout << __builtin_ctz(1) << endl;      // 0 (0b1)
cout << __builtin_ctz(2) << endl;      // 1 (0b10)
cout << __builtin_ctz(4) << endl;      // 2 (0b100)
cout << __builtin_ctz(8) << endl;      // 3 (0b1000)
cout << __builtin_ctz(12) << endl;     // 2 (0b1100)

// 不同資料型態的版本
__builtin_ctz(x);      // unsigned int
__builtin_ctzl(x);     // unsigned long
__builtin_ctzll(x);    // unsigned long long

// 注意：x = 0 時結果未定義！
```

**應用：找到最低位的 1**

```cpp
int find_lsb_position(int x) {
    if (x == 0) return -1;
    return __builtin_ctz(x);
}

// 範例
cout << find_lsb_position(0b1010) << endl;    // 1
cout << find_lsb_position(0b100000) << endl;  // 5
cout << find_lsb_position(12) << endl;        // 2 (0b1100)
```

**應用：Fenwick Tree (Binary Indexed Tree)**

```cpp
int lowbit(int x) {
    return x & -x;
}

// 等價於
int lowbit_builtin(int x) {
    if (x == 0) return 0;
    return 1 << __builtin_ctz(x);
}
```

### 4. __builtin_ffs(x) - 找到第一個 1 的位置

找到 `x` 中第一個（最低位）設定為 1 的位元位置（Find First Set）。

```cpp
int x = 0b00101000;  // 40
int first_set = __builtin_ffs(x);  // 4（位置從 1 開始計算）

// 範例
cout << __builtin_ffs(0) << endl;     // 0（沒有 1）
cout << __builtin_ffs(1) << endl;     // 1（第 1 位元）
cout << __builtin_ffs(2) << endl;     // 2（第 2 位元）
cout << __builtin_ffs(3) << endl;     // 1（0b11，第 1 位元）
cout << __builtin_ffs(4) << endl;     // 3（第 3 位元）
cout << __builtin_ffs(8) << endl;     // 4（第 4 位元）

// 不同資料型態的版本
__builtin_ffs(x);      // int
__builtin_ffsl(x);     // long
__builtin_ffsll(x);    // long long
```

**與 __builtin_ctz 的區別：**

```cpp
int x = 8;  // 0b1000

// __builtin_ctz 返回後綴 0 的個數（從 0 開始）
cout << __builtin_ctz(x) << endl;   // 3

// __builtin_ffs 返回第一個 1 的位置（從 1 開始）
cout << __builtin_ffs(x) << endl;   // 4

// 轉換關係：
// __builtin_ffs(x) = __builtin_ctz(x) + 1 (當 x != 0)
```

### 5. __builtin_parity(x) - 檢查 1 的個數是否為奇數

返回 `x` 中 1 的個數的奇偶性（0 表示偶數，1 表示奇數）。

```cpp
int x1 = 0b1010;  // 2 個 1（偶數）
int x2 = 0b1011;  // 3 個 1（奇數）

cout << __builtin_parity(x1) << endl;  // 0（偶數）
cout << __builtin_parity(x2) << endl;  // 1（奇數）

// 範例
cout << __builtin_parity(0) << endl;      // 0（0 個 1，偶數）
cout << __builtin_parity(1) << endl;      // 1（1 個 1，奇數）
cout << __builtin_parity(3) << endl;      // 0（2 個 1，偶數）
cout << __builtin_parity(7) << endl;      // 1（3 個 1，奇數）
cout << __builtin_parity(15) << endl;     // 0（4 個 1，偶數）

// 不同資料型態的版本
__builtin_parity(x);      // unsigned int
__builtin_parityl(x);     // unsigned long
__builtin_parityll(x);    // unsigned long long
```

**應用：奇偶校驗（Parity Check）**

```cpp
// 計算奇偶校驗位
int compute_parity_bit(int data) {
    return __builtin_parity(data);
}

// 檢查資料是否正確（假設使用偶校驗）
bool check_even_parity(int data_with_parity) {
    return __builtin_parity(data_with_parity) == 0;
}
```

### 效能比較

```cpp
#include <chrono>
#include <iostream>
using namespace std;

int count_ones_loop(int x) {
    int count = 0;
    while (x) {
        count += x & 1;
        x >>= 1;
    }
    return count;
}

int count_ones_builtin(int x) {
    return __builtin_popcount(x);
}

int main() {
    const int N = 100000000;
    int result = 0;

    // 測試手動迴圈
    auto start1 = chrono::high_resolution_clock::now();
    for (int i = 0; i < N; i++) {
        result += count_ones_loop(i);
    }
    auto end1 = chrono::high_resolution_clock::now();

    // 測試 builtin 函數
    auto start2 = chrono::high_resolution_clock::now();
    for (int i = 0; i < N; i++) {
        result += count_ones_builtin(i);
    }
    auto end2 = chrono::high_resolution_clock::now();

    cout << "Loop: " << chrono::duration_cast<chrono::milliseconds>(end1 - start1).count() << " ms" << endl;
    cout << "Builtin: " << chrono::duration_cast<chrono::milliseconds>(end2 - start2).count() << " ms" << endl;

    return 0;
}

// 典型結果（僅供參考）：
// Loop: 800 ms
// Builtin: 120 ms
// Builtin 快約 6-7 倍
```

## LeetCode 題目

### 題目 1: 191. Number of 1 Bits

**題目連結：** https://leetcode.com/problems/number-of-1-bits/

**題目描述：**

編寫一個函數，輸入是一個無符號整數，返回其二進制表達式中數字位數為 '1' 的個數（也稱為漢明重量）。

**範例：**

```
輸入: n = 00000000000000000000000000001011
輸出: 3
解釋: 二進制表示中有 3 個 '1'

輸入: n = 11111111111111111111111111111101
輸出: 31
```

**解法：**

```cpp
class Solution {
public:
    int hammingWeight(uint32_t n) {
        // 方法 1: 使用 GCC builtin（最快）
        return __builtin_popcount(n);

        // 方法 2: Brian Kernighan 演算法
        // int count = 0;
        // while (n) {
        //     n &= n - 1;  // 移除最低位的 1
        //     count++;
        // }
        // return count;

        // 方法 3: 逐位檢查
        // int count = 0;
        // for (int i = 0; i < 32; i++) {
        //     if (n & (1 << i)) {
        //         count++;
        //     }
        // }
        // return count;
    }
};
```

**時間複雜度：**
- 方法 1: O(1)（單一 CPU 指令）
- 方法 2: O(k)，k 是 1 的個數
- 方法 3: O(32) = O(1)

**空間複雜度：** O(1)

### 題目 2: 190. Reverse Bits

**題目連結：** https://leetcode.com/problems/reverse-bits/

**題目描述：**

顛倒給定的 32 位無符號整數的二進制位。

**範例：**

```
輸入: n = 00000010100101000001111010011100
輸出:    964176192 (00111001011110000010100101000000)

輸入: n = 11111111111111111111111111111101
輸出:   3221225471 (10111111111111111111111111111111)
```

**解法：**

```cpp
class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t result = 0;

        for (int i = 0; i < 32; i++) {
            // 取出 n 的最低位元
            int bit = n & 1;

            // 將 bit 放到 result 的對應位置
            result = (result << 1) | bit;

            // n 右移一位
            n >>= 1;
        }

        return result;

        // 方法 2: 使用 bitset
        // bitset<32> bits(n);
        // string str = bits.to_string();
        // reverse(str.begin(), str.end());
        // return bitset<32>(str).to_ulong();
    }
};
```

**解析：**

```
n = 00000010100101000001111010011100

Step 1: bit = 0, result = 0
Step 2: bit = 0, result = 00
Step 3: bit = 1, result = 001
...
Step 32: bit = 0, result = 00111001011110000010100101000000
```

**時間複雜度：** O(32) = O(1)
**空間複雜度：** O(1)

### 題目 3: 231. Power of Two

**題目連結：** https://leetcode.com/problems/power-of-two/

**題目描述：**

給定一個整數，編寫一個函數來判斷它是否是 2 的冪次方。

**範例：**

```
輸入: n = 1
輸出: true
解釋: 2^0 = 1

輸入: n = 16
輸出: true
解釋: 2^4 = 16

輸入: n = 3
輸出: false
```

**解法：**

```cpp
class Solution {
public:
    bool isPowerOfTwo(int n) {
        // 方法 1: 位元運算（最優）
        // 2 的冪次方只有一個 1
        if (n <= 0) return false;
        return __builtin_popcount(n) == 1;

        // 方法 2: n & (n - 1) 技巧
        // if (n <= 0) return false;
        // return (n & (n - 1)) == 0;

        // 方法 3: 使用 __builtin_ctz
        // if (n <= 0) return false;
        // return (1 << __builtin_ctz(n)) == n;
    }
};
```

**解析：**

2 的冪次方的二進制表示中只有一個 1：

```
2^0 = 1   → 00000001 (1 個 1)
2^1 = 2   → 00000010 (1 個 1)
2^2 = 4   → 00000100 (1 個 1)
2^3 = 8   → 00001000 (1 個 1)
2^4 = 16  → 00010000 (1 個 1)

非 2 的冪次方：
3   → 00000011 (2 個 1)
5   → 00000101 (2 個 1)
6   → 00000110 (2 個 1)
```

**使用 n & (n - 1) 的原理：**

```
n = 16 → 00010000
n - 1 = 15 → 00001111
n & (n - 1) = 00000000 (2 的冪次方)

n = 6 → 00000110
n - 1 = 5 → 00000101
n & (n - 1) = 00000100 ≠ 0 (非 2 的冪次方)
```

**時間複雜度：** O(1)
**空間複雜度：** O(1)

## 綜合應用範例

### 範例 1: 使用 bitset 進行集合操作

```cpp
#include <bitset>
#include <iostream>
using namespace std;

const int MAX_N = 100;

int main() {
    bitset<MAX_N> set1, set2;

    // 添加元素到集合
    set1.set(10);
    set1.set(20);
    set1.set(30);

    set2.set(20);
    set2.set(30);
    set2.set(40);

    // 並集
    bitset<MAX_N> union_set = set1 | set2;
    cout << "Union size: " << union_set.count() << endl;  // 4

    // 交集
    bitset<MAX_N> intersect = set1 & set2;
    cout << "Intersection size: " << intersect.count() << endl;  // 2

    // 差集
    bitset<MAX_N> diff = set1 & ~set2;
    cout << "Difference size: " << diff.count() << endl;  // 1

    // 對稱差
    bitset<MAX_N> sym_diff = set1 ^ set2;
    cout << "Symmetric difference size: " << sym_diff.count() << endl;  // 2

    return 0;
}
```

### 範例 2: 使用 builtin 函數計算 log2

```cpp
int log2_floor(int x) {
    if (x <= 0) return -1;
    return 31 - __builtin_clz(x);
}

int log2_ceil(int x) {
    if (x <= 0) return -1;
    if (x == 1) return 0;
    return 32 - __builtin_clz(x - 1);
}

// 範例
cout << log2_floor(8) << endl;   // 3 (2^3 = 8)
cout << log2_floor(15) << endl;  // 3 (2^3 = 8 < 15 < 2^4 = 16)
cout << log2_ceil(8) << endl;    // 3 (2^3 = 8)
cout << log2_ceil(15) << endl;   // 4 (2^3 = 8 < 15 < 2^4 = 16)
```

### 範例 3: 找出所有位元為 1 的位置

```cpp
vector<int> find_set_bits(int x) {
    vector<int> positions;

    while (x) {
        int pos = __builtin_ctz(x);
        positions.push_back(pos);
        x &= x - 1;  // 移除最低位的 1
    }

    return positions;
}

// 範例
int x = 0b10101010;  // 170
vector<int> pos = find_set_bits(x);
// pos = {1, 3, 5, 7}
```

## 複雜度分析

- **bitset 操作：** 大部分操作都是 O(1) 或 O(n/64)（n 是 bitset 的大小）
- **GCC builtin 函數：** 都是 O(1)，通常編譯成單一 CPU 指令

## 常見陷阱

### 1. bitset 大小必須在編譯時確定

```cpp
// 錯誤：n 是變數
int n;
cin >> n;
bitset<n> bits;  // 編譯錯誤

// 正確：使用常數
const int N = 100;
bitset<N> bits;
```

### 2. __builtin_clz 和 __builtin_ctz 對 0 的行為未定義

```cpp
// 危險
int leading_zeros = __builtin_clz(0);  // 未定義行為

// 安全
int safe_clz(int x) {
    if (x == 0) return 32;  // 或其他合理的值
    return __builtin_clz(x);
}
```

### 3. bitset 的位元順序

```cpp
bitset<8> bits("10101010");
// bits[0] 對應最右邊的 0（LSB）
// bits[7] 對應最左邊的 1（MSB）

cout << bits[0] << endl;  // 0
cout << bits[7] << endl;  // 1
```

## 小結

C++ STL 和 GCC builtin 函數提供了強大的位元操作工具：

1. **bitset：** 適合處理固定大小的位元集合，提供豐富的操作介面
2. **GCC builtin 函數：** 高效的位元操作，通常編譯成單一 CPU 指令

合理使用這些工具可以：
- 簡化程式碼
- 提高效能
- 增強可讀性

在實際應用中，建議優先使用這些標準函式庫，而不是手動實作位元操作。
