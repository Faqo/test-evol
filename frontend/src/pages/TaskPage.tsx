import React, { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/forms/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';

export const TasksPage: React.FC = () => {
  // UN SOLO HOOK para toda la página
  const tasksHook = useTasks();

  // Cargar tareas SOLO al montar el componente
  useEffect(() => {
    tasksHook.loadTasks();
  }, [tasksHook.loadTasks]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* TaskForm usa su propio hook (no necesita ordenamiento) */}
              <TaskForm />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Pasar el hook como prop */}
            <TaskFilters tasksHook={tasksHook} />
            <TaskList tasksHook={tasksHook} />
          </div>
        </div>
      </div>
    </div>
  );
};