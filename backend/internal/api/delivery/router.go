package delivery

import (
	"net/http"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// NewRouter now accepts AuthHandler, StoreUseCase, AND CategoryHandler
func NewRouter(
	authHandler *AuthHandler,
	storeUseCase domain.StoreUseCase, // <-- We ask for the UseCase interface here!
	catHandler *CategoryHandler,
) *http.ServeMux {
	mux := http.NewServeMux()

	// 1. Auth Service Routes
	mux.HandleFunc("/api/auth/request-otp", authHandler.RequestOTP)
	mux.HandleFunc("/api/auth/verify-otp", authHandler.VerifyOTP)

	// 2. Store Registration Route
	// We pass the UseCase into the handler here!
	mux.HandleFunc("/api/merchants/register-store", RegisterStore(storeUseCase))

	// 3. Categories Route
	mux.HandleFunc("/api/categories", catHandler.GetCategories)

	return mux
}
