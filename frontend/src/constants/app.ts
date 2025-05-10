/**
 * Константы приложения
 * В будущем эти значения должны быть получены с бекенда
 */

// Цвета приложения
export const COLORS = {
  PRIMARY: '#E85B01',
  DARK: '#3C3C3C',
  LIGHT: '#DFDFDF',
  LIGHT_GRAY: '#CEC4C3',
  GRAY: '#A39594',
};

// Подписка
export const SUBSCRIPTION = {
  MIN_EXTENSION_DAYS: 1,
  MAX_EXTENSION_DAYS: 365,
  PRICE_PER_DAY: 50, // Условная цена за день в рублях
  DEFAULT_QUICK_SELECT_DAYS: [7, 14, 30], // Быстрый выбор дней для продления
};

// Пагинация
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
}; 