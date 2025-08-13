import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockTask } from '../../test/utils';
import { TaskItem } from '../tasks/TaskItem';

// Mock simple del hook
vi.mock('../../hooks/useTasks', () => ({
    useTasks: () => ({
        editTask: vi.fn().mockResolvedValue({ success: true }),
        removeTask: vi.fn().mockResolvedValue({ success: true }),
    }),
}));

describe('TaskItem Component', () => {
    it('renders task information', () => {
        renderWithProviders(<TaskItem task={mockTask} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('work')).toBeInTheDocument();
    });

    it('shows completion checkbox', () => {
        renderWithProviders(<TaskItem task={mockTask} />);

        // Buscar el botón de checkbox (círculo)
        const checkbox = screen.getAllByRole('button')[0];
        expect(checkbox).toBeInTheDocument();
    });

    it('shows completed state for completed tasks', () => {
        const completedTask = { ...mockTask, completed: true };
        renderWithProviders(<TaskItem task={completedTask} />);

        const title = screen.getByText('Test Task');
        expect(title).toHaveClass('line-through');
    });

    it('can enter edit mode', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TaskItem task={mockTask} />);

        // Buscar botón de editar (segundo botón)
        const editButton = screen.getAllByRole('button')[1];
        await user.click(editButton);

        // Verificar que aparece el input de edición
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
});