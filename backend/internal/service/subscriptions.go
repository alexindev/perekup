package service

import (
	"backend/internal/entity"
	"backend/internal/repository"
)

type SubsService struct {
	repo repository.SubscriptionsRepository
}

func NewSubsService(repo repository.SubscriptionsRepository) *SubsService {
	return &SubsService{repo: repo}
}

func (s *SubsService) GetUserSubs(userID int) ([]entity.UserSubs, error) {
	return s.repo.GetUserSubs(userID)
}

func (s *SubsService) AddSubs(sub *entity.ManageSubs) error {
	return s.repo.AddSubs(sub)
}

func (s *SubsService) RemoveSubs(sub *entity.ManageSubs) error {
	return s.repo.RemoveSubs(sub)
}
