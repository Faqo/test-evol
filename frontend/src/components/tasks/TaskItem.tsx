// src/components/tasks/TaskItem.tsx - CON FECHAS VISIBLES
import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit, 
  Calendar,
  Clock,
  Save,
  X 
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../common/Button';
import type { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { editTask, removeTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  // ✅ Función para formatear fecha de manera clara
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} min ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // ✅ Formatear fecha completa para tooltip
  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleToggleComplete = async () => {
    await editTask(task.id, { completed: !task.completed });
  };

  const handleEdit = async () => {
    if (editTitle.trim()) {
      const result = await editTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      if (result.success) {
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await removeTask(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task description (optional)"
          />
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEdit}
              disabled={!editTitle.trim()}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 mt-1 transition-colors duration-200 ${
            task.completed 
              ? 'text-green-600 hover:text-green-700' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {task.completed ? <CheckSquare /> : <Square />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-medium transition-all duration-200 ${
                task.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm transition-all duration-200 ${
                  task.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* ✅ FECHA VISIBLE MEJORADA */}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1" title={formatFullDate(task.createdAt)}>
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(task.createdAt)}</span>
                </div>
                
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <div className="flex items-center space-x-1" title={formatFullDate(task.updatedAt)}>
                    <Clock className="w-3 h-3" />
                    <span>Updated: {formatDate(task.updatedAt)}</span>
                  </div>
                )}

                {/* ✅ DEBUG INFO - TEMPORAL */}
                <div className="text-yellow-600 font-mono">
                  RAW: {task.createdAt.slice(11, 19)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ STATUS BADGE */}
      <div className="mt-3 flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          task.completed
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
        
        {/* ✅ ID para debugging */}
        <span className="text-xs text-gray-400 font-mono">
          ID: {task.id}
        </span>
      </div>
    </div>
  );
};