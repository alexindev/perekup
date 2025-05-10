package models

// Categories категории товара
type Categories struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Models модель товара
type Models struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	CategoryId int    `json:"category_id"`
}

// Specs спецификация товара
type Specs struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	ModelId int    `json:"model_id"`
}

// Keywords ключевые слова для спецификации товара
type Keywords struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	SpecId int    `json:"spec_id"`
}
