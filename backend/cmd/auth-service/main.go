// dealjosh-merchant/backend/cmd/auth-service/main.go
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/dealjosh/merchant-api/internal/api/delivery"
	"github.com/dealjosh/merchant-api/internal/config"
	"github.com/dealjosh/merchant-api/internal/integration"
	"github.com/dealjosh/merchant-api/internal/repository/postgres"
	"github.com/dealjosh/merchant-api/internal/usecase"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")

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

	// 3. Initialize Google Cloud Storage Client
	ctx := context.Background()
	gcsClient, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatalf("Fatal: GCS Client initialization failed: %v", err)
	}
	defer gcsClient.Close()

	// ==========================================
	// LAYER WIRING (DEPENDENCY INJECTION)
	// ==========================================

	// --- Auth Domain ---
	userRepo := postgres.NewUserRepository(db)
	authUseCase := usecase.NewAuthUseCase(userRepo, 5*time.Second, cfg.JWTSecret)
	authHandler := delivery.NewAuthHandler(authUseCase)

	// --- Store Domain ---
	storeRepo := postgres.NewStoreRepo(db)
	storeUseCase := usecase.NewStoreUseCase(storeRepo)

	// --- Category Domain ---
	catRepo := postgres.NewCategoryRepo(db)
	catHandler := delivery.NewCategoryHandler(catRepo)

	// --- Deal Domain (Agentic Flow) ---
	dealRepo := postgres.NewPostgresDealRepository(db)

	dealAgent := integration.NewGeminiAgent(cfg.GeminiAPIKey)
	storageSvc := integration.NewGCSStorage(gcsClient, cfg.GCSBucketName)

	// 🚀 UPDATE: Added 15*time.Second to match the updated constructor!
	dealUseCase := usecase.NewDealUsecase(dealRepo, dealAgent, storageSvc, 15*time.Second)
	dealHandler := delivery.NewDealHandler(dealUseCase)

	// ==========================================
	// ROUTER & SERVER CONFIG
	// ==========================================

	// 4. Mount the Router
	router := delivery.NewRouter(authHandler, storeUseCase, catHandler, dealHandler)

	// 5. Production-Ready Server Configuration
	log.Printf("DealJosh Merchant Service live on port %s", cfg.Port)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      corsMiddleware(router),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	// 6. Start the Engine
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server Error: %v", err)
	}
}
