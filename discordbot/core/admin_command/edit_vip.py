import io
import openpyxl
import sqlite3
import logging
from path import DB_PATH
from config import VIP_ROLE, SOCIETY_COMMAND_CHANNEL

bot = None

def init(b):
    global bot
    bot = b

logger = logging.getLogger("ec_bot")

#===================
# 給繳費系會員身分組
#===================

async def edit(ctx, action, student_id, file):
    '''批量編輯繳費系會員'''
    await ctx.defer()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 一次的加入操作
    async def do_add(id):
        cursor.execute("SELECT * FROM user_sql WHERE student_id = ?",
            (id, )
        )
        vip = cursor.fetchone()

        if not vip:
            cursor.execute("""
                INSERT INTO user_sql (student_id, is_vip)
                VALUES(?,?)
            """,(id, 1))
            return False
        
        member = ctx.guild.get_member(vip[2])
        
        if member:
            await member.add_roles(VIP_ROLE)
            cursor.execute(
                "UPDATE user_sql SET is_vip = 1 WHERE student_id = ?",
                (id,)
            )
            return True
        return False
    
    # 一次的移除操作
    async def do_delete(id):
        cursor.execute("SELECT * FROM user_sql WHERE student_id = ?",
            (id, )
        )
        vip = cursor.fetchone()

        if not vip:
            return False
        
        member = ctx.guild.get_member(vip[2])

        if member:
            await member.remove_roles(VIP_ROLE)
            cursor.execute(
                "UPDATE user_sql SET is_vip = 0 WHERE student_id = ?",
                (id,)
            )
            return True
        return False

    try:

        if action == "加入":
            do = do_add
        elif action == "移除":
            do = do_delete

        if ctx.channel.id != SOCIETY_COMMAND_CHANNEL:
            await ctx.followup.send(
                "好好在指令頻道打指令很難嗎，都大學了難道我還要告訴你你家在哪嗎",
                ephemeral = True
            )
            return
        
        if not file and not student_id:
            await ctx.followup.send(
                "你怎麼好意思打指令結果什麼都不輸入佔用伺服器資源",
                ephemeral = True
            )
            return
        
        # 輸入資料
        if file:
            content = await file.read()
            wb = openpyxl.load_workbook(io.BytesIO(content))
            wa=wb.active

            success = 0
            fail=[]

            for row in wa.iter_rows(min_row = 1, values_only = True):
                if not row[0]:
                    continue
                id = str(row[0]).upper()
                if await do(id):
                    success += 1
                else :
                    fail.append(id)
            conn.commit()
            conn.close()

            if len(fail) == 0:
                await ctx.followup.send(f"成功{action}{success}個繳費系會員")
            else:
                await ctx.followup.send(f"成功{action}{success}個繳費系會員\n並且有{len(fail)}個成員不在伺服器裡，以下是名單：\n{fail}")
            return
        
        # 輸入單一使用者
        if student_id:
            if await do(student_id.upper()):
                await ctx.followup.send(f"成功將{student_id}{action}繳費系會員")
            else:
                await ctx.followup.send(f"{student_id}沒有在伺服器")
            conn.commit()
            conn.close()

    except Exception as e:
        logger.error(f"add_vip指令：{e}", exc_info=True)
        await ctx.followup.send(
            "add_vip指令出了問題，開發組已收到報錯訊息，請耐心等候我們的修復！",
            ephemeral = True
        )
        conn.close()