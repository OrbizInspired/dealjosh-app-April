package delivery

import (
	"net/http"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// NewRouter now accepts AuthHandler, StoreUseCase, CategoryHandler, AND DealHandler
func NewRouter(
	authHandler *AuthHandler,
	storeUseCase domain.StoreUseCase, // <-- We ask for the UseCase interface here!
	catHandler *CategoryHandler,
	dealHandler *DealHandler, // 🚀 ADDED: The new handler for Agentic Post Deals
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

	// 4. Agentic Deals Route 🚀 ADDED THIS SECTION
	// This expects a POST request with multipart/form-data containing the cropped image
	mux.HandleFunc("/api/deals/agentic", dealHandler.HandlePostAgenticDeal)
	mux.HandleFunc("/api/deals/publish", dealHandler.HandlePublishDeal)
	mux.HandleFunc("/api/deals/", dealHandler.HandleGetDeal)

	return mux
}
