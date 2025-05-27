import hashlib
import memcache

from app.config.setup import app_logger as log, settings


class MemcachedClient:
    """Клиент для работы с Memcached"""

    def __init__(self, server: str = settings.DB.MEMCACHED_URI):
        self.mc = memcache.Client([server])
        self.ttl_seconds = 86400  # 24 часа

    @staticmethod
    def _get_message_hash(text: str) -> str:
        """Создание хеша сообщения"""
        return hashlib.md5(text.encode("utf-8")).hexdigest()[:16]

    def is_duplicate(self, text: str) -> bool:
        """
        Проверка дубликата сообщения (24 часа TTL)
        Возвращает True если сообщение уже было, False если новое
        """
        text_hash = self._get_message_hash(text)
        key = f"msg:{text_hash}"

        # Проверяем есть ли уже такое сообщение
        if self.mc.get(key):
            return True

        # Сохраняем новое сообщение на 24 часа
        self.mc.set(key, "1", time=self.ttl_seconds)
        return False

    def test_connection(self) -> bool:
        """Проверка соединения с memcached"""
        try:
            self.mc.set("test_key", "test_value", time=1)
            result = self.mc.get("test_key")
            return result == "test_value"
        except Exception as e:
            log.error(f"Ошибка соединения с memcached: {e}")
            return False


memcached_dedup = MemcachedClient()
