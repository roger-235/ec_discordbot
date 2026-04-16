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
    def emit(self, record:logging.LogRecord):
        msg=self.format(record)
        if len(msg) > 1900 :
            msg=msg[:1900]+"...\n（截斷）"
        asyncio.create_task(self._send(msg))
    async def _send(self, msg:str):
        payload = {
        "embeds": [{
            "description": f"```\n{msg}\n```",
            "color": 0xFAC775
            }]
        }
        async with aiohttp.ClientSession() as session:
            await session.post(self.webhook, json=payload)

def setup_logging() -> logging.Logger:
    logger=logging.Logger("ec_bot")
    logger.setLevel(logging.DEBUG)
    fmt=logging.Formatter(
        "%(asctime)s [%(levelname)-8s] %(filename)s:%(lineno)d %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console=logging.StreamHandler()
    console.setLevel(logging.DEBUG)
    console.setFormatter(fmt)

    webhook=WebhookHandler(log_webhook_url, level=logging.WARNING)
    webhook.setFormatter(fmt)

    logger.addHandler(console)
    logger.addHandler(webhook)

    return logger
