import axios from "axios";

// Use the same host as the frontend. This keeps the app working on both
// localhost and other devices on the same LAN (for example a mobile phone).
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default API_BASE;
export const api = axios.create({ baseURL: API_BASE });
