import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { AuthState, User } from "../types";
import axios from "axios";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  // Load user data when component mounts or token changes in localStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setState((prev) => ({
          ...prev,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const user = await authService.getProfile();
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // Token might be expired or invalid
        localStorage.removeItem("token");
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    loadUser();
    // Only run on mount and when localStorage token changes, not on state.token changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up a listener for storage events to handle token changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setState((prev) => ({
        ...prev,
        token,
        isAuthenticated: Boolean(token),
      }));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const data = await authService.login(email, password);

        localStorage.setItem("token", data.token);

        setState({
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
          },
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        navigate("/dashboard");
      } catch (error) {
        let errorMessage = "Login failed";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const data = await authService.register(name, email, password);

        localStorage.setItem("token", data.token);

        setState({
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
          },
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        navigate("/dashboard");
      } catch (error) {
        let errorMessage = "Registration failed";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate("/login");
  }, [navigate]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
