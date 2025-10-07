---
title: "Trie (Prefix Tree)"
order: 5
description: "字典樹：高效的字串查詢與前綴匹配"
tags: ["Trie", "Prefix Tree", "String", "Dictionary"]
---

# Trie (Prefix Tree)

## 核心概念

Trie（字典樹/前綴樹）是一種專門用於**字串查詢**的樹狀資料結構。

**核心特性**：
- 共享**公共前綴**，節省空間
- 插入、查詢時間：O(L)，L 為字串長度
- 支援**前綴匹配**，這是 Hash Map 做不到的！

**典型應用**：
- 字典查詢
- 自動補全
- 拼寫檢查
- IP 路由表
- XOR 最大值（Bitwise Trie）

---

## 一、Trie 的結構

### 樹形結構

每個節點代表一個字元，從根到某節點的路徑構成一個字串。

```
插入 "cat", "car", "card", "dog"：

           root
          /    \
         c      d
         |      |
         a      o
        / \     |
       t   r    g*
       |   |
       *   d
           |
           *

說明：
- * 表示某個單詞的結尾
- "cat" 的路徑：root → c → a → t*
- "car" 和 "card" 共享前綴 "car"
```

### 節點設計

```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;  // 子節點
    bool isEnd;  // 是否為單詞結尾

    TrieNode() : isEnd(false) {}
};
```

**為什麼用 `unordered_map` 而非 `array`？**
- `array[26]`：只適用於小寫字母，浪費空間
- `unordered_map`：支援任意字元，空間按需分配

**何時用 `array`？**
- 明確只有 26 個小寫字母
- 追求極致效能（避免 Hash 開銷）

```cpp
struct TrieNode {
    TrieNode* children[26];  // 只適用於小寫字母
    bool isEnd;

    TrieNode() : isEnd(false) {
        memset(children, 0, sizeof(children));
    }
};
```

---

## 二、基本操作

### 1. 插入（Insert）

**過程**：從根開始，逐字元向下建立節點。

```
插入 "cat"：

初始（空 Trie）：
    root

插入 'c'：
    root
    |
    c

插入 'a'：
    root
    |
    c
    |
    a

插入 't'（並標記為單詞結尾）：
    root
    |
    c
    |
    a
    |
    t*
```

**代碼**：

```cpp
void insert(string word) {
    TrieNode* node = root;

    for (char c : word) {
        if (!node->children.count(c)) {
            node->children[c] = new TrieNode();
        }
        node = node->children[c];
    }

    node->isEnd = true;
}
```

**複雜度**：O(L)，L 為字串長度

---

### 2. 查詢（Search）

**過程**：從根開始，逐字元向下查找。

**代碼**：

```cpp
bool search(string word) {
    TrieNode* node = root;

    for (char c : word) {
        if (!node->children.count(c)) {
            return false;  // 找不到字元
        }
        node = node->children[c];
    }

    return node->isEnd;  // 必須是單詞結尾
}
```

**範例**：
```
Trie 中有 "cat", "car"

search("cat") → true
search("ca") → false（不是完整單詞）
search("can") → false（路徑不存在）
```

**複雜度**：O(L)

---

### 3. 前綴匹配（StartsWith）

**查詢是否存在以某前綴開頭的單詞**

**代碼**：

```cpp
bool startsWith(string prefix) {
    TrieNode* node = root;

    for (char c : prefix) {
        if (!node->children.count(c)) {
            return false;
        }
        node = node->children[c];
    }

    return true;  // 不需要檢查 isEnd
}
```

**範例**：
```
Trie 中有 "cat", "car"

startsWith("ca") → true（"cat" 和 "car" 都以 "ca" 開頭）
startsWith("d") → false
```

**複雜度**：O(L)

---

## 三、完整實現

### 基礎版本（使用 `unordered_map`）

```cpp
class Trie {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd;

        TrieNode() : isEnd(false) {}
    };

    TrieNode* root;

public:
    Trie() {
        root = new TrieNode();
    }

    // 插入單詞
    void insert(string word) {
        TrieNode* node = root;

        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }

        node->isEnd = true;
    }

    // 查詢單詞是否存在
    bool search(string word) {
        TrieNode* node = root;

        for (char c : word) {
            if (!node->children.count(c)) {
                return false;
            }
            node = node->children[c];
        }

        return node->isEnd;
    }

    // 前綴匹配
    bool startsWith(string prefix) {
        TrieNode* node = root;

        for (char c : prefix) {
            if (!node->children.count(c)) {
                return false;
            }
            node = node->children[c];
        }

        return true;
    }
};
```

### 陣列版本（僅小寫字母）

```cpp
class Trie {
private:
    struct TrieNode {
        TrieNode* children[26];
        bool isEnd;

        TrieNode() : isEnd(false) {
            memset(children, 0, sizeof(children));
        }
    };

    TrieNode* root;

public:
    Trie() {
        root = new TrieNode();
    }

    void insert(string word) {
        TrieNode* node = root;

        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
        }

        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = root;

        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                return false;
            }
            node = node->children[idx];
        }

        return node->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;

        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                return false;
            }
            node = node->children[idx];
        }

        return true;
    }
};
```

---

## 四、進階操作

### 1. 刪除單詞

**注意事項**：
- 不能直接刪除節點（可能影響其他單詞）
- 只能刪除**不被共享**的節點

```cpp
bool remove(TrieNode* node, string word, int index) {
    if (index == word.size()) {
        if (!node->isEnd) return false;  // 單詞不存在

        node->isEnd = false;

        // 如果沒有子節點，可以刪除
        return node->children.empty();
    }

    char c = word[index];
    if (!node->children.count(c)) {
        return false;  // 單詞不存在
    }

    TrieNode* child = node->children[c];
    bool shouldDelete = remove(child, word, index + 1);

    if (shouldDelete) {
        delete child;
        node->children.erase(c);

        // 當前節點可以刪除的條件：
        // 1. 不是其他單詞的結尾
        // 2. 沒有其他子節點
        return !node->isEnd && node->children.empty();
    }

    return false;
}

// 公開接口
void remove(string word) {
    remove(root, word, 0);
}
```

### 2. 自動補全（列出所有以某前綴開頭的單詞）

```cpp
void findAllWords(TrieNode* node, string prefix, vector<string>& result) {
    if (node->isEnd) {
        result.push_back(prefix);
    }

    for (auto& [c, child] : node->children) {
        findAllWords(child, prefix + c, result);
    }
}

vector<string> autoComplete(string prefix) {
    TrieNode* node = root;

    // 找到前綴的節點
    for (char c : prefix) {
        if (!node->children.count(c)) {
            return {};  // 前綴不存在
        }
        node = node->children[c];
    }

    // 從該節點開始 DFS 收集所有單詞
    vector<string> result;
    findAllWords(node, prefix, result);
    return result;
}
```

**範例**：
```
Trie 中有 "cat", "car", "card", "dog"

autoComplete("ca") → ["cat", "car", "card"]
autoComplete("d") → ["dog"]
autoComplete("x") → []
```

### 3. 計數（統計單詞出現次數）

```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    int count;  // 該單詞出現的次數

    TrieNode() : count(0) {}
};

void insert(string word) {
    TrieNode* node = root;

    for (char c : word) {
        if (!node->children.count(c)) {
            node->children[c] = new TrieNode();
        }
        node = node->children[c];
    }

    node->count++;  // 增加計數
}

int countWord(string word) {
    TrieNode* node = root;

    for (char c : word) {
        if (!node->children.count(c)) {
            return 0;
        }
        node = node->children[c];
    }

    return node->count;
}
```

---

## 五、LeetCode 題目詳解

### 1. LeetCode 208: Implement Trie (Prefix Tree)

**題目**：實現 Trie 的 `insert`, `search`, `startsWith` 操作

**解法**：直接套用模板（見上文完整實現）

---

### 2. LeetCode 211: Design Add and Search Words Data Structure

**題目**：支援添加單詞和查詢（查詢時 `.` 可以匹配任意字元）

**範例**：
```
addWord("bad")
addWord("dad")
search("pad") → false
search("bad") → true
search(".ad") → true（匹配 "bad" 和 "dad"）
search("b..") → true（匹配 "bad"）
```

**解法**：Trie + DFS

```cpp
class WordDictionary {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd;

        TrieNode() : isEnd(false) {}
    };

    TrieNode* root;

public:
    WordDictionary() {
        root = new TrieNode();
    }

    void addWord(string word) {
        TrieNode* node = root;

        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }

        node->isEnd = true;
    }

    bool search(string word) {
        return searchHelper(word, 0, root);
    }

private:
    bool searchHelper(const string& word, int index, TrieNode* node) {
        if (index == word.size()) {
            return node->isEnd;
        }

        char c = word[index];

        if (c == '.') {
            // 嘗試所有可能的字元
            for (auto& [ch, child] : node->children) {
                if (searchHelper(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            // 普通字元
            if (!node->children.count(c)) {
                return false;
            }
            return searchHelper(word, index + 1, node->children[c]);
        }
    }
};
```

**複雜度**：
- `addWord`: O(L)
- `search`: O(26^k)，k 為 `.` 的數量（最壞情況）

---

### 3. LeetCode 212: Word Search II

**題目**：給定 2D 字母板和單詞列表，找出所有在板上出現的單詞

**範例**：
```
board = [
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
]
words = ["oath","pea","eat","rain"]

輸出: ["oath","eat"]
```

**解法**：Trie + DFS

```cpp
class Solution {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        string word;  // 存儲完整單詞（方便收集結果）

        TrieNode() : word("") {}
    };

    TrieNode* root;

    void buildTrie(vector<string>& words) {
        root = new TrieNode();

        for (const string& word : words) {
            TrieNode* node = root;

            for (char c : word) {
                if (!node->children.count(c)) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }

            node->word = word;  // 存儲完整單詞
        }
    }

    void dfs(vector<vector<char>>& board, int i, int j, TrieNode* node, vector<string>& result) {
        char c = board[i][j];

        if (c == '#' || !node->children.count(c)) {
            return;  // 已訪問 或 無匹配路徑
        }

        node = node->children[c];

        if (!node->word.empty()) {
            result.push_back(node->word);
            node->word = "";  // 避免重複收集
        }

        // 標記為已訪問
        board[i][j] = '#';

        // 四個方向 DFS
        if (i > 0) dfs(board, i - 1, j, node, result);
        if (i < board.size() - 1) dfs(board, i + 1, j, node, result);
        if (j > 0) dfs(board, i, j - 1, node, result);
        if (j < board[0].size() - 1) dfs(board, i, j + 1, node, result);

        // 恢復
        board[i][j] = c;
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        buildTrie(words);

        vector<string> result;
        int m = board.size(), n = board[0].size();

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dfs(board, i, j, root, result);
            }
        }

        return result;
    }
};
```

**複雜度**：O(m·n·4^L)，L 為最長單詞長度

**關鍵**：
- 使用 Trie 可以剪枝（提前終止無效路徑）
- 比暴力搜尋每個單詞快得多

---

### 4. LeetCode 421: Maximum XOR of Two Numbers in an Array

**題目**：找出陣列中兩數 XOR 的最大值

**範例**：
```
nums = [3, 10, 5, 25, 2, 8]
輸出: 28
解釋: 5 XOR 25 = 28
```

**解法**：Bitwise Trie

**核心思想**：
- 將每個數字的二進位表示插入 Trie
- 查詢時，貪心地選擇相反的位（以獲得最大 XOR）

```cpp
class Solution {
private:
    struct TrieNode {
        TrieNode* children[2];  // 只有 0 和 1

        TrieNode() {
            children[0] = children[1] = nullptr;
        }
    };

    TrieNode* root;

    void insert(int num) {
        TrieNode* node = root;

        // 從最高位開始插入（31 位）
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;

            if (!node->children[bit]) {
                node->children[bit] = new TrieNode();
            }

            node = node->children[bit];
        }
    }

    int findMaxXOR(int num) {
        TrieNode* node = root;
        int maxXOR = 0;

        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int oppositeBit = 1 - bit;

            // 貪心：優先選擇相反的位
            if (node->children[oppositeBit]) {
                maxXOR |= (1 << i);  // 該位為 1
                node = node->children[oppositeBit];
            } else {
                node = node->children[bit];
            }
        }

        return maxXOR;
    }

public:
    int findMaximumXOR(vector<int>& nums) {
        root = new TrieNode();

        // 插入所有數字
        for (int num : nums) {
            insert(num);
        }

        // 查詢最大 XOR
        int result = 0;
        for (int num : nums) {
            result = max(result, findMaxXOR(num));
        }

        return result;
    }
};
```

**複雜度**：O(n·32) = O(n)

**範例過程**：
```
nums = [3, 10, 5]
二進位：
3  = 0011
10 = 1010
5  = 0101

插入到 Trie（只看後 4 位）：
         root
        /    \
       0      1
      /        \
     0          0
    / \        / \
   1   0      1   0
   |    \    /     \
   1     1  0       1
  (3)   (5)(10)

查詢 3 的最大 XOR：
    從 root 開始
    3 的第 3 位是 0，選擇相反的 1 → 走右
    3 的第 2 位是 0，選擇相反的 1 → 走右
    3 的第 1 位是 1，選擇相反的 0 → 走右
    3 的第 0 位是 1，選擇相反的 0 → 無，走左
    結果：1010 (10)，XOR = 3 ^ 10 = 9

查詢 5 的最大 XOR：
    選擇路徑得到 10，XOR = 5 ^ 10 = 15

答案：15
```

---

### 5. LeetCode 720: Longest Word in Dictionary

**題目**：找出字典中最長的單詞，該單詞的所有前綴也都在字典中

**範例**：
```
words = ["w","wo","wor","worl","world"]
輸出: "world"
```

**解法**：Trie + BFS

```cpp
class Solution {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd;

        TrieNode() : isEnd(false) {}
    };

    TrieNode* root;

public:
    string longestWord(vector<string>& words) {
        root = new TrieNode();

        // 插入所有單詞
        for (const string& word : words) {
            TrieNode* node = root;

            for (char c : word) {
                if (!node->children.count(c)) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }

            node->isEnd = true;
        }

        // BFS 找最長單詞
        string result = "";
        queue<pair<TrieNode*, string>> q;
        q.push({root, ""});

        while (!q.empty()) {
            auto [node, path] = q.front();
            q.pop();

            for (auto& [c, child] : node->children) {
                if (child->isEnd) {
                    string newPath = path + c;

                    // 更新結果（優先選長的，長度相同選字典序小的）
                    if (newPath.size() > result.size() ||
                        (newPath.size() == result.size() && newPath < result)) {
                        result = newPath;
                    }

                    q.push({child, newPath});
                }
            }
        }

        return result;
    }
};
```

---

## 六、常見陷阱與技巧

### 陷阱 1：忘記標記 `isEnd`

```cpp
// 錯誤：插入後忘記標記
void insert(string word) {
    TrieNode* node = root;
    for (char c : word) {
        if (!node->children.count(c)) {
            node->children[c] = new TrieNode();
        }
        node = node->children[c];
    }
    // 忘記 node->isEnd = true;
}
```

### 陷阱 2：`search` 與 `startsWith` 混淆

```cpp
// search 必須是完整單詞
bool search(string word) {
    // ...
    return node->isEnd;  // 必須檢查 isEnd
}

// startsWith 只需路徑存在
bool startsWith(string prefix) {
    // ...
    return true;  // 不檢查 isEnd
}
```

### 陷阱 3：空間洩漏（未釋放記憶體）

```cpp
// 應該實現解構函數
~Trie() {
    deleteTrie(root);
}

void deleteTrie(TrieNode* node) {
    if (!node) return;

    for (auto& [c, child] : node->children) {
        deleteTrie(child);
    }

    delete node;
}
```

### 技巧 1：Bitwise Trie 處理 XOR 問題

用於：
- LeetCode 421: Maximum XOR of Two Numbers
- LeetCode 1707: Maximum XOR With an Element From Array

### 技巧 2：Trie + DFS 處理字串匹配

用於：
- LeetCode 212: Word Search II
- LeetCode 211: Design Add and Search Words

---

## 七、總結

### 複雜度

| 操作 | 時間複雜度 | 空間複雜度 |
|------|-----------|-----------|
| 插入 | O(L) | O(L) |
| 查詢 | O(L) | - |
| 前綴匹配 | O(L) | - |

L 為字串長度

### 適用場景

| 問題類型 | 是否適用 |
|---------|---------|
| 字串查詢 | ✅ 完美 |
| 前綴匹配 | ✅ 完美 |
| 自動補全 | ✅ 完美 |
| XOR 最大值 | ✅ Bitwise Trie |
| 字串排序 | ❌ 用排序演算法 |
| 子字串查詢 | ❌ 用 KMP/AC 自動機 |

### 模板速查

```cpp
class Trie {
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd = false;
    };

    TrieNode* root = new TrieNode();

public:
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c))
                node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return true;
    }
};
```

Trie 是處理字串集合問題的最佳工具，特別是涉及前綴匹配時！

