package postgres

import (
	"github.com/dealjosh/merchant-api/internal/domain"
	"github.com/jmoiron/sqlx"
)

type CategoryRepo struct {
	db *sqlx.DB
}

func NewCategoryRepo(db *sqlx.DB) *CategoryRepo {
	return &CategoryRepo{db: db}
}

func (r *CategoryRepo) GetAllActive() ([]domain.Category, error) {
	var categories []domain.Category
	// We sort by parent_id so Master categories usually come first
	query := `SELECT id, name, slug, parent_id, icon_url FROM categories 
              WHERE is_active = TRUE ORDER BY parent_id ASC, name ASC`

	err := r.db.Select(&categories, query)
	return categories, err
}
