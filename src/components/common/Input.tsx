import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  icon,
  className = "",
  ...props
}) => {
  const inputClasses = `
    form-input
    ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }
    ${icon ? "pl-10" : ""}
    ${className}
  `;

  const containerClasses = `
    ${fullWidth ? "w-full" : ""}
    ${props.disabled ? "opacity-60" : ""}
    mb-4
  `;

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={props.id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
