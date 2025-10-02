<template>
  <div class="container my-5">
    <button type="button" class="btn btn-primary mb-4 shadow-sm" @click="openModal">
      + Crear Nueva Tarea
    </button>

    <h2 class="mb-4 text-white">📋 Lista de Tareas ({{ tasks.length }})</h2>
    <div v-if="tasks.length === 0 && !isLoading" class="alert alert-info">
      No hay tareas pendientes. ¡Crea una nueva!
    </div>

    <ul class="list-group scroll">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="list-group-item d-flex justify-content-between align-items-center"
        :class="{ 'bg-light': task.is_done }"
      >
        <div class="d-flex flex-column">
          <span
            class="fw-bold"
            :class="{ 'text-decoration-line-through text-muted': task.is_done }"
          >
            {{ task.title }}
          </span>
          <span :class="getDueDateClass(task)">
            {{ formatLimitDate(task.limit_date, task.is_done) }}
          </span>
          <small class="text-muted mt-1">
            <span class="badge" :class="task.is_done ? 'bg-success' : 'bg-warning text-white'">
              {{ task.is_done ? 'Completada ✅' : 'Pendiente ⏳' }}
            </span>
            <span
              v-for="keyword in task.keywords"
              :key="keyword.id"
              class="badge bg-secondary ms-2"
            >
              #{{ keyword.name }}
            </span>
          </small>
        </div>
        <button
          class="btn btn-sm"
          :class="task.is_done ? 'btn-outline-warning' : 'btn-outline-success'"
          @click="toggleTaskStatus(task.id)"
        >
          {{ task.is_done ? 'Marcar como Pendiente' : 'Marcar como Completada' }}
        </button>
      </li>
    </ul>

    <div
      class="modal fade"
      id="createTaskModal"
      tabindex="-1"
      aria-labelledby="createTaskModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="createTaskModalLabel">📝 Crear Nueva Tarea</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="resetAndCloseModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>

            <form @submit.prevent="createTask">
              <div class="mb-3">
                <label for="taskTitle" class="form-label">Título de la Tarea</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.title }"
                  id="taskTitle"
                  v-model="newTask.title"
                  placeholder="Desarrollo de inicio de sesion"
                  required
                />
                <div class="invalid-feedback" v-if="validationErrors.title">
                  {{ validationErrors.title[0] }}
                </div>
              </div>

              <div class="mb-3">
                <label for="limitDate" class="form-label">Fecha de entrega</label>
                <input
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': validationErrors.limit_date }"
                  id="limitDate"
                  v-model="newTask.limit_date"
                  :min="getMinDate()"
                  required
                />
                <div class="invalid-feedback" v-if="validationErrors.limit_date">
                  {{ validationErrors.limit_date[0] }}
                </div>
              </div>

              <div class="mb-3">
                <label for="keywordSelect" class="form-label">Palabras Clave (Opcional)</label>
                <Multiselect
                  v-model="selectedKeywords"
                  :options="availableKeywords"
                  :multiple="true"
                  track-by="id"
                  label="name"
                  placeholder="Selecciona palabras clave"
                />
              </div>

              <div class="modal-footer px-0">
                <button type="button" class="btn btn-secondary" @click="resetAndCloseModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-success" :disabled="isLoading">
                  {{ isLoading ? 'Guardando...' : 'Guardar Tarea' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskList } from './TaskList'
import Multiselect from 'vue-multiselect'
const {
  tasks,
  availableKeywords,
  newTask,
  isLoading,
  error,
  validationErrors,
  openModal,
  resetAndCloseModal,
  createTask,
  toggleTaskStatus,
  selectedKeywords,
  getMinDate,
  formatLimitDate,
  getDueDateClass,
} = useTaskList()
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
/* Estilos mínimos para Bootstrap */
.list-group-item {
  transition: all 0.3s ease;
}
.bg-light {
  border-left: 5px solid #198754; /* Verde de Bootstrap */
}
.scroll {
  overflow-x: scroll;
  height: 20em;
}
</style>
