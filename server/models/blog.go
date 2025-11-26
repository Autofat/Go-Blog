package models

type Blog struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	UserID string `json:"user_id" gorm:"not null"`       // ✅ Ubah ke uint
	User   User   `json:"User" gorm:"foreignKey:UserID"` // ✅ Tambahkan json tag
	Title  string `json:"title"`
	Desc   string `json:"desc"`
	Image  string `json:"image"`
}