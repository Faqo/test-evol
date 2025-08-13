import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import type { CreateTaskData } from '../../types/task';
import { Button } from '../common/Button';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  dueDate: Yup.date()
    .nullable()
    .min(new Date(), 'Due date must be in the future'),
});

const initialValues: CreateTaskData & { dueDate: string } = {
  title: '',
  description: '',
  dueDate: '',
  tags: [],
};

export const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    const result = await addTask({
      ...values,
      dueDate: values.dueDate || undefined,
    });

    if (result.success) {
      resetForm();
      setTagInput('');
      console.log('Task created successfully!');
    } else {
      console.error('Failed to create task:', result.error);
    }
  };

  const addTag = (setFieldValue: any, currentTags: string[]) => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setFieldValue('tags', [...currentTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (setFieldValue: any, currentTags: string[], tagToRemove: string) => {
    setFieldValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task title"
              />
              <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task description"
              />
              <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Due Date Field */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <Field
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="dueDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(setFieldValue, values.tags || []);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addTag(setFieldValue, values.tags || [])}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {(values.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(setFieldValue, values.tags || [], tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              Create Task
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};