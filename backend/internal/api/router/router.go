package router

import (
	"backend/internal/api/handlers"
	"backend/internal/api/middlewares"
	"backend/internal/config"
	"backend/internal/store"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRoutes настраивает маршруты приложения и передает хранилище и конфигурацию в обработчики
func SetupRoutes(r *gin.Engine, c *config.Config, s *store.Store) {

	// CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	corsConfig.AllowHeaders = []string{
		"Origin",
		"Content-Length",
		"Content-Type",
		"X-Telegram",
	}
	r.Use(cors.New(corsConfig))

	// обработчик с конфигурацией и хранилищем
	h := handlers.NewHandler(c, s)

	// middleware для аутентификации
	authMiddlewareOpt := middlewares.AuthMiddlewareOptions{
		BotToken: c.BotToken,
	}

	api := r.Group("/api")
	{
		user := api.Group("/users")
		user.Use(middlewares.TgAuthMiddleware(&authMiddlewareOpt))
		{
			user.GET("/me", h.GetMe)
			user.PATCH("toggle-bot", h.ToggleBotActive)
		}
		category := api.Group("/categories")
		{
			category.GET("", h.GetCategories)
		}
		model := api.Group("/models")
		{
			model.GET("/:categoryID", h.GetModelsByID)
		}
		spec := api.Group("/specs")
		{
			spec.GET("/:modelID", h.GetSpecsByID)
		}
		sub := api.Group("/subs")
		sub.Use(middlewares.TgAuthMiddleware(&authMiddlewareOpt))
		{
			sub.GET("", h.GetUserSubs)
			sub.POST("", h.AddUserSub)
			sub.DELETE("", h.DeleteUserSub)
		}
	}
}
