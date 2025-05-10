package store

import (
	"backend/internal/config"
	"backend/internal/repository"
	"backend/internal/service"
	"database/sql"
	"fmt"


	_ "github.com/lib/pq"
)

type Store struct {
	config *config.Config

	
	// Слои репозиториев и сервисов
	Repository *repository.Repository
	Service    *service.Service
}

func New(cfg *config.Config) (*Store, error) {
	store := &Store{
		config: cfg,
	}

	err := store.Open()
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к базе данных: %w", err)

	
	// Инициализируем слои репозиториев и сервисов
	store.Repository = repository.New(store.db)
	store.Service = service.New(store.Repository)

	return store, nil
}

func (s *Store) Open() error {
	db, err := sql.Open("postgres", s.config.DatabaseUrl)
	if err != nil {
		return fmt.Errorf("не удалось открыть соединение с базой данных: %w", err)
	}

	// Проверяем соединение
	err = db.Ping()
	if err != nil {
		return fmt.Errorf("не удалось проверить соединение с базой данных: %w", err)
	}

	s.db = db
	return nil
}

// GetDB возвращает экземпляр соединения с базой данных
func (s *Store) GetDB() *sql.DB {
	return s.db
}

// Close закрывает соединение с базой данных
func (s *Store) Close() error {
	if s.db != nil {
		return s.db.Close()
	}
	return nil
}
