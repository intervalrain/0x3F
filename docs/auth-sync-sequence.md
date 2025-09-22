# 用戶登入與資料同步流程圖

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as 用戶
    participant F as 前端應用
    participant L as LocalStorage
    participant A as Auth服務(OAuth)
    participant B as 後端API
    participant D as Database

    %% 初始狀態檢查
    Note over F: 頁面載入
    F->>L: 檢查本地登入狀態
    F->>L: 載入本地進度資料

    %% 用戶選擇登入
    U->>F: 點擊登入按鈕
    F->>A: 導向OAuth認證
    A->>U: 顯示授權頁面
    U->>A: 授權確認
    A->>F: 返回token和用戶資訊

    %% 登入後同步檢查
    F->>L: 檢查是否有本地資料
    alt 有本地資料
        F->>B: 請求雲端資料
        B->>D: 查詢用戶進度
        D-->>B: 返回雲端資料
        B-->>F: 返回雲端進度

        alt 雲端也有資料
            F->>U: 顯示同步選項對話框
            Note over U: 選擇同步策略

            alt 選擇：使用雲端資料
                U->>F: 選擇雲端
                F->>L: 覆蓋本地資料
                Note over F: 使用雲端資料
            else 選擇：使用本地資料
                U->>F: 選擇本地
                F->>B: 上傳本地資料
                B->>D: 更新資料庫
                Note over F: 使用本地資料
            else 選擇：合併資料
                U->>F: 選擇合併
                F->>F: 合併演算法處理
                Note over F: 保留較新/較完整的進度
                F->>L: 更新本地資料
                F->>B: 上傳合併結果
                B->>D: 更新資料庫
            end
        else 雲端無資料
            F->>B: 上傳本地資料
            B->>D: 建立用戶記錄
            Note over F: 自動同步本地到雲端
        end
    else 無本地資料
        F->>B: 請求雲端資料
        B->>D: 查詢用戶進度
        D-->>B: 返回資料
        B-->>F: 返回進度
        F->>L: 儲存到本地
        Note over F: 從雲端初始化
    end

    %% 後續操作同步
    loop 用戶操作期間
        U->>F: 完成題目/更新進度
        F->>L: 即時儲存到本地
        F->>F: 防抖處理(1秒)
        F->>B: 背景同步到雲端
        B->>D: 更新資料庫
        B-->>F: 確認更新
    end

    %% 登出流程
    U->>F: 點擊登出
    F->>B: 最終同步
    B->>D: 確保資料最新
    F->>L: 保留本地資料
    F->>A: 清除認證token
    Note over F: 切換回本地模式
```

## 關鍵設計要點

### 1. 雙向相容性
- **未登入狀態**：完全使用 LocalStorage，功能不受影響
- **登入後**：LocalStorage 作為快取層，雲端作為主要儲存

### 2. 衝突解決策略
```typescript
interface ConflictResolution {
  strategy: 'cloud' | 'local' | 'merge';
  mergeRule?: 'latest' | 'most-complete' | 'union';
}
```

### 3. 離線優先設計
- 本地優先寫入，確保即時響應
- 背景同步到雲端，使用防抖機制
- 網路恢復後自動重試失敗的同步

### 4. 資料結構建議
```typescript
interface ProgressData {
  userId?: string;
  lastSyncTime: Date;
  localVersion: number;
  cloudVersion?: number;
  problems: {
    id: string;
    completed: boolean;
    completedAt?: Date;
    notes?: string;
  }[];
}
```

### 5. 同步狀態指示
```typescript
enum SyncStatus {
  SYNCED = 'synced',
  SYNCING = 'syncing',
  PENDING = 'pending',
  CONFLICT = 'conflict',
  OFFLINE = 'offline'
}
```

## 實作建議

1. **漸進式增強**：先實作基礎功能，逐步加入進階特性
2. **版本控制**：為資料結構加入版本號，方便未來升級
3. **錯誤處理**：完善的重試機制和錯誤提示
4. **用戶體驗**：清晰的同步狀態顯示，避免資料丟失焦慮