// /projects/dealjosh-merchant/backend/internal/repository/postgres/deal_read.go
package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/dealjosh/merchant-api/internal/domain"
	"github.com/lib/pq"
)

func (r *pgDealRepo) GetByID(ctx context.Context, id string) (*domain.Deal, error) {
	d := &domain.Deal{}
	var offerDetailsJSON []byte

	// 1. Null-Safe Variables & the int64 middleman for Postgres strictness
	var desc, img, offerType, startDate, endDate sql.NullString
	var price sql.NullFloat64
	var selectedDays64 []int64

	// 2. Scan from database
	err := r.DB.QueryRowContext(ctx, Deal_GetByID, id).Scan(
		&d.ID, &d.Title, &desc, &price,
		&img, pq.Array(&d.AITags), &d.Status, &d.CreatedAt,
		&offerType, &offerDetailsJSON, &d.IsRecurring, pq.Array(&selectedDays64), // 🚀 Using the int64 slice here
		&startDate, &endDate,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get deal by id: %w", err)
	}

	// 3. Transfer Null-Safe variables
	d.Description = desc.String
	d.SuggestedPrice = price.Float64
	d.ImageURL = img.String
	d.OfferType = offerType.String
	d.StartDate = startDate.String
	d.EndDate = endDate.String

	// 4. 🚀 Convert the strict int64 array back to normal int array for React
	d.SelectedDays = make([]int, len(selectedDays64))
	for i, v := range selectedDays64 {
		d.SelectedDays[i] = int(v)
	}

	// 5. Safely Parse JSONB
	if len(offerDetailsJSON) > 0 && string(offerDetailsJSON) != "null" {
		if err := json.Unmarshal(offerDetailsJSON, &d.OfferDetails); err != nil {
			return nil, fmt.Errorf("failed to parse offer details: %w", err)
		}
	}

	return d, nil
}
