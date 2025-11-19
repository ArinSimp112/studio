"use client";

import type { StressAssessment } from "@/app/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, ShieldAlert, HeartPulse, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressChart } from "./progress-chart";
import { WithId } from "@/firebase/firestore/use-collection";
import { therapists } from "@/lib/therapists";

type ResultsDisplayProps = {
  results: StressAssessment;
  assessments: WithId<StressAssessment>[];
};

export function ResultsDisplay({ results, assessments }: ResultsDisplayProps) {
  const { keyStressors, advice, stressLevel } = results;

  const getStressLevelString = (level: number) => {
    if (level <= 4) return "Low";
    if (level <= 7) return "Medium";
    return "High";
  }

  const stressLevelString = getStressLevelString(stressLevel);

  const badgeVariant = () => {
    switch (stressLevelString.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "outline";
    }
  };
  
  const badgeClass = () => {
    switch (stressLevelString.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      default:
        return "";
    }
  }

  return (
    <div className="mt-8 animate-in fade-in duration-500 space-y-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-2">
            <HeartPulse className="h-10 w-10 text-primary"/>
            <span>Your Stress Analysis</span>
            <Badge 
              variant={badgeVariant()}
              className={cn("capitalize text-base px-4 py-1 rounded-full", badgeClass())}
            >
              {stressLevelString}
            </Badge>
          </CardTitle>
          <CardDescription>
            Here's what our AI has determined based on your input.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible defaultValue="stressors" className="w-full">
            <AccordionItem value="stressors">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Key Stressors Identified
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pt-2">
                {keyStressors}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advice">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Personalized Advice
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pt-2 whitespace-pre-wrap">
                {advice}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {assessments && assessments.length > 0 && (
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Your stress level trend over the last few assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart assessments={assessments} />
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            Find a Therapist
          </CardTitle>
          <CardDescription>
            Contact information for mental health professionals in India.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-bold">{therapist.name}</h3>
                <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                <p className="text-sm">{therapist.city}, {therapist.state}</p>
                <div className="mt-2 text-sm">
                  <a href={`mailto:${therapist.email}`} className="text-primary hover:underline">{therapist.email}</a>
                  <span className="mx-2">|</span>
                  <a href={`tel:${therapist.contactNumber}`} className="text-primary hover:underline">{therapist.contactNumber}</a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
