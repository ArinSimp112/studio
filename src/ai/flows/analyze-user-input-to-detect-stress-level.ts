'use server';

/**
 * @fileOverview Analyzes user input and questionnaire responses to detect the user's stress level.
 *
 * - analyzeUserInputToDetectStressLevel - A function that handles the stress level detection process.
 * - AnalyzeUserInputToDetectStressLevelInput - The input type for the analyzeUserInputToDetectStressLevel function.
 * - AnalyzeUserInputToDetectStressLevelOutput - The return type for the analyzeUserInputToDetectStressLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserInputToDetectStressLevelInputSchema = z.object({
  feelings: z.string().describe('Description of the user\'s current feelings.'),
  problems: z.string().describe('Description of the problems the user is facing.'),
  questionnaireResponses: z
    .string()
    .describe('Responses to a quick questionnaire, as a single string.'),
});
export type AnalyzeUserInputToDetectStressLevelInput = z.infer<
  typeof AnalyzeUserInputToDetectStressLevelInputSchema
>;

const AnalyzeUserInputToDetectStressLevelOutputSchema = z.object({
  stressLevel: z
    .string()
    .describe(
      'The detected stress level of the user (e.g., low, medium, high).' + 
      'The response must contain only the stress level as a string.'
    ),
  keyStressors: z
    .string()
    .describe('A summary of the key stressors identified from the user input.'),
  advice: z.string().describe('Personalized advice and resources based on the detected stress level.'),
});
export type AnalyzeUserInputToDetectStressLevelOutput = z.infer<
  typeof AnalyzeUserInputToDetectStressLevelOutputSchema
>;

export async function analyzeUserInputToDetectStressLevel(
  input: AnalyzeUserInputToDetectStressLevelInput
): Promise<AnalyzeUserInputToDetectStressLevelOutput> {
  return analyzeUserInputToDetectStressLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserInputToDetectStressLevelPrompt',
  input: {schema: AnalyzeUserInputToDetectStressLevelInputSchema},
  output: {schema: AnalyzeUserInputToDetectStressLevelOutputSchema},
  prompt: `You are an AI expert in mental health assessment. Analyze the user's input to determine their stress level and provide personalized advice.

Here's the information about the user's current situation:

Feelings: {{{feelings}}}
Problems: {{{problems}}}
Questionnaire Responses: {{{questionnaireResponses}}}

Based on this information, determine the user's stress level (low, medium, or high), identify the key stressors, and provide personalized advice and resources. Respond in a structured format including only the string value for stressLevel, and string values for keyStressors and advice, no other content.

Stress Level: {{stressLevel}}
Key Stressors: {{keyStressors}}
Advice: {{advice}}`,
});

const analyzeUserInputToDetectStressLevelFlow = ai.defineFlow(
  {
    name: 'analyzeUserInputToDetectStressLevelFlow',
    inputSchema: AnalyzeUserInputToDetectStressLevelInputSchema,
    outputSchema: AnalyzeUserInputToDetectStressLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
