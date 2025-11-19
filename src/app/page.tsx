"use client";

import { useState } from 'react';
import type { AnalyzeUserInputToDetectStressLevelOutput } from '@/ai/flows/analyze-user-input-to-detect-stress-level';
import { Header } from '@/components/header';
import { StressForm } from '@/components/stress-form';
import { ResultsDisplay } from '@/components/results-display';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [results, setResults] = useState<AnalyzeUserInputToDetectStressLevelOutput | null>(null);

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="flex-grow">
        <Header />
        <section className="mt-8">
          <StressForm setResults={setResults} />
        </section>
        
        {results && (
          <>
            <Separator className="my-12" />
            <section>
              <ResultsDisplay results={results} />
            </section>
          </>
        )}
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; StressWise. All rights reserved.</p>
        <p className="mt-1">
          Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice.
        </p>
      </footer>
    </main>
  );
}
