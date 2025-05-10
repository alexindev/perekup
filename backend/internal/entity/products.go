package entity

type Catalog []struct {
	Category Category `json:"category"`
}

type Category struct {
	Name   string  `json:"name"`
	Models []Model `json:"models,omitempty"`
}

type Model struct {
	Name  string `json:"name"`
	Specs []Spec `json:"specs,omitempty"`
}

type Spec struct {
	Name     string   `json:"name"`
	Keywords []string `json:"keywords,omitempty"`
}
