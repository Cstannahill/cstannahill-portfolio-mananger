# Portfolio Manager Dashboard

A comprehensive dashboard application for managing, tracking, and visualizing your personal portfolio projects with ease.

## Getting Started

This project uses Next.js, React, and MongoDB to provide a powerful portfolio management experience.

### Prerequisites

- Node.js 18+
- npm
- Docker and Docker Compose (for containerized development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file:
   ```
   MONGODB_URI=mongodb://admin:password@localhost:27017/portfolio?authSource=admin
   NEXTAUTH_SECRET=your-development-secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

Or use Docker for development:

```bash
# Start MongoDB and the app using Docker Compose
./dev.sh
```

## Project Structure

This project follows a modular architecture with:

- Next.js App Router for routing and API routes
- React components with TypeScript
- MongoDB for data storage using Mongoose
- Tailwind CSS and shadcn/ui for styling
- Jest for testing

## Documentation

For detailed documentation, please refer to:

- [Setup Guide](./docs/user-guides/setup-guide.md) - Step-by-step setup instructions
- [Project Progress](./docs/project-progress-updated.md) - Current status and next steps
- [Documentation Guide](./docs/documentation-guide.md) - Overview of all available documentation
- [Technical Requirements](./docs/technical-requirements.md) - Project requirements and constraints
- [Architecture Overview](./docs/architecture/overview.md) - System design and architecture

## Features

- **Portfolio Overview**: Consolidated view of all projects and content
- **Project Management**: Track and update project status, features, and metadata
- **Content Analytics**: Measure engagement and growth of your portfolio content
- **Performance Tracking**: Historical performance analysis with visual charts
- **Technology Tracking**: Visual breakdown of technologies and skills across projects
- **Content Management**: Streamlined interface for creating and editing MDX content

## Development Status

This project is in active development. For the latest status, see [Project Progress](./docs/project-progress-updated.md).

## License

[MIT](LICENSE)
