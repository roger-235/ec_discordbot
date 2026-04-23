import discord
import os
import datetime
import logging
import core.verify as verify
import core.count as count
import core.admin_command as admin_command
from discord.ext import commands, tasks
from core.logger import setup_logging
from dotenv import load_dotenv

#====================
# 傳bot參數
#====================

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
verify.init(bot)
count.init(bot)
admin_command.init(bot)

#====================
# 載入log
#====================

setup_logging()
logger=logging.getLogger("ec_bot")

#====================
# 載入env
#====================

load_dotenv()
discordbot_api=os.getenv("discordbot_api")

#====================
# 機器人啟動函式
#====================

@bot.event
async def on_ready():
    time=datetime.datetime.now()
    print(f"{bot.user}已上線!!{time}")
    verify_config=verify.verify_msg

    # 驗證學號訊息
    bot.add_view(verify.StartVerify())
    await verify.save_massage()

    update_stats.start()

#====================
# 固定時間檢查人數並更新
#====================

@tasks.loop(minutes = 10)
async def update_stats():
    await count.rename()

#====================
# 加入繳費系會員的指令
#====================

@bot.slash_command(name = "add_vip", description = "丟一個把學號全放在A列的.xlsx檔案可以批次輸入學號來增加繳費系會員名單")
async def add_vip(ctx, 
    student_id = discord.Option(str, description = "輸入學號", required = False),
    file = discord.Option(discord.Attachment, "上傳檔案", required = False)
    ):
    
    await admin_command.add_vip(ctx, student_id, file)
    
bot.run(discordbot_api)