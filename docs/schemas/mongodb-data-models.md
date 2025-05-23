# MongoDB Data Models

This document outlines the MongoDB data models for the Portfolio Manager Dashboard application.

## Overview

The Portfolio Manager Dashboard uses MongoDB as its primary database for storing portfolio content, analytics, and user preferences. The document-oriented nature of MongoDB aligns well with the portfolio content structure, allowing for flexible schema evolution and efficient querying.

## Collections

### Projects

Stores information about portfolio projects.

```javascript
{
  _id: ObjectId,
  slug: String,                // URL-friendly identifier
  title: String,               // Project title
  summary: String,             // Brief project summary
  publishedAt: Date,           // Publication date
  technologies: [String],      // Array of technologies used
  tags: [String],              // Array of categorization tags
  images: [String],            // Array of image paths
  content: String,             // MDX content
  metadata: {                  // Additional metadata
    status: String,            // "draft", "published", "featured"
    featured: Boolean,         // Whether project is featured
    lastModified: Date,        // Last modification date
    views: Number,             // View count
    likes: Number,             // Like count
    githubRepo: String,        // GitHub repository URL
    liveUrl: String,           // Live project URL
  },
  dashboardData: {             // Dashboard-specific data
    progress: Number,          // Project completion percentage
    milestones: [              // Project milestones
      {
        title: String,
        date: Date,
        completed: Boolean,
        description: String
      }
    ],
    technologiesData: [        // Extended technology data
      {
        name: String,
        role: String,          // "primary", "secondary", "tertiary"
        icon: String           // Icon representation
      }
    ],
    features: [                // Feature tracking
      {
        title: String,
        description: String,
        status: String         // "implemented", "in-progress", "planned"
      }
    ],
    metrics: [                 // Custom project metrics
      {
        label: String,
        value: String,
        progress: Number,
        icon: String
      }
    ]
  }
}
```

### BlogPosts

Stores blog posts.

```javascript
{
  _id: ObjectId,
  slug: String,                // URL-friendly identifier
  title: String,               // Post title
  summary: String,             // Brief summary
  publishedAt: Date,           // Publication date
  tag: String,                 // Primary tag
  author: String,              // Author name
  content: String,             // MDX content
  metadata: {
    status: String,            // "draft", "published"
    lastModified: Date,        // Last modification date
    views: Number,             // View count
    readingTime: Number,       // Estimated reading time in minutes
    likes: Number              // Like count
  },
  dashboardData: {
    relatedPosts: [ObjectId],  // Related post references
    seoScore: Number,          // SEO optimization score
    engagementMetrics: {
      averageTimeOnPage: Number,
      bounceRate: Number,
      socialShares: Number
    }
  }
}
```

### Analytics

Stores analytics data for the portfolio.

```javascript
{
  _id: ObjectId,
  date: Date,                  // Date of analytics record
  type: String,                // "daily", "weekly", "monthly"
  pageViews: {
    total: Number,
    byPage: [
      {
        path: String,
        views: Number
      }
    ]
  },
  projectViews: [
    {
      projectId: ObjectId,     // Reference to Projects collection
      views: Number
    }
  ],
  blogPostViews: [
    {
      postId: ObjectId,        // Reference to BlogPosts collection
      views: Number
    }
  ],
  referrers: [
    {
      source: String,
      visits: Number
    }
  ],
  techViews: {                 // Views by technology
    technology: String,
    views: Number
  }
}
```

### UserPreferences

Stores user preferences for the dashboard.

```javascript
{
  _id: ObjectId,
  userId: String,             // User identifier
  dashboardLayout: {
    widgets: [
      {
        id: String,
        type: String,         // Widget type
        position: {
          x: Number,
          y: Number
        },
        size: {
          width: Number,
          height: Number
        },
        settings: Object       // Widget-specific settings
      }
    ]
  },
  theme: String,              // UI theme preference
  notificationSettings: {
    emailNotifications: Boolean,
    digestFrequency: String   // "daily", "weekly", "none"
  },
  contentEditorSettings: {
    defaultTemplate: String,
    autoSave: Boolean,
    autoSaveInterval: Number
  }
}
```

### ContentBackups

Stores backups of content before significant changes.

```javascript
{
  _id: ObjectId,
  contentType: String,         // "project" or "blogPost"
  contentId: ObjectId,         // Reference to original content
  version: Number,             // Version number
  timestamp: Date,             // Backup creation timestamp
  content: Object,             // Full content backup
  changeDescription: String    // Description of changes made
}
```

## Indexes

For optimal performance, the following indexes should be created:

```javascript
// Projects collection
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ "metadata.status": 1 });
db.projects.createIndex({ publishedAt: -1 });
db.projects.createIndex({ technologies: 1 });
db.projects.createIndex({ tags: 1 });

// BlogPosts collection
db.blogPosts.createIndex({ slug: 1 }, { unique: true });
db.blogPosts.createIndex({ "metadata.status": 1 });
db.blogPosts.createIndex({ publishedAt: -1 });
db.blogPosts.createIndex({ tag: 1 });

// Analytics collection
db.analytics.createIndex({ date: -1 });
db.analytics.createIndex({ type: 1, date: -1 });
```

## Data Migration Considerations

When migrating from file-based MDX content to MongoDB:

1. **Content Parsing** - Use gray-matter to extract frontmatter and content from MDX files
2. **One-time Import** - Create a script for initial import of all existing MDX files
3. **Image References** - Maintain the same image reference paths for compatibility
4. **Content Synchronization** - Consider options for bi-directional sync between MongoDB and filesystem for backup purposes

## Future Considerations

1. **Content Versioning** - Implement more robust versioning strategy for content changes
2. **Full-text Search** - Leverage MongoDB text search capabilities for content discovery
3. **Caching Layer** - Introduce Redis as a caching layer for frequently accessed content
4. **Aggregation Pipeline** - Use MongoDB aggregation for complex analytics and reporting

---

This document will be updated as the data model evolves throughout implementation.

_Last updated: May 19, 2025_
