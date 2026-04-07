package postgres

import (
	"context"
	"encoding/json"

	"github.com/jmoiron/sqlx"
)

type PostgresStoreRepo struct {
	db *sqlx.DB
}

func NewStoreRepo(db *sqlx.DB) *PostgresStoreRepo {
	return &PostgresStoreRepo{db: db}
}

// CreateStore now takes ctx, matches the domain interface, and returns an int
func (r *PostgresStoreRepo) CreateStore(ctx context.Context, userID string, data map[string]interface{}) (int, error) {

	// 1. Convert complex types to JSON bytes for Postgres JSONB columns
	subCatsJSON, _ := json.Marshal(data["subCategoryIds"])
	addressJSON, _ := json.Marshal(data["address"])

	// 👇 MARSHAL THE STORE HOURS 👇
	storeHoursJSON, _ := json.Marshal(data["storeHours"])

	// 2. Add store_hours to the INSERT and VALUES lists
	sqlStatement := `
		INSERT INTO stores (
			user_id, first_name, last_name, store_name, 
			master_category_id, sub_category_ids, 
			latitude, longitude, address_json, store_hours
		) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
		RETURNING id`

	var storeID int

	// 3. Use QueryRowContext to respect request timeouts/cancellations
	err := r.db.QueryRowContext(
		ctx,
		sqlStatement,
		userID,
		data["firstName"],
		data["lastName"],
		data["storeName"],
		data["masterCategoryId"],
		subCatsJSON,
		data["lat"],
		data["lng"],
		addressJSON,
		storeHoursJSON, // Pass as the 10th parameter
	).Scan(&storeID)

	return storeID, err
}
