import asyncio

from app.config.setup import app_logger as log


class BatchManager:
    """Управление батчами сообщений"""

    def __init__(self, batch_processor, batch_interval: int = 60):
        self.batch_processor = batch_processor
        self.batch_interval = batch_interval
        self.current_batch: list[int] = []
        self.is_running = False

    async def start(self):
        """Запуск батчинга"""
        if self.is_running:
            return

        self.is_running = True
        asyncio.create_task(self.process_batches())
        log.info("BatchManager запущен")

    async def stop(self):
        """Остановка батчинга"""
        self.is_running = False
        log.info("BatchManager остановлен")

    def add_to_batch(self, message_id: int):
        """Добавление ID сообщения в текущий батч"""
        self.current_batch.append(message_id)

    async def process_batches(self):
        """Периодическая обработка батчей"""
        while self.is_running:
            try:
                await asyncio.sleep(self.batch_interval)

                if self.current_batch:
                    message_ids = self.current_batch.copy()
                    self.current_batch.clear()

                    # Асинхронная обработка без ожидания
                    asyncio.create_task(self.batch_processor.process_batch(message_ids))

            except Exception as e:
                log.error(f"Ошибка в BatchManager: {e}")
                await asyncio.sleep(5)
