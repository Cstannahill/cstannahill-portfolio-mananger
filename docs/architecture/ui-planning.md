# User Interface Planning

This document outlines the User Interface (UI) design approach, layout patterns, and interaction models for the Portfolio Manager Dashboard application.

## Design System

The application follows a consistent design system built on Tailwind CSS and shadcn/ui, ensuring a cohesive visual language throughout the interface.

### Design Tokens

```
// Colors
--color-primary: #0891b2;     // Cyan 600
--color-secondary: #6b21a8;   // Purple 800
--color-accent: #ea580c;      // Orange 600
--color-background: #ffffff;  // White (light mode)
--color-background-dark: #0f172a; // Slate 900 (dark mode)
--color-text: #334155;        // Slate 700 (light mode)
--color-text-dark: #e2e8f0;   // Slate 200 (dark mode)

// Typography
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-size-xs: 0.75rem;      // 12px
--font-size-sm: 0.875rem;     // 14px
--font-size-md: 1rem;         // 16px
--font-size-lg: 1.125rem;     // 18px
--font-size-xl: 1.25rem;      // 20px
--font-size-2xl: 1.5rem;      // 24px
--font-size-3xl: 1.875rem;    // 30px
--font-size-4xl: 2.25rem;     // 36px

// Spacing
--space-xs: 0.25rem;          // 4px
--space-sm: 0.5rem;           // 8px
--space-md: 1rem;             // 16px
--space-lg: 1.5rem;           // 24px
--space-xl: 2rem;             // 32px
--space-2xl: 3rem;            // 48px

// Border Radius
--radius-sm: 0.125rem;        // 2px
--radius-md: 0.25rem;         // 4px
--radius-lg: 0.5rem;          // 8px
--radius-xl: 0.75rem;         // 12px
--radius-full: 9999px;        // Circular
```

### Component Library

The application leverages shadcn/ui components, which are built on Radix UI primitives and styled with Tailwind CSS. This provides:

1. Accessibility out-of-the-box
2. Consistent styling across components
3. Dark mode support
4. Customizability through Tailwind CSS

## Layout Structure

### Main Layouts

1. **Dashboard Layout**

   - Fixed sidebar for navigation
   - Main content area with grid-based dashboard widgets
   - Top header with search, user menu, and actions

2. **Detail Layout**

   - Reduced sidebar
   - Expanded content area
   - Contextual actions in header

3. **Editor Layout**
   - Full-width content area
   - Persistent action bar
   - Preview/edit toggle

### Responsive Behavior

The layouts adapt to different screen sizes:

- **Large screens (1200px+)**: Full sidebar, multi-column content
- **Medium screens (768px-1199px)**: Collapsible sidebar, reduced columns
- **Small screens (<768px)**: Hidden sidebar (accessible via menu), single column

## Dashboard Design

The dashboard is the central hub of the application, featuring a customizable grid of widgets.

### Widget Grid System

```
+--------------------------------------+
|  +--------+  +--------+  +--------+  |
|  | Widget |  | Widget |  | Widget |  |
|  +--------+  +--------+  +--------+  |
|                                      |
|  +--------+  +----------------+      |
|  | Widget |  |                |      |
|  +--------+  |     Widget     |      |
|              |                |      |
|  +--------+  +----------------+      |
|  | Widget |                          |
|  +--------+  +----------------+      |
|              |                |      |
|              |     Widget     |      |
|              |                |      |
|              +----------------+      |
+--------------------------------------+
```

- Widgets can span multiple grid cells
- Users can drag-and-drop to rearrange
- Widgets can be resized within constraints
- Layout is saved per user

### Widget Types

1. **Summary Widgets**

   - Project count, blog post count, etc.
   - Simple data visualization

2. **List Widgets**

   - Recent projects
   - Popular blog posts
   - GitHub activity

3. **Chart Widgets**

   - Technology usage
   - Project timeline
   - Analytics graphs

4. **Status Widgets**
   - Project progress
   - Integration status
   - System health

## Navigation Structure

### Primary Navigation

```
- Dashboard
- Projects
  - All Projects
  - Featured Projects
  - Draft Projects
- Blog Posts
  - All Posts
  - Published Posts
  - Draft Posts
- Technologies
- Analytics
- Settings
  - Profile
  - Integrations
  - System
```

### Contextual Navigation

When viewing a specific project or blog post:

```
- Overview
- Edit
- Settings
- Analytics
- History
- Related Items
```

## Page Templates

### Dashboard Page

```
+--------------------------------------+
| [Header] Search, User Menu, Actions  |
+--------------------------------------+
| [Sidebar] | [Dashboard Controls]     |
|           | [Widget Grid]            |
|           |                          |
|           |                          |
|           |                          |
|           |                          |
|           |                          |
|           |                          |
+--------------------------------------+
```

### List Page (Projects, Blog Posts)

```
+--------------------------------------+
| [Header] Search, User Menu, Actions  |
+--------------------------------------+
| [Sidebar] | [Filters & Sort]         |
|           | [List Controls]          |
|           | [Item Grid/List]         |
|           |                          |
|           |                          |
|           |                          |
|           | [Pagination]             |
+--------------------------------------+
```

### Detail Page

```
+--------------------------------------+
| [Header] Title, Actions, Breadcrumbs |
+--------------------------------------+
| [Sidebar] | [Item Header]            |
|           | [Content Sections]       |
|           |                          |
|           | [Related Items]          |
|           |                          |
|           | [Comments/Activity]      |
|           |                          |
+--------------------------------------+
```

### Editor Page

```
+--------------------------------------+
| [Header] Save, Publish, Preview      |
+--------------------------------------+
| [Sidebar] | [Metadata Editor]        |
|           | [Content Editor]         |
|           |                          |
|           | [Asset Manager]          |
|           |                          |
|           | [Settings Panel]         |
|           |                          |
+--------------------------------------+
```

## User Flows

### Project Creation Flow

1. **Initiate**: User clicks "Create New Project" button
2. **Basic Info**: User enters title, summary, and selects status
3. **Content**: User creates or imports MDX content
4. **Metadata**: User adds technologies, tags, and other metadata
5. **Assets**: User uploads or selects cover image and gallery images
6. **Review**: User previews the project
7. **Publish/Save**: User publishes or saves as draft

### Blog Post Creation Flow

Similar to Project Creation, with blog-specific fields.

### GitHub Integration Flow

1. **Initiate**: User navigates to Integrations settings
2. **Connect**: User authenticates with GitHub
3. **Select Repositories**: User selects repositories to integrate
4. **Configure**: User configures integration settings
5. **Import**: User selects projects to import from repositories
6. **Map**: User maps repository data to project fields
7. **Complete**: Integration is established

## Interactive Elements

### Drag and Drop

Used for:

- Rearranging dashboard widgets
- Managing assets in galleries
- Prioritizing project features or milestones

### Inline Editing

Used for:

- Quick updates to project metadata
- Content edits without entering full edit mode
- Tag and technology management

### Progressive Disclosure

Complex features are presented progressively:

1. Basic options visible by default
2. Advanced options accessible via "More" buttons or expandable sections
3. Expert options in dedicated advanced settings panels

## Feedback System

### Toast Notifications

For transient feedback:

- Success messages
- Error notifications
- Process completion

### Progress Indicators

For longer operations:

- File uploads
- Data imports
- Background processes

### Validation Feedback

For form interactions:

- Inline validation errors
- Field-specific hints
- Form submission validation summary

## Theming

The application supports light and dark themes:

### Light Theme

- Clean white backgrounds
- Subtle shadows for depth
- Vibrant accent colors for interactive elements
- Dark text for readability

### Dark Theme

- Deep blue-gray backgrounds
- Subtle glow effects instead of shadows
- Slightly muted accent colors
- Light text for readability

## Accessibility Considerations

### Contrast and Readability

- All text meets WCAG AA standards for contrast
- Minimum text size of 14px for readability
- Adequate spacing between interactive elements

### Keyboard Navigation

- Logical tab order
- Focus indicators for all interactive elements
- Keyboard shortcuts for common actions

### Screen Reader Support

- Semantic HTML structure
- ARIA labels and landmarks
- Meaningful alt text for images

## Loading States and Empty States

### Loading States

- Skeleton screens for content loading
- Progress indicators for user-initiated actions
- Contextual loading indicators within components

### Empty States

- Helpful illustrations
- Clear guidance text
- Action buttons to fill the empty state

## Responsive Design Approach

### Mobile-First Strategy

- Base styles designed for mobile
- Progressive enhancement for larger screens
- Simplified UI on smaller screens

### Breakpoints

- Small: 0-639px (mobile)
- Medium: 640px-1023px (tablet)
- Large: 1024px-1279px (laptop)
- Extra Large: 1280px+ (desktop)

### Mobile Considerations

- Touch-friendly targets (minimum 44x44px)
- Simplified navigation via bottom bar or hamburger menu
- Reduced information density

## Performance Optimization

### Perceived Performance

- Immediate feedback on user actions
- Optimistic UI updates
- Progressive loading of content

### Actual Performance

- Lazy loading of images
- Code splitting for UI components
- Minimal DOM updates

## Future UI Enhancements

1. **Customizable Themes**

   - Allow users to customize colors and appearance

2. **Advanced Visualization Components**

   - Interactive charts and graphs for analytics
   - Network diagrams for technology relationships

3. **Animation System**

   - Subtle animations for transitions
   - Microinteractions for feedback

4. **Collaborative Features**
   - Real-time editing indicators
   - Comment and feedback systems

---

This UI planning document serves as a guide for the implementation of the Portfolio Manager Dashboard. It will be refined and expanded as the project progresses.
