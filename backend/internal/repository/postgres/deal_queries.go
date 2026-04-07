package postgres

const (
	// Deal Lifecycle
	Deal_Insert      = `INSERT INTO deals (store_id, title, discount_pct) VALUES ($1, $2, $3)`
	Deal_GetActive   = `SELECT * FROM deals WHERE status = 'active' AND end_date > NOW()`
	Deal_MarkExpired = `UPDATE deals SET status = 'expired' WHERE end_date <= NOW()`
)
