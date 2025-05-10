/**
 * Типы ответов API
 */

/**
 * Базовый интерфейс для API-ответов
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Интерфейс ответа на переключение статуса бота
 */
export interface ToggleBotResponse {
  status: boolean;
} 