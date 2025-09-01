import { Chapter } from '../types';

// Sample structured data for Topic 1: 滑动窗口与双指针
export const slidingWindowChapters: Chapter[] = [
  {
    id: 'fixed-length',
    title: '一、定长滑动窗口',
    subsections: [
      {
        id: 'fixed-basic',
        title: '§1.1 基础',
        problems: [
          {
            id: 'lc1456',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-basic',
            number: '1456',
            title: '定长子串中元音的最大数目',
            url: 'https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/',
            difficulty: 1263,
            completed: false
          },
          {
            id: 'lc643',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-basic',
            number: '643',
            title: '子数组最大平均数 I',
            url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
            completed: false
          },
          {
            id: 'lc1343',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-basic',
            number: '1343',
            title: '大小为 K 且平均值大于等于阈值的子数组数目',
            url: 'https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/',
            difficulty: 1317,
            completed: false
          },
          {
            id: 'lc2090',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-basic',
            number: '2090',
            title: '半径为 k 的子数组平均值',
            url: 'https://leetcode.com/problems/k-radius-subarray-averages/',
            difficulty: 1358,
            completed: false
          },
          {
            id: 'lc2379',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-basic',
            number: '2379',
            title: '得到 K 个黑块的最少涂色次数',
            url: 'https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/',
            difficulty: 1360,
            completed: false
          }
        ]
      },
      {
        id: 'fixed-advanced',
        title: '§1.2 进阶（选做）',
        problems: [
          {
            id: 'lc2134',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-advanced',
            number: '2134',
            title: '最少交换次数来组合所有的 1 II',
            url: 'https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/',
            difficulty: 1748,
            completed: false
          },
          {
            id: 'lc567',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-advanced',
            number: '567',
            title: '字符串的排列',
            url: 'https://leetcode.com/problems/permutation-in-string/',
            completed: false
          },
          {
            id: 'lc438',
            topicId: 1,
            chapterId: 'fixed-length',
            subsectionId: 'fixed-advanced',
            number: '438',
            title: '找到字符串中所有字母异位词',
            url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'variable-length',
    title: '二、不定长滑动窗口',
    subsections: [
      {
        id: 'variable-longest',
        title: '§2.1 越短越合法/求最长/最大',
        problems: [
          {
            id: 'lc3',
            topicId: 1,
            chapterId: 'variable-length',
            subsectionId: 'variable-longest',
            number: '3',
            title: '无重复字符的最长子串',
            url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            completed: false
          },
          {
            id: 'lc1493',
            topicId: 1,
            chapterId: 'variable-length',
            subsectionId: 'variable-longest',
            number: '1493',
            title: '删掉一个元素以后全为 1 的最长子数组',
            url: 'https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/',
            difficulty: 1423,
            completed: false
          }
        ]
      }
    ]
  }
];

// You can add more chapters and subsections following this structure