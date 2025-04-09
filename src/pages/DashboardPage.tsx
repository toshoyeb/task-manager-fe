import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { RootState } from "../store/store";
import { fetchTaskStats } from "../store/slices/taskSlice";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import ChatSection from "../components/chat/ChatSection";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { taskStats, isLoading } = useAppSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTaskStats());
  }, [dispatch]);

  const renderStats = () => {
    if (isLoading) {
      return <div className="text-center text-gray-500">Loading stats...</div>;
    }

    if (!taskStats) {
      return (
        <div className="text-center text-gray-500">No stats available</div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-blue-50 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Total Tasks
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {taskStats.totalTasks}
          </p>
        </div>

        <div className="card bg-green-50 border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {taskStats.completedTasks}
          </p>
          <div className="mt-2 text-sm text-green-700">
            {taskStats.completionRate.toFixed(0)}% completion rate
          </div>
        </div>

        <div className="card bg-yellow-50 border border-yellow-100">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Pending
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {taskStats.pendingTasks}
          </p>
        </div>
      </div>
    );
  };

  const renderCategoriesAndPriorities = () => {
    if (!taskStats || !taskStats.tasksByCategory.length) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Tasks by Category
          </h3>
          {taskStats.tasksByCategory.length === 0 ? (
            <p className="text-gray-500">No categories yet</p>
          ) : (
            <div className="space-y-2">
              {taskStats.tasksByCategory.map((category) => (
                <div
                  key={category._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-gray-700 capitalize">
                      {category._id}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Tasks by Priority
          </h3>
          {taskStats.tasksByPriority.length === 0 ? (
            <p className="text-gray-500">No priorities yet</p>
          ) : (
            <div className="space-y-2">
              {taskStats.tasksByPriority.map((priority) => {
                const getPriorityColor = (p: string) => {
                  switch (p) {
                    case "high":
                      return "bg-red-500";
                    case "medium":
                      return "bg-yellow-500";
                    case "low":
                      return "bg-green-500";
                    default:
                      return "bg-gray-500";
                  }
                };

                return (
                  <div
                    key={priority._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${getPriorityColor(
                          priority._id
                        )} mr-2`}
                      ></div>
                      <span className="text-gray-700 capitalize">
                        {priority._id}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {priority.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link to="/tasks/new">
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      <div className="card mb-6 bg-white">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          Here's an overview of your tasks and progress.
        </p>
      </div>

      {renderStats()}
      {renderCategoriesAndPriorities()}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Team Chat</h2>
        <ChatSection />
      </div>

      {taskStats && taskStats.totalTasks === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm p-8 mt-8">
          <h3 className="text-2xl font-medium text-gray-700 mb-3">
            You have no tasks yet!
          </h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Get started by creating your first task to begin tracking your
            progress.
          </p>
          <Link to="/tasks/new">
            <Button variant="primary" size="lg">
              Create Your First Task
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-end">
          <Link to="/tasks">
            <Button variant="secondary">View All Tasks</Button>
          </Link>
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
