package controller

import (
	"backend/database"
	"backend/models"
	"backend/util"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// Validasi email xxxx@xxxx.xxxx
func validateEmail(email string) bool {
	Re:= regexp.MustCompile(`[a-z0-9._%+\-]+@[a-z0-9._%+\-]+\.[a-z0-9._%+\-]`)
	return Re.MatchString(email)
}

func Register(c *fiber.Ctx) error{
	var data map[string]interface{}
	var userData models.User

	if err:=c.BodyParser(&data); err!=nil{
		fmt.Println("Error parsing body:", err)
	}

	// Validating password >= 8 characters
	if len(data["password"].(string))<8{
		c.Status(400)
		return c.JSON(fiber.Map{
			"message":"Password must be at least 8 characters long",
		})
	}

	if !validateEmail(strings.TrimSpace(data["email"].(string))){
		c.Status(400)
		return c.JSON(fiber.Map{
			"message":"Invalid email format",
		})
	}

	//check if user already exists
	database.DB.Where("email=?", strings.TrimSpace(data["email"].(string))).First(&userData)
	if userData.ID!=0{
		c.Status(400)
		return c.JSON(fiber.Map{
			"message":"Email already exists",
		})
	}

	user:= models.User{
		FirstName: data["first_name"].(string),
		LastName:  data["last_name"].(string),
		Email:     strings.TrimSpace(data["email"].(string)),
		Phone:     data["phone"].(string),
	}

	user.SetPassword(data["password"].(string))
	err:=database.DB.Create(&user)
	if err.Error!=nil{
		log.Println("Error creating user:", err.Error)
		c.Status(500)
		return c.JSON(fiber.Map{
			"message":"Could not register user",
		})
	}else{
		c.Status(200)
		return c.JSON(fiber.Map{
			"user":user,
			"message":"User registered successfully",
		})
	}
 
}

func Login(c *fiber.Ctx) error{
	var data map[string] string
	
	if err:=c.BodyParser(&data); err!=nil{
		fmt.Println("Error parsing body:", err)
	}

	// Check if User with Email exists
	var user models.User
	database.DB.Where("email=?", data["email"]).First(&user)
	if user.ID==0{
		c.Status(404)
		return c.JSON(fiber.Map{
			"message":"Email not found",
		})
	}
	
	// Check if password is correct
	if err:= user.CheckPassword(data["password"]); err!=nil{
		c.Status(401)
		return c.JSON(fiber.Map{
			"message":"Incorrect password",
		})
	}

	// Generate JWT Token
	// fmt.Println("Generating JWT for user ID:", user.ID) // Log untuk memeriksa ID pengguna
	token, err:= util.GenerateJwt(strconv.Itoa(int(user.ID)),)
	if err!=nil{
		c.Status(fiber.StatusInternalServerError)
		return nil
	}

	// Set Cookie
	cookie:= fiber.Cookie{
		Name: "jwt",
		Value: token,
		Expires:  time.Now().Add(time.Hour*24),
		HTTPOnly: true,
		SameSite: "Lax",
		Path: "/",
	}
	c.Cookie(&cookie)
	return c.JSON(fiber.Map{
		"message":"Login successful",
		"user": user,
	})
}

func Logout (c *fiber.Ctx) error{
		cookie:= fiber.Cookie{
		Name: "jwt",
		Value: "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Path: "/",
	}
	c.Cookie(&cookie)
	return c.JSON(fiber.Map{
		"message":"Logout successful",
	})
}

type Claims struct {
	jwt.RegisteredClaims
}