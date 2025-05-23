# Portfolio Manager Setup Guide

This guide provides step-by-step instructions for setting up the Portfolio Manager Dashboard development environment.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Docker and Docker Compose (for containerized development)
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-manager
```

### 2. Install Dependencies

```bash
npm install
```

This will install all necessary dependencies defined in `package.json`, including:

- Next.js and React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query
- React Hook Form
- Zustand
- Chart.js and react-chartjs-2
- NextAuth.js
- Development tools (Jest, Husky, etc.)

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following environment variables:

```
# Database connection
MONGODB_URI=mongodb://admin:password@localhost:27017/portfolio?authSource=admin

# Authentication
NEXTAUTH_SECRET=your-development-secret
NEXTAUTH_URL=http://localhost:3000

# Additional configs
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

The project includes Docker configuration for local development. Start MongoDB using:

```bash
./dev.sh
```

This will start a MongoDB container according to the configuration in `docker-compose.yml`.

#### Option B: Manual MongoDB Setup

If you prefer to use an existing MongoDB instance:

1. Install and start MongoDB on your local machine or use MongoDB Atlas
2. Update the `MONGODB_URI` environment variable to point to your MongoDB instance

### 5. Start the Development Server

```bash
npm run dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

## Project Structure

The application follows a modular structure:

```
portfolio-manager/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   └── auth/                 # Authentication pages
├── components/               # UI components
├── docs/                     # Project documentation
├── lib/                      # Utility libraries
├── models/                   # Data models
├── services/                 # Business logic
├── store/                    # State management
└── utils/                    # Utility functions
```

## Testing

Run tests using:

```bash
npm test
```

## Docker Development Environment

The project includes Docker configuration for a complete development environment:

```bash
# Start the Docker environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the environment
docker-compose down
```

## Troubleshooting

### Common Issues

#### MongoDB Connection Errors

- Check if MongoDB container is running: `docker ps`
- Verify environment variables are correct in `.env.local`
- Try connecting with MongoDB Compass to verify the connection

#### Next.js Build Errors

- Clear the Next.js cache: `rm -rf .next`
- Ensure all dependencies are installed: `npm install`

#### Jest Testing Issues

- Make sure Jest is configured correctly
- Check for any missing dependencies

## Next Steps

After setting up the development environment:

1. Review the architecture documentation
2. Explore the component structure
3. Start implementing features according to the project roadmap

For more information, refer to the [Documentation Guide](/docs/documentation-guide.md).
