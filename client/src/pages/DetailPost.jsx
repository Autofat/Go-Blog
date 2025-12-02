import { use, useEffect, useState } from "react";
import { deletePost, getPostById } from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, getCurrentUserId } from "../utils/auth";

const DetailPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPostById(id);

      if (response.data) {
        setPost(response.data);
      } else if (response.id) {
        setPost(response);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setError("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setIsDeleting(true);

    try {
      await deletePost(id);
      alert("Post deleted successfully");
      navigate("/my/posts");
    } catch (error) {
      alert("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Cek apakah user adalah pemilik post
  const currentUserId = localStorage.getItem("user_id"); // Atau dari context
  const postUserId = post.user_id.toString();
  const isOwner = postUserId === currentUserId;

  // console.log("User Id", currentUserId);
  // console.log("Post User Id", postUserId);
  // console.log("Is Owner", isOwner);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image */}
          {post.image && (
            <div className="relative h-96 bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400/EEE/999?text=No+Image";
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {post.User?.FirstName?.[0] ||
                    post.User?.first_name?.[0] ||
                    "?"}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">
                    {post.User?.FirstName || post.User?.first_name}{" "}
                    {post.User?.LastName || post.User?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.User?.Email || post.User?.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons (hanya untuk owner) */}
              {isOwner && (
                <div className="flex space-x-4">
                  <Link
                    to={`/posts/update/${post.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.desc}
              </p>
            </div>
          </div>
        </article>

        {/* Related Posts or Comments Section (Optional) */}
        <div className="mt-8">
          <Link
            to="/my/posts"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View My Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
