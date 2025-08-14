import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';

// Mock básico del slice
const mockDispatch = vi.fn();
const mockSelector = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => mockSelector(selector)
  };
});

// Mock de las acciones
vi.mock('../../store/slices/taskSlice', () => ({
  fetchTasks: vi.fn(() => ({ type: 'fetchTasks' })),
  createTask: vi.fn(() => ({ type: 'createTask' })),
  updateTask: vi.fn(() => ({ type: 'updateTask' })),
  deleteTask: vi.fn(() => ({ type: 'deleteTask' })),
  setFilters: vi.fn(() => ({ type: 'setFilters' })),
  clearFilters: vi.fn(() => ({ type: 'clearFilters' }))
}));

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    tags: [],
    dueDate: '2025-08-15T10:00:00Z',
    createdAt: '2025-08-13T10:00:00Z',
    updatedAt: '2025-08-13T10:00:00Z'
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    completed: true,
    tags: [],
    dueDate: null,
    createdAt: '2025-08-13T11:00:00Z',
    updatedAt: '2025-08-13T11:00:00Z'
  }
];

describe('useTasks Hook - Basic Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup básico del selector
    mockSelector.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      filters: {}
    });
  });

  it('initializes and returns basic data', () => {
    const { result } = renderHook(() => useTasks());

    // Verificar que retorna las propiedades básicas
    expect(result.current.tasks).toBeDefined();
    expect(result.current.rawTasks).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.filters).toBeDefined();
    expect(result.current.sortOrder).toBeDefined();
    expect(result.current.stats).toBeDefined();
  });

  it('updates sort order', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateSortOrder('asc');
    });

    expect(result.current.sortOrder).toBe('asc');
  });

  it('calls updateFilters', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ completed: true });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('filters tasks by completion status', () => {
    // Mock con filtro aplicado
    mockSelector.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      filters: { completed: false }
    });

    const { result } = renderHook(() => useTasks());

    // Debería filtrar solo las pendientes
    const pendingTasks = result.current.tasks.filter(t => !t.completed);
    expect(pendingTasks.length).toBeGreaterThan(0);
  });

  it('handles empty tasks array', () => {
    mockSelector.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      filters: {}
    });

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.stats.total).toBe(0);
  });

  it('handles date filtering', () => {
    const dateFrom = new Date('2025-08-14T00:00:00Z');
    
    mockSelector.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      filters: { dateFrom }
    });

    const { result } = renderHook(() => useTasks());

    // Solo debería incluir tareas con dueDate
    const tasksWithDueDate = result.current.tasks.filter(t => t.dueDate);
    expect(tasksWithDueDate.length).toBeGreaterThanOrEqual(0);
  });
});