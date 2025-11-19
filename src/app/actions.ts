"use server";

import {
  analyzeUserInputToDetectStressLevel,
  type AnalyzeUserInputToDetectStressLevelInput,
} from "@/ai/flows/analyze-user-input-to-detect-stress-level";
import { getCityFromCoordinates, type GetCityFromCoordinatesInput } from "@/ai/flows/get-city-from-coordinates";
import { stressSchema, type StressFormState } from "@/app/schema";


export async function analyzeStress(
  prevState: StressFormState,
  formData: FormData
): Promise<StressFormState> {
  const validatedFields = stressSchema.safeParse({
    feelings: formData.get("feelings"),
    problems: formData.get("problems"),
    sleep: formData.get("sleep"),
    appetite: formData.get("appetite"),
    overwhelmed: formData.get("overwhelmed"),
    energy: formData.get("energy"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check your inputs.",
      data: undefined,
    };
  }

  const { feelings, problems, sleep, appetite, overwhelmed, energy } = validatedFields.data;

  const questionnaireResponses = `
    - How have you been sleeping lately? ${sleep}
    - How is your appetite? ${appetite}
    - Are you feeling overwhelmed by your responsibilities? ${overwhelmed}
    - How would you rate your energy levels? ${energy}
  `;

  const aiInput: AnalyzeUserInputToDetectStressLevelInput = {
    feelings,
    problems,
    questionnaireResponses,
  };

  try {
    const result = await analyzeUserInputToDetectStressLevel(aiInput);
    
    const stressLevelMap: { [key: string]: number } = {
      "low": 3,
      "medium": 6,
      "high": 9,
    };
    const stressLevel = stressLevelMap[result.stressLevel.toLowerCase()] || 5;


    const dataToSave = {
      ...result,
      stressLevel,
      sentimentInput: feelings,
      questionnaireResponses,
      assessmentDate: new Date().toISOString()
    }

    return { success: true, message: "Analysis complete.", data: dataToSave };
  } catch (error) {
    console.error("AI analysis failed:", error);
    return { success: false, message: "Sorry, we couldn't analyze your stress level at the moment. Please try again.", data: undefined };
  }
}

export async function getCityFromCoords(coords: GetCityFromCoordinatesInput): Promise<string | null> {
  try {
    const result = await getCityFromCoordinates(coords);
    return result.city;
  } catch (error) {
    console.error("Failed to get city from coordinates:", error);
    return null;
  }
}
