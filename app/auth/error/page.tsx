"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already associated with another account. Please sign in using your original provider.",
  CredentialsSignin: "Invalid email or password. Please try again.",
  default: "An error occurred during authentication. Please try again.",
};

// Component that uses useSearchParams - needs to be wrapped in Suspense
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(ERROR_MESSAGES[error] || ERROR_MESSAGES.default);
    } else {
      setErrorMessage(ERROR_MESSAGES.default);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg border border-border/30 bg-card">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-destructive">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button asChild>
            <Link href="/auth/login">Return to Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Loading fallback
function AuthErrorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg border border-border/30 bg-card">
        <div className="text-center space-y-4">
          <div className="bg-muted/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
            <div className="animate-spin h-8 w-8 border-2 border-muted border-t-transparent rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-muted-foreground">
            Loading...
          </h1>
        </div>
      </Card>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  );
}
