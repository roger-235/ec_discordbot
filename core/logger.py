import os
import logging
import aiohttp
import asyncio
from dotenv import load_dotenv

#====================
# 載入env
#====================

load_dotenv()
log_webhook_url=os.getenv("log_webhook_url")

class WebhookHandler(logging.Handler):
    def __init__(self, log_webhook_url:str, level=logging.WARNING):
        super().__init__(level)
        self.webhook_url=log_webhook_url

    # 取出msg修改並呼叫送出
    def emit(self, record:logging.LogRecord):
        msg=self.format(record)
        if len(msg) > 1900 :
            msg=msg[:1900]+"...\n（截斷）"
        asyncio.create_task(self._send(msg))

    # 送出webhook
    async def _send(self, msg:str):
        payload = {
        "embeds": [{
            "description": f"```\n{msg}\n```",
            "color": 0xFAC775
            }]
        }
        async with aiohttp.ClientSession() as session:
            await session.post(self.webhook_url, json=payload)

# 初始設定handler
def setup_logging() -> logging.Logger:
    logger=logging.getLogger("ec_bot")
    logger.setLevel(logging.DEBUG)
    
    # 輸出格式
    fmt=logging.Formatter(
        "%(asctime)s [%(levelname)-8s] %(filename)s:%(lineno)d %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # terminal handler
    console=logging.StreamHandler()
    console.setLevel(logging.DEBUG)
    console.setFormatter(fmt)

    # webhook handler
    webhook=WebhookHandler(log_webhook_url, level=logging.WARNING)
    webhook.setFormatter(fmt)
    
    # 加入logger
    logger.addHandler(console)
    logger.addHandler(webhook)

    return logger
