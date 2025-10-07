---
title: "雙向雙指針"
order: 3
description: "對撞指針技巧與經典題目"
tags: ["Two Pointers", "Opposite Direction", "雙向指針", "對撞指針"]
---

# 雙向雙指針 (Opposite Direction Two Pointers)

## 核心概念

**雙向雙指針**（又稱**對撞指針**）是指兩個指針從陣列**兩端**出發，**相向移動**，直到相遇。

### 特點

- 兩個指針：`left` 從左端，`right` 從右端
- **相向移動**：`left++`、`right--`
- 終止條件：`left < right` 或 `left <= right`
- 時間複雜度：O(n)
- 通常需要**有序陣列**

---

## 通用模板

```cpp
// 雙向雙指針模板
int left = 0, right = n - 1;

while (left < right) {
    if (條件滿足) {
        處理結果;
        left++;
        right--;
    } else if (需要增大) {
        left++;
    } else {
        right--;
    }
}
```

### 模板說明

1. **初始化**：`left = 0`, `right = n - 1`
2. **循環條件**：`left < right`（不包括相等）
3. **移動策略**：
   - 條件滿足：記錄結果，雙指針都移動
   - 需要增大：左指針右移
   - 需要減小：右指針左移

---

## 常見場景

### 場景 1：Two Sum 類問題

**問題特徵**：在**有序陣列**中找兩數和等於 target。

**策略**：
- `sum < target`：左指針右移（增大和）
- `sum > target`：右指針左移（減小和）
- `sum == target`：找到答案

#### 範例 1：Two Sum II

**問題**：[LeetCode 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

在**有序陣列**中找兩數和等於 target，返回索引（1-indexed）。

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return {left + 1, right + 1};  // 1-indexed
            } else if (sum < target) {
                left++;   // 需要更大的數
            } else {
                right--;  // 需要更小的數
            }
        }

        return {};  // 題目保證有解
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**為什麼一定有序？**
- 有序才能根據 sum 決定移動方向
- 無序只能用 hash map O(n) 空間

#### 範例 2：3Sum

**問題**：[LeetCode 15](https://leetcode.com/problems/3sum/)

找出所有和為 0 的三元組，結果不能重複。

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> result;
        int n = nums.size();

        // 排序
        sort(nums.begin(), nums.end());

        for (int i = 0; i < n - 2; i++) {
            // 跳過重複的第一個數
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            // 雙指針找兩數和 = -nums[i]
            int left = i + 1, right = n - 1;
            int target = -nums[i];

            while (left < right) {
                int sum = nums[left] + nums[right];

                if (sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});

                    // 跳過重複的第二個數
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // 跳過重複的第三個數
                    while (left < right && nums[right] == nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return result;
    }
};
```

**時間複雜度**：O(n²)（外層 O(n)，內層雙指針 O(n)）
**空間複雜度**：O(1)（不計結果空間）

**關鍵**：
- 先排序
- 固定第一個數，雙指針找後兩個數
- 跳過重複元素避免重複結果

---

### 場景 2：容器問題

**問題特徵**：計算由兩端決定的容器容量、面積等。

**策略**：
- 從兩端開始
- 每次移動較小的一端（貪心思想）

#### 範例：Container With Most Water

**問題**：[LeetCode 11](https://leetcode.com/problems/container-with-most-water/)

給定高度陣列，找兩條線與 x 軸圍成的最大容器面積。

```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxWater = 0;

        while (left < right) {
            // 計算當前容量
            int h = min(height[left], height[right]);
            int width = right - left;
            maxWater = max(maxWater, h * width);

            // 移動較矮的一端
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxWater;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**為什麼移動較矮的一端？**

```
高度: [1, 8, 6, 2, 5, 4, 8, 3, 7]
       ↑                       ↑
      left                   right

當前容量 = min(1, 7) × 8 = 8

如果移動 right：
  新容量 = min(1, 3) × 7 = 7  （變小）

如果移動 left：
  新容量 = min(8, 7) × 7 = 49 （可能變大）

結論：移動較矮的一端才有可能增大容量
```

---

### 場景 3：回文問題

**問題特徵**：判斷或尋找回文字串。

**策略**：
- 從兩端向中間比較
- 或從中心向兩端擴展

#### 範例 1：Valid Palindrome

**問題**：[LeetCode 125](https://leetcode.com/problems/valid-palindrome/)

判斷字串是否為回文（忽略非字母數字，忽略大小寫）。

```cpp
class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.size() - 1;

        while (left < right) {
            // 跳過非字母數字字符
            while (left < right && !isalnum(s[left])) {
                left++;
            }
            while (left < right && !isalnum(s[right])) {
                right--;
            }

            // 比較字符（轉小寫）
            if (tolower(s[left]) != tolower(s[right])) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

#### 範例 2：Longest Palindromic Substring（中心擴展）

**問題**：[LeetCode 5](https://leetcode.com/problems/longest-palindromic-substring/)

找出最長回文子串。

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";

        int start = 0, maxLen = 0;

        for (int i = 0; i < s.size(); i++) {
            // 奇數長度回文（中心為一個字符）
            int len1 = expandAroundCenter(s, i, i);
            // 偶數長度回文（中心為兩個字符）
            int len2 = expandAroundCenter(s, i, i + 1);

            int len = max(len1, len2);

            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }

        return s.substr(start, maxLen);
    }

private:
    int expandAroundCenter(const string& s, int left, int right) {
        // 從中心向兩端擴展
        while (left >= 0 && right < s.size() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;  // 回文長度
    }
};
```

**時間複雜度**：O(n²)
**空間複雜度**：O(1)

**策略**：
- 枚舉每個可能的中心
- 從中心向兩端擴展
- 需要處理奇數和偶數長度

---

### 場景 4：陣列操作

**問題特徵**：原地修改陣列、反轉、排序等。

#### 範例 1：Reverse String

**問題**：[LeetCode 344](https://leetcode.com/problems/reverse-string/)

原地反轉字符陣列。

```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        int left = 0, right = s.size() - 1;

        while (left < right) {
            swap(s[left], s[right]);
            left++;
            right--;
        }
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

#### 範例 2：Sort Colors

**問題**：[LeetCode 75](https://leetcode.com/problems/sort-colors/)

原地排序只包含 0, 1, 2 的陣列（荷蘭國旗問題）。

```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int left = 0;              // 0 的右邊界
        int right = nums.size() - 1;  // 2 的左邊界
        int i = 0;

        while (i <= right) {
            if (nums[i] == 0) {
                swap(nums[i], nums[left]);
                left++;
                i++;
            } else if (nums[i] == 2) {
                swap(nums[i], nums[right]);
                right--;
                // 不移動 i，因為換來的數還沒檢查
            } else {
                i++;  // nums[i] == 1
            }
        }
    }
};
```

**時間複雜度**：O(n)
**空間複雜度**：O(1)

**關鍵**：
- `left` 左邊都是 0
- `right` 右邊都是 2
- 中間都是 1

---

## 雙指針移動策略

### 何時移動 left？

1. **當前和太小**：需要更大的數
2. **左端已處理完**：條件滿足後
3. **左端不符合**：跳過

### 何時移動 right？

1. **當前和太大**：需要更小的數
2. **右端已處理完**：條件滿足後
3. **右端不符合**：跳過

### 同時移動

- 找到一組解後，繼續找下一組
- 回文檢查中，兩端相等時

---

## 經典題目

### Easy
- [LeetCode 125 - Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)
- [LeetCode 167 - Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [LeetCode 344 - Reverse String](https://leetcode.com/problems/reverse-string/)
- [LeetCode 345 - Reverse Vowels of a String](https://leetcode.com/problems/reverse-vowels-of-a-string/)

### Medium
- [LeetCode 11 - Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
- [LeetCode 15 - 3Sum](https://leetcode.com/problems/3sum/)
- [LeetCode 16 - 3Sum Closest](https://leetcode.com/problems/3sum-closest/)
- [LeetCode 18 - 4Sum](https://leetcode.com/problems/4sum/)
- [LeetCode 75 - Sort Colors](https://leetcode.com/problems/sort-colors/)
- [LeetCode 259 - 3Sum Smaller](https://leetcode.com/problems/3sum-smaller/)
- [LeetCode 611 - Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number/)

### Hard
- [LeetCode 42 - Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

---

## 常見陷阱

### 1. 循環條件錯誤

```cpp
// ✗ 錯誤：使用 <= 會重複處理中間元素
while (left <= right) {
    // 當 left == right 時會處理同一個元素兩次
}

// ✓ 正確：大多數情況使用 <
while (left < right) {
    // left 和 right 不會重複
}

// 特殊情況：二分搜尋可能需要 <=
while (left <= right) {
    int mid = left + (right - left) / 2;
    // ...
}
```

### 2. 忘記排序

```cpp
// ✗ 錯誤：Two Sum 類問題忘記排序
vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    // 未排序，雙指針策略無效
}

// ✓ 正確：先排序
vector<int> twoSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    int left = 0, right = nums.size() - 1;
    // ...
}
```

### 3. 跳過重複元素不當

```cpp
// ✗ 錯誤：可能跳過所有元素
while (left < right && nums[left] == nums[left + 1]) {
    left++;  // 可能 left 越界
}

// ✓ 正確：先移動，再跳過
left++;
while (left < right && nums[left] == nums[left - 1]) {
    left++;
}
```

### 4. 移動方向錯誤

```cpp
// Container With Most Water

// ✗ 錯誤：移動較高的一端
if (height[left] < height[right]) {
    right--;  // 錯誤方向
}

// ✓ 正確：移動較矮的一端
if (height[left] < height[right]) {
    left++;  // 才有可能增大容量
}
```

---

## 進階技巧

### 1. 三指針技巧

用於 3Sum、Sort Colors 等問題。

```cpp
// 三區間劃分
int left = 0;     // 區間 1 的右邊界
int right = n - 1; // 區間 3 的左邊界
int i = 0;        // 當前處理位置

while (i <= right) {
    // 根據 nums[i] 決定放到哪個區間
}
```

### 2. 多次雙指針

某些問題需要多次使用雙指針。

```cpp
// Trapping Rain Water
// 第一次：從左到右記錄左側最大值
// 第二次：從右到左記錄右側最大值
// 第三次：計算每個位置的積水
```

---

## 對撞指針 vs 滑動視窗

| 特性 | 對撞指針 | 滑動視窗 |
|-----|---------|---------|
| **方向** | 相向移動 | 同向移動 |
| **起點** | 兩端 | 同一端 |
| **終止** | left >= right | right 到達終點 |
| **排序** | 通常需要 | 通常不需要 |
| **典型** | Two Sum, 回文 | 最長/最短子陣列 |

---

## 複雜度總結

| 問題類型 | 時間複雜度 | 空間複雜度 |
|---------|-----------|-----------|
| Two Sum | O(n) | O(1) |
| 3Sum | O(n²) | O(1) |
| 回文檢查 | O(n) | O(1) |
| 容器問題 | O(n) | O(1) |

---

## 重點回顧

1. **雙向雙指針** = 從兩端相向移動
2. **適用場景**：
   - 有序陣列的 Two Sum 問題
   - 容器、面積問題
   - 回文檢查
   - 陣列反轉、排序
3. **核心策略**：
   - 根據條件決定移動 left 或 right
   - 通常需要先排序
   - 循環條件通常是 `left < right`
4. **常見錯誤**：循環條件、忘記排序、移動方向錯誤

### 下一步

接下來將學習**同向雙指針**（快慢指針），處理原地修改和鏈表問題。