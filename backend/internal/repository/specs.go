package repository

import (
	"backend/internal/models"
	"database/sql"
)

type SpecsRepo struct {
	db *sql.DB
}

func NewSpecsRepo(db *sql.DB) *SpecsRepo {
	return &SpecsRepo{db: db}
}

// Create создать запись со спецификацией товара
func (r *SpecsRepo) Create(spec *models.Specs) (*models.Specs, error) {
	createdSpec := &models.Specs{}
	query := `INSERT INTO specs (name, model_id) 
		VALUES ($1, $2) 
		RETURNING id, name, model_id;`
	err := r.db.QueryRow(
		query,
		spec.Name,
		spec.ModelId,
	).Scan(&createdSpec.Id, &createdSpec.Name, &createdSpec.ModelId)
	return createdSpec, err
}

// GetSpecsByID получить спецификацию товара по ID
func (r *SpecsRepo) GetSpecsByID(modelID int) ([]*models.Specs, error) {
	query := `SELECT id, name, model_id FROM specs WHERE model_id = $1;`
	rows, err := r.db.Query(query, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	specArr := make([]*models.Specs, 0)

	for rows.Next() {
		spec := &models.Specs{}
		err = rows.Scan(
			&spec.Id,
			&spec.Name,
			&spec.ModelId,
		)
		if err != nil {
			return nil, err
		}
		specArr = append(specArr, spec)
	}
	return specArr, err
}

// GetAll получить все спецификации товаров
func (r *SpecsRepo) GetAll() ([]*models.Specs, error) {
	var specs []*models.Specs
	query := `SELECT id, name, model_id FROM specs;`
	rows, err := r.db.Query(query)
	if err != nil {
		return specs, err
	}
	defer rows.Close()
	for rows.Next() {
		var spec models.Specs
		if err = rows.Scan(
			&spec.Id,
			&spec.Name,
			&spec.ModelId,
		); err != nil {
			return nil, err
		}
		specs = append(specs, &spec)
	}
	return specs, nil
}
