# 📝 Task Manager App - Frontend (Vue 3 + Vite)

Este documento describe la configuración y ejecución del frontend de la aplicación Task Manager, implementado en **Vue 3 con Vite**.

---

## 🌟 Stack Tecnológico - Frontend

- **Framework:** Vue 3 + Vite
- **Arquitectura:** Composition API (`<script setup>`), Custom Composables  
- **UI/UX:** Bootstrap 5 (estilos base, modals, fechas inteligentes)  
- **Select Avanzado:** @vueform/multiselect para keywords con búsqueda y tags

---

## ⚙️ Requisitos del Sistema (Frontend)

- **Node.js:** 18.x  
- **npm:** Última versión estable

---

## 🚀 Configuración y Ejecución del Frontend

### 1. Acceder al Proyecto

```bash
cd ../task-manager-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL de la API

Crear `.env.local` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:  
👉 `http://localhost:5173`

---

## 🛠️ Arquitectura del Código

| Archivo | Rol |
|---------|-----|
| `src/composables/useTaskList.js` | Contiene el estado, lógica de API (`createTask`), formateo de fechas y helpers |
| `src/components/TaskList.vue` | UI con `<template>`, modal, botones. Usa `useTaskList()` para lógica |

---

## 💡 Detalles de Funcionalidad

- **Fechas Límite Inteligentes:** Formato dinámico de `limit_date` (VENCIDA, Hoy 🔴, etc.)  
- **Restricción de Input:** `getMinDate()` limita el calendario a hoy en adelante  
- **Selección de Keywords:** `<Multiselect>` en modo tags para relación Many-to-Many  
