---
title: 14-0. String 介紹
order: 0
description: C++ 字串基礎與常用技巧
tags:
  - string
  - 基礎
author: Rain Hu
date: '2025-10-08'
draft: false
---

# 0. String 介紹

字串（String）是程式設計中最常見的資料結構之一，幾乎所有的程式都會處理文字資料。本章將介紹 C++ 中的字串基礎知識與常用技巧。

## C++ 字串基礎

### 1. `char[]` vs `string` 類別

C++ 提供兩種主要的字串表示方式：

#### C-style 字串（char 陣列）
```cpp
char str1[] = "Hello";          // 自動加上 '\0'
char str2[10] = "World";        // 固定大小
char* str3 = "Constant";        // 字串常量（不可修改）

// 操作 C-style 字串
#include <cstring>
int len = strlen(str1);         // 長度
strcpy(str2, str1);             // 複製
strcat(str1, str2);             // 連接
int cmp = strcmp(str1, str2);   // 比較
```

#### C++ string 類別
```cpp
#include <string>
string s1 = "Hello";
string s2("World");
string s3(5, 'a');              // "aaaaa"

// string 的常用方法
int len = s1.length();          // 或 s1.size()
s1 += s2;                       // 連接
string sub = s1.substr(0, 5);   // 子串
int pos = s1.find("lo");        // 查找
s1.replace(0, 2, "Hi");         // 替換
```

**選擇建議：**
- 競賽/演算法題：優先使用 `string`，方便且安全
- 效能敏感場景：考慮 `char[]`，避免額外開銷
- 字串常量：使用 `const char*` 或 `string`

### 2. `string` 類別的常用方法

```cpp
string s = "Hello World";

// 存取
s[0] = 'h';                     // 直接存取（不檢查邊界）
s.at(0) = 'H';                  // 安全存取（檢查邊界）
char first = s.front();         // 第一個字元
char last = s.back();           // 最後一個字元

// 修改
s.push_back('!');               // 加入字元
s.pop_back();                   // 移除最後字元
s.append(" C++");               // 附加字串
s.insert(5, ",");               // 插入
s.erase(5, 1);                  // 刪除
s.clear();                      // 清空

// 查詢
bool empty = s.empty();         // 是否為空
int len = s.size();             // 長度
int pos = s.find("World");      // 查找（找不到回傳 string::npos）
int rpos = s.rfind("o");        // 反向查找

// 比較
int cmp = s.compare("Hello");   // 字典序比較
bool eq = (s == "Hello");       // 相等比較
bool lt = (s < "World");        // 字典序小於

// 轉換
const char* cstr = s.c_str();   // 轉為 C-style 字串
```

### 3. `stringstream` 用法

`stringstream` 是處理字串的強大工具，常用於分割、轉換、格式化：

```cpp
#include <sstream>

// 字串分割
string sentence = "Hello World C++";
stringstream ss(sentence);
string word;
while (ss >> word) {
    cout << word << endl;
}

// 數字與字串轉換
int num = 123;
stringstream ss1;
ss1 << num;
string str = ss1.str();         // "123"

stringstream ss2("456");
int val;
ss2 >> val;                     // val = 456

// 多值處理
stringstream ss3("1,2,3,4,5");
int a, b, c, d, e;
char comma;
ss3 >> a >> comma >> b >> comma >> c >> comma >> d >> comma >> e;
```

**常見應用場景：**
```cpp
// 1. 分割逗號分隔的字串
string data = "apple,banana,cherry";
stringstream ss(data);
string item;
vector<string> tokens;
while (getline(ss, item, ',')) {
    tokens.push_back(item);
}

// 2. 構建格式化字串
stringstream ss;
ss << "Name: " << name << ", Age: " << age;
string result = ss.str();
```

## ASCII 編碼

理解 ASCII 編碼對字串操作非常重要：

### ASCII 字元範圍

```
數字 '0'-'9':  48-57   (0x30-0x39)
大寫 'A'-'Z':  65-90   (0x41-0x5A)
小寫 'a'-'z':  97-122  (0x61-0x7A)

差值：
'a' - 'A' = 32 (二進制: 100000)
'0' 的 ASCII = 48
```

### 常用 ASCII 操作技巧

#### 1. 大小寫轉換
```cpp
// 方法 1: 使用標準函數
char c = 'A';
char lower = tolower(c);        // 'a'
char upper = toupper(c);        // 'A'

// 方法 2: 使用 ASCII 差值
char toLower(char c) {
    if (c >= 'A' && c <= 'Z')
        return c + 32;
    return c;
}

char toUpper(char c) {
    if (c >= 'a' && c <= 'z')
        return c - 32;
    return c;
}

// 方法 3: 位運算技巧（最快）
char toggleCase(char c) {
    return c ^ 32;              // 或 c ^ ' '
}
// 'A' ^ 32 = 'a'
// 'a' ^ 32 = 'A'

// 強制轉小寫：c |= 32;  或 c |= ' ';
// 強制轉大寫：c &= ~32; 或 c &= '_';
```

**原理解釋：**
```
'A' = 01000001
'a' = 01100001
差異 = 00100000 = 32 = ' '

XOR 32: 翻轉第 6 位，實現大小寫轉換
OR  32: 設置第 6 位為 1，強制小寫
AND ~32: 設置第 6 位為 0，強制大寫
```

#### 2. 判斷字元類型
```cpp
bool isDigit(char c) {
    return c >= '0' && c <= '9';
}

bool isLower(char c) {
    return c >= 'a' && c <= 'z';
}

bool isUpper(char c) {
    return c >= 'A' && c <= 'Z';
}

bool isAlpha(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

bool isAlnum(char c) {
    return isAlpha(c) || isDigit(c);
}
```

#### 3. 字元轉數字
```cpp
int charToDigit(char c) {
    return c - '0';             // '5' -> 5
}

char digitToChar(int d) {
    return d + '0';             // 5 -> '5'
}

// 字母轉索引（0-25）
int letterToIndex(char c) {
    if (c >= 'a' && c <= 'z')
        return c - 'a';
    return c - 'A';
}
```

## Unicode 與 UTF-8 簡介

### ASCII 的限制
- 只能表示 128 個字元（7 位）
- 無法表示中文、日文等非英語字元

### Unicode
- 為世界上所有字元分配唯一編碼
- 範圍：U+0000 到 U+10FFFF（超過 100 萬個碼位）
- 常見平面：
  - BMP（基本多文種平面）：U+0000 到 U+FFFF
  - 中文常用字：U+4E00 到 U+9FFF

### UTF-8 編碼
- 可變長度編碼：1-4 個位元組
- ASCII 相容：單位元組字元與 ASCII 相同
- 編碼規則：

```
1 位元組: 0xxxxxxx                    (ASCII)
2 位元組: 110xxxxx 10xxxxxx
3 位元組: 1110xxxx 10xxxxxx 10xxxxxx  (中文常用)
4 位元組: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

### C++ 中處理 UTF-8

```cpp
// 判斷 UTF-8 字元長度
int utf8CharLen(unsigned char c) {
    if ((c & 0x80) == 0) return 1;      // 0xxxxxxx
    if ((c & 0xE0) == 0xC0) return 2;   // 110xxxxx
    if ((c & 0xF0) == 0xE0) return 3;   // 1110xxxx
    if ((c & 0xF8) == 0xF0) return 4;   // 11110xxx
    return 1;                            // 錯誤，當作 1
}

// 計算 UTF-8 字串的字元數（不是位元組數）
int utf8Length(const string& s) {
    int count = 0;
    for (int i = 0; i < s.length(); ) {
        int len = utf8CharLen(s[i]);
        i += len;
        count++;
    }
    return count;
}

// 示例
string s = "Hello世界";
cout << s.length() << endl;             // 11 (位元組)
cout << utf8Length(s) << endl;          // 7 (字元)
```

**注意事項：**
- LeetCode 等平台通常使用 ASCII 或明確說明編碼
- 競賽題目若涉及中文，會特別說明處理方式
- 除非特別要求，演算法題目通常假設 ASCII

## 字串操作的時間複雜度

理解時間複雜度對優化程式碼至關重要：

### 1. 連接（Concatenation）

```cpp
// 方法 1: 逐個連接 - O(n²)
string result = "";
for (int i = 0; i < n; i++) {
    result += str[i];           // 每次都會複製整個字串！
}

// 方法 2: 預先分配 - O(n)
string result;
result.reserve(totalLength);    // 預先分配空間
for (int i = 0; i < n; i++) {
    result += str[i];
}

// 方法 3: stringstream - O(n)
stringstream ss;
for (int i = 0; i < n; i++) {
    ss << str[i];
}
string result = ss.str();

// 方法 4: 直接構建 - O(n)
vector<string> parts;
// ... 收集所有部分 ...
string result = accumulate(parts.begin(), parts.end(), string(""));
```

### 2. 子串（Substring）

```cpp
string s = "Hello World";

// substr - O(k)，k 為子串長度
string sub = s.substr(6, 5);    // "World"，複製 5 個字元

// string_view (C++17) - O(1)
#include <string_view>
string_view sv(s);
string_view sub_view = sv.substr(6, 5);  // 不複製，只是視圖
```

### 3. 比較（Comparison）

```cpp
string s1 = "Hello";
string s2 = "World";

// 相等比較 - O(n)，最壞情況需要比較所有字元
bool eq = (s1 == s2);

// 字典序比較 - O(n)
int cmp = s1.compare(s2);

// 優化：先比較長度
if (s1.length() != s2.length()) {
    // 不相等
} else {
    bool eq = (s1 == s2);
}
```

### 4. 查找（Search）

```cpp
string text = "abcdefg";
string pattern = "cde";

// find - O(nm)，樸素算法
int pos = text.find(pattern);

// 進階算法（後續章節詳述）：
// KMP: O(n + m)
// Rabin-Karp: O(n + m) 平均
// Boyer-Moore: O(n/m) 最好，O(nm) 最壞
```

## 常見字串技巧

### 1. 雙指針（Two Pointers）

常用於回文判斷、字串反轉：

```cpp
// 回文判斷
bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right])
            return false;
        left++;
        right--;
    }
    return true;
}

// 原地反轉
void reverse(string& s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}

// 移除重複字元（雙指針 - 快慢指針）
string removeDuplicates(string s) {
    int slow = 0;
    for (int fast = 0; fast < s.length(); fast++) {
        if (fast == 0 || s[fast] != s[fast - 1]) {
            s[slow++] = s[fast];
        }
    }
    return s.substr(0, slow);
}
```

### 2. 滑動窗口（Sliding Window）

用於子串問題：

```cpp
// 最長無重複字元子串
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> window;
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        window[s[right]]++;

        // 縮小窗口直到無重複
        while (window[s[right]] > 1) {
            window[s[left]]--;
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

// 固定大小滑動窗口
vector<int> findAnagrams(string s, string p) {
    vector<int> result;
    if (s.length() < p.length()) return result;

    vector<int> pCount(26, 0), sCount(26, 0);
    for (char c : p) pCount[c - 'a']++;

    for (int i = 0; i < s.length(); i++) {
        sCount[s[i] - 'a']++;

        if (i >= p.length()) {
            sCount[s[i - p.length()] - 'a']--;
        }

        if (i >= p.length() - 1 && pCount == sCount) {
            result.push_back(i - p.length() + 1);
        }
    }
    return result;
}
```

### 3. Hash Map 計數

用於字母異位詞、字元統計：

```cpp
// 字母異位詞判斷
bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;

    unordered_map<char, int> count;
    for (char c : s) count[c]++;
    for (char c : t) {
        if (--count[c] < 0) return false;
    }
    return true;
}

// 陣列計數（更快，僅限小寫字母）
bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;

    vector<int> count(26, 0);
    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }

    for (int c : count) {
        if (c != 0) return false;
    }
    return true;
}

// 分組字母異位詞
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;

    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }

    vector<vector<string>> result;
    for (auto& [key, group] : groups) {
        result.push_back(group);
    }
    return result;
}
```

### 4. StringBuilder / stringstream 優化

避免重複連接的 O(n²) 複雜度：

```cpp
// 錯誤：O(n²)
string build(vector<string>& words) {
    string result = "";
    for (string& word : words) {
        result += word;         // 每次都複製整個 result！
    }
    return result;
}

// 正確：O(n)
string build(vector<string>& words) {
    stringstream ss;
    for (string& word : words) {
        ss << word;
    }
    return ss.str();
}

// 或使用 reserve
string build(vector<string>& words) {
    int totalLen = 0;
    for (string& word : words) totalLen += word.length();

    string result;
    result.reserve(totalLen);   // 預先分配
    for (string& word : words) {
        result += word;
    }
    return result;
}
```

## 常見陷阱與注意事項

### 1. 字串不可變 vs 可變

```cpp
// C++ string 是可變的
string s = "Hello";
s[0] = 'h';                     // OK

// 但字串字面量是常量
char* str = "Hello";
str[0] = 'h';                   // 錯誤！運行時崩潰

const char* str = "Hello";      // 正確聲明
```

### 2. 越界存取

```cpp
string s = "Hello";

// 方法 1: [] 不檢查邊界（快但不安全）
char c = s[10];                 // 未定義行為！

// 方法 2: at() 檢查邊界（安全但稍慢）
try {
    char c = s.at(10);
} catch (out_of_range& e) {
    // 處理錯誤
}
```

### 3. find 的返回值

```cpp
string s = "Hello";
int pos = s.find("x");

if (pos == -1) {                // 錯誤！
    // find 返回 string::npos (通常是 -1 的無符號版本)
}

if (pos == string::npos) {      // 正確
    // 未找到
}
```

### 4. substr 的參數

```cpp
string s = "Hello World";

// substr(pos, len) - 從 pos 開始，長度為 len
string sub1 = s.substr(6, 5);   // "World"
string sub2 = s.substr(6);      // "World"（到結尾）

// 注意越界
string sub3 = s.substr(20);     // 拋出異常或未定義行為
```

## 效能優化技巧總結

| 操作 | 慢 | 快 |
|------|----|----|
| 連接 | `s += str` (迴圈中) | `stringstream` 或 `reserve()` |
| 比較 | 直接比較長字串 | 先比長度、Hash |
| 查找 | 樸素 `find()` | KMP、Rabin-Karp |
| 子串 | 反覆 `substr()` | `string_view` (C++17) |
| 轉換 | `to_string()` (多次) | `stringstream` (一次) |

## 學習路線圖

```
基礎操作
   ├── 反轉、大小寫轉換
   ├── 分割、連接
   └── 字元統計

雙指針 & 滑動窗口
   ├── 回文問題
   ├── 無重複子串
   └── 字母異位詞

模式匹配
   ├── KMP 算法
   ├── Rabin-Karp
   ├── Boyer-Moore
   └── Z-function

進階主題
   ├── 字串雜湊
   ├── 後綴陣列/樹
   ├── Manacher (最長回文)
   └── AC 自動機 (多模式匹配)
```

## 下一步

在接下來的章節中，我們將深入探討：
1. **字串操作** - 基本操作與常見模式
2. **回文問題** - 中心擴展、DP、Manacher
3. **模式匹配算法** - KMP、Rabin-Karp、Boyer-Moore
4. **進階結構** - 後綴樹/陣列、字串雜湊、AC 自動機

讓我們開始字串演算法的精彩旅程！
