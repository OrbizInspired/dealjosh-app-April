// /projects/dealjosh-merchant/backend/internal/api/delivery/deal_handler.go
package delivery

import (
	"encoding/json"
	"fmt" // 🚀 Added for logging errors
	"io"
	"net/http"
	"strings" // 🚀 Added this back! Needed for TrimPrefix

	"github.com/dealjosh/merchant-api/internal/domain"
)

type DealHandler struct {
	usecase domain.DealUsecase
}

func NewDealHandler(u domain.DealUsecase) *DealHandler {
	return &DealHandler{usecase: u}
}

// HandlePostAgenticDeal handles POST /api/deals/agentic
func (h *DealHandler) HandlePostAgenticDeal(w http.ResponseWriter, r *http.Request) {
	// 1. Parse the multipart form (limit max memory to 10MB)
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// 2. Retrieve the file from the frontend "image" field
	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Image file is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 3. Read the file into memory as bytes
	imageBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read image", http.StatusInternalServerError)
		return
	}

	// 4. Pass the bytes to our Orchestrator (Usecase)
	draftDeal, err := h.usecase.ProcessAgenticDeal(r.Context(), imageBytes)
	if err != nil {
		// In production, log the error and return a sanitized message
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 5. Return the AI-drafted deal to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(draftDeal)
}

// HandleGetDeal handles GET /api/deals/{id}
func (h *DealHandler) HandleGetDeal(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 1. Extract the ID from "/api/deals/uuid"
	// 2. Guard against sub-routes like /publish or /agentic being treated as IDs
	dealID := strings.TrimPrefix(r.URL.Path, "/api/deals/")
	if dealID == "" || dealID == "publish" || dealID == "agentic" {
		http.Error(w, "Valid Deal ID is required", http.StatusBadRequest)
		return
	}

	// Ask the usecase to fetch the deal
	deal, err := h.usecase.GetDeal(r.Context(), dealID)
	if err != nil {
		fmt.Println("🚨 DB ERROR:", err) // 🚀 This will save you so much debugging time!
		http.Error(w, "Deal not found", http.StatusNotFound)
		return
	}

	// Send the deal back to React
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deal)
}

// HandlePublishDeal handles POST /api/deals/publish
func (h *DealHandler) HandlePublishDeal(w http.ResponseWriter, r *http.Request) {
	// Allowing both POST and PUT is a good REST practice for updates
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload domain.Deal
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Call the usecase to finalize and publish the deal
	err := h.usecase.PublishDeal(r.Context(), &payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send success response with the deal ID back to React
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Deal successfully published",
		"id":      payload.ID,
	})
}
