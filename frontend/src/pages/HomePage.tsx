import { useState, useEffect } from "react";
import CategoryService from "../services/categoryService";
import SubsService from "../services/subsService";
import { Category, TrackedSpec } from "../types/category.types";
import { TrackedItemsList } from "../components/TrackedItemsList";
import { AddItemForm } from "../components/AddItemForm";
import { useTelegram } from "../hooks/useTelegram";
import { useUserStore } from "../hooks/useUserStore";

export const HomePage = () => {
  // Получаем данные из Telegram
  const { webApp } = useTelegram();
  
  // Получаем данные пользователя из хранилища
  const { userData } = useUserStore();
  
  // Состояние отслеживаемых товаров
  const [trackedItems, setTrackedItems] = useState<TrackedSpec[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState<boolean>(false);
  const [subsError, setSubsError] = useState<string | null>(null);
  
  // Состояние для данных каталога
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных каталога при монтировании компонента
  useEffect(() => {
    fetchCatalogData();
  }, []);

  // Загрузка подписок пользователя
  useEffect(() => {
    if (userData && webApp) {
      fetchUserSubs();
    }
  }, [userData, webApp]);

  // Функция для загрузки данных каталога
  const fetchCatalogData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Ошибка при загрузке каталога:", err);
      setError("Не удалось загрузить каталог товаров");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для загрузки подписок пользователя
  const fetchUserSubs = async () => {
    if (!userData || !webApp) return;

    setIsLoadingSubs(true);
    setSubsError(null);
    try {
      const userSubs = await SubsService.getUserSubs(webApp.initData);
      
      // Преобразуем данные с сервера в формат TrackedSpec
      const transformedSubs: TrackedSpec[] = [];
      
      userSubs.forEach(sub => {
        if (sub.spec_type === "buy") {
          transformedSubs.push({
            id: sub.id,
            name: sub.name,
            trackingType: "buy"
          });
        }
        
        if (sub.spec_type === "sell") {
          transformedSubs.push({
            id: sub.id,
            name: sub.name,
            trackingType: "sell"
          });
        }
      });
      
      setTrackedItems(transformedSubs);
    } catch (err) {
      console.error("Ошибка при загрузке подписок:", err);
      setSubsError("Не удалось загрузить ваши подписки");
    } finally {
      setIsLoadingSubs(false);
    }
  };

  // --- Обработчики событий ---
  const handleRemoveItem = async (itemId: number) => {
    if (!webApp) return;
    
    // Найдем удаляемый элемент, чтобы получить его тип
    const itemToRemove = trackedItems.find(item => item.id === itemId);
    
    if (itemToRemove && itemToRemove.trackingType) {
      try {
        // Формируем данные для отправки на сервер
        const payload = {
          spec_id: itemId,
          spec_type: itemToRemove.trackingType
        };
        
        // Вызываем метод API для удаления подписки
        await SubsService.deleteUserSub(payload, webApp.initData);
        
        // После успешного удаления обновляем состояние
        setTrackedItems((currentItems) =>
          currentItems.filter((item) => 
            !(item.id === itemId && item.trackingType === itemToRemove.trackingType)
          )
        );
      } catch (error) {
        console.error("Ошибка при удалении подписки:", error);
        // Показываем ошибку пользователю
        setSubsError("Не удалось удалить подписку. Пожалуйста, попробуйте снова.");
      }
    }
  };

  const handleAddItem = (newItem: TrackedSpec) => {
    // Проверяем, есть ли такой товар уже в выбранной категории отслеживания
    const isAlreadyTracked = trackedItems.some(
      (item) =>
        item.id === newItem.id && item.trackingType === newItem.trackingType
    );

    if (!isAlreadyTracked) {
      setTrackedItems((currentItems) => [...currentItems, newItem]);
    }
  };

  // --- Рендеринг ---
  return (
    <div className="bg-light p-4 space-y-4">
      {/* Блок отслеживаемых товаров */}
      {isLoadingSubs ? (
        <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-t-transparent border-[#E85B01] rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-600">Загрузка подписок...</span>
        </div>
      ) : subsError ? (
        <div className="bg-white rounded-lg shadow-lg p-6 text-red-500">
          <p>{subsError}</p>
          <button 
            onClick={fetchUserSubs}
            className="mt-2 text-sm text-[#E85B01] underline"
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <TrackedItemsList
          trackedItems={trackedItems}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {/* Блок добавления нового товара */}
      <AddItemForm
        categories={categories}
        isLoading={isLoading}
        error={error}
        onAddItem={handleAddItem}
        onRefresh={fetchCatalogData}
        trackedItems={trackedItems}
      />
    </div>
  );
};
