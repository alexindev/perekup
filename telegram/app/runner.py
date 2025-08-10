import asyncio

from telethon import TelegramClient

from app.config.setup import settings, app_logger as log
from app.clients.memcached_client import memcached_dedup
from app.clients.llm_client import LLMService
from app.services.notification_service import NotificationService
from app.services.message_processor import MessageProcessor
from app.storage.cache import MessageStorage
from app.handlers.register_handles import handle_register


class BotRunner:
    """Класс для запуска и управления ботами"""

    def __init__(self):
        self.userbot: TelegramClient | None = None
        self.bot: TelegramClient | None = None

        # Инициализация сервисов
        self.storage = MessageStorage()
        self.llm_service = LLMService()
        self.notification_service = NotificationService()
        self.message_processor = MessageProcessor(
            storage=self.storage,
            llm_service=self.llm_service,
            notification_service=self.notification_service,
            batch_interval=60,
        )

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
            api_hash=settings.TG.API_HASH,
        )
        await self.bot.start(bot_token=settings.TG.BOT_TOKEN)
        log.info("Bot запущен")

    async def shutdown(self) -> None:
        """Завершение работы"""
        log.info("Завершение работы...")

        try:
            await self.message_processor.stop()
        except Exception as e:
            log.error(f"Ошибка остановки message_processor: {e}")

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
        """Запуск приложения"""
        try:
            # Проверяем соединение с memcached
            log.info("Проверка соединения с memcached...")
            if not memcached_dedup.test_connection():
                log.error("Не удалось подключиться к memcached!")
                raise ConnectionError("Memcached недоступен")
            log.info("Соединение с memcached установлено")

            await self.start_userbot()
            await self.start_bot()

            # Запускаем обработчик сообщений
            await self.message_processor.start()

            log.info("Регистрация обработчиков...")
            await handle_register(self.userbot, self.bot, self.message_processor)

            log.info("Боты запущены, ожидание сообщений...")
            await asyncio.gather(
                self.userbot.run_until_disconnected(), self.bot.run_until_disconnected()
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
