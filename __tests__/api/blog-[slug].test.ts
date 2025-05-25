import { describe, it, expect, vi, beforeEach } from "vitest";
import "../mocks/database";

/**
 * @vitest-environment node
 */

describe("API Route: /api/blog/[slug] (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle params correctly and not timeout", async () => {
    // Import after mocks are set up
    const routeModule = await import("../../app/api/blog/[slug]/route");
    const GET = (routeModule as any).GET;

    const paramsPromise = Promise.resolve({ slug: "test-slug" });

    // Use global Request for testing
    const mockRequest = new Request("http://localhost:3000/api/blog/test-slug");

    // This should not timeout since we mocked the database
    const response = await GET(mockRequest as any, { params: paramsPromise });

    expect(response).toBeDefined();

    // Verify the response body
    const data = await response.json();
    expect(data).toBeDefined();
  });
});
