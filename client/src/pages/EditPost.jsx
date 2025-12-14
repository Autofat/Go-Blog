import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, Upload } from "../services/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPostById(id);
      const post = response.data || response;

      const currentUserId = localStorage.getItem("user_id");
      const postUserId = post.user_id?.toString();

      if (!currentUserId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (postUserId !== currentUserId) {
        alert("You can only edit your own posts!");
        navigate(`/posts/${id}`); // Redirect to detail page
        return;
      }

      setFormData({
        title: post.title || "",
        desc: post.desc || "",
      });
      setCurrentImage(post.image || "");
    } catch (error) {
      console.error("Failed to fetch post:", error);

      if (error.response?.status === 401) {
        alert("Please login to edit the post");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to edit this post");
        navigate("/my/posts");
      } else {
        setError("Failed to load post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);
    setError("");

    try {
      let imageUrl = currentImage;
      if (imageFile) {
        const uploadedUrl = await handleImageUpload();
        if (!uploadedUrl) {
          setSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }
      const updatedData = {
        title: formData.title,
        desc: formData.desc,
        image: imageUrl,
      };
      await updatePost(id, updatedData);
      alert("Post updated successfully");
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      setError("Failed to update post. Please try again.");
      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You can only edit your own posts");
        navigate("/my/posts");
      } else {
        setError("Failed to load post");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/posts/${id}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Post
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Image
              </label>

              {/* Current Image */}
              {currentImage && !imagePreview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={currentImage}
                    alt="Current"
                    className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x400/EEE/999?text=Image+Not+Found";
                    }}
                  />
                </div>
              )}

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
                  Allowed: JPEG, PNG, GIF (Max 2MB) - Leave empty to keep
                  current image
                </p>
              </div>

              {/* New Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Image Preview:
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
                    Remove New Image
                  </button>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition font-medium"
              >
                {uploading
                  ? "Uploading Image..."
                  : submitting
                  ? "Updating..."
                  : "Update Post"}
              </button>
              <Link
                to={`/posts/${id}`}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition font-medium text-center flex items-center justify-center"
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

export default EditPost;
