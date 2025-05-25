// filepath: s:/Code/portfolio-manager/lib/utils/markdown.ts
import prettier from "prettier";

/**
 * Formats MDX or Markdown content using Prettier with MDX plugin.
 * @param content The MDX/Markdown string to format.
 * @returns Formatted content string.
 */
export async function formatMDX(content: string): Promise<string> {
  try {
    const formatted = await prettier.format(content, {
      parser: "mdx",
      singleQuote: true,
      trailingComma: "all",
    });
    return formatted;
  } catch (error) {
    console.error("[formatMDX] Formatting error:", error);
    // On error, return original content to avoid blocking save
    return content;
  }
}
