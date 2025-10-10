# 0x3F LeetCode 刷題追蹤器

這是一個參考 0x3F 演算法題單開發的進度追蹤網頁，完全免費，幫助你系統化地刷 LeetCode 題目。

同時也包含我個人學習資結、演算法的筆記。

## 主要功能

### 進度追蹤
- 總覽面板：查看整體刷題進度和統計資料（需登入）
- 詳細分析：各主題完成率、最近完成題目等數據分析（需登入）
- 主題分類：按照 0x3F 題單的分類系統組織題目
- 即時記錄：自動記錄解題進度和完成時間

### 文章系統
- 提供我自己的學習筆記
- 支援 Markdown 格式
- 章節化的知識結構
- 快速導航目錄

### 界面設計
- 響應式設計，支援桌面和手機裝置
- 樹狀結構導航

### 資料管理
- 本地儲存：資料儲存在瀏覽器本地，確保隱私安全
- 雲端同步：支援 GitHub OAuth 登入，多裝置同步進度（審核之會員）
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

MIT 沒有授權，自由使用

## 貢獻

歡迎提交 Issue 和 Pull Request

## 相關連結

- [0x3F 原始題單](https://github.com/EndlessCheng/codeforces-go)
- [專案 GitHub](https://github.com/intervalrain/0x3F)
- [問題回報](https://github.com/intervalrain/0x3F/issues)


## 關於我

> Hi 我是 **Rain Hu**，是個轉職工程師，畢業於清大材料，雖然不是本科出身，但因為工作前兩年寫了些 VB 巨集，對寫程式產生興趣。使用的語言有 C/C++、C#、Python、TypeScript、VBA、Java。目前任職於工業電腦，設計軟硬體間的 SDK、各式雲服務與**打工仔**。樂於學習新、舊、有趣的技術。
>
> 最近在學習 Vim，也樂在嘗試與 AI 協作，當個詠唱師，還在熟悉 Docker 與工業相關的協定，緩慢的學習與進步中，每次學習到新的演算法，就會忘記要睡覺XD。
> 
> 目前在學習前端服務的開發，有 25% 的時間在睡覺，50% 的時間在工作，15% 的時間在學習，3% 的時間在音樂，7% 的時間在病床上度過。
>
> 同時也開發其他的有趣的專案與 App，連結放在我的 repo 首頁，如果這個網頁有幫助到您，***也歡迎到我的 repo 給個星星***。
> 
> 雖然有先天免疫疾病造成我生活諸多困難，但學習使我從中得到快樂與滿足感。**希望所有樂愛學習的夥伴，都可以開心、保持健康與善良，面試上想要的公司**。
> 
> 你也可以到我的 blog -  [Rain Hu’s Workspace](https://intervalrain.github.io)，那裡有我更多的筆記，與生活記錄。

### 聯繫
你可以在 [github](https://github.com/intervalrain) 聯繫我或是[寄信](mailto:intervalrain@google.com)給我
