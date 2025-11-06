import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_API || "http://localhost:4000";
const axiosPublic = axios.create({
  baseURL: `${API_BASE}`,
  withCredentials: true, // so refresh cookie is sent
});

export default axiosPublic;
