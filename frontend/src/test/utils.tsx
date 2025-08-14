import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../store/slices/taskSlice';
import type { TasksState } from '../types/task';

// Tipos para las opciones de renderizado
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<TasksState>;
}

// Store básico para tests
const createTestStore = (initialState: Partial<TasksState> = {}) => {
  return configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: {
      tasks: {
        tasks: [],
        loading: false,
        error: null,
        filters: {},
        ...initialState,
      },
    },
  });
};

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialState, ...renderOptions } = options;
  const store = createTestStore(initialState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderAppWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialState, ...renderOptions } = options;
  const store = createTestStore(initialState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data simple
export const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  tags: ['work'],
  dueDate: null,
  createdAt: '2025-08-13T15:00:00Z',
  updatedAt: '2025-08-13T15:00:00Z'
};

// Export todo de testing library
export * from '@testing-library/react';