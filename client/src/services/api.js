import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Kirim cookie bersama permintaan
});

// Auth Service
export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post("/login", userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

// Blog Service
export const getAllPosts = async (page = 1) => {
  const response = await api.get(`/posts?page=${page}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post("/post", postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/delete/${postId}`);
  return response.data;
};

export const getUniquePost = async () => {
  // Mengambil post yang di upload oleh si user
  const response = await api.get("/posts/unique");
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

// Image Upload Service
export const Upload = async (formData) => {
  const response = await api.post("/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default api;
