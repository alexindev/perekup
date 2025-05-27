from dataclasses import dataclass
from datetime import datetime

from app.clients.memcached_client import memcached_dedup


@dataclass
class MessageData:
    """Данные сообщения для обработки"""
    message_id: int
    text: str
    chat_id: int
    chat_title: str
    user_id: int
    username: str | None
    timestamp: datetime


class MessageStorage:
    """Реализация хранилища на memcached"""
    
    def __init__(self):
        self.mc = memcached_dedup
    
    def is_duplicate(self, text: str) -> bool:
        """Проверка на дубликат"""
        return self.mc.is_duplicate(text)
    
    def store_message(self, message: MessageData, ttl: int = 900) -> None:
        """Сохранение сообщения"""
        key = f"message_{message.message_id}"
        self.mc.mc.set(key, message, time=ttl)
    
    def get_message(self, message_id: int) -> MessageData | None:
        """Получение сообщения по ID"""
        key = f"message_{message_id}"
        return self.mc.mc.get(key)
    
    def delete_message(self, message_id: int) -> None:
        """Удаление сообщения"""
        key = f"message_{message_id}"
        self.mc.mc.delete(key) 