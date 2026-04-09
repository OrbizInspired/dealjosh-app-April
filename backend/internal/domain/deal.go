package domain

import (
	"context"
	"time"
)

// Deal represents the core AI-drafted entity for a deal
// Deal represents the core business model for a merchant's offer
type Deal struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	SuggestedPrice float64   `json:"suggested_price"`
	ImageURL       string    `json:"image_url"`
	AITags         []string  `json:"ai_tags"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`

	// 🚀 FIELDS ADDED FOR PUBLISHING
	OfferType    string                 `json:"offer_type"`
	OfferDetails map[string]interface{} `json:"offer_details"` // Maps the dynamic JSON object
	IsRecurring  bool                   `json:"is_recurring"`
	SelectedDays []int                  `json:"selected_days"`
	StartDate    string                 `json:"start_date"`
	EndDate      string                 `json:"end_date"`
}

// DealRepository defines the database operations
type DealRepository interface {
	CreateDraft(ctx context.Context, deal *Deal) error
	GetByID(ctx context.Context, id string) (*Deal, error)
	PublishDeal(ctx context.Context, deal *Deal) error
	// 🚀 Add these two new Patch actions
	UpdateStatus(ctx context.Context, dealID string, status string) error
	ExtendDate(ctx context.Context, dealID string, newEndDate string) error
}

// DealUsecase defines the business logic operations
type DealUsecase interface {
	ProcessAgenticDeal(ctx context.Context, imageBytes []byte) (*Deal, error)
	GetDeal(ctx context.Context, id string) (*Deal, error)
	PublishDeal(ctx context.Context, deal *Deal) error
	// 🚀 Add these two new Patch actions
	UpdateStatus(ctx context.Context, dealID string, status string) error
	ExtendDate(ctx context.Context, dealID string, newEndDate string) error
}

// DealAgent is the interface for our Gemini AI service
type DealAgent interface {
	AnalyzeImageAndDraftDeal(ctx context.Context, imageBytes []byte) (*Deal, error)
}

// StorageService handles file uploads to the cloud
type StorageService interface {
	UploadImage(ctx context.Context, imageBytes []byte, filename string) (string, error)
}
