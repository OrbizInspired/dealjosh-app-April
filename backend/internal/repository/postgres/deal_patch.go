// /projects/dealjosh-merchant/backend/internal/repository/postgres/deal_patch.go
package postgres

import (
	"context"
	"fmt"
)

// ⏸️ UpdateStatus handles pausing, unpausing, or canceling a deal
func (r *pgDealRepo) UpdateStatus(ctx context.Context, dealID string, status string) error {
	query := `UPDATE deals SET status = $1 WHERE id = $2`
	_, err := r.DB.ExecContext(ctx, query, status, dealID)
	if err != nil {
		return fmt.Errorf("failed to update status: %w", err)
	}
	return nil
}

// 📅 ExtendDate pushes the expiration date further out
func (r *pgDealRepo) ExtendDate(ctx context.Context, dealID string, newEndDate string) error {
	query := `UPDATE deals SET end_date = $1 WHERE id = $2`
	_, err := r.DB.ExecContext(ctx, query, newEndDate, dealID)
	if err != nil {
		return fmt.Errorf("failed to extend date: %w", err)
	}
	return nil
}
