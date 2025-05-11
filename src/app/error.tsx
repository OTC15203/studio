'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error); // Temporarily commented out to avoid console noise during development if not configured
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-xl border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 text-destructive rounded-full p-3 w-fit mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Oops! Something Went Wrong
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            We've encountered an unexpected issue. Please try refreshing the page or clicking the button below.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {process.env.NODE_ENV === 'development' && error?.message && (
            <details className="my-4 p-3 bg-muted/30 rounded-md text-left text-sm overflow-auto max-h-60 border border-dashed">
              <summary className="font-semibold cursor-pointer hover:text-primary">
                Error Details (Development Mode)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{error.message}</pre>
              {error.stack && (
                 <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground/70">{error.stack}</pre>
              )}
              {error.digest && <p className="text-xs mt-2 text-muted-foreground">Digest: {error.digest}</p>}
            </details>
          )}
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="mt-4"
            variant="default"
            size="lg"
          >
            Try Again
          </Button>
           <p className="text-xs text-muted-foreground mt-6">
            If the problem persists, please contact support or check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
