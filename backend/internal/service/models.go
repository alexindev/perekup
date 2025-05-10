package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type ModelServices struct {
	repo repository.ModelsRepository
}

func NewModelServices(repo repository.ModelsRepository) *ModelServices {
	return &ModelServices{repo: repo}
}

func (s *ModelServices) Create(model *models.Models) (*models.Models, error) {
	return s.repo.Create(model)
}

func (s *ModelServices) GetModelsByID(id int) ([]*models.Models, error) {
	return s.repo.GetModelsByID(id)
}

func (s *ModelServices) GetAll() ([]*models.Models, error) {
	return s.repo.GetAll()
}
