import { useEffect, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UserService from '../services/userService';
import { UserProfile } from '../types/user.types';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { SubscriptionExtension } from '../components/SubscriptionExtension';
import { UserInfoCard } from '../components/UserInfoCard';
import { PaymentHistory } from '../components/PaymentHistoryCard';

export const ProfilePage = () => {
  const { webApp } = useTelegram();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Состояния для продления
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    // Загружаем данные пользователя при монтировании компонента
    if (webApp) {
      fetchUserData();
    }
  }, [webApp]);

  // Функция загрузки данных пользователя
  const fetchUserData = async () => {
    if (!webApp) {
      setError('Отсутствуют данные инициализации Telegram');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении используем данные из WebApp
      const initData = webApp.initData;
      const profileData = await UserService.getMe(initData);
      setUserData(profileData);
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error);
      setError('Не удалось загрузить данные пользователя');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Начать процесс продления
  const handleStartExtension = () => {
    setIsExtending(true);
  };

  // Отменить продление
  const handleCancelExtension = () => {
    setIsExtending(false);
  };

  // Подтвердить продление
  const handleConfirmExtension = async (days: number) => {
    if (!userData || !webApp) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Отправляем запрос на продление подписки
      // В реальном приложении здесь будет вызов API
      console.log(`Запрос на продление подписки на ${days} дней`);
      
      // После успешного продления загружаем обновленные данные пользователя
      await fetchUserData();
      
      // Сбрасываем состояние продления
      setIsExtending(false);
    } catch (error) {
      console.error('Ошибка при продлении подписки:', error);
      setError('Не удалось продлить подписку');
    } finally {
      setIsLoading(false);
    }
  };

  // Компонент состояния загрузки
  const LoadingComponent = () => (
    <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E85B01]"></div>
    </div>
  );

  // Компонент для отображения ошибки
  const ErrorComponent = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button 
          onClick={fetchUserData}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light p-4 space-y-4"> 
      {/* Карточка приветствия */}
      <UserInfoCard userData={userData} />

      {/* Отображение состояния загрузки */}
      {isLoading && !isExtending && <LoadingComponent />}

      {/* Отображение ошибки */}
      {error && !isExtending && <ErrorComponent />}

      {/* --- Карточка подписки --- */} 
      {!isLoading && !error && userData && !isExtending ? (
        // --- Отображение текущей подписки --- 
        <SubscriptionCard 
          userData={userData} 
          onExtend={handleStartExtension} 
        />
      ) : !isLoading && !error && userData && isExtending ? (
        // --- Отображение интерфейса продления --- 
        <SubscriptionExtension
          onCancel={handleCancelExtension}
          onConfirm={handleConfirmExtension}
          isLoading={isLoading}
          error={error}
        />
      ) : null}

      {/* История платежей */}
      {!isLoading && !error && userData && (
        <PaymentHistory />
      )}
    </div>
  );
}; 