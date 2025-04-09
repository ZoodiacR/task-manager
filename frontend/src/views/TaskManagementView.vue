<template>
  <v-container>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Gestión de Tareas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="openDialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Filtros -->
      <v-card-text>
        <v-row dense class="align-center" style="gap: 15px; margin-bottom: -20px;">
          <v-col cols="12" md="5" style="padding: 8px;">
            <v-select
                            
              v-model="statusFilter"
              :items="statusFilterOptions"
              label="Filtrar por estado"
              clearable
              outlined
              
               
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="5" style="padding: 8px;">
            <v-select
              v-model="priorityFilter"
              :items="priorityFilterOptions"
              label="Filtrar por prioridad"
              clearable
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="filteredTasks"
        :loading="taskStore.loading"
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="statusColor(item.status)">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.priority="{ item }">
          <v-chip :color="priorityColor(item.priority)">
            {{ item.priority }}
          </v-chip>
        </template>

        <template v-slot:item.due_date="{ item }">
          {{ formatDate(item.due_date) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editTask(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteTask(item.id)" color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title class="headline">
            {{ formTitle }}
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedTask.title"
                    label="Título"
                    required
                    :rules="[v => !!v || 'Título es requerido']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedTask.description"
                    label="Descripción"
                    rows="3"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedTask.status"
                    :items="statusOptions"
                    label="Estado"
                    outlined
                    :rules="[v => !!v || 'Estado es requerido']"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedTask.priority"
                    :items="priorityOptions"
                    label="Prioridad"
                    outlined
                    :rules="[v => !!v || 'Prioridad es requerida']"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-date-picker
                    v-model="editedTask.due_date"
                    :min="minDate"
                    locale="es-ES"
                    label="Fecha límite"
                    outlined
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn 
              color="primary" 
              @click="saveTask" 
              :loading="taskStore.loading"
              :disabled="!isFormValid"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

// Filtros
const statusFilter = ref<string|null>(null)
const priorityFilter = ref<string|null>(null)

// Opciones de filtrado
const statusFilterOptions = [
  'Todas',
  'Pendiente',
  'En Progreso',
  'Completada'
]

const priorityFilterOptions = [
  'Todas',
  'Baja',
  'Media',
  'Alta'
]

// Opciones para formulario
const statusOptions = ['Pendiente', 'En Progreso', 'Completada']
const priorityOptions = ['Baja', 'Media', 'Alta']

// Tareas filtradas
const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    const filterStatus = statusFilter.value === 'Todas' ? null : statusFilter.value
    const filterPriority = priorityFilter.value === 'Todas' ? null : priorityFilter.value
    
    return (
      (!filterStatus || task.status === filterStatus) &&
      (!filterPriority || task.priority === filterPriority)
    )
  })
})

// Resto del código...
onMounted(async () => {
  await taskStore.fetchTasks()
})

const headers = [
  { text: 'Título', value: 'title', sortable: true },
  { text: 'Descripción', value: 'description', sortable: false },
  { text: 'Estado', value: 'status', sortable: false },
  { text: 'Prioridad', value: 'priority', sortable: false },
  { text: 'Fecha Límite', value: 'due_date', sortable: true },
  { text: 'Acciones', value: 'actions', sortable: false }
]

const isFormValid = computed(() => {
  return editedTask.value.title.trim() !== '' && 
         editedTask.value.status !== '' && 
         editedTask.value.priority !== ''
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

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

const dialog = ref(false)
const editedTask = ref({
  id: null,
  title: '',
  description: '',
  status: 'Pendiente',
  priority: 'Media',
  due_date: new Date().toISOString().split('T')[0]
})

const minDate = computed(() => new Date().toISOString().split('T')[0])

const formTitle = computed(() => 
  editedTask.value.id ? 'Editar Tarea' : 'Nueva Tarea'
)

const openDialog = () => {
  editedTask.value = {
    id: null,
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    due_date: new Date().toISOString().split('T')[0]
  }
  dialog.value = true
}

const editTask = (task: any) => {
  editedTask.value = { 
    ...task,
    due_date: task.due_date.split('T')[0]
  }
  dialog.value = true
}

const saveTask = async () => {
  try {
    const taskData = {
      title: editedTask.value.title.trim(),
      description: editedTask.value.description,
      status: editedTask.value.status,
      priority: editedTask.value.priority,
      due_date: editedTask.value.due_date
    }

    if (editedTask.value.id) {
      await taskStore.updateTask({ ...taskData, id: editedTask.value.id })
    } else {
      await taskStore.createTask(taskData)
    }
    
    dialog.value = false
    await taskStore.fetchTasks()
    
  } catch (error) {
    console.error('Error guardando tarea:', error)
    alert('Error al guardar: ' + error.response?.data?.detail || error.message)
  }
}

const deleteTask = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    try {
      await taskStore.deleteTask(id)
      await taskStore.fetchTasks()
    } catch (error) {
      alert('Error al eliminar: ' + error.response?.data?.detail || error.message)
    }
  }
}
</script>

