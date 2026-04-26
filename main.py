import discord
import os
import datetime
import logging
import core.system.verify as verify
import core.system.count as count
import core.admin_command.edit_vip as edit_vip
import core.maintion_command.version_update as version_update
from dotenv import load_dotenv
from discord.ext import commands, tasks
from core.system.logger import setup_logging
# pip freeze > package.txt

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
async def edit(ctx,
    action = discord.Option(str, choices = ["加入", "移除"]),
    one_id = discord.Option(str, description = "只能輸入一個學號", required = False),
    file = discord.Option(discord.Attachment, "上傳檔案", required = False)
    ):
    
    await edit_vip.edit(ctx, action, one_id, file)

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

bot.run(discordbot_api)