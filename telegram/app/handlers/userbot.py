from datetime import datetime

from app.config.setup import app_logger as log
from app.storage.cache import MessageData


def is_spam(text: str) -> bool:
    """Проверка текста на спам"""
    spam_words = ["запре", "спам", "програм", "разраб", "бот", "созда"]

    text_lower = text.lower()
    for word in spam_words:
        if word in text_lower:
            return True
    return False


def create_message_handler(message_processor):
    """Фабрика для создания обработчика сообщений"""

    async def handle_new_message(event):
        """Обработчик для получения всех сообщений из чатов"""
        try:
            user = await event.get_sender()
            chat = await event.get_chat()
            text = event.message.message

            # Проверка наличие username у пользователя
            if not user or not user.username:
                return

            # Спам фильтр
            if not is_spam(text):

                # Создаем объект данных сообщения
                message_data = MessageData(
                    message_id=event.message.id,
                    text=text,
                    chat_id=chat.id,
                    chat_title=chat.title or "Неизвестный чат",
                    user_id=user.id,
                    username=user.username,
                    timestamp=datetime.now(),
                )

                # Добавляем в очередь для обработки
                await message_processor.add_message(message_data)

        except Exception as e:
            log.error(f"Ошибка обработки сообщения: {e}")

    return handle_new_message
