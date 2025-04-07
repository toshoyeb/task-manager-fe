import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { login, clearError } from "../store/slices/authSlice";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-8">
            Log in to your account
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

          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Log in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
