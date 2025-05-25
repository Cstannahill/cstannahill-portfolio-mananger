# MD Editor Documentation

This document provides a comprehensive overview of the four current MDX editor implementations in the Portfolio Manager Dashboard. Each section outlines features, architecture, components used, and integration points. This will serve as a basis for extracting a reusable `MdEditor` component.

---

## 1. Project Creation Editor

**Location:**

- Component: `components/projects/ProjectForm.tsx` (mode: "create")
- Page: `app/dashboard/projects/create/page.tsx`

### Features

- **Rich MDX Editing** via ReactMde:
  - Dynamically imported to avoid SSR issues (`React.lazy`).
  - "Write" tab: textarea for raw MDX input.
  - "Preview" tab: live MDX rendering using `MDXLivePreview` component.
- **AI-Assisted Generation**:
  - Buttons to auto-generate title, summary, content segments.
  - Interacts with `/api/ai/generate` via `useAiGenerator` hook.
  - Displays loading states and error toasts.
- **Markdown Formatting** on submit:
  - Uses `formatMDX` util (Prettier + MDX plugin) to format MDX before saving.
- **Image Management**:
  - Integrated `ImageManager` for uploads, reordering, removal, and cover selection.
- **Form Validation & Submission**:
  - `react-hook-form` + Zod schema for client-side validation.
  - Inline error messages via shadcn/ui `FormItem`, `FormMessage`.
- **Accessibility & Styling**:
  - Keyboard navigable, ARIA attributes on popovers and calendars.
  - Tailwind CSS classes for layout and responsive design.

### Architecture & Implementation

1. **Form setup**: `useForm<ProjectFormData>` with `zodResolver`.
2. **MDX Editor**: `<ReactMde>` with `generateMarkdownPreview={() => <MDXLivePreview mdx={value} />}`.
3. **AI Buttons**: Dispatch tasks via `triggerAiGenerate(taskIdentifier, { /* context */ })`.
4. **Image Manager**: `<ImageManager images={...} onChange={...} />` integrated as a controlled input.
5. **Submit handler**: formats MDX, calls `/api/projects` or `/api/projects/[slug]`.

---

## 2. Project Editing Editor

**Location:**

- Same Component: `components/projects/ProjectForm.tsx` (mode: "edit")
- Page: `app/dashboard/projects/[slug]/edit/page.tsx`

_All features mirror the Project Creation Editor_, with additional:

- **Data Loading**:
  - Fetch initial project via client-side fetch or `useEffect`.
  - Populate form default values, including MDX content.
- **Delete Functionality**:
  - Confirmation dialog integrated using shadcn/ui `AlertDialog`.
- **Router Refresh**:
  - Uses `useRouter().refresh()` after update or delete to sync SSG.

---

## 3. Blog Creation Editor

**Location:**

- Component: `components/blog/BlogForm.tsx` (mode: "create")
- Page: `app/dashboard/blog/create/page.tsx`

### Feature

- **Rich MDX Editing** via ReactMde:
  - Write/Preview tabs with `Showdown` preview (older integration via ReactMde/Showdown).
- **AI-Assisted Generation** for title, excerpt, content section.
- **Markdown Formatting**:
  - Integrated `formatMDX` before POST to `/api/blog`.
- **Tags Combobox**:
  - Multi-select combobox for tags fetched from `/api/tags`.
- **Form Validation**:
  - `react-hook-form` + Zod.
- **Accessibility & UI**:
  - Shadcn/ui form components, buttons, calendar popover.

### Architecture & Implementations

1. **Form setup**: `useForm<BlogPostFormInput>` + `zodResolver(blogPostSchema)`.
2. **ReactMde**: `<ReactMde>` with `Showdown.Converter` for built-in preview.
3. **AI Buttons**: Similar pattern via `useAiGenerator`.
4. **Tag Options**: fetch tags in `useEffect`, transform to combobox options.
5. **Submit handler**: formats MDX, sends to `/api/blog`.

---

## 4. Blog Editing Editor

**Location:**

- Component: `components/blog/BlogForm.tsx` (mode: "edit")
- Page: `app/dashboard/blog/[slug]/edit/page.tsx`

_All features mirror the Blog Creation Editor_, plus:

- **Data Loading & Reset**:
  - `useEffect` to `form.reset()` defaults from `initialData`.
- **Delete Button** on management page (separate) for blog entries.

---

## 5. Comparison & Feature Breakdown

**Brief Annotation:**
This section compares the Project and Blog MDX editors to identify shared functionality and unique behaviors, forming the foundation for a unified `MdEditor` component.

### 5.1 Common Features

- **MDX Input & Preview:** Both editors use ReactMde for write/preview tabs (text input + live preview component).

- **AI-Assisted Toolbar:** Title, excerpt/summary, and content generation via `useAiGenerator`.

- **Markdown Formatting:** Invoke `formatMDX` on save to ensure consistency.

- **Validation Integration:** Powered by `react-hook-form` and Zod schemas for client-side checks.

- **Accessibility & Styling:** Keyboard navigation, ARIA roles, Tailwind CSS for responsive design.

- **Dynamic Import & SSR Handling:** Lazy-load Monaco or ReactMde to avoid server-side rendering issues.

### 5.2 Divergent Features

- **Project Editors:**

  - **Image Management:** `ImageManager` handles uploads, ordering, and cover selection.

  - **Multiple Content Segments:** AI buttons generate distinct sections (e.g., challenges, features).

- **Blog Editors:**

  - **Tag Selection:** Multi-select combobox for tags from `/api/tags`.

  - **Live Preview:** Render MDX content using `MDXLivePreview` component, with optional additional preview modes/tabs.

### 5.3 Final `MdEditor` Component Requirements

1. **Configurable Toolbar:**

   - Accept props to enable/disable AI buttons (title, summary, sections).

   - Support custom toolbar items (e.g., image upload, tag insert).

2. **Controlled Input API:**

   - `value: string` and `onChange(value: string): void` for form integration.

   - `initialValue?: string | Promise<string>` for edit mode data loading.

3. **Preview Renderer:**

   - Render live preview using the `MDXLivePreview` component by default (replacing legacy Showdown).

4. **Formatting Hook:**

   - `onFormat?: (raw: string) => Promise<string>` to integrate `formatMDX` before save.

5. **Plugin Slots:**

   - Expose extension points for custom panels (e.g., image manager, tag combobox).

6. **Mode Handling:**

   - `mode: 'create' | 'edit'` to adjust lifecycle (reset, delete confirmation).

   - `onReset?(): void` and `onDelete?(): Promise<void>` callbacks.

7. **Error & Loading States:**

   - Internal state for async actions (AI calls, formatting).

   - Propagate errors via callbacks or context.

8. **Accessibility Compliance:**

   - Keyboard shortcuts for tab switching, toolbar actions.

   - Proper ARIA labels for dialogs and inputs.

9. **Theming & Styling:**

   - Accept className/style props or theme context for Tailwind/CSS-in-JS integration.

10. **Performance Considerations:**

    - Debounce preview rendering for large content.

    - Virtualize long documents if needed.

11. **SSR Safety:**

    - Lazy-load Monaco with `next/dynamic` or React.lazy; fallback to a pulsing skeleton via shadcn/ui `Skeleton` component.

### 5.4 Current Implementation Status

- Both `ProjectForm.tsx` and `BlogForm.tsx` still import and configure ReactMde (with Showdown for blog) directly within each component.
- There is no shared editor component in use today—each form maintains its own MDX editor setup.
- The unified `MdEditor` must replace these inline usages and ensure feature parity before removal of existing implementations.

---

## 6. Implementation Plan

1. **Define Types**: Create `types/md-editor.ts` with `MdEditorProps`, `ToolbarConfig`, and plugin slot interfaces. Add barrel export in `types/index.ts`.
2. **Component Scaffold**: Create `components/shared/MdEditor.tsx`:
   - Import types and dependencies (`@monaco-editor/react`, `MDXLivePreview`, `Skeleton`).
   - Define functional component with props, default behaviors.
   - Implement write/preview tabs with lazy-loaded Monaco.
   - Integrate toolbar section and plugin slots.
   - Expose `ref` for imperative reset/delete actions.
3. **Formatting & AI Integration**:
   - Hook into `onFormat` prop calling `formatMDX`.
   - Render AI toolbar buttons based on `ToolbarConfig`.
4. **Preview Renderer**:
   - Delegate to `renderPreview` prop or default to `MDXLivePreview`.
5. **Error & Loading Management**:
   - Use local state for async operations.
   - Show `Skeleton` fallback during SSR/loading.
6. **Accessibility & Styling**:
   - Add keyboard navigation for tabs and toolbar.
   - ARIA attributes on interactive elements.
   - Accept `className` for styling overrides.
7. **Testing Setup**:
   - Add unit tests in `__tests__/MdEditor.test.tsx` covering props, tabs, formatting, plugin slots.
   - Mock Monaco and MDXLivePreview rendering.

## 7. Migration Strategy

1. **Parallel Integration**: In each form (`ProjectForm`, `BlogForm`), import and render `MdEditor` next to existing ReactMde instance under a feature flag.
2. **Verification**: Compare output and behavior (preview, formatting, AI) against legacy editors.
3. **Iterate**: Refine `MdEditor` props and implementation until feature parity achieved.
4. **Cleanup**: Remove inline ReactMde and Showdown code, switch fully to `MdEditor`.
5. **Documentation Update**: Mark legacy implementations deprecated and update project context roadmap.

---

**Next:** Begin scaffolding `MdEditor` types and component without altering existing editor code. Ensure all original editor setups remain intact until testing completes.
