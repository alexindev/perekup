import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { UserSubs } from '../types/user.types';

/**
 * Интерфейс для данных подписки
 */
interface SubscriptionPayload {
  spec_id: number;
  spec_type: 'buy' | 'sell';
}

/**
 * Сервис для работы с подписками пользователя на товары
 */
export default class SubsService {
  /**
   * Получить подписки пользователя на товары
   * @param initData данные инициализации Telegram
   * @returns Массив подписок пользователя
   */
  static async getUserSubs(initData: string): Promise<UserSubs[]> {
    const response = await apiClient.get(API_ENDPOINTS.USER_SUBS.SUBS, {
      headers: {
        'X-Telegram': initData
      }
    });
    return response.data;
  }

  /**
   * Добавить новую подписку пользователя на товар
   * @param payload данные подписки
   * @param initData данные инициализации Telegram
   * @returns результат операции
   */
  static async addUserSub(payload: SubscriptionPayload, initData: string) {
    const response = await apiClient.post(API_ENDPOINTS.USER_SUBS.SUBS, payload, {
      headers: {
        'X-Telegram': initData
      }
    });
    return response.data;
  }

  /**
   * Удалить подписку пользователя на товар
   * @param payload данные подписки
   * @param initData данные инициализации Telegram
   * @returns результат операции
   */
  static async deleteUserSub(payload: SubscriptionPayload, initData: string) {
    const response = await apiClient.delete(API_ENDPOINTS.USER_SUBS.SUBS, {
      headers: {
        'X-Telegram': initData
      },
      data: payload // для DELETE запроса тело передается через data
    });
    return response.data;
  }
} 