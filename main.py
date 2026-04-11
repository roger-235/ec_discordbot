import discord
import os
import aiosmtplib
import asyncio
import json
import random
from dotenv import load_dotenv
from email.message import EmailMessage
# pip freeze > package.txt

bot=discord.Bot()

# 全域變數
code_ram={}
CODE_TIMEOUT=180

#====================
# 載入env
#====================

load_dotenv()
discordbot_api=os.getenv("discordbot_api")
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
if not os.path.exists(remember_msg_path):
    with open(remember_msg_path,"w",encoding="utf-8") as r:
        verify={"channel":"1490543834302775438"}
        data=verify
        json.dump(data,r,indent=4)
else :
    with open(remember_msg_path,"r",encoding="utf-8") as r:
        verify=json.load(r)

#====================
# 記住message
#====================

def save_massage(data):
    with open(remember_msg_path,"w",encoding="utf-8",) as r:
        json.dump(data,r,indent=4)

#====================  
# view進驗證學號modal
#====================     

class StartVerify(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        
    @discord.ui.button(
            label="點此驗證您的身分",
            style=discord.ButtonStyle.primary,
            custom_id="verify_message"
        )
    
    # 連結到AskStudentId
    async def start(self,button,interaction):
        await interaction.response.send_modal(AskStudentId())
        print("進入對話框")

#====================
# Modal輸入學號
#====================

class AskStudentId(discord.ui.Modal):
    def __init__(self):
        super().__init__(title="身分驗證")
        print("init")
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
        print("start enter")
        
        student_id=self.children[0].value.upper()

        if not student_id.startswith("C114152"):
            await interaction.response.send_message(
                "學號格式錯誤",
                ephemeral=True
            )
            return
        
        code=str(random.randint(100000,999999))

        # 記憶驗證碼(大寫)
        code_ram[interaction.user.id]={
            "code":code,
            "student_id":student_id
        }
        
        print("開始驗證")

        await interaction.response.defer(ephemeral=True)
        
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
        
        # 抓年級跟班級
        role_grade=role_map_grade[user_data["student_id"][:4]]
        role_class=role_map_class[user_data["student_id"][7]]
        role=f"{role_grade}-{role_class}"
        role_search=discord.utils.get(interaction.guild.roles,name=role)

        # bot分配身分組
        if role_search:
            await interaction.user.add_roles(role_search)
        else :
            await interaction.response.send_message(
                f"找不到身分組'{role}'",
                ephemeral=True
            )
        channel=bot.get_channel(1488954519512416397)
        await channel.send(f"歡迎{user_data['student_id']}加入伺服器")
        await interaction.response.send_message(
            f"✅ 驗證成功！已分配身分組：'{role}'",
            ephemeral=True
        )

#====================
# 機器人啟動函式
#====================

@bot.event
async def on_ready():
    print(f"{bot.user}已上線!!")

    # 驗證學號訊息
    bot.add_view(StartVerify())
    channel=bot.get_channel(int(verify["channel"]))
    try :
        msg=await channel.fetch_message(verify.get("message_id"))
    except discord.NotFound :
        msg = await channel.send(
            "請點擊以下按鈕驗證身分",
            view=StartVerify()
        )
        verify["message_id"]=msg.id
        save_massage(verify)

bot.run(discordbot_api)

