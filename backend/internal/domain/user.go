package domain

import (
	"context"
	"time"
)

// User represents the merchant identity
type User struct {
	ID           string    `db:"id" json:"id"`
	MobileNumber string    `db:"mobile_number" json:"mobile_number"`
	IsVerified   bool      `db:"is_verified" json:"is_verified"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

// UserRepository defines how we persist user data
type UserRepository interface {
	GetByMobile(ctx context.Context, mobile string) (*User, error)
	Create(ctx context.Context, mobile string) (*User, error)
	UpdateVerificationStatus(ctx context.Context, mobile string, status bool) error
}

// AuthUseCase defines the business logic for authentication
type AuthUseCase interface {
	RequestOTP(ctx context.Context, mobile string) (string, error)
	VerifyOTP(ctx context.Context, mobile string, otp string) (string, error) // Returns JWT token
}
