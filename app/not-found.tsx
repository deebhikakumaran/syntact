// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-medium">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Link href="/" className="text-sm underline">Go home</Link>
    </div>
  );
}