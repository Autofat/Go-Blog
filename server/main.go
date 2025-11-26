package main

import (
	"backend/database"
	"backend/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	database.Connect()
	err:=godotenv.Load()
	if err!=nil {
		log.Fatal("Error loading .env file")
	}
	port:=os.Getenv("PORT")
	log.Println("Server is running on port:", port)
	app:=fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
        AllowCredentials: true,
        AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
        AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))

	routes.SetupRoutes(app)
	app.Listen(":"+port)

}