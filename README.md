# Task Manager Frontend

A modern React application for managing tasks, built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Sign up and log in
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Categorize tasks and add tags
- **Task Status**: Mark tasks as completed or pending
- **Task Filters**: Filter by category, status, and search by title
- **Dashboard**: View statistics about your tasks
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-manager-fe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Backend API

This frontend connects to a Node.js/Express backend. Make sure your backend is running at `http://localhost:5000/api`.

If your backend is running on a different URL, update the `API_URL` in `src/services/api.ts`.

## Project Structure

```
task-manager-fe/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # General-purpose components
│   │   └── layout/        # Layout components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
└── tailwind.config.js     # Tailwind CSS configuration
```

## Deployment

### Deploying to Vercel

1. Create a Vercel account if you don't have one.
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```

## License

ISC
