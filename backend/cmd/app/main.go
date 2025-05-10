package main

import (
	"backend/internal/api/router"
	"backend/internal/config"
	"backend/internal/store"
	"backend/pkg/logger"
	"context"
	"errors"
	"github.com/gin-gonic/gin"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}
	logger.New(cfg)

	st, err := store.New(cfg)
	if err != nil {
		slog.Error("ошибка при инициализации хранилища", "error", err)
		return
	}

	route := gin.Default()
	router.SetupRoutes(route, cfg, st)

	port := cfg.ServerPort

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: route,
	}

	go func() {
		slog.Info("сервер запущен на порту " + port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("ошибка при запуске сервера", "error", err)
		}
	}()

	// graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("завершение работы сервера...")

	// Контекст с таймаутом для graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// завершить работу HTTP сервера
	if err = srv.Shutdown(ctx); err != nil {
		slog.Error("ошибка при завершении работы сервера", "error", err)
	}

	// закрыть соединение с бд
	if err = st.Close(); err != nil {
		slog.Error("ошибка закрытия соединения с бд", "error", err)
	}

	slog.Info("работа завершена")
}
