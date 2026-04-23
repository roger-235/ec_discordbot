import discord
import os
import datetime
import logging
import core.system.verify as verify
import core.system.count as count
import core.admin_command.edit_vip as edit_vip
from discord.ext import commands, tasks
from core.system.logger import setup_logging
from dotenv import load_dotenv

#====================
# 傳bot參數
#====================

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
verify.init(bot)
count.init(bot)
edit_vip.init(bot)

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

@bot.slash_command(name = "edit_vip", description = "丟一個把學號全放在A列的.xlsx檔案可以批次輸入學號來編輯繳費系會員名單")
async def add_vip(ctx,
    action = discord.Option(str, choices = ["加入", "移除"]),
    one_id = discord.Option(str, description = "只能輸入一個學號", required = False),
    file = discord.Option(discord.Attachment, "上傳檔案", required = False)
    ):
    
    await edit_vip.add_vip(ctx, action, one_id, file)
    
bot.run(discordbot_api)