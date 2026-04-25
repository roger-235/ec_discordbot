# EC Discord Bot

> 高科大電子工程系（建工校區）系學會 Discord 伺服器管理機器人

身分驗證、繳費系會員管理、人數統計、版本公告等自動化任務。

---

## 快速開始

### 1. 下載並安裝

```bash
git clone https://github.com/Roger-235/ec_discordbot.git
cd ec_discordbot
python -m venv .venv
source .venv/bin/activate
pip install -r package.txt
```

### 2. `.env`

```env
discordbot_api=your_discord_bot_token
email_name=your_gmail_address
email_pw=your_gmail_app_password
log_webhook_url=https://discord.com/api/webhooks/.../...
```

### 3. 修改硬編 ID

| 檔案 | 內容 |
| --- | --- |
| [core/system/verify.py](core/system/verify.py) | 歡迎頻道 ID |
| [core/system/count.py](core/system/count.py) | guild、身分組、人數頻道 ID |
| [core/admin_command/edit_vip.py](core/admin_command/edit_vip.py) | VIP 身分組、指令頻道 ID |
| [core/maintion_command/version_update.py](core/maintion_command/version_update.py) | 公告頻道 ID |
| [json/remember_msg.json](json/remember_msg.json) | 驗證頻道 ID |

### 4. 執行

```bash
python main.py
```

---

## 功能

| 模組 | 功能 |
| --- | --- |
| [verify.py](core/system/verify.py) | 學號 → 學校信箱驗證碼 → 自動分配年級/班級身分組 |
| [count.py](core/system/count.py) | 每 10 分鐘更新頻道名稱顯示各類人數 |
| [edit_vip.py](core/admin_command/edit_vip.py) | `/edit_vip` 加入/移除繳費系會員（單筆或 Excel 批次） |
| [version_update.py](core/maintion_command/version_update.py) | `/版本更新通知指令` 透過 Modal 發布更新公告 |
| [logger.py](core/system/logger.py) | console + Discord webhook 雙通道輸出 |

---

## 專案結構

```
.
├── main.py
├── path.py                          # 集中管理檔案路徑
├── role.py                          # 身分組權限批次複製工具
├── data.db                          # SQLite（自動建立）
├── package.txt
│
├── core/
│   ├── system/                      # 核心系統模組
│   │   ├── verify.py                # 學號驗證 + 身分組指派
│   │   ├── count.py                 # 頻道人數統計
│   │   └── logger.py                # console + webhook 雙通道 log
│   │
│   ├── admin_command/               # 管理員指令
│   │   └── edit_vip.py              # /edit_vip：繳費系會員加入/移除
│   │
│   ├── maintion_command/            # 維護指令
│   │   └── version_update.py        # /版本更新通知指令：發布更新公告
│   │
│   └── user_command/                # （預留：未來給一般使用者的指令）
│
├── json/
│   ├── email.json                   # 驗證信模板
│   ├── role_map.json                # 學號前綴 → 年級/班級
│   ├── remember_msg.json            # 驗證訊息位置（自動維護）
│   └── version_post.json            # 公告模板
│
├── CONTRIBUTING.md
└── README.md
```

---

## 資料庫

`data.db` 的 `user_sql` 表：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `student_id` | TEXT | 學號（PK） |
| `role` | TEXT | 年級-班級身分組名稱 |
| `discord_id` | INTEGER | Discord 使用者 ID |
| `point` | INTEGER | 點數（DEFAULT 0） |
| `verified_time` | TEXT | 驗證時間 |
| `is_vip` | INTEGER | 繳費系會員旗標（DEFAULT 0） |

---

## 學號規則

由 [json/role_map.json](json/role_map.json) 定義：

| 前綴 | 年級 | | 第 8 碼 | 班級 |
| --- | --- | --- | --- | --- |
| `C115` | 一年級 | | `1` | 甲班 |
| `C114` | 二年級 | | `2` | 乙班 |
| `C113` | 三年級 | | `3` | 丙班 |
| `C112` | 四年級 | | | |

例：`C114152236` → 「二年級-乙班」

---

## 協作

請參考 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

由高科大電子工程系（建工校區）系學會維護。
