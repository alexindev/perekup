package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func (h *Handler) GetModelsByID(c *gin.Context) {
	categoryIDStr := c.Param("categoryID")
	categoryID, err := strconv.Atoi(categoryIDStr)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models, err := h.Store.Service.Models.GetModelsByID(categoryID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, models)
}
