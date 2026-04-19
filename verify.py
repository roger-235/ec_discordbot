import discord
import os
import sqlite3
import aiosmtplib
import asyncio
import json
import random
import datetime
import logging
from dotenv import load_dotenv
from email.message import EmailMessage
# pip freeze > package.txt

bot = None

#====================
# 載入log
#====================

logger=logging.getLogger("ec_bot")

#====================
# 傳入bot
#====================

def init(b):
    global bot
    bot = b

#====================
# 全域變數
#====================

code_ram={}
CODE_TIMEOUT=180

#====================
# 載入資料庫
#====================

conn=sqlite3.connect("data.db")
cursor=conn.cursor()
cursor.execute(
    """CREATE TABLE IF NOT EXISTS user_sql (
        student_id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        discord_id INTEGER NOT NULL,
        point INTEGER DEFAULT 0,
        verified_time INTEGER NOT NULL
    )"""
)

#====================
# 載入env
#====================

load_dotenv()
email_user=os.getenv("email_name")
email_pw=os.getenv("email_pw")

#====================
# 載入json
#====================

base_dir=os.path.dirname(__file__)
remember_msg_path=os.path.join(base_dir,"json/remember_msg.json")

with open(os.path.join("json/email.json"),"r",encoding="utf-8") as v:
    email_json=json.load(v)
with open(os.path.join(base_dir,"json/role_map.json"),"r",encoding="utf-8") as r:
    role_map=json.load(r)
    role_map_grade=role_map["grade"]
    role_map_class=role_map["class"]

# 驗證信息記憶
if not os.path.exists(remember_msg_path):
    with open(remember_msg_path,"w",encoding="utf-8") as r:
        verify_msg={"channel":"1490543834302775438"}
        data=verify_msg
        json.dump(data,r,indent=4)
else :
    with open(remember_msg_path,"r",encoding="utf-8") as r:
        verify_msg=json.load(r)


#====================
# 記住message
#====================

async def save_massage():
    channel=bot.get_channel(int(verify_msg["channel"]))
    try :
        msg=await channel.fetch_message(verify_msg.get("message_id"))
    except (discord.NotFound, discord.HTTPException) :
        msg = await channel.send(
            "歡迎加入電子工程系專屬伺服器 👋\n這裡是系上專屬的交流空間，\n為了確保大家都是自己人，請先完成驗證！\n\n :point_down: 點擊下方按鈕開始驗證\n完成後就可以解鎖所有頻道啦 :bangbang: ",
            view=StartVerify(),
        )
        verify_msg["message_id"]=msg.id
        with open(remember_msg_path,"w",encoding="utf-8",) as r:
            json.dump(verify_msg,r,indent=4)
    except Exception as e :
        logging.error(f"記憶驗證初始化：{e}", exc_info=True)

#====================
# view進驗證學號modal
#====================

class StartVerify(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        
    @discord.ui.button(
            label="準備好了就按這裡",
            style=discord.ButtonStyle.primary,
            custom_id="verify_message"
        )
    
    # 連結到AskStudentId
    async def start(self,button,interaction):
        try :
            # 確認使用者沒有二次驗證
            cursor.execute("SELECT * FROM user_sql WHERE discord_id =?",(interaction.user.id,))
            check=cursor.fetchone()
            if check :
                await interaction.response.send_message(
                    "你都有身分組了還想幹嘛",
                    ephemeral=True
                )
                return
            
            await interaction.response.send_modal(AskStudentId())
        except Exception as e :
            logging.error(f"開始驗證按鈕：{e}", exc_info=True)
            interaction.response.send_message(
                "按鈕出了問題，我們已收到報錯訊息，請耐心等候我們的修復！"
            )

#====================
# Modal輸入學號
#====================

class AskStudentId(discord.ui.Modal):
    """
    輸入學號的輸入框
    """
    
    def __init__(self):
        super().__init__(title="身分驗證")
        self.add_item(
            discord.ui.InputText(
                label="請輸入學號，我們將寄驗證碼到您的信箱",
                placeholder="ex:C114152236",
                min_length=10,
                max_length=10,
            )
        )
    
    # 產生驗證碼
    async def callback(self,interaction):
        try :
            student_id=self.children[0].value.upper()

            # 確認伺服器沒人用過這個學號
            cursor.execute("SELECT * FROM user_sql WHERE student_id =?",(student_id,))
            check=cursor.fetchone()
            if check :
                await interaction.response.send_message(
                    f"此學號已綁定一個帳號：{check(1)}，你可以再次驗證以覆蓋掉那個帳號",
                    view=StartCode(),
                    ephemeral=True
                )
                return
            
            student_id[3:]
            # 確認是電子工程系學生
            if student_id[2:] != "C114" or student_id[3:6] != "152":
                await interaction.response.send_message(
                    "你確定你是建工電子的嗎，如果是轉系生請開單聯絡管理員手動把你加入",
                    ephemeral=True
                )
                return
            
            code=str(random.randint(100000,999999))

            # 記憶驗證碼(大寫)
            code_ram[interaction.user.id]={
                "code":code,
                "student_id":student_id
            }

            await interaction.response.defer(ephemeral=True,invisible=False)
            
                # 寄信
            success=await send_email(
                f"{student_id.lower()}@nkust.edu.tw",
                code
            )

            # 判斷寄信是否成功
            if success:
                asyncio.create_task(code_timer(interaction.user.id))
                await interaction.followup.send(
                    f"成功寄送驗證碼，請查看您的學校信箱，並在以下輸入框輸入驗證碼",
                    view=StartCode(),
                    ephemeral=True
                )
            else:
                await interaction.followup.send(
                    f"驗證碼寄送失敗，請確認您輸入了正確的學號",
                    ephemeral=True
                )
        except Exception as e :
            logging.error(f"輸入學號並傳送驗證碼：{e}", exc_info=True)
            interaction.response.send_message(
                "產生驗證碼或寄信途中出了點問題，我們已收到報錯訊息，請耐心等候我們的修復！",
                ephemeral=True
                )

#====================
# 寄驗證信
#====================

async def send_email(to, code):
    email_content=email_json["code"]
    try:
        # email內容
        email=EmailMessage()
        email["From"]=email_user
        email["To"]=to
        email["Subject"]=email_content["subject"]
        email.set_content(email_content["content"].format(code=code))
        
        # 寄件設定
        await aiosmtplib.send(
            email,
            hostname="smtp.gmail.com",
            port=587,
            username=email_user,
            password=email_pw,
            start_tls=True
        )
        return True
    except Exception as e:
        print(f"寄信失敗:{e}")
        return False
  
#====================
# 驗證碼的時限
#====================

async def code_timer(user_id):
    await asyncio.sleep(CODE_TIMEOUT)
    if user_id in code_ram:
        del code_ram[user_id]
  
#====================
# view進入驗證碼modal
#====================

class StartCode(discord.ui.View):
    def __init__(self,):
        super().__init__(timeout=CODE_TIMEOUT, disable_on_timeout=True)

    @discord.ui.button(
        label="點此輸入驗證碼",
        style=discord.ButtonStyle.primary
        )
    
    # 傳送到modal
    async def start(self,button,interaction):
        await interaction.response.send_modal(EnterCode())

#====================
# Modal輸入驗證碼
#====================      

class EnterCode(discord.ui.Modal):
    def __init__(self):
        super().__init__(title="輸入驗證碼")
        self.add_item(
            discord.ui.InputText(
                label="輸入驗證碼",
                placeholder="輸入六位數驗證碼",
                min_length=6,
                max_length=6
            )
        )

    async def callback(self,interaction):
        enter_code=self.children[0].value
        user_data=code_ram.get(interaction.user.id)

        # 時間超過user_id已經刪除
        if not user_data:
            await interaction.response.send_message(
                "驗證碼已無效，請重新驗證",
                ephemeral=True
            )
            return
        
        # 驗證碼輸入錯誤
        if enter_code != user_data["code"]:
            await interaction.response.send_message(
                "驗證碼錯誤，請確認後再輸入一次",
                ephemeral=True
            )
            return
        try :

            # 抓年級跟班級
            role_grade=role_map_grade[user_data["student_id"][:4]]
            role_class=role_map_class[user_data["student_id"][7]]
            role=f"{role_grade}-{role_class}"
            
            # 抓身分組
            role_search=discord.utils.get(interaction.guild.roles,name=role)

            # bot分配身分組
            if role_search:
                channel=bot.get_channel(1488954519512416397)
                await interaction.user.add_roles(role_search)
                await channel.send(f"歡迎{user_data['student_id']}加入伺服器")
                await interaction.response.send_message(
                    f"✅ 驗證成功！已分配身分組：'{role}'",
                    ephemeral=True
                )

                # 刪掉原本的人的所有身分組
                cursor.execute("SELECT * FROM user_sql WHERE student_id = ?",(user_data["student_id"],))
                delete = cursor.fetchone()
                member = interaction.guild.get_member(delete[1])
                await member.edit(roles=[])
                
                # 存入資料庫
                inc_data(user_data["student_id"],interaction.user.id,role)
            else :
                await interaction.response.send_message(
                    f"找不到身分組:{role}",
                    ephemeral=True
                )
                return
            
        except Exception as e :
            logging.error(f"分配身分組：{e}", exc_info=True)
            interaction.response.send_message(
                "分配身分組出了點問題，我們已收到報錯訊息，請耐心等候我們的修復！",
                ephemeral=True
                )

#====================
# 資料存入資料庫
#====================

def inc_data(student_id,discord_id,role):
    verified_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
    cursor.execute(
        """
        INSERT OR REPLACE INTO user_sql(student_id,discord_id,role,verified_time)
        VALUES(?,?,?,?)
        """,
        (student_id,discord_id,role,verified_time)
    )
    conn.commit()

