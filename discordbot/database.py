import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

db = None

async def init():
    global db
    db = await asyncpg.connect(os.getenv("DATABASE_URL"))

async def get_user(student_id: str):
    return await db.fetchrow(
        'SELECT * FROM users WHERE "studentId" = $1 ',
        student_id
    )

async def get_user_by_discord_id(discord_id: str):
    return await db.fetchrow(
        'SELECT * FROM users WHERE "discordId" = $1',
        discord_id
    )

async def write_discord_id(student_id: str, discord_id: str):
    await db.execute(
        'UPDATE users SET "discordId" = $1 WHERE "studentId" = $2',
        discord_id,student_id
    )