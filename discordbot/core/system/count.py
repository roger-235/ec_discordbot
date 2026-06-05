import discord
import logging
from config import GUILD_ID, VIP_COUNT_CHANNEL, MEMBER_COUNT_CHANNEL, SOCIETY_COUNT_CHANNEL, DEV_COUNT_CHANNEL, BOT_COUNT_CHANNEL, WEBHOOK_COUNT_CHANNEL, VIP_ROLE, SOCIETY_ROLE, DEV_ROLE

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
# 主函式
#====================

async def rename():

    try :

        # 設定人數
        guild = bot.get_guild(GUILD_ID)
        pay = len(guild.get_role(VIP_ROLE).members)
        total = sum(1 for m in guild.members if len(m.roles) > 1 and not m.bot)
        society = len(guild.get_role(SOCIETY_ROLE).members)
        develop = len(guild.get_role(DEV_ROLE).members)
        robot = sum(1 for m in guild.members if m.bot)
        webhooks = await guild.webhooks()
        webhook = len(webhooks)

        update = [
            (VIP_COUNT_CHANNEL,f"💸 || 繳費系會員 - {pay}"),
            (MEMBER_COUNT_CHANNEL,f"👥 || 非繳費系會員 - {total - pay}"),
            (SOCIETY_COUNT_CHANNEL,f"🤵 || 系學會成員 - {society}"),
            (DEV_COUNT_CHANNEL,f"🧑‍🔧 || 開發組 - {develop}"),
            (BOT_COUNT_CHANNEL,f"🤖 || 機器人 - {robot}"),
            (WEBHOOK_COUNT_CHANNEL,f"🦾 || webhook - {webhook}")
        ]

        # 迴圈改變名稱
        for channel_id, new_name in update:
            channel = guild.get_channel(channel_id)
            if channel.name != new_name:
                await channel.edit(name=new_name)
    except Exception as e:
        logger.error(f"變更伺服器資訊：{e}", exc_info=True)