import discord
import os
from dotenv import load_dotenv


load_dotenv()
discordbot_api=os.getenv("discordbot_api")

bot=discord.Bot()

@bot.event
async def on_ready():
    print(f"{bot.user}已上線!!")
    

bot.run(discordbot_api)