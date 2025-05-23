# Componentization Example - Condensed Guide

## Componentization Principles Applied

- **Single Responsibility**: Each component handles one logical section
- **Reusability**: Common elements like dividers are extracted to shared components  
- **Naming Convention**: Feature prefix (`RM` for README) + descriptive names
- **File Organization**: Components grouped by feature and shared elements
- **Self-Contained**: Components own their data, minimal/no props needed

## File Structure Created
```
components/
├── readme/
│   ├── RMHeader.tsx
│   ├── RMIntroduction.tsx
│   ├── RMCoreStrengths.tsx
│   └── ... (8 more components)
└── shared/
    └── SectionDivider.tsx
```

## Before: Monolithic Page Component

```tsx
// app/[locale]/readme/page.tsx - BEFORE (600+ lines)
export default async function ReadmePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      {/* Header - 20 lines of JSX */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold...">GitHub README</h1>
        <Button variant="outline" asChild>
          <a href="https://github.com/cstannahill">
            <Github className="h-4 w-4" />View on GitHub
          </a>
        </Button>
      </div>

      {/* Introduction - 15 lines of JSX */}
      <section>
        <h1 className="text-3xl font-bold mb-4 relative">
          <span>👋 </span>
          <span className="bg-gradient-to-r...">Hi, I'm Christian...</span>
        </h1>
        <p className="text-lg text-muted-foreground">Illinois-based software engineer...</p>
      </section>

      {/* Core Strengths - 80+ lines of complex table JSX */}
      <section>
        <h2 className="text-2xl font-bold...">🚀 Core Strengths</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Complex table with 5+ rows of data */}
          </table>
        </div>
      </section>

      {/* ...400+ more lines of similar sections */}
    </div>
  );
}
```

## After: Clean Component Composition

```tsx
// app/[locale]/readme/page.tsx - AFTER (30 lines)
import RMHeader from "@/components/readme/RMHeader";
import RMIntroduction from "@/components/readme/RMIntoduction";
import RMCoreStrengths from "@/components/readme/RMCoreStrengths";
import SectionDivider from "@/components/shared/SectionDivider";
// ... other imports

export default async function ReadmePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <RMHeader />
      
      <div className="prose prose-invert max-w-none space-y-12">
        <RMIntroduction />
        <SectionDivider />
        <RMCoreStrengths />
        <SectionDivider />
        {/* ...other components */}
      </div>
    </div>
  );
}
```

## Component Examples

### 1. Simple Component (RMHeader)
```tsx
// components/readme/RMHeader.tsx
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const RMHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold text-center flex-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        GitHub README
      </h1>
      <Button variant="outline" asChild className="border-accent/30 hover:border-accent-light hover:text-accent-light">
        <a href="https://github.com/cstannahill" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          View on GitHub
        </a>
      </Button>
    </div>
  );
};

export default RMHeader;
```

### 2. Complex Component (RMCoreStrengths) 
```tsx
// components/readme/RMCoreStrengths.tsx
const RMCoreStrengths = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-center mb-8 relative inline-block">
        <span>🚀 </span>
        <span className="bg-gradient-to-r from-accent-light via-accent to-primary bg-clip-text text-transparent">
          Core Strengths
        </span>
        <span className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent-light/50 to-transparent"></span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-accent/20">
              <th className="text-left p-4 font-bold text-accent">Area</th>
              <th className="text-left p-4 font-bold text-accent">Technologies & Tools</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-muted hover:bg-secondary/30 transition-colors">
              <td className="p-4 font-bold text-primary">Front End</td>
              <td className="p-4">React, Next.js (App Router), ShadCN UI, Tailwind CSS, HTML5/CSS3, Redux, Zustand, Context</td>
            </tr>
            {/* ...additional rows */}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-muted-foreground">
        I build fast, document thoroughly, and prioritize MVP-first releases so projects deliver value early and evolve iteratively.
      </p>
    </section>
  );
};

export default RMCoreStrengths;
```

### 3. Shared/Reusable Component (SectionDivider)
```tsx
// components/shared/SectionDivider.tsx
const SectionDivider = () => {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background px-2 text-accent">•</span>
      </div>
    </div>
  );
};

export default SectionDivider;
```

## Key Decisions Made

- **Component Granularity**: Each major section became its own component
- **Shared vs Feature-Specific**: Reusable elements like `SectionDivider` went to `/shared`
- **Self-Contained Components**: No props needed - components own their styling and content
- **Import Cleanup**: Main page now has clean, semantic component composition
- **Maintainability**: Changes to individual sections only affect their respective components
- **Consistent Naming**: `RM` prefix clearly identifies README-specific components

*Note: This example shows 3 representative components. The full implementation includes 11 total components following the same patterns.*