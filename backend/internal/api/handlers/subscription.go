package handlers

import (
	"backend/internal/entity"
	"github.com/gin-gonic/gin"
	"log/slog"
	"net/http"
)

// GetUserSubs получить подписки пользователя
func (h *Handler) GetUserSubs(c *gin.Context) {
	tgUserData, exists := c.Get("tgUser")
	if !exists {
		slog.Error("tgUser не установлен в контекст")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "auth context missing"})
	}

	tgUser := tgUserData.(*entity.UserData)

	user, err := h.Store.Service.Users.GetByTelegramID(tgUser.TelegramID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	result, err := h.Store.Service.Subs.GetUserSubs(user.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

// AddUserSub добавить спецификацию в отслеживание
func (h *Handler) AddUserSub(c *gin.Context) {
	tgUserData, exists := c.Get("tgUser")
	if !exists {
		slog.Error("tgUser не установлен в контекст")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "auth context missing"})
	}

	tgUser := tgUserData.(*entity.UserData)

	user, err := h.Store.Service.Users.GetByTelegramID(tgUser.TelegramID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var subData entity.ManageSubs
	if err = c.ShouldBind(&subData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subData.UserID = user.ID

	err = h.Store.Service.Subs.AddSubs(&subData)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusOK)
}

// DeleteUserSub убрать подписку из отслеживаемых
func (h *Handler) DeleteUserSub(c *gin.Context) {
	tgUserData, exists := c.Get("tgUser")
	if !exists {
		slog.Error("tgUser не установлен в контекст")
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "auth context missing"})
	}

	tgUser := tgUserData.(*entity.UserData)

	user, err := h.Store.Service.Users.GetByTelegramID(tgUser.TelegramID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var subData entity.ManageSubs
	if err = c.ShouldBind(&subData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subData.UserID = user.ID

	err = h.Store.Service.Subs.RemoveSubs(&subData)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
