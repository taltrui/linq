import axios from "axios";
import { toastError } from "./toast";
import { router } from "./router";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isHandlingUnauthorized = false;

export const resetUnauthorizedHandler = () => {
  isHandlingUnauthorized = false;
};

interface ApiError {
  response?: {
    status?: number;
    data?: {
      code?: string;
    };
  };
}

const handleUnauthorized = (error: ApiError) => {
  if (
    error.response?.status === 401 &&
    error.response?.data?.code === "TOKEN_INVALID_OR_EXPIRED"
  ) {
    if (isHandlingUnauthorized) {
      return;
    }
    isHandlingUnauthorized = true;
    localStorage.removeItem("auth_token");
    toastError("Your session has expired. Please log in again.");
    throw router.navigate({
      to: "/",
      search: {
        redirect: location.href,
      },
    });
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    handleUnauthorized(error);
    return Promise.reject(error);
  }
);
