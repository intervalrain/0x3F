---
title: "12. String Compression (*)"
order: 12
description: "字串壓縮算法"
tags: ["compression", "rle", "lzw", "huffman", "advanced"]
---

# 12. String Compression

字串壓縮是數據壓縮的重要分支,通過減少數據冗餘來節省存儲空間和傳輸帶寬。本章介紹常見的字串壓縮算法。

> **標註 (*):** 本章為進階主題,重點介紹概念和基本實現,完整的壓縮算法較為複雜。

## Run-Length Encoding (RLE)

### 原理

將連續重複的字元編碼為 (字元, 重複次數)。

### 基本實現

```cpp
string rleEncode(string s) {
    if (s.empty()) return "";

    string result;
    int count = 1;

    for (int i = 1; i < s.length(); i++) {
        if (s[i] == s[i - 1]) {
            count++;
        } else {
            result += s[i - 1];
            result += to_string(count);
            count = 1;
        }
    }

    // 最後一組
    result += s.back();
    result += to_string(count);

    return result;
}

string rleDecode(string s) {
    string result;
    int i = 0;

    while (i < s.length()) {
        char c = s[i++];
        int count = 0;

        while (i < s.length() && isdigit(s[i])) {
            count = count * 10 + (s[i] - '0');
            i++;
        }

        result += string(count, c);
    }

    return result;
}

// 示例:
// "aaabbbccc" -> "a3b3c3"
// "abcde" -> "a1b1c1d1e1" (反而變長!)
```

### 優化版本

只在重複次數 > 1 時編碼:

```cpp
string rleEncodeOptimized(string s) {
    if (s.empty()) return "";

    string result;
    int count = 1;

    for (int i = 1; i < s.length(); i++) {
        if (s[i] == s[i - 1]) {
            count++;
        } else {
            result += s[i - 1];
            if (count > 1) {
                result += to_string(count);
            }
            count = 1;
        }
    }

    result += s.back();
    if (count > 1) {
        result += to_string(count);
    }

    return result;
}

// 示例:
// "aaabbbccc" -> "a3b3c3"
// "abcde" -> "abcde" (不變)
```

### 適用場景

- **圖像壓縮:** BMP, PCX 等簡單格式
- **傳真:** 大量空白區域
- **數據庫:** 稀疏列

### 侷限性

- 對無重複或低重複數據效果差
- 可能導致數據膨脹

## Lempel-Ziv-Welch (LZW) 算法

### 原理

利用字典編碼,動態構建字串到代碼的映射。

### 概念說明

```
編碼過程:
1. 初始化字典 (單字元)
2. 讀入字串,找最長已知前綴
3. 輸出前綴的代碼
4. 將前綴+下一字元加入字典
5. 重複 2-4

解碼過程:
1. 初始化字典
2. 讀入代碼,輸出對應字串
3. 將上一字串+當前字串首字元加入字典
4. 重複 2-3
```

### 簡化實現 (概念)

```cpp
class LZW {
private:
    static const int MAX_CODE = 4096;

    map<string, int> encodeDict;
    map<int, string> decodeDict;

    void initEncode() {
        encodeDict.clear();
        for (int i = 0; i < 256; i++) {
            encodeDict[string(1, i)] = i;
        }
    }

    void initDecode() {
        decodeDict.clear();
        for (int i = 0; i < 256; i++) {
            decodeDict[i] = string(1, i);
        }
    }

public:
    vector<int> encode(string s) {
        initEncode();
        vector<int> result;

        string current = "";
        int nextCode = 256;

        for (char c : s) {
            string combined = current + c;

            if (encodeDict.count(combined)) {
                current = combined;
            } else {
                result.push_back(encodeDict[current]);

                if (nextCode < MAX_CODE) {
                    encodeDict[combined] = nextCode++;
                }

                current = string(1, c);
            }
        }

        if (!current.empty()) {
            result.push_back(encodeDict[current]);
        }

        return result;
    }

    string decode(vector<int>& codes) {
        initDecode();
        string result;

        int prev = codes[0];
        result += decodeDict[prev];

        int nextCode = 256;

        for (int i = 1; i < codes.size(); i++) {
            int curr = codes[i];
            string entry;

            if (decodeDict.count(curr)) {
                entry = decodeDict[curr];
            } else if (curr == nextCode) {
                entry = decodeDict[prev] + decodeDict[prev][0];
            } else {
                throw runtime_error("Invalid code");
            }

            result += entry;

            if (nextCode < MAX_CODE) {
                decodeDict[nextCode++] = decodeDict[prev] + entry[0];
            }

            prev = curr;
        }

        return result;
    }
};

// 示例:
// "TOBEORNOTTOBEORTOBEORNOT"
// 編碼為數字序列,通常比原字串小
```

### 應用

- **GIF 圖像格式**
- **TIFF 格式的一種壓縮方式**
- **Unix compress 命令**

## Huffman 編碼

### 原理

基於字元頻率的可變長度編碼,頻率高的字元用短編碼。

### 概念 (詳見貪心章節)

```
構建過程:
1. 統計字元頻率
2. 構建 Huffman 樹 (貪心)
3. 左邊為 0,右邊為 1
4. 從根到葉的路徑即為編碼

示例:
字元: A(5), B(2), C(1), D(1)

Huffman 樹:
        9
       / \
      5   4
     A   / \
        2   2
       B  / \
         C(1) D(1)

編碼:
A: 0
B: 10
C: 110
D: 111
```

### 簡化實現 (概念)

```cpp
struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode *left, *right;

    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

class Huffman {
private:
    HuffmanNode* root;
    map<char, string> codes;

    void buildCodes(HuffmanNode* node, string code) {
        if (!node) return;

        if (!node->left && !node->right) {
            codes[node->ch] = code;
            return;
        }

        buildCodes(node->left, code + "0");
        buildCodes(node->right, code + "1");
    }

public:
    void buildTree(string s) {
        // 統計頻率
        map<char, int> freq;
        for (char c : s) freq[c]++;

        // 優先隊列 (最小堆)
        auto cmp = [](HuffmanNode* a, HuffmanNode* b) {
            return a->freq > b->freq;
        };
        priority_queue<HuffmanNode*, vector<HuffmanNode*>, decltype(cmp)> pq(cmp);

        for (auto& [c, f] : freq) {
            pq.push(new HuffmanNode(c, f));
        }

        // 構建樹
        while (pq.size() > 1) {
            auto left = pq.top(); pq.pop();
            auto right = pq.top(); pq.pop();

            auto parent = new HuffmanNode('\0', left->freq + right->freq);
            parent->left = left;
            parent->right = right;

            pq.push(parent);
        }

        root = pq.top();

        // 構建編碼表
        buildCodes(root, "");
    }

    string encode(string s) {
        string result;
        for (char c : s) {
            result += codes[c];
        }
        return result;
    }

    string decode(string bits) {
        string result;
        HuffmanNode* curr = root;

        for (char bit : bits) {
            if (bit == '0') {
                curr = curr->left;
            } else {
                curr = curr->right;
            }

            if (!curr->left && !curr->right) {
                result += curr->ch;
                curr = root;
            }
        }

        return result;
    }
};

// 應用: ZIP, JPEG, MP3 等
```

## LeetCode 題目詳解

### [443. String Compression](https://leetcode.com/problems/string-compression/)

RLE 的變體:

```cpp
class Solution {
public:
    int compress(vector<char>& chars) {
        int write = 0, read = 0;

        while (read < chars.size()) {
            char curr = chars[read];
            int count = 0;

            // 計數
            while (read < chars.size() && chars[read] == curr) {
                read++;
                count++;
            }

            // 寫入字元
            chars[write++] = curr;

            // 寫入次數 (>1 時)
            if (count > 1) {
                string countStr = to_string(count);
                for (char c : countStr) {
                    chars[write++] = c;
                }
            }
        }

        return write;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(1)
```

### [38. Count and Say](https://leetcode.com/problems/count-and-say/)

RLE 的遞歸應用:

```cpp
class Solution {
public:
    string countAndSay(int n) {
        if (n == 1) return "1";

        string prev = countAndSay(n - 1);
        string result;

        int count = 1;
        for (int i = 1; i < prev.length(); i++) {
            if (prev[i] == prev[i - 1]) {
                count++;
            } else {
                result += to_string(count);
                result += prev[i - 1];
                count = 1;
            }
        }

        result += to_string(count);
        result += prev.back();

        return result;
    }
};

// 示例:
// n=1: "1"
// n=2: "11" (一個1)
// n=3: "21" (兩個1)
// n=4: "1211" (一個2,一個1)
// n=5: "111221" (一個1,一個2,兩個1)
```

### [271. Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/)

長度前綴編碼:

```cpp
class Codec {
public:
    // 編碼: "長度#字串"
    string encode(vector<string>& strs) {
        string result;
        for (string& s : strs) {
            result += to_string(s.length()) + "#" + s;
        }
        return result;
    }

    // 解碼
    vector<string> decode(string s) {
        vector<string> result;
        int i = 0;

        while (i < s.length()) {
            // 讀取長度
            int j = i;
            while (s[j] != '#') j++;

            int len = stoi(s.substr(i, j - i));
            i = j + 1;

            // 讀取字串
            result.push_back(s.substr(i, len));
            i += len;
        }

        return result;
    }
};

// 時間複雜度: O(n)
// 空間複雜度: O(n)
```

## 壓縮算法對比

| 算法 | 壓縮率 | 速度 | 適用場景 |
|------|--------|------|---------|
| RLE | 低-中 | 快 | 重複數據 |
| LZW | 中-高 | 中 | 通用文本 |
| Huffman | 中-高 | 快 | 頻率分布不均 |
| Deflate (ZIP) | 高 | 中 | 通用 (LZ77+Huffman) |
| LZMA | 很高 | 慢 | 高壓縮需求 |

## 實務應用

### 1. 文件壓縮

```
ZIP: Deflate (LZ77 + Huffman)
GZIP: Deflate
7-Zip: LZMA
RAR: 專有算法
```

### 2. 圖像壓縮

```
無損:
- PNG: Deflate
- GIF: LZW
- TIFF: 多種選項 (RLE, LZW 等)

有損:
- JPEG: DCT + Huffman
- WebP: VP8
```

### 3. 數據傳輸

```
HTTP 壓縮: gzip, deflate, br (Brotli)
數據庫: 列壓縮 (RLE 等)
```

## 常見陷阱

### 1. 數據膨脹

```cpp
// RLE 對無重複數據可能導致膨脹
string s = "abcdefgh";
string compressed = rleEncode(s);
// compressed 可能比 s 更長!

// 解決: 檢查壓縮後大小,必要時保留原始數據
```

### 2. 字典大小限制

```cpp
// LZW 需要限制字典大小
const int MAX_CODE = 4096;

if (nextCode < MAX_CODE) {
    dict[combined] = nextCode++;
}
```

### 3. Huffman 編碼的存儲

```cpp
// 需要存儲編碼表或 Huffman 樹
// 對小數據,開銷可能超過收益
```

## 練習建議

1. **實現 RLE:** 從最簡單的 RLE 開始
2. **理解 LZW:** 手工模擬編碼/解碼過程
3. **學習 Huffman:** 結合貪心算法理解
4. **對比性能:** 在不同數據上測試壓縮率
5. **實際應用:** 實現簡單的文件壓縮工具

## 複雜度總結

| 算法 | 編碼時間 | 解碼時間 | 空間 |
|------|---------|---------|------|
| RLE | O(n) | O(n) | O(1) |
| LZW | O(n) | O(n) | O(dict) |
| Huffman | O(n log n) | O(n) | O(n) |

## 延伸閱讀

- 相關主題: **貪心算法** (Huffman)
- 進階主題: **數據壓縮理論**, **信息論**
- 實務應用: **zlib**, **LZ4**, **Brotli**
- 參考: **DEFLATE**, **LZMA** 算法

## 總結

字串壓縮算法各有特點:
- **RLE:** 簡單,適合重複數據
- **LZW:** 通用,無需預知統計信息
- **Huffman:** 高效,需要頻率信息

選擇合適的算法取決於:
- 數據特性
- 壓縮率要求
- 速度要求
- 內存限制

## 恭喜完成 Section 14!

這是本計畫的最後一個 Section。你已經掌握了從基礎字串操作到高級模式匹配算法的完整知識體系!

**Section 14 涵蓋:**
- 字串基礎與操作
- 回文問題
- 字串匹配 (KMP, Rabin-Karp, Boyer-Moore, Z-function)
- 進階結構 (後綴樹/陣列, Manacher)
- 實用技術 (字串雜湊, AC 自動機)
- 壓縮算法

**整個計畫的 14 個 Sections 全部完成!**
