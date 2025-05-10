package models

import "time"

// Users пользователи
type Users struct {
	ID              int        `json:"id"`
	TelegramID      int64      `json:"telegram_id"`
	FirstName       string     `json:"first_name,omitempty"`
	LastName        string     `json:"last_name,omitempty"`
	Username        string     `json:"username,omitempty"`
	SubscribedUntil *time.Time `json:"subscribed_until,omitempty"`
	IsActive        bool       `json:"is_active"`
	CreatedAt       time.Time  `json:"created_at"`
	IsBotActive     bool       `json:"is_bot_active"`
}

// UserSpecs подписки на товары у пользователя
type UserSpecs struct {
	ID       int    `json:"id"`
	UserID   int    `json:"user_id"`
	SpecId   int    `json:"spec_id"`
	SpecType string `json:"spec_type"`
}
