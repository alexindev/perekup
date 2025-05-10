import { useState, useEffect, useRef } from 'react';
import UserService from '../services/userService';
import userStore from '../store/userStore';

export const useAuth = (tg: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Используем данные из хранилища
  const userData = userStore.userData;
  
  // Добавляем ref для отслеживания, был ли уже выполнен запрос
  const requestSentRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Проверяем, был ли уже отправлен запрос
      if (requestSentRef.current) {
        return;
      }
      
      try {
        if (!tg) {
          setIsLoading(false);
          return;
        }

        // Проверяем данные инициализации Telegram
        if (!tg.initData) {
          setError('Используйте Telegram для входа');
          setIsLoading(false);
          return;
        }

        // Отмечаем, что запрос отправляется
        requestSentRef.current = true;

        // Отправляем запрос на получение информации о пользователе
        try {
          const userResponse = await UserService.getMe(tg.initData);
          console.log('Ответ от /users/me:', userResponse);
          
          // Сохраняем данные пользователя в централизованное хранилище
          userStore.setUserData(userResponse);
          
          // Если запрос выполнился успешно, считаем пользователя авторизованным
          setIsAuthenticated(true);
          (tg as any).ready();
        } catch (error) {
          console.error('Ошибка при запросе /users/me:', error);
          setError('Доступ закрыт. Ошибка авторизации.');
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Ошибка при выполнении проверки авторизации:', error);
        setError('Произошла ошибка при проверке авторизации');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [tg]);

  return { isAuthenticated, error, isLoading, userData };
}; 