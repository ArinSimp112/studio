import type { AnalyzeUserInputToDetectStressLevelOutput } from "@/ai/flows/analyze-user-input-to-detect-stress-level";
import { z } from "zod";

export const stressSchema = z.object({
  feelings: z.string().min(10, { message: "Please describe your feelings in a bit more detail." }),
  problems: z.string().min(10, { message: "Please describe the problems you're facing in a bit more detail." }),
  sleep: z.string().min(1, "Please select an option."),
  appetite: z.string().min(1, "Please select an option."),
  overwhelmed: z.string().min(1, "Please select an option."),
  energy: z.string().min(1, "Please select an option."),
});

// The AI output now includes stressScore directly.
// We are mapping the AI's stressScore (0-100) to our 'stressLevel' field for consistency in data storage and charting.
export type StressAssessment = AnalyzeUserInputToDetectStressLevelOutput & {
  stressLevel: number; // This will now hold the score from 0-100
  sentimentInput: string;
  questionnaireResponses: string;
  assessmentDate: string;
}

export type StressFormState = {
  success: boolean;
  message: string;
  data?: StressAssessment;
};

// Define the input schema
export const GetCityFromCoordinatesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetCityFromCoordinatesInput = z.infer<typeof GetCityFromCoordinatesInputSchema>;

// Define the output schema
export const GetCityFromCoordinatesOutputSchema = z.object({
  city: z.string().describe('The city name corresponding to the coordinates.'),
});
export type GetCityFromCoordinatesOutput = z.infer<typeof GetCityFromCoordinatesOutputSchema>;
