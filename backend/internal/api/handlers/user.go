package handlers

import (
	"backend/internal/entity"
	"backend/internal/models"
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	"log/slog"
	"math"
	"net/http"
	"time"
)

// GetMe возвращает информацию о профиле пользователя
func (h *Handler) GetMe(c *gin.Context) {
	tgUserData, exists := c.Get("tgUser")
	if !exists {
		slog.Error("tgUser не установлен в контекст")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "auth context missing"})
	}

	tgUser := tgUserData.(*entity.UserData)

	user, err := h.Store.Service.Users.GetByTelegramID(tgUser.TelegramID)

	switch {
	case err == nil:
		slog.Info("пользователь существует")
	case errors.Is(err, sql.ErrNoRows):
		slog.Info("пользователь не найден, начинаем регистрацию")

		// стартовая подписка на 14 дней
		subsUntil := time.Now().Add(14 * 24 * time.Hour)

		newUser := models.Users{
			TelegramID:      tgUser.TelegramID,
			FirstName:       tgUser.FirstName,
			LastName:        tgUser.LastName,
			Username:        tgUser.Username,
			SubscribedUntil: &subsUntil,
		}
		user, err = h.Store.Repository.Users.Create(&newUser)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		slog.Info("пользователь зарегистрирован")

	default:
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fullName, err := h.Store.Service.Users.GetFullName(user.ID)

	// количество оставшихся дней подписки
	var daysLeft int

	if user.SubscribedUntil != nil && user.SubscribedUntil.After(time.Now()) {

		// количество часов в float64
		remainingDuration := user.SubscribedUntil.Sub(time.Now())

		// количество часов в float64
		remainingHours := remainingDuration.Hours()

		if remainingHours <= 0 {
			daysLeft = 0
		} else {
			daysFloat := remainingHours / 24.0
			daysLeft = int(math.Ceil(daysFloat))
		}

	}

	// информацию о пользователе
	c.JSON(http.StatusOK, gin.H{
		"id":          user.ID,
		"fullName":    fullName,
		"daysLeft":    daysLeft,
		"isBotActive": user.IsBotActive,
	})
}

// ToggleBotActive переключение активности бота
func (h *Handler) ToggleBotActive(c *gin.Context) {
	tgUserData, exists := c.Get("tgUser")
	if !exists {
		slog.Error("tgUser не установлен в контекст")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "auth context missing"})
	}

	tgUser := tgUserData.(*entity.UserData)

	var req entity.ToggleBotActiveRequest
	err := c.ShouldBindJSON(&req)
	if err != nil {
		slog.Error("ToggleBotActive: Invalid request payload", "error", err, "telegram_id", tgUser.TelegramID)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.Store.Service.Users.ToggleBotActive(tgUser.TelegramID, req.IsActive)
	if err != nil {
		slog.Error("ToggleBotActive: Failed to toggle bot active status", "telegram_id", tgUser.TelegramID, "status", req.IsActive, "error", err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": req.IsActive})
}
