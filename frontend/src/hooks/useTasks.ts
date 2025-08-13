import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { AppDispatch, RootState } from '../store/store';
import type { CreateTaskData, UpdateTaskData, TaskFilters } from '../types/task';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  setFilters, 
  clearFilters 
} from '../store/slices/taskSlice';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, filters } = useSelector((state: RootState) => state.tasks);

  // Cargar tareas manualmente
  const loadTasks = useCallback(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  // Crear tarea
  const addTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Actualizar tarea
  const editTask = useCallback(async (id: number, data: UpdateTaskData) => {
    try {
      await dispatch(updateTask({ id, data })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Eliminar tarea
  const removeTask = useCallback(async (id: number) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: TaskFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Limpiar filtros
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    tasks,
    loading,
    error,
    filters,
    addTask,
    editTask,
    removeTask,
    updateFilters,
    resetFilters,
    loadTasks,
  };
};