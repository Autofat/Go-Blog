package controller

import (
	"math/rand"

	"github.com/gofiber/fiber/v2"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

func randLetter(n int) string {
	b:=make([]rune, n)
	for i:=range b{
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func Upload(c *fiber.Ctx) error {
	form, err:=c.MultipartForm()
	if err!=nil{
		return c.Status(400).JSON(fiber.Map{
			"message":"Failed to get multipart form",
			"error":err.Error(),
		})
	}
	files:=form.File["image"]
	fileName:=""

	for _, file:=range files{
		fileName = randLetter(5) + "-" + file.Filename
		if err:=c.SaveFile(file, "./uploads/" + fileName); err!=nil{
			return c.Status(500).JSON(fiber.Map{
				"message":"Failed to save file",
				"error":err.Error(),
			})
		}
	}
	return c.Status(200).JSON(fiber.Map{
		"url":"http://localhost:4000/api/uploads/"+fileName,
	})

}