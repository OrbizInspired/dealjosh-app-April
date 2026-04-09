package integration

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/dealjosh/merchant-api/internal/domain"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type geminiAgent struct {
	apiKey string
}

func NewGeminiAgent(apiKey string) domain.DealAgent {
	return &geminiAgent{apiKey: apiKey}
}

func (a *geminiAgent) AnalyzeImageAndDraftDeal(ctx context.Context, imageBytes []byte) (*domain.Deal, error) {
	// 1. Initialize the Gemini Client
	client, err := genai.NewClient(ctx, option.WithAPIKey(a.apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create gemini client: %w", err)
	}
	defer client.Close()

	// Use gemini-1.5-flash or pro (both support vision and fast JSON generation)
	model := client.GenerativeModel("gemini-1.5-flash")

	// Force the model to output JSON
	model.ResponseMIMEType = "application/json"

	// 2. Craft the Agentic Prompt
	prompt := genai.Text(`
		You are an expert appraiser and copywriter for a DJ and event services marketplace called DealJosh.
		Analyze the provided image of DJ equipment or an event setup.
		Generate a highly engaging, SEO-optimized deal draft.
		
		Return ONLY a JSON object with exactly these keys:
		- "title": A catchy title for the deal (max 60 chars).
		- "description": A detailed, persuasive description of the service/equipment.
		- "suggested_price": A realistic rental/service price in USD (number only).
		- "ai_tags": An array of 3 to 5 relevant tags (e.g., ["wedding", "pioneer-dj", "lighting"]).
	`)

	// 3. Send the image and prompt to Gemini
	imgData := genai.ImageData("image/jpeg", imageBytes)
	resp, err := model.GenerateContent(ctx, prompt, imgData)
	if err != nil {
		return nil, fmt.Errorf("gemini generation failed: %w", err)
	}

	// 4. Parse the AI's JSON response
	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}

	// Extract the text part
	jsonString := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])

	// Clean up markdown formatting if Gemini included it (e.g., ```json ... ```)
	jsonString = strings.TrimPrefix(jsonString, "```json")
	jsonString = strings.TrimSuffix(jsonString, "```")
	jsonString = strings.TrimSpace(jsonString)

	var draft domain.Deal
	if err := json.Unmarshal([]byte(jsonString), &draft); err != nil {
		return nil, fmt.Errorf("failed to parse AI JSON: %w", err)
	}

	return &draft, nil
}
