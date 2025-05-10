import { UserProfile } from '../user.types';

/**
 * Пропсы для компонента карточки подписки
 */
export interface SubscriptionCardProps {
  userData: UserProfile;
  onExtend: () => void;
}

/**
 * Пропсы для компонента продления подписки
 */
export interface SubscriptionExtensionProps {
  onCancel: () => void;
  onConfirm: (days: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Пропсы для компонента истории платежей
 */
export interface PaymentHistoryProps {
  payments?: Payment[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Интерфейс для платежа
 */
export interface Payment {
  id: string;
  date: string;
  amount: number;
  days: number;
  status: 'success' | 'pending' | 'failed';
} 