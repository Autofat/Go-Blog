package routes

import (
	"backend/controller"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/api/register", controller.Register)
	app.Post("/api/login", controller.Login)
	app.Post("/api/logout", controller.Logout)
	
	authenticated := app.Group("/", middleware.IsAuthenticated) // Apply authentication middleware to all routes 
	authenticated.Post("/api/post", controller.CreatePost)
	authenticated.Get("/api/posts", controller.AllPosts)
	authenticated.Get("/api/posts/unique", controller.UniquePost)

	authenticated.Post("/api/upload-image", controller.Upload)
	authenticated.Static("/api/uploads", "./uploads")

// peletakan route di setting karena kalau lewat yang membaca id fiber membaca "/" terakhir sebagai id 
	authenticated.Get("/api/posts/:id", controller.DetailPost)
	authenticated.Put("/api/posts/update/:id", controller.UpdatePost)
	authenticated.Delete("/api/posts/delete/:id", controller.DeletePost)
}