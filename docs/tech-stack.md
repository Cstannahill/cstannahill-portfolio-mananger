# Tech Stack Documentation

This document outlines the finalized technology stack for the Portfolio Manager MVP.

## Overview

The Portfolio Manager Dashboard is built on a modern, lightweight stack optimized for self-hosting and compatibility with existing portfolio websites. The technologies have been selected to provide a robust, maintainable solution while minimizing hosting costs and resource requirements.

## Frontend Technologies

### Core Framework

- **Next.js 14+** - App Router architecture
  - Server Components for improved performance
  - API routes for backend functionality
  - Built-in routing and server-side rendering
  - File-based routing system consistent with existing portfolio

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework

  - Consistent with existing portfolio styling
  - Minimal CSS footprint
  - Highly customizable design system
  - Built-in responsive design utilities

- **shadcn/ui** - Component library
  - Pre-built, accessible components
  - Seamless integration with Tailwind CSS
  - Customizable with minimal overhead
  - Consistent theming with existing portfolio

### Type Safety & Developer Experience

- **TypeScript** - Typed JavaScript
  - Enhanced code quality and maintainability
  - Better IntelliSense and editor support
  - Reduced runtime errors through compile-time checking
  - Type definitions for improved documentation

### Form Management

- **React Hook Form** - Form library
  - Efficient rendering with minimal re-renders
  - Built-in validation
  - TypeScript support
  - Low bundle size

### Data Fetching & State

- **React Query** - Data fetching library
  - Caching and state synchronization
  - Server state management
  - Automatic refetching
  - Loading and error states

## Backend Technologies

### API Layer

- **Next.js API Routes** - Built-in backend capability
  - Serverless architecture
  - Easy deployment with frontend
  - API route handlers with TypeScript support
  - Same codebase for frontend and backend

### Database

- **MongoDB** - NoSQL Database

  - Document-based structure ideal for portfolio content
  - Flexible schema for varying content types
  - Self-hostable on lightweight infrastructure
  - Good performance on minimal hardware

- **mongoose** - MongoDB ODM
  - Schema validation
  - Type definitions
  - Middleware support
  - Query building API

### Content Management

- **gray-matter** - Frontmatter parser

  - Parse MDX/MD frontmatter
  - Compatible with existing content structure

- **next-mdx-remote** - MDX renderer
  - Server component support
  - Custom component mapping
  - Efficient rendering

## State Management

- **React Context API** - Built-in state management

  - Local UI state management
  - Theme context
  - Authentication context
  - Preferences management

- **Zustand** - Lightweight state management
  - Simpler alternative to Redux
  - Minimal boilerplate
  - First-party TypeScript support
  - Easy integration with React Query

## Authentication

- **NextAuth.js** - Authentication framework
  - Simple setup for credential authentication
  - Extendable for other providers if needed
  - Session management
  - JWT handling

## Data Visualization

- **Chart.js** - Chart library

  - Variety of chart types
  - Responsive charts
  - Customizable styling
  - Good performance

- **react-chartjs-2** - React wrapper
  - React component interface for Chart.js
  - Hooks for Chart.js
  - TypeScript support

## Deployment

- **Docker** - Containerization

  - Consistent environment across development and production
  - Isolation of services
  - Simple deployment process

- **Docker Compose** - Multi-container orchestration
  - Define and run multi-container Docker applications
  - Link application and MongoDB containers
  - Simple volume management for persistence
  - One-command deployment

## Development Tooling

- **ESLint** - Code linting

  - Code quality enforcement
  - Consistent code style
  - Prevent common errors

- **Prettier** - Code formatting

  - Consistent code formatting
  - Integration with ESLint
  - Auto-format on save

- **Husky** - Git hooks manager
  - Pre-commit hooks for code quality
  - Pre-push hooks for testing
  - Prevent commits with failing tests or linting errors
  - Ensure code quality standards

## Project Integration

- **Simple-Git** - Git integration library

  - Clone repositories
  - Pull updates
  - Read file history
  - Interface with GitHub

- **fs-extra** - File system utilities
  - Promise-based file operations
  - Enhanced file system methods
  - Directory operations
  - File watcher capabilities

## Service Integration

- **nodemailer** (optional) - Email functionality
  - Notification emails
  - Weekly reports

## Testing

- **Jest** - Testing framework

  - Unit testing
  - Integration testing
  - Mocking capabilities

- **React Testing Library** - Component testing
  - Component rendering tests
  - User interaction simulation
  - Accessibility testing

## Rationale for Tech Choices

### Next.js vs. Other Frameworks

Next.js was chosen because it aligns with the existing portfolio implementation, provides both frontend and backend capabilities in a single framework, and offers excellent performance through its App Router architecture.

### Zustand vs. Redux

Zustand was selected over Redux for its simplicity and reduced boilerplate. For an MVP with primarily personal usage, Zustand provides sufficient state management without the complexity of Redux.

### MongoDB vs. Other Databases

MongoDB was chosen as the primary database due to:

1. Its document-oriented nature that aligns with portfolio content
2. Opportunity to gain experience with MongoDB
3. Self-hosting capabilities
4. Flexible schema that can evolve with the application

### Docker vs. Direct Deployment

Docker provides consistent environments and simplifies deployment across different systems. It also makes managing MongoDB alongside the application more straightforward.

## Future Considerations

While these technologies form the core of the MVP, the following may be considered for future iterations:

1. **Redis** - For caching and performance optimization
2. **WebSockets** - For real-time collaboration features
3. **GitHub Actions** - For CI/CD integration
4. **Elasticsearch** - For advanced search capabilities

---

This document will be updated as the technology stack evolves throughout development.

_Last updated: May 19, 2025_
