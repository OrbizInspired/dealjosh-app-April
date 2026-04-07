package delivery

import (
	"encoding/json"
	"net/http"

	"github.com/dealjosh/merchant-api/internal/repository/postgres"
)

type CategoryHandler struct {
	repo *postgres.CategoryRepo
}

func NewCategoryHandler(repo *postgres.CategoryRepo) *CategoryHandler {
	return &CategoryHandler{repo: repo}
}

func (h *CategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.repo.GetAllActive()
	if err != nil {
		http.Error(w, "Failed to fetch categories", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}
