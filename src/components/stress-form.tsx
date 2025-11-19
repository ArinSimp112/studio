"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { analyzeStress } from "@/app/actions";
import { stressSchema, StressAssessment } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";

type StressFormProps = {
  setResults: (results: StressAssessment) => void;
}

const questionnaireItems = [
  { name: "sleep", label: "How have you been sleeping lately?", options: ["Well", "Restlessly", "Poorly"] },
  { name: "appetite", label: "How is your appetite?", options: ["Normal", "Increased", "Decreased"] },
  { name: "overwhelmed", label: "Are you feeling overwhelmed by your responsibilities?", options: ["Not at all", "Sometimes", "Often"] },
  { name: "energy", label: "How would you rate your energy levels?", options: ["High", "Medium", "Low"] },
] as const;

export function StressForm({ setResults }: StressFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof stressSchema>>({
    resolver: zodResolver(stressSchema),
    defaultValues: {
      feelings: "",
      problems: "",
      sleep: "Well",
      appetite: "Normal",
      overwhelmed: "Not at all",
      energy: "High",
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof stressSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await analyzeStress({success: false, message: ''}, formData);

    if (result.success && result.data) {
      setResults(result.data);
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.message || "There was a problem. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">How are you feeling?</CardTitle>
            <CardDescription>
              Share your thoughts and answer a few questions to get an AI-powered stress analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="feelings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your current feelings.</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I'm feeling anxious and tired..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What problems are you facing in your life?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I have a big deadline at work and I'm worried about it." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Questionnaire</h3>
              {questionnaireItems.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                        >
                          {item.options.map((option) => (
                            <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Analyze My Stress
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
