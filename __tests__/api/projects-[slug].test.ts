import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server"; // Add this import
import "../mocks/database";

/**
 * @vitest-environment node
 */

describe("API Route: /api/projects/[slug] (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle params correctly and not timeout", async () => {
    // Import after mocks are set up
    const { GET } = await import("@/app/api/projects/[slug]/route");

    const paramsPromise = Promise.resolve({ slug: "test-project" });

    // Create proper NextRequest instead of Request
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/projects/test-project"
    );

    // This should not timeout since we mocked the database
    const response = await GET(mockRequest, { params: paramsPromise });

    expect(response).toBeDefined();

    // Verify the response
    const data = await response.json();
    expect(data).toBeDefined();
  });
});
