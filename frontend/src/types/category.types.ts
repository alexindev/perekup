/**
 * Интерфейсы для категорий, моделей и спецификаций
 */

/**
 * Интерфейс для спецификаций товаров
 */
export interface Spec {
  id: string;
  name: string;
}

/**
 * Интерфейс для модели товара
 */
export interface Model {
  id: string;
  name: string;
  specs: Spec[];
}

/**
 * Интерфейс для категории товаров
 */
export interface Category {
  id: string;
  name: string;
  models: Model[];
}

/**
 * Интерфейс для отслеживаемой спецификации
 */
export interface TrackedSpec {
  id: number;
  name: string;
  trackingType?: "buy" | "sell";
}
