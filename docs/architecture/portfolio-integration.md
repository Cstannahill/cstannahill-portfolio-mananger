# Integration with Existing Portfolio

This document outlines the integration strategy between the new Portfolio Manager Dashboard and the existing Next.js portfolio website.

## Integration Goals

1. **Seamless Experience** - Create a unified experience between the portfolio and its management system
2. **Non-Destructive Operations** - Ensure that the portfolio manager doesn't break or corrupt existing portfolio content
3. **Minimal Changes** - Minimize required changes to the existing portfolio codebase
4. **Bidirectional Sync** - Enable changes from either system to propagate to the other
5. **Graceful Fallbacks** - Ensure the portfolio continues to function even if the manager is offline or unavailable

## Architecture Overview

The integration follows a loosely coupled architecture where the portfolio website and management dashboard can operate independently yet share data effectively.

```
+------------------------+        +------------------------+
|                        |        |                        |
|  Portfolio Website     |        |  Portfolio Manager     |
|  (Next.js)             |        |  Dashboard             |
|                        |        |                        |
+------------------------+        +------------------------+
           |                                 |
           |                                 |
           v                                 v
+------------------------+        +------------------------+
|                        |        |                        |
|  Filesystem Storage    |<------>|  MongoDB Database      |
|  (MDX Files)           |  Sync  |                        |
|                        |        |                        |
+------------------------+        +------------------------+
           |                                 |
           |                                 |
           v                                 v
+------------------------+        +------------------------+
|                        |        |                        |
|  Git Repository        |<------>|  API Layer             |
|                        |  Hooks |                        |
|                        |        |                        |
+------------------------+        +------------------------+
```

## Integration Methods

Three complementary methods will be used for integration:

### 1. Shared Filesystem Access

For local development and self-hosted deployments where both systems have access to the same filesystem:

- Portfolio Manager reads and writes MDX files directly
- Portfolio Website reads from the same files
- File watchers trigger rebuilds when content changes

### 2. Database Synchronization

For deployments where direct filesystem access isn't practical:

- Portfolio Manager operates on MongoDB database
- Synchronization service exports data to MDX files
- Portfolio Website reads from exported files
- Changes trigger rebuilds via webhooks

### 3. API Integration

For dynamic data and real-time updates:

- Portfolio Manager exposes an API for dynamic data
- Portfolio Website calls the API for analytics and dynamic content
- Authentication ensures secure access

## MDX File Compatibility

### File Structure Preservation

The Portfolio Manager will maintain the exact file structure expected by the portfolio website:

```
/content
  /projects
    project-slug.mdx
  /blogs
    blog-post-slug.mdx
```

### Frontmatter Compatibility

All existing frontmatter fields will be preserved and enhanced:

```yaml
---
title: "Project Title"
description: "Project description"
date: "2023-06-15"
tags: ["react", "typescript"]
# Existing fields preserved

# New fields added by Portfolio Manager
lastUpdated: "2025-05-10"
analyticsId: "pm_12345"
---
```

### Component Compatibility

The Portfolio Manager will:

1. Preserve all custom MDX component usage
2. Add support for editing custom components
3. Maintain component import statements

Example preservation:

```jsx
// Original MDX
import { ProjectDemo } from '@/components/custom/ProjectDemo';

# Project Title

<ProjectDemo src="/demo.mp4" />

## Features
```

## Content Synchronization

### Bidirectional Sync Workflow

1. **Portfolio Website to Manager**

   - Initial import of existing MDX files into MongoDB
   - Periodic scanning for new or changed files
   - Import of manually added content

2. **Manager to Portfolio Website**
   - Export of MongoDB content to MDX files
   - Generation of static assets from uploaded media
   - Triggering of rebuild processes when content changes

### Conflict Resolution

When the same content is modified in both systems:

1. Detect conflicts using timestamps and checksums
2. Present conflict resolution UI in Portfolio Manager
3. Allow selection of which version to keep or merge changes
4. Keep versioned backups of all content

## Integration Points

### Filesystem Integration

```typescript
// Filesystem watcher in Portfolio Manager
import chokidar from "chokidar";
import { importMDXToDatabase } from "./importers";

const watcher = chokidar.watch("./content/**/*.mdx", {
  persistent: true,
  ignoreInitial: false,
});

watcher
  .on("add", (path) => importMDXToDatabase(path))
  .on("change", (path) => importMDXToDatabase(path))
  .on("unlink", (path) => removeFromDatabase(path));
```

### Database to MDX Export

```typescript
// Export service
export async function exportProjectToMDX(project) {
  const { title, description, content, frontmatter } = project;

  // Combine frontmatter
  const combinedFrontmatter = {
    title,
    description,
    ...frontmatter,
  };

  // Generate MDX
  const mdxContent = generateMDX(combinedFrontmatter, content);

  // Write to file
  await writeFile(`./content/projects/${project.slug}.mdx`, mdxContent);

  // Trigger webhook to rebuild portfolio if needed
  await triggerRebuild();
}
```

### API Integration

```typescript
// In Portfolio Website
import useSWR from "swr";

export function useProjectAnalytics(projectSlug) {
  const { data, error } = useSWR(
    `/api/analytics/projects/${projectSlug}`,
    fetcher
  );

  return {
    analytics: data,
    isLoading: !error && !data,
    isError: error,
  };
}
```

## Practical Implementation Steps

### 1. Initial Setup

1. **Content Analysis**

   - Analyze existing MDX structure and frontmatter
   - Document all custom components used
   - Create database schema mapping

2. **Database Import**

   - Create importers for projects and blog posts
   - Perform initial import of all content
   - Validate imported data integrity

3. **API Development**
   - Create shared API contracts for both systems
   - Implement core CRUD endpoints
   - Add authentication and authorization

### 2. Synchronization Development

1. **Export Mechanism**

   - Develop MDX export functionality
   - Ensure frontmatter compatibility
   - Test roundtrip (import -> export -> import)

2. **Change Detection**

   - Implement file change detection
   - Add database change tracking
   - Create conflict resolution strategies

3. **Rebuild Triggers**
   - Implement webhook endpoints
   - Create build automation scripts
   - Test end-to-end rebuild process

### 3. Enhanced Integration

1. **Real-time Updates**

   - Add WebSocket support for live updates
   - Implement optimistic UI updates
   - Add change notifications

2. **Media Management**

   - Develop unified asset management
   - Implement image optimization pipeline
   - Create shared media library

3. **Analytics Integration**
   - Add analytics tracking to portfolio
   - Collect and process data in the manager
   - Display visualizations in both systems

## Next.js Integration Details

### Custom API Routes

Add the following API routes to the existing Next.js portfolio:

```
/api/portfolio-manager
  /sync          - Trigger content sync
  /analytics     - Provide analytics data
  /refresh       - Trigger site rebuild
```

### Environment Configuration

Update the portfolio's environment configuration:

```env
# Portfolio Manager Integration
PORTFOLIO_MANAGER_URL=http://localhost:3001
PORTFOLIO_MANAGER_API_KEY=your_api_key
ENABLE_PORTFOLIO_MANAGER=true
```

### Next.js Config Changes

Minimal changes required to `next.config.js`:

```js
module.exports = {
  // Existing configuration...

  // Add rewrite rules for Portfolio Manager integration
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: `${process.env.PORTFOLIO_MANAGER_URL}/dashboard`,
      },
      // Other rewrites...
    ];
  },

  // Add webhook receiver
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Initialize webhook listener
    }
    return config;
  },
};
```

## Migration Path

### Phase 1: Read-Only Integration

1. Portfolio Manager can read existing content
2. Analytics data collection begins
3. No modifications to portfolio content yet

### Phase 2: Limited Write Access

1. Portfolio Manager can update limited frontmatter fields
2. Export to MDX begins but requires manual approval
3. Basic synchronization implemented

### Phase 3: Full Integration

1. Complete bidirectional sync implemented
2. Automated rebuild processes established
3. Conflict resolution system in place

### Phase 4: Enhanced Features

1. Real-time collaborative editing
2. Advanced media management
3. Integrated analytics dashboards

## Testing Strategy

1. **Content Integrity Tests**

   - Verify roundtrip import/export preserves all content
   - Test edge cases with complex MDX components
   - Validate frontmatter field preservation

2. **Synchronization Tests**

   - Test concurrent edits from both systems
   - Verify conflict detection and resolution
   - Measure sync performance with large content sets

3. **Integration Tests**
   - Validate API integrations under various conditions
   - Test webhooks and rebuilds
   - Verify error handling and recovery

## Fallback Mechanisms

To ensure the portfolio continues to function regardless of Portfolio Manager availability:

1. **Static Export Fallback**

   - Regular static exports of content as MDX
   - Git-based version control of exported content
   - Ability to rebuild from static exports alone

2. **API Degradation Handling**

   - Graceful degradation when APIs are unavailable
   - Local caching of critical data
   - Static alternatives for dynamic features

3. **Manual Override**
   - Tools for manual conflict resolution
   - Direct MDX editing capabilities
   - Emergency rebuild mechanisms

## Summary

The integration strategy prioritizes non-destructive operations, minimal changes to the existing portfolio, and a flexible, phased approach to implementation. By leveraging multiple integration methods—filesystem, database, and API—the system maintains compatibility while adding powerful management capabilities.

This approach allows the portfolio website to continue functioning as a standalone system while gaining the benefits of the Portfolio Manager Dashboard for content creation, analytics, and enhanced features.

---

This integration strategy will evolve as implementation progresses and requirements are refined.
