import discord
import os
import datetime
import verify
import count
import logging
from discord.ext import commands, tasks
from logger import setup_logging
from dotenv import load_dotenv

#====================
# 傳bot參數
#====================

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
verify.init(bot)
count.init(bot)

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

@tasks.loop(minutes = 10)
async def update_stats():
    await count.rename()

bot.run(discordbot_api)