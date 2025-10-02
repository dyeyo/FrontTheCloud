import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Función para manejar errores de respuesta de la API.
 * Especialmente útil para errores de validación 422 de Laravel.
 */
function handleApiError(error) {
  if (error.response) {
    return Promise.reject(error.response)
  } else if (error.request) {
    return Promise.reject({
      status: 500,
      data: { message: 'No se pudo conectar al servidor. Inténtalo de nuevo.' },
    })
  } else {
    return Promise.reject({ status: 500, data: { message: 'Error desconocido de la aplicación.' } })
  }
}

export const TaskService = {
  // GET /tasks
  async getAllTasks() {
    try {
      const response = await api.get('/tasks')
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  },

  // POST /tasks
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  },

  // PATCH /tasks/{id}/toggle
  async toggleTaskStatus(taskId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`)
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  },
}

export const KeywordService = {
  // GET /keywords
  async getAllKeywords() {
    try {
      const response = await api.get('/keywords')
      return response.data
    } catch (error) {
      return handleApiError(error)
    }
  },
}
