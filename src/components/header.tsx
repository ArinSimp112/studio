import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <BrainCircuit className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          StressWise
        </h1>
      </div>
      <p className="mt-4 text-center text-lg text-muted-foreground">
        Your personal AI companion to understand and manage stress.
      </p>
    </header>
  );
}
