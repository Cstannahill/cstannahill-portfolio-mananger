# Project Context

Copilot - Do not forget to update the project context after every action!

## Overall State

- Portfolio manager app with Next.js, MongoDB, and strict TypeScript typing.
- Backend: Mongoose models and API endpoints for Project, Tag, Technology (with Zod validation and error handling).
- Frontend: Project creation form (multi-tab, image upload, multi-select for tags/technologies, MDX content editor with component palette), dashboard project list (fetches real data, supports legacy fields).
- UI: Accessible, dark mode, keyboard navigation, and live MDX preview (renders all referenced MDX components, including Callout, ProjectTechStack, ProjectTimeline, ProjectFeatureShowcase, ProjectMetrics, ProjectChallengeCard).
- Component insertion modal supports searchable icon select and large icon lists. Nested form hydration error is resolved.
- All major types organized in `types/` and imported via barrel file.
- MDXLivePreview supports all custom project MDX components, resolving the previous runtime error.
- **Project creation form now includes inline validation and accessible error messages for all required fields, including tags and technologies.**
- **Unit tests added for all custom MDX components and MDXLivePreview.**
- **Project view page (`app/projects/[slug]/page.tsx`) implemented: strictly typed, accessible, robust error handling, renders all project fields and MDX content with live preview.**
- **Dockerfile updated to use `node:20-alpine` and missing Babel plugin (`@babel/plugin-transform-runtime`) installed. Docker images/containers rebuilt and Next.js now starts correctly in Docker.**
- **Root-level babel.config.js removed to allow Next.js to use SWC (required for next/font and other features). Test-only Babel config moved to **tests**/babel.config.js and Jest config updated accordingly.**
- **API route tests created in **tests**/api/ to verify dynamic route param destructuring and compliance with Next.js 15+ requirements.**
- **Temporary non-compliant fakebad route and test removed after verifying test enforcement. Build now passes and all dynamic API routes are compliant.**

## Immediate Next Steps

- Add more unit tests for frontend and backend logic.
- Enhance image management (reordering, cover selection, removal).
- Standardize API response shapes across endpoints.
- Implement project editing functionality.
