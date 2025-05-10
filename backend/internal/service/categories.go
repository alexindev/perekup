package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type CategoryServices struct {
	repo repository.CategoriesRepository
}

// NewCategoryServices создает новый экземпляр CategoriesServicesInterface
func NewCategoryServices(repo repository.CategoriesRepository) CategoriesServicesInterface {
	return &CategoryServices{repo: repo}
}

// Create создает новую категорию
func (s *CategoryServices) Create(category *models.Categories) (*models.Categories, error) {
	return s.repo.Create(category)
}

// GetByID получает категорию по ID
func (s *CategoryServices) GetByID(id int) (*models.Categories, error) {
	return s.repo.GetByID(id)
}

// GetAll получает все категории
func (s *CategoryServices) GetAll() ([]*models.Categories, error) {
	return s.repo.GetAll()
}
