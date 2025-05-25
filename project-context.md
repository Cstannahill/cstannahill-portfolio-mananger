# Project Context: Portfolio Manager

## Overall State

### Implemented Features

- Core project and blog post CRUD functionality.
- User authentication with NextAuth.js.
- MongoDB integration for data persistence.
- Basic UI for managing projects and blog posts.
- AI integration for content generation (OpenAI, Ollama, Azure OpenAI).
- AI model management UI.
- TanStack Query for server state management.
- Shadcn/ui components for the UI.
- Dockerization setup.
- **Login/Logout Button**: Added a conditional Login/Logout button to the main dashboard header (`components/dashboard/Header.tsx`).
- **AI Chat Sidebar (`ChatSidebar.tsx`)**:
  - Fully implemented with API connection, localStorage history, and enhanced UI/UX (loading, errors, timestamps, copy, clear, side-by-side input).
  - Connected to `/api/ai/generate` backend API.
  - Implemented chat history persistence using `localStorage` (`portfolioManagerChatHistory` key).
  - Added a "Clear Chat" button.
  - AI messages now show loading indicators while waiting for a response.
  - Error messages from the API or AI are displayed within the AI message bubble.
  - Timestamps are displayed for each message.
  - A "Copy Message" button is available on AI messages.
  - Improved overall UI/UX with icons, better styling, empty state, and auto-scrolling.
  - Sends `taskIdentifier: "general_chat_conversation"` and conversation history to the backend.
- **Custom MDX Component Insertion (`MdEditor.tsx`)**:
  - `types/custom-mdx-components.ts` created with component definitions.
  - Dropdown menu for component insertion added to `MdEditor.tsx` toolbar.
  - Snippet insertion logic implemented.
  - Props aligned with `types/md-editor.ts`.
  - **Resolved Import/Type Issues**: Placeholder `MdxContent` and `ScrollArea` components created, and import paths in `MdEditor.tsx` corrected. `TextareaProps` import removed as it was not essential.

### Working Components

- Project creation, editing, and deletion forms.
- Blog post creation, editing, and deletion forms.
- User login and registration.
- AI settings page for configuring providers and models.
- AI generation for project descriptions and blog content.
- **Inline AI Prompt Enhancements (BlogForm)**:
  - `BlogForm.tsx`'s `handleAiGenerate` function updated to collect `title`, `excerpt`, and `content` values.
  - Implemented fallback logic for `taskContextInput` based on `taskIdentifier` ("generate_blog_title", "generate_blog_excerpt", "generate_blog_content_section"):
    - For title: uses existing title, then excerpt, then content.
    - For excerpt: uses existing excerpt, then title, then content.
    - For content section: uses existing content, then title, then excerpt.
    - If all relevant fields are empty, `taskContextInput` remains empty, signaling the backend to generate random content.
  - Added a dedicated "Generate Content Section" button next to the "Content" label in `BlogForm.tsx` for the `MdEditor`.
- **MdEditor MDX Preview**: The new `MdEditor` component now correctly displays live MDX previews, matching the legacy `react-mde` preview experience. **This is now fully functional and visually aligned.**
- **Dashboard Header**: `components/dashboard/Header.tsx` now displays a "Login" button if the user is not authenticated, and a user avatar dropdown with a "Sign out" option if authenticated.

### Completed Integrations

- NextAuth.js with credentials provider.
- MongoDB with Mongoose.
- OpenAI API.
- Ollama API.
- Azure OpenAI API.
- TanStack Query.

### Key Fixes Implemented

- Resolved TanStack Query v5 build error in `s:/Code/portfolio-manager/app/dashboard/settings/ai/page.tsx` by replacing `onSuccess` with `useEffect`.
- Fixed Next.js prerendering error in `s:/Code/portfolio-manager/providers/TanStackQueryProvider.tsx` by dynamically importing `ReactQueryDevtools`.
- **OpenAI Error Resolution**: Addressed a 404 error for the OpenAI model `openai-gpt-4-turbo` by modifying `callOpenAIAPI` in `s:/Code/portfolio-manager/app/api/ai/generate/route.ts` to remove any "openai-" prefix from the `selectedModelId` before making the API call.
- **Ollama Error Resolution**: Fixed Ollama connectivity issues for Dockerized environments by updating `callOllamaAPI` in `s:/Code/portfolio-manager/app/api/ai/generate/route.ts` to replace `localhost` or `127.0.0.1` with `host.docker.internal` in the Ollama instance URL when the `NEXT_PUBLIC_IS_DOCKERIZED` environment variable is true.
- **Added New OpenAI Model**: Included `gpt-4o-mini` in the list of available OpenAI models in `s:/Code/portfolio-manager/app/api/ai/models/route.ts`. The model identifier `gpt-4o-mini` was confirmed via web search.
- **Docker Configuration Update**: Added `NEXT_PUBLIC_IS_DOCKERIZED=true` to the `portfolio-manager` service in `docker-compose.yml` to enable correct Ollama host resolution in Dockerized environments.
- **.gitignore Update**: Added `package-lock.json` and `npm-shrinkwrap.json` to `.gitignore` due to the use of `pnpm`.
- **Ollama Model List Update**: Updated the list of available Ollama models in `s:/Code/portfolio-manager/app/api/ai/models/route.ts`. This included an initial update with 10 models, followed by the addition of `ollama-phi4`, `ollama-phi4-reasoning`, and `ollama-llama4` as per user requests. An erroneous empty object was also removed from the list. The capabilities for `ollama-llama4` were updated to include vision, coding, and reasoning, and its input types were updated to include images, based on user-provided information.
- **Ollama Model Research**: Conducted a web search to compare capabilities of newly added Ollama models, confirming their relevance for coding and text generation tasks.
- **`MdEditor.tsx` Preview Styling**:
  - Added a CSS class `md-editor-preview-pane` to the `TabsContent` component for the preview tab in `s:/Code/portfolio-manager/components/shared/MdEditor.tsx`.
  - Added CSS rules to `s:/Code/portfolio-manager/styles/globals.css` for the `md-editor-preview-pane` class. These styles aim to visually align the `MdEditor.tsx` preview with the legacy `react-mde` preview, including adjustments for padding, background color, borders, typography for headings, paragraphs, lists, blockquotes, code blocks, tables, and images.

## Immediate Next Steps

1.  **Test MDX Component Insertion**: Thoroughly test the functionality in `MdEditor.tsx`.
2.  **Test AI Content Insertion in `MdEditor.tsx`**: Verify the example "AI Summary" button and its interaction with `onAIClick`.
3.  **Backend AI Logic for Chat**: Ensure `/api/ai/generate/route.ts` correctly handles `"general_chat_conversation"` and conversation history. Consider streaming responses.
4.  **Testing AI Chat Functionality**: Test chat history, UI features, and response quality in `ChatSidebar.tsx`.
5.  **Implement Inline AI Prompt Enhancements (ProjectForm)**: Decide if `MdEditor` is ready for `ProjectForm.tsx` or if `handleAiGenerate` logic needs to be replicated similar to `BlogForm.tsx`.
6.  **Build Verification**: Run `pnpm run build` after testing current features.
7.  **Review UI for AI Model Selection** (if applicable).
8.  **Code Review & Refinement**: Review `ChatSidebar.tsx`, `MdEditor.tsx`, and related API routes.
9.  **Documentation**: Update for new features.
10. **MdEditor Rollout**: Plan integration of enhanced `MdEditor.tsx` across all forms once stable.
