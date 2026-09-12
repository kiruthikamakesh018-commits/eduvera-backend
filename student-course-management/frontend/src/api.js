import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://eduvera-backend-t7ih.onrender.com/api";

export default API_BASE;

export const api = axios.create({
  baseURL: API_BASE,
});