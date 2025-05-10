/**
 * Константы для продуктов и категорий
 * В дальнейшем будут получены с бэкенда
 */

// Моковые данные отслеживаемых товаров
export const INITIAL_TRACKED_ITEMS = [
  { id: 1, name: "iPhone 12 Mini 256Gb", trackingType: "buy" },
  { id: 2, name: "Macbook Pro 16 M1 1Tb", trackingType: "sell" },
  { id: 101, name: "iPhone 15 128GB", trackingType: "buy" },
  { id: 201, name: "Macbook Air M2 8GB/256GB", trackingType: "sell" },
  { id: 301, name: "iPad Air 64GB Wi-Fi", trackingType: "buy" },
];

// Структуризированные данные для выбора нового товара
export const CATEGORIES_DATA = {
  iphone: {
    name: "iPhone",
    models: {
      iphone15: {
        name: "iPhone 15",
        specs: [
          { id: 101, name: "iPhone 15 128GB" },
          { id: 102, name: "iPhone 15 256GB" },
          { id: 105, name: "iPhone 15 Pro 256GB" },
          { id: 106, name: "iPhone 15 Pro Max 512GB" },
        ],
      },
      iphone14: {
        name: "iPhone 14",
        specs: [
          { id: 103, name: "iPhone 14 Pro 256GB" },
          { id: 104, name: "iPhone 14 Pro Max 512GB" },
        ],
      },
      iphone12: {
        name: "iPhone 12",
        specs: [
          { id: 1, name: "iPhone 12 Mini 256Gb" },
        ],
      },
    },
  },
  macbook: {
    name: "Macbook",
    models: {
      macbookAirM2: {
        name: "Macbook Air M2",
        specs: [
          { id: 201, name: "Macbook Air M2 8GB/256GB" },
          { id: 202, name: "Macbook Air M2 16GB/512GB" },
        ],
      },
      macbookPro16M1: {
        name: "Macbook Pro 16 M1",
        specs: [
          { id: 2, name: "Macbook Pro 16 M1 1Tb" },
        ],
      },
    },
  },
  ipad: {
    name: "iPad",
    models: {
      ipadAir: {
        name: "iPad Air",
        specs: [
          { id: 301, name: "iPad Air 64GB Wi-Fi" },
          { id: 302, name: "iPad Air 256GB Cellular" },
        ],
      },
    },
  },
}; 