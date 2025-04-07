import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  createTask,
  fetchTaskById,
  updateTask,
  clearTaskError,
} from "../store/slices/taskSlice";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { TaskPriority, TaskCategory, TaskStatus } from "../types";

const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentTask, isLoading, error } = useAppSelector(
    (state) => state.tasks
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.WORK);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Load task data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id, isEditMode]);

  // Fill form with task data when available
  useEffect(() => {
    if (isEditMode && currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setDueDate(
        currentTask.dueDate
          ? new Date(currentTask.dueDate).toISOString().split("T")[0]
          : ""
      );
      setPriority(currentTask.priority);
      setCategory(currentTask.category);
      setStatus(currentTask.status);
      setTags(currentTask.tags || []);
    }
  }, [currentTask, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      category,
      status,
      tags,
    };

    if (isEditMode && id) {
      await dispatch(updateTask({ id, taskData }));
    } else {
      await dispatch(createTask(taskData));
    }

    // Navigate back to dashboard only if there were no errors
    if (!error) {
      navigate("/dashboard");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleClearError = () => {
    dispatch(clearTaskError());
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 flex justify-between">
            <p>{error}</p>
            <button
              onClick={handleClearError}
              className="text-red-700 hover:text-red-900 focus:outline-none"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Task title"
          />

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input min-h-[100px]"
              placeholder="Describe your task..."
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="form-input"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="form-input"
            >
              <option value={TaskCategory.WORK}>Work</option>
              <option value={TaskCategory.PERSONAL}>Personal</option>
              <option value={TaskCategory.SHOPPING}>Shopping</option>
              <option value={TaskCategory.HEALTH}>Health</option>
              <option value={TaskCategory.EDUCATION}>Education</option>
              <option value={TaskCategory.FINANCE}>Finance</option>
              <option value={TaskCategory.OTHER}>Other</option>
            </select>
          </div>

          {isEditMode && (
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="form-input"
              >
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="form-input mr-2"
                placeholder="Add a tag"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
                size="sm"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default TaskFormPage;
