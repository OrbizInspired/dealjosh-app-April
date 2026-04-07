package domain

import "time"

type Category struct {
	ID        int       `db:"id" json:"id"`
	Name      string    `db:"name" json:"name"`
	Slug      string    `db:"slug" json:"slug"`
	ParentID  *int      `db:"parent_id" json:"parent_id"` // Pointer handles NULL
	IconURL   *string   `db:"icon_url" json:"icon_url"`
	IsActive  bool      `db:"is_active" json:"is_active"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
