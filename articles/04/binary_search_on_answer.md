---
title: "二分猜答案"
order: 2
description: "將優化問題轉化為判定問題，使用二分搜尋猜測最優解"
tags: ["Binary Search", "Binary Search on Answer", "二分猜答案"]
---

# 二分猜答案 (Binary Search on Answer)

## 核心概念

**二分猜答案**是指：當問題的答案具有**單調性**時，可以通過二分搜尋來「猜測」答案，並驗證其可行性。

### 基本思路

1. **確定答案範圍** [left, right]
2. **猜測答案** mid
3. **驗證可行性** check(mid)
4. **縮小範圍**：
   - 可行 → 嘗試更優解
   - 不可行 → 調整範圍

### 適用條件

1. **答案有範圍**：最小值 left，最大值 right
2. **具有單調性**：
   - 如果 x 可行，則所有 >= x 的值都可行（最小化問題）
   - 如果 x 可行，則所有 <= x 的值都可行（最大化問題）
3. **可以快速驗證**：check(mid) 的時間複雜度要合理

---

## 通用模板

### 模板 1：最小化最大值

```cpp
// 找最小的 x 使得 check(x) = true
int binarySearchMin(int left, int right) {
    while (left < right) {
        int mid = left + (right - left) / 2;

        if (check(mid)) {
            right = mid;  // mid 可行，嘗試更小的
        } else {
            left = mid + 1;  // mid 不可行，需要更大的
        }
    }

    return left;
}
```

### 模板 2：最大化最小值

```cpp
// 找最大的 x 使得 check(x) = true
int binarySearchMax(int left, int right) {
    while (left < right) {
        int mid = left + (right - left + 1) / 2;  // 向上取整

        if (check(mid)) {
            left = mid;  // mid 可行，嘗試更大的
        } else {
            right = mid - 1;  // mid 不可行，需要更小的
        }
    }

    return left;
}
```

---

## 場景 1：分割陣列（最小化最大值）

### 問題：Split Array Largest Sum

**題目**：[LeetCode 410](https://leetcode.com/problems/split-array-largest-sum/)

將陣列分成 k 個非空連續子陣列，使得這 k 個子陣列各自和的最大值最小。

```
輸入: nums = [7,2,5,10,8], k = 2
輸出: 18

解釋: 分成 [7,2,5] 和 [10,8]
     和分別為 14 和 18
     最大值為 18，這是所有方案中的最小值
```

**思路**：
- 答案範圍：[max(nums), sum(nums)]
- 二分答案 mid：每個子陣列和 <= mid
- check(mid)：能否分成 k 個子陣列

```cpp
class Solution {
public:
    int splitArray(vector<int>& nums, int k) {
        int left = *max_element(nums.begin(), nums.end());
        int right = accumulate(nums.begin(), nums.end(), 0);

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canSplit(nums, k, mid)) {
                right = mid;  // 可以分，嘗試更小的最大值
            } else {
                left = mid + 1;  // 不能分，需要更大的最大值
            }
        }

        return left;
    }

private:
    // 檢查能否分成 k 個子陣列，每個和 <= maxSum
    bool canSplit(vector<int>& nums, int k, int maxSum) {
        int count = 1;  // 至少需要一個子陣列
        int currentSum = 0;

        for (int num : nums) {
            if (currentSum + num > maxSum) {
                count++;  // 開始新的子陣列
                currentSum = num;

                if (count > k) {
                    return false;  // 需要超過 k 個子陣列
                }
            } else {
                currentSum += num;
            }
        }

        return true;
    }
};
```

**時間複雜度**：O(n × log(sum))
**空間複雜度**：O(1)

**關鍵點**：
- 答案越大，越容易分（子陣列數量越少）
- 答案越小，越難分（子陣列數量越多）
- 單調性：如果 x 可行，則所有 > x 都可行

---

## 場景 2：運送包裹（最小化最大容量）

### 問題：Capacity To Ship Packages Within D Days

**題目**：[LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

在 days 天內運送所有包裹，求船的最小載重能力。

```
輸入: weights = [1,2,3,4,5,6,7,8,9,10], days = 5
輸出: 15

解釋: 船的載重為 15 時可以在 5 天內運完：
     第 1 天: 1, 2, 3, 4, 5
     第 2 天: 6, 7
     第 3 天: 8
     第 4 天: 9
     第 5 天: 10
```

**思路**：
- 答案範圍：[max(weights), sum(weights)]
- 二分答案 mid：船的載重能力
- check(mid)：能否在 days 天內運完

```cpp
class Solution {
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int left = *max_element(weights.begin(), weights.end());
        int right = accumulate(weights.begin(), weights.end(), 0);

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canShip(weights, days, mid)) {
                right = mid;  // 可以運完，嘗試更小的載重
            } else {
                left = mid + 1;  // 運不完，需要更大的載重
            }
        }

        return left;
    }

private:
    // 檢查載重 capacity 能否在 days 天內運完
    bool canShip(vector<int>& weights, int days, int capacity) {
        int daysNeeded = 1;
        int currentLoad = 0;

        for (int weight : weights) {
            if (currentLoad + weight > capacity) {
                daysNeeded++;
                currentLoad = weight;

                if (daysNeeded > days) {
                    return false;
                }
            } else {
                currentLoad += weight;
            }
        }

        return true;
    }
};
```

**時間複雜度**：O(n × log(sum))
**空間複雜度**：O(1)

---

## 場景 3：分配問題（最大化最小值）

### 問題：Magnetic Force Between Two Balls

**題目**：[LeetCode 1552](https://leetcode.com/problems/magnetic-force-between-two-balls/)

將 m 個球放入 n 個位置，最大化最小磁力（任意兩球的最小距離）。

```
輸入: position = [1,2,3,4,7], m = 3
輸出: 3

解釋: 將球放在位置 1, 4, 7
     最小距離為 min(4-1, 7-4) = 3
```

**思路**：
- 答案範圍：[1, max(position) - min(position)]
- 二分答案 mid：最小距離
- check(mid)：能否放置 m 個球，使得任意兩球距離 >= mid

```cpp
class Solution {
public:
    int maxDistance(vector<int>& position, int m) {
        sort(position.begin(), position.end());

        int left = 1;
        int right = position.back() - position[0];

        while (left < right) {
            int mid = left + (right - left + 1) / 2;  // 向上取整

            if (canPlace(position, m, mid)) {
                left = mid;  // 可以放，嘗試更大的最小距離
            } else {
                right = mid - 1;  // 不能放，需要更小的最小距離
            }
        }

        return left;
    }

private:
    // 檢查能否放置 m 個球，使得最小距離 >= minDist
    bool canPlace(vector<int>& position, int m, int minDist) {
        int count = 1;  // 第一個球放在第一個位置
        int lastPos = position[0];

        for (int i = 1; i < position.size(); i++) {
            if (position[i] - lastPos >= minDist) {
                count++;
                lastPos = position[i];

                if (count >= m) {
                    return true;
                }
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(n log n + n log(max - min))
**空間複雜度**：O(1)

**為什麼向上取整？**
- 因為更新 `left = mid`，需要向上取整避免死循環

---

## 場景 4：Koko Eating Bananas

### 問題：Koko Eating Bananas

**題目**：[LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/)

Koko 要在 h 小時內吃完所有香蕉，求最小的吃香蕉速度。

```
輸入: piles = [3,6,7,11], h = 8
輸出: 4

解釋: 速度為 4 時：
     第 1 小時吃 3 根（pile[0]）
     第 2-3 小時吃 6 根（pile[1]）
     第 4-5 小時吃 7 根（pile[2]）
     第 6-8 小時吃 11 根（pile[3]）
     共 8 小時
```

**思路**：
- 答案範圍：[1, max(piles)]
- 二分答案 mid：吃香蕉速度
- check(mid)：能否在 h 小時內吃完

```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int left = 1;
        int right = *max_element(piles.begin(), piles.end());

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, h, mid)) {
                right = mid;  // 可以吃完，嘗試更慢的速度
            } else {
                left = mid + 1;  // 吃不完，需要更快的速度
            }
        }

        return left;
    }

private:
    // 檢查速度 k 能否在 h 小時內吃完
    bool canFinish(vector<int>& piles, int h, int k) {
        long long hours = 0;

        for (int pile : piles) {
            hours += (pile + k - 1) / k;  // 向上取整

            if (hours > h) {
                return false;
            }
        }

        return true;
    }
};
```

**時間複雜度**：O(n × log(max))
**空間複雜度**：O(1)

**向上取整技巧**：
```cpp
// 吃完 pile 根需要的小時數
(pile + k - 1) / k  // 等價於 ceil(pile / k)
```

---

## 場景 5：最小化最大差值

### 問題：Minimize Max Distance to Gas Station

**題目**：[LeetCode 774](https://leetcode.com/problems/minimize-max-distance-to-gas-station/)

在 n 個加油站之間加 k 個新加油站，最小化相鄰加油站的最大距離。

```
輸入: stations = [1,2,3,4,5,6,7,8,9,10], k = 9
輸出: 0.5

解釋: 在每兩個站之間加一個站
     最大距離變為 0.5
```

**思路**：
- 答案範圍：[0, max(相鄰距離)]
- 二分答案 mid：最大距離
- check(mid)：需要多少個新加油站

```cpp
class Solution {
public:
    double minmaxGasDist(vector<int>& stations, int k) {
        double left = 0;
        double right = stations.back() - stations[0];
        double eps = 1e-6;  // 精度

        while (right - left > eps) {
            double mid = left + (right - left) / 2;

            if (canAchieve(stations, k, mid)) {
                right = mid;  // 可以達成，嘗試更小的最大距離
            } else {
                left = mid;  // 達不成，需要更大的最大距離
            }
        }

        return left;
    }

private:
    // 檢查最大距離 maxDist 需要多少個新加油站
    bool canAchieve(vector<int>& stations, int k, double maxDist) {
        int needed = 0;

        for (int i = 1; i < stations.size(); i++) {
            double dist = stations[i] - stations[i - 1];
            needed += (int)(dist / maxDist);  // 向下取整

            if (needed > k) {
                return false;
            }
        }

        return true;
    }
};
```

**時間複雜度**：O(n × log(max / eps))
**空間複雜度**：O(1)

**浮點數二分**：
- 不能用 `left < right`，因為浮點數可能永遠不相等
- 使用精度 `eps`：`right - left > eps`
- 通常迭代 100 次就足夠精確

---

## 場景 6：Cutting Ribbons

### 問題：Cutting Ribbons

**題目**：[LeetCode 1891](https://leetcode.com/problems/cutting-ribbons/)

切割繩子，使得長度為 k 的繩子數量最多。

```
輸入: ribbons = [9,7,5], k = 3
輸出: 5

解釋: 切成長度 5：
     ribbon[0] = 9 → 切成 1 段（9/5 = 1）
     ribbon[1] = 7 → 切成 1 段（7/5 = 1）
     ribbon[2] = 5 → 切成 1 段（5/5 = 1）
     共 3 段
```

**思路**：
- 答案範圍：[1, max(ribbons)]
- 二分答案 mid：繩子長度
- check(mid)：能切出多少段長度為 mid 的繩子

```cpp
class Solution {
public:
    int maxLength(vector<int>& ribbons, int k) {
        int left = 1;
        int right = *max_element(ribbons.begin(), ribbons.end());

        while (left < right) {
            int mid = left + (right - left + 1) / 2;  // 向上取整

            if (canCut(ribbons, k, mid)) {
                left = mid;  // 可以切，嘗試更長的
            } else {
                right = mid - 1;  // 不能切，需要更短的
            }
        }

        return canCut(ribbons, k, left) ? left : 0;
    }

private:
    // 檢查能否切出 k 段長度為 len 的繩子
    bool canCut(vector<int>& ribbons, int k, int len) {
        int count = 0;

        for (int ribbon : ribbons) {
            count += ribbon / len;

            if (count >= k) {
                return true;
            }
        }

        return false;
    }
};
```

**時間複雜度**：O(n × log(max))
**空間複雜度**：O(1)

---

## 經典題目

### Medium
- [LeetCode 410 - Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)
- [LeetCode 875 - Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)
- [LeetCode 1011 - Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
- [LeetCode 1283 - Find the Smallest Divisor Given a Threshold](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/)
- [LeetCode 1482 - Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)
- [LeetCode 1552 - Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/)
- [LeetCode 1760 - Minimum Limit of Balls in a Bag](https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/)
- [LeetCode 1891 - Cutting Ribbons](https://leetcode.com/problems/cutting-ribbons/)

### Hard
- [LeetCode 774 - Minimize Max Distance to Gas Station](https://leetcode.com/problems/minimize-max-distance-to-gas-station/)

---

## 解題步驟

### 1. 識別問題類型

關鍵詞：
- 「最小化最大值」
- 「最大化最小值」
- 「在...天內」、「在...小時內」
- 「能否...」、「最少需要...」

### 2. 確定答案範圍

- 最小值：通常是 1 或某個下界
- 最大值：通常是 sum 或 max

### 3. 設計 check 函數

- 輸入：猜測的答案 mid
- 輸出：是否可行（true/false）
- 時間複雜度：通常是 O(n)

### 4. 選擇模板

- **最小化最大值**：`right = mid`，向下取整
- **最大化最小值**：`left = mid`，向上取整

---

## 常見錯誤

### 1. 答案範圍錯誤

```cpp
// ✗ 錯誤：範圍太小
int left = 0, right = nums.size();

// ✓ 正確：根據問題確定合理範圍
int left = *max_element(nums.begin(), nums.end());
int right = accumulate(nums.begin(), nums.end(), 0);
```

### 2. check 函數邏輯錯誤

```cpp
// 注意是 >= 還是 >
if (count >= k) return true;  // 至少 k 個
if (count > k) return false;  // 超過 k 個
```

### 3. 浮點數二分精度

```cpp
// ✗ 錯誤：可能無限循環
while (left < right)

// ✓ 正確：使用精度
while (right - left > 1e-6)
```

---

## 重點回顧

1. **核心思想**：將優化問題轉化為判定問題
2. **兩種類型**：
   - 最小化最大值
   - 最大化最小值
3. **解題步驟**：
   - 確定答案範圍
   - 設計 check 函數
   - 選擇合適模板
4. **時間複雜度**：O(n × log(範圍))

### 下一步

接下來將學習**第 K 小/大元素**問題。
