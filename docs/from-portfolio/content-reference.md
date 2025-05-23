# Content Directory README

This directory contains all the content for the portfolio site in MDX format. This document outlines all available frontmatter properties for both blog posts and projects, and explains where each property appears in the UI.

## Directory Structure

```
content/
├── blog/           # Blog posts (.mdx files)
├── projects/       # Project showcase (.mdx files)
└── README.md       # This documentation file
```

## Blog Posts (`content/blog/`)

### Required Properties

| Property                | Type                | Description         | UI Location                                     |
| ----------------------- | ------------------- | ------------------- | ----------------------------------------------- |
| `title`                 | String              | The blog post title | Page title, blog index card header, browser tab |
| `date` or `publishedAt` | String (YYYY-MM-DD) | Publication date    | Blog index card, individual post header         |

### Optional Properties

| Property               | Type             | Description                                                    | UI Location                                               |
| ---------------------- | ---------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| `excerpt` or `summary` | String           | Short description of the post                                  | Blog index card description, meta description             |
| `tags`                 | Array of Strings | Post categories/topics                                         | Blog index card (first 3 + count), individual post header |
| `coverImage`           | String (path)    | Hero image for the post                                        | Blog index card image, individual post hero               |
| `images`               | Array of Strings | Additional images (first used as cover if no coverImage)       | Fallback for coverImage                                   |
| `slug`                 | String           | Custom URL slug (auto-generated from filename if not provided) | URL path                                                  |

### Example Blog Post Frontmatter

```yaml
---
title: "Getting Started with Next.js"
publishedAt: "2025-05-15"
excerpt: "A comprehensive guide to building modern web applications with Next.js"
tags: ["Next.js", "React", "JavaScript", "Web Development"]
coverImage: "/images/blog/nextjs-cover.jpg"
---
```

### UI Appearance for Blog Posts

**Blog Index Page (`/blog`):**

- **Card Layout**: Each post appears as a horizontal card
- **Image**: `coverImage` or first image from `images` array (left side of card on desktop)
- **Title**: Large, clickable headline
- **Date**: Small text below title
- **Tags**: First 3 tags shown as badges, "+X more" if additional tags exist
- **Excerpt**: 3-line preview with line clamping
- **Read More**: Link to full post

**Individual Blog Post Page (`/blog/[slug]`):**

- **Header**: Centered layout with date, tags, title, and excerpt
- **Hero Image**: Full-width `coverImage` if provided
- **Content**: Rendered MDX with specialized blog components

---

## Projects (`content/projects/`)

### Required Properties

| Property                | Type                | Description                         | UI Location                                  |
| ----------------------- | ------------------- | ----------------------------------- | -------------------------------------------- |
| `title`                 | String              | Project name                        | Page title, project card header, browser tab |
| `publishedAt` or `date` | String (YYYY-MM-DD) | Project completion/publication date | Project card, individual project header      |

### Optional Properties

| Property               | Type             | Description                | UI Location                                             |
| ---------------------- | ---------------- | -------------------------- | ------------------------------------------------------- |
| `summary` or `excerpt` | String           | Brief project description  | Project card description, meta description              |
| `technologies`         | Array of Strings | Tech stack used in project | Project card badges (first 4 + count), project header   |
| `tags`                 | Array of Strings | Project categories         | Individual project header                               |
| `images`               | Array of Strings | Project screenshots/images | Project card cover (first image), project hero          |
| `coverImage`           | String (path)    | Main project image         | Overrides first image from `images`                     |
| `demoUrl`              | String (URL)     | Live demo link             | Project header "View Demo" button                       |
| `sourceUrl`            | String (URL)     | Source code repository     | Project header "Source Code" button                     |
| `slug`                 | String           | Custom URL slug            | URL path (auto-generated from filename if not provided) |

### Example Project Frontmatter

```yaml
---
title: "E-commerce Platform"
summary: "A comprehensive e-commerce solution for online retail"
publishedAt: "2025-05-08"
technologies:
  - "Next.js"
  - "Stripe"
  - "MongoDB"
  - "Tailwind CSS"
  - "Vercel"
tags: ["Full Stack", "E-commerce", "React"]
images:
  - "/images/projects/ecommerce/home.png"
  - "/images/projects/ecommerce/checkout.png"
  - "/images/projects/ecommerce/cart.png"
demoUrl: "https://my-ecommerce-demo.vercel.app"
sourceUrl: "https://github.com/username/ecommerce-project"
---
```

### UI Appearance for Projects

**Projects Index Page (`/projects`):**

- **Grid Layout**: 3-column grid on desktop, responsive on mobile
- **Card Image**: `coverImage` or first image from `images` array (16:9 aspect ratio)
- **Title**: Bold headline, clickable
- **Date**: Small text below title
- **Technologies**: First 4 technologies as badges, "+X more" if additional
- **Summary**: 3-line description with line clamping
- **View Project**: Link to detailed project page

**Individual Project Page (`/projects/[slug]`):**

- **Header**: Project title, date, technology badges
- **Action Buttons**: "View Demo" and "Source Code" buttons if URLs provided
- **Hero Image**: Full-width first image if available
- **Content**: Rendered MDX with specialized project components

**Home Page Featured Projects:**

- **3-Card Layout**: Highlights recent/featured projects
- **Same styling** as projects index cards
- **"View All" link** to projects page

---

## Image Guidelines

### Image Paths

- All images should be in `/public/images/` directory
- Blog images: `/images/blog/[post-name]/`
- Project images: `/images/projects/[project-name]/`
- Use absolute paths starting with `/images/`

### Image Formats

- **Preferred**: `.jpg`, `.png`, `.webp`, `.avif`
- **Recommended sizes**:
  - Cover images: 1200x630px (optimal for social sharing)
  - Project screenshots: 1200x800px or similar
  - Blog images: 800x400px minimum

### Image Optimization

- Next.js automatically optimizes images
- Provide `alt` text in MDX: `![Alt text](/path/to/image.jpg)`
- Images are lazy-loaded by default

---

## Content Components

### Available in All MDX Files

**Basic HTML elements** (styled automatically):

- Headings: `# ## ### #### ##### ######`
- Links: `[text](url)` (external links open in new tab)
- Images: `![alt](src)`
- Lists, tables, blockquotes, code blocks

### Blog-Specific Components

```jsx
<Callout title="Note" icon="💡" type="info">
  Content here
</Callout>

<FeatureList
  title="Key Features"
  items={["Item 1", "Item 2", "Item 3"]}
/>

<SkillCard
  title="React"
  experience="3+ years"
  summary="Building interactive UIs"
  rank="A"
  emoji="⚛️"
/>

<SkillCategory title="Frontend Skills" emoji="🎨">
  {/* SkillCard components */}
</SkillCategory>

<ProgressSection
  category="Next.js"
  score={85}
  experience="2 years"
  highlights="SSR, API routes, deployment"
/>

<SummaryTable
  items={[
    { category: "Performance", rank: "A+", notes: "Fast loading times" }
  ]}
/>
```

### Project-Specific Components

```jsx
<ProjectTechStack
  technologies={[
    { name: "Next.js", icon: "▲", role: "primary" },
    { name: "TypeScript", icon: "🔷", role: "secondary" }
  ]}
/>

<ProjectTimeline
  items={[
    {
      date: "January 2025",
      title: "Project Start",
      description: "Initial planning",
      status: "completed"
    }
  ]}
/>

<ProjectFeatureShowcase
  groups={[
    {
      title: "Core Features",
      image: "/images/projects/example/features.png",
      features: [
        {
          title: "Feature Name",
          description: "Feature description",
          status: "implemented"
        }
      ]
    }
  ]}
/>

<ProjectMetrics
  metrics={[
    { label: "Performance", value: "95%", icon: "⚡", progress: 95 }
  ]}
/>

<ProjectChallengeCard
  title="Challenge Title"
  challenge="Description of the problem"
  solution="How it was solved"
  impact="The result"
  difficulty="medium"
  domain="Frontend"
/>
```

---

## File Naming Conventions

### Blog Posts

- Use kebab-case: `getting-started-with-nextjs.mdx`
- Include date in filename for organization: `2025-05-15-getting-started-with-nextjs.mdx`
- Filename becomes the slug if not specified in frontmatter

### Projects

- Use kebab-case: `ecommerce-platform.mdx`
- Use descriptive names: `ai-campfire-chat.mdx`
- Keep names concise but descriptive

---

## SEO and Social Sharing

### Automatic Meta Tags

The following frontmatter properties automatically generate meta tags:

- `title` → `<title>` and `og:title`
- `summary`/`excerpt` → `meta description` and `og:description`
- `coverImage` → `og:image`
- `publishedAt`/`date` → `article:published_time`

### Best Practices

- Keep titles under 60 characters
- Keep descriptions between 120-160 characters
- Use descriptive, keyword-rich content
- Provide high-quality cover images (1200x630px)

---

## Validation and Testing

### Required Frontmatter Check

Before publishing, ensure each file has:

- ✅ `title`
- ✅ `publishedAt` or `date`
- ✅ `summary` or `excerpt`

### Testing Checklist

- [ ] File renders without errors
- [ ] Images load correctly
- [ ] Links work properly
- [ ] Components render as expected
- [ ] Responsive design looks good
- [ ] SEO meta tags are correct

---

## Troubleshooting

### Common Issues

**Images not loading:**

- Check file path starts with `/images/`
- Verify file exists in `/public/images/`
- Check file extension matches exactly

**Components not rendering:**

- Ensure component is imported in `MDXComponents.tsx`
- Check for syntax errors in component usage
- Verify all required props are provided

**Build errors:**

- Check frontmatter YAML syntax
- Ensure all required properties are present
- Verify dates are in correct format (YYYY-MM-DD)

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify frontmatter syntax with a YAML validator
3. Test in development mode first
4. Check the component documentation above

---

_Last updated: May 2025_
