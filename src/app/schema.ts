import type { AnalyzeUserInputToDetectStressLevelOutput } from "@/ai/flows/analyze-user-input-to-detect-stress-level";
import { z } from "zod";

export const stressSchema = z.object({
  feelings: z.string(),
  problems: z.string(),
  sleep: z.string().min(1, "Please select an option."),
  appetite: z.string().min(1, "Please select an option."),
  overwhelmed: z.string().min(1, "Please select an option."),
  energy: z.string().min(1, "Please select an option."),
});

// This is the data structure used throughout the application, after processing the AI response.
export type StressAssessment = {
  stressLevel: number;
  keyStressors: string;
  advice: string;
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
