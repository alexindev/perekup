import { useState, useEffect } from "react";
import { Category, Model, Spec, TrackedSpec } from "../types/category.types";
import ModelService from "../services/modelService";
import SpecService from "../services/specService";
import SubsService from "../services/subsService";
import {
  AddItemFormProps,
  SelectionStep,
} from "../types/components/item.types";
import { useTelegram } from "../hooks/useTelegram";

export const AddItemForm = ({
  categories,
  isLoading: isCategoriesLoading,
  error: categoriesError,
  onAddItem,
  onRefresh,
  trackedItems,
}: AddItemFormProps) => {
  // Получаем доступ к данным Telegram
  const { webApp } = useTelegram();

  // Состояния для процесса выбора
  const [selectionStep, setSelectionStep] = useState<SelectionStep | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedTrackingType, setSelectedTrackingType] = useState<
    "buy" | "sell" | null
  >(null);

  // Состояния для данных моделей и спецификаций
  const [models, setModels] = useState<Model[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  
  // Отфильтрованные спецификации (без уже выбранных товаров)
  const [filteredSpecs, setFilteredSpecs] = useState<Spec[]>([]);

  // Состояния загрузки для моделей и спецификаций
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(false);
  const [isSpecsLoading, setIsSpecsLoading] = useState<boolean>(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [specsError, setSpecsError] = useState<string | null>(null);
  
  // Состояние для отслеживания процесса добавления/удаления подписки
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Эффект для загрузки моделей при выборе категории
  useEffect(() => {
    if (selectedCategoryId) {
      fetchModels(selectedCategoryId);
    } else {
      setModels([]);
    }
  }, [selectedCategoryId]);

  // Эффект для загрузки спецификаций при выборе модели
  useEffect(() => {
    if (selectedModelId) {
      fetchSpecs(selectedModelId);
    } else {
      setSpecs([]);
      setFilteredSpecs([]);
    }
  }, [selectedModelId]);
  
  // Эффект для фильтрации спецификаций при изменении списка спецификаций или типа отслеживания
  useEffect(() => {
    if (specs.length > 0 && selectedTrackingType && trackedItems) {
      // Фильтруем спецификации, исключая те, которые уже отслеживаются с выбранным типом
      const filtered = specs.filter((spec) => {
        // Проверяем есть ли такая спецификация уже в отслеживаемых с тем же типом
        return !trackedItems.some(
          (item: TrackedSpec) => 
            item.id === parseInt(spec.id) && 
            item.trackingType === selectedTrackingType
        );
      });
      
      setFilteredSpecs(filtered);
    } else {
      setFilteredSpecs(specs);
    }
  }, [specs, selectedTrackingType, trackedItems]);

  // Функция загрузки моделей
  const fetchModels = async (categoryId: string) => {
    setIsModelsLoading(true);
    setModelsError(null);

    try {
      const data = await ModelService.getModelsByCategory(categoryId, webApp.initData);
      setModels(data);
    } catch (err) {
      console.error("Ошибка при загрузке моделей:", err);
      setModelsError("Не удалось загрузить модели");
    } finally {
      setIsModelsLoading(false);
    }
  };

  // Функция загрузки спецификаций
  const fetchSpecs = async (modelId: string) => {
    setIsSpecsLoading(true);
    setSpecsError(null);

    try {
      const data = await SpecService.getSpecsByModel(modelId, webApp.initData);
      setSpecs(data);
    } catch (err) {
      console.error("Ошибка при загрузке спецификаций:", err);
      setSpecsError("Не удалось загрузить спецификации");
    } finally {
      setIsSpecsLoading(false);
    }
  };

  // --- Обработчики событий ---

  // Обработчик для выбора типа отслеживания
  const handleSelectTrackingType = (type: "buy" | "sell") => {
    setSelectedTrackingType(type);
    setSelectionStep("category");
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectedModelId(null);
    setSelectionStep("model");
  };

  const handleSelectModel = (model: Model) => {
    setSelectedModelId(model.id);
    setSelectionStep("specification");
  };

  const handleSelectSpecification = async (spec: Spec) => {
    if (selectedTrackingType && webApp) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        // Формируем данные для отправки на сервер
        const payload = {
          spec_id: parseInt(spec.id),
          spec_type: selectedTrackingType
        };
        
        // Вызываем метод API для добавления подписки
        await SubsService.addUserSub(payload, webApp.initData);
        
        // Добавляем выбранный тип отслеживания к товару
        const trackingSpec = {
          id: parseInt(spec.id),
          name: spec.name,
          trackingType: selectedTrackingType,
        };

        onAddItem(trackingSpec);
      } catch (error) {
        console.error('Ошибка при добавлении подписки:', error);
        setSubmitError('Не удалось добавить подписку. Пожалуйста, попробуйте снова.');
      } finally {
        setIsSubmitting(false);
        resetSelection();
      }
    }
  };

  const handleGoBackOrCancel = () => {
    if (selectionStep === "specification") {
      setSelectionStep("model");
      setSelectedModelId(null);
    } else if (selectionStep === "model") {
      setSelectionStep("category");
      setSelectedCategoryId(null);
    } else if (selectionStep === "category") {
      setSelectionStep("trackingType");
      setSelectedTrackingType(null);
    } else {
      resetSelection();
    }
  };

  const resetSelection = () => {
    setSelectionStep(null);
    setSelectedCategoryId(null);
    setSelectedModelId(null);
    setSelectedTrackingType(null);
  };

  // Определяем суммарное состояние загрузки и ошибки
  const isLoading = isCategoriesLoading || isModelsLoading || isSpecsLoading || isSubmitting;
  const error = categoriesError || modelsError || specsError || submitError;

  // Определяем, что показывать в блоке добавления
  const shouldShowTrackingType =
    !selectionStep || selectionStep === "trackingType";
  const shouldShowCategories = selectionStep === "category";
  const shouldShowModels = selectionStep === "model";
  const shouldShowSpecs = selectionStep === "specification";

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-medium text-dark mb-4">
        Добавить товар для отслеживания
      </h2>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E85B01]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={onRefresh}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Выбор типа отслеживания */}
          {shouldShowTrackingType && (
            <div className="space-y-4">
              <p className="text-text">Выберите тип отслеживания:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleSelectTrackingType("buy")}
                  className="flex-1 bg-[#E85B01] hover:bg-[#E85B01]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Куплю
                </button>
                <button
                  onClick={() => handleSelectTrackingType("sell")}
                  className="flex-1 bg-[#3C3C3C] hover:bg-[#3C3C3C]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Продам
                </button>
              </div>
            </div>
          )}

          {/* Выбор категории */}
          {shouldShowCategories && categories.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-text">Выберите категорию:</p>
                <button
                  onClick={handleGoBackOrCancel}
                  className="text-sm text-[#E85B01] hover:underline"
                >
                  Назад
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSelectCategory(category)}
                    className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-3 px-4 rounded-lg transition-colors text-left"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Выбор модели */}
          {shouldShowModels && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-text">Выберите модель:</p>
                <button
                  onClick={handleGoBackOrCancel}
                  className="text-sm text-[#E85B01] hover:underline"
                >
                  Назад
                </button>
              </div>

              {isModelsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E85B01]"></div>
                </div>
              ) : models.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model)}
                      className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-3 px-4 rounded-lg transition-colors text-left"
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-text text-center py-4">
                  {modelsError
                    ? "Ошибка загрузки моделей"
                    : "Нет доступных моделей для этой категории"}
                </p>
              )}
            </div>
          )}

          {/* Выбор спецификации */}
          {shouldShowSpecs && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-text">Выберите спецификацию:</p>
                <button
                  onClick={handleGoBackOrCancel}
                  className="text-sm text-[#E85B01] hover:underline"
                >
                  Назад
                </button>
              </div>

              {isSpecsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E85B01]"></div>
                </div>
              ) : filteredSpecs.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {filteredSpecs.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => handleSelectSpecification(spec)}
                      className="bg-gray-100 hover:bg-gray-200 text-dark font-medium py-3 px-4 rounded-lg transition-colors text-left"
                    >
                      {spec.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-text text-center py-4">
                  {specsError
                    ? "Ошибка загрузки спецификаций"
                    : specs.length === 0 
                      ? "Нет доступных спецификаций для этой модели" 
                      : "Все спецификации этой модели уже отслеживаются"}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
