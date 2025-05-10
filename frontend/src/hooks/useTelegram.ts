import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);
      (tg as any).ready();
      (tg as any).expand();
    }
    setIsInitialized(true);
  }, []);

  const { isAuthenticated, error, isLoading: authIsLoading } = useAuth(webApp);

  const finalIsLoading = !isInitialized || authIsLoading;

  return {
    webApp,
    isAuthenticated,
    error,
    isLoading: finalIsLoading
  };
}; 