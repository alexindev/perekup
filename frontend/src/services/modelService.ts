import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Model } from '../types/category.types';

export default class ModelService {
  // Получить все модели
  static async getAllModels(): Promise<Model[]> {
    const response = await apiClient.get(API_ENDPOINTS.MODELS.GET_ALL);
    return response.data;
  }
  
  // Получить модели по категории
  static async getModelsByCategory(categoryId: string): Promise<Model[]> {
    // Правильный формат URL: /models/1
    const url = `${API_ENDPOINTS.MODELS.GET_BY_CATEGORY}/${categoryId}`;
    const response = await apiClient.get(url);
    return response.data;
  }
};