import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderAppWithProviders } from '../test/utils';
import App from '../App';

// Mock del hook useTasks para evitar llamadas HTTP
vi.mock('../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    loading: false,
    error: null,
    filters: {},
    addTask: vi.fn(),
    editTask: vi.fn(),
    removeTask: vi.fn(),
    updateFilters: vi.fn(),
    resetFilters: vi.fn(),
    loadTasks: vi.fn(),
  }),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    renderAppWithProviders(<App />);
    // Si llega aquí, la app se renderizó correctamente
    expect(document.body).toBeDefined();
  });

  it('shows the main navigation', () => {
    renderAppWithProviders(<App />);
    expect(screen.getByText('Todo Manager')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('shows the task form', () => {
    renderAppWithProviders(<App />);
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('shows the filters section', () => {
    renderAppWithProviders(<App />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
});