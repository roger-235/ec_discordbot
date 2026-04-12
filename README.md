# EC Discord Bot

> 高科大電子工程系（建工校區）系學會 Discord 伺服器身分驗證機器人

本專案為高科大電子工程系（建工校區）系學會所屬的 Discord 機器人，用於系上伺服器的身分驗證、自動分組與身分組權限管理。透過學校信箱驗證碼確認使用者身分，並依學號自動分配對應的年級與班級身分組。

---

## 功能

### 身分驗證（`verify.py`）

- 使用者點擊頻道訊息中的「準備好了就按這裡」按鈕開始驗證
- 輸入學號後，機器人寄送六位數驗證碼至學校信箱（`@nkust.edu.tw`）
- 驗證碼 3 分鐘內有效，過期自動失效
- 驗證成功後依學號自動分配「年級-班級」身分組
- 已驗證使用者無法重複驗證；已綁定的學號可透過再次驗證覆蓋舊帳號
- 驗證資料寫入 SQLite 資料庫（`data.db`）供查詢使用
- 自動記錄驗證訊息 ID，bot 重啟後不會重複發送驗證訊息

### 身分組權限複製（`role.py`）

- 將指定來源身分組的權限批次複製到多個目標身分組
- 適合學期初一次更新多個班級的權限設定

---

## 環境需求

- Discord Bot Token（於 [Discord Developer Portal](https://discord.com/developers/applications) 建立）
- 可寄信的 Gmail 帳號與[應用程式密碼](https://support.google.com/accounts/answer/185833)
- Discord 伺服器中預先建立好對應的身分組（例如 `一年級-甲班`、`二年級-乙班` 等）

---

## 快速開始

### 1. 下載專案

```bash
git clone https://github.com/Roger-235/ec_discordbot.git
cd ec_discordbot
```

### 2. 建立虛擬環境並安裝套件

```bash
python -m venv .venv
source .venv/bin/activate     # Linux / macOS
.venv\Scripts\activate        # Windows

pip install -r package.txt
```

### 3. 設定環境變數

在專案根目錄建立 `.env` 檔案：

```env
discordbot_api=your_discord_bot_token
email_name=your_gmail_address
email_pw=your_gmail_app_password
```

### 4. 設定頻道 ID

編輯 `verify.py`，將以下兩個頻道 ID 改成自己伺服器的：

- **[verify.py:71](verify.py#L71)** — 驗證訊息所在的頻道（使用者點擊按鈕開始驗證）

  ```python
  verify_msg={"channel":"你的驗證頻道ID"}
  ```

- **[verify.py:295](verify.py#L295)** — 驗證成功後發送歡迎訊息的頻道

  ```python
  channel=bot.get_channel(你的歡迎頻道ID)
  ```

### 5. 執行機器人

```bash
python main.py
```

bot 上線後會自動在指定頻道發送驗證訊息。

---

## 專案結構

```
.
├── main.py              # 主程式：建立 bot、載入 verify 模組、啟動
├── verify.py            # 驗證流程：按鈕、Modal、寄信、身分組分配、資料庫
├── role.py              # 身分組權限批次複製工具
├── test.py              # 測試用
├── data.db              # SQLite 資料庫（執行後自動建立）
├── package.txt          # Python 套件清單
├── json/
│   ├── email.json         # 驗證信件模板
│   ├── role_map.json      # 學號前綴對應年級/班級
│   └── remember_msg.json  # 驗證訊息所在頻道與訊息 ID
├── CONTRIBUTING.md      # 協作規範
└── README.md
```

---

## 驗證流程

```
使用者點擊「準備好了就按這裡」
          ↓
檢查是否已驗證過（查 data.db）
          ↓
      輸入學號 Modal
          ↓
  檢查學號是否已被綁定
          ↓
  寄送 6 位數驗證碼到學校信箱
          ↓
      輸入驗證碼 Modal
          ↓
驗證成功 → 分配「年級-班級」身分組 → 寫入 data.db
```

---

## 資料庫結構

`data.db` 使用 SQLite，包含 `user_sql` 資料表：

| 欄位            | 型別    | 說明                   |
| --------------- | ------- | ---------------------- |
| `student_id`    | TEXT    | 學號（Primary Key）    |
| `role`          | TEXT    | 指派的身分組名稱       |
| `discord_id`    | INTEGER | Discord 使用者 ID      |
| `point`         | INTEGER | 點數（預設 0）         |
| `verified_time` | TEXT    | 驗證時間               |

---

## 學號對應規則

學號前綴對應年級，第 8 碼對應班級，由 `json/role_map.json` 定義：

| 學號前綴 | 年級   |
| -------- | ------ |
| `C115`   | 一年級 |
| `C114`   | 二年級 |
| `C113`   | 三年級 |
| `C112`   | 四年級 |

| 第 8 碼 | 班級 |
| ------- | ---- |
| `1`     | 甲班 |
| `2`     | 乙班 |
| `3`     | 丙班 |

例如 `C114152236` 會被分配到「二年級-乙班」身分組。

---

## 協作

歡迎貢獻！請先閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 了解開發規範、commit 格式與 branch 流程。

---

## License

此專案由高科大電子工程系（建工校區）系學會維護。
