import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import { TaskItem } from '../tasks/TaskItem';

// Mock simple del hook
vi.mock('../../hooks/useTasks', () => ({
    useTasks: () => ({
        editTask: vi.fn(),
        removeTask: vi.fn(),
    }),
}));

describe('TaskItem Component', () => {
    const simpleTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        tags: [],
        dueDate: null,
        createdAt: '2025-08-13T15:00:00Z',
        updatedAt: '2025-08-13T15:00:00Z'
    };

    it('renders task title and description', () => {
        renderWithProviders(<TaskItem task={simpleTask} />);
        
        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('shows pending status for incomplete tasks', () => {
        renderWithProviders(<TaskItem task={simpleTask} />);
        
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('shows completed status for completed tasks', () => {
        const completedTask = { ...simpleTask, completed: true };
        renderWithProviders(<TaskItem task={completedTask} />);
        
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('can enter edit mode when edit button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TaskItem task={simpleTask} />);

        // Los botones son: [0] = checkbox, [1] = edit, [2] = delete
        const buttons = screen.getAllByRole('button');
        const editButton = buttons[1]; // Segundo botón es el de editar
        
        await user.click(editButton);

        // Verificar que aparece el formulario de edición
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });
});