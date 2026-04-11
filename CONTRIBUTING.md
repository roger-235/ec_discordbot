# 協作規範

## 代碼規範

### 命名

| 類別       | 風格             | 範例                    |
| ---------- | ---------------- | ----------------------- |
| 變數 / 函式 | `snake_case`     | `student_id`, `send_email` |
| 類別       | `PascalCase`     | `start_verify`, `enter_code` → 建議改為 `StartVerify`, `EnterCode` |
| 常數       | `UPPER_SNAKE`    | `CODE_EXPIRE_TIME`      |

### 格式

- 運算子前後加空格：`a = 1` 而非 `a=1`
- 逗號後加空格：`[1, 2, 3]` 而非 `[1,2,3]`
- 函式與類別之間空兩行，類別內的方法之間空一行
- 使用 4 個空格縮排，不使用 tab

### 註解

- 用 `#===` 區塊分隔不同功能段落
- 行內註解與程式碼之間至少空兩格

```python
#====================
# 功能描述
#====================

def my_function():
    value = 1  # 行內註解
```

### 字串

- 統一使用雙引號 `"` 作為字串引號
- f-string 內嵌值使用單引號：`f"身分組'{role}'"`

### 其他

- `import` 順序：標準庫 → 第三方套件 → 本地模組，各組之間空一行
- 環境變數統一透過 `python-dotenv` 載入，不要 hardcode
- 非同步函式使用 `async/await`，不使用 blocking call

## Push 規範

## Commit Message 格式

```
<類型>: <簡短描述>
```

### 類型

| 類型       | 說明                         |
| ---------- | ---------------------------- |
| `feat`     | 新增功能                     |
| `fix`      | 修復 bug                     |
| `refactor` | 重構程式碼（不影響功能）     |
| `docs`     | 文件更新                     |
| `style`    | 格式調整（不影響程式邏輯）   |
| `test`     | 新增或修改測試               |
| `chore`    | 雜項（依賴更新、設定檔調整） |

### 範例

```
feat: 新增學號驗證功能
fix: 修復驗證碼過期後仍可驗證的問題
docs: 更新 README 安裝步驟
refactor: 重構寄信邏輯
chore: 更新 py-cord 版本
```

## Branch 規範

| Branch 名稱       | 用途               |
| ------------------ | ------------------ |
| `main`             | 正式穩定版本       |
| `dev`              | 開發中功能整合     |
| `feat/<功能名稱>`  | 新功能開發         |
| `fix/<問題描述>`   | Bug 修復           |

### 流程

1. 從 `main` 建立新的 branch
   ```bash
   git checkout -b feat/新功能名稱
   ```
2. 開發完成後 commit
   ```bash
   git add <檔案>
   git commit -m "feat: 功能描述"
   ```
3. Push 到遠端
   ```bash
   git push -u origin feat/新功能名稱
   ```
4. 在 GitHub 上建立 Pull Request 合併回 `main`

## 注意事項

- **不要直接 push 到 `main`**，請透過 PR 合併
- **不要提交 `.env`**，已在 `.gitignore` 中排除
- Commit 請保持小而明確，一個 commit 做一件事
