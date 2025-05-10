package repository

import (
	"backend/internal/models"
	"database/sql"
)

type ModelsRepo struct {
	db *sql.DB
}

func NewModelsRepo(db *sql.DB) ModelsRepository {
	return &ModelsRepo{db: db}
}

// Create создать запись модели
func (r *ModelsRepo) Create(model *models.Models) (*models.Models, error) {
	createdModel := &models.Models{}
	query := `INSERT INTO models (name, category_id) 
		VALUES ($1, $2) 
		RETURNING id, name, category_id;`

	err := r.db.QueryRow(
		query,
		model.Name,
		model.CategoryId,
	).Scan(&createdModel.ID, &createdModel.Name, &createdModel.CategoryId)
	return createdModel, err
}

// GetModelsByID получить модель товара по ID
func (r *ModelsRepo) GetModelsByID(categoryID int) ([]*models.Models, error) {
	query := `SELECT id, name, category_id FROM models WHERE category_id = $1;`
	rows, err := r.db.Query(query, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	modelsArr := make([]*models.Models, 0)

	for rows.Next() {
		model := &models.Models{}
		err = rows.Scan(
			&model.ID,
			&model.Name,
			&model.CategoryId,
		)
		if err != nil {
			return nil, err
		}
		modelsArr = append(modelsArr, model)
	}
	return modelsArr, err
}

// GetAll получить все модели
func (r *ModelsRepo) GetAll() ([]*models.Models, error) {
	query := `SELECT id, name, category_id FROM models;`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	modelsArr := make([]*models.Models, 0)

	for rows.Next() {
		model := &models.Models{}
		err = rows.Scan(
			&model.ID,
			&model.Name,
			&model.CategoryId,
		)
		if err != nil {
			return nil, err
		}
		modelsArr = append(modelsArr, model)
	}
	return modelsArr, nil

}
