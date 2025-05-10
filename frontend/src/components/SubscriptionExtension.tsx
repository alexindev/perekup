import { useState } from "react";
import { SUBSCRIPTION } from "../constants/app";
import {
  formatPrice,
  pluralizeDays,
  calculateSubscriptionPrice,
} from "../utils/helpers";
import { SubscriptionExtensionProps } from "../types/components/subscription.types";

export const SubscriptionExtension = ({
  onCancel,
  onConfirm,
  isLoading,
  error,
}: SubscriptionExtensionProps) => {
  const [extensionDays, setExtensionDays] = useState(
    SUBSCRIPTION.MIN_EXTENSION_DAYS
  );

  // Изменить количество дней
  const handleChangeDays = (delta: number) => {
    setExtensionDays((prevDays) => {
      const newDays = prevDays + delta;
      if (newDays < SUBSCRIPTION.MIN_EXTENSION_DAYS)
        return SUBSCRIPTION.MIN_EXTENSION_DAYS;
      if (newDays > SUBSCRIPTION.MAX_EXTENSION_DAYS)
        return SUBSCRIPTION.MAX_EXTENSION_DAYS;
      return newDays;
    });
  };

  // Обработчик подтверждения продления
  const handleConfirm = () => {
    onConfirm(extensionDays);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-dark flex flex-col items-center space-y-5">
      <h2 className="text-xl font-medium text-dark mb-2">Продление подписки</h2>

      {/* Счетчик дней */}
      <div className="flex items-center justify-center space-x-4 w-full max-w-xs">
        <button
          onClick={() => handleChangeDays(-1)}
          disabled={
            extensionDays <= SUBSCRIPTION.MIN_EXTENSION_DAYS || isLoading
          }
          className="bg-gray-200 text-dark font-bold w-10 h-10 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors flex-shrink-0"
          aria-label="Уменьшить дни"
        >
          -
        </button>
        <div className="text-center flex-grow">
          <p className="text-3xl font-bold">{extensionDays}</p>
          <p className="text-sm text-text">{pluralizeDays(extensionDays)}</p>
        </div>
        <button
          onClick={() => handleChangeDays(1)}
          disabled={
            extensionDays >= SUBSCRIPTION.MAX_EXTENSION_DAYS || isLoading
          }
          className="bg-gray-200 text-dark font-bold w-10 h-10 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors flex-shrink-0"
          aria-label="Увеличить дни"
        >
          +
        </button>
      </div>

      {/* Кнопки быстрого выбора */}
      <div className="flex justify-center gap-2 w-full max-w-xs flex-wrap">
        {SUBSCRIPTION.DEFAULT_QUICK_SELECT_DAYS.map((days) => (
          <button
            key={days}
            onClick={() => setExtensionDays(days)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              extensionDays === days
                ? `bg-[#E85B01] text-white`
                : "bg-gray-100 text-text hover:bg-gray-200"
            }`}
          >
            {days} {pluralizeDays(days)}
          </button>
        ))}
      </div>

      {/* Отображение цены */}
      <div className="text-center border-t border-border/50 pt-4 mt-2 w-full max-w-xs">
        <p className="text-lg font-semibold text-[#E85B01]">
          {formatPrice(
            calculateSubscriptionPrice(
              extensionDays,
              SUBSCRIPTION.PRICE_PER_DAY
            )
          )}
        </p>
        <p className="text-xs text-text">Стоимость продления</p>
      </div>

      {/* Кнопки управления */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`flex-1 bg-[#E85B01] hover:bg-[#E85B01]/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md order-1 sm:order-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Обработка..." : "Подтвердить"}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 bg-gray-200 hover:bg-gray-300 text-dark font-medium py-2 px-4 rounded-lg transition-colors order-2 sm:order-1 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          Отмена
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-xs">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
