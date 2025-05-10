package handlers

import (
	"backend/internal/config"
	"backend/internal/store"
)

// Handler содержит зависимости, необходимые для обработчиков
type Handler struct {
	Config *config.Config
	Store  *store.Store
}

// NewHandler создает новый экземпляр Handler
func NewHandler(config *config.Config, store *store.Store) *Handler {
	return &Handler{
		Config: config,
		Store:  store,
	}
}
