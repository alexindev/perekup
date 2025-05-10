import { UserProfile } from '../user.types';
import { Page } from '../../App';

/**
 * Пропсы для компонента информации о пользователе
 */
export interface UserInfoCardProps {
  userData: UserProfile | null;
}

/**
 * Пропсы для компонента навигации
 */
export interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userData?: UserProfile | null;
} 