package util

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const SecretKey = "secret"

func GenerateJwt(issuer string) (string, error) {
    claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
        Issuer:    issuer,
        ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), // Token expires in 24 hours
    })
    return claims.SignedString([]byte(SecretKey))
}

func ParseJwt(cookie string)(string, error){
    token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
        return []byte(SecretKey), nil
    })
    if err != nil || !token.Valid {
        fmt.Println("Error parsing JWT:", err) // Log error jika parsing gagal
        return "", err
    }

    claims := token.Claims.(*jwt.RegisteredClaims)
    return claims.Issuer, nil
}