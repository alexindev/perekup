package entity

type UserData struct {
	TelegramID int64  `json:"id"`
	FirstName  string `json:"first_name,omitempty"`
	LastName   string `json:"last_name,omitempty"`
	Username   string `json:"username,omitempty"`
}

type UserSubs struct {
	SpecID   int    `json:"id"`
	Name     string `json:"name"`
	SpecType string `json:"spec_type"`
}
