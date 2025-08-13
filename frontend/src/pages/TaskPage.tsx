import React, { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/forms/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';

export const TasksPage: React.FC = () => {
  const { loadTasks } = useTasks();

  // Cargar tareas SOLO al montar el componente
  useEffect(() => {
    loadTasks();
  }, []); // Array vacío - solo se ejecuta UNA vez

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TaskForm />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <TaskFilters />
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};