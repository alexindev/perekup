import asyncio

from telethon import TelegramClient

from app.config.setup import settings, app_logger as log
from app.handlers.register_handles import handle_register
from app.database import close_connect


class BotRunner:
    """Класс для запуска и управления ботами"""
    
    def __init__(self):
        self.userbot: TelegramClient | None = None
        self.bot: TelegramClient | None = None
    
    async def start_userbot(self) -> None:
        """Создание и запуск userbot"""
        log.info("Запуск userbot...")
        self.userbot = TelegramClient(
            settings.TG.USER_BOT_SESSION,
            api_id=settings.TG.API_ID,
            api_hash=settings.TG.API_HASH,
        )
        await self.userbot.start()
        log.info("Userbot запущен")
    
    async def start_bot(self) -> None:
        """Создание и запуск bot"""
        log.info("Запуск bot...")
        self.bot = TelegramClient(
            settings.TG.BOT_SESSION,
            api_id=settings.TG.API_ID,
            api_hash=settings.TG.API_HASH
        )
        await self.bot.start(bot_token=settings.TG.BOT_TOKEN)
        log.info("Bot запущен")
    
    async def shutdown(self) -> None:
        """Завершение работы"""
        log.info("Завершение работы...")
        
        try:
            await close_connect()
        except Exception as e:
            log.error(f"Ошибка закрытия БД: {e}")
        
        if self.userbot:
            try:
                await self.userbot.disconnect()
            except Exception as e:
                log.error(f"Ошибка отключения userbot: {e}")
        
        if self.bot:
            try:
                await self.bot.disconnect()
            except Exception as e:
                log.error(f"Ошибка отключения bot: {e}")
    
    async def run(self) -> None:
        """Запуск ботов"""
        try:
            await self.start_userbot()
            await self.start_bot()
            
            log.info("Регистрация обработчиков...")
            await handle_register(self.userbot, self.bot)
            
            log.info("Боты запущены, ожидание сообщений...")
            await asyncio.gather(
                self.userbot.run_until_disconnected(),
                self.bot.run_until_disconnected()
            )
        except Exception as e:
            log.error(f"Ошибка: {e}")
            raise
        finally:
            await self.shutdown()


async def run_bots() -> None:
    """Функция запуска ботов"""
    runner = BotRunner()
    await runner.run() 