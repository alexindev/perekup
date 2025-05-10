package middlewares

import (
	"backend/internal/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"log/slog"
	"net/http"
)

type AuthMiddlewareOptions struct {
	BotToken string
}

func TgAuthMiddleware(opt *AuthMiddlewareOptions) gin.HandlerFunc {
	return func(c *gin.Context) {
		initData := c.GetHeader("X-Telegram")
		if initData == "" {
			slog.Warn("no telegram init data in header")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no telegram init data"})
			return
		}

		tgUser, err := utils.VerifyAndGetUserData(initData, opt.BotToken)
		if err != nil {
			slog.Warn("authMiddleware: initData verification or parsing failed", "error", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": fmt.Errorf("invalid initData: %w", err).Error()})
			return
		}

		c.Set("tgUser", tgUser)
		c.Next()
	}
}
