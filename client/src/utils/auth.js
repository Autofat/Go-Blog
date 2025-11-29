import { jwtDecode } from "jwt-decode";

/**
 * Get JWT token from cookie
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  try {
    const cookies = document.cookie.split(";");
    const jwtCookie = cookies.find((c) => c.trim().startsWith("jwt="));

    if (!jwtCookie) return null;

    const token = jwtCookie.split("=")[1];
    return token || null;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

/**
 * Get current user ID from JWT cookie
 * @returns {string|null} User ID or null if not authenticated
 */
export const getCurrentUserId = () => {
  try {
    const token = getToken();
    if (!token) {
      console.log("No JWT token found");
      return null;
    }

    // Decode JWT
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded);

    // Backend menggunakan "sub" sebagai user ID
    return decoded.sub || decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    // Check if token expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

/**
 * Get current user info from JWT
 * @returns {object|null} User info or null
 */
export const getCurrentUser = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      id: decoded.sub || decoded.userId || decoded.id,
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch (error) {
    console.error("Failed to get user info:", error);
    return null;
  }
};

/**
 * Clear authentication (untuk logout di frontend)
 */
export const clearAuth = () => {
  // Cookie akan dihapus oleh backend saat logout
  // Tapi kita bisa paksa clear di frontend juga
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear localStorage jika ada data lain
  localStorage.removeItem("user_id");
};
