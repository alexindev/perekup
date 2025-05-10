package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
)

// UsersServices реализация интерфейса UsersServicesInterface
type UsersServices struct {
	repo repository.UsersRepository
}

// NewUserServices создает новый экземпляр UsersServicesInterface
func NewUserServices(repo repository.UsersRepository) UsersServicesInterface {
	return &UsersServices{repo: repo}
}

// Create создает нового пользователя
func (s *UsersServices) Create(user *models.Users) (*models.Users, error) {
	// значение по умолчанию для активного пользователя
	user.IsActive = true
	return s.repo.Create(user)
}

// GetByID получает пользователя по ID
func (s *UsersServices) GetByID(id int) (*models.Users, error) {
	return s.repo.GetByID(id)
}

// GetByTelegramID полечить пользователя по telegram_id
func (s *UsersServices) GetByTelegramID(telegramID int64) (*models.Users, error) {
	return s.repo.GetByTelegramID(telegramID)
}

// GetFullName получить полное имя пользователя
func (s *UsersServices) GetFullName(userID int) (string, error) {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return "", fmt.Errorf("ошибка при получении пользователя: %w", err)
	}
	fullName := fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	return fullName, nil
}

// ToggleBotActive переключить активность бота
func (s *UsersServices) ToggleBotActive(telegramID int64, status bool) error {
	return s.repo.ToggleBotActive(telegramID, status)
}
