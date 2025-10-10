# 0x3F LeetCode 刷題追蹤器

專門追蹤 0x3F 演算法題單進度的 Web 應用程式，幫助你系統化地刷 LeetCode 題目。

## 主要功能

### 進度追蹤
- 總覽面板：查看整體刷題進度和統計資料
- 詳細分析：各主題完成率、最近完成題目等數據分析
- 主題分類：按照 0x3F 題單的分類系統組織題目
- 即時記錄：自動記錄解題進度和完成時間

### 文章系統
- 內建演算法學習文章
- 支援 Markdown 格式
- 章節化的知識結構
- 快速導航目錄

### 界面設計
- GitHub 風格深色主題
- 可調整大小的側邊欄
- 響應式設計，支援桌面和手機裝置
- 樹狀結構導航

### 資料管理
- 本地儲存：資料儲存在瀏覽器本地，確保隱私安全
- 雲端同步：支援 GitHub OAuth 登入，多裝置同步進度
- 自訂題目：可以新增自己的練習題目
- 章節結構：支援題目的分章節管理
- 資料版本控制：自動處理資料結構升級

## 快速開始

### 使用線上版本
訪問 [https://0x3-f.vercel.app/](https://0x3-f.vercel.app/) 開始使用

### 本地部署

#### 環境要求
- Node.js 18.0 或以上版本
- npm 或 yarn 套件管理器

#### 安裝步驟

1. 複製專案
```bash
git clone https://github.com/intervalrain/0x3F.git
cd 0x3f2
```

2. 安裝依賴
```bash
npm install
```

3. 運行開發伺服器
```bash
npm run dev
```

4. 打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 技術棧

- **框架**: Next.js 15.5.2
- **UI 庫**: Material-UI (MUI)
- **語言**: TypeScript
- **樣式**: Emotion (CSS-in-JS)
- **認證**: NextAuth.js with GitHub OAuth
- **資料儲存**: LocalStorage + Cloud Sync

## 使用指南

### 開始刷題
1. 從側邊欄選擇刷題主題
2. 瀏覽題目列表
3. 點擊題目連結前往 LeetCode
4. 完成後勾選題目標記進度

### 查看進度
- 點擊 Dashboard 查看整體統計
- 點擊 Analytics 查看詳細分析
- 側邊欄顯示各主題完成數量

### 同步資料
- 點擊右上角登入 GitHub
- 資料自動同步到雲端
- 在不同裝置間保持進度一致

### 閱讀文章
- 從側邊欄選擇文章專區
- 瀏覽演算法知識文章
- 使用目錄快速導航

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request

## 相關連結

- [0x3F 原始題單](https://github.com/EndlessCheng/codeforces-go)
- [專案 GitHub](https://github.com/intervalrain/0x3F)
- [問題回報](https://github.com/intervalrain/0x3F/issues)
