package repository

import (
	"backend/internal/models"
	"database/sql"
)

type UsersRepo struct {
	db *sql.DB
}

func NewUsersRepo(db *sql.DB) UsersRepository {
	return &UsersRepo{db: db}
}

func (r *UsersRepo) Create(user *models.Users) (*models.Users, error) {
	createdUser := &models.Users{}
	query := `
		INSERT INTO users (telegram_id, first_name, last_name, username, subscribed_until) 
		VALUES ($1, $2, $3, $4, $5) 
		RETURNING id, telegram_id, first_name, last_name, username, subscribed_until, is_active, is_bot_active;`

	err := r.db.QueryRow(
		query,
		user.TelegramID,
		user.FirstName,
		user.LastName,
		user.Username,
		user.SubscribedUntil,
	).Scan(
		&createdUser.ID,
		&createdUser.TelegramID,
		&createdUser.FirstName,
		&createdUser.LastName,
		&createdUser.Username,
		&createdUser.SubscribedUntil,
		&createdUser.IsActive,
		&createdUser.IsBotActive,
	)
	return createdUser, err
}

func (r *UsersRepo) GetByID(id int) (*models.Users, error) {
	user := &models.Users{}
	query := `SELECT id, telegram_id, first_name, last_name, username, subscribed_until, is_active , is_bot_active
		FROM users WHERE id = $1;`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.TelegramID,
		&user.FirstName,
		&user.LastName,
		&user.Username,
		&user.SubscribedUntil,
		&user.IsActive,
		&user.IsBotActive,
	)
	return user, err
}

func (r *UsersRepo) GetByTelegramID(telegramID int64) (*models.Users, error) {
	user := &models.Users{}
	query := `SELECT id, telegram_id, first_name, last_name, username, subscribed_until, is_active, is_bot_active
		FROM users WHERE telegram_id = $1;`
	err := r.db.QueryRow(query, telegramID).Scan(
		&user.ID,
		&user.TelegramID,
		&user.FirstName,
		&user.LastName,
		&user.Username,
		&user.SubscribedUntil,
		&user.IsActive,
		&user.IsBotActive,
	)
	return user, err
}

func (r *UsersRepo) ToggleBotActive(telegramID int64, status bool) error {
	query := `UPDATE users SET is_bot_active = $1 WHERE telegram_id = $2;`
	_, err := r.db.Exec(query, status, telegramID)
	return err
}
