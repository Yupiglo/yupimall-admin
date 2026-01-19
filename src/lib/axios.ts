import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: '/api/v1/',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let sessionPromise: Promise<any> | null = null;

axiosInstance.interceptors.request.use(async (config) => {
  if (!sessionPromise) {
    sessionPromise = getSession();
    // Allow refreshing the session promise every 10 seconds
    setTimeout(() => { sessionPromise = null; }, 10000);
  }

  const session = await sessionPromise;
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response && error.response?.status === 401) {
      console.error("Unauthorized - session may have expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
