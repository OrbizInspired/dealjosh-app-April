// /projects/dealjosh-merchant/backend/internal/repository/postgres/deal_repo.go
package postgres

import (
	"github.com/dealjosh/merchant-api/internal/domain"
	"github.com/jmoiron/sqlx"
)

// ==========================================
// 🗄️ QUERY REGISTRY (Centralized SQL)
// ==========================================
const (
	Deal_CreateDraft = `
		INSERT INTO deals (id, title, description, suggested_price, image_url, ai_tags, status, created_at) 
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) 
		RETURNING id, created_at`

	// 🚀 Includes our bulletproof COALESCE and Type Castings
	Deal_GetByID = `
		SELECT id, title, description, suggested_price, image_url, 
		       COALESCE(ai_tags, '{}'::text[]) as ai_tags, 
		       status, created_at, offer_type, 
		       COALESCE(offer_details, '{}'::jsonb) as offer_details, 
		       COALESCE(is_recurring, false) as is_recurring, 
		       COALESCE(selected_days, '{}'::integer[]) as selected_days, 
		       start_date, end_date
		FROM deals 
		WHERE id = $1`

	Deal_UpdateLive = `
		UPDATE deals 
		SET title = $1, description = $2, suggested_price = $3, image_url = $4, 
		    offer_type = $5, offer_details = $6, is_recurring = $7, 
		    selected_days = $8, start_date = $9, end_date = $10, status = $11
		WHERE id = $12`

	Deal_InsertLive = `
		INSERT INTO deals (id, title, description, suggested_price, image_url, offer_type, offer_details, is_recurring, selected_days, start_date, end_date, status)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id`
)

// ==========================================
// 🛠️ REPOSITORY SETUP
// ==========================================
type pgDealRepo struct {
	DB *sqlx.DB
}

func NewPostgresDealRepository(db *sqlx.DB) domain.DealRepository {
	return &pgDealRepo{DB: db}
}
