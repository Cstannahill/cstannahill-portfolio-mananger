# Next.js Dynamic Routes: AI Implementation Guide

## Key Changes in Next.js 15+

**Critical Change**: The `params` prop is now a **Promise** in Next.js 15+, requiring asynchronous handling.

## Proper Params Implementation

### Standard Dynamic Route

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return <div>Blog post: {slug}</div>;
}
```

### Multiple Dynamic Segments

```tsx
// app/shop/[categoryId]/[itemId]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoryId: string; itemId: string }>;
}) {
  const { categoryId, itemId } = await params;
  
  return (
    <div>
      Category: {categoryId}, Item: {itemId}
    </div>
  );
}
```

### Catch-all Segments

```tsx
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  
  return (
    <div>
      Path: {slug.join('/')}
    </div>
  );
}
```

### Optional Catch-all Segments

```tsx
// app/shop/[[...categories]]/page.tsx
export default async function ShopPage({
  params,
}: {
  params: Promise<{ categories?: string[] }>;
}) {
  const { categories } = await params;
  
  return (
    <div>
      {categories ? `Categories: ${categories.join('/')}` : 'All products'}
    </div>
  );
}
```

## TypeScript Types Reference

| Route Pattern | TypeScript Type |
|---------------|----------------|
| `[slug]` | `{ slug: string }` |
| `[...slug]` | `{ slug: string[] }` |
| `[[...slug]]` | `{ slug?: string[] }` |
| `[categoryId]/[itemId]` | `{ categoryId: string; itemId: string }` |

## Alternative: Using React's `use()` Hook

For client components or when you prefer hooks:

```tsx
import { use } from 'react';

export default function MyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  
  return <div>Slug: {slug}</div>;
}
```

## Layouts with Dynamic Routes

```tsx
// app/blog/[slug]/layout.tsx
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div>
      <h1>Blog: {slug}</h1>
      {children}
    </div>
  );
}
```

## Route Handlers

```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return Response.json({ postId: id });
}
```

## Common Patterns and Best Practices

### 1. Always Use Async/Await
```tsx
// ✅ Correct
const { slug } = await params;

// ❌ Incorrect (will cause errors)
const { slug } = params;
```

### 2. Proper Error Handling
```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    // Your component logic
  } catch (error) {
    // Handle param resolution errors
    return <div>Error loading page</div>;
  }
}
```

### 3. Generating Static Params
```tsx
// For static generation at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}
```

## Migration Notes

- **Next.js 14 and earlier**: `params` was synchronous
- **Next.js 15+**: `params` is a Promise and must be awaited
- Synchronous access still works in Next.js 15 for backward compatibility but is deprecated

## URL Mapping Examples

| File Path | URL | Params |
|-----------|-----|--------|
| `app/blog/[slug]/page.tsx` | `/blog/hello-world` | `{ slug: 'hello-world' }` |
| `app/shop/[...categories]/page.tsx` | `/shop/electronics/phones` | `{ categories: ['electronics', 'phones'] }` |
| `app/user/[[...profile]]/page.tsx` | `/user` | `{ profile: undefined }` |
| `app/user/[[...profile]]/page.tsx` | `/user/settings/privacy` | `{ profile: ['settings', 'privacy'] }` |

## Key Reminders for AI Implementation

1. **Always declare params as Promise type**
2. **Always use async/await to access param values**
3. **Use proper TypeScript typing based on route pattern**
4. **Remember optional catch-all segments use optional array type**
5. **Apply the same pattern to layouts, pages, and route handlers**