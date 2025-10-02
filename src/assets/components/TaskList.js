import { ref, onMounted, computed } from 'vue'
import { TaskService, KeywordService } from '../services/apiService'
import { Modal } from 'bootstrap'

export function useTaskList() {
  const tasks = ref([])
  const availableKeywords = ref([])
  const newTask = ref({ title: '', limit_date: '', keyword_ids: [] })
  const isLoading = ref(false)
  const error = ref(null)
  const validationErrors = ref({})
  const modalInstance = ref(null)

  onMounted(() => {
    fetchTasks()
    fetchKeywords()
    const modalElement = document.getElementById('createTaskModal')
    if (modalElement) {
      modalInstance.value = new Modal(modalElement)
      modalElement.addEventListener('hidden.bs.modal', resetAndClearForm)
    }
  })

  function resetAndClearForm() {
    newTask.value = { title: '', limit_date: '', keyword_ids: [] }
    validationErrors.value = {}
    error.value = null
  }

  function resetAndCloseModal() {
    if (modalInstance.value) modalInstance.value.hide()
    resetAndClearForm()
  }

  function openModal() {
    error.value = null
    validationErrors.value = {}
    if (modalInstance.value) modalInstance.value.show()
  }

  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    try {
      tasks.value = await TaskService.getAllTasks()
    } catch (err) {
      error.value = err?.data?.message || 'No se pudieron cargar las tareas desde el servidor.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchKeywords() {
    try {
      availableKeywords.value = await KeywordService.getAllKeywords()
    } catch (err) {
      console.error('Error al cargar keywords:', err)
    }
  }

  async function createTask() {
    isLoading.value = true
    error.value = null
    validationErrors.value = {}

    try {
      const payload = {
        title: newTask.value.title,
        limit_date: newTask.value.limit_date,
        keyword_ids: newTask.value.keyword_ids,
      }

      const createdTask = await TaskService.createTask(payload)
      tasks.value.unshift(createdTask)
      resetAndCloseModal()
    } catch (err) {
      if (err?.status === 422 && err?.data?.errors) {
        validationErrors.value = err.data.errors
      } else {
        console.error('Error al crear tarea:', err)
        error.value = err?.data?.message || 'Ocurrió un error al intentar crear la tarea.'
      }
    } finally {
      isLoading.value = false
    }
  }

  async function toggleTaskStatus(taskId) {
    const idx = tasks.value.findIndex((t) => t.id === taskId)
    if (idx === -1) return
    const old = tasks.value[idx].is_done
    tasks.value[idx].is_done = !old
    try {
      await TaskService.toggleTaskStatus(taskId)
    } catch (err) {
      console.error('Error al alternar estado:', err)
      error.value = err?.data?.message || 'No se pudo actualizar el estado de la tarea.'
      tasks.value[idx].is_done = old
    }
  }

  // 🔁 Mapear ids <-> objetos para el multiselect
  const selectedKeywords = computed({
    get() {
      const ids = newTask.value.keyword_ids || []
      return availableKeywords.value.filter((k) => ids.includes(k.id))
    },
    set(val) {
      newTask.value.keyword_ids = Array.isArray(val) ? val.map((k) => k.id) : []
    },
  })

  const getMinDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Formatea la fecha y determina el estado de la fecha.
  const formatLimitDate = (dateString, isDone) => {
    if (!dateString) return ''

    const limitDate = new Date(dateString)
    const today = new Date()

    // Limpiar horas para comparación solo de día
    limitDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    // Formatear la fecha para mostrar (Ej: 25/may)
    const formattedDate = limitDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    })

    if (isDone) {
      return `Finalizada`
    } else if (limitDate < today) {
      return `¡VENCIDA! (era el ${formattedDate})`
    } else if (limitDate.getTime() === today.getTime()) {
      return `Hoy 🔴`
    } else {
      return `Límite: ${formattedDate}`
    }
  }

  // Asigna la clase CSS según el estado de la fecha.
  const getDueDateClass = (task) => {
    if (task.is_done) {
      return 'text-success' // Completada
    }
    const limitDate = new Date(task.limit_date)
    const today = new Date()
    limitDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    if (limitDate < today) {
      return 'text-danger fw-bold' // Vencida
    } else if (limitDate.getTime() === today.getTime()) {
      return 'text-danger' // Hoy
    } else {
      return 'text-primary' // Futura
    }
  }

  return {
    // Estado
    tasks,
    availableKeywords,
    newTask,
    isLoading,
    error,
    validationErrors,
    selectedKeywords, // <-- úsalo en el template con v-model

    // Métodos
    openModal,
    resetAndCloseModal,
    createTask,
    toggleTaskStatus,
    getMinDate,
    formatLimitDate,
    getDueDateClass,
  }
}
