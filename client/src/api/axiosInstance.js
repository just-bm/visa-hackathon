import axios from "axios";

const NODE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AI_BASE_URL = import.meta.env.VITE_AI_URL || "http://localhost:8000";

export const nodeInstance = axios.create({
  baseURL: NODE_BASE_URL,
  withCredentials: true,
});

export const aiInstance = axios.create({
  baseURL: AI_BASE_URL,
});