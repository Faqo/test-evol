import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, Tag, Save, X } from 'lucide-react';
import type { Task } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { Button } from '../common/Button';

interface TaskItemProps {
    task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { editTask, removeTask } = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleToggleComplete = async () => {
        const result = await editTask(task.id, {
            completed: !task.completed
        });

        if (result.success) {
            console.log(task.completed ? 'Task marked as pending' : 'Task completed!');
        } else {
            console.error('Failed to update task');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const result = await removeTask(task.id);

            if (result.success) {
                console.log('Task deleted successfully');
            } else {
                console.error('Failed to delete task');
            }
        }
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) {
            console.error('Title cannot be empty');
            return;
        }

        const result = await editTask(task.id, {
            title: editTitle,
            description: editDescription,
        });

        if (result.success) {
            setIsEditing(false);
            console.log('Task updated successfully');
        } else {
            console.error('Failed to update task');
        }
    };

    const handleCancelEdit = () => {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setIsEditing(false);
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <div
            className={`bg-white rounded-lg shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${task.completed
                ? 'border-green-500 bg-green-50/30'
                : isOverdue
                    ? 'border-red-500 bg-red-50/30'
                    : 'border-blue-500'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                    {/* Checkbox */}
                    <button
                        onClick={handleToggleComplete}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                            }`}
                    >
                        {task.completed && <Check className="w-4 h-4" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Task title"
                                />
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Task description"
                                />
                                <div className="flex space-x-2">
                                    <Button size="sm" onClick={handleSaveEdit}>
                                        <Save className="w-4 h-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className={`text-lg font-medium break-words ${task.completed
                                    ? 'line-through text-gray-500'
                                    : 'text-gray-900'
                                    }`}>
                                    {task.title}
                                </h3>

                                {task.description && (
                                    <p className={`mt-1 text-gray-600 break-words ${task.completed ? 'line-through' : ''
                                        }`}>
                                        {task.description}
                                    </p>
                                )}
                            </>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {task.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                            {task.dueDate && (
                                <div className={`flex items-center ${isOverdue ? 'text-red-500 font-medium' : ''
                                    }`}>
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <span>Created: {formatDate(task.createdAt)}</span>
                            </div>
                            {task.updatedAt !== task.createdAt && (
                                <div className="flex items-center">
                                    <span>Updated: {formatDate(task.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!isEditing && (
                    <div className="flex space-x-2 ml-4">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};