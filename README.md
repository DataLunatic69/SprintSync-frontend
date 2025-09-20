# SprintSync Frontend

A modern task management application built with React, TypeScript, and Vite. SprintSync helps teams and individuals organize their work with an intuitive interface featuring both list and kanban board views.

## Features

- **Authentication System**: Secure login and registration with JWT tokens
- **Task Management**: Create, edit, delete, and track tasks with status updates
- **Multiple Views**: Switch between list view and kanban board for different workflows
- **AI-Powered Descriptions**: Generate task descriptions using AI suggestions
- **Real-time Updates**: Live data synchronization with optimistic updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Time Tracking**: Estimate and track time spent on tasks
- **Dashboard Analytics**: Visual overview of productivity and task completion rates

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Styling**: CSS Modules with CSS Variables
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **UI Components**: Custom component library

## Project Structure

```
src/
├── api/                    # API configuration and services
│   ├── client.ts          # Axios configuration
│   ├── services/          # API service functions
│   └── types.ts           # API type definitions
├── components/            # Reusable UI components
│   ├── common/           # Generic components (Button, Input, Modal)
│   └── layout/           # Layout components (Header, Sidebar)
├── features/             # Feature-based modules
│   ├── auth/            # Authentication (Login, Register)
│   ├── dashboard/       # Dashboard analytics
│   └── tasks/           # Task management (List, Kanban, Forms)
├── hooks/               # Custom React hooks
├── stores/              # State management (Zustand stores)
├── styles/              # Global styles and CSS variables
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprintsync-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_URL=https://sprintsync-backend-c7il.onrender.com
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Integration

The frontend connects to a REST API with the following endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/token` - User login

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `PATCH /tasks/{id}/status` - Update task status
- `DELETE /tasks/{id}` - Delete task

### AI Services
- `POST /ai/suggest` - Generate task description

## Key Features

### Task Management
- Create tasks with title, description, and time estimates
- Update task status (To Do, In Progress, Done)
- Drag and drop tasks between columns in kanban view
- Edit and delete existing tasks

### Dashboard Analytics
- Task completion statistics
- Weekly activity charts
- Time tracking overview
- Recent tasks display

### AI Integration
- Generate task descriptions using AI
- Smart suggestions based on task titles
- One-click description generation

## Component Architecture

### Common Components
- **Button**: Configurable button with variants and loading states
- **Input**: Form input with validation and error handling
- **Modal**: Reusable modal dialog component

### Feature Components
- **TaskList**: Table view of tasks with sorting and filtering
- **TaskKanban**: Drag-and-drop kanban board
- **TaskForm**: Create/edit task form with AI integration
- **Dashboard**: Analytics and overview dashboard

## State Management

The application uses Zustand for state management:

- **AuthStore**: User authentication state
- **TaskStore**: Task data and operations (if needed)

## Styling

- CSS Modules for component-scoped styles
- CSS Variables for consistent theming
- Responsive design with mobile-first approach
- Custom CSS properties for colors, spacing, and typography

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture

### File Naming
- Components: PascalCase (e.g., `TaskList.tsx`)
- Styles: Module files (e.g., `TaskList.module.css`)
- Utilities: camelCase (e.g., `formatDate.ts`)

### Type Safety
- Strict TypeScript configuration
- Interface definitions for all data structures
- Type-only imports where appropriate

## Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables
- `VITE_API_URL`: Backend API URL
- `VITE_APP_TITLE`: Application title

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
