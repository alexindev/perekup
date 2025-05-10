/**
 * API константы для приложения
 */

// Базовый URL для API
export const BASE_API_URL = import.meta.env.VITE_API_URL || 'https://b.ru.tuna.am/api';

// Эндпоинты API
export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: '/auth',

  // Пользователь
  USER: {
    GET_ME: '/users/me',
    TOGGLE_BOT: '/users/toggle-bot'
  },
  
  // Подписка
  SUBSCRIPTION: {
    GET: '/subscription',
    EXTEND: '/subscription/extend',
    HISTORY: '/subscription/history'
  },
  
  // Пользовательские подписки (на товары)
  USER_SUBS: {
    SUBS: '/subs',
  },

  // Категории
  CATEGORIES: {
    GET_ALL: '/categories',
  },

  // Модели
  MODELS: {
    GET_ALL: '/models',
    GET_BY_CATEGORY: '/models',
  },

  // Спецификации
  SPECS: {
    GET_ALL: '/specs',
    GET_BY_MODEL: '/specs',
  },

};

// Время хранения аутентификации
export const AUTH_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 часа
export const AUTH_STORAGE_KEY = 'tg_auth_state'; 