import logging
import sys


def setup_logging():
    """ Настройка логгеров """

    # Проверяем, был ли уже настроен логгер
    if logging.getLogger().hasHandlers():
        return

    # Форматтер
    formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(module)s:%(funcName)s:%(lineno)d | %(message)s')

    # Обработчик для вывода в консоль
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # Настройка логгеров
    loggers = ['database', 'app']
    for logger_name in loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.INFO)
        logger.addHandler(console_handler)
