---
title: "4. Bitwise Tricks"
order: 4
description: "常用的位元運算技巧與模式"
tags: ["bit manipulation", "tricks", "patterns", "進階"]
---

# 4. Bitwise Tricks (位元運算技巧)

本章介紹一些經典且實用的位元運算技巧，這些技巧在演算法競賽和實際開發中都非常有用。

## 1. Number of 1 Bits (Brian Kernighan 演算法)

### 原理

Brian Kernighan 演算法是一種高效計算整數中 1 的個數的方法，其核心是利用 `x & (x - 1)` 可以移除最低位的 1。

### 實作

```cpp
int countOnes(int x) {
    int count = 0;
    while (x) {
        x &= x - 1;  // 移除最低位的 1
        count++;
    }
    return count;
}
```

### 詳細過程

```
x = 10110100

第 1 次:
  x     = 10110100
  x - 1 = 10110011
  ───────────────
  x & (x-1) = 10110000  (移除最低位的 1)
  count = 1

第 2 次:
  x     = 10110000
  x - 1 = 10101111
  ───────────────
  x & (x-1) = 10100000
  count = 2

第 3 次:
  x     = 10100000
  x - 1 = 10011111
  ───────────────
  x & (x-1) = 10000000
  count = 3

第 4 次:
  x     = 10000000
  x - 1 = 01111111
  ───────────────
  x & (x-1) = 00000000
  count = 4

結果: 4 個 1
```

### 時間複雜度

- **O(k)**，k 是 1 的個數
- 優於逐位檢查的 O(n) 方法（n 是總位元數）

### 應用

```cpp
// 檢查是否為 2 的冪次（只有一個 1）
bool isPowerOfTwo(int x) {
    return x > 0 && (x & (x - 1)) == 0;
}

// 計算需要改變多少位元才能從 a 變成 b
int bitDifference(int a, int b) {
    int xor_result = a ^ b;
    int count = 0;
    while (xor_result) {
        xor_result &= xor_result - 1;
        count++;
    }
    return count;
}
```

## 2. Bit Reversal (位元反轉)

### 方法 1: 逐位反轉

```cpp
uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;

    for (int i = 0; i < 32; i++) {
        // 取出第 i 位元
        int bit = (n >> i) & 1;

        // 將 bit 放到對稱位置
        result |= bit << (31 - i);
    }

    return result;
}
```

### 方法 2: 分治法

```cpp
uint32_t reverseBits(uint32_t n) {
    // 交換相鄰的位元
    n = ((n & 0xAAAAAAAA) >> 1) | ((n & 0x55555555) << 1);

    // 交換相鄰的 2 位元組
    n = ((n & 0xCCCCCCCC) >> 2) | ((n & 0x33333333) << 2);

    // 交換相鄰的 4 位元組
    n = ((n & 0xF0F0F0F0) >> 4) | ((n & 0x0F0F0F0F) << 4);

    // 交換相鄰的 8 位元組
    n = ((n & 0xFF00FF00) >> 8) | ((n & 0x00FF00FF) << 8);

    // 交換相鄰的 16 位元組
    n = (n >> 16) | (n << 16);

    return n;
}
```

### 詳細解析（8 位元範例）

```
原始: 10110010

Step 1: 交換相鄰位元
  10 11 00 10 → 01 11 00 01 (01110001)

Step 2: 交換相鄰的 2 位元
  0111 0001 → 1101 0100 (11010100)

Step 3: 交換相鄰的 4 位元
  1101 0100 → 0100 1101 (01001101)

結果: 01001101
驗證: 原始 10110010 反轉確實是 01001101 ✓
```

### Mask 解釋

```
0xAAAAAAAA = 10101010101010101010101010101010 (偶數位元)
0x55555555 = 01010101010101010101010101010101 (奇數位元)

0xCCCCCCCC = 11001100110011001100110011001100 (每 2 位元的高位)
0x33333333 = 00110011001100110011001100110011 (每 2 位元的低位)

0xF0F0F0F0 = 11110000111100001111000011110000 (每 4 位元的高位)
0x0F0F0F0F = 00001111000011110000111100001111 (每 4 位元的低位)

0xFF00FF00 = 11111111000000001111111100000000 (每 8 位元的高位)
0x00FF00FF = 00000000111111110000000011111111 (每 8 位元的低位)
```

## 3. Power of 2 Test (檢查是否為 2 的冪次)

### 方法 1: 使用 x & (x - 1)

```cpp
bool isPowerOfTwo(int x) {
    return x > 0 && (x & (x - 1)) == 0;
}
```

### 原理

2 的冪次方的二進制表示中只有一個 1：

```
2^0 = 1   → 00000001
2^1 = 2   → 00000010
2^2 = 4   → 00000100
2^3 = 8   → 00001000
2^4 = 16  → 00010000

使用 x & (x - 1):
  00010000  (16)
& 00001111  (15)
  ────────
  00000000  (結果為 0，是 2 的冪次)

  00001100  (12，非 2 的冪次)
& 00001011  (11)
  ────────
  00001000  (結果不為 0，不是 2 的冪次)
```

### 方法 2: 使用 __builtin_popcount

```cpp
bool isPowerOfTwo(int x) {
    return x > 0 && __builtin_popcount(x) == 1;
}
```

### 方法 3: 使用 x & -x

```cpp
bool isPowerOfTwo(int x) {
    return x > 0 && (x & -x) == x;
}
```

## 4. XOR Swap (不用臨時變數交換)

### 實作

```cpp
void swap(int& a, int& b) {
    if (a != b) {  // 注意：a 和 b 不能指向同一個變數
        a ^= b;
        b ^= a;
        a ^= b;
    }
}
```

### 詳細過程

```
假設: a = 5 (0101), b = 3 (0011)

Step 1: a ^= b
  a = 0101 ^ 0011 = 0110 (6)
  b = 0011 (不變)

Step 2: b ^= a
  a = 0110 (不變)
  b = 0011 ^ 0110 = 0101 (5)

Step 3: a ^= b
  a = 0110 ^ 0101 = 0011 (3)
  b = 0101 (不變)

結果: a = 3, b = 5 (已交換)
```

### 原理

```
設原始值 a = A, b = B

Step 1: a = A ^ B, b = B
Step 2: a = A ^ B, b = B ^ (A ^ B) = A
Step 3: a = (A ^ B) ^ A = B, b = A

最終: a = B, b = A
```

### 注意事項

```cpp
// 危險：如果 a 和 b 是同一個變數
int x = 5;
swap(x, x);  // 結果 x = 0（錯誤！）

// 原因分析：
// Step 1: x ^= x → x = 0
// Step 2: x ^= x → x = 0
// Step 3: x ^= x → x = 0

// 因此需要檢查
void safe_swap(int& a, int& b) {
    if (&a != &b) {  // 檢查是否為同一個變數
        a ^= b;
        b ^= a;
        a ^= b;
    }
}
```

### 實用性

在現代編譯器中，使用臨時變數的 swap 通常更快，因為：
1. 編譯器可以優化
2. CPU 有專門的 SWAP 指令
3. XOR swap 可能破壞 CPU 流水線

```cpp
// 現代推薦寫法
void modern_swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

// 或使用 std::swap
std::swap(a, b);
```

## 5. 找出 MSB (最高有效位)

### 方法 1: 使用 __builtin_clz

```cpp
int findMSB(int x) {
    if (x == 0) return -1;
    return 31 - __builtin_clz(x);
}

// 範例
cout << findMSB(0b1010) << endl;      // 3
cout << findMSB(0b10000000) << endl;  // 7
cout << findMSB(1) << endl;           // 0
```

### 方法 2: 逐位檢查

```cpp
int findMSB(int x) {
    int msb = -1;
    while (x) {
        x >>= 1;
        msb++;
    }
    return msb;
}
```

### 方法 3: 查表法 + 二分

```cpp
int findMSB(int x) {
    if (x == 0) return -1;

    int pos = 0;

    if (x >= 1 << 16) { x >>= 16; pos += 16; }
    if (x >= 1 << 8)  { x >>= 8;  pos += 8;  }
    if (x >= 1 << 4)  { x >>= 4;  pos += 4;  }
    if (x >= 1 << 2)  { x >>= 2;  pos += 2;  }
    if (x >= 1 << 1)  { pos += 1; }

    return pos;
}
```

### 應用：計算 log2

```cpp
// 向下取整
int log2_floor(int x) {
    if (x <= 0) return -1;
    return 31 - __builtin_clz(x);
}

// 向上取整
int log2_ceil(int x) {
    if (x <= 0) return -1;
    if (x == 1) return 0;
    return 32 - __builtin_clz(x - 1);
}

// 範例
cout << log2_floor(8) << endl;   // 3
cout << log2_floor(15) << endl;  // 3
cout << log2_ceil(8) << endl;    // 3
cout << log2_ceil(9) << endl;    // 4
```

## 6. 找出 LSB (最低有效位)

### 方法 1: x & -x (最常用)

```cpp
int isolateLSB(int x) {
    return x & -x;
}

// 範例
int x = 0b10110;  // 22
int lsb = isolateLSB(x);  // 0b00010 = 2
```

### 原理

```
x  =  00010110  (22)
-x =  11101010  (-22，二補數)
───────────────
x & -x = 00000010  (只保留最低位的 1)

詳細推導:
-x = ~x + 1

x     = ...abc1000  (最低位 1 在位置 3)
~x    = ...xyz0111  (x 的反碼)
~x+1  = ...xyz1000  (-x)

x & -x = ...abc1000 & ...xyz1000 = ...0001000
```

### 方法 2: x & ~(x - 1)

```cpp
int isolateLSB(int x) {
    return x & ~(x - 1);
}
```

### 方法 3: x ^ (x & (x - 1))

```cpp
int isolateLSB(int x) {
    return x ^ (x & (x - 1));
}
```

### 找到 LSB 的位置

```cpp
int findLSB(int x) {
    if (x == 0) return -1;
    return __builtin_ctz(x);
}

// 或使用 __builtin_ffs（結果從 1 開始）
int findLSB_ffs(int x) {
    return __builtin_ffs(x) - 1;  // 轉換為從 0 開始
}
```

### 應用：Fenwick Tree (Binary Indexed Tree)

```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;

    int lowbit(int x) {
        return x & -x;  // 找出最低位的 1
    }

public:
    FenwickTree(int n) : n(n), tree(n + 1, 0) {}

    void update(int idx, int delta) {
        while (idx <= n) {
            tree[idx] += delta;
            idx += lowbit(idx);  // 跳到下一個節點
        }
    }

    int query(int idx) {
        int sum = 0;
        while (idx > 0) {
            sum += tree[idx];
            idx -= lowbit(idx);  // 跳到父節點
        }
        return sum;
    }
};
```

## LeetCode 題目

### 題目 1: 190. Reverse Bits

**題目連結：** https://leetcode.com/problems/reverse-bits/

**題目描述：** 顛倒給定的 32 位無符號整數的二進制位。

**解法：**（已在前面章節介紹）

```cpp
class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>= 1;
        }
        return result;
    }
};
```

### 題目 2: 231. Power of Two

**題目連結：** https://leetcode.com/problems/power-of-two/

**題目描述：** 判斷一個整數是否為 2 的冪次方。

**解法：**（已在前面章節介紹）

```cpp
class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
};
```

### 題目 3: 342. Power of Four

**題目連結：** https://leetcode.com/problems/power-of-four/

**題目描述：**

給定一個整數，編寫一個函數來判斷它是否是 4 的冪次方。

**範例：**

```
輸入: n = 16
輸出: true
解釋: 4^2 = 16

輸入: n = 5
輸出: false

輸入: n = 1
輸出: true
解釋: 4^0 = 1
```

**解法：**

```cpp
class Solution {
public:
    bool isPowerOfFour(int n) {
        // 方法 1: 位元運算
        // 條件 1: n > 0
        // 條件 2: n 是 2 的冪次（只有一個 1）
        // 條件 3: 1 的位置在偶數位（0, 2, 4, 6, ...）
        //         4^0 = 1   → 0000...0001 (位置 0)
        //         4^1 = 4   → 0000...0100 (位置 2)
        //         4^2 = 16  → 0001...0000 (位置 4)
        //         4^3 = 64  → 0100...0000 (位置 6)

        // 0x55555555 = 01010101010101010101010101010101
        // 這個 mask 在所有偶數位（0, 2, 4, ...）上是 1
        return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;

        // 方法 2: 使用 log
        // if (n <= 0) return false;
        // int log_val = log2(n);
        // return (1 << log_val) == n && log_val % 2 == 0;

        // 方法 3: 使用 __builtin_ctz
        // if (n <= 0) return false;
        // if ((n & (n - 1)) != 0) return false;  // 不是 2 的冪次
        // return __builtin_ctz(n) % 2 == 0;      // 1 的位置是偶數
    }
};
```

**解析：**

4 的冪次方的特徵：
1. 必須是正數
2. 必須是 2 的冪次方（只有一個 1）
3. 1 的位置必須在偶數位

```
4^0 = 1   = 0x00000001 (位置 0) ✓
4^1 = 4   = 0x00000004 (位置 2) ✓
4^2 = 16  = 0x00000010 (位置 4) ✓
4^3 = 64  = 0x00000040 (位置 6) ✓

2^1 = 2   = 0x00000002 (位置 1) ✗ (奇數位)
2^3 = 8   = 0x00000008 (位置 3) ✗ (奇數位)
```

**時間複雜度：** O(1)
**空間複雜度：** O(1)

### 題目 4: 89. Gray Code

**題目連結：** https://leetcode.com/problems/gray-code/

**題目描述：**

格雷碼（Gray Code）是一個二進制數字系統，其中兩個連續的數值僅有一個位元的差異。

給定一個整數 n，返回長度為 2^n 的格雷碼序列。

**範例：**

```
輸入: n = 2
輸出: [0, 1, 3, 2]
解釋:
00 (0)
01 (1)
11 (3)
10 (2)

輸入: n = 3
輸出: [0, 1, 3, 2, 6, 7, 5, 4]
解釋:
000 (0)
001 (1)
011 (3)
010 (2)
110 (6)
111 (7)
101 (5)
100 (4)
```

**解法：**

```cpp
class Solution {
public:
    vector<int> grayCode(int n) {
        // 方法 1: 使用公式 gray(i) = i ^ (i >> 1)
        int size = 1 << n;  // 2^n
        vector<int> result(size);

        for (int i = 0; i < size; i++) {
            result[i] = i ^ (i >> 1);
        }

        return result;

        // 方法 2: 鏡像反射法
        // vector<int> result = {0};
        // for (int i = 0; i < n; i++) {
        //     int size = result.size();
        //     for (int j = size - 1; j >= 0; j--) {
        //         result.push_back(result[j] | (1 << i));
        //     }
        // }
        // return result;
    }
};
```

**解析：**

**方法 1：格雷碼公式**

格雷碼的第 i 個數字可以用公式計算：`gray(i) = i ^ (i >> 1)`

```
i = 0: 0 ^ (0 >> 1) = 0 ^ 0 = 0  (000)
i = 1: 1 ^ (1 >> 1) = 1 ^ 0 = 1  (001)
i = 2: 2 ^ (2 >> 1) = 2 ^ 1 = 3  (011)
i = 3: 3 ^ (3 >> 1) = 3 ^ 1 = 2  (010)
i = 4: 4 ^ (4 >> 1) = 4 ^ 2 = 6  (110)
i = 5: 5 ^ (5 >> 1) = 5 ^ 2 = 7  (111)
i = 6: 6 ^ (6 >> 1) = 6 ^ 3 = 5  (101)
i = 7: 7 ^ (7 >> 1) = 7 ^ 3 = 4  (100)
```

**方法 2：鏡像反射法**

```
n = 1:
  0 (0)
  1 (1)

n = 2: (在 n=1 的基礎上)
  前半部分（保持不變）:
    00 (0)
    01 (1)
  後半部分（鏡像反射，並在最高位加 1）:
    11 (3)  ← 01 | 10 = 11
    10 (2)  ← 00 | 10 = 10

n = 3: (在 n=2 的基礎上)
  前半部分:
    000 (0)
    001 (1)
    011 (3)
    010 (2)
  後半部分（鏡像反射，並在最高位加 1）:
    110 (6)  ← 010 | 100 = 110
    111 (7)  ← 011 | 100 = 111
    101 (5)  ← 001 | 100 = 101
    100 (4)  ← 000 | 100 = 100
```

**時間複雜度：** O(2^n)
**空間複雜度：** O(1)（不計輸出空間）

## 更多位元技巧

### 1. 設定低 n 位元為 1

```cpp
int setLowNBits(int n) {
    return (1 << n) - 1;
}

// 範例
cout << bitset<8>(setLowNBits(4)) << endl;  // 00001111
cout << bitset<8>(setLowNBits(6)) << endl;  // 00111111
```

### 2. 取得第 i 到第 j 位元

```cpp
int getBits(int x, int i, int j) {
    // i 和 j 是位元位置（從 0 開始）
    int mask = ((1 << (j - i + 1)) - 1) << i;
    return (x & mask) >> i;
}

// 範例
int x = 0b11010110;
cout << bitset<8>(getBits(x, 2, 5)) << endl;  // 00000101
```

### 3. 設定第 i 到第 j 位元

```cpp
int setBits(int x, int i, int j, int value) {
    // 清除第 i 到第 j 位元
    int mask = ((1 << (j - i + 1)) - 1) << i;
    x &= ~mask;

    // 設定新值
    x |= (value << i);

    return x;
}
```

### 4. 檢查兩個整數符號是否相同

```cpp
bool sameSign(int a, int b) {
    return (a ^ b) >= 0;
}

// 原理：
// 如果符號相同，最高位（符號位）相同，XOR 結果的最高位為 0（非負數）
// 如果符號不同，最高位不同，XOR 結果的最高位為 1（負數）
```

### 5. 找出唯一缺失的數字

```cpp
// 範例：0 到 n 的數字，缺失一個，找出缺失的數字
int findMissing(vector<int>& nums) {
    int result = nums.size();
    for (int i = 0; i < nums.size(); i++) {
        result ^= i ^ nums[i];
    }
    return result;
}

// 原理：
// 0 ^ 1 ^ 2 ^ ... ^ n ^ nums[0] ^ nums[1] ^ ... ^ nums[n-1]
// 除了缺失的數字，其他數字都會出現兩次，XOR 後為 0
```

### 6. 交換位元的奇偶位

```cpp
int swapOddEvenBits(int x) {
    // 0xAAAAAAAA = 10101010... (偶數位)
    // 0x55555555 = 01010101... (奇數位)
    return ((x & 0xAAAAAAAA) >> 1) | ((x & 0x55555555) << 1);
}

// 範例
int x = 0b10110010;  // 178
int y = swapOddEvenBits(x);  // 0b01101001 = 105
```

## 常見陷阱

### 1. XOR swap 的陷阱

```cpp
// 危險：如果 a 和 b 是同一個變數
int x = 5;
int& a = x;
int& b = x;

// 錯誤的 swap
a ^= b;  // x = 0
b ^= a;  // x = 0
a ^= b;  // x = 0
```

### 2. 有符號整數的位移

```cpp
int x = -1;  // 11111111111111111111111111111111
int y = x >> 1;  // 11111111111111111111111111111111 (算術右移)

unsigned int ux = -1;
unsigned int uy = ux >> 1;  // 01111111111111111111111111111111 (邏輯右移)
```

### 3. 位移量超出範圍

```cpp
int x = 1;
int y = x << 32;  // 未定義行為（位移量 >= 位元數）

// 正確做法
if (shift < 32) {
    y = x << shift;
}
```

## 小結

位元運算技巧是演算法工具箱中的重要工具：

1. **Brian Kernighan 演算法：** 高效計算 1 的個數
2. **位元反轉：** 分治法可以在 O(log n) 次操作內完成
3. **Power of 2 測試：** `x & (x - 1) == 0` 是最快的方法
4. **XOR swap：** 雖然巧妙，但實用性不高
5. **MSB/LSB 操作：** 使用 GCC builtin 函數最高效
6. **Gray Code：** `i ^ (i >> 1)` 公式簡潔高效

掌握這些技巧能夠：
- 寫出更高效的程式碼
- 解決特定的演算法問題
- 理解底層運作原理

在下一章節，我們將學習位元 DP 和更進階的應用。
