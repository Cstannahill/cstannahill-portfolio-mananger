# Normalized MongoDB Database Design

This document outlines the complete, normalized database design for the Portfolio Manager Dashboard application using MongoDB.

## Design Principles

While MongoDB is a NoSQL database and doesn't enforce traditional relational normalization, we will follow these principles to ensure a well-structured, maintainable database:

1. **Appropriate Embedding vs. Referencing** - Use embedding for data that is always accessed together and referencing for shared, frequently updated, or large datasets
2. **Controlled Redundancy** - Allow strategic redundancy only where it significantly improves query performance
3. **Data Integrity** - Maintain consistency using application-level validation and constraints
4. **Schema Validation** - Use MongoDB schema validation to enforce document structure
5. **Indexing Strategy** - Define proper indexes to optimize query performance
6. **Atomicity** - Design operations to maintain atomicity for related data changes

## Core Collections

### Users

Stores user information for authentication and personalization.

```javascript
{
  _id: ObjectId,
  email: String,               // Email address (unique)
  passwordHash: String,        // Hashed password (for credential auth)
  name: String,                // User's name
  role: String,                // "admin", "editor", "viewer"
  createdAt: Date,             // Account creation timestamp
  lastLogin: Date,             // Last login timestamp
  isActive: Boolean,           // Whether the account is active
  settings: {
    theme: String,             // UI theme preference
    defaultView: String,       // Default dashboard view
    notifications: {
      email: Boolean,          // Email notification preference
      digest: String           // "daily", "weekly", "none"
    }
  },
  githubAccounts: [{
    username: String,          // GitHub username
    accessToken: String,       // Encrypted OAuth access token
    connectedAt: Date          // Connection timestamp
  }]
}
```

### Technologies

Normalized collection for technology references.

```javascript
{
  _id: ObjectId,
  name: String,                // Technology name (unique)
  slug: String,                // URL-friendly identifier
  category: String,            // "language", "framework", "tool", "platform"
  description: String,         // Brief description
  website: String,             // Official website URL
  icon: String,                // Path to icon or emoji representation
  color: String,               // Brand color hex code
  metrics: {
    projectsCount: Number,     // Count of projects using this technology
    blogPostsCount: Number     // Count of blog posts mentioning this technology
  },
  tags: [String],              // Associated tags
  createdAt: Date,             // First time this technology was added
  updatedAt: Date              // Last time this technology was updated
}
```

### Tags

Normalized collection for tag references.

```javascript
{
  _id: ObjectId,
  name: String,                // Tag name (unique)
  slug: String,                // URL-friendly identifier
  category: String,            // "project", "blog", "skill", "general"
  description: String,         // Brief description
  color: String,               // Display color hex code
  metrics: {
    projectsCount: Number,     // Count of projects using this tag
    blogPostsCount: Number     // Count of blog posts using this tag
  },
  createdAt: Date,             // First time this tag was added
  updatedAt: Date              // Last time this tag was updated
}
```

### Assets

Tracks media files used in projects and blog posts.

```javascript
{
  _id: ObjectId,
  filename: String,            // Asset filename
  originalFilename: String,    // Original uploaded filename
  path: String,                // Storage path
  type: String,                // MIME type
  size: Number,                // File size in bytes
  dimensions: {                // For images
    width: Number,
    height: Number
  },
  alt: String,                 // Alt text for images
  caption: String,             // Caption text
  sourceUrl: String,           // Original source URL if imported
  projectIds: [ObjectId],      // References to projects using this asset
  blogPostIds: [ObjectId],     // References to blog posts using this asset
  createdAt: Date,             // Upload timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### Projects

Stores information about portfolio projects with normalized references.

```javascript
{
  _id: ObjectId,
  slug: String,                // URL-friendly identifier (unique)
  title: String,               // Project title
  summary: String,             // Brief project summary
  publishedAt: Date,           // Publication date
  technologyIds: [ObjectId],   // References to Technologies collection
  tagIds: [ObjectId],          // References to Tags collection
  coverImageId: ObjectId,      // Reference to primary Assets collection item
  galleryImageIds: [ObjectId], // References to Assets collection
  content: String,             // MDX content
  contentSourcePath: String,   // Source file path for MDX content
  authorId: ObjectId,          // Reference to Users collection
  status: String,              // "draft", "published", "archived"
  featured: Boolean,           // Whether project is featured
  githubRepositoryUrl: String, // GitHub repository URL
  liveUrl: String,             // Live project URL
  projectDates: {
    started: Date,             // Project start date
    completed: Date,           // Project completion date
    lastUpdated: Date          // Last project update date
  },
  analytics: {
    views: Number,             // View count
    likes: Number,             // Like count
    lastViewed: Date           // Last time project was viewed
  },
  sourceControl: {
    type: String,              // "github", "gitlab", "bitbucket", etc.
    url: String,               // Repository URL
    branch: String,            // Main branch name
    lastSynced: Date,          // Last time synced with repo
    webhookActive: Boolean     // Whether webhook is configured
  },
  projectProgress: {
    percentage: Number,        // Overall completion percentage
    status: String             // "planning", "in-progress", "completed", "maintaining"
  },
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### ProjectMilestones

Normalized collection for project milestones.

```javascript
{
  _id: ObjectId,
  projectId: ObjectId,         // Reference to Projects collection
  title: String,               // Milestone title
  description: String,         // Milestone description
  date: Date,                  // Target or completion date
  completed: Boolean,          // Whether milestone is completed
  completedAt: Date,           // When milestone was completed
  order: Number,               // Display order
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### ProjectFeatures

Normalized collection for project features.

```javascript
{
  _id: ObjectId,
  projectId: ObjectId,         // Reference to Projects collection
  title: String,               // Feature title
  description: String,         // Feature description
  status: String,              // "planned", "in-progress", "implemented"
  implementedAt: Date,         // When feature was implemented
  order: Number,               // Display order
  metrics: [{                  // Feature-specific metrics
    label: String,
    value: String,
    progress: Number,
    icon: String
  }],
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### ProjectVersions

Tracks versions of project content for history and rollback.

```javascript
{
  _id: ObjectId,
  projectId: ObjectId,         // Reference to Projects collection
  version: Number,             // Version number
  content: String,             // MDX content at this version
  changedBy: ObjectId,         // Reference to Users collection
  changeDescription: String,   // Description of changes made
  timestamp: Date              // Version creation timestamp
}
```

### BlogPosts

Stores blog posts with normalized references.

```javascript
{
  _id: ObjectId,
  slug: String,                // URL-friendly identifier (unique)
  title: String,               // Post title
  summary: String,             // Brief summary
  publishedAt: Date,           // Publication date
  tagIds: [ObjectId],          // References to Tags collection
  authorId: ObjectId,          // Reference to Users collection
  coverImageId: ObjectId,      // Reference to primary Assets collection item
  galleryImageIds: [ObjectId], // References to Assets collection
  content: String,             // MDX content
  contentSourcePath: String,   // Source file path for MDX content
  status: String,              // "draft", "published", "archived"
  featuredTechnologyIds: [ObjectId], // References to Technologies featured in post
  relatedPostIds: [ObjectId],  // References to related BlogPosts
  analytics: {
    views: Number,             // View count
    likes: Number,             // Like count
    averageTimeOnPage: Number, // Average time spent on page (seconds)
    bounceRate: Number,        // Bounce rate percentage
    socialShares: Number       // Total social media shares
  },
  seo: {
    metaDescription: String,   // SEO meta description
    canonicalUrl: String,      // Canonical URL if different
    keywords: [String],        // SEO keywords
    seoTitle: String,          // SEO-optimized title if different
    score: Number              // SEO optimization score
  },
  readingTime: Number,         // Estimated reading time in minutes
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### BlogVersions

Tracks versions of blog post content for history and rollback.

```javascript
{
  _id: ObjectId,
  blogPostId: ObjectId,        // Reference to BlogPosts collection
  version: Number,             // Version number
  content: String,             // MDX content at this version
  changedBy: ObjectId,         // Reference to Users collection
  changeDescription: String,   // Description of changes made
  timestamp: Date              // Version creation timestamp
}
```

### SkillCategories

Organizes skills by category for skill assessment and showcase.

```javascript
{
  _id: ObjectId,
  name: String,                // Category name (unique)
  slug: String,                // URL-friendly identifier
  description: String,         // Category description
  emoji: String,               // Category emoji or icon
  order: Number,               // Display order
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### Skills

Defines individual skills within categories.

```javascript
{
  _id: ObjectId,
  name: String,                // Skill name
  categoryId: ObjectId,        // Reference to SkillCategories collection
  emoji: String,               // Skill emoji or icon
  experience: String,          // Experience level descriptor
  summary: String,             // Skill summary
  aboveCurve: String,          // Areas of strength
  rank: String,                // Skill rank assessment
  relatedTechnologyIds: [ObjectId], // References to Technologies collection
  relatedProjectIds: [ObjectId], // Projects using this skill
  createdAt: Date,             // Document creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### Analytics

Stores time-based analytics data.

```javascript
{
  _id: ObjectId,
  date: Date,                  // Date of analytics record
  period: String,              // "day", "week", "month"
  pageViews: {
    total: Number,             // Total page views
    unique: Number,            // Unique page views
    byPath: [{
      path: String,            // Page path
      views: Number,           // View count
      unique: Number           // Unique view count
    }]
  },
  projects: [{
    projectId: ObjectId,       // Reference to Projects collection
    views: Number,             // View count
    unique: Number,            // Unique view count
    engagementSeconds: Number  // Total engagement time
  }],
  blogPosts: [{
    blogPostId: ObjectId,      // Reference to BlogPosts collection
    views: Number,             // View count
    unique: Number,            // Unique view count
    engagementSeconds: Number, // Total engagement time
    readCompletion: Number     // Average read completion percentage
  }],
  referrers: [{
    source: String,            // Referrer source
    visits: Number,            // Visit count
    unique: Number             // Unique visit count
  }],
  technologies: [{
    technologyId: ObjectId,    // Reference to Technologies collection
    views: Number              // View count for this technology
  }],
  createdAt: Date              // Record creation timestamp
}
```

### DashboardConfigs

Stores user-specific dashboard configuration.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,            // Reference to Users collection
  name: String,                // Configuration name
  isDefault: Boolean,          // Whether this is the user's default configuration
  layout: [{
    widgetId: String,          // Widget identifier
    type: String,              // Widget type
    title: String,             // Custom widget title
    position: {
      x: Number,               // X position
      y: Number,               // Y position
      w: Number,               // Width
      h: Number                // Height
    },
    settings: {                // Widget-specific settings
      // Varies by widget type
    }
  }],
  createdAt: Date,             // Configuration creation timestamp
  updatedAt: Date              // Last modification timestamp
}
```

### SystemSettings

Global system configuration settings.

```javascript
{
  _id: ObjectId,
  key: String,                 // Setting key (unique)
  value: Mixed,                // Setting value
  category: String,            // "general", "integration", "performance"
  description: String,         // Setting description
  updatedAt: Date,             // Last update timestamp
  updatedBy: ObjectId          // Reference to Users collection
}
```

## Relationships and Normalization

The database design uses a combination of embedding and referencing to maintain a balance between normalization and performance:

1. **Technologies and Tags** are fully normalized with references from other collections
2. **Assets** are normalized and referenced from Project and BlogPost documents
3. **Project Features and Milestones** are in separate collections to allow for better querying and independent updates
4. **Content Versions** are stored separately to avoid bloating the main documents
5. **Analytics Data** is stored in time-based records for efficient querying

## Indexing Strategy

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Technologies collection
db.technologies.createIndex({ name: 1 }, { unique: true });
db.technologies.createIndex({ slug: 1 }, { unique: true });
db.technologies.createIndex({ category: 1 });

// Tags collection
db.tags.createIndex({ name: 1 }, { unique: true });
db.tags.createIndex({ slug: 1 }, { unique: true });
db.tags.createIndex({ category: 1 });

// Assets collection
db.assets.createIndex({ projectIds: 1 });
db.assets.createIndex({ blogPostIds: 1 });
db.assets.createIndex({ type: 1 });

// Projects collection
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ technologyIds: 1 });
db.projects.createIndex({ tagIds: 1 });
db.projects.createIndex({ status: 1 });
db.projects.createIndex({ featured: 1 });
db.projects.createIndex({ publishedAt: -1 });
db.projects.createIndex({ authorId: 1 });

// ProjectMilestones collection
db.projectMilestones.createIndex({ projectId: 1 });
db.projectMilestones.createIndex({ completed: 1 });

// ProjectFeatures collection
db.projectFeatures.createIndex({ projectId: 1 });
db.projectFeatures.createIndex({ status: 1 });

// ProjectVersions collection
db.projectVersions.createIndex({ projectId: 1, version: -1 });

// BlogPosts collection
db.blogPosts.createIndex({ slug: 1 }, { unique: true });
db.blogPosts.createIndex({ tagIds: 1 });
db.blogPosts.createIndex({ status: 1 });
db.blogPosts.createIndex({ publishedAt: -1 });
db.blogPosts.createIndex({ authorId: 1 });
db.blogPosts.createIndex({ featuredTechnologyIds: 1 });

// BlogVersions collection
db.blogVersions.createIndex({ blogPostId: 1, version: -1 });

// SkillCategories collection
db.skillCategories.createIndex({ name: 1 }, { unique: true });
db.skillCategories.createIndex({ order: 1 });

// Skills collection
db.skills.createIndex({ categoryId: 1 });
db.skills.createIndex({ relatedTechnologyIds: 1 });

// Analytics collection
db.analytics.createIndex({ date: -1 });
db.analytics.createIndex({ period: 1, date: -1 });
db.analytics.createIndex({ "projects.projectId": 1 });
db.analytics.createIndex({ "blogPosts.blogPostId": 1 });

// DashboardConfigs collection
db.dashboardConfigs.createIndex({ userId: 1 });
db.dashboardConfigs.createIndex({ userId: 1, isDefault: 1 });

// SystemSettings collection
db.systemSettings.createIndex({ key: 1 }, { unique: true });
db.systemSettings.createIndex({ category: 1 });
```

## Schema Validation

MongoDB schema validation should be implemented to ensure data integrity. Example for the Projects collection:

```javascript
db.createCollection("projects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "title", "status", "createdAt", "updatedAt"],
      properties: {
        slug: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        summary: {
          bsonType: "string",
          description: "must be a string",
        },
        status: {
          enum: ["draft", "published", "archived"],
          description: "can only be one of the enum values and is required",
        },
        featured: {
          bsonType: "bool",
          description: "must be a boolean",
        },
        // Additional properties...
      },
    },
  },
});
```

## Data Migration Strategy

When migrating from the filesystem:

1. **Extract & Transform**

   - Parse MDX files to extract content and frontmatter
   - Identify and normalize technologies and tags
   - Extract and organize assets

2. **Load**

   - Create normalized records first (Technologies, Tags)
   - Then create dependent records with references
   - Validate data integrity after migration

3. **Verification**
   - Ensure count consistency with source files
   - Verify all references are valid
   - Test queries to ensure expected results

## Query Patterns

### Get Project with Related Data

```javascript
// Aggregate to get project with related data
db.projects.aggregate([
  { $match: { slug: "project-slug" } },
  {
    $lookup: {
      from: "technologies",
      localField: "technologyIds",
      foreignField: "_id",
      as: "technologies",
    },
  },
  {
    $lookup: {
      from: "tags",
      localField: "tagIds",
      foreignField: "_id",
      as: "tags",
    },
  },
  {
    $lookup: {
      from: "assets",
      localField: "galleryImageIds",
      foreignField: "_id",
      as: "galleryImages",
    },
  },
  {
    $lookup: {
      from: "projectMilestones",
      localField: "_id",
      foreignField: "projectId",
      as: "milestones",
    },
  },
  {
    $lookup: {
      from: "projectFeatures",
      localField: "_id",
      foreignField: "projectId",
      as: "features",
    },
  },
]);
```

### Analytics Dashboard Data

```javascript
// Get analytics for dashboard
db.analytics.aggregate([
  { $match: { period: "day", date: { $gte: ISODate("2025-05-01") } } },
  { $sort: { date: 1 } },
  {
    $group: {
      _id: null,
      totalViews: { $sum: "$pageViews.total" },
      viewsByDay: {
        $push: {
          date: "$date",
          views: "$pageViews.total",
        },
      },
    },
  },
]);
```

## Backup Strategy

1. **Regular Database Dumps**

   - Daily full backups using MongoDB's native tools

   ```bash
   mongodump --uri="mongodb://username:password@localhost:27017/portfolioDB" --out=/backup/$(date +%Y-%m-%d)
   ```

2. **Incremental Oplog Backups**

   - For point-in-time recovery between full backups

   ```bash
   mongodump --uri="mongodb://username:password@localhost:27017/portfolioDB" --oplog --out=/backup/incremental/$(date +%Y-%m-%d-%H-%M)
   ```

3. **Offsite Storage**

   - Rotate backups to secure offsite storage

   ```bash
   rsync -avz --delete /backup/ user@backup-server:/remote-backup/
   ```

4. **Content File Synchronization**
   - Sync MDX files and assets with content in database
   ```bash
   # Example script to export database content to files
   node scripts/export-content.js --output=./content-backup
   ```

## Performance Optimization

1. **Compound Indexes** for common query patterns
2. **Projection** to limit returned fields in large documents
3. **Aggregation Pipeline Optimization** using proper stages and indexes
4. **Write Concern** settings appropriate for data importance
5. **Read Preference** configuration for potential replica sets

## Future Scalability Considerations

1. **Sharding Strategy**

   - Plan for horizontal scaling if collection sizes grow significantly
   - Consider `{ date: 1 }` as shard key for Analytics collection
   - Consider `{ slug: "hashed" }` for Projects and BlogPosts

2. **Time-Series Data**

   - Consider migrating Analytics to MongoDB time-series collection if using MongoDB 5.0+

3. **Archiving Strategy**
   - Plan for moving older analytics data to archive collections

## Mongoose Schema Example

Example of a Mongoose schema implementation for the Projects collection:

```javascript
import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    publishedAt: Date,
    technologyIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    tagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    coverImageId: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
    },
    galleryImageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Asset",
      },
    ],
    content: String,
    contentSourcePath: String,
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    githubRepositoryUrl: String,
    liveUrl: String,
    projectDates: {
      started: Date,
      completed: Date,
      lastUpdated: Date,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      lastViewed: Date,
    },
    sourceControl: {
      type: {
        type: String,
        enum: ["github", "gitlab", "bitbucket", "other"],
      },
      url: String,
      branch: String,
      lastSynced: Date,
      webhookActive: Boolean,
    },
    projectProgress: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      status: {
        type: String,
        enum: ["planning", "in-progress", "completed", "maintaining"],
        default: "planning",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populating milestones
ProjectSchema.virtual("milestones", {
  ref: "ProjectMilestone",
  localField: "_id",
  foreignField: "projectId",
});

// Virtual for populating features
ProjectSchema.virtual("features", {
  ref: "ProjectFeature",
  localField: "_id",
  foreignField: "projectId",
});

// Index configuration
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ technologyIds: 1 });
ProjectSchema.index({ tagIds: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ publishedAt: -1 });
ProjectSchema.index({ authorId: 1 });

// Pre-save hook for slug generation
ProjectSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
```

---

This comprehensive database design will provide a robust foundation for the Portfolio Manager Dashboard, with appropriate normalization, indexing strategies, and scalability considerations. The design balances MongoDB's document-oriented nature with relational database best practices to ensure data integrity and query performance.

_Last updated: May 19, 2025_
