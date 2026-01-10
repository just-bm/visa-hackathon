import axios from "axios";

const BASE_URL = " https://visa-hackathon-in3q.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
