import discord
import os
from dotenv import load_dotenv

bot=discord.Bot()

load_dotenv()
discordbot_api=os.getenv("discordbot_api")

sourse_name="四年級-乙班"
target_name=["四年級-甲班", "四年級-丙班", "三年級-乙班", "三年級-甲班", "三年級-丙班", "二年級-乙班", "二年級-甲班", "二年級-丙班", "一年級-乙班", "一年級-甲班", "一年級-丙班"]


@bot.event
async def on_ready():

    guild = bot.guilds[0]
    source_role = discord.utils.get(guild.roles, name=sourse_name)

    for role_name in target_name:
        target_role = discord.utils.get(guild.roles, name=role_name)
        if target_role is None:
            print(f"找不到目標身分組：{role_name}")
            continue
        
        await target_role.edit(permissions=source_role.permissions)
        print(f"✅ 已複製權限到：{role_name}")


bot.run(discordbot_api)