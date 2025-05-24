from app.config import app_logger as log


async def handle_new_message(event):
    """Обработчик для получения всех сообщений из чатов"""
    try:
        user = await event.get_sender()
        chat = await event.get_chat()
        text = event.message.message

        # Ссылка на чат
        if chat and (chat.megagroup or chat.broadcast):
            chat_link = (
                f"<a href='https://t.me/{chat.username or f'c/{str(chat.id)[4:]}'}/"
                f"{event.message.id}'>{chat.title or 'Чат'}</a>"
            )
        else:
            chat_link = (
                f"<a href='https://t.me/{chat.username or f'c/{str(chat.id)[4:]}'}'>"
                f"{chat.title or 'Личный чат'}</a>"
            )

        # Проверка наличие username у пользователя
        if user and user.username:
            user_link = f"<a href='https://t.me/{user.username}'>{user.username}</a>"
        else:
            return

        message_text = (
            f"🛡 <b>Сообщение:</b> {chat_link}\n"
            f"👤 <b>Автор:</b> {user_link}\n"
            f"✉️ <b>Текст:</b> {text}"
        )

        # Проверка длины сообщения
        if len(message_text) > 4096:
            log.warning("Сообщение слишком длинное и не будет отправлено.")
            return


    except Exception as e:
        log.error(f"Ошибка обработки сообщения: {e}")
