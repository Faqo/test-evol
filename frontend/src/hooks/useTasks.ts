import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState, useRef } from 'react';
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

  // Referencias estables para optimización
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const sortOrderRef = useRef(sortOrder);
  sortOrderRef.current = sortOrder;

  // Auto-cargar tareas inicial
  useMemo(() => {
    if (!hasInitiallyLoaded) {
      hasInitiallyLoaded = true;
      dispatch(fetchTasks({}));
    }
  }, [dispatch]);

  // Dependencias primitivas para optimización
  const completedFilter = filters.completed;
  const dateFromTimestamp = filters.dateFrom?.getTime();
  const dateToTimestamp = filters.dateTo?.getTime();
  const tasksLength = tasks.length;

  // Filtrado y ordenamiento optimizado
  const sortedAndFilteredTasks = useMemo(() => {
    if (tasksLength === 0) {
      return [];
    }

    let filteredTasks = [...tasks];

    // Filtro por estado completado
    if (completedFilter !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.completed === completedFilter);
    }

    // Filtro por fecha de vencimiento - desde
    if (dateFromTimestamp) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDateTimestamp = new Date(task.dueDate).getTime();
        return dueDateTimestamp >= dateFromTimestamp;
      });
    }

    // Filtro por fecha de vencimiento - hasta
    if (dateToTimestamp) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDateTimestamp = new Date(task.dueDate).getTime();
        return dueDateTimestamp <= dateToTimestamp;
      });
    }

    // Ordenamiento por fecha de vencimiento o creación
    const sorted = filteredTasks.sort((a, b) => {
      const getDateForSorting = (task: any) => {
        return task.dueDate ? new Date(task.dueDate).getTime() : new Date(task.createdAt).getTime();
      };

      const timeA = getDateForSorting(a);
      const timeB = getDateForSorting(b);

      if (isNaN(timeA) || isNaN(timeB)) {
        return 0;
      }

      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  }, [
    tasksLength,
    sortOrder,
    completedFilter,
    dateFromTimestamp,
    dateToTimestamp,
    tasks
  ]);

  // Funciones de gestión de tareas
  const loadTasks = useCallback(() => {
    dispatch(fetchTasks(filtersRef.current));
  }, [dispatch]);

  const loadTasksWithFilters = useCallback((customFilters: any) => {
    dispatch(fetchTasks(customFilters));
  }, [dispatch]);

  const addTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const editTask = useCallback(async (id: number, data: UpdateTaskData) => {
    try {
      await dispatch(updateTask({ id, data })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const removeTask = useCallback(async (id: number) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: TaskFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
    setSortOrder('desc');
  }, [dispatch]);

  const updateSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, []);

  // Métricas estadísticas
  const stats = useMemo(() => {
    const tasksWithDueDate = tasks.filter(t => t.dueDate);
    const overdueTasks = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    );

    return {
      total: tasksLength,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      filtered: sortedAndFilteredTasks.length,
      withDueDate: tasksWithDueDate.length,
      withoutDueDate: tasks.length - tasksWithDueDate.length,
      overdue: overdueTasks.length,
      hasActiveFilters: completedFilter !== undefined ||
        !!dateFromTimestamp ||
        !!dateToTimestamp ||
        sortOrder !== 'desc'
    };
  }, [tasksLength, tasks, sortedAndFilteredTasks.length, completedFilter, dateFromTimestamp, dateToTimestamp, sortOrder]);

  return {
    // Data
    tasks: sortedAndFilteredTasks,
    rawTasks: tasks,
    loading,
    error,
    filters,
    sortOrder,
    stats,

    // Actions
    addTask,
    editTask,
    removeTask,
    updateFilters,
    resetFilters,
    updateSortOrder,
    loadTasks,
    loadTasksWithFilters,

    // Helper data
    tasksCount: sortedAndFilteredTasks.length
  };
};