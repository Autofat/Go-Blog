package controller

import (
	"backend/database"
	"backend/models"
	"backend/util"
	"errors"
	"fmt"
	"math"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreatePost(c *fiber.Ctx)error{
	cookie:= c.Cookies("jwt")
	if cookie == ""{
		c.Status(401)
		return c.JSON(fiber.Map{
			"message":"unauthenticated",
		})
	}
	
	UserID, err := util.ParseJwt(cookie)
	if err != nil {
		c.Status(401)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	if UserID == "0" {
        return c.Status(401).JSON(fiber.Map{
            "message": "Invalid user ID from token",
        })
    }

	var blogpost models.Blog
	if err:=c.BodyParser(&blogpost); err!=nil{
		fmt.Println("Error parsing body:", err)
	}
	blogpost.UserID = UserID
	if err:=database.DB.Create(&blogpost).Error; err!=nil{
		c.Status(400)
		return c.JSON(fiber.Map{
			"message":"Invalid payload",
		})
	}
	return c.JSON(fiber.Map{
		"message":"Success upload your post",
	})
}

func AllPosts(c *fiber.Ctx)error{
	page,_ :=strconv.Atoi(c.Query("page","1"))
	limit :=5
	offset:=(page-1)*limit

	var total int64
	var getBlog []models.Blog
	database.DB.Preload("User").Offset(offset).Limit(limit).Find(&getBlog)
	database.DB.Model(&models.Blog{}).Count(&total)

	lastPage := math.Ceil(float64(total)/float64(limit))
	
	return c.JSON(fiber.Map{
		"data": getBlog,
		"meta": fiber.Map{
			"total": total,
			"page" : page,
			"last_page": lastPage,
		},
	})
}

func DetailPost(c *fiber.Ctx)error{
	id,_ :=strconv.Atoi(c.Params("id"))
	var blogDetail models.Blog
	database.DB.Where("id = ?", id).Preload("User").First(&blogDetail)
	return c.JSON(fiber.Map{
		"data": blogDetail,
	})
}

func UpdatePost(c *fiber.Ctx)error{

	cookie := c.Cookies("jwt")
	if cookie == "" {
		c.Status(401)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	UserID, err := util.ParseJwt(cookie)
	if err != nil {
		c.Status(401)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id,_ :=strconv.Atoi(c.Params("id"))
	var existingPost models.Blog
	if err := database.DB.First(&existingPost, id).Error; err != nil {
		c.Status(404)
		return c.JSON(fiber.Map{
			"message": "Post not found",
		})
	}

	if existingPost.UserID != UserID {
		c.Status(403)
		return c.JSON(fiber.Map{
			"message": "You are not authorized to update this post",
		})
	}

	var updatedData models.Blog
	if err := c.BodyParser(&updatedData); err != nil {
		fmt.Println("Error parsing body:", err)
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Invalid payload",
		})
	}

		updates := map[string]interface{}{
			"title":   updatedData.Title,
			"desc": updatedData.Desc,
		}

		if updatedData.Image != "" {
			updates["image"] = updatedData.Image
		}

		if err := database.DB.Model(&existingPost).Updates(updates).Error; err != nil {
			c.Status(500)
			return c.JSON(fiber.Map{
				"message": "Failed to update post",
			})
		}

		database.DB.Preload("User").First(&existingPost, id)
		return c.JSON(fiber.Map{
			"message": "Post updated successfully",
			"data": existingPost,
		})
}


func UniquePost(c *fiber.Ctx) error {
    // Ambil cookie JWT
    cookie := c.Cookies("jwt")
   	UserID, _ := util.ParseJwt(cookie)

    var blogs []models.Blog
    database.DB.Where("user_id = ?", UserID).Preload("User").Find(&blogs)
    return c.JSON(fiber.Map{
		"data": blogs,
	})
}

func DeletePost(c *fiber.Ctx) error {
	id, _:= strconv.Atoi(c.Params("id"))
	blog:= models.Blog{
		ID: uint(id),
	}
	deleteQuery := database.DB.Delete(&blog)
	if errors.Is(deleteQuery.Error, gorm.ErrRecordNotFound) {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Opss!, Post not found",
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "Post deleted successfully",
	})
}