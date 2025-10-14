# Hydration Error 最終修復

## 問題總結

在實現搜尋功能後，出現了多個 Hydration Error：

### 1. HTML 嵌套錯誤
```
Error: In HTML, <p> cannot be a descendant of <p>
Error: <p> cannot contain a nested <div>
```

**原因：** `ListItemText` 的 `secondary` prop 被渲染成 `<p>` 標籤，但我們在裡面嵌套了 `<Box>` (`<div>`) 和 `<Typography>` (`<p>`)。

**解決方案：** 移除 `ListItemText`，直接使用 `Box` 和 `Typography` 組件。

### 2. 條件渲染導致的 Hydration 不匹配
```
Error: Hydration failed because the server rendered HTML didn't match the client
```

**原因：** `AppShell.tsx` 中使用 `isClient` 條件渲染，導致服務端和客戶端 HTML 結構不同。

**解決方案：** 使用 CSS `opacity` 和 `pointerEvents` 代替條件渲染。

### 3. useMediaQuery SSR 不匹配
**原因：** `useMediaQuery` 在服務端無法判斷螢幕寬度。

**解決方案：** 添加 `noSsr: true` 選項。

---

## 修復內容

### 1. SearchBar.tsx

#### 修復前（錯誤）：
```tsx
<ListItemText
  primary={<Box><Typography>...</Typography></Box>}
  secondary={
    <Box>
      <Typography>...</Typography>
      <Box><Chip /></Box>
    </Box>
  }
/>
```

**問題：** `ListItemText` 渲染為：
```html
<div>
  <p><!-- primary --></p>
  <p><!-- secondary -->
    <div><!-- Box -->
      <p><!-- Typography --></p>
      <div><!-- Chip --></div>
    </div>
  </p>
</div>
```
❌ `<p>` 不能包含 `<div>` 或其他 `<p>`

#### 修復後（正確）：
```tsx
<Box sx={{ flexGrow: 1, minWidth: 0 }}>
  <Typography variant="body1">...</Typography>
  <Typography variant="body2">...</Typography>
  <Box><Chip /></Box>
</Box>
```

**結果：**
```html
<div>
  <p>Title</p>
  <p>Description</p>
  <div><div>Chip</div></div>
</div>
```
✅ 正確的 HTML 結構

---

### 2. AppShell.tsx

#### 修復前（錯誤）：
```tsx
{isClient && sidebarCollapsed && (
  <Fab>...</Fab>
)}

{isClient && (
  <Sidebar />
)}

{isClient && showConflictModal && (
  <SyncConflictModal />
)}
```

**問題：** 條件渲染導致服務端和客戶端 HTML 不同。

#### 修復後（正確）：
```tsx
{/* Fab - 始終渲染，用 CSS 控制顯示 */}
<Fab
  sx={{
    display: sidebarCollapsed ? 'flex' : 'none',
    opacity: isClient ? 1 : 0,
    pointerEvents: isClient ? 'auto' : 'none',
  }}
>
  ...
</Fab>

{/* Sidebar - 始終渲染，用 CSS 控制可見性 */}
<Box
  sx={{
    opacity: isClient ? 1 : 0,
    pointerEvents: isClient ? 'auto' : 'none',
    transition: 'opacity 0.2s',
  }}
>
  <Sidebar />
</Box>

{/* Modal - 條件渲染 OK（不影響初始 HTML） */}
{showConflictModal && conflictData && (
  <SyncConflictModal />
)}
```

**優勢：**
- ✅ 服務端和客戶端 HTML 結構一致
- ✅ 平滑的淡入效果
- ✅ 不會觸發 hydration 錯誤

---

### 3. Header.tsx 和 SearchBar.tsx

#### 添加 `noSsr: true`：
```tsx
const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
  noSsr: true,  // 禁用服務端渲染
});
```

---

### 4. 改善搜尋框自動對焦

#### 修復前：
```tsx
useEffect(() => {
  if (open && inputRef.current) {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }
}, [open]);
```

#### 修復後：
```tsx
useEffect(() => {
  if (open) {
    // 重置查詢狀態
    setQuery('');
    setResults([]);
    setSelectedIndex(0);

    // 延遲對焦確保 Dialog 完全打開
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }
}, [open]);
```

**改進：**
- ✅ 打開搜尋時自動清空舊內容
- ✅ 自動對焦到輸入框
- ✅ 延遲時間增加，確保 Dialog 動畫完成
- ✅ 清理 timer 防止內存洩漏

---

## 測試驗證

### 1. Hydration Error 檢查
```bash
# 打開瀏覽器 Console
# 應該不再看到任何 hydration 相關錯誤
```

### 2. 搜尋功能測試
```bash
# 1. 按 Cmd/Ctrl + K
# 2. 輸入框應該自動對焦
# 3. 輸入 "LRU" 搜尋
# 4. 使用 ↑↓ 鍵選擇結果
# 5. 按 Enter 跳轉
```

### 3. 響應式測試
```bash
# 1. 調整瀏覽器寬度
# 2. 桌面版顯示搜尋框
# 3. 手機版顯示搜尋圖標
# 4. 不應該出現任何錯誤
```

---

## 最佳實踐總結

### ✅ Do（推薦做法）

1. **使用 CSS 控制顯示，而非條件渲染**
   ```tsx
   <div style={{ opacity: isClient ? 1 : 0 }}>
     <Component />
   </div>
   ```

2. **useMediaQuery 加上 noSsr 選項**
   ```tsx
   const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
     noSsr: true,
   });
   ```

3. **避免 HTML 標籤嵌套錯誤**
   - `<p>` 不能包含 `<div>` 或 `<p>`
   - `<button>` 不能包含 `<button>`
   - 使用正確的語義化標籤

4. **Dialog/Modal 可以安全使用條件渲染**
   ```tsx
   {open && <Dialog />}  // ✅ OK
   ```

### ❌ Don't（避免做法）

1. **避免基於 `typeof window` 條件渲染**
   ```tsx
   {typeof window !== 'undefined' && <Component />}  // ❌
   ```

2. **避免在初始渲染時使用 localStorage/sessionStorage**
   ```tsx
   const [value] = useState(localStorage.getItem('key'));  // ❌
   ```

3. **避免在組件頂層使用 Date.now() 或 Math.random()**
   ```tsx
   const id = Date.now();  // ❌
   ```

4. **避免錯誤的 HTML 嵌套**
   ```tsx
   <p><div>...</div></p>  // ❌
   <ListItemText secondary={<Box>...</Box>} />  // ❌
   ```

---

## 相關資源

- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next.js Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)
- [MUI useMediaQuery SSR](https://mui.com/material-ui/react-use-media-query/#server-side-rendering)
- [HTML Nesting Rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

---

## 修復完成 ✅

所有 Hydration Error 已修復：
- ✅ HTML 嵌套錯誤已解決
- ✅ 條件渲染不匹配已修復
- ✅ useMediaQuery SSR 問題已解決
- ✅ 搜尋框自動對焦優化完成
