<template>
    <v-app-bar app color="blue-darken-2" dark>
      <v-app-bar-title>Task Manager</v-app-bar-title>
  
      <v-spacer></v-spacer>
  
      <!-- Menú de navegación -->
      <v-btn text to="/dashboard">Dashboard</v-btn>
      <v-btn text to="/tasks">Gestión de Tareas</v-btn>
  
      <!-- Menú de usuario -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mx-2">
                <v-icon color="white" size="30">mdi-account-circle
                    {{ userInitials }}
                </v-icon>
              
           
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.user?.username }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/authStore'
  import { computed } from 'vue'
  
  const authStore = useAuthStore()
  
  const userInitials = computed(() => {
    return authStore.user?.username?.slice(0, 2).toUpperCase() || 'US'
  })
  
  const logout = () => {
    authStore.logout()
    window.location.href = '/login'
  }
  </script>