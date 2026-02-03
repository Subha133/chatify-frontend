// import axios from "axios";

// export const axiosInstance = 
//     axios.create({
//        baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
//        withCredentials: true,
//     })
// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatify-backend-8enc.onrender.com",
  withCredentials: true,
});

