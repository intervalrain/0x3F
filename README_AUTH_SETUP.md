# Google OAuth 設置指南

## 1. 設置 Google Cloud Console

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google+ API：
   - 前往「API 和服務」→「啟用 API 和服務」
   - 搜尋「Google+ API」並啟用

## 2. 創建 OAuth 2.0 憑證

1. 前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「OAuth 用戶端 ID」
3. 如果尚未設定同意畫面，請先設定：
   - 應用程式名稱：0x3F LeetCode Tracker
   - 使用者支援電子郵件：您的電子郵件
   - 授權網域：localhost (開發環境)
4. 選擇應用程式類型：「網頁應用程式」
5. 設定授權的重新導向 URI：
   - 開發環境：`http://localhost:3000/api/auth/callback/google`
   - 生產環境：`https://your-domain.com/api/auth/callback/google`

## 3. 設置資料庫

### 選項 A：使用 SQLite (開發環境)

1. 修改 `.env.local`：
```env
DATABASE_URL="file:./dev.db"
```

2. 修改 `prisma/schema.prisma`：
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

3. 執行 Prisma 遷移：
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 選項 B：使用 PostgreSQL (推薦用於生產)

1. 安裝 PostgreSQL 或使用雲端服務（如 Supabase、Neon、Railway）
2. 更新 `.env.local` 中的 DATABASE_URL
3. 執行 Prisma 遷移

## 4. 更新環境變數

編輯 `.env.local` 文件：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=生成一個隨機密鑰 (使用: openssl rand -base64 32)

# Google OAuth
GOOGLE_CLIENT_ID=從 Google Cloud Console 獲取
GOOGLE_CLIENT_SECRET=從 Google Cloud Console 獲取

# Database
DATABASE_URL=您的資料庫連接字串
```

## 5. 測試登入流程

1. 啟動開發伺服器：
```bash
npm run dev
```

2. 訪問 http://localhost:3000
3. 點擊右上角的「使用 Google 登入」按鈕
4. 完成 Google 授權流程
5. 檢查是否成功登入並顯示用戶資訊

## 功能說明

### 已實作功能：

1. **Google OAuth 登入/登出**
   - 使用 NextAuth.js 處理認證
   - 支援 Google 帳號登入

2. **資料同步機制**
   - 自動同步本地與雲端資料
   - 防抖機制（2秒）避免頻繁同步
   - 定期同步（每30秒）

3. **衝突解決**
   - 智能合併：保留兩邊的完成記錄
   - 使用本地資料：覆蓋雲端
   - 使用雲端資料：覆蓋本地

4. **離線支援**
   - 本地優先策略
   - 離線時繼續使用 LocalStorage
   - 上線後自動同步

## 故障排除

### 常見問題：

1. **"Invalid redirect_uri" 錯誤**
   - 確保 Google Console 中的重定向 URI 與實際 URL 完全匹配
   - 包括協議（http/https）和端口號

2. **資料庫連接失敗**
   - 檢查 DATABASE_URL 格式是否正確
   - 確保資料庫服務正在運行
   - 執行 `npx prisma migrate dev` 初始化資料庫

3. **登入後沒有同步**
   - 檢查瀏覽器控制台是否有錯誤
   - 確認 API endpoints 正常運作
   - 檢查網路連接

## 下一步

- 考慮添加更多 OAuth 提供者（GitHub、Microsoft 等）
- 實作更詳細的同步歷史記錄
- 添加資料匯出功能
- 優化大量資料的同步性能