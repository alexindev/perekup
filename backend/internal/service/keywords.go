package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type KeywordServices struct {
	repo repository.KeywordsRepository
}

func NewKeywordServices(repo repository.KeywordsRepository) *KeywordServices {
	return &KeywordServices{repo: repo}
}

func (s *KeywordServices) Create(model *models.Keywords) (*models.Keywords, error) {
	return s.repo.Create(model)
}

func (s *KeywordServices) GetByID(id int) (*models.Keywords, error) {
	return s.repo.GetByID(id)
}

func (s *KeywordServices) GetAll() ([]*models.Keywords, error) {
	return s.repo.GetAll()
}
