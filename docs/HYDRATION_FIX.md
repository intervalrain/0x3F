# Hydration Error 修復說明

## 問題描述

在實現搜尋功能後，出現了 React Hydration Error：
```
Hydration failed because the server rendered HTML didn't match the client.
```

## 原因分析

問題出在 `useMediaQuery` hook 在服務端渲染 (SSR) 和客戶端渲染時返回不同的值：

1. **服務端**：無法判斷螢幕寬度，返回預設值
2. **客戶端**：根據實際螢幕寬度返回結果

這導致服務端生成的 HTML 和客戶端初次渲染的 HTML 不一致。

## 解決方案

### 方法 1：使用 `noSsr` 選項（推薦）✅

在 `useMediaQuery` 中添加 `noSsr: true` 選項：

```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
  noSsr: true,  // 禁用服務端渲染
});
```

**優點：**
- 簡單直接
- MUI 官方推薦方式
- 不需要額外的 state

**缺點：**
- 首次渲染時可能會有短暫的閃爍

### 方法 2：延遲渲染

使用 `mounted` state 控制渲染時機：

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// 只在客戶端掛載後才渲染
{mounted && !isMobile && (
  <SearchBar />
)}
```

**優點：**
- 完全避免 hydration 錯誤
- 適用於複雜組件

**缺點：**
- 需要額外的 state
- 增加代碼複雜度

## 實際修改

### Header.tsx

```typescript
// 修改前
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// 修改後
const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
  noSsr: true,
});
```

### SearchBar.tsx

```typescript
// 修改前
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// 修改後
const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
  noSsr: true,
});
```

## 測試驗證

修復後，應該：
1. ✅ 不再出現 hydration 錯誤
2. ✅ 桌面版顯示搜尋框
3. ✅ 手機版顯示搜尋圖標
4. ✅ 功能正常運作

## 其他常見 Hydration 問題

### 1. 使用 `Date.now()` 或 `Math.random()`

```typescript
// ❌ 錯誤
const id = Date.now();

// ✅ 正確
const [id, setId] = useState<number>();
useEffect(() => {
  setId(Date.now());
}, []);
```

### 2. 使用 `window` 對象

```typescript
// ❌ 錯誤
const width = window.innerWidth;

// ✅ 正確
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

### 3. 條件渲染不一致

```typescript
// ❌ 錯誤
{typeof window !== 'undefined' && <Component />}

// ✅ 正確
const [isClient, setIsClient] = useState(false);
useEffect(() => {
  setIsClient(true);
}, []);
{isClient && <Component />}
```

## 參考資源

- [Next.js Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)
- [MUI useMediaQuery SSR](https://mui.com/material-ui/react-use-media-query/#server-side-rendering)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
