// src/components/tasks/TaskFilters.tsx - CON PROPS
import React from 'react';
import { Filter, X, Calendar, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';

// Definir tipos para las props
interface TaskFiltersProps {
  tasksHook: ReturnType<typeof import('../../hooks/useTasks').useTasks>;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ tasksHook }) => {
  const { 
    filters, 
    sortOrder,
    updateFilters, 
    resetFilters, 
    updateSortOrder,
    loadTasks 
  } = tasksHook; // Usar el hook pasado como prop

  const handleCompletedFilter = (completed: boolean | undefined) => {
    updateFilters({ ...filters, completed });
    setTimeout(() => loadTasks(), 100);
  };

  const handleDateFromChange = (dateFrom: string) => {
    updateFilters({
      ...filters,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined
    });
    setTimeout(() => loadTasks(), 100);
  };

  const handleDateToChange = (dateTo: string) => {
    updateFilters({
      ...filters,
      dateTo: dateTo ? new Date(dateTo) : undefined
    });
    setTimeout(() => loadTasks(), 100);
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  };

  const hasActiveFilters = filters.completed !== undefined || filters.dateFrom || filters.dateTo || sortOrder !== 'desc';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={
              filters.completed === undefined 
                ? 'all' 
                : filters.completed 
                  ? 'completed' 
                  : 'pending'
            }
            onChange={(e) => {
              const value = e.target.value;
              handleCompletedFilter(
                value === 'all' 
                  ? undefined 
                  : value === 'completed'
              );
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(filters.dateFrom)}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(filters.dateTo)}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort Order Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ArrowUpDown className="w-4 h-4 inline mr-1" />
            Sort Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => {
              updateSortOrder(e.target.value as 'asc' | 'desc');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Active filters: 
            {filters.completed !== undefined && (
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {filters.completed ? 'Completed' : 'Pending'}
              </span>
            )}
            {filters.dateFrom && (
              <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                From: {filters.dateFrom.toLocaleDateString()}
              </span>
            )}
            {filters.dateTo && (
              <span className="ml-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                To: {filters.dateTo.toLocaleDateString()}
              </span>
            )}
            {sortOrder !== 'desc' && (
              <span className="ml-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                Order: Oldest First
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};