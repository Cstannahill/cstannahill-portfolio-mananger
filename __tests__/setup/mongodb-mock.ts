// __tests__/setup/mongodb-mock.ts
import { vi } from "vitest";

// Mock the entire mongodb connection
vi.mock("@/lib/db/mongodb", () => ({
  default: {
    connect: vi.fn().mockResolvedValue({}),
    connection: {
      readyState: 1, // connected
    },
  },
}));

// Mock mongoose if you're using it
vi.mock("mongoose", () => ({
  connect: vi.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
  },
  model: vi.fn().mockReturnValue({
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
  }),
}));
