
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { StressAssessment } from '@/app/schema';
import { ResultsDisplay } from '@/components/results-display';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<StressAssessment | null>(null);
  const [assessments, setAssessments] = useState<WithId<StressAssessment>[]>([]);
  const { firestore, user } = useFirebase();
  const { isUserLoading } = useUser();

  useEffect(() => {
    const resultsData = sessionStorage.getItem('stressAnalysisResults');
    if (resultsData) {
      setResults(JSON.parse(resultsData));
      // Optional: Clear the storage after reading to prevent re-displaying old results
      // sessionStorage.removeItem('stressAnalysisResults');
    } else {
      // If there are no results, maybe redirect back to home
      // router.push('/');
    }
  }, [router]);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/stressAssessments`), orderBy('assessmentDate', 'desc'), limit(10));
  }, [firestore, user]);

  const { data: fetchedAssessments, isLoading: isAssessmentsLoading } = useCollection<StressAssessment>(assessmentsQuery);

  useEffect(() => {
    if (fetchedAssessments) {
      setAssessments(fetchedAssessments);
    }
  }, [fetchedAssessments]);

  const isLoading = isUserLoading || isAssessmentsLoading;

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <Header />
      <section className="mt-8">
        {results ? (
            <ResultsDisplay results={results} assessments={assessments} />
        ) : (
          <div className="mt-8 animate-in fade-in duration-500 space-y-8">
            <Skeleton className="h-64 w-full max-w-3xl mx-auto" />
            <Skeleton className="h-80 w-full max-w-3xl mx-auto" />
            <Skeleton className="h-96 w-full max-w-3xl mx-auto" />
          </div>
        )}
      </section>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; StressWise. All rights reserved.</p>
        <p className="mt-1">
          Disclaimer: This is an AI-powered tool and not a substitute for professional medical advice.
        </p>
      </footer>
    </main>
  );
}
