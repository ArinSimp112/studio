
"use client";

import type { StressAssessment } from "@/app/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, ShieldAlert, HeartPulse, Stethoscope, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressChart } from "./progress-chart";
import { WithId } from "@/firebase/firestore/use-collection";
import type { Therapist } from "@/lib/therapists";
import { therapists as allTherapists } from "@/lib/therapists";
import { Button } from "./ui/button";
import { useState } from "react";
import { getCityFromCoords } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";


type ResultsDisplayProps = {
  results: StressAssessment;
  assessments: WithId<StressAssessment>[];
};

const getStressLevelString = (level: number) => {
  if (level <= 25) return 'Low';
  if (level <= 50) return 'Mid';
  if (level <= 75) return 'High';
  return 'Severe';
};

const badgeClass = (levelString: string) => {
  switch (levelString.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    case 'mid':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
    case 'severe':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    default:
      return '';
  }
};

const LowStressDisplay = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
            <CardContent className="flex flex-col sm:flex-row items-center justify-center p-6 gap-6">
                <Image
                    src="https://c.tenor.com/6Cuj2B1_n2sAAAAC/u-chill-gng.gif"
                    alt="U Chill Gng"
                    unoptimized
                    width={150}
                    height={150}
                    className="rounded-lg"
                />
                <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold">U Chill Gng</h3>
                    <p className="text-muted-foreground">Your stress levels are low. Keep up the great work!</p>
                </div>
            </CardContent>
        </Card>
    );
};

const MidStressDisplay = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
            <CardContent className="flex flex-col sm:flex-row items-center justify-center p-6 gap-6">
                <Image
                    src="https://c.tenor.com/5iiSns64iLAAAAAC/huh-cat.gif"
                    alt="Just chill out gng"
                    unoptimized
                    width={150}
                    height={150}
                    className="rounded-lg"
                />
                <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold">Just chill out gng</h3>
                    <p className="text-muted-foreground">Take it easily. A little stress is normal.</p>
                </div>
            </CardContent>
        </Card>
    );
};


export function ResultsDisplay({ results, assessments }: ResultsDisplayProps) {
  const { keyStressors, advice, stressLevel, stressScore } = results;
  const [isLocating, setIsLocating] = useState(false);
  const [localTherapists, setLocalTherapists] = useState<Therapist[] | null>(null);
  const { toast } = useToast();


  const stressLevelString = getStressLevelString(stressLevel);

  const handleFindTherapists = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const city = await getCityFromCoords({ latitude, longitude });
          if (city) {
            const filtered = allTherapists.filter(
              (t) => t.city.toLowerCase() === city.toLowerCase()
            );
            setLocalTherapists(filtered);
            if (filtered.length === 0) {
              toast({
                title: "No Therapists Found Nearby",
                description: "Showing all available therapists.",
              });
            }
          } else {
             toast({
              variant: "destructive",
              title: "Could Not Determine City",
              description: "Showing all available therapists.",
            });
            setLocalTherapists(null);
          }
        } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Error finding therapists",
              description: "Could not determine your location.",
            });
          setLocalTherapists(null);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location Access Denied",
          description: "Please enable location access in your browser settings to find nearby therapists.",
        });
        setIsLocating(false);
        setLocalTherapists(null);
      }
    );
  };

  const therapistsToDisplay = localTherapists !== null ? localTherapists : allTherapists;

  return (
    <div className="mt-8 animate-in fade-in duration-500 space-y-8">
      {stressLevelString === 'Low' && <LowStressDisplay />}
      {stressLevelString === 'Mid' && <MidStressDisplay />}

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-4">
            <HeartPulse className="h-10 w-10 text-primary"/>
            <span>Your Stress Analysis</span>
             <div className="flex items-baseline gap-2">
               <span className="text-5xl font-bold">{stressScore}</span>
               <span className="text-xl text-muted-foreground">/ 100</span>
             </div>
            <Badge 
              className={cn("capitalize text-base px-4 py-1 rounded-full", badgeClass(stressLevelString))}
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
          <div className="flex justify-between items-center">
             <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Find a Therapist
            </CardTitle>
            <Button onClick={handleFindTherapists} disabled={isLocating} variant="outline" size="sm">
              {isLocating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Near Me
                </>
              )}
            </Button>
          </div>
          <CardDescription>
           {localTherapists === null ? "Contact information for mental health professionals in India." : localTherapists.length > 0 ? `Showing therapists near you.` : `No therapists found in your city. Showing all available therapists.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {therapistsToDisplay.map((therapist) => (
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
