import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { register, clearError } from "../store/slices/authSlice";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(register({ name, email, password }));
  };

  const handleClearError = () => {
    dispatch(clearError());
    setValidationError(null);
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-8">
            Create an account
          </h1>

          {(error || validationError) && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 flex justify-between">
              <p>{validationError || error}</p>
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
              label="Full name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />

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
              placeholder="Create a password"
              required
            />

            <Input
              label="Confirm password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
