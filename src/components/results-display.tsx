"use client";

import type { AnalyzeUserInputToDetectStressLevelOutput } from "@/ai/flows/analyze-user-input-to-detect-stress-level";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, ShieldAlert, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultsDisplayProps = {
  results: AnalyzeUserInputToDetectStressLevelOutput;
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { stressLevel, keyStressors, advice } = results;

  const badgeVariant = () => {
    switch (stressLevel.toLowerCase()) {
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
    switch (stressLevel.toLowerCase()) {
        case "low":
            return "bg-accent text-accent-foreground border-accent-foreground/20 hover:bg-accent/90";
        default:
            return "";
    }
  }

  return (
    <div className="mt-8 animate-in fade-in duration-500">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-2">
            <HeartPulse className="h-10 w-10 text-primary"/>
            <span>Your Stress Analysis</span>
            <Badge 
              variant={badgeVariant()}
              className={cn("capitalize text-base px-4 py-1 rounded-full", badgeClass())}
            >
              {stressLevel}
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
                  <Lightbulb className="h-5 w-5 text-accent-foreground" />
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
    </div>
  );
}
