import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPost, Upload } from "../services/api";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (allowedTypes.includes(file.type)) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError("Only JPG, JPEG, PNG, and GIF files are allowed.");
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setError("File size exceeds the 2MB limit.");
        return;
      }

      setError("");
      setImageFile(file);

      // Create Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setError("No image file selected, Please choose an image.");
      return null;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await Upload(formData);
      return response.url;
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let ImageUrl = "";
      if (imageFile) {
        ImageUrl = await handleImageUpload();
        if (!ImageUrl) {
          setLoading(false);
          return;
        }
      }

      const postData = {
        title: formData.title,
        desc: formData.desc,
        image: ImageUrl,
      };

      const response = await createPost(postData);
      console.log("Post created:", response);
      alert("Post created successfully!");
      navigate("/my/posts");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post");
      if (err.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your post content here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
              </label>

              {/* File Input */}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Allowed: JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition font-medium"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
              <Link
                to="/my/posts"
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
