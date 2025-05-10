package service

import (
	"backend/internal/entity"
	"backend/internal/models"
	"backend/internal/repository"
)

// Service представляет собой сервисный слой приложения
type Service struct {
	Users      UsersServicesInterface
	Categories CategoriesServicesInterface
	Models     ModelsServicesInterface
	Specs      SpecsServicesInterface
	Keywords   KeywordsServicesInterface
	Subs       SubscriptionsServicesInterface
}

// New создает новый экземпляр Service
func New(repos *repository.Repository) *Service {
	return &Service{
		Users:      NewUserServices(repos.Users),
		Categories: NewCategoryServices(repos.Categories),
		Models:     NewModelServices(repos.Models),
		Specs:      NewSpecServices(repos.Specs),
		Keywords:   NewKeywordServices(repos.Keywords),
		Subs:       NewSubsService(repos.Subscriptions),
	}
}

// UsersServicesInterface интерфейс для бизнес-логики пользователей
type UsersServicesInterface interface {
	Create(user *models.Users) (*models.Users, error)
	GetByID(id int) (*models.Users, error)
	GetByTelegramID(id int64) (*models.Users, error)
	GetFullName(userID int) (string, error)
	ToggleBotActive(telegramID int64, status bool) error
}

// CategoriesServicesInterface интерфейс для бизнес-логики категорий
type CategoriesServicesInterface interface {
	Create(category *models.Categories) (*models.Categories, error)
	GetByID(id int) (*models.Categories, error)
	GetAll() ([]*models.Categories, error)
}

// ModelsServicesInterface интерфейс для бизнес-логики товаров
type ModelsServicesInterface interface {
	Create(model *models.Models) (*models.Models, error)
	GetModelsByID(id int) ([]*models.Models, error)
	GetAll() ([]*models.Models, error)
}

// SpecsServicesInterface интерфейс бизнес-логики спецификаций
type SpecsServicesInterface interface {
	Create(spec *models.Specs) (*models.Specs, error)
	GetSpecsByID(modelID int) ([]*models.Specs, error)
	GetAll() ([]*models.Specs, error)
}

// KeywordsServicesInterface интерфейс бизнес-логики ключевых слов
type KeywordsServicesInterface interface {
	Create(keyword *models.Keywords) (*models.Keywords, error)
	GetByID(id int) (*models.Keywords, error)
	GetAll() ([]*models.Keywords, error)
}

type SubscriptionsServicesInterface interface {
	GetUserSubs(userID int) ([]entity.UserSubs, error)
	AddSubs(sub *entity.ManageSubs) error
	RemoveSubs(sub *entity.ManageSubs) error
}
