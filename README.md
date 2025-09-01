# 0x3F LeetCode 刷題追蹤器

一個專門追蹤 [0x3F 演算法題單](https://github.com/EndlessCheng/codeforces-go) 進度的 Web 應用程式，幫助你系統化地刷 LeetCode 題目。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

Have fun! [Let's Start](https://0x3-f.vercel.app/)

## ✨ 功能特色

### 📊 主要功能
- **📈 總覽面板**: 查看整體刷題進度和統計資料
- **📊 詳細分析**: 各主題完成率、最近完成題目等數據分析
- **🎯 主題分類**: 按照 0x3F 題單的分類系統組織題目
- **✅ 進度追蹤**: 實時記錄解題進度和完成時間

### 🎨 界面設計
- **🔄 可摺疊側邊欄**: 點擊按鈕即可摺疊/展開導航欄
- **📱 響應式設計**: 支援桌面和手機裝置
- **🎯 現代化 UI**: 簡潔美觀的使用者界面
- **⚡ 流暢動畫**: 平滑的過渡效果和互動體驗

### 💾 資料管理
- **🔒 本地儲存**: 資料儲存在瀏覽器本地，隱私安全
- **📝 自訂題目**: 可以新增自己的練習題目
- **📚 章節結構**: 支援題目的分章節管理
- **🔄 資料版本控制**: 自動處理資料結構升級

## 🚀 快速開始

### 環境要求
- Node.js 18.0 或以上版本
- npm 或 yarn 套件管理器

### 安裝與運行

1. **複製專案**
```bash
git clone <your-repo-url>
cd 0x3f2
```

2. **安裝依賴**
```bash
npm install
# 或
yarn install
```

3. **啟動開發伺服器**
```bash
npm run dev
# 或
yarn dev
```

4. **開啟瀏覽器**
前往 [http://localhost:3000](http://localhost:3000) 查看應用程式

### 建置部署

```bash
# 建置專案
npm run build

# 啟動生產伺服器
npm start
```

## 📁 專案結構

```
src/
├── app/
│   ├── layout.tsx          # 根佈局
│   ├── page.tsx            # 主頁面
│   ├── globals.css         # 全域樣式
│   └── ...
├── components/
│   ├── AppLayout.tsx       # 應用程式佈局
│   ├── Sidebar.tsx         # 側邊欄組件
│   ├── Dashboard.tsx       # 總覽面板
│   ├── Analytics.tsx       # 分析頁面
│   ├── TopicTab.tsx        # 主題頁面（簡單版）
│   ├── TopicTabStructured.tsx # 主題頁面（結構化）
│   ├── ProblemItem.tsx     # 題目項目
│   ├── AddProblemForm.tsx  # 新增題目表單
│   └── ChapterView.tsx     # 章節檢視
├── data/
│   ├── topics.ts           # 主題資料
│   ├── allTopicsData.ts    # 完整題目資料
│   └── sampleProblems.ts   # 範例題目
├── hooks/
│   └── useLocalStorage.ts  # 本地儲存 Hook
├── types/
│   └── index.ts            # TypeScript 類型定義
└── App.css                 # 主要樣式文件
```

## 🎯 使用說明

### 基本操作

1. **瀏覽主題**: 在側邊欄選擇要練習的演算法主題
2. **查看題目**: 點擊主題後會顯示該主題下的所有題目
3. **標記完成**: 勾選題目前的複選框來標記完成狀態
4. **新增題目**: 使用新增題目表單來添加自訂練習題
5. **追蹤進度**: 在總覽頁面查看整體學習進度

### 側邊欄功能
- **摺疊/展開**: 點擊左上角的箭頭按鈕
- **主要功能**: 總覽和統計頁面
- **刷題主題**: 所有演算法主題分類

### 資料儲存
所有進度資料都儲存在瀏覽器的 localStorage 中，包括：
- 題目完成狀態
- 完成時間記錄
- 自訂新增的題目
- 學習進度統計

## 🛠 技術棧

- **前端框架**: [Next.js 15](https://nextjs.org/) - React 全端框架
- **程式語言**: [TypeScript](https://www.typescriptlang.org/) - 型別安全的 JavaScript
- **UI 庫**: [React 18](https://reactjs.org/) - 使用者界面庫
- **樣式**: CSS3 + CSS Modules - 現代 CSS 樣式
- **狀態管理**: React Hooks - 本地狀態管理
- **資料持久化**: localStorage - 瀏覽器本地儲存
- **建置工具**: [Turbopack](https://turbo.build/pack) - 高效能建置工具

## 📊 功能詳解

### 總覽面板
- 整體完成進度圓形圖表
- 各項統計數據卡片
- 各主題完成率一覽
- 最近完成題目時間軸

### 統計分析
- 可選時間範圍的完成趨勢圖
- 各主題詳細完成統計
- 完成題目的時間分佈
- 學習進度分析圖表

### 題目管理
- 支援兩種格式：簡單列表和結構化章節
- 題目連結自動轉換（leetcode.cn → leetcode.com）
- 完成時間自動記錄
- 自訂題目新增功能

## 🤝 貢獻指南

歡迎貢獻代碼、回報問題或提出建議！

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 更新日誌

### v2.0.0
- ✨ 新增可摺疊側邊欄設計
- 🎨 重構為現代化 UI 界面
- 📊 改進統計和分析功能
- 📱 優化響應式設計
- 🔄 升級到 Next.js 15

### v1.0.0
- 🎉 初始版本發布
- ✅ 基本題目追蹤功能
- 📊 簡單統計面板
- 💾 本地資料儲存

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 聯絡資訊

如有問題或建議，歡迎透過 GitHub Issues 聯絡。

---

⭐ 如果這個專案對你有幫助，請給個星星支持一下！