package delivery

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// RegisterStore now depends on the UseCase interface, NOT the Postgres Repo!
func RegisterStore(useCase domain.StoreUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// CORS is already handled by our main middleware, but we'll keep the logic safe
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// 1. AUTH CHECK
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Missing Token", http.StatusUnauthorized)
			return
		}

		// TODO: Real JWT decoding to get actual userID.
		// Using your MVP Test UUID for now.
		userID := "e0930ae1-fe92-4d7d-a105-bfd900d24580"

		// 2. PARSE REQUEST (Now using domain.StoreRequest!)
		var req domain.StoreRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Payload error: %v", err)
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// 3. HAND OFF TO THE SERVICE LAYER
		// Notice how we pass r.Context() here! This fixes your error!
		storeID, err := useCase.RegisterNewStore(r.Context(), userID, &req)
		if err != nil {
			log.Printf("Service error: %v", err)
			http.Error(w, "Failed to create store", http.StatusInternalServerError)
			return
		}

		// 4. SUCCESS RESPONSE
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message":  "Store activated successfully!",
			"store_id": storeID,
		})
	}
}
