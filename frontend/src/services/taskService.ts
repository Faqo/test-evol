import axios from 'axios';
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '../types/task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const taskService = {
  // GET /api/tasks con filtros en body
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const response = await api.get('/tasks', {
      data: filters || {} // Envía filtros en el body del GET
    });
    return response.data;
  },

  // POST /api/tasks
  async createTask(taskData: CreateTaskData): Promise<Task> {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // GET /api/tasks/:id
  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // PUT /api/tasks/:id
  async updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // DELETE /api/tasks/:id
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  // GET /api/tags
  async getTags(): Promise<string[]> {
    const response = await api.get('/tags');
    return response.data;
  },
};