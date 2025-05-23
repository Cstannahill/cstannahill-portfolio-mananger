# Project Context

Copilot - Do not forget to update the project context after every action!

## Overall State

- Portfolio manager app with Next.js, MongoDB, and strict TypeScript typing.
- Backend: Mongoose models and API endpoints for Project, Tag, Technology (with Zod validation and error handling).
- Frontend: **Project creation form fully functional** (multi-tab, image upload, multi-select for tags/technologies, MDX content editor with component palette), **dashboard project list successfully populating from database** (fetches real data, supports legacy fields).
- UI: Accessible, dark mode, keyboard navigation, and live MDX preview (renders all referenced MDX components, including Callout, ProjectTechStack, ProjectTimeline, ProjectFeatureShowcase, ProjectMetrics, ProjectChallengeCard).
- Component insertion modal supports searchable icon select and large icon lists. Nested form hydration error is resolved.
- All major types organized in `types/` and imported via barrel file.
- MDXLivePreview supports all custom project MDX components, resolving the previous runtime error.
- **Project creation workflow complete**: inline validation, accessible error messages for all required fields, successful database persistence.
- **Dashboard projects route (`/dashboard/projects`) fully operational**: displays real project data from MongoDB with proper error handling and loading states.
- **Unit tests added for all custom MDX components and MDXLivePreview.**
- **Project view page (`app/projects/[slug]/page.tsx`) implemented**: strictly typed, accessible, robust error handling, renders all project fields and MDX content with live preview.
- **Dashboard/projects View button implemented**: Each project in the dashboard list includes a working View button linking to the public project view page (`/projects/[slug]`).
- **API fetch bug fixed**: getProjectBySlug now uses a relative URL if NEXT_PUBLIC_API_URL is not set, preventing 'undefined/api/projects/[slug]' errors.
- **Dockerfile updated to use `node:20-alpine`** and missing Babel plugin (`@babel/plugin-transform-runtime`) installed. Docker images/containers rebuilt and Next.js now starts correctly in Docker.
- **Root-level babel.config.js removed** to allow Next.js to use SWC (required for next/font and other features). Test-only Babel config moved to **tests**/babel.config.js and Jest config updated accordingly.
- **API route tests created** in **tests**/api/ to verify dynamic route param destructuring and compliance with Next.js 15+ requirements.
- **All dynamic API routes are Next.js 15+ compliant** and build passes successfully.

## Immediate Next Steps

- **Implement project editing functionality:**
  - Create edit form (based on creation form)
  - Implement update API endpoints with validation
  - Integrate image management for editing (reordering, cover selection, removal functionality)
- Add project deletion capability with confirmation dialogs.
- **Update dashboard components with real data:**
  - Connect Projects card statistic in upper left to display real project count from database
  - Populate Recent Projects section with actual recent projects from database
- Implement project search and filtering on dashboard.
- Add project status management (draft, published, archived).
- Standardize API response shapes across all endpoints.
- Add project duplication/cloning functionality.
