export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum TaskCategory {
  WORK = "work",
  PERSONAL = "personal",
  SHOPPING = "shopping",
  HEALTH = "health",
  EDUCATION = "education",
  FINANCE = "finance",
  OTHER = "other",
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  tags: string[];
  priority: TaskPriority;
  dueDate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  tasksByCategory: { _id: string; count: number }[];
  tasksByPriority: { _id: string; count: number }[];
}
