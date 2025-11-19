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

export type StressAssessment = AnalyzeUserInputToDetectStressLevelOutput & {
  stressLevel: number;
  sentimentInput: string;
  questionnaireResponses: string;
  assessmentDate: string;
}

export type StressFormState = {
  success: boolean;
  message: string;
  data?: StressAssessment;
};
