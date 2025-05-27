import logging

from pathlib import Path
from os import getenv

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_settings import BaseSettings

from app.config.logger import setup_logging


BASE_DIR = Path(__file__).parent.parent

load_dotenv()
setup_logging()


class TGConfig(BaseModel):
    """Настройки телеграм"""

    API_ID: int = getenv("API_ID")
    API_HASH: str = getenv("API_HASH")
    BOT_TOKEN: str = getenv("BOT_TOKEN")
    BOT_SESSION: str = getenv("BOT_SESSION")
    USER_BOT_SESSION: str = getenv("USER_BOT_SESSION")
    WEB_APP_URL: str = getenv("WEB_APP_URL")


class DataBaseConfig(BaseModel):
    """Настройки бд"""

    DB_URI: str = getenv("DB_URI", "postgres://postgres:postgres@localhost:5432")
    MEMCACHED_URI: str = getenv("MEMCACHED_URI", "127.0.0.1:11211")


class Settings(BaseSettings):
    """Инициализация настроек"""

    TG: TGConfig = TGConfig()
    DB: DataBaseConfig = DataBaseConfig()


chats = []
db_logger = logging.getLogger("database")
app_logger = logging.getLogger("app")
settings = Settings()
