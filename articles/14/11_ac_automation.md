---
title: '14-11. AC Automation, Subsequence Automation (*)'
order: 11
description: AC 自動機與多模式匹配
tags:
  - ac-automation
  - aho-corasick
  - trie
  - advanced
author: Rain Hu
date: ''
draft: true
---

# 11. AC Automation, Subsequence Automation

AC 自動機 (Aho-Corasick Automaton) 是一種高效的多模式匹配算法,結合了 Trie 和 KMP 的思想,可以同時匹配多個模式串。

> **標註 (*):** 本章為進階主題,重點介紹概念和應用場景,完整實現較為複雜。

## AC 自動機簡介

### 問題定義

**多模式匹配問題:**
- 輸入: 文本串 text, 模式串集合 patterns = {p1, p2, ..., pk}
- 輸出: 每個模式串在文本中的所有出現位置

### 傳統解法 vs AC 自動機

```
傳統 (KMP × k):
  時間複雜度: O((n + m) × k)
  對每個模式串分別執行 KMP

AC 自動機:
  時間複雜度: O(n + m + z)
  n = text 長度
  m = 所有 patterns 總長度
  z = 匹配總數
```

## 核心概念

### 1. Trie (字典樹)

首先構建所有模式串的 Trie:

```
patterns = ["he", "she", "his", "hers"]

Trie:
        root
       / | \
      h  s
     /|   \
    e i    h
    |  \    \
    r  s     e
    |
    s
```

### 2. 失配指針 (Fail Pointer)

類似 KMP 的 next 陣列,但在 Trie 上:

```
fail[node] = 另一個節點,表示當前節點失配時應跳轉的位置

構建規則 (BFS):
1. root 的所有子節點的 fail 指向 root
2. 其他節點: fail[node] = trie[fail[node.parent]][node.char]
```

### 3. 匹配過程

```
在文本中搜尋:
1. 從 root 開始
2. 對每個字元 c:
   - 若當前節點有邊 c, 沿邊走
   - 否則,沿 fail 指針走,直到找到邊 c 或回到 root
3. 檢查當前節點及其 fail 鏈上的所有節點是否為模式串結尾
```

## 簡化實現 (概念為主)

```cpp
struct ACAutomaton {
    struct Node {
        map<char, int> children;
        int fail = 0;
        vector<int> output;  // 此節點結束的模式串編號
    };

    vector<Node> trie;

    ACAutomaton() {
        trie.push_back(Node());  // root
    }

    // 插入模式串
    void insert(string pattern, int id) {
        int curr = 0;
        for (char c : pattern) {
            if (!trie[curr].children.count(c)) {
                trie[curr].children[c] = trie.size();
                trie.push_back(Node());
            }
            curr = trie[curr].children[c];
        }
        trie[curr].output.push_back(id);
    }

    // 構建失配指針 (BFS)
    void buildFail() {
        queue<int> q;

        // root 的子節點的 fail 都指向 root
        for (auto& [c, child] : trie[0].children) {
            trie[child].fail = 0;
            q.push(child);
        }

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (auto& [c, v] : trie[u].children) {
                // 沿著 fail 指針找
                int f = trie[u].fail;
                while (f && !trie[f].children.count(c)) {
                    f = trie[f].fail;
                }

                if (trie[f].children.count(c) && trie[f].children[c] != v) {
                    trie[v].fail = trie[f].children[c];
                } else {
                    trie[v].fail = 0;
                }

                // 繼承 fail 節點的 output
                for (int id : trie[trie[v].fail].output) {
                    trie[v].output.push_back(id);
                }

                q.push(v);
            }
        }
    }

    // 搜尋
    vector<pair<int, int>> search(string text) {
        vector<pair<int, int>> result;  // {模式串 id, 位置}
        int curr = 0;

        for (int i = 0; i < text.length(); i++) {
            char c = text[i];

            // 沿 fail 指針找匹配
            while (curr && !trie[curr].children.count(c)) {
                curr = trie[curr].fail;
            }

            if (trie[curr].children.count(c)) {
                curr = trie[curr].children[c];
            }

            // 輸出所有匹配
            for (int id : trie[curr].output) {
                result.push_back({id, i});
            }
        }

        return result;
    }
};

// 使用示例:
// ACAutomaton ac;
// ac.insert("he", 0);
// ac.insert("she", 1);
// ac.insert("his", 2);
// ac.buildFail();
// auto matches = ac.search("ushers");
```

## 視覺化過程

```
patterns = ["he", "she", "hers"]
text = "ushers"

Trie + Fail:
        root (0)
       /     \
      h(1)   s(4)
     /  \     \
    e(2) e(5)  h(6)
    |          \
    r(3)        e(7)
    |
    s(fail→0)

匹配過程:
u: curr=0
s: curr=4 (s 邊)
h: curr=6 (h 邊)
e: curr=7 (e 邊), 匹配 "she"!
r: curr=0 (fail 回 root), curr=0
s: curr=4

結果: "she" 在位置 3
```

## 應用場景

### 1. 敏感詞過濾

```cpp
class SensitiveWordFilter {
private:
    ACAutomaton ac;
    vector<string> keywords;

public:
    void addKeywords(vector<string>& words) {
        keywords = words;
        for (int i = 0; i < words.size(); i++) {
            ac.insert(words[i], i);
        }
        ac.buildFail();
    }

    string filter(string text) {
        auto matches = ac.search(text);

        // 按位置排序
        sort(matches.begin(), matches.end(),
             [](auto& a, auto& b) { return a.second < b.second; });

        // 替換敏感詞
        string result = text;
        int offset = 0;

        for (auto& [id, pos] : matches) {
            int len = keywords[id].length();
            int actualPos = pos - len + 1 - offset;

            string replacement(len, '*');
            result.replace(actualPos, len, replacement);
            // offset += ...
        }

        return result;
    }
};
```

### 2. 病毒掃描

```cpp
// 檢測文件中是否包含病毒簽名
bool containsVirus(string fileContent, vector<string>& virusSignatures) {
    ACAutomaton ac;
    for (int i = 0; i < virusSignatures.size(); i++) {
        ac.insert(virusSignatures[i], i);
    }
    ac.buildFail();

    auto matches = ac.search(fileContent);
    return !matches.empty();
}
```

### 3. 多關鍵字搜尋

```cpp
// 在大文本中搜尋多個關鍵字
map<string, vector<int>> searchKeywords(
    string text,
    vector<string>& keywords
) {
    ACAutomaton ac;
    for (int i = 0; i < keywords.size(); i++) {
        ac.insert(keywords[i], i);
    }
    ac.buildFail();

    auto matches = ac.search(text);

    map<string, vector<int>> result;
    for (auto& [id, pos] : matches) {
        result[keywords[id]].push_back(pos - keywords[id].length() + 1);
    }

    return result;
}
```

## 子序列自動機 (Subsequence Automaton)

### 概念

預處理字串,支持 O(m) 時間判斷子序列。

### 構建

```cpp
class SubsequenceAutomaton {
private:
    vector<vector<int>> next;  // next[i][c] = 從 i 開始,字元 c 下次出現的位置

public:
    SubsequenceAutomaton(string s) {
        int n = s.length();
        next.assign(n + 1, vector<int>(26, -1));

        // 從後向前構建
        for (int i = n - 1; i >= 0; i--) {
            for (int c = 0; c < 26; c++) {
                next[i][c] = next[i + 1][c];
            }
            next[i][s[i] - 'a'] = i;
        }
    }

    // 判斷 t 是否為 s 的子序列
    bool isSubsequence(string t) {
        int pos = 0;
        for (char c : t) {
            pos = next[pos][c - 'a'];
            if (pos == -1) return false;
            pos++;  // 移到下一個位置
        }
        return true;
    }
};

// 時間複雜度:
// - 構建: O(n × 26)
// - 查詢: O(m), m = t 的長度
```

## LeetCode 題目詳解

### [1032. Stream of Characters](https://leetcode.com/problems/stream-of-characters/)

AC 自動機的直接應用:

```cpp
class StreamChecker {
private:
    struct Node {
        map<char, int> children;
        int fail = 0;
        bool isEnd = false;
    };

    vector<Node> trie;
    string stream;
    int root = 0;

    void insert(string word) {
        reverse(word.begin(), word.end());  // 反轉
        int curr = 0;
        for (char c : word) {
            if (!trie[curr].children.count(c)) {
                trie[curr].children[c] = trie.size();
                trie.push_back(Node());
            }
            curr = trie[curr].children[c];
        }
        trie[curr].isEnd = true;
    }

    void buildFail() {
        queue<int> q;
        for (auto& [c, child] : trie[0].children) {
            trie[child].fail = 0;
            q.push(child);
        }

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (auto& [c, v] : trie[u].children) {
                int f = trie[u].fail;
                while (f && !trie[f].children.count(c)) {
                    f = trie[f].fail;
                }

                if (trie[f].children.count(c) && trie[f].children[c] != v) {
                    trie[v].fail = trie[f].children[c];
                } else {
                    trie[v].fail = 0;
                }

                if (trie[trie[v].fail].isEnd) {
                    trie[v].isEnd = true;
                }

                q.push(v);
            }
        }
    }

public:
    StreamChecker(vector<string>& words) {
        trie.push_back(Node());
        for (string& word : words) {
            insert(word);
        }
        buildFail();
    }

    bool query(char letter) {
        stream += letter;
        int curr = 0;

        for (int i = stream.length() - 1; i >= 0; i--) {
            char c = stream[i];

            while (curr && !trie[curr].children.count(c)) {
                curr = trie[curr].fail;
            }

            if (trie[curr].children.count(c)) {
                curr = trie[curr].children[c];
            }

            if (trie[curr].isEnd) {
                return true;
            }
        }

        return false;
    }
};

// 或使用更簡單的方法:
// 維護固定長度的緩衝區,逐個檢查
```

## 複雜度總結

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 構建 Trie | O(m) | O(m × σ) |
| 構建 Fail | O(m × σ) | - |
| 搜尋 | O(n + z) | - |
| 總體 | O(n + m + z) | O(m × σ) |

其中:
- n = 文本長度
- m = 模式串總長度
- z = 匹配數量
- σ = 字母表大小

## AC 自動機 vs 其他算法

| 算法 | 時間複雜度 | 適用場景 |
|------|-----------|---------|
| KMP × k | O((n+m)×k) | 少量模式串 |
| Rabin-Karp | O(n+m+z) | 多模式,允許碰撞 |
| AC 自動機 | O(n+m+z) | 多模式,精確匹配 |

## 實務建議

### 何時使用 AC 自動機

1. **多模式匹配:** 模式串數量較多 (>10)
2. **敏感詞過濾:** 大量關鍵字
3. **病毒掃描:** 病毒簽名庫
4. **日志分析:** 多關鍵字搜尋

### 何時使用其他方法

1. **少量模式串:** 直接用 KMP 或內建函數
2. **允許近似:** Rabin-Karp
3. **簡單場景:** 暴力或字串庫

## 常見陷阱

### 1. Fail 指針構建

```cpp
// 必須使用 BFS,確保父節點的 fail 已計算
// DFS 會導致錯誤
```

### 2. 輸出繼承

```cpp
// fail 節點的輸出需要繼承
for (int id : trie[trie[v].fail].output) {
    trie[v].output.push_back(id);
}
```

### 3. 內存優化

```cpp
// 對於大字母表,使用 map 而非陣列
map<char, int> children;  // 而非 int children[26]
```

## 練習建議

1. **理解 Trie:** 先熟練掌握 Trie 的構建
2. **理解 KMP:** 理解失配指針的概念
3. **模擬過程:** 手工模擬小例子的構建和匹配
4. **實現簡化版:** 實現基本的 AC 自動機
5. **實際應用:** 敏感詞過濾等項目

## 延伸閱讀

- 相關主題: **Trie**, **KMP**
- 下一章: **字串壓縮**
- 進階主題: **後綴自動機 (Suffix Automaton)**
- 實務應用: **Snort (入侵檢測系統)**
