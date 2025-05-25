/**
 * @file types/custom-mdx-components.ts
 * @description Defines types for custom MDX components that can be inserted via the MdEditor.
 */

/**
 * Represents a custom MDX component that can be inserted into the editor.
 * @interface
 */
export interface CustomMdxComponent {
  /** The display name of the component in the insertion menu. */
  label: string;
  /** The MDX snippet to insert. Use {{cursor}} as a placeholder for cursor position after insertion. */
  snippet: string;
  /** A brief description of the component, shown as a tooltip or help text. */
  description?: string;
  /** Optional category for grouping components in the menu. */
  category?: string;
}

/**
 * A list of predefined custom MDX components available for insertion.
 * @constant
 */
export const AVAILABLE_MDX_COMPONENTS: CustomMdxComponent[] = [
  {
    label: "Callout",
    snippet: '<Callout type="info">{{cursor}}</Callout>',
    description:
      "A dismissable callout box for important information or warnings.",
    category: "Content Blocks",
  },
  {
    label: "Figure with Caption",
    snippet: `<Figure caption="Figure 1: {{cursor}}">
  <img src="your-image-url.jpg" alt="Descriptive alt text" />
</Figure>`,
    description: "Embed an image with a caption.",
    category: "Media",
  },
  {
    label: "Code Block",
    snippet:
      '<CodeBlock lang="tsx" title="Example Code">{{cursor}}</CodeBlock>',
    description: "A syntax-highlighted code block with an optional title.",
    category: "Formatting",
  },
  {
    label: "YouTube Embed",
    snippet: '<YouTube videoId="{{cursor}}" title="Descriptive Video Title" />',
    description: "Embed a YouTube video.",
    category: "Media",
  },
  {
    label: "Tweet Embed",
    snippet: '<Tweet id="{{cursor}}" />',
    description: "Embed a Tweet.",
    category: "Media",
  },
  {
    label: "Two Column Layout",
    snippet: `<TwoColumnLayout>
  <Column>
    {{cursor}}Left column content.
  </Column>
  <Column>
    Right column content.
  </Column>
</TwoColumnLayout>`,
    description: "A simple two-column layout.",
    category: "Layout",
  },
];
