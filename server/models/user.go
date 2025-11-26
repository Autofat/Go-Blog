package models

import "golang.org/x/crypto/bcrypt"

type User struct {
	ID        uint   `json:"id"`
	FirstName string `json:first_name`
	LastName  string `json:last_name`
	Email     string `json:email`
	Password  []byte `json:"-"`
	Phone     string `json:"phone"`
}

func (user *User) SetPassword(password string) {
	hashedPassword,_ :=bcrypt.GenerateFromPassword([]byte(password),14)
	user.Password=hashedPassword
}

// CheckPassword compares the provided password with the stored hashed password
func (user *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}