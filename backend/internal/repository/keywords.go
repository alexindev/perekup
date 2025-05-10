package repository

import (
	"backend/internal/models"
	"database/sql"
)

type KeywordsRepo struct {
	db *sql.DB
}

func NewKeywordsRepo(db *sql.DB) *KeywordsRepo {
	return &KeywordsRepo{db: db}
}

// Create создать ключевое слово дял поиска
func (k *KeywordsRepo) Create(keyword *models.Keywords) (*models.Keywords, error) {
	keyCreated := &models.Keywords{}
	query := `INSERT INTO keywords (name, spec_id) 
		VALUES ($1, $2) 
		RETURNING id, name, spec_id;`
	err := k.db.QueryRow(
		query,
		keyword.Name,
		keyword.SpecId,
	).Scan(&keyCreated.Id, &keyCreated.Name, &keyCreated.SpecId)
	return keyCreated, err
}

// GetByID получить ключевое слово товара по ID
func (k *KeywordsRepo) GetByID(id int) (*models.Keywords, error) {
	keyword := &models.Keywords{}
	query := `SELECT id, name, spec_id FROM keywords WHERE id = $1;`
	err := k.db.QueryRow(query, id).Scan(keyword.Id, keyword.Name, keyword.SpecId)
	return keyword, err
}

// GetAll получить все ключевые слова товаров
func (k *KeywordsRepo) GetAll() ([]*models.Keywords, error) {
	var keywords []*models.Keywords
	query := `SELECT id, name, spec_id FROM keywords;`
	rows, err := k.db.Query(query)
	if err != nil {
		return keywords, err
	}
	defer rows.Close()
	for rows.Next() {
		var keyword models.Keywords
		if err = rows.Scan(
			&keyword.Id,
			&keyword.Name,
			&keyword.SpecId,
		); err != nil {
			return nil, err
		}
		keywords = append(keywords, &keyword)
	}
	return keywords, nil
}
