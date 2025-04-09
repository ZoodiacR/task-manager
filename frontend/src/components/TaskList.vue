<!-- frontend/src/components/TaskList.vue -->
<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            label="Filtrar por estado"
            clearable
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-list>
      <v-list-item v-for="task in filteredTasks" :key="task.id">
        <v-list-item-title>{{ task.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>
        <template #append>
          <v-chip :color="statusColor(task.status)">{{ task.status }}</v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
taskStore.fetchTasks()

const statusOptions = ['Pendiente', 'En Progreso', 'Completada']
const filters = ref({
  status: '',
  priority: ''
})

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    return (
      (!filters.value.status || task.status === filters.value.status) &&
      (!filters.value.priority || task.priority === filters.value.priority)
    )
  })
})

const statusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'Pendiente': 'warning',
    'En Progreso': 'info',
    'Completada': 'success'
  }
  return colors[status]
}
</script>