package repository

import (
	"backend/internal/models"
	"database/sql"
	"errors"
	"fmt"
)

// CategoriesRepo реализация интерфейса CategoriesRepository
type CategoriesRepo struct {
	db *sql.DB
}

// NewCategoriesRepo создает новый экземпляр CategoriesRepo
func NewCategoriesRepo(db *sql.DB) CategoriesRepository {
	return &CategoriesRepo{db: db}
}

// Create создает новую категорию
func (r *CategoriesRepo) Create(category *models.Categories) (*models.Categories, error) {
	createdCategory := &models.Categories{}
	query := `
		INSERT INTO categories (name) 
		VALUES ($1) 
		RETURNING id, name;`

	err := r.db.QueryRow(query, category.Name).Scan(&createdCategory.ID, &createdCategory.Name)
	return createdCategory, err
}

// GetByID получает категорию по ID
func (r *CategoriesRepo) GetByID(id int) (*models.Categories, error) {
	category := &models.Categories{}
	query := `SELECT id, name FROM categories WHERE id = $1;`

	err := r.db.QueryRow(query, id).Scan(&category.ID, &category.Name)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return nil, fmt.Errorf("категория с ID %d не найдена", id)
		}
		return nil, fmt.Errorf("ошибка при получении категории: %w", err)
	}

	return category, nil
}

// GetAll получает все категории
func (r *CategoriesRepo) GetAll() ([]*models.Categories, error) {
	query := `SELECT id, name FROM categories;`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении категорий: %w", err)
	}
	defer rows.Close()

	categories := make([]*models.Categories, 0)
	for rows.Next() {
		category := &models.Categories{}
		err = rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, fmt.Errorf("ошибка при сканировании категории: %w", err)
		}
		categories = append(categories, category)
	}
	return categories, nil
}
