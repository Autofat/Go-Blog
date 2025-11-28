package controller

import (
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyz")


func Upload(c *fiber.Ctx) error {
	form, err:=c.MultipartForm()
	if err!=nil{
		return c.Status(400).JSON(fiber.Map{
			"message":"Failed to get multipart form",
			"error":err.Error(),
		})
	}
	files:=form.File["image"]
	if len(files) ==0{
		return c.Status(400).JSON(fiber.Map{
			"message":"No files uploaded",
		})
	}

	file:= files[0]

	validartionType:= map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/gif":  true,
	}

	if !validartionType[file.Header.Get("Content-Type")]{
		return c.Status(400).JSON(fiber.Map{
			"message":"Invalid file type",
		})
	}
	
	maxSize := int64(2 * 1024 * 1024) // 2MB
	if file.Size > maxSize{
		return c.Status(400).JSON(fiber.Map{
			"message":"File size exceeds the 2MB limit",
		})
	}

	rand.Seed(time.Now().UnixNano())
	randomName := fmt.Sprintf("%d_%d%s", 
		time.Now().Unix(),
		rand.Intn(1000),
		file.Filename,
	)
	fileName:= randomName

	uploadDir := "./uploads/"
	if _, err:= os.Stat(uploadDir); os.IsNotExist(err){
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	filePath := filepath.Join(uploadDir, fileName)
	if err:= c.SaveFile(file, filePath); err!= nil{
		return c.Status(500).JSON(fiber.Map{
			"message":"Failed to save file",
			"error": err.Error(),
		})
	}

	fileUrl:= fmt.Sprintf("http://localhost:4000/api/uploads/%s", fileName)

	return c.Status(200).JSON(fiber.Map{
		"message": "File uploaded successfully",
		"url": fileUrl,
	})

}