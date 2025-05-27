from telethon import events
from telethon.client import TelegramClient

from app.config.setup import chats
from app.handlers.userbot import create_message_handler
from app.handlers.commands import start_command
from app.services.message_processor import MessageProcessor


async def handle_register(
    userbot: TelegramClient, bot: TelegramClient, message_processor: MessageProcessor
):
    """Регистрация обработчиков"""

    # Обработчик с переданным message_processor
    handle_new_message = create_message_handler(message_processor)

    # Регистрируем обработчик для userbot
    userbot.add_event_handler(handle_new_message, events.NewMessage(chats=chats))

    # Обработчики команд для бота
    bot.add_event_handler(start_command, events.NewMessage(pattern="/start"))
