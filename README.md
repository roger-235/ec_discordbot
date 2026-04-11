# EC Discord Bot

高科大電子工程系（建工校區）系學會的Discord機器人，用於電子工程系（建工校區）的discord伺服器。

## 功能

- **學號驗證** — 輸入學號後，機器人會寄送六位數驗證碼到學校信箱（`@nkust.edu.tw`）
- **自動分配身分組** — 驗證成功後，依據學號自動分配年級與班級身分組
- **驗證碼時限** — 驗證碼 3 分鐘內有效
- **身分組權限複製** — 可批次將指定身分組的權限複製到其他身分組

## 安裝

```bash
pip install -r package.txt
```

## 設定

在專案根目錄建立 `.env` 檔案：

```env
discordbot_api=your_Discord_Bot_Token
email_name=your_Gmail
email_pw=your_gmail_password
```

## 執行

```bash
python main.py
```

## 專案結構

```
.
├── main.py          # 主程式：驗證流程、寄信、身分組分配
├── role.py          # 批次複製身分組權限
├── test.py          # 測試用
├── package.txt      # Python 套件清單
├── json/
    ├── email.json         # 信件模板
    ├── role_map.json      # 學號對應年級/班級
    └── remember_msg.json  # 記錄驗證訊息 ID

```
