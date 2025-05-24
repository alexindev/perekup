from telethon import events
from telethon.client import TelegramClient

from .userbot import handle_new_message
from .commands import start_command


async def handle_register(userbot: TelegramClient, bot: TelegramClient):
    """Регистрация обработчиков"""
    # Временно закомментировано до настройки chats
    # userbot.add_event_handler(handle_new_message, events.NewMessage(chats=chats))
    bot.add_event_handler(start_command, events.NewMessage(pattern="/start"))
