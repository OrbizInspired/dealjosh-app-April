package usecase

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// init runs once when the package is first imported
func init() {
	rand.Seed(time.Now().UnixNano())
}

type authUseCase struct {
	userRepo       domain.UserRepository
	contextTimeout time.Duration
	jwtSecret      []byte
}

func NewAuthUseCase(repo domain.UserRepository, timeout time.Duration, secret string) domain.AuthUseCase {
	return &authUseCase{
		userRepo:       repo,
		contextTimeout: timeout,
		jwtSecret:      []byte(secret), // <-- The magical required trailing comma
	}
}

func (u *authUseCase) RequestOTP(ctx context.Context, mobile string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, u.contextTimeout)
	defer cancel()

	// 1. Check if user exists
	_, err := u.userRepo.GetByMobile(ctx, mobile)
	if err != nil {
		// 2. Frictionless Signup: Create user if they don't exist
		_, err = u.userRepo.Create(ctx, mobile)
		if err != nil {
			return "", err
		}
	}

	// 3. Generate 5-digit OTP (Safe now with package-level seeding)
	otp := fmt.Sprintf("%05d", rand.Intn(90000)+10000)

	// 4. Mock SMS Gateway (Console Log)
	fmt.Printf("\n--- [MOCK SMS GATEWAY] ---\n")
	fmt.Printf("To: +91-%s | OTP: %s\n", mobile, otp)
	fmt.Printf("--------------------------\n")

	return otp, nil
}

func (u *authUseCase) VerifyOTP(ctx context.Context, mobile string, otp string) (string, error) {
	// TODO: Integrate with 2Factor.in / Firebase Auth for production
	return "mock-jwt-session-token", nil
}
