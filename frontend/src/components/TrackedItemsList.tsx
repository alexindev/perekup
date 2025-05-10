import { TrackedItemsListProps } from "../types/components/item.types";

export const TrackedItemsList = ({
  trackedItems,
  onRemoveItem,
}: TrackedItemsListProps) => {
  // Фильтрация товаров по типу отслеживания
  const buyItems = trackedItems.filter((item) => item.trackingType === "buy");
  const sellItems = trackedItems.filter((item) => item.trackingType === "sell");

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-xl font-medium text-dark mb-2">
        Отслеживаемые товары
      </h1>

      {/* Группировка по типу отслеживания */}
      {trackedItems.length > 0 ? (
        <div className="space-y-4">
          {/* Товары для покупки */}
          <div>
            <h2 className="text-md font-medium text-dark mt-4 mb-2">Покупка</h2>
            <div className="flex flex-wrap gap-2 py-2">
              {buyItems.map((item) => (
                <div
                  key={item.id}
                  className="border-l-2 border-[#E85B01] bg-[#DFDFDF]/30 rounded-md px-3 py-1.5 text-xs relative"
                >
                  <span className="text-dark">{item.name}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none hover:bg-red-600 transition-colors"
                    aria-label={`Удалить ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {buyItems.length === 0 && (
                <p className="text-text text-sm">
                  Нет отслеживаемых товаров для покупки.
                </p>
              )}
            </div>
          </div>

          {/* Товары для продажи */}
          <div>
            <h2 className="text-md font-medium text-dark mt-4 mb-2">Продажа</h2>
            <div className="flex flex-wrap gap-2 py-2">
              {sellItems.map((item) => (
                <div
                  key={item.id}
                  className="border-l-2 border-[#3C3C3C] bg-[#DFDFDF]/30 rounded-md px-3 py-1.5 text-xs relative"
                >
                  <span className="text-dark">{item.name}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none hover:bg-red-600 transition-colors"
                    aria-label={`Удалить ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {sellItems.length === 0 && (
                <p className="text-text text-sm">
                  Нет отслеживаемых товаров для продажи.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-text text-sm mt-2">
          Вы еще не добавили ни одного товара для отслеживания.
        </p>
      )}
    </div>
  );
};
