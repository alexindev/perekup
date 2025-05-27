from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncEngine,
    AsyncSession,
)

from app.config import settings

# Создаем асинхронный движок
async_engine: AsyncEngine = create_async_engine(
    url=settings.DB.DB_URI,
    echo=False,
    echo_pool=False,
    pool_size=50,
    max_overflow=10,
)

# Создаем фабрику сессий
async_session = async_sessionmaker(
    bind=async_engine, expire_on_commit=False, autoflush=False, autocommit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Получить сессию базы данных"""
    async with async_session() as session:
        yield session


async def close_connect():
    """Закрыть соединение с базой данных"""
    await async_engine.dispose()
