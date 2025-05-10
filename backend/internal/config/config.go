package config

import (
	"errors"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseUrl string
	ServerPort  string
	Mode        string
	BotToken    string
}

func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Ошибка при загрузке .env файла:", err)
		return nil, err
	} else {
		slog.Debug(".env файл успешно загружен")
	}

	botToken := os.Getenv("BOT_TOKEN")
	if botToken == "" {
		return nil, errors.New("BOT_TOKEN не установлен")
	}

	return &Config{
		DatabaseUrl: getEnv(
			"DATABASE_URL", "postgres://postgres:postgres@localhost:5432/test?sslmode=disable",
		),
		ServerPort: getEnv("SERVER_PORT", "8000"),
		Mode:       getEnv("MODE", "debug"),
		BotToken:   botToken,
	}, nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
