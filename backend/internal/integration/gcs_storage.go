package integration

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"cloud.google.com/go/storage"
	"github.com/dealjosh/merchant-api/internal/domain"
)

type gcsStorage struct {
	client     *storage.Client
	bucketName string
}

// NewGCSStorage initializes the Google Cloud Storage service
func NewGCSStorage(client *storage.Client, bucketName string) domain.StorageService {
	return &gcsStorage{
		client:     client,
		bucketName: bucketName,
	}
}

func (s *gcsStorage) UploadImage(ctx context.Context, imageBytes []byte, filename string) (string, error) {
	bucket := s.client.Bucket(s.bucketName)
	obj := bucket.Object(filename)

	writer := obj.NewWriter(ctx)
	writer.ContentType = "image/jpeg"

	buf := bytes.NewReader(imageBytes)
	if _, err := io.Copy(writer, buf); err != nil {
		return "", fmt.Errorf("failed to copy image bytes to GCS: %w", err)
	}

	if err := writer.Close(); err != nil {
		return "", fmt.Errorf("failed to close GCS writer: %w", err)
	}

	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", s.bucketName, filename), nil
}
