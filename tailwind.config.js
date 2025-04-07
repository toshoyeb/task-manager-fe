/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        background: "var(--background-color)",
        textColor: "var(--text-color)",
        error: "var(--error-color)",
        success: "var(--success-color)",
      },
    },
  },
  plugins: [],
};
