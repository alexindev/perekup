package entity

type ManageSubs struct {
	UserID   int    `json:"user_id"`
	SpecID   int    `json:"spec_id" binding:"required"`
	SpecType string `json:"spec_type" binding:"required"`
}
