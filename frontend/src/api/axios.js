import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://sehat-h4to.onrender.com/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (error.response?.data?.message === "User not found") {
        window.location.href = "/deleted";
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default api;
