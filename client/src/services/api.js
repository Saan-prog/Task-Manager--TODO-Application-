import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type' : 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = (userData) => api.post('users/register', userData);
export const login = (userData) => api.post('users/login', userData);

export const getTasks = () => api.get('/tasks/allPosts');
export const createTask = (taskData) => api.post('/tasks/add', taskData);
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const updateTask = (id, taskData) => api.put(`/tasks/update/${id}`, taskData);
export const updateStatus = (id, taskStatus) => api.patch(`/tasks/statusUpdate/${id}`, taskStatus);
export const removeTask = (id) => api.delete(`/tasks/remove/${id}`);

export default api;

