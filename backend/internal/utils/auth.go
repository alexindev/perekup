package utils

import (
	"backend/inte
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"sort"
	"strings"
)

// VerifyAndGetUserData аутентификация пользователей телеграм
func VerifyAndGetUserData(initData, botToken string) (*entity.UserData, error) {

	// сreate secret key - сначала создаем секретный ключ из строки "WebAppData" и токена бота
	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(botToken))
	secretKeyBytes := secretKey.Sum(nil)

	// parse the initData
	parsedURL, err := url.ParseQuery(initData)
	if err != nil {
		return nil, fmt.Errorf("failed to parse initData query string: %w", err)
	}

	// extract the hash
	hash := parsedURL.Get("hash")
	if hash == "" {
		return nil, errors.New("hash parameter not found in initData")
	}
	parsedURL.Del("hash")

	// build the data check string
	var dataCheckSlice []string
	for key, value := range parsedURL {
		dataCheckSlice = append(dataCheckSlice, fmt.Sprintf("%s=%s", key, value[0]))
	}

	sort.Strings(dataCheckSlice)

	dataCheckString := strings.Join(dataCheckSlice, "\n")

	// calculate the HMAC-SHA-256 signature
	hmacHash := hmac.New(sha256.New, secretKeyBytes)
	hmacHash.Write([]byte(dataCheckString))
	calculatedHash := hex.EncodeToString(hmacHash.Sum(nil))

	// compare the hashes
	if !hmac.Equal([]byte(calculatedHash), []byte(hash)) {
		return nil, errors.New("invalid token")
	}

	userJsonStr := parsedURL.Get("user")
	if userJsonStr == "" {
		return nil, errors.New("user data not found in initData")
	}

	var userData entity.UserData
	err = json.Unmarshal([]byte(userJsonStr), &userData)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal user data: %w", err)
	}

	if userData.TelegramID == 0 {
		return nil, errors.New("invalid telegramID in initData")
	}

	return &userData, nil

}
