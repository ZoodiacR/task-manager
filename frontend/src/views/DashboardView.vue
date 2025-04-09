<template>
  <v-container>
    <v-row>
      <!-- Estadísticas -->
      <v-col cols="12" md="4" v-for="(stat, i) in stats" :key="i">
        <v-card :color="stat.color" dark>
          <v-card-title class="text-h5">{{ stat.value }}</v-card-title>
          <v-card-subtitle>{{ stat.title }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Gráfico -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Distribución de Tareas</v-card-title>
          <v-card-text>
            <DoughnutChart 
              :chart-data="chartData"
              :options="chartOptions"
              style="height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Tareas próximas -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Tareas Próximas</v-card-title>
          <v-list v-if="!taskStore.loading">
            <v-list-item 
              v-for="task in upcomingTasks" 
              :key="task.id"
              :class="{ 'bg-red-lighten-4': isTaskOverdue(task) }"
            >
              <template #prepend>
                <v-icon :color="statusColor(task.status)">mdi-circle</v-icon>
              </template>
              
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(task.due_date) }}
                <v-chip small :color="priorityColor(task.priority)" class="ml-2">
                  {{ getPriorityText(task.priority) }}
                </v-chip>
              </v-list-item-subtitle>

              <template #append>
                <v-btn 
                  v-if="task.status !== 'CO'"
                  color="success" 
                  size="small"
                  @click="markComplete(task.id)"
                  :loading="taskStore.loading"
                >
                  <v-icon>mdi-check</v-icon>
                  Completar
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-progress-linear v-else indeterminate color="primary"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { useTaskStore } from '@/stores/taskStore'

Chart.register(...registerables)

const taskStore = useTaskStore()

// Carga inicial
onMounted(async () => {
  await taskStore.fetchTasks()
})

// Mapeos
const statusMap = {
  'Pendiente': 'Pendiente',
  'En Progreso': 'En Progreso',
  'Completada': 'Completada'
}

const priorityMap = {
  'Baja': 'Baja',
  'Media': 'Media',
  'Alta': 'Alta'
}

// Helpers
const getStatusText = (value: string) => statusMap[value] || value
const getPriorityText = (value: string) => priorityMap[value] || value

// Estadísticas
const stats = computed(() => [
  {
    title: 'Pendientes',
    value: taskStore.stats.pending,
    color: 'orange'
  },
  {
    title: 'En Progreso',
    value: taskStore.stats.inProgress,
    color: 'blue'
  },
  {
    title: 'Completadas',
    value: taskStore.stats.completed,
    color: 'green'
  }
])

// Gráfico
const chartData = computed(() => ({
  labels: ['Completadas', 'Pendientes', 'En Progreso'],
  datasets: [{
    data: [
      taskStore.stats.completed,
      taskStore.stats.pending,
      taskStore.stats.inProgress
    ],
    backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
    hoverOffset: 4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Tareas próximas
const upcomingTasks = computed(() => {
  return taskStore.tasks
    .filter(task => task.status !== 'Completada')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5)
})

const isTaskOverdue = (task: any) => {
  return new Date(task.due_date) < new Date() && task.status !== 'CO'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Colores
const statusColor = (status: string) => ({
  'Pendiente': 'orange',
  'En Progreso': 'blue',
  'Completada': 'green'
}[status])

const priorityColor = (priority: string) => ({
  'Baja': 'green',
  'Media': 'orange',
  'Alta': 'red'
}[priority])

// Acciones
const markComplete = async (taskId: number) => {
  await taskStore.updateTaskStatus(taskId, 'Completada')
  await taskStore.fetchTasks() // Actualizar datos
}
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
  height: 100%;
}
</style>