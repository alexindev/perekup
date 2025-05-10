package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func (h *Handler) GetSpecsByID(c *gin.Context) {
	modelIDStr := c.Param("modelID")
	modelID, err := strconv.Atoi(modelIDStr)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	specs, err := h.Store.Service.Specs.GetSpecsByID(modelID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, specs)
}
