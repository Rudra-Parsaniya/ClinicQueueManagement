import axios from "axios";

const API_BASE_URL = "https://cmsback.sampaarsh.cloud";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("cms_token");
      localStorage.removeItem("cms_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

