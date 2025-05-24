from telethon.tl.custom import Message


async def start_command(event: Message):
    """Команда /start"""
    await event.respond("Главное меню")
