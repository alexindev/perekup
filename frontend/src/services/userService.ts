import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { UserProfile, AuthPayload } from '../types/user.types';

export default class UserService {
  // Аутентификация пользователя
  static async auth(payload: AuthPayload) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH, payload);
    return response.data;
  }

  // Получить данные текущего пользователя
  static async getMe(initData: string): Promise<UserProfile> {
    const response = await apiClient.get(API_ENDPOINTS.USER.GET_ME, {
      headers: {
        'X-Telegram': initData
      }
    });
    return response.data;
  }

  // Переключить активность бота
  static async toggleBot(initData: string, status: boolean): Promise<{ status: boolean }> {
    const response = await apiClient.patch(API_ENDPOINTS.USER.TOGGLE_BOT, { isActive: status }, {
      headers: {
        'X-Telegram': initData
      }
    });
    return response.data;
  }
};