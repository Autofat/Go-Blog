import React, { useState, useEffect } from "react";
import { getAllPosts, logout } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null); // ✅ Tambahkan state error

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null); // ✅ Reset error setiap fetch

    try {
      const response = await getAllPosts(currentPage);

      setPosts(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      // ✅ Jika error 401, redirect ke login
      if (error.response?.status === 401) {
        setError("Please login to view posts");
        setTimeout(() => {
          navigate("/login");
        }, 1500); // ✅ Delay 1.5 detik agar user bisa baca pesan
      } else {
        setError("Failed to load posts. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // ✅ Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // ✅ Tampilkan error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">📝 GoBlog</h1>
            <div className="space-x-4">
              <Link
                to="/my/posts"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                My Posts
              </Link>
              <Link
                to="/create"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* POSTS GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No posts found.</p>
            <p className="text-gray-500">Be the first to create a post!</p>
            <Link
              to="/create"
              className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={post.image || "https://via.placeholder.com/400x200"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By: {post.User?.first_name} {post.User?.last_name}
                    </span>
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
