// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/", // Django backend
//   headers: {
//     "Content-Type": "application/json",
//   }
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;


import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/", // Django backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Initialize user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // Sync user state to localStorage whenever it changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//       localStorage.removeItem("access");
//     }
//   }, [user]);

//   const loginUser = (userData, token) => {
//     localStorage.setItem("access", token); // store token
//     setUser(userData); // triggers useEffect to sync localStorage
//   };

//   const logoutUser = () => setUser(null);

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider value={{ user, loginUser, logoutUser, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => useContext(AuthContext);
