import asyncio

from app.runner import run_bots
from app.config.setup import app_logger as log


async def main():
    """Точка входа приложения"""
    try:
        await run_bots()
    except KeyboardInterrupt:
        log.info("Приложение завершено пользователем")
    except Exception as ex:
        log.error(f"Критическая ошибка: {ex}")
        raise


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info("Приложение завершено")
    except Exception as e:
        log.error(f"Фатальная ошибка: {e}")
        exit(1)
