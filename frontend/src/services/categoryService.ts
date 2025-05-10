import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Category } from '../types/category.types';

export default class CategoryService {
  // Получить все категории
  static async getCategories(): Promise<Category[]> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data;
  }
};