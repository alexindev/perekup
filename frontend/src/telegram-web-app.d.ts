// src/telegram-web-app.d.ts
interface WebApp {
    initData: string;
    initDataUnsafe: {};
}
  
interface Telegram {
    WebApp: WebApp;
}
  
interface Window {
    Telegram?: Telegram;
}