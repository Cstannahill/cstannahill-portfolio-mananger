"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white mb-4 animate-pulse">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you&rsquo;re looking for can&rsquo;t be found.
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
