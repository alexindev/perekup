package repository

import (
	"backend/internal/entity"
	"database/sql"
)

type SubsRepo struct {
	db *sql.DB
}

func NewSubsRepo(db *sql.DB) SubscriptionsRepository {
	return &SubsRepo{db: db}
}

func (r *SubsRepo) GetUserSubs(userID int) ([]entity.UserSubs, error) {
	query := `
		SELECT 
		    us.spec_id, 
		    s.name,
		    us.spec_type
		FROM user_specs as us
		JOIN specs as s
		    ON s.id = us.spec_id
		WHERE us.user_id = $1;
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	userSubs := make([]entity.UserSubs, 0)
	for rows.Next() {
		var specID int
		var specName, specType string

		err = rows.Scan(&specID, &specName, &specType)
		if err != nil {
			return nil, err
		}

		userSubs = append(userSubs, entity.UserSubs{
			SpecID:   specID,
			Name:     specName,
			SpecType: specType,
		})
	}
	return userSubs, nil
}

// AddSubs добавить подписку на спецификацию
func (r *SubsRepo) AddSubs(sub *entity.ManageSubs) error {
	query := `
		INSERT INTO user_specs(user_id, spec_id, spec_type) 
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, spec_id, spec_type) DO NOTHING;
	`
	_, err := r.db.Exec(query, sub.UserID, sub.SpecID, sub.SpecType)
	if err != nil {
		return err
	}
	return nil
}

// RemoveSubs удалить подписку
func (r *SubsRepo) RemoveSubs(sub *entity.ManageSubs) error {
	query := `
		DELETE FROM user_specs 
		WHERE user_id = $1 
		  AND spec_id = $2 
		  AND spec_type = $3;
	`
	_, err := r.db.Exec(query, sub.UserID, sub.SpecID, sub.SpecType)
	if err != nil {
		return err
	}
	return nil
}
