import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MyPosts from "./pages/MyPost";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DetailPost from "./pages/DetailPost";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my/posts" element={<MyPosts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<DetailPost />} />
        <Route path="/posts/update/:id" element={<EditPost />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
