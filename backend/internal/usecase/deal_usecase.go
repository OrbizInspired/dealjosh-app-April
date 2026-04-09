// dealjosh-merchant/backend/internal/usecase/deal_usecase.go
package usecase

import (
	"context"
	"fmt"
	"time"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// dealUsecase implements the domain.DealUsecase interface
type dealUsecase struct {
	dealRepo       domain.DealRepository
	agent          domain.DealAgent      // 🤖 Added for Gemini
	storage        domain.StorageService // ☁️ Added for GCS
	contextTimeout time.Duration
}

// NewDealUsecase creates a new deal usecase instance (Updated with Agent and Storage)
func NewDealUsecase(d domain.DealRepository, a domain.DealAgent, s domain.StorageService, timeout time.Duration) domain.DealUsecase {
	return &dealUsecase{
		dealRepo:       d,
		agent:          a,
		storage:        s,
		contextTimeout: timeout,
	}
}

// CreateDraft handles the manual business logic for creating a deal draft
func (u *dealUsecase) CreateDraft(ctx context.Context, deal *domain.Deal) error {
	ctx, cancel := context.WithTimeout(ctx, u.contextTimeout)
	defer cancel()

	if deal.Title == "" {
		return fmt.Errorf("deal title cannot be empty")
	}

	deal.Status = "draft"
	// deal.CreatedAt = time.Now() // Handled by Postgres CURRENT_TIMESTAMP usually, but okay here if your struct has it

	return u.dealRepo.CreateDraft(ctx, deal)
}

// ProcessAgenticDeal handles the AI generation of a deal draft 🚀 (Fully Implemented)
func (u *dealUsecase) ProcessAgenticDeal(ctx context.Context, imageBytes []byte) (*domain.Deal, error) {
	// Use the timeout so the AI doesn't hang forever if the API is slow
	ctx, cancel := context.WithTimeout(ctx, u.contextTimeout)
	defer cancel()

	// 1. Send image to Gemini Vision API to analyze and draft the deal
	draftDeal, err := u.agent.AnalyzeImageAndDraftDeal(ctx, imageBytes)
	if err != nil {
		return nil, fmt.Errorf("ai agent failed to draft deal: %w", err)
	}

	// 2. Upload the raw cropped image to Google Cloud Storage
	filename := fmt.Sprintf("deals/draft_%d.jpg", time.Now().UnixNano())
	imageURL, err := u.storage.UploadImage(ctx, imageBytes, filename)
	if err != nil {
		return nil, fmt.Errorf("failed to upload image to GCS: %w", err)
	}

	// 3. Update the AI's draft with our system data
	draftDeal.ImageURL = imageURL
	draftDeal.Status = "draft"

	// 4. Save the drafted deal to PostgreSQL
	err = u.dealRepo.CreateDraft(ctx, draftDeal)
	if err != nil {
		return nil, fmt.Errorf("failed to save draft to database: %w", err)
	}

	return draftDeal, nil
}

// 🚀 ADDED: PublishDeal handles the final publication of the deal
func (u *dealUsecase) PublishDeal(ctx context.Context, deal *domain.Deal) error {
	ctx, cancel := context.WithTimeout(ctx, u.contextTimeout)
	defer cancel()

	if deal.Title == "" {
		return fmt.Errorf("deal title cannot be empty")
	}

	// Forcibly move the deal out of draft mode
	deal.Status = "live"

	return u.dealRepo.PublishDeal(ctx, deal)
}

// 🚀 ADDED: GetDeal fetches a single deal for the ManageDealScreen
func (u *dealUsecase) GetDeal(ctx context.Context, id string) (*domain.Deal, error) {
	ctx, cancel := context.WithTimeout(ctx, u.contextTimeout)
	defer cancel()

	// Ask the PostgreSQL repository for the deal
	deal, err := u.dealRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch deal from database: %w", err)
	}

	return deal, nil
}
