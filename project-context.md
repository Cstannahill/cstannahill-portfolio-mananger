# Project Context

Copilot - Do not forget to update the project context after every action!
Important RULE:

- @nextjs Rule - Next.js 15+ Dynamic Routes Compliance: When generating Next.js dynamic route code, enforce these requirements:

  - Always declare `params` prop as `Promise<{ [key]: type }>` type
  - Use `async/await` syntax to resolve params - never synchronous access
  - Apply correct TypeScript types: `[slug]` → `{ slug: string }`, `[...slug]` → `{ slug: string[] }`, `[[...slug]]` → `{ slug?: string[] }`
  - Make page/layout components async functions when using params
  - Include try/catch error handling for param resolution
  - Apply Promise pattern to pages, layouts, and API route handlers consistently
  - For client components, use React\'s `use()` hook instead of await
  - Always destructure params after awaiting: `const { slug } = await params;`
  - Generate proper generateStaticParams functions for static generation

## Overall State

- **Architecture:**
  - Next.js 15+ App Router.
  - **Dynamic Route Compliance Audit:**
    - `app/projects/[slug]/page.tsx`: Audited and updated.
    - `app/dashboard/projects/[slug]/edit/page.tsx`: Audited and updated. **Refactored to correctly handle client-side data fetching and state management, resolving async Client Component errors.**
    - `app/blog/[slug]/page.tsx`: **Audited and fixed. Updated to correctly handle Next.js 15+ dynamic route patterns with proper async params handling, fixed TypeScript errors related to function return types and API response structure.**
- **Backend:**
  - Mongoose models defined in `models/`.
  - API endpoints for CRUD operations on projects, tags, technologies, and file uploads.
    - `GET /api/projects/[slug]`, `PUT /api/projects/[slug]`, `DELETE /api/projects/[slug]`
    - `GET /api/technologies`, `GET /api/tags`
    - `POST /api/upload` (used by `ImageManager.tsx`).
    - `GET /api/health`
  - **Standardized API Responses: All API routes now use `ApiResponseSuccess` and `ApiResponseError` helpers from `lib/api/response.ts` for consistent JSON output.**
    - `app/api/projects/route.ts` (GET, POST)
    - `app/api/projects/[slug]/route.ts` (GET, PUT, DELETE)
    - `app/api/tags/route.ts` (GET, POST)
    - `app/api/technologies/route.ts` (GET, POST)
    - `app/api/upload/route.ts` (POST)
    - `app/api/health/route.ts` (GET)
    - `app/api/blog/route.ts` (GET, POST)
    - `app/api/blog/[slug]/route.ts` (GET, PUT, DELETE)
  - Zod validation for API inputs.
- **Frontend:**
  - **Project Editing Functionality: Largely operational. Layout adjustments made to `ProjectForm` and `EditProjectPage` for better space utilization and header consistency.**
  - **`MultiSelectAutocomplete.tsx` error handling improved, including correction of toast notification import.**
  - **Project Dashboard (`app/dashboard/page.tsx`):**
    - **`DashboardStats` component now fetches and displays the total project count from the `/api/projects` endpoint. Other stats (Blog Posts, Page Views, Visitors) remain placeholders.**
    - **`RecentProjects` component now fetches and displays the 3 most recently updated projects from `/api/projects`, including their title, summary, status, and links to view/edit.**
  - **Project List Page (`app/dashboard/projects/page.tsx`):**
    - **Successfully updated to display `coverImage` or the first `images` array item for each project.**
  - **Project Editing Form (`components/projects/ProjectForm.tsx`):**
    - Handles both "create" and "edit" modes.
    - Uses `react-hook-form` and Zod for client-side validation.
    - **`content` field now uses `ReactMde` for rich MDX editing. The `generateMarkdownPreview` prop successfully renders `MDXLivePreview` directly within the "Preview" tab of `ReactMde`. This integration is working correctly, properly sized, and shows the correct live MDX preview, replacing the default Markdown preview and the previous separate `MDXLivePreview` pane.** Custom CSS in `styles/globals.css` styles the `ReactMde` toolbar.
    - **`ImageManager` component integrated for image uploads, reordering, removal, and cover image selection. Buttons within `ImageManager` no longer cause unintended form submissions.**
    - `MultiSelectCombobox` for `technologies` and `tags` (fetches data from APIs).
    - `sonner` for toast notifications.
    - **Integrated `useAiGenerator` hook for AI-assisted content generation (title, summary, content section). UI buttons added, and logic to update form fields with AI response is implemented and working. Error handling and loading states for AI operations are in place. Form elements are appropriately disabled during AI generation.**
  - **Project Edit Page (`app/dashboard/projects/[slug]/edit/page.tsx`):**
    - Fetches project data client-side.
    - Integrates `ProjectForm` for editing.
    - Delete functionality with confirmation dialog implemented.
    - **Layout adjusted for full-width content.**
  - **MDX Preview (`components/MDXLivePreview.tsx`):**
    - **Fixed "Expected 'jsxDEV'" error** by explicitly passing `jsx-runtime` and `jsx-dev-runtime` to the `evaluate` function.
    - **This component correctly renders full MDX with custom components and is now successfully integrated into `ReactMde`\'s preview tab, displaying correctly.**
  - **Blog Management Frontend (Dashboard):**
    - `app/dashboard/blog/page.tsx`: Created and updated to fetch and display blog post summaries. **Corrected client-side data fetching to align with the actual API response structure, resolving the issue where blog posts were fetched but not displayed.**
    - `components/blog/BlogForm.tsx`: Created and underwent multiple refinements. **TypeScript errors related to `react-hook-form`, Zod schema (`BlogPostFormInput` vs `BlogPostFormOutput`), and `MultiSelectCombobox` prop usage have been resolved. The `tags` field in the Zod schema is now `optional()`, and related type handling in `defaultValues`, `form.reset`, `onSubmit`, and `MultiSelectCombobox` has been adjusted accordingly. Integrated `useAiGenerator` hook for AI-assisted content generation (title, excerpt, content section). UI buttons added, and logic to update form fields with AI response is implemented and working.**
    - `components/ui/multi-select-combobox.tsx`: Created.
    - `app/dashboard/blog/create/page.tsx`: Created, utilizes `BlogForm.tsx`.
    - `app/dashboard/blog/[slug]/edit/page.tsx`: Created, utilizes `BlogForm.tsx`.
  - **Public-facing Blog Pages:**
    - `app/blog/page.tsx`: Created (public blog list page).
    - `app/blog/[slug]/page.tsx`: **Created and fixed. Resolved all TypeScript errors related to function signatures, API response handling, and Next.js 15+ dynamic route compliance. Added proper generateStaticParams function for static generation.**
  - **Known Issues in Edit Form:**
    - Minor styling discrepancies in the `MDXLivePreview` pane (when rendered inside `ReactMde`) compared to the final rendered output (can be addressed with a shared CSS module or refined global styles).
- **Layout & Navigation:**
  - **Redundant `Header` in dashboard layout removed. `SiteNavBar` is now the sole top navigation.**
  - **`ProjectForm` now uses full width of its container.**
  - **Dashboard Sidebar (`components/dashboard/Sidebar.tsx`): The "Settings" link now correctly points to `/dashboard/settings/ai`.**
- **Content/Integration, Testing, DevOps:** Stable as per previous updates.
- **AI Assistant Feature**:
  - Types for AI settings (`AI_PROVIDER`, `AiModel`, `AiSettings`) are defined in `types/ai-settings.ts`.
  - Types for AI generation request/response (`AiGenerateRequest`, `AiGenerateResponse`) are defined in `types/ai-generate.ts`.
  - All AI related types are exported via `types/index.ts`.
  - `AiSettingsForm.tsx` component created for users to input AI preferences.
  - AI settings page (`app/dashboard/settings/ai/page.tsx`) created to host the form.
    - Loads existing AI settings for the user via `/api/settings/ai` (GET).
    - Saves AI settings for the user via `/api/settings/ai` (PUT).
    - Dynamically fetches available AI models based on the selected provider by calling `/api/ai/models` (GET).
  - User model (`models/User.ts`) updated to include an `aiSettings` field.
  - API route (`app/api/settings/ai/route.ts`) created for GET and PUT operations on user AI settings, with Zod validation. **The Zod schema in this route has been updated to correctly validate provider-specific settings (Ollama URL, API keys for OpenAI, Anthropic, Vertex AI). The database connection call has been corrected to use `connectToDatabase`. The usage of `ApiResponseSuccess` and `ApiResponseError` helper functions has been corrected to align with their definitions, resolving previous TypeScript errors.**
  - API route (`app/api/ai/models/route.ts`) created to provide a list of mock AI models based on the selected provider.
  - New API route (`app/api/ai/generate/route.ts`) created for handling AI content generation requests.
    - **Authenticates the user and retrieves their saved AI settings.**
    - **Accepts a `taskIdentifier` and `taskContext` in the POST request body.**
    - **Implemented actual SDK calls for Ollama, OpenAI, Anthropic, and Vertex AI, replacing mock functions. This includes API key handling and prompt construction. Added logging for Vertex AI authentication method to clarify reliance on Application Default Credentials (ADC) or `GOOGLE_APPLICATION_CREDENTIALS` environment variable.**
    - **Returns the generated content (as a string) or an error message, along with debug information. Response handling adjusted to manually construct JSON to ensure type compatibility.**
  - **Client-side hook `lib/hooks/useAiGenerator.ts` created to interact with the `/api/ai/generate` endpoint. Includes loading and error states. The hook now correctly expects a string as `data` in the `AiGenerateResponse`.**

## Immediate Next Steps

- **Run `npm run build` to check for any remaining build errors.**
- **API Key Management & Security:**
  - Further refine how API keys are stored (e.g., consider encryption if stored in DB, or recommend environment variables for production). Ensure Vertex AI authentication (e.g. `GOOGLE_APPLICATION_CREDENTIALS` or API key environment variable `GOOGLE_API_KEY`) is properly handled and documented for production environments.
- **Testing & Error Handling:**
  - Write unit and integration tests for all new AI-related functionalities, especially the `/api/ai/generate` route with different providers and the `useAiGenerator` hook.
  - Test the AI integration in `BlogForm.tsx` and `ProjectForm.tsx` thoroughly with different providers and scenarios.
  - Continue comprehensive error handling audit for the new AI generation logic, both backend and frontend.
- **Markdown Linting / Formatting:**
  - Implement a markdown linter or formatter for the markdown editors throughout the application.
  - This should include syntax highlighting, linting, and formatting for MDX content.
  - Ensure that the linter/formatter is applied before saving the content to the database.
- Implement delete functionality for blog posts on `s:\\Code\\portfolio-manager\\app\\dashboard\\blog\\page.tsx`.
- **Verify that the blog list page (`app/dashboard/blog/page.tsx`) now correctly displays blog posts and the "Create New Post" button is functional.**
- Test the fixed blog post page (`app/blog/[slug]/page.tsx`) to ensure proper functionality with actual data.
- Implement project search and filtering on the dashboard.
- Add project status management to model and UI.
- Add project duplication/cloning functionality.
- Review `generateStaticParams` for `app/projects/[slug]/page.tsx`.
- **Styling:** Create and apply a CSS module or refine global styles to ensure `MDXLivePreview` (when rendered within `ReactMde`) exactly matches the styling of the final rendered MDX content on the public-facing project pages. <-- Low priority>

## Data Model Reference (MongoDB & MDX Frontmatter)

Reflects fields in Mongoose schemas (`models/`) and frontmatter properties defined in `docs/from-portfolio/content-reference.md`.

- **Project:**
  - **DB & API:** `_id`, `title` (string, required), `summary` (string, required), `slug` (string, unique, required), `content` (MDX string), `publishedAt` (Date, required), `technologies` (array of ObjectId refs to Technology), `tags` (array of ObjectId refs to Tag), `images` (array of strings - paths), `coverImage` (string - path), `demoUrl` (string), `sourceUrl` (string), `status` (enum: draft, published, archived), `featured` (boolean), `analytics` (object), `createdAt` (Date), `updatedAt` (Date).
  - **MDX Frontmatter (subset, see `content-reference.md` for full list & UI mapping):** `title`, `publishedAt` (or `date`), `summary` (or `excerpt`), `technologies` (array of strings), `tags` (array of strings), `images` (array of strings - paths), `coverImage` (string - path), `demoUrl`, `sourceUrl`, `slug`.
  - **`ProjectForm.tsx` Zod Schema (Client-side):** `title`, `summary`, `slug`, `content`, `publishedAt`, `technologies` (array of strings, optional), `tags` (array of strings, optional), `images` (array of strings), `coverImage` (string), `demoUrl`, `sourceUrl`, `status`, `featured`.
- **BlogPost:**
  - **DB & API:** `_id`, `title` (string, required), `excerpt` (string, required), `slug` (string, unique, required), `content` (MDX string), `publishedAt` (Date, required), `tags` (array of ObjectId refs to Tag), `coverImage` (string - path), `images` (array of strings - paths), `createdAt` (Date), `updatedAt` (Date).
  - **MDX Frontmatter (subset, see `content-reference.md`):** `title`, `publishedAt` (or `date`), `excerpt` (or `summary`), `tags` (array of strings), `coverImage`, `images`, `slug`.
  - **`BlogForm.tsx` Zod Schema (Client-side):** `title`, `slug`, `excerpt` (optional), `content`, `publishedAt` (Date), `tags` (array of strings, optional), `coverImage` (URL string, optional).
- **Tag:** `_id`, `name` (string, unique, required), `description` (string), `color` (string), `icon` (string), `createdAt` (Date), `updatedAt` (Date).
- **Technology:** `_id`, `name` (string, unique, required), `description` (string), `color` (string), `icon` (string), `createdAt` (Date), `updatedAt` (Date).
- **User:** (Details managed by NextAuth.js, standard fields like `name`, `email`, `image`, `role`).

## UI/UX Standards

- **Forms:** All forms must be accessible (ARIA attributes, keyboard navigable), include inline validation feedback, and provide clear error summaries.
- **Navigation:** Utilize shadcn/ui components like `Button`, `DropdownMenu`, `Avatar` for interactive elements. Ensure consistent styling and behavior across the application.
- **MDX Content:** All MDX content should support the custom components detailed in `docs/from-portfolio/content-reference.md` (e.g., `Callout`, `ProjectTechStack`, `ProjectTimeline`, etc.).
- **Image Handling:** Image uploads should support drag-and-drop, previews, reordering, removal, and cover image selection.
- **Responsive Design:** Employ grid layouts for project/blog index pages, card-based layouts for summaries, and ensure a functional mobile menu and overall responsiveness.
- **Theming:** Support dark mode with dynamic color tokens. Ensure WCAG AA compliance for color contrast and accessibility.

## Integration & Content Sync

- **MDX Structure:** MDX export/import processes must preserve frontmatter, custom component usage, and the established file structure for `/content/projects/` and `/content/blog/` as per `docs/from-portfolio/content-reference.md`.
- **Image Paths & Guidelines:** All images must reside in `/public/images/` with subdirectories for projects and blog posts. Use absolute paths in content. Adhere to recommended formats and sizes.
- **Portfolio Site Sync:** The system supports API-based and file-based synchronization for integration with the main portfolio site. Real-time updates via webhooks or build triggers are planned.

## Testing & Validation Strategy

- **Frontmatter Validation:** All MDX content must be validated for required frontmatter fields (`title`, `publishedAt`/`date`, `summary`/`excerpt`) before being processed or published.
- **Automated Testing:**
  - Unit tests for individual components, utility functions, and MDX components.
  - Integration tests for API endpoints, data flow, and interactions between components.
- **Manual Testing:**
  - Responsive design testing across various screen sizes and devices.
  - Accessibility testing (keyboard navigation, screen reader compatibility, ARIA compliance).
  - Cross-browser compatibility testing.

## Known Issues / Challenges

- `app/dashboard/projects/[slug]/edit/page.tsx` uses client-side data fetching. For a true 404 on initial load if the project doesn\'t exist, it might benefit from a Server Component wrapper that can use `notFound()` directly.
- Some dashboard statistics and advanced search/filtering functionalities are currently placeholders or partially implemented.

## Documentation Structure (`/docs`)

- **`/docs/architecture/`:** Diagrams and explanations of the system architecture.
- **`/docs/deployment/`:** Guides and notes on deploying the application.
- **`/docs/from-portfolio/`:** Contains `content-reference.md` detailing MDX frontmatter, custom components, and UI mapping for content sourced from or synced with the main portfolio.
- **`/docs/schemas/`:** JSON schemas or descriptions for data models and API payloads.
- **`/docs/user-guides/`:** How-to guides for users or developers.
- **`docs/tech-stack.md`:** Detailed breakdown of technologies used.
- **`docs/progress.md`:** Tracks development progress and major milestones.
- **`docs/documentation-guide.md`:** Guidelines for contributing to documentation.
- **`docs/github-integration.md`:** Information on GitHub integration.
- **`docs/husky-explanation.md`:** Explanation of Husky pre-commit hooks.
- **`docs/technical-requirements.md`:** Original technical requirements for the project.

This context file will be updated after each significant action or change to the project.
