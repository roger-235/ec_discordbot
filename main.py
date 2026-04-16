import discord
import os
import verify
import datetime
import logging
from logger import setup_logging
from dotenv import load_dotenv

bot = discord.Bot()
verify.init(bot)

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

bot.run(discordbot_api)