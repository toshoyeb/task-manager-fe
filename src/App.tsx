import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { getProfile } from "./store/slices/authSlice";

// Lazy loaded components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const TaskFormPage = lazy(() => import("./pages/TaskFormPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

// Private route wrapper
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public route wrapper (redirect if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

// App component needs to be separated from the routes to avoid hooks usage before router is available
const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  // Load user profile if token exists
  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />

      {/* Task routes */}
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/new"
        element={
          <PrivateRoute>
            <TaskFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <TaskFormPage />
          </PrivateRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
