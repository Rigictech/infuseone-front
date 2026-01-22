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
            // Don't redirect for OTP verification - let the component handle it
            if (error.config.url && error.config.url.includes('verify-user')) {
                return Promise.reject(error);
            }

            // Token expired or invalid
            localStorage.removeItem("authToken");
            localStorage.removeItem("role");

        }
        return Promise.reject(error);
    }
);

const formStackService = {
    index: () => apiClient.post(`admin/form-stack-url/showall`),
    store: (userData) => apiClient.post(`admin/form-stack-url/create`, userData),
    update: (id, userData) => apiClient.post(`admin/form-stack-url/update/${id}`, userData),
    delete: (id) => apiClient.post(`admin/form-stack-url/destroy/${id}`),


};

export default formStackService;
