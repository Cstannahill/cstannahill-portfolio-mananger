# GitHub Repository Integration

This document outlines the plan for integrating GitHub repositories with the Portfolio Manager Dashboard, allowing automatic project import and synchronization.

## Overview

The GitHub Repository Integration feature enables you to maintain project metadata directly within your GitHub repositories. This approach allows you to document your projects as you build them, ensuring your portfolio stays up-to-date with minimal additional effort.

## Implementation Strategy

### 1. Project Metadata File Structure

Each project repository that you want to include in your portfolio should contain a special metadata file:

```
your-repo/
├── .portfolio/
│   ├── project.json    # Project metadata in JSON format
│   └── assets/         # Project images and other assets
│       ├── preview.png
│       └── ...
└── ... (rest of project)
```

#### Example `project.json` Structure

```json
{
  "title": "Project Name",
  "summary": "Brief project description",
  "publishedAt": "2025-05-19",
  "technologies": ["Next.js", "TypeScript", "MongoDB"],
  "tags": ["Web Development", "Full Stack", "Open Source"],
  "status": "completed",
  "featured": true,
  "links": {
    "live": "https://project-url.com",
    "github": "https://github.com/username/repo"
  },
  "content": "README.md",
  "images": [
    ".portfolio/assets/preview.png",
    ".portfolio/assets/dashboard.png"
  ],
  "metrics": [
    {
      "label": "Type Coverage",
      "value": "94%",
      "icon": "🔷",
      "progress": 94
    }
  ],
  "features": [
    {
      "title": "Feature One",
      "description": "Description of feature one",
      "status": "implemented"
    },
    {
      "title": "Feature Two",
      "description": "Description of feature two",
      "status": "planned"
    }
  ]
}
```

### 2. Import Methods

The Portfolio Manager will support multiple ways to import projects from GitHub:

#### Manual Import

- User enters a GitHub repository URL
- System clones/fetches the repository
- Checks for `.portfolio` directory and processes metadata
- Imports content and assets
- Creates the project in the Portfolio Manager

#### Scheduled Sync

- User configures GitHub accounts or specific repositories to monitor
- System periodically checks for new/updated projects
- Syncs changes to the Portfolio Manager database

#### Webhook Integration

- Setup GitHub webhooks on selected repositories
- Receive push notifications when `.portfolio` files change
- Automatically update project data in Portfolio Manager

### 3. Content Processing

When importing from GitHub, the system will:

1. Parse the `project.json` metadata file
2. Process the content file (typically README.md or another specified file)
3. Convert to MDX if needed
4. Import and optimize images
5. Store in the MongoDB database
6. Create relationship between the portfolio project and GitHub repository for future syncing

### 4. Technical Implementation

#### Repository Interaction

```javascript
// Using simple-git to interact with repositories
import simpleGit from "simple-git";

async function fetchProjectMetadata(repoUrl, branch = "main") {
  const git = simpleGit();
  const tempDir = `/tmp/repo-${Date.now()}`;

  try {
    // Clone repository (shallow clone for efficiency)
    await git.clone(repoUrl, tempDir, ["--depth=1", `--branch=${branch}`]);

    // Check if portfolio metadata exists
    const metadataPath = `${tempDir}/.portfolio/project.json`;
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

      // Process content
      if (metadata.content) {
        const contentPath = `${tempDir}/${metadata.content}`;
        if (fs.existsSync(contentPath)) {
          metadata.contentBody = fs.readFileSync(contentPath, "utf8");
        }
      }

      // Process images
      if (metadata.images && Array.isArray(metadata.images)) {
        metadata.processedImages = await processImages(
          tempDir,
          metadata.images
        );
      }

      return metadata;
    }
    return null;
  } finally {
    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
```

#### Webhook Handler

```javascript
// API route for GitHub webhook
export default async function handler(req, res) {
  const { body, headers } = req;

  // Verify webhook signature
  // ...

  // Check if the webhook is for .portfolio changes
  const changedFiles = body.commits.flatMap((commit) => [
    ...commit.added,
    ...commit.modified,
    ...commit.removed,
  ]);

  const portfolioChanges = changedFiles.some(
    (file) => file.startsWith(".portfolio/") || file === "README.md"
  );

  if (portfolioChanges) {
    // Trigger repository sync
    const repoUrl = body.repository.clone_url;
    await syncRepositoryProject(repoUrl);

    res.status(200).json({ message: "Project sync initiated" });
  } else {
    res.status(200).json({ message: "No portfolio changes detected" });
  }
}
```

### 5. User Interface

The Portfolio Manager will include:

1. **GitHub Integration Dashboard**

   - Connect GitHub accounts
   - View synced repositories
   - Manually trigger syncs

2. **Repository Browser**

   - Browse eligible repositories
   - Preview potential portfolio projects
   - Select repositories to import

3. **Import Configuration**
   - Set sync frequency
   - Configure automatic updates
   - Map GitHub metadata to portfolio fields

### 6. Benefits

This integration provides several key benefits:

1. **Single Source of Truth** - Project documentation lives with the code
2. **Documentation as Code** - Project details evolve alongside the code
3. **Automatic Updates** - Portfolio stays current as projects evolve
4. **Developer Workflow Integration** - Update portfolio without leaving development environment

### 7. Implementation Phases

#### Phase 1 (MVP)

- Manual import of repositories via URL
- Basic metadata parsing from `.portfolio/project.json`
- README.md as default content source
- Simple image importing

#### Phase 2

- Scheduled sync with GitHub repositories
- Multiple content source options
- Enhanced asset management
- Project relationship tracking

#### Phase 3

- Webhook integration
- Two-way sync (dashboard edits can update GitHub files)
- Multi-repository projects
- Analytics integration

## Example Workflow

1. Developer creates a new project repository
2. Adds `.portfolio/project.json` with basic metadata
3. As development progresses, updates the project.json and README.md
4. Portfolio Manager automatically detects changes and updates portfolio
5. Developer can enhance project details through the Portfolio Manager UI

## Conclusion

The GitHub Repository Integration feature creates a seamless workflow between development and portfolio management. By treating portfolio content as part of the project repository, it ensures documentation stays current and reduces duplicate work maintaining separate portfolio entries.

---

_Last updated: May 19, 2025_
