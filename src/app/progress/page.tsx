
'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirebase, useMemoFirebase, useUser, WithId } from '@/firebase';
import { StressAssessment } from '@/app/schema';
import { Header } from '@/components/header';
import { ProgressChart } from '@/components/progress-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lightbulb, ShieldAlert, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [assessments, setAssessments] = useState<WithId<StressAssessment>[]>([]);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/stressAssessments`), orderBy('assessmentDate', 'desc'));
  }, [firestore, user]);

  const { data: fetchedAssessments, isLoading } = useCollection<StressAssessment>(assessmentsQuery);

  useEffect(() => {
    if (fetchedAssessments) {
      setAssessments(fetchedAssessments);
    }
  }, [fetchedAssessments]);

  const getStressLevelString = (level: number) => {
    if (level <= 39) return 'Low';
    if (level <= 69) return 'Medium';
    return 'High';
  };

  const badgeClass = (level: number) => {
    const levelString = getStressLevelString(level).toLowerCase();
    switch (levelString) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      default:
        return '';
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <Header />
      <section className="mt-8 w-full max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Your Stress Progress
            </CardTitle>
            <CardDescription>
              Visualize your stress levels over time and review past assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isUserLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : assessments.length > 0 ? (
              <ProgressChart assessments={assessments} />
            ) : (
              <p className="text-center text-muted-foreground">No assessment data yet. Take your first assessment to see your progress!</p>
            )}
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-6">Assessment History</h2>
        {isLoading || isUserLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="shadow-md">
                <AccordionItem value={assessment.id} className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-left">
                        <p className="font-semibold">{format(new Date(assessment.assessmentDate), 'PPP p')}</p>
                      </div>
                      <Badge className={cn('capitalize text-sm', badgeClass(assessment.stressLevel))}>
                        {assessment.stressScore}/100 - {getStressLevelString(assessment.stressLevel)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                       <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2"><ShieldAlert className="h-5 w-5 text-primary" /> Key Stressors</h4>
                        <p className="text-muted-foreground">{assessment.keyStressors}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-yellow-500" /> Advice Given</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{assessment.advice}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        )}
      </section>
       <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; StressWise. All rights reserved.</p>
      </footer>
    </main>
  );
}
