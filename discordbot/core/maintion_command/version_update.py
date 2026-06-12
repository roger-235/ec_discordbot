import discord
import json
import datetime
from path import VERSION_POST_JSON, VERSION_JSON
from config import MEMBER_NOTICE_CHANNEL, SOCIETY_NOTICE_CHANNEL

bot = None
time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def init(b):
    global bot
    bot = b

with open(VERSION_POST_JSON, "r", encoding = "utf-8") as v:
    version_json = json.load(v)

class Post(discord.ui.Modal):
    def __init__(self, update_place, update_item):
        super().__init__(title = f"{update_place}公告")
        self.update_place = update_place
        self.update_item = update_item
        if update_item == "server_update":
            self.add_item(discord.ui.InputText(
                label = "功能概要",
                placeholder= "ex:以頻道顯示人數統整"
            ))
            self.add_item(discord.ui.InputText(
                label = "詳細功能說明",
                style = discord.InputTextStyle.long,
                max_length = 100
            ))
        elif update_item == "new_command":
            self.add_item(discord.ui.InputText(
                label = "指令名稱",
                placeholder= "ex:/command"
            ))
            self.add_item(discord.ui.InputText(
                label = "詳細指令功能說明",
                style = discord.InputTextStyle.long,
                max_length = 100
            ))
        elif update_item == "command_update":
            self.add_item(discord.ui.InputText(
                label = "指令名稱",
                placeholder= "ex:/command"
            ))
            self.add_item(discord.ui.InputText(
                label = "指令的新舊功能差異",
                style = discord.InputTextStyle.long,
                max_length = 100
            ))
        elif update_item == "fix_bug":
            self.add_item(discord.ui.InputText(
                label = "bug概要與編號",
                placeholder = "ex:登入異常"
            ))
            self.add_item(discord.ui.InputText(
                label = "詳細bug內容與修復點",
                max_length = 100
            ))
            self.add_item(discord.ui.InputText(
                label = "一到一百給bug修復難易度評分",
                max_length = 3
            ))
            
    async def callback(self, interaction):

        update_place = self.update_place
        update_item = self.update_item
        first = self.children[0].value
        second = self.children[1].value
        third = None
        hair = None

        with open(VERSION_JSON, "r", encoding = "utf-8") as v:
            version_load = json.load(v)
            version_num = version_load[f"{update_place}"]

        # 判斷版本號變化 
        version_num["major"] += (update_item == "server_update")
        version_num["minor"] += (update_item == "new_command")
        version_num["patch"] += (update_item in ("command_update", "fix_bug"))
        version_num["minor"] = (0 if update_item == "server_update" else version_num["minor"])
        version_num["patch"] = (0 if update_item in("server_update", "new_command") else version_num["patch"])
        
        version_load[update_place] = version_num

        with open(VERSION_JSON, "w", encoding = "utf-8") as v:
            json.dump(version_load, v, indent = 4)
        
        version = f"{version_num["major"]} . {version_num["minor"]} . {version_num["patch"]}"

        if len(self.children) > 2:
            third = self.children[2].value
        time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        #更新簽名，之後有更多人協作的話要作一個根據發布人的簽名
        sign = "陰暗爬行的長髮哥布林"

        # 選擇傳送的頻道
        if update_place == "society":
            channel = interaction.guild.get_channel(SOCIETY_NOTICE_CHANNEL)
            place = "系學會相關更新"
        elif update_place == "member":
            channel = interaction.guild.get_channel(MEMBER_NOTICE_CHANNEL)
            place = "系會員相關更新"

        # 輸入數字防呆
        if update_item == "fix_bug":
            try:
                hair = third
            except ValueError:
                await interaction.response.send_message(
                    "輸入一到一百以內的數字是很難是不是\n就是有你這種傻逼我他媽還需要特別為了你特別寫防蠢機制"
                )

        # json文章傳入並發送
        await channel.send(version_json[f"{update_item}"].format(
            first = first,
            version = version,
            second = second,
            third = third,
            time = time,
            hair = hair,
            place = place,
            sign = sign
            ))
        
        await interaction.respond("公告已發送")