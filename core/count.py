import discord
import logging

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
        guild = bot.get_guild(1488954517117472849)
        pay = len(guild.get_role(1492432261822550056).members)
        total = sum(1 for m in guild.members if len(m.roles) > 1 and not m.bot)
        society = len(guild.get_role(1490383387259568329).members)
        develop = len(guild.get_role(1489211218177560689).members)
        robot = sum(1 for m in guild.members if m.bot)
        webhooks = await guild.webhooks()
        webhook = len(webhooks)

        update = [
            (1494626253742018694,f"💸 || 繳費系會員 - {pay}"),
            (1494626460122746910,f"👥 || 非繳費系會員 - {total - pay}"),
            (1495256248466276363,f"🤵 || 系學會成員 - {society}"),
            (1494629332658819225,f"🧑‍🔧 || 開發組 - {develop}"),
            (1494626572672696490,f"🤖 || 機器人 - {robot}"),
            (1494626742265188402,f"🦾 || webhook - {webhook}")
        ]

        # 迴圈改變名稱
        for channel_id, new_name in update:
            channel = guild.get_channel(channel_id)
            if channel.name != new_name:
                await channel.edit(name=new_name)
    except Exception as e:
        logger.error(f"變更伺服器資訊：{e}", exc_info=True)