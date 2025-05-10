import { Category, TrackedSpec } from '../category.types';

/**
 * Типы для процесса выбора товара
 */
export type SelectionStep = "trackingType" | "category" | "model" | "specification";

/**
 * Пропсы для компонента добавления товара
 */
export interface AddItemFormProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onAddItem: (item: TrackedSpec) => void;
  onRefresh: () => void;
  trackedItems: TrackedSpec[];
}

/**
 * Пропсы для компонента списка отслеживаемых товаров
 */
export interface TrackedItemsListProps {
  trackedItems: TrackedSpec[];
  onRemoveItem: (itemId: number) => void;
} 