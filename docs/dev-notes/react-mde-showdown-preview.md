# ReactMde and Showdown.Converter for Markdown Preview

This document provides a quick reference on how the `react-mde` component can use `Showdown.Converter` for its built-in Markdown preview tab. This method was previously used in `ProjectForm.tsx` before switching to a full MDX preview.

## Overview

`react-mde` is a Markdown editor component for React. It offers a "Write" tab for editing Markdown and a "Preview" tab to see the rendered HTML. The preview generation is customizable.

One way to generate this preview is by using the `Showdown.Converter` library, which converts Markdown to HTML.

## Implementation

In `ProjectForm.tsx`, this was achieved as follows:

1.  **Import `Showdown`:**

    ```typescript
    import Showdown from "showdown";
    ```

2.  **Instantiate `Showdown.Converter`:**
    A converter instance is created, often with specific options like table support, simplified auto-links, etc.

    ```typescript
    const mdeConverter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
    });
    ```

3.  **Use `generateMarkdownPreview` Prop:**
    The `ReactMde` component has a `generateMarkdownPreview` prop. This prop accepts a function that takes the current Markdown string as input and should return a Promise that resolves to the HTML string (or a ReactNode) to be rendered in the preview pane.

    ```tsx
    <ReactMde
      // ... other props
      generateMarkdownPreview={(markdown) =>
        Promise.resolve(mdeConverter.makeHtml(markdown))
      }
      // ... other props
    />
    ```

This setup allows `react-mde` to display a live HTML preview of the Markdown content as the user types, using Showdown for the conversion. While effective for standard Markdown, this method does not process MDX-specific syntax or custom components. For full MDX preview, a different approach (like using `@mdx-js/mdx`'s `evaluate` function with custom components) is necessary.
