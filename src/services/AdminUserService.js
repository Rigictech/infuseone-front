import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_LARAVEL_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");

    }
    return Promise.reject(error);
  }
);

const AdminUserService = {
  index: (userData) => apiClient.post(`admin/user/showall`, userData),
  store: (userData) => apiClient.post(`admin/user/create`, userData),
  destroy: (id) => apiClient.post(`admin/user/destroy/${id}`),
  update: (id, userData) => apiClient.post(`admin/user/update/${id}`, userData),
  login: (credentials) => apiClient.post(`admin/login`, credentials),

};

export default AdminUserService;