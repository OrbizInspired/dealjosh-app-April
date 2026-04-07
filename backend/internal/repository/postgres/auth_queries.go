package postgres

const (
	// Auth & User Management
	Auth_CreateUser      = `INSERT INTO users (mobile_number) VALUES ($1) RETURNING id, mobile_number, is_verified`
	Auth_GetUserByMobile = `SELECT id, mobile_number, is_verified FROM users WHERE mobile_number = $1`
	Auth_UpdateVerify    = `UPDATE users SET is_verified = $1 WHERE mobile_number = $2`
)
