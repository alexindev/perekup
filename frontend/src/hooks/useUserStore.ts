import { useState, useEffect } from 'react';
import userStore from '../store/userStore';
import { UserProfile } from '../types/user.types';

/**
 * Хук для доступа к данным пользователя из глобального хранилища
 */
export const useUserStore = () => {
  // Локальное состояние для форсирования ререндера компонентов
  const [userData, setUserData] = useState<UserProfile | null>(userStore.userData);

  useEffect(() => {
    // Подписываемся на изменения в хранилище
    const unsubscribe = userStore.subscribe(() => {
      setUserData(userStore.userData);
    });
    
    // Отписываемся при размонтировании компонента
    return () => unsubscribe();
  }, []);

  return {
    /**
     * Данные пользователя
     */
    userData,
    
    /**
     * Установить новые данные пользователя
     */
    setUserData: (data: UserProfile | null) => {
      userStore.setUserData(data);
    },
    
    /**
     * Обновить часть данных пользователя
     */
    updateUserData: (partialData: Partial<UserProfile>) => {
      userStore.updateUserData(partialData);
    }
  };
}; 