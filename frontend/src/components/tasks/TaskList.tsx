import React from 'react';
import { CheckSquare } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const TaskList: React.FC = () => {
    const { tasks, loading, error } = useTasks();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" text="Loading tasks..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Error loading tasks
                        </h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Create your first task to get started, or adjust your filters to see more results.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}

            {/* Task Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Total: {tasks.length} tasks</span>
                    <span>
                        Completed: {tasks.filter(task => task.completed).length} |
                        Pending: {tasks.filter(task => !task.completed).length}
                    </span>
                </div>
            </div>
        </div>
    );
};