import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Category } from '../types/category.types';

export default class CategoryService {
  // Получить все категории
  static async getCategories(initData: string): Promise<Category[]> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL, {
      headers: {
        'X-Telegram': initData,
      },
    });
    console.log(response.data);
    return response.data;
  }
};