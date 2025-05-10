import { useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { AccessDenied } from './components/AccessDenied';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';

export type Page = 'profile' | 'home';

export const App = () => {
  const { isAuthenticated, error, isLoading } = useTelegram();
  const [currentPage, setCurrentPage] = useState<Page>('profile'); // Начинаем с профиля

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-dark">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return <AccessDenied message={error || 'Доступ запрещен. Пожалуйста, откройте приложение через Telegram.'} />;
  }

  // Если аутентификация прошла успешно, показываем текущую страницу и навигацию
  return (
    <div className="pb-16"> {/* Добавляем padding снизу для навигации */}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'home' && <HomePage />}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};
