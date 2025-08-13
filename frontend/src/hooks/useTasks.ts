// src/hooks/useTasks.ts - SOLUCIÓN DEFINITIVA
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
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

// Variable global para controlar la carga inicial
let hasInitiallyLoaded = false;

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, filters } = useSelector((state: RootState) => state.tasks);
  
  // Estado para ordenamiento
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Cargar tareas del servidor
  const loadTasks = useCallback(() => {
    const serverFilters = {
      completed: filters.completed,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };
    dispatch(fetchTasks(serverFilters));
  }, [dispatch, filters.completed, filters.dateFrom, filters.dateTo]);

  // Auto-cargar usando useMemo (se ejecuta solo cuando cambian las dependencias)
  useMemo(() => {
    if (!hasInitiallyLoaded) {
      console.log('🔵 Initial load with useMemo - ONCE ONLY');
      hasInitiallyLoaded = true;
      dispatch(fetchTasks({}));
    }
  }, []); // ✅ Array vacío = solo se ejecuta una vez

  // Tareas ordenadas localmente 
  const sortedTasks = useMemo(() => {

    if (tasks.length === 0) {
      console.log('🔄 No tasks to sort');
      return [];
    }
    
    const sorted = [...tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        console.warn('Invalid date found in tasks:', { a: a.createdAt, b: b.createdAt });
        return 0;
      }
      
      const timeA = dateA.getTime();
      const timeB = dateB.getTime();
      const result = sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      
      return result;
    });

    return sorted;
  }, [tasks, sortOrder]);

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
    setSortOrder('desc');
  }, [dispatch]);

  // ✅ Función para cambiar orden - CON DEBUG
  const updateSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, [sortOrder]);

  return {
    tasks: sortedTasks,
    rawTasks: tasks,
    loading,
    error,
    filters,
    sortOrder,
    addTask,
    editTask,
    removeTask,
    updateFilters,
    resetFilters,
    updateSortOrder,
    loadTasks,
  };
};