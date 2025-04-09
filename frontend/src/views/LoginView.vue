<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" elevation="4">
      <v-card-title class="text-center pa-4 bg-blue-darken-2 text-white">
        Inicio de Sesión
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.username"
            label="Usuario"
            outlined
            prepend-inner-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="form.password"
            label="Contraseña"
            outlined
            prepend-inner-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>

          <v-btn type="submit" 
           :disabled="authStore.loading"
          
            color="blue-darken-2"
            block
            size="large"
          >
            Ingresar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    if (authStore.loading) return;  // ⏳ Evitar múltiples clics
    
    const success = await authStore.login(form.value);
    
    if (success) {
      // Debug: Estado después de login
      console.log("Estado post-login:", {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user
      });
      
      router.push("/dashboard");
    }
  } catch (error) {
    // Mostrar error específico
    alert(error.response?.data?.detail || "Error desconocido");
  }
};
</script>