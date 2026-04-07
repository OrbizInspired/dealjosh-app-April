package delivery

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/dealjosh/merchant-api/internal/domain"
)

// otpResponse defines the structured response for OTP actions
type otpResponse struct {
	Message string `json:"message"`
	OTP     string `json:"otp,omitempty"` // Shown in dev, hidden in prod if empty
}

type AuthHandler struct {
	authUcase domain.AuthUseCase
}

func NewAuthHandler(au domain.AuthUseCase) *AuthHandler {
	return &AuthHandler{authUcase: au}
}

// RequestOTP handles the initial step of the frictionless login
func (h *AuthHandler) RequestOTP(w http.ResponseWriter, r *http.Request) {
	// 1. Guard Clause: Method Validation
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Security: Limit request body size to 1MB
	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	// 3. Decoding with Validation
	var req struct {
		Mobile string `json:"mobileNumber"` // MATCHED TO FRONTEND
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Payload Error in RequestOTP: %v", err)
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// 4. Basic Input Sanitization
	if len(req.Mobile) < 10 {
		log.Printf("Validation Error: Mobile number too short: %s", req.Mobile)
		http.Error(w, "Invalid mobile number format", http.StatusBadRequest)
		return
	}

	// 5. Execution: Pass to UseCase
	otp, err := h.authUcase.RequestOTP(r.Context(), req.Mobile)
	if err != nil {
		log.Printf("UseCase Error in RequestOTP: %v", err)
		http.Error(w, "Service temporarily unavailable", http.StatusInternalServerError)
		return
	}

	// 6. Response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(otpResponse{
		Message: "OTP sent successfully",
		OTP:     otp,
	})
}

// VerifyOTP handles the second step, returning the JWT upon success
func (h *AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	var req struct {
		Mobile string `json:"mobileNumber"` // MATCHED TO FRONTEND
		OTP    string `json:"otp"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Payload Error in VerifyOTP: %v", err)
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if len(req.Mobile) < 10 || len(req.OTP) != 5 {
		http.Error(w, "Invalid mobile number or OTP format", http.StatusBadRequest)
		return
	}

	// 5. Execution
	token, err := h.authUcase.VerifyOTP(r.Context(), req.Mobile, req.OTP)
	if err != nil {
		http.Error(w, "Invalid or expired OTP", http.StatusUnauthorized)
		return
	}

	// 6. Handing over the JWT
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Login successful",
		"token":     token,
		"isNewUser": true, // Keeping this true to force the registration flow test
	})
}
