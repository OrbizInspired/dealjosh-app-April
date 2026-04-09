// dealjosh-merchant/backend/internal/config/config.go
package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DBURL         string
	Port          string
	JWTSecret     string
	GeminiAPIKey  string // 🤖 Powers your gemini_Agent.go
	GCSBucketName string // ☁️ Powers your gcs_storage.go
}

func Load() *Config {
	currentDir, _ := os.Getwd()

	paths := []string{
		filepath.Join(currentDir, ".env"),
		filepath.Join(currentDir, "..", ".env"),
		filepath.Join(currentDir, "..", "..", ".env"),
	}

	envFound := false
	for _, path := range paths {
		if _, err := os.Stat(path); err == nil {
			_ = godotenv.Load(path)
			log.Printf("✅ Loaded config from: %s", path)
			envFound = true
			break
		}
	}

	if !envFound {
		log.Println("⚠️ Note: .env file not found, using system environment variables")
	}

	return &Config{
		DBURL:         os.Getenv("DB_URL"),
		Port:          os.Getenv("PORT"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		GeminiAPIKey:  os.Getenv("GEMINI_API_KEY"),  // 🤖 Mapped from .env
		GCSBucketName: os.Getenv("GCS_BUCKET_NAME"), // ☁️ Mapped from .env
	}
}
