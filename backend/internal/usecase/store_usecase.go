package usecase

import (
	"context"

	"github.com/dealjosh/merchant-api/internal/domain"
)

type storeUseCase struct {
	repo domain.StoreRepository
}

// NewStoreUseCase injects the repository dependency
func NewStoreUseCase(repo domain.StoreRepository) domain.StoreUseCase {
	return &storeUseCase{
		repo: repo,
	}
}

// RegisterNewStore handles the business logic before saving to the DB
func (uc *storeUseCase) RegisterNewStore(ctx context.Context, userID string, req *domain.StoreRequest) (int, error) {

	// BUSINESS RULE 1: If hours are skipped, inject domain defaults
	if req.StoreHours == nil {
		req.StoreHours = domain.NewDefaultStoreHours()
	}

	// MAP TO DB FORMAT (Preparing for Postgres)
	data := map[string]interface{}{
		"firstName":        req.FirstName,
		"lastName":         req.LastName,
		"storeName":        req.StoreName,
		"masterCategoryId": req.MasterCategoryId,
		"subCategoryIds":   req.SubCategoryIds,
		"lat":              req.Lat,
		"lng":              req.Lng,
		"address":          req.Address,
		"storeHours":       req.StoreHours,
	}

	// Delegate the actual saving to the Repository
	return uc.repo.CreateStore(ctx, userID, data)
}
