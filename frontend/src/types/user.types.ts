/**
 * Интерфейсы для пользователя
 */

/**
 * Интерфейс для ответа метода getMe и getProfile
 */
export interface UserProfile {
  id: number;
  fullName: string;
  daysLeft: number;
  isBotActive: boolean;
}

/**
 * Интерфейс для запроса авторизации
 */
export interface AuthPayload {
  initData: string;
}

/**
 * Интерфейс для пользовательских подписок
 */
export interface UserSubs {
  id: number;
  name: string;
  spec_type: string;
} 