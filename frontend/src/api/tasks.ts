import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  login(credentials: { username: string; password: string }) {
    return api.post('/token/', credentials)
  },
  get(url: string) {
    return api.get(url)
  },
  post(url: string, data: any) {
    return api.post(url, data)
  },
   getCurrentUser() {
    return api.get("/tasks/user/");
  },

  createTask(taskData: any) {
    return api.post('/tasks/tasks/', taskData)
  },
  put(url: string, data: any) {
    return api.put(url, data)
  },
  patch(url: string, data: any) {
    return api.patch(url, data)
  },
  delete(url: string) {
    return api.delete(url)
  },

}