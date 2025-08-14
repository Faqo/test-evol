// src/components/tasks/TaskFilters.tsx - PRODUCTION CLEAN VERSION
import React, { memo, useCallback } from 'react';
import { Filter, X, Calendar, ArrowUpDown, BarChart3 } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskFiltersProps {
  tasksHook: ReturnType<typeof import('../../hooks/useTasks').useTasks>;
}

export const TaskFilters: React.FC<TaskFiltersProps> = memo(({ tasksHook }) => {
  const { 
    filters, 
    sortOrder,
    stats,
    updateFilters, 
    resetFilters, 
    updateSortOrder  
  } = tasksHook;

  const handleCompletedFilter = useCallback((completed: boolean | undefined) => {
    const newFilters = { ...filters, completed };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  const handleDateFromChange = useCallback((dateFrom: string) => {
    const newFilters = {
      ...filters,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined
    };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  const handleDateToChange = useCallback((dateTo: string) => {
    const newFilters = {
      ...filters,
      dateTo: dateTo ? new Date(dateTo) : undefined
    };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  const handleSortOrderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSortOrder(e.target.value as 'asc' | 'desc');
  }, [updateSortOrder]);

  const formatDateForInput = useCallback((date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  }, []);

  const hasActiveFilters = stats?.hasActiveFilters ?? false;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">
            Filters
            {stats && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({stats.filtered} of {stats.total})
              </span>
            )}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {stats && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {stats.completed}✓
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                {stats.pending}⏳
              </span>
              {stats.overdue > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                  {stats.overdue}🚨
                </span>
              )}
            </div>
          )}
          
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
            {stats && (
              <span className="ml-1 text-xs text-gray-500">
                ({stats.completed}✓ / {stats.pending}⏳)
              </span>
            )}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Tasks ({stats?.total || 0})</option>
            <option value="pending">Pending ({stats?.pending || 0})</option>
            <option value="completed">Completed ({stats?.completed || 0})</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Due From
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(filters.dateFrom)}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Select start date..."
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Due To
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(filters.dateTo)}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Select end date..."
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
            onChange={handleSortOrderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="desc">Newest First ↓</option>
            <option value="asc">Oldest First ↑</option>
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">
              Active filters:
            </p>
            <span className="text-xs text-gray-500">
              Showing {stats?.filtered} of {stats?.total} tasks
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.completed !== undefined && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {filters.completed ? '✓ Completed' : '⏳ Pending'}
              </span>
            )}
            {filters.dateFrom && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                📅 From: {filters.dateFrom.toLocaleDateString()}
              </span>
            )}
            {filters.dateTo && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                📅 To: {filters.dateTo.toLocaleDateString()}
              </span>
            )}
            {sortOrder !== 'desc' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                🔄 Oldest First
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';