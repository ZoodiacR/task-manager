import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/tasks'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  const login = async (credentials: { username: string; password: string }) => {
  try {
    loading.value = true;
    const response = await api.login(credentials);

    // Debug: Verificar respuesta completa
    console.log('Respuesta completa del login:', response);

    if (response.data?.access) {
      localStorage.setItem('access', response.data.access);
      isAuthenticated.value = true;

      // Debug: Verificar token almacenado
      console.log('Token almacenado:', localStorage.getItem('access'));

      await fetchUser();
      return true; // Indica éxito
    }
    return false;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  } finally {
    loading.value = false;
  }
};


const fetchUser = async () => {
  try {
    const response = await api.getCurrentUser();
    user.value = response.data;
    isAuthenticated.value = true;  // ← Establecer autenticación
  } catch (error) {
    console.error("Error:", error.response?.data);
    logout();
  }
};

  const logout = () => {
    localStorage.removeItem('access')
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    fetchUser
  }
})