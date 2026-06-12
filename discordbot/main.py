import discord
import os
import datetime
import logging
import database
import core.system.verify as verify
import core.system.count as count
import core.system.service as service
import core.maintion_command.version_update as version_update
from dotenv import load_dotenv
from discord.ext import commands, tasks
from core.system.logger import setup_logging
from config import SERVICE_CATEGORY

#====================
# 傳bot參數
#====================

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)
verify.init(bot)
count.init(bot)
service.init(bot)

#====================
# 載入log
#====================

setup_logging()
logger=logging.getLogger("ec_bot")

#====================
# 載入env
#====================

load_dotenv()
discordbot_api=os.getenv("DISCORDBOT_API")

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

    bot.add_view(service.ServiceView())
    await service.save_message()

    await database.init()
    update_stats.start()

#====================
# 固定時間檢查人數並更新
#====================

@tasks.loop(minutes = 10)
async def update_stats():

    await count.rename()

#====================
# 發布版本更新指令
#====================

@bot.slash_command(name = "版本更新通知指令", description = "機器人自動發布版本更新通知")
async def post(
    ctx,
    update_place= discord.Option(str, choices = [
        discord.OptionChoice(name = "系學會相關更新", value = "society"),
        discord.OptionChoice(name = "系會員相關更新", value = "member")
        ]),
    update_item = discord.Option(str, choices = ["server_update", "new_command", "command_update", "fix_bug"])
):
    await ctx.send_modal(version_update.Post(update_place, update_item))

#====================
# 刪除開單頻道
#====================

@bot.slash_command(name = "close", discription = "關閉目前的私人頻道")
async def close_service(ctx):
    channel = ctx.channel
    if channel.category and channel.category.id == SERVICE_CATEGORY:
        await channel.delete()
    else:
        await ctx.respond(
            "這個指令很危險沒事不要亂玩，等你用得到的時候自然就知道他是做什麼的了",
            ephemeral = True
        )

bot.run(discordbot_api)