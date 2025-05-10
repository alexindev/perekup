import { useState, useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";
import userService from "../services/userService";
import { NavigationProps } from "../types/components/user.types";
import { ToggleBotResponse } from "../types/api/responses";
import { useUserStore } from "../hooks/useUserStore";

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { webApp } = useTelegram();
  const { userData, updateUserData } = useUserStore();
  const [isBotActive, setIsBotActive] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Синхронизация состояния с данными из API
  useEffect(() => {
    if (userData && userData.isBotActive !== undefined) {
      setIsBotActive(userData.isBotActive);
    }
  }, [userData]);

  // Обработчик нажатия на кнопку бота
  const handleToggleBotClick = async () => {
    if (isToggling) return; // Предотвращаем множественные нажатия
    
    setIsToggling(true);
    // Инвертируем текущее значение для запроса (но не обновляем UI сразу)
    const requestedState = !isBotActive;

    try {
      if (webApp) {
        // Отправляем запрос к API для изменения состояния бота
        const response = await userService.toggleBot(
          webApp.initData,
          requestedState
        );

        // Получаем актуальное состояние из ответа сервера
        const responseData = response as ToggleBotResponse;

        // Обновляем UI в соответствии с ответом сервера
        setIsBotActive(responseData.status);
        
        // Обновляем данные пользователя в хранилище
        if (userData) {
          updateUserData({ isBotActive: responseData.status });
        }

        console.log(
          `Бот ${responseData.status ? "активирован" : "деактивирован"}`
        );
      }
    } catch (error) {
      console.error("Ошибка при изменении состояния бота:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DFDFDF] z-20">
      {" "}
      {/* Обновлен цвет границы */}
      <div className="flex justify-around items-center h-14">
        {" "}
        {/* Уменьшена высота для единообразия */}
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center justify-center w-1/3 h-full"
          aria-label="Перейти на главную"
        >
          <svg
            className={`w-6 h-6 ${
              currentPage === "home" ? "text-[#E85B01]" : "text-[#3C3C3C]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span
            className={`text-xs mt-0.5 ${
              currentPage === "home" ? "text-[#E85B01]" : "text-[#3C3C3C]"
            }`}
          >
            Главная
          </span>
        </button>
        {/* Обновленная кнопка управления ботом */}
        <button
          onClick={handleToggleBotClick}
          disabled={isToggling}
          className="flex flex-col items-center justify-center w-1/3 h-full relative"
        >
          <div
            className={`relative w-6 h-6 flex items-center justify-center transition-colors duration-300`}
          >
            {/* Иконка Telegram */}
            <svg
              className={`w-6 h-6 transition-all ${
                isToggling 
                  ? "text-gray-400" 
                  : isBotActive 
                    ? "text-[#E85B01]" 
                    : "text-[#3C3C3C]/50"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.05.01-.23-.08-.32-.1-.1-.25-.07-.35-.04-.2.05-2.35 1.49-3.58 2.27-.33.22-.64.33-.99.33-.39 0-1.04-.23-1.59-.41a2.41 2.41 0 0 1-1.45-.88c-.64-.92.69-1.43 2.36-2.17a94.63 94.63 0 0 1 5.76-2.4c1.38-.48 3.77-.24 3.56 1.93z" 
              />
            </svg>
            
            {/* Индикатор загрузки при переключении */}
            {isToggling && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-t-transparent border-[#E85B01] rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Индикатор состояния (точка) */}
            {!isToggling && (
              <div className={`absolute top-0 right-0 h-2 w-2 rounded-full border border-white ${
                isBotActive ? "bg-green-500" : "bg-red-500"
              } ${isBotActive ? "animate-pulse" : ""}`}></div>
            )}
          </div>
          
          <span className={`text-xs mt-0.5 transition-colors ${
            isBotActive ? "text-[#E85B01]" : "text-[#3C3C3C]"
          }`}>
            {isToggling ? "..." : isBotActive ? "Активен" : "Неактивен"}
          </span>
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="flex flex-col items-center justify-center w-1/3 h-full"
          aria-label="Перейти в профиль"
        >
          <svg
            className={`w-6 h-6 ${
              currentPage === "profile" ? "text-[#E85B01]" : "text-[#3C3C3C]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span
            className={`text-xs mt-0.5 ${
              currentPage === "profile" ? "text-[#E85B01]" : "text-[#3C3C3C]"
            }`}
          >
            Профиль
          </span>
        </button>
      </div>
    </nav>
  );
};
