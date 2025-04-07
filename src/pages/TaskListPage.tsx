import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchTasks,
  deleteTask,
  toggleTaskStatus,
} from "../store/slices/taskSlice";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import { TaskStatus, TaskPriority } from "../types";

const TaskListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    loadTasks();
  }, [dispatch]);

  const loadTasks = () => {
    const filters: {
      status?: string;
      category?: string;
      search?: string;
    } = {};

    if (statusFilter) filters.status = statusFilter;
    if (categoryFilter) filters.category = categoryFilter;
    if (searchTerm) filters.search = searchTerm;

    dispatch(fetchTasks(filters));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id));
    }
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleTaskStatus(id));
  };

  const getPriorityBadgeColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-100 text-red-800";
      case TaskPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case TaskStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <Link to="/tasks/new">
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="mb-6 bg-white p-4 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              className="form-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Apply Filters
            </Button>
          </div>
        </div>
      </form>

      {/* Task List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter || categoryFilter
              ? "Try changing your search filters"
              : "Get started by creating your first task"}
          </p>
          {!searchTerm && !statusFilter && !categoryFilter && (
            <Link to="/tasks/new">
              <Button variant="primary">Create Your First Task</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className={
                    task.status === TaskStatus.COMPLETED ? "bg-gray-50" : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleStatus(task._id)}
                        className={`mr-3 flex-shrink-0 h-5 w-5 rounded transition-colors duration-200 ${
                          task.status === TaskStatus.COMPLETED
                            ? "bg-green-500 border-green-500"
                            : "bg-white border border-gray-300 hover:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
                        title={
                          task.status === TaskStatus.COMPLETED
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >
                        {task.status === TaskStatus.COMPLETED && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <div
                        className={
                          task.status === TaskStatus.COMPLETED
                            ? "line-through text-gray-500"
                            : ""
                        }
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(task._id)}
                      className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors duration-200 ${getStatusBadgeColor(
                        task.status
                      )}`}
                    >
                      {task.status === TaskStatus.COMPLETED ? (
                        <>
                          <svg
                            className="h-3 w-3 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3 w-3 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Pending
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {task.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default TaskListPage;
