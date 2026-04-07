package main

import (
	"log"
	"net/http"
	"time"

	"github.com/dealjosh/merchant-api/internal/api/delivery"
	"github.com/dealjosh/merchant-api/internal/config"
	"github.com/dealjosh/merchant-api/internal/repository/postgres"
	"github.com/dealjosh/merchant-api/internal/usecase"
)

// CORS Middleware to allow your React app (from any IP) to talk to Go
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow your Vite frontend from any network IP
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")

		// Handle preflight OPTIONS requests from the browser
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// 1. Load Config
	cfg := config.Load()

	// 2. Initialize DB Connection
	db, err := postgres.NewConnection(cfg.DBURL)
	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}
	defer db.Close()

	// 3. Layer Wiring (Dependency Injection)

	// --- Auth Domain ---
	userRepo := postgres.NewUserRepository(db)
	authUseCase := usecase.NewAuthUseCase(userRepo, 5*time.Second, cfg.JWTSecret)
	authHandler := delivery.NewAuthHandler(authUseCase)

	// --- Store Domain ---
	storeRepo := postgres.NewStoreRepo(db)
	storeUseCase := usecase.NewStoreUseCase(storeRepo) // 👇 WE ADDED THIS LINE! 👇

	// --- Category Domain ---
	catRepo := postgres.NewCategoryRepo(db)
	catHandler := delivery.NewCategoryHandler(catRepo)

	// 4. Mount the Router
	// 👇 We pass the storeUseCase to the router instead of the raw repo 👇
	router := delivery.NewRouter(authHandler, storeUseCase, catHandler)

	// 5. Production-Ready Server Configuration
	log.Printf("DealJosh Merchant Service live on port %s", cfg.Port)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      corsMiddleware(router),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// 6. Start the Engine
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server Error: %v", err)
	}
}
