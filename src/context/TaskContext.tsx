import React, { createContext, useContext, useState, useMemo } from "react";
import { Task, TaskStats } from "../types";
import { taskService } from "../services/api";
import axios from "axios";

interface TaskContextType {
  tasks: Task[];
  currentTask: Task | null;
  taskStats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
  getTasks: (filters?: {
    status?: string;
    category?: string;
    search?: string;
  }) => Promise<void>;
  getTaskById: (id: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskStats: () => Promise<void>;
  clearTaskError: () => void;
}

const initialStats: TaskStats = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  completionRate: 0,
  tasksByCategory: [],
  tasksByPriority: [],
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  currentTask: null,
  taskStats: initialStats,
  isLoading: false,
  error: null,
  getTasks: async () => {},
  getTaskById: async () => {},
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  getTaskStats: async () => {},
  clearTaskError: () => {},
});

export const useTask = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(initialStats);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      return error.response.data.error;
    }
    return defaultMessage;
  };

  const getTasks = async (filters?: {
    status?: string;
    category?: string;
    search?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getTasks(filters);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      setError(handleError(error, "Failed to fetch tasks"));
      setIsLoading(false);
    }
  };

  const getTaskById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getTaskById(id);
      setCurrentTask(data);
      setIsLoading(false);
    } catch (error) {
      setError(handleError(error, "Failed to fetch task"));
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.createTask(taskData);
      setIsLoading(false);
      await getTasks();
    } catch (error) {
      setError(handleError(error, "Failed to create task"));
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.updateTask(id, taskData);
      setIsLoading(false);

      // Refresh the tasks list
      await getTasks();

      // If we have a current task selected and it's the one we updated, refresh it
      if (currentTask && currentTask._id === id) {
        await getTaskById(id);
      }
    } catch (error) {
      setError(handleError(error, "Failed to update task"));
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      setIsLoading(false);

      // Refresh the tasks list
      await getTasks();

      // If we have a current task selected and it's the one we deleted, clear it
      if (currentTask && currentTask._id === id) {
        setCurrentTask(null);
      }
    } catch (error) {
      setError(handleError(error, "Failed to delete task"));
      setIsLoading(false);
    }
  };

  const getTaskStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getTaskStats();
      setTaskStats(data);
      setIsLoading(false);
    } catch (error) {
      setError(handleError(error, "Failed to fetch task statistics"));
      setIsLoading(false);
    }
  };

  const clearTaskError = () => {
    setError(null);
  };

  const contextValue = useMemo(
    () => ({
      tasks,
      currentTask,
      taskStats,
      isLoading,
      error,
      getTasks,
      getTaskById,
      createTask,
      updateTask,
      deleteTask,
      getTaskStats,
      clearTaskError,
    }),
    [tasks, currentTask, taskStats, isLoading, error]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
