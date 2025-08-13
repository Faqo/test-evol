export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    tags: string[];
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    completed?: boolean;
    tags?: string[];
    dueDate?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    completed?: boolean;
    tags?: string[];
    dueDate?: string;
}

export interface TaskFilters {
    completed?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    filters: TaskFilters;
}