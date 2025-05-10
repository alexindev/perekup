import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Spec } from '../types/category.types';

export default class SpecService {
  // Получить все спецификации
  static async getAllSpecs(): Promise<Spec[]> {
    const response = await apiClient.get(API_ENDPOINTS.SPECS.GET_ALL);
    return response.data;
  }
  
  // Получить спецификации по модели
  static async getSpecsByModel(modelId: string): Promise<Spec[]> {
    // Правильный формат URL: /specs/1
    const url = `${API_ENDPOINTS.SPECS.GET_BY_MODEL}/${modelId}`;
    const response = await apiClient.get(url);
    return response.data;
  }
};