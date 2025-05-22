// __tests__/mocks/database.ts
import { vi } from "vitest";

// Mock the database connection
export const mockConnectToDatabase = vi.fn().mockResolvedValue(undefined);

// Mock the models with realistic return values
export const mockProject = {
  findOne: vi.fn().mockResolvedValue({
    _id: "507f1f77bcf86cd799439011",
    slug: "test-project",
    title: "Test Project",
    description: "Test description",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
  create: vi.fn(),
};

export const mockBlogPost = {
  findOne: vi.fn().mockResolvedValue({
    _id: "507f1f77bcf86cd799439012",
    slug: "test-slug",
    title: "Test Blog Post",
    content: "Test content",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
  create: vi.fn(),
};

// Set up the mocks
vi.mock("@/lib/db/mongodb", () => ({
  default: mockConnectToDatabase,
}));

vi.mock("@/models/Project", () => ({
  default: mockProject,
}));

vi.mock("@/models/BlogPost", () => ({
  default: mockBlogPost,
}));
