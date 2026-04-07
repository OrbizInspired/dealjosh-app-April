package postgres

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // Driver required for postgres
)

// NewConnection initializes a production-grade connection pool.
// It handles the 100k merchant scale via optimized pooling.
func NewConnection(dsn string) (*sqlx.DB, error) {
	// 1. Open the connection
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("cloud sql connection failed: %w", err)
	}

	// 2. High-Concurrency Tuning (The 100k Scale Strategy)
	// We use a small, fast pool to serve a massive number of incoming requests.
	db.SetMaxOpenConns(80)           // Leave 20% headroom for admin/maintenance
	db.SetMaxIdleConns(20)           // Keep 20 connections "warm" for instant spikes
	db.SetConnMaxLifetime(time.Hour) // Recycle connections to prevent memory leaks
	db.SetConnMaxIdleTime(15 * time.Minute)

	// 3. Ping the database to ensure the cloud firewall is open
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("database reachable but ping failed (check GCP Firewall/Whitelist): %w", err)
	}

	return db, nil
}
