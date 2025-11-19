
'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function IntroductionPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="flex-grow">
        <Header />
        <section className="mt-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Take the First Step Towards a Calmer Mind
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            StressWise is your personal companion for understanding and managing stress. Get AI-powered insights and personalized advice to improve your mental well-being.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => router.push('/assessment')}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <section className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex flex-col items-center gap-2">
                  <Bot className="h-10 w-10 text-primary" />
                  <span>1. Share & Analyze</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Answer a few questions and describe how you're feeling. Our AI will analyze your input to identify stress levels and key stressors.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex flex-col items-center gap-2">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                  <span>2. Get Personalized Advice</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Receive actionable advice and coping strategies tailored specifically to your situation.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <span>3. Track Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Monitor your stress levels over time with our progress chart and review past assessments to see how far you've come.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; StressWise. All rights reserved.</p>
      </footer>
    </main>
  );
}
