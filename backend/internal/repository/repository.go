package repository

import (
	"backend/internal/entity"
	"backend/internal/models"
	"database/sql"
)

// Repository представляет собой репозиторный слой приложения
type Repository struct {
	Users         UsersRepository
	Categories    CategoriesRepository
	Models        ModelsRepository
	Specs         SpecsRepository
	Keywords      KeywordsRepository
	Subscriptions SubscriptionsRepository
}

// New создает новый экземпляр Repository
func New(db *sql.DB) *Repository {
	return &Repository{
		Users:         NewUsersRepo(db),
		Categories:    NewCategoriesRepo(db),
		Models:        NewModelsRepo(db),
		Specs:         NewSpecsRepo(db),
		Keywords:      NewKeywordsRepo(db),
		Subscriptions: NewSubsRepo(db),
	}
}

// UsersRepository интерфейс для работы с пользователями в БД
type UsersRepository interface {
	Create(user *models.Users) (*models.Users, error)
	GetByID(id int) (*models.Users, error)
	GetByTelegramID(telegramID int64) (*models.Users, error)
	ToggleBotActive(telegramID int64, status bool) error
}

// CategoriesRepository интерфейс для работы с категориями в БД
type CategoriesRepository interface {
	Create(category *models.Categories) (*models.Categories, error)
	GetByID(id int) (*models.Categories, error)
	GetAll() ([]*models.Categories, error)
}

// ModelsRepository интерфейс для работы с моделями в БД
type ModelsRepository interface {
	Create(model *models.Models) (*models.Models, error)
	GetModelsByID(categoryID int) ([]*models.Models, error)
	GetAll() ([]*models.Models, error)
}

// SpecsRepository интерфейс для работы со спецификациями в БД
type SpecsRepository interface {
	Create(spec *models.Specs) (*models.Specs, error)
	GetSpecsByID(modelID int) ([]*models.Specs, error)
	GetAll() ([]*models.Specs, error)
}

// KeywordsRepository интерфейс для работы с ключевыми словами в БД
type KeywordsRepository interface {
	Create(keyword *models.Keywords) (*models.Keywords, error)
	GetByID(id int) (*models.Keywords, error)
	GetAll() ([]*models.Keywords, error)
}

// SubscriptionsRepository интерфейс для работы с подписками
type SubscriptionsRepository interface {
	GetUserSubs(userID int) ([]entity.UserSubs, error)
	AddSubs(sub *entity.ManageSubs) error
	RemoveSubs(sub *entity.ManageSubs) error
}
