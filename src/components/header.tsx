import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="py-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <BrainCircuit className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            StressWise
          </h1>
        </div>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Your personal AI companion to understand and manage stress.
        </p>
      </div>
       <nav className="mt-6 flex justify-center gap-4">
          <Button asChild variant={pathname === '/' ? 'secondary' : 'ghost'}>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant={pathname === '/progress' ? 'secondary' : 'ghost'}>
            <Link href="/progress">Progress</Link>
          </Button>
        </nav>
    </header>
  );
}
