// /projects/dealjosh-merchant/backend/internal/repository/postgres/deal_write.go
package postgres

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/dealjosh/merchant-api/internal/domain"
	"github.com/lib/pq"
)

func (r *pgDealRepo) CreateDraft(ctx context.Context, d *domain.Deal) error {
	err := r.DB.QueryRowContext(ctx, Deal_CreateDraft,
		d.Title, d.Description, d.SuggestedPrice, d.ImageURL,
		pq.Array(d.AITags), d.Status,
	).Scan(&d.ID, &d.CreatedAt)

	if err != nil {
		return fmt.Errorf("failed to insert deal draft: %w", err)
	}
	return nil
}

func (r *pgDealRepo) PublishDeal(ctx context.Context, d *domain.Deal) error {
	offerDetailsJSON, err := json.Marshal(d.OfferDetails)
	if err != nil {
		return fmt.Errorf("failed to marshal offer details: %w", err)
	}

	// If ID exists (Agent drafted it first), UPDATE it
	if d.ID != "" {
		_, err = r.DB.ExecContext(ctx, Deal_UpdateLive,
			d.Title, d.Description, d.SuggestedPrice, d.ImageURL,
			d.OfferType, offerDetailsJSON, d.IsRecurring,
			pq.Array(d.SelectedDays), d.StartDate, d.EndDate, d.Status, d.ID,
		)
		return err
	}

	// If NO ID exists (Manual Entry), INSERT it
	return r.DB.QueryRowContext(ctx, Deal_InsertLive,
		d.Title, d.Description, d.SuggestedPrice, d.ImageURL,
		d.OfferType, offerDetailsJSON, d.IsRecurring,
		pq.Array(d.SelectedDays), d.StartDate, d.EndDate, d.Status,
	).Scan(&d.ID)
}
