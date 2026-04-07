package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DBURL     string
	Port      string
	JWTSecret string
}

func Load() *Config {
	// 1. Find the current working directory
	currentDir, _ := os.Getwd()

	// 2. The Architect's Search Path: Check current, parent, and grandparent dirs
	paths := []string{
		filepath.Join(currentDir, ".env"),             // If run from root
		filepath.Join(currentDir, "..", ".env"),       // If run from backend/
		filepath.Join(currentDir, "..", "..", ".env"), // If run from cmd/
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

	// 3. Return the populated config struct
	return &Config{
		DBURL:     os.Getenv("DB_URL"),
		Port:      os.Getenv("PORT"),
		JWTSecret: os.Getenv("JWT_SECRET"),
	}
}
