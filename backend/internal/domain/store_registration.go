package domain

import "context"

// StoreRequest defines the incoming HTTP payload
type StoreRequest struct {
	FirstName        string      `json:"firstName"`
	LastName         string      `json:"lastName"`
	StoreName        string      `json:"storeName"`
	MasterCategoryId string      `json:"masterCategoryId"`
	SubCategoryIds   []int       `json:"subCategoryIds"`
	Lat              float64     `json:"lat"`
	Lng              float64     `json:"lng"`
	Address          interface{} `json:"address"`
	StoreHours       *StoreHours `json:"storeHours"` // Connects to the struct in store_hours.go
}

// StoreRepository defines database interactions
type StoreRepository interface {
	CreateStore(ctx context.Context, userID string, data map[string]interface{}) (int, error)
}

// StoreUseCase defines business logic
type StoreUseCase interface {
	RegisterNewStore(ctx context.Context, userID string, req *StoreRequest) (int, error)
}
