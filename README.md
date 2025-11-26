# 📝 Go-Blog

A full-stack blog application built with **Golang (Fiber)** backend and **React** frontend.

## 🚀 Features

- ✅ User Authentication (Register & Login with JWT)
- ✅ Create, Read blog posts
- ✅ View all posts with pagination
- ✅ View user's own posts
- ✅ Image upload support
- ✅ Responsive design with Tailwind CSS
- 🚧 Edit & Delete posts (Coming soon)
- 🚧 Comment system (Coming soon)

## 🛠️ Tech Stack

### Backend

- **Language:** Golang
- **Framework:** [Fiber](https://gofiber.io/) (Express-like web framework)
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **ORM:** GORM
- **Password Hashing:** Bcrypt

### Frontend

- **Library:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Build Tool:** Create React App

## 📁 Project Structure

```
goblog/
├── server/                 # Golang backend
│   ├── controller/         # Request handlers
│   │   ├── authController.go
│   │   ├── postController.go
│   │   └── imageController.go
│   ├── database/           # Database connection
│   │   └── connect.go
│   ├── middleware/         # Auth middleware
│   │   └── middleware.go
│   ├── models/             # Database models
│   │   ├── user.go
│   │   └── blog.go
│   ├── routes/             # API routes
│   │   └── route.go
│   ├── util/               # Helper functions
│   │   └── helper.go
│   ├── uploads/            # Uploaded images
│   ├── .env                # Environment variables
│   ├── go.mod
│   └── main.go             # Entry point
│
└── client/                 # React frontend
    ├── public/
    ├── src/
    │   ├── pages/          # Page components
    │   │   ├── Home.jsx
    │   │   ├── MyPost.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── auth/
    │   │       ├── Login.jsx
    │   │       └── Register.jsx
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── components/     # Reusable components (empty for now)
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🔧 Installation & Setup

### Prerequisites

- Go 1.21+ installed
- Node.js 18+ and npm installed
- MySQL 8+ installed and running

### 1. Clone the repository

```bash
git clone https://github.com/Autofat/Go-Blog.git
cd Go-Blog
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
go mod download

# Create .env file
cat > .env << EOL
DSN="root:YOUR_PASSWORD@tcp(127.0.0.1:3306)/goblog_app?charset=utf8mb4&parseTime=True&loc=Local"
PORT="4000"
EOL

# Create database
mysql -u root -p
CREATE DATABASE goblog_app;
EXIT;

# Run backend
go run main.go
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Run frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 🌐 API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Blog Posts (Protected)

- `GET /api/posts?page=1` - Get all posts with pagination
- `GET /api/posts/:id` - Get single post by ID
- `GET /api/posts/unique` - Get user's own posts
- `POST /api/post` - Create new post
- `PUT /api/post/:id` - Update post
- `DELETE /api/post/:id` - Delete post

### Image Upload (Protected)

- `POST /api/upload-image` - Upload image

## 📸 Screenshots

### Home Page

![Home Page](screenshots/home.png)

### My Posts

![My Posts](screenshots/my-posts.png)

### Create Post

![Create Post](screenshots/create-post.png)

## 🔐 Environment Variables

### Backend (.env)

```env
DSN="root:password@tcp(127.0.0.1:3306)/goblog_app?charset=utf8mb4&parseTime=True&loc=Local"
PORT="4000"
```

## 🚦 Running Tests

```bash
# Backend tests
cd server
go test ./...

# Frontend tests
cd client
npm test
```

## 📝 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Blogs Table

```sql
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    desc TEXT,
    image VARCHAR(255),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**

- GitHub: [@Autofat](https://github.com/Autofat)

## 🙏 Acknowledgments

- [Fiber Framework](https://gofiber.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GORM](https://gorm.io/)

---

⭐ If you like this project, please give it a star on GitHub!
