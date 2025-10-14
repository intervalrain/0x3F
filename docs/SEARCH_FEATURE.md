# 🔍 搜尋功能說明

## 功能概述

網站內建強大的全文搜尋功能，可以快速搜尋所有文章內容。

## 使用方式

### 1. 打開搜尋視窗

**桌面版：**
- 點擊 Header 中的搜尋框
- 使用快捷鍵：`Cmd + K` (Mac) 或 `Ctrl + K` (Windows/Linux)

**手機版：**
- 點擊 Header 右側的搜尋圖標 🔍

### 2. 搜尋內容

搜尋支援以下內容：
- ✅ 文章標題
- ✅ 文章描述
- ✅ 標籤 (tags)
- ✅ 文章內容摘要

### 3. 導航結果

**鍵盤操作：**
- `↑` / `↓`：上下選擇搜尋結果
- `Enter`：開啟選中的文章
- `Esc`：關閉搜尋視窗

**滑鼠操作：**
- 直接點擊搜尋結果即可開啟文章

## 搜尋技巧

### 模糊搜尋
系統使用 Fuse.js 實現模糊搜尋，可以容忍拼寫錯誤和部分匹配：

```
搜尋 "LRU" → 找到 "LRU Cache"、"LFU"
搜尋 "動態規劃" → 找到包含 "動態規劃" 的所有文章
搜尋 "stack" → 找到所有與堆疊相關的文章
```

### 中文搜尋
完整支援中文搜尋：

```
搜尋 "單調棧" → 找到單調棧相關文章
搜尋 "二分搜尋" → 找到二分搜尋相關文章
```

### 標籤搜尋
可以直接搜尋標籤：

```
搜尋 "DP" → 找到所有標記為 DP 的文章
搜尋 "Graph" → 找到所有圖論相關文章
```

## 技術實現

### 架構

```
┌─────────────────────────────────────┐
│  1. Build 時生成搜尋索引            │
│     scripts/generate-search-index.js │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. 生成 public/search-index.json   │
│     包含所有文章的元數據            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. 前端載入索引並使用 Fuse.js     │
│     components/SearchBar.tsx         │
└─────────────────────────────────────┘
```

### 搜尋索引結構

```json
{
  "articles": [
    {
      "id": "06-04-lru-lfu-design",
      "title": "06-4. LRU 與 LFU Cache 設計",
      "description": "使用 Stack、Queue、Deque 實現...",
      "tags": ["LRU", "LFU", "Cache"],
      "folder": "06",
      "slug": "04_lru_lfu_design",
      "path": "/articles/06/04_lru_lfu_design",
      "excerpt": "LRU Cache 淘汰最久未使用的數據...",
      "order": 4,
      "draft": false
    }
  ]
}
```

### Fuse.js 配置

```typescript
{
  keys: [
    { name: 'title', weight: 0.5 },      // 標題權重最高
    { name: 'tags', weight: 0.3 },       // 標籤次之
    { name: 'description', weight: 0.15 }, // 描述
    { name: 'excerpt', weight: 0.05 }    // 內容摘要
  ],
  threshold: 0.3,           // 模糊匹配閾值
  includeScore: true,       // 包含匹配分數
  includeMatches: true,     // 包含匹配位置（用於高亮）
  ignoreLocation: true,     // 忽略位置因素
  minMatchCharLength: 2     // 最少匹配字符數
}
```

## 開發相關

### 重新生成搜尋索引

當你新增或修改文章後，需要重新生成搜尋索引：

```bash
npm run generate-search
```

### 自動生成

搜尋索引會在以下情況自動生成：
- `npm run build`：執行前會自動運行 `prebuild` script
- 部署到 Vercel：build 時自動執行

### 檔案結構

```
├── scripts/
│   └── generate-search-index.js   # 索引生成腳本
├── src/
│   ├── components/
│   │   └── SearchBar.tsx          # 搜尋組件
│   ├── types/
│   │   └── search.ts              # TypeScript 類型定義
│   └── ...
├── public/
│   └── search-index.json          # 生成的搜尋索引
└── articles/                      # 文章來源
```

## 效能優化

### 前端搜尋優勢
- ✅ **快速**：本地搜尋，無網路延遲
- ✅ **離線可用**：不需網路連接
- ✅ **即時反饋**：輸入即搜尋
- ✅ **節省成本**：不需額外的搜尋服務

### 索引大小
當前索引包含 **112 篇文章**，JSON 檔案大小約 **100KB**（壓縮後更小）。

### 載入策略
- 搜尋索引在首次打開搜尋時才載入
- 使用瀏覽器緩存，避免重複下載

## 未來優化方向

1. **高亮顯示**：在搜尋結果中高亮匹配的關鍵字
2. **搜尋歷史**：記錄最近的搜尋記錄
3. **熱門搜尋**：顯示熱門搜尋關鍵字
4. **分類過濾**：按章節、標籤篩選結果
5. **搜尋建議**：輸入時顯示建議關鍵字

## 相關資源

- [Fuse.js 官方文檔](https://www.fusejs.io/)
- [Material-UI Dialog](https://mui.com/material-ui/react-dialog/)
- [Next.js Static Files](https://nextjs.org/docs/basic-features/static-file-serving)
