package main

import (
	"backend/internal/config"
	"backend/internal/entity"
	"backend/internal/store"
	"backend/pkg/logger"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}
	logger.New(cfg)

	st, err := store.New(cfg)
	if err != nil {
		slog.Error("ошибка при инициализации хранилища", "error", err)
		return
	}
	defer st.Close()

	if err = loadData(st); err != nil {
		slog.Error("не удалось загрузить данные", "error", err)
		return
	}
	slog.Info("Загрузка данных успешно завершена")
}

// loadData загрузка предварительных данных
func loadData(s *store.Store) (err error) {
	var data entity.Catalog

	file, err := os.ReadFile("./configs/loading.json")
	if err != nil {
		return err
	}

	err = json.Unmarshal(file, &data)
	if err != nil {
		return err
	}

	tx, err := s.GetDB().Begin()
	if err != nil {
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			slog.Error("паника во время загрузки данных, попытка отката", "panic", p)
			err = tx.Rollback()
			if err != nil {
				return
			}
			err = fmt.Errorf("произошла паника во время выполнения loadData: %v", p)
		} else if err != nil {
			slog.Warn("откат транзакции из-за ошибки", "error", err)
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				slog.Error("ошибка при откате транзакции", "rollback_error", rollbackErr)
			}
		}
	}()

	var categoryStmt *sql.Stmt
	categoryStmt, err = tx.Prepare(`
		WITH ins AS (
		    INSERT INTO categories (name)
		    SELECT $1::text
			   WHERE NOT EXISTS (
				   SELECT 1
				   FROM categories
				   WHERE name = $1::text
			   )
		    RETURNING id
		)
		SELECT id FROM ins
		UNION 
		SELECT id FROM categories WHERE name = $1::text
		LIMIT 1;
	`)

	if err != nil {
		return fmt.Errorf("ошибка подготовки categoryStmt: %w", err)
	}
	defer categoryStmt.Close()

	var modelStmt *sql.Stmt
	modelStmt, err = tx.Prepare(`
		WITH ins AS (
		    INSERT INTO models (name, category_id)
		    SELECT $1::text, $2::integer
			   WHERE NOT EXISTS (
				   SELECT 1
				   FROM models
				   WHERE name = $1::text AND category_id = $2::integer
			   )
		    RETURNING id    
		)
		SELECT id FROM ins
		UNION
		SELECT id FROM models WHERE name = $1::text AND category_id = $2::integer
		LIMIT 1;
	`)

	if err != nil {
		return fmt.Errorf("ошибка подготовки modelStmt: %w", err)
	}
	defer modelStmt.Close()

	var specStmt *sql.Stmt
	specStmt, err = tx.Prepare(`
		WITH ins AS (
			INSERT INTO specs (name, model_id)
			   SELECT $1::text, $2::integer
			   WHERE NOT EXISTS (
				   SELECT 1
				   FROM specs
				   WHERE name = $1::text AND model_id = $2::integer
			   )
			   RETURNING id
		)
		SELECT id FROM ins
		UNION
		SELECT id FROM specs WHERE name = $1::text AND model_id = $2::integer
		LIMIT 1;
	`)

	if err != nil {
		return fmt.Errorf("ошбка подготовки specStmt: %w", err)
	}

	defer specStmt.Close()

	var keywordStmt *sql.Stmt
	keywordStmt, err = tx.Prepare(`
		INSERT INTO keywords (name, spec_id)
		   SELECT $1::text, $2::integer
		   WHERE NOT EXISTS (
			   SELECT 1
			   FROM keywords
			   WHERE name = $1::text AND spec_id = $2::integer
		   )
	`)
	if err != nil {
		return fmt.Errorf("ошибка подоготовки keywordStmt: %w", err)
	}

	defer keywordStmt.Close()

	// загрузка категорий
	for _, category := range data {
		var categoryID int
		if err = categoryStmt.QueryRow(category.Category.Name).Scan(&categoryID); err != nil {
			return err
		}
		slog.Info("обработка категории", "name", category.Category.Name, "id", categoryID)

		for _, model := range category.Category.Models {
			var modelID int
			if err = modelStmt.QueryRow(model.Name, categoryID).Scan(&modelID); err != nil {
				return err
			}
			slog.Info("обработка модели", "name", model.Name, "id", modelID)

			for _, spec := range model.Specs {
				var specID int
				if err = specStmt.QueryRow(spec.Name, modelID).Scan(&specID); err != nil {
					return err
				}
				slog.Info("обработка спецификации", "name", spec.Name, "id", specID)

				for _, keyword := range spec.Keywords {
					_, err = keywordStmt.Exec(keyword, specID)
					if err != nil {
						return err
					}
					slog.Info("Обработка ключевого слова", "name", keyword)
				}
			}
		}
	}

	if err = tx.Commit(); err != nil {
		return err
	}
	return nil
}
