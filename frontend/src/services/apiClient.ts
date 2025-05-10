import axios from 'axios';
import { BASE_API_URL } from '../constants/api';

// Создаем инстанс axios с базовыми настройками
const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление перехватчика ответов для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Здесь можно централизованно обрабатывать ошибки API
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 