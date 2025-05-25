// providers/TanStackQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQueryDevtools
const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

// Define a type for the props if any are needed in the future
interface TanStackQueryProviderProps {
  children: React.ReactNode;
}

export function TanStackQueryProvider({
  children,
}: TanStackQueryProviderProps): JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 404) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            onError: (error: any) => {
              console.error("Mutation Error:", error);
              // Consider adding a global toast notification here
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
