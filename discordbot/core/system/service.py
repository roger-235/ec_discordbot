import discord
import json
from discordbot.path import BOT_MESSAGE_JSON
from config import SERVICE_MESSAGE_CHANNEL, SOCIETY_ROLE, SERVICE_CATEGORY

bot = None

def init(b):
    global bot
    bot = b

with open(BOT_MESSAGE_JSON, "r", encoding = "utf-8") as b:
    message = json.load(b)
    service_message = message["service"]
    close_service_message = message["close_service"]

async def save_message():
    channel = bot.get_channel(SERVICE_MESSAGE_CHANNEL)
    try:
        msg = await channel.fetch_message(service_message["message_id"])
    except (discord.NotFound, discord.HTTPException):
        msg = await channel.send(
            service_message["content"],
            view = ServiceView()
        )
        service_message["message_id"] = msg.id
        message["service"] = service_message
        with open(BOT_MESSAGE_JSON, "w",encoding = "utf-8") as b:
            json.dump(message, b, ensure_ascii = False, indent = 4)


class ServiceView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout = None)

    @discord.ui.button(
        label = "按這裡開單",
        style = discord.ButtonStyle.danger,
        custom_id = "service_message"
    )
    async def start(self, button, interaction):
        member = interaction.user
        guild = interaction.guild
        society = guild.get_role(SOCIETY_ROLE)
        overwrites = {
            guild.default_role:discord.PermissionOverwrite(read_messages = False),
            member:discord.PermissionOverwrite(read_messages = True, send_messages = True),
            society:discord.PermissionOverwrite(read_messages = True, send_messages = True),
            guild.me:discord.PermissionOverwrite(read_messages = True)
        }
        category = guild.get_channel(SERVICE_CATEGORY)
        channel = await guild.create_text_channel(
            name = f"{interaction.user.name}的私人提問頻道",
            overwrites = overwrites,
            category = category
        )
        await channel.send(
            close_service_message["content"]
        )
        
