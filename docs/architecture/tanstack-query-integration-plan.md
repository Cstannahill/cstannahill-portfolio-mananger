# TanStack Query Integration Plan

**Document Version:** 1.0
**Date:** May 25, 2025
**Author:** GitHub Copilot
**Status:** Draft

## 1. Introduction & Goals

This document outlines the strategy for integrating TanStack Query (formerly React Query) and its accompanying Devtools into the Portfolio Manager application. The primary goal is to replace existing client-side data fetching mechanisms (e.g., `useEffect` with `fetch`, SWR, or other custom hooks) with TanStack Query to leverage its robust features for server-state management.

**Key Objectives:**

- **Simplify Data Fetching:** Abstract away the complexities of fetching, caching, and updating server state.
- **Improve User Experience:** Provide features like background updates, stale-while-revalidate, and optimistic updates to make the UI feel faster and more responsive.
- **Reduce Boilerplate:** Minimize repetitive code for managing loading states, error handling, and data synchronization.
- **Enhance Developer Experience:** Offer powerful Devtools for debugging and inspecting query states.
- **Standardize State Management:** Establish a consistent pattern for handling server state across the application.

## 2. Installation

The following packages need to be installed:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Or, if using Yarn or pnpm:

```bash
yarn add @tanstack/react-query @tanstack/react-query-devtools
# or
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## 3. Core Setup (`QueryClientProvider`)

A `QueryClient` instance needs to be created and provided to the application tree using `QueryClientProvider`.

**File:** `providers/TanStackQueryProvider.tsx` (New File)

```typescript
// providers/TanStackQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

// Define a type for the props if any are needed in the future
interface TanStackQueryProviderProps {
  children: React.ReactNode;
}

export function TanStackQueryProvider({ children }: TanStackQueryProviderProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: process.env.NODE_ENV === 'production', // Only refetch on focus in production
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

**Update Root Layout:** `app/layout.tsx`

The `TanStackQueryProvider` should wrap the main content of the application.

```tsx
// app/layout.tsx
import { TanStackQueryProvider } from "@/providers/TanStackQueryProvider"; // Adjust path as needed
// ... other imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Assuming AuthProvider exists */}
          <TanStackQueryProvider>
            {/* SiteNavBar, Toaster, etc. can go here or inside children depending on structure */}
            {children}
          </TanStackQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 4. React Query Devtools Integration

The `ReactQueryDevtools` component is included in `TanStackQueryProvider.tsx` and will only be active in development mode. This provides a powerful UI for inspecting query states, cache, and triggering actions.

**Access:** The Devtools will typically appear as a floating icon in the corner of the screen during development.

## 5. Basic Usage Patterns

### 5.1. Query Keys

Query keys are essential for TanStack Query to manage caching. They should be an array that uniquely identifies the data being fetched.

- **Simple List:** `['projects']`, `['tags']`
- **List with Params:** `['projects', { page: 1, limit: 10, status: 'published' }]`
- **Individual Resource:** `['project', projectId]`, `['blogPost', slug]`

**File:** `lib/queryKeys.ts` (New File - for centralizing query key factories)

```typescript
// lib/queryKeys.ts

// Project Keys
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string | undefined) => [...projectKeys.details(), id] as const,
};

// Blog Post Keys
export const blogPostKeys = {
  all: ["blogPosts"] as const,
  lists: () => [...blogPostKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...blogPostKeys.lists(), filters] as const,
  details: () => [...blogPostKeys.all, "detail"] as const,
  detail: (slug: string | undefined) =>
    [...blogPostKeys.details(), slug] as const,
};

// Tag Keys
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (filters: Record<string, any> = {}) =>
    [...tagKeys.lists(), filters] as const,
};

// Technology Keys
export const technologyKeys = {
  all: ["technologies"] as const,
  lists: () => [...technologyKeys.all, "list"] as const,
  list: (filters: Record<string, any> = {}) =>
    [...technologyKeys.lists(), filters] as const,
};

// User Settings Keys
export const userSettingsKeys = {
  all: ["userSettings"] as const,
  ai: () => [...userSettingsKeys.all, "ai"] as const,
};

// Add other domain keys as needed
```

### 5.2. `useQuery` for Data Fetching

`useQuery` is used for fetching, caching, and managing server state.

**Example:** Fetching a list of projects.

**File:** `lib/hooks/useProjectsQuery.ts` (New File - example custom hook)

```typescript
// lib/hooks/useProjectsQuery.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { projectKeys } from "@/lib/queryKeys"; // Adjust path
import type { Project } from "@/types/project"; // Adjust path
import type { ApiError } from "@/types/api"; // Adjust path for a common ApiError type

interface ProjectsResponse {
  data: Project[];
  // Add other pagination/metadata fields if your API returns them
  total?: number;
  page?: number;
  limit?: number;
}

interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: string;
  // Add other filter types
}

const fetchProjects = async (
  filters: ProjectFilters
): Promise<ProjectsResponse> => {
  const queryParams = new URLSearchParams();
  if (filters.page) queryParams.append("page", String(filters.page));
  if (filters.limit) queryParams.append("limit", String(filters.limit));
  if (filters.status) queryParams.append("status", filters.status);
  // ... append other filters

  const response = await fetch(`/api/projects?${queryParams.toString()}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to fetch projects");
  }
  return response.json() as Promise<ProjectsResponse>;
};

export const useProjectsQuery = (
  filters: ProjectFilters = {}
): UseQueryResult<ProjectsResponse, Error> => {
  return useQuery<
    ProjectsResponse,
    Error,
    ProjectsResponse,
    readonly (string | Record<string, any>)[]
  >({
    queryKey: projectKeys.list(filters),
    queryFn: () => fetchProjects(filters),
    // keepPreviousData: true, // Useful for pagination
  });
};

// Example: Fetching a single project
const fetchProjectById = async (projectId: string): Promise<Project> => {
  const response = await fetch(`/api/projects/${projectId}`);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(
      errorData.message || `Failed to fetch project ${projectId}`
    );
  }
  return response.json() as Promise<Project>; // Assuming API returns { data: Project }
};

export const useProjectByIdQuery = (
  projectId: string | undefined
): UseQueryResult<Project, Error> => {
  return useQuery<Project, Error, Project, readonly (string | undefined)[]>({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => {
      if (!projectId) {
        return Promise.reject(new Error("Project ID is undefined"));
      }
      return fetchProjectById(projectId);
    },
    enabled: !!projectId, // Only run query if projectId is defined
  });
};
```

### 5.3. `useMutation` for Data Modification

`useMutation` is used for creating, updating, or deleting data.

**Example:** Creating a new project.

**File:** `lib/hooks/useCreateProjectMutation.ts` (New File - example custom hook)

```typescript
// lib/hooks/useCreateProjectMutation.ts
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { projectKeys } from "@/lib/queryKeys"; // Adjust path
import type { Project, ProjectFormInput } from "@/types/project"; // Adjust path
import type { ApiError } from "@/types/api"; // Adjust path

const createProject = async (
  newProjectData: ProjectFormInput
): Promise<Project> => {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProjectData),
  });
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Failed to create project");
  }
  return response.json() as Promise<Project>; // Assuming API returns { data: Project }
};

export const useCreateProjectMutation = (): UseMutationResult<
  Project,
  Error,
  ProjectFormInput
> => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, ProjectFormInput>({
    mutationFn: createProject,
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      // Optionally, update the cache directly if the new item is returned
      // queryClient.setQueryData(projectKeys.detail(data._id), data);
    },
    onError: (error) => {
      // Handle error (e.g., show toast notification)
      console.error("Error creating project:", error.message);
    },
  });
};
```

## 6. Advanced Concepts

### 6.1. Pagination / Infinite Scrolling

- **Pagination:** Use `keepPreviousData: true` with `useQuery` to keep displaying old data while new data is fetched for the next page. Manage page state locally.
- **Infinite Scrolling:** `useInfiniteQuery` is designed for this. It helps manage fetching "pages" of data and appending them.

### 6.2. Optimistic Updates

For a snappier UI, mutations can optimistically update the local cache before the server confirms the change.

**Example (within `useMutation` options):**

```typescript
// ...
    onMutate: async (newProjectData: ProjectFormInput) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<ProjectsResponse>(projectKeys.lists()); // Use a specific list key if applicable

      // Optimistically update to the new value
      if (previousProjects) {
        // This is a simplified example. You'd need to construct the new project object
        // and add it to the list in a way that matches your data structure.
        // queryClient.setQueryData<ProjectsResponse>(projectKeys.lists(), {
        //   ...previousProjects,
        //   data: [...previousProjects.data, { _id: 'temp-id', ...newProjectData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Project],
        // });
      }

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    onError: (err, newProjectData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
      // Show error toast
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
// ...
```

### 6.3. SSR/SSG Considerations (Next.js App Router)

TanStack Query supports SSR/SSG in Next.js.

- **Server Components:** Fetch data directly in Server Components. TanStack Query can be used on the client to hydrate or manage this state further if needed, or for client-side mutations.
- **Client Components with Initial Data:**

  - Fetch data in a Server Component parent.
  - Pass data as props to the Client Component.
  - Use the `initialData` option in `useQuery` to hydrate the query with this server-fetched data.

  ```typescript
  // Server Component (e.g., app/dashboard/projects/page.tsx)
  async function getProjectsForInitialLoad() {
    // Your server-side data fetching logic
    const res = await fetch('http://localhost:3000/api/projects?limit=10', { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch initial projects");
    return res.json();
  }

  export default async function ProjectsPage() {
    const initialProjectsData = await getProjectsForInitialLoad();
    return <ProjectsClientComponent initialData={initialProjectsData} />;
  }

  // Client Component (e.g., components/dashboard/ProjectsClientComponent.tsx)
  "use client";
  import { useProjectsQuery } from '@/lib/hooks/useProjectsQuery'; // Adjust path
  // ...
  function ProjectsClientComponent({ initialData }: { initialData: ProjectsResponse }) {
    const { data, isLoading, error } = useProjectsQuery(
      { limit: 10 }, // Initial filters
      { initialData: initialData } // Provide initialData
    );
    // ... render logic
  }
  ```

- **Hydration:** For more complex scenarios or if you prefer fetching on the server with TanStack Query itself, you can use the `<HydrationBoundary>` (previously `Hydrate`) component. This involves prefetching queries on the server, dehydrating the cache, and rehydrating it on the client. This is more advanced and might be an overkill for many App Router use cases where Server Components handle initial data loads.

## 7. Refactoring Existing Data Fetching

A phased approach is recommended:

1. **Identify Key Data Entities:** Start with core entities like Projects, Blog Posts, Tags, Technologies.
2. **Create Custom Hooks:** For each entity, create custom hooks abstracting `useQuery` and `useMutation` logic (e.g., `useProjectsQuery`, `useProjectByIdQuery`, `useCreateProjectMutation`).
3. **Replace Gradually:**
   - Target components that heavily rely on client-side fetching.
   - Replace existing `useEffect`/`fetch` or SWR calls with the new TanStack Query hooks.
   - Update loading, error, and data rendering logic to use the state provided by TanStack Query hooks (`isLoading`, `isError`, `error`, `data`).
4. **Address Mutations:** Refactor form submissions and actions (create, update, delete) to use `useMutation` hooks. Implement cache invalidation and optimistic updates where beneficial.
5. **Test Thoroughly:** After each refactoring step, test the functionality to ensure data is fetched, displayed, and updated correctly.

## 8. Impact on Overall State Management

- **Server State vs. Client State:** TanStack Query excels at managing server state. Client-side UI state (e.g., form input values before submission, modal visibility, theme preferences) should still be managed by React's `useState`, `useReducer`, or dedicated client state libraries like Zustand or Jotai if complex.
- **Reduced Need for Global Client State:** Much of the data previously stored in global client state stores (like Redux or Zustand) that originated from the server can now be managed by TanStack Query's cache. This can simplify the client state significantly.
- **Clear Separation:** This encourages a clearer separation between server cache and client UI state.

## 9. Testing Strategies

- **Mocking API Calls:** Use libraries like `msw` (Mock Service Worker) or Jest's mocking capabilities to mock API responses for your fetch functions.
- **Testing Custom Hooks:**
  - Use `@testing-library/react-hooks` (or `@testing-library/react` for React 18+ which includes `renderHook`).
  - Wrap your hooks with `QueryClientProvider` in tests.
  - Assert loading states, data transformations, and error handling.
- **Testing Components:**
  - Components using these hooks can be tested by mocking the hooks themselves or by providing a `QueryClient` and mocked API responses.
  - Verify that components render correctly based on query states (loading, success, error).
- **Example Test Setup (using Vitest & MSW):**

  ```typescript
  // __tests__/setup/queryClientWrapper.tsx (New File)
  import React from 'react';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

  export const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  });

  export const TestQueryProvider: React.FC<{ client?: QueryClient, children: React.ReactNode }> = ({ client, children }) => {
    const testClient = client || createTestQueryClient();
    return (
      <QueryClientProvider client={testClient}>
        {children}
      </QueryClientProvider>
    );
  };

  // Example Hook Test: __tests__/hooks/useProjectsQuery.test.ts (New File)
  import { renderHook, waitFor } from '@testing-library/react';
  import { rest } from 'msw';
  import { setupServer } from 'msw/node';
  import { useProjectsQuery } from '@/lib/hooks/useProjectsQuery'; // Adjust
  import { TestQueryProvider, createTestQueryClient } from '../setup/queryClientWrapper'; // Adjust
  import type { Project } from '@/types/project'; // Adjust

  const mockProjects: Project[] = [
    { _id: '1', title: 'Project Alpha', summary: 'Summary Alpha', slug: 'alpha', content: '', publishedAt: new Date(), technologies: [], tags: [], images: [], status: 'published', featured: false, createdAt: new Date(), updatedAt: new Date() },
    { _id: '2', title: 'Project Beta', summary: 'Summary Beta', slug: 'beta', content: '', publishedAt: new Date(), technologies: [], tags: [], images: [], status: 'draft', featured: false, createdAt: new Date(), updatedAt: new Date() },
  ];

  const server = setupServer(
    rest.get('/api/projects', (req, res, ctx) => {
      return res(ctx.json({ data: mockProjects, total: mockProjects.length }));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('useProjectsQuery', () => {
    it('should fetch and return projects', async () => {
      const client = createTestQueryClient();
      const { result } = renderHook(() => useProjectsQuery({}), {
        wrapper: ({ children }) => <TestQueryProvider client={client}>{children}</TestQueryProvider>,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.data).toEqual(mockProjects);
      expect(result.current.data?.total).toBe(mockProjects.length);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get('/api/projects', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
        })
      );
      const client = createTestQueryClient();
      const { result } = renderHook(() => useProjectsQuery({}), {
        wrapper: ({ children }) => <TestQueryProvider client={client}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Internal Server Error');
    });
  });
  ```

## 10. Proposed Directory Structure for Query-Related Code

```tree
src/
├── app/
├── components/
├── providers/
│   └── TanStackQueryProvider.tsx  # QueryClient setup and Devtools
├── lib/
│   ├── queryKeys.ts               # Centralized query key factories
│   └── hooks/                     # Custom hooks abstracting TanStack Query logic
│       ├── useProjectsQuery.ts
│       ├── useProjectByIdQuery.ts
│       ├── useCreateProjectMutation.ts
│       ├── useUpdateProjectMutation.ts
│       ├── useDeleteProjectMutation.ts
│       ├── useBlogPostsQuery.ts
│       └── ... (other entity query/mutation hooks)
├── types/
│   ├── api.ts                     # Common API response/error types (e.g., ApiError)
│   └── ... (existing type definitions)
└── __tests__/
    ├── setup/
    │   └── queryClientWrapper.tsx # Test wrapper for QueryClientProvider
    └── hooks/
        └── useProjectsQuery.test.ts # Example test for a custom hook
```

## 11. Potential Challenges & Mitigation

- **Learning Curve:** Team members unfamiliar with TanStack Query will need time to learn its concepts.
  - **Mitigation:** Conduct internal workshops, provide links to official documentation, and encourage pair programming during initial refactoring.
- **Over-fetching or Under-fetching:** Designing optimal query keys and fetch functions.
  - **Mitigation:** Careful planning of API endpoints and query structures. Use Devtools to inspect data and cache.
- **Cache Invalidation Complexity:** Ensuring all relevant parts of the cache are updated correctly after mutations.
  - **Mitigation:** Use `queryClient.invalidateQueries` with precise query keys. For complex scenarios, consider manual cache updates (`queryClient.setQueryData`).
- **SSR/SSG Integration Nuances:** Understanding how TanStack Query interacts with Next.js App Router's rendering strategies.
  - **Mitigation:** Start with simpler client-side fetching and gradually introduce SSR/SSG hydration patterns as needed. Refer to official TanStack Query examples for Next.js.

## 12. Timeline & Phases (High-Level)

- **Phase 1 (Setup & Core Entities - e.g., 1-2 Sprints):**
  - Install packages and set up `QueryClientProvider`.
  - Define initial `queryKeys.ts`.
  - Refactor data fetching for 1-2 core entities (e.g., Projects, Blog Posts) including list views, detail views, and basic CRUD mutations.
  - Write initial tests for these hooks.
- **Phase 2 (Broader Refactoring - e.g., 2-3 Sprints):**
  - Continue refactoring other data entities (Tags, Technologies, User Settings, etc.).
  - Implement more advanced features like pagination or optimistic updates where beneficial.
  - Expand test coverage.
- **Phase 3 (Optimization & Review - e.g., 1 Sprint):**
  - Review existing queries for performance.
  - Address any complex cache invalidation scenarios.
  - Ensure consistency and best practices across all TanStack Query usage.
  - Finalize documentation.

## 13. Conclusion

Integrating TanStack Query will significantly improve how server state is managed in the Portfolio Manager application, leading to a more robust, maintainable, and performant codebase. This plan provides a roadmap for a successful rollout.
