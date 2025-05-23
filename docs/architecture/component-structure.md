# Application Component Structure

This document outlines the component architecture for the Portfolio Manager Dashboard application, describing the React component hierarchy, state management approach, and data flow patterns.

## Architecture Overview

The application follows a layered architecture pattern with clear separation of concerns:

1. **UI Layer** - Presentation components that render the UI
2. **Application Layer** - Business logic, state management, and data transformation
3. **Data Layer** - API interactions and data fetching

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   ├── UserMenu
│   │   └── ThemeToggle
│   ├── Sidebar
│   │   ├── SidebarNav
│   │   └── CollapsibleSection
│   └── Footer
├── Dashboard
│   ├── DashboardGrid
│   │   └── DashboardWidget (multiple instances)
│   │       ├── WidgetHeader
│   │       └── WidgetContent
│   └── WidgetLibrary
│       ├── ProjectsWidget
│       ├── BlogPostsWidget
│       ├── TechnologyWidget
│       ├── GitHubActivityWidget
│       ├── AnalyticsWidget
│       └── CustomWidget
├── Projects
│   ├── ProjectsList
│   │   └── ProjectCard
│   ├── ProjectDetail
│   │   ├── ProjectHeader
│   │   ├── ProjectContent
│   │   ├── TechStack
│   │   ├── ImageGallery
│   │   ├── ProjectMilestones
│   │   └── ProjectFeatures
│   └── ProjectEditor
│       ├── MDXEditor
│       ├── FrontmatterEditor
│       ├── AssetManager
│       ├── TechnologySelector
│       └── TagSelector
├── BlogPosts
│   ├── BlogPostsList
│   │   └── BlogPostCard
│   ├── BlogPostDetail
│   │   ├── BlogHeader
│   │   └── BlogContent
│   └── BlogEditor
│       ├── MDXEditor
│       ├── FrontmatterEditor
│       ├── AssetManager
│       └── TagSelector
├── Settings
│   ├── ProfileSettings
│   ├── IntegrationSettings
│   │   └── GitHubIntegration
│   ├── AppearanceSettings
│   └── SystemSettings
└── Common
    ├── MDXRenderer
    ├── TagBadge
    ├── TechnologyBadge
    ├── Dropzone
    ├── SearchInput
    ├── Pagination
    ├── Modal
    ├── Toast
    └── LoadingSpinner
```

## Component Types

The application uses three primary component types:

### 1. Page Components

Page components correspond to routes in the application and serve as the entry points for different sections.

```typescript
// Example Page Component
const ProjectsPage: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="page-container">
      <h1>Projects</h1>
      <ProjectsList projects={projects} />
    </div>
  );
};
```

### 2. Container Components

Container components manage data fetching, state management, and business logic. They typically wrap presentational components and provide them with data and callbacks.

```typescript
// Example Container Component
const ProjectsList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [filter, setFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.status === filter);
  }, [projects, filter]);

  return (
    <>
      <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </>
  );
};
```

### 3. Presentational Components

Presentational components focus on rendering UI elements and handling user interactions. They receive data and callbacks as props and generally don't contain business logic.

```typescript
// Example Presentational Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="card">
      <div className="card-image">
        {project.coverImage ? (
          <img src={project.coverImage.url} alt={project.title} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-summary">{project.summary}</p>
        <div className="card-technologies">
          {project.technologies.map((tech) => (
            <TechnologyBadge key={tech._id} technology={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

## State Management

The application uses a hybrid state management approach:

### Local Component State

For UI-specific, ephemeral state that doesn't need to be shared widely, React's `useState` and `useReducer` hooks are used.

```typescript
// Example local state
const [isOpen, setIsOpen] = useState(false);
const [filter, setFilter] = useState("all");
```

### Global State with Zustand

For application-wide state that needs to be accessed by multiple components, Zustand is used to create lightweight stores.

```typescript
// Example Zustand store
import create from "zustand";

interface ThemeStore {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
```

### Server State with React Query

For data that comes from the API, React Query is used to handle fetching, caching, and synchronizing server state.

```typescript
// Example React Query usage
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject } from "../api/projects";

// Query hook
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};

// Mutation hook
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
```

## Data Flow

The application follows a unidirectional data flow pattern:

1. **API Layer** fetches data from the backend
2. **React Query** caches the data and makes it available to components
3. **Container Components** transform the data for specific use cases
4. **Presentational Components** render the data
5. **User Interactions** trigger callbacks that update state or call mutations
6. **State Updates** cause components to re-render with new data

## Component Communication

Components communicate through the following patterns:

1. **Props** - Parent components pass data and callbacks to children
2. **Context** - For deeply nested components that need access to shared data
3. **Global State** - For disconnected components that need to share state
4. **Custom Events** - For rare cases where components need to communicate across the component tree

## Lazy Loading and Code Splitting

To optimize performance, the application uses React's lazy loading and Suspense for code splitting:

```typescript
import React, { lazy, Suspense } from "react";

// Lazy-loaded components
const ProjectEditor = lazy(() => import("./ProjectEditor"));
const BlogEditor = lazy(() => import("./BlogEditor"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/projects/:id/edit" element={<ProjectEditor />} />
          <Route path="/blog/:slug/edit" element={<BlogEditor />} />
          {/* Other routes */}
        </Routes>
      </Suspense>
    </Router>
  );
};
```

## Error Boundaries

Error boundaries are used to catch JavaScript errors in component trees and display fallback UIs:

```typescript
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AppRoutes />
    </ErrorBoundary>
  );
};
```

## Accessibility Considerations

All components are designed with accessibility in mind:

1. Semantic HTML elements
2. ARIA attributes where necessary
3. Keyboard navigation support
4. Color contrast compliance
5. Screen reader compatibility

## Styling Approach

The application uses Tailwind CSS for styling with the following conventions:

1. Base styles defined in the global CSS
2. Component-specific styles using Tailwind classes
3. Dynamic styling using conditional class names
4. Custom components from shadcn/ui for complex UI elements

## Performance Considerations

To ensure optimal performance:

1. Memoization of expensive computations with `useMemo` and `useCallback`
2. Virtualization for long lists using `react-virtual` or similar libraries
3. Code splitting for large components and routes
4. Image optimization and lazy loading

## Future Enhancements

1. **Component Library** - Extract common components into a reusable library
2. **Storybook Integration** - Implement Storybook for component documentation and testing
3. **Performance Monitoring** - Add performance monitoring for critical components
4. **Animation System** - Implement a consistent animation system for transitions

---

This component architecture document will evolve as the application grows and patterns emerge. Regular reviews will ensure the architecture remains clean and maintainable.
