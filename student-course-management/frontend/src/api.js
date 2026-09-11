import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://eduvera-backend-q6vnwmn7i-kiki-projects1.vercel.app/api";

export default API_BASE;

export const api = axios.create({
  baseURL: API_BASE,
});