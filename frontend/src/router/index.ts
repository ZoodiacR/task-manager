import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard', // ← Nombre debe coincidir
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TaskManagementView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Forzar actualización del estado
  if (!authStore.isAuthenticated && localStorage.getItem("access")) {
    await authStore.fetchUser();
  }

  console.log("[Router Guard] Estado actual:", {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: localStorage.getItem("access")
  });

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }
});

export default router