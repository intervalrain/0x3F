---
title: "1. String Manipulation"
order: 1
description: "字串基本操作與常見模式"
tags: ["string", "manipulation", "two-pointers"]
---

# 1. String Manipulation

字串操作是最基礎也是最常見的問題類型。本章將介紹各種基本操作、字元統計、以及字串比較的技巧。

## 基本操作

### 1. 反轉字串（Reverse String）

#### 方法 1：雙指針

```cpp
// 原地反轉
void reverseString(string& s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

#### 方法 2：使用標準函數

```cpp
void reverseString(string& s) {
    reverse(s.begin(), s.end());
}
```

#### 視覺化過程

```
初始: H e l l o
      ↑       ↑
      L       R

步驟1: o e l l H
        ↑   ↑
        L   R

步驟2: o l l e H
          ↑↑
          LR

結果: o l l e H
```

### 2. 大小寫轉換

```cpp
// 轉小寫
string toLowerCase(string s) {
    for (char& c : s) {
        if (c >= 'A' && c <= 'Z')
            c = c + 32;         // 或 c |= 32
    }
    return s;
}

// 轉大寫
string toUpperCase(string s) {
    for (char& c : s) {
        if (c >= 'a' && c <= 'z')
            c = c - 32;         // 或 c &= ~32
    }
    return s;
}

// 切換大小寫
string toggleCase(string s) {
    for (char& c : s) {
        if (isalpha(c))
            c ^= 32;            // XOR 翻轉第 6 位
    }
    return s;
}

// 首字母大寫
string capitalize(string s) {
    if (!s.empty() && s[0] >= 'a' && s[0] <= 'z')
        s[0] -= 32;
    return s;
}
```

### 3. 字串分割（Split）

C++ 沒有內建的 split 函數，但可以自己實現：

```cpp
// 方法 1: 使用 stringstream
vector<string> split(string s, char delimiter = ' ') {
    vector<string> tokens;
    stringstream ss(s);
    string token;

    while (getline(ss, token, delimiter)) {
        if (!token.empty())     // 跳過空字串
            tokens.push_back(token);
    }
    return tokens;
}

// 方法 2: 手動分割
vector<string> split(string s, char delimiter = ' ') {
    vector<string> tokens;
    string current = "";

    for (char c : s) {
        if (c == delimiter) {
            if (!current.empty()) {
                tokens.push_back(current);
                current = "";
            }
        } else {
            current += c;
        }
    }

    if (!current.empty())
        tokens.push_back(current);

    return tokens;
}

// 示例
string s = "apple,banana,cherry";
vector<string> fruits = split(s, ',');
// fruits = ["apple", "banana", "cherry"]
```

### 4. 字串連接（Join）

```cpp
// 方法 1: 使用迴圈
string join(vector<string>& strs, string delimiter = " ") {
    if (strs.empty()) return "";

    string result = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        result += delimiter + strs[i];
    }
    return result;
}

// 方法 2: 使用 stringstream（更高效）
string join(vector<string>& strs, string delimiter = " ") {
    if (strs.empty()) return "";

    stringstream ss;
    ss << strs[0];
    for (int i = 1; i < strs.size(); i++) {
        ss << delimiter << strs[i];
    }
    return ss.str();
}

// 示例
vector<string> words = {"Hello", "World", "C++"};
string sentence = join(words, " ");
// sentence = "Hello World C++"
```

### 5. 去除空格（Trim）

```cpp
// 去除開頭空格
string trimLeft(string s) {
    int i = 0;
    while (i < s.length() && isspace(s[i]))
        i++;
    return s.substr(i);
}

// 去除結尾空格
string trimRight(string s) {
    int i = s.length() - 1;
    while (i >= 0 && isspace(s[i]))
        i--;
    return s.substr(0, i + 1);
}

// 去除兩端空格
string trim(string s) {
    return trimLeft(trimRight(s));
}

// 原地去除兩端空格（更高效）
string trim(string s) {
    int left = 0, right = s.length() - 1;

    while (left <= right && isspace(s[left]))
        left++;

    while (right >= left && isspace(s[right]))
        right--;

    return s.substr(left, right - left + 1);
}

// 去除所有空格
string removeSpaces(string s) {
    string result;
    for (char c : s) {
        if (!isspace(c))
            result += c;
    }
    return result;
}

// 或使用 remove_if（原地操作）
string removeSpaces(string s) {
    s.erase(remove_if(s.begin(), s.end(), ::isspace), s.end());
    return s;
}
```

## 字元統計

### 1. 字母異位詞（Anagram）

兩個字串包含相同的字元，只是順序不同。

#### 方法 1：排序後比較

```cpp
bool isAnagram(string s, string t) {
    if (s.length() != t.length())
        return false;

    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    return s == t;
}

// 時間複雜度：O(n log n)
// 空間複雜度：O(1) 或 O(n)（取決於排序實現）
```

#### 方法 2：字元計數（Hash Map）

```cpp
bool isAnagram(string s, string t) {
    if (s.length() != t.length())
        return false;

    unordered_map<char, int> count;

    for (char c : s)
        count[c]++;

    for (char c : t) {
        count[c]--;
        if (count[c] < 0)
            return false;
    }

    return true;
}

// 時間複雜度：O(n)
// 空間複雜度：O(k)，k 為字元集大小
```

#### 方法 3：陣列計數（僅限小寫字母）

```cpp
bool isAnagram(string s, string t) {
    if (s.length() != t.length())
        return false;

    vector<int> count(26, 0);

    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }

    for (int c : count) {
        if (c != 0)
            return false;
    }

    return true;
}

// 時間複雜度：O(n)
// 空間複雜度：O(1)（固定 26）
```

### 2. 同構字串（Isomorphic Strings）

兩個字串的字元可以一對一映射。

```cpp
bool isIsomorphic(string s, string t) {
    if (s.length() != t.length())
        return false;

    unordered_map<char, char> mapST;    // s -> t 的映射
    unordered_map<char, char> mapTS;    // t -> s 的映射

    for (int i = 0; i < s.length(); i++) {
        char c1 = s[i], c2 = t[i];

        // 檢查 s -> t 的映射
        if (mapST.count(c1)) {
            if (mapST[c1] != c2)
                return false;
        } else {
            mapST[c1] = c2;
        }

        // 檢查 t -> s 的映射
        if (mapTS.count(c2)) {
            if (mapTS[c2] != c1)
                return false;
        } else {
            mapTS[c2] = c1;
        }
    }

    return true;
}

// 示例：
// "egg" 和 "add" -> true (e->a, g->d)
// "foo" 和 "bar" -> false (o 映射到 o 和 r)

// 時間複雜度：O(n)
// 空間複雜度：O(k)，k 為字元集大小
```

**優化版本（使用陣列）：**

```cpp
bool isIsomorphic(string s, string t) {
    vector<int> mapS(256, -1), mapT(256, -1);

    for (int i = 0; i < s.length(); i++) {
        if (mapS[s[i]] != mapT[t[i]])
            return false;

        mapS[s[i]] = mapT[t[i]] = i;
    }

    return true;
}

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

## 字串比較

### 1. 字典序比較

```cpp
// 內建比較
int cmp = s1.compare(s2);
// cmp < 0: s1 < s2
// cmp = 0: s1 == s2
// cmp > 0: s1 > s2

// 或使用運算符
if (s1 < s2) { /* ... */ }
if (s1 == s2) { /* ... */ }

// 手動實現字典序比較
int lexicographicCompare(string s1, string s2) {
    int i = 0;
    int minLen = min(s1.length(), s2.length());

    while (i < minLen) {
        if (s1[i] != s2[i])
            return s1[i] - s2[i];
        i++;
    }

    return s1.length() - s2.length();
}
```

### 2. 自訂比較器

```cpp
// 按長度排序，長度相同按字典序
bool compareByLength(const string& a, const string& b) {
    if (a.length() != b.length())
        return a.length() < b.length();
    return a < b;
}

vector<string> words = {"apple", "pie", "banana", "cat"};
sort(words.begin(), words.end(), compareByLength);
// 結果: ["cat", "pie", "apple", "banana"]

// Lambda 版本
sort(words.begin(), words.end(), [](const string& a, const string& b) {
    return a.length() < b.length();
});
```

### 3. 忽略大小寫比較

```cpp
bool equalsIgnoreCase(string s1, string s2) {
    if (s1.length() != s2.length())
        return false;

    for (int i = 0; i < s1.length(); i++) {
        if (tolower(s1[i]) != tolower(s2[i]))
            return false;
    }

    return true;
}

// 或先轉換再比較
bool equalsIgnoreCase(string s1, string s2) {
    transform(s1.begin(), s1.end(), s1.begin(), ::tolower);
    transform(s2.begin(), s2.end(), s2.begin(), ::tolower);
    return s1 == s2;
}
```

## LeetCode 題目詳解

### [344. Reverse String](https://leetcode.com/problems/reverse-string/)

**題目：** 反轉字元陣列（原地操作）。

```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            swap(s[left++], s[right--]);
        }
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

### [151. Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)

**題目：** 反轉字串中的單詞順序，去除多餘空格。

```cpp
class Solution {
public:
    string reverseWords(string s) {
        // 步驟 1: 去除多餘空格
        int i = 0, j = 0;
        while (j < s.length()) {
            // 跳過空格
            while (j < s.length() && s[j] == ' ') j++;

            // 複製單詞
            while (j < s.length() && s[j] != ' ')
                s[i++] = s[j++];

            // 跳過空格
            while (j < s.length() && s[j] == ' ') j++;

            // 添加單個空格（若不是最後）
            if (j < s.length())
                s[i++] = ' ';
        }
        s.resize(i);

        // 步驟 2: 反轉整個字串
        reverse(s.begin(), s.end());

        // 步驟 3: 反轉每個單詞
        int start = 0;
        for (int k = 0; k <= s.length(); k++) {
            if (k == s.length() || s[k] == ' ') {
                reverse(s.begin() + start, s.begin() + k);
                start = k + 1;
            }
        }

        return s;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

**視覺化過程：**
```
輸入: "  hello   world  "

步驟1 (去除空格): "hello world"

步驟2 (反轉整個): "dlrow olleh"

步驟3 (反轉單詞): "world hello"
```

### [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)

**題目：** 判斷兩個字串是否為字母異位詞。

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length())
            return false;

        vector<int> count(26, 0);

        for (int i = 0; i < s.length(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }

        for (int c : count) {
            if (c != 0)
                return false;
        }

        return true;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

### [205. Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings/)

**題目：** 判斷兩個字串是否同構。

```cpp
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        vector<int> mapS(256, -1), mapT(256, -1);

        for (int i = 0; i < s.length(); i++) {
            if (mapS[s[i]] != mapT[t[i]])
                return false;

            mapS[s[i]] = mapT[t[i]] = i;
        }

        return true;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

**視覺化過程：**
```
s = "egg", t = "add"

i=0: e->a, mapS[e]=0, mapT[a]=0
     e a
     0 0 ✓

i=1: g->d, mapS[g]=1, mapT[d]=1
     e a  g d
     0 0  1 1 ✓

i=2: g->d, mapS[g]=1, mapT[d]=1
     一致 ✓

結果: true
```

### [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/)

**題目：** 將字母異位詞分組。

```cpp
class Solution {
public:
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
};

// 時間複雜度：O(n * k log k)，n 為字串數，k 為平均長度
// 空間複雜度：O(n * k)
```

**優化版本（字元計數作為 key）：**

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;

        for (string& s : strs) {
            vector<int> count(26, 0);
            for (char c : s)
                count[c - 'a']++;

            // 將計數轉為字串作為 key
            string key = "";
            for (int i = 0; i < 26; i++) {
                if (count[i] > 0) {
                    key += string(1, 'a' + i) + to_string(count[i]);
                }
            }

            groups[key].push_back(s);
        }

        vector<vector<string>> result;
        for (auto& [key, group] : groups) {
            result.push_back(group);
        }

        return result;
    }
};

// 時間複雜度：O(n * k)
// 空間複雜度：O(n * k)
```

### [387. First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/)

**題目：** 找到字串中第一個不重複的字元。

```cpp
class Solution {
public:
    int firstUniqChar(string s) {
        vector<int> count(26, 0);

        // 統計每個字元出現次數
        for (char c : s)
            count[c - 'a']++;

        // 找到第一個出現次數為 1 的字元
        for (int i = 0; i < s.length(); i++) {
            if (count[s[i] - 'a'] == 1)
                return i;
        }

        return -1;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

**優化版本（記錄索引）：**

```cpp
class Solution {
public:
    int firstUniqChar(string s) {
        vector<int> index(26, -1);

        // 第一次掃描：記錄第一次出現的索引
        for (int i = 0; i < s.length(); i++) {
            int idx = s[i] - 'a';
            if (index[idx] == -1) {
                index[idx] = i;
            } else {
                index[idx] = -2;    // 標記為重複
            }
        }

        // 找到最小的有效索引
        int minIndex = INT_MAX;
        for (int idx : index) {
            if (idx >= 0)
                minIndex = min(minIndex, idx);
        }

        return minIndex == INT_MAX ? -1 : minIndex;
    }
};

// 時間複雜度：O(n)
// 空間複雜度：O(1)
```

## 常見陷阱與技巧

### 1. 字串連接效能

```cpp
// 錯誤：O(n²)
string result = "";
for (int i = 0; i < n; i++) {
    result += words[i];         // 每次都複製！
}

// 正確：O(n)
stringstream ss;
for (int i = 0; i < n; i++) {
    ss << words[i];
}
string result = ss.str();
```

### 2. 字元陣列 vs string

```cpp
// 使用 vector<char> 時注意
vector<char> chars = {'h', 'e', 'l', 'l', 'o'};
// 轉為 string
string s(chars.begin(), chars.end());

// string 轉為 vector<char>
string s = "hello";
vector<char> chars(s.begin(), s.end());
```

### 3. 原地操作的技巧

```cpp
// 雙指針原地修改
void removeSpaces(string& s) {
    int slow = 0;
    for (int fast = 0; fast < s.length(); fast++) {
        if (s[fast] != ' ') {
            s[slow++] = s[fast];
        }
    }
    s.resize(slow);
}
```

### 4. Unicode 處理

```cpp
// 對於 UTF-8 字串，不能簡單使用 s.length()
string s = "你好";              // 6 位元組，2 個字元
cout << s.length();             // 輸出 6（位元組數）

// 需要正確計算 UTF-8 字元數（參見 introduction.md）
```

## 複雜度總結

| 操作 | 時間複雜度 | 空間複雜度 | 備註 |
|------|-----------|-----------|------|
| 反轉 | O(n) | O(1) | 原地操作 |
| 分割 | O(n) | O(n) | 需額外空間 |
| 連接 | O(n) | O(n) | 使用 stringstream |
| Anagram | O(n) | O(1) | 陣列計數 |
| Isomorphic | O(n) | O(1) | 雙映射 |
| 分組 Anagram | O(n·k log k) | O(n·k) | 排序作為 key |

## 練習建議

1. **基礎操作：** 先熟練掌握反轉、分割、連接等基本操作
2. **字元統計：** 練習使用陣列/Hash Map 進行字元計數
3. **雙指針：** 熟悉原地操作的雙指針技巧
4. **效能優化：** 注意字串連接的效能問題

## 延伸閱讀

- 下一章：**回文問題** - 中心擴展、動態規劃
- 相關主題：**雙指針**、**Hash Map**
- 進階主題：**字串匹配算法**（KMP、Rabin-Karp）
