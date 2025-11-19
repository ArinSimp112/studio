'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized stress management advice based on user input.
 *
 * The flow analyzes user-provided data about their feelings, problems, and responses to a quick questionnaire to determine their stress level and offer tailored advice.
 *
 * - providePersonalizedAdvice - The main function to trigger the flow.
 * - PersonalizedAdviceInput - The input type for the flow, encompassing sentiment input and questionnaire responses.
 * - PersonalizedAdviceOutput - The output type, providing a stress level assessment and personalized advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the personalized advice flow
const PersonalizedAdviceInputSchema = z.object({
  sentimentInput: z.string().describe('User input describing their current feelings and problems.'),
  questionnaireResponses: z.string().describe('User responses to a quick questionnaire.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

// Define the output schema for the personalized advice flow
const PersonalizedAdviceOutputSchema = z.object({
  stressLevel: z.string().describe('The assessed stress level of the user (e.g., Low, Medium, High).'),
  personalizedAdvice: z.string().describe('Personalized advice and resources based on the detected stress level.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

// Exported function to provide personalized advice
export async function providePersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  return personalizedAdviceFlow(input);
}

// Define the prompt for generating personalized advice
const personalizedAdvicePrompt = ai.definePrompt({
  name: 'personalizedAdvicePrompt',
  input: {schema: PersonalizedAdviceInputSchema},
  output: {schema: PersonalizedAdviceOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized stress management advice.

  Analyze the following user input to determine their stress level and provide tailored advice and resources.

  Sentiment Input: {{{sentimentInput}}}
  Questionnaire Responses: {{{questionnaireResponses}}}

  Based on the user's input, assess their stress level as Low, Medium, or High.
  Then, provide personalized advice and resources relevant to their situation.  Include concrete steps the user can take to reduce their stress and coping mechanisms.
`,
});

// Define the Genkit flow for providing personalized advice
const personalizedAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async input => {
    const {output} = await personalizedAdvicePrompt(input);
    return output!;
  }
);
