import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { taskService } from "../../services/api";
import { Task, TaskStats } from "../../types";
import axios from "axios";

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  taskStats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialStats: TaskStats = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  completionRate: 0,
  tasksByCategory: [],
  tasksByPriority: [],
};

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  taskStats: initialStats,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (
    filters:
      | { status?: string; category?: string; search?: string }
      | undefined,
    { rejectWithValue }: { rejectWithValue: (value: string) => any }
  ) => {
    try {
      return await taskService.getTasks(filters);
    } catch (error) {
      let errorMessage = "Failed to fetch tasks";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await taskService.getTaskById(id);
    } catch (error) {
      let errorMessage = "Failed to fetch task";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Partial<Task>, { rejectWithValue, dispatch }) => {
    try {
      const response = await taskService.createTask(taskData);
      dispatch(fetchTasks());
      return response;
    } catch (error) {
      let errorMessage = "Failed to create task";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, taskData }: { id: string; taskData: Partial<Task> },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      dispatch(fetchTasks());

      // If we have a current task selected and it's the one we updated, refresh it
      const state = getState() as { tasks: TaskState };
      if (state.tasks.currentTask && state.tasks.currentTask._id === id) {
        dispatch(fetchTaskById(id));
      }

      return response;
    } catch (error) {
      let errorMessage = "Failed to update task";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await taskService.deleteTask(id);
      dispatch(fetchTasks());

      // If we have a current task selected and it's the one we deleted, clear it
      const state = getState() as { tasks: TaskState };
      if (state.tasks.currentTask && state.tasks.currentTask._id === id) {
        dispatch(clearCurrentTask());
      }

      return response;
    } catch (error) {
      let errorMessage = "Failed to delete task";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getTaskStats();
    } catch (error) {
      let errorMessage = "Failed to fetch task statistics";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks cases
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch task by ID cases
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.isLoading = false;
          state.currentTask = action.payload;
        }
      )
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create task cases
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update task cases
    builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete task cases
    builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch task stats cases
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTaskStats.fulfilled,
        (state, action: PayloadAction<TaskStats>) => {
          state.isLoading = false;
          state.taskStats = action.payload;
        }
      )
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
