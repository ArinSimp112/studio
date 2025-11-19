
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { StressForm } from '@/components/stress-form';
import { Separator } from '@/components/ui/separator';
import type { StressAssessment } from '@/app/schema';
import { useAuth, useFirebase, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';

export default function AssessmentPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<WithId<StressAssessment>[]>([]);
  const { firestore, user } = useFirebase();
  const auth = useAuth();

  useEffect(() => {
    if (auth && !auth.currentUser) {
      // Non-blocking anonymous sign-in
      import('@/firebase/non-blocking-login').then(({ initiateAnonymousSignIn }) => {
        initiateAnonymousSignIn(auth);
      });
    }
  }, [auth]);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/stressAssessments`), orderBy('assessmentDate', 'desc'), limit(10));
  }, [firestore, user]);

  const { data: fetchedAssessments, isLoading } = useCollection<StressAssessment>(assessmentsQuery);

  useEffect(() => {
    if (fetchedAssessments) {
      setAssessments(fetchedAssessments);
    }
  }, [fetchedAssessments]);


  const handleAnalysisComplete = (analysisResult: StressAssessment) => {
    if (firestore && user) {
      addDocumentNonBlocking(collection(firestore, `users/${user.uid}/stressAssessments`), {
        ...analysisResult,
        userId: user.uid,
      });
    }
    // Store result in session storage and redirect
    sessionStorage.setItem('stressAnalysisResults', JSON.stringify(analysisResult));
    router.push('/results');
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="flex-grow">
        <Header />
        <section className="mt-8">
          <StressForm setResults={handleAnalysisComplete} />
        </section>
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; StressWise. All rights reserved.</p>
      </footer>
    </main>
  );
}
