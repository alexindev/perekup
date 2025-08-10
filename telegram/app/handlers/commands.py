from telethon.tl.custom import Message
from telethon.tl.types import (
    ReplyInlineMarkup,
    KeyboardButtonWebView,
    KeyboardButtonRow,
)

from app.config import settings
from app.config.setup import app_logger as log


async def start_command(event: Message):
    """Команда /start"""
    user = await event.get_sender()
    user_name = user.first_name if user.first_name else "Пользователь"

    welcome_text = f"""
    🤖 Привет, {user_name}!
    
    Добро пожаловать в Сканер Горбушки!
    Нажимай на кнопку ниже, чтобы открыть приложение! 🚀
    """.strip()
    web_app_button = KeyboardButtonWebView(
        text="🚀 Открыть настройки", url=settings.TG.WEB_APP_URL
    )

    keyboard = ReplyInlineMarkup(rows=[KeyboardButtonRow(buttons=[web_app_button])])

    log.info(f"Команда /start от пользователя: {user_name} (ID: {user.id})")
    await event.respond(welcome_text, buttons=keyboard)
