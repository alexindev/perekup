import { UserProfile } from '../types/user.types';

/**
 * Класс для управления состоянием пользователя
 * Реализован с использованием паттерна синглтон
 */
class UserStore {
  private static instance: UserStore;
  private _userData: UserProfile | null = null;
  private _subscribers: Array<() => void> = [];

  private constructor() {}

  /**
   * Получить экземпляр хранилища
   */
  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  /**
   * Получить данные пользователя
   */
  get userData(): UserProfile | null {
    return this._userData;
  }

  /**
   * Установить данные пользователя
   */
  setUserData(userData: UserProfile | null): void {
    this._userData = userData;
    this.notifySubscribers();
  }

  /**
   * Обновить данные пользователя
   */
  updateUserData(partialUserData: Partial<UserProfile>): void {
    if (this._userData) {
      this._userData = { ...this._userData, ...partialUserData };
      this.notifySubscribers();
    }
  }

  /**
   * Подписаться на изменения
   */
  subscribe(callback: () => void): () => void {
    this._subscribers.push(callback);
    
    // Возвращаем функцию отписки
    return () => {
      this._subscribers = this._subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * Уведомить всех подписчиков об изменении
   */
  private notifySubscribers(): void {
    this._subscribers.forEach(callback => callback());
  }
}

// Экспортируем экземпляр хранилища
export default UserStore.getInstance(); 