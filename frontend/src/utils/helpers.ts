/**
 * Вспомогательные функции для приложения
 */

/**
 * Форматирование даты в локализованном формате
 * @param dateString Строка с датой в формате ISO
 * @returns Отформатированная дата
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Склонение слова "день" в зависимости от числа
 * @param days Количество дней
 * @returns Правильная форма слова
 */
export const pluralizeDays = (days: number): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  const titles = ['день', 'дня', 'дней'];
  return titles[(days % 100 > 4 && days % 100 < 20) ? 2 : cases[Math.min(days % 10, 5)]];
};

/**
 * Расчет цены подписки на основе количества дней
 * @param days Количество дней
 * @param pricePerDay Цена за день
 * @returns Общая стоимость
 */
export const calculateSubscriptionPrice = (days: number, pricePerDay: number): number => {
  return days * pricePerDay;
};

/**
 * Форматирование цены в рублях
 * @param amount Сумма в рублях
 * @returns Отформатированная строка с ценой
 */
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString('ru-RU')} ₽`;
}; 