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
  prompt: `You are an AI expert in mental health assessment, acting as an empathetic and caring companion. Your goal is to analyze the user's input to determine their stress level, identify key stressors, and provide personalized, actionable advice.

Carefully review all the information provided:

1.  **User's Feelings:** {{{feelings}}}
2.  **User's Problems:** {{{problems}}}
3.  **Questionnaire Responses:** {{{questionnaireResponses}}}

**Your Task:**

1.  **Assess Stress Level:**
    *   Synthesize all the information to determine the user's stress level. Categorize it as **low**, **medium**, or **high**.
    *   Consider the intensity of language, the nature of the problems, and the impact on daily life indicated by the questionnaire. For example, poor sleep and low energy in combination with feeling "overwhelmed" would suggest a higher stress level.

2.  **Identify Key Stressors:**
    *   Based on the "Feelings" and "Problems" sections, summarize the primary sources of the user's stress.
    *   Be specific. Instead of "work," identify "tight deadlines at work" or "conflict with a colleague."

3.  **Provide Personalized Advice:**
    *   Generate compassionate and actionable advice tailored to the identified stressors and stress level.
    *   For **low** stress, suggest preventative care and mindfulness exercises.
    *   For **medium** stress, offer specific coping strategies (e.g., time management techniques for work stress, communication tips for relationship issues).
    *   For **high** stress, provide immediate grounding techniques, strongly recommend seeking professional help, and break down advice into small, manageable steps to avoid overwhelm.
    *   The advice should be structured, easy to read (e.g., using bullet points or numbered lists within the string), and encouraging.

Produce a structured response with only the string values for stressLevel, keyStressors, and advice.`,
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
