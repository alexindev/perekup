import asyncio

from telethon import TelegramClient

from app.config import settings, app_logger as log


async def get_chat_id():
    """ Получить id групп """
    async with TelegramClient(
        f'../{settings.TG.USER_BOT_SESSION}',
        api_id=settings.TG.API_ID,
        api_hash=settings.TG.API_HASH,
    ) as client:
        async for dialog in client.iter_dialogs():
            result = f'{dialog.name} - {dialog.id}'
            log.info(result)

if __name__ == '__main__':
    asyncio.run(get_chat_id())
