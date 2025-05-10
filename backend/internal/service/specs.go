package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type SpecServices struct {
	repo repository.SpecsRepository
}

func NewSpecServices(repo repository.SpecsRepository) *SpecServices {
	return &SpecServices{repo: repo}
}

func (s *SpecServices) Create(spec *models.Specs) (*models.Specs, error) {
	return s.repo.Create(spec)
}

func (s *SpecServices) GetSpecsByID(modelID int) ([]*models.Specs, error) {
	return s.repo.GetSpecsByID(modelID)
}

func (s *SpecServices) GetAll() ([]*models.Specs, error) {
	return s.repo.GetAll()
}
