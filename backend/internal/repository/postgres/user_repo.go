package postgres

import (
	"context"

	"github.com/dealjosh/merchant-api/internal/domain"
	"github.com/jmoiron/sqlx"
)

type postgresUserRepo struct {
	DB *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) domain.UserRepository {
	return &postgresUserRepo{DB: db}
}

func (r *postgresUserRepo) GetByMobile(ctx context.Context, mobile string) (*domain.User, error) {
	var user domain.User
	// Reference Auth_GetUserByMobile from auth_queries.go
	err := r.DB.GetContext(ctx, &user, Auth_GetUserByMobile, mobile)
	return &user, err
}

func (r *postgresUserRepo) Create(ctx context.Context, mobile string) (*domain.User, error) {
	var user domain.User
	// Reference Auth_CreateUser from auth_queries.go
	err := r.DB.QueryRowxContext(ctx, Auth_CreateUser, mobile).StructScan(&user)
	return &user, err
}

func (r *postgresUserRepo) UpdateVerificationStatus(ctx context.Context, mobile string, status bool) error {
	// Reference Auth_UpdateVerify from auth_queries.go
	_, err := r.DB.ExecContext(ctx, Auth_UpdateVerify, status, mobile)
	return err
}
