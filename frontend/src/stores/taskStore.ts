import { defineStore } from 'pinia'
import api from '@/api/tasks'

interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  created_at: string
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    stats: {
      pending: 0,
      inProgress: 0,
      completed: 0
    },
    loading: false
  }),

  actions: {
   // En la acción fetchTasks:
async fetchTasks() {
  this.loading = true
  try {
    const response = await api.get('/tasks/tasks/')
    this.tasks = response.data.map((task: Task) => ({
      ...task,
      // Convertir fecha a formato ISO sin hora
      due_date: task.due_date.split('T')[0],
      created_at: new Date(task.created_at).toLocaleString()
    }))
    this.calculateStats()
  } catch (error) {
    console.error("Error fetching tasks:", error)
  } finally {
    this.loading = false
  }
},

    calculateStats() {
      this.stats = {
        pending: this.tasks.filter(t => t.status === 'Pendiente').length,
        inProgress: this.tasks.filter(t => t.status === 'En Progreso').length,
        completed: this.tasks.filter(t => t.status === 'Completada').length
      }
    },

    async updateTaskStatus(id: number, status: string) {
      this.loading = true
      try {
        await api.patch(`/tasks/tasks/${id}/`, { status })
        await this.fetchTasks() // Recargar datos
      } catch (error) {
        console.error("Error updating status:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData: Omit<Task, 'id'>) {
      this.loading = true
      try {
        const response = await api.post('/tasks/tasks/', {
          ...taskData,
          due_date: new Date(taskData.due_date).toISOString().split('T')[0]
        })
        await this.fetchTasks() // Recargar datos
        return response.data
      } catch (error) {
        console.error("Error creating task:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(updatedTask: Task) {
      this.loading = true
      try {
        const response = await api.put(`/tasks/tasks/${updatedTask.id}/`, {
          ...updatedTask,
          due_date: new Date(updatedTask.due_date).toISOString().split('T')[0]
        })
        await this.fetchTasks() // Recargar datos
        return response.data
      } catch (error) {
        console.error("Error updating task:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id: number) {
      this.loading = true
      try {
        await api.delete(`/tasks/tasks/${id}/`)
        await this.fetchTasks() // Recargar datos
      } catch (error) {
        console.error("Error deleting task:", error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})