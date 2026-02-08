
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
      'The detected stress level of the user as a numerical string on a scale of 0 to 100.'
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
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      }
    ],
  },
  prompt: `You are an AI expert in mental health assessment, acting as an empathetic and caring companion. Your goal is to analyze the user's input to determine their stress level, identify key stressors, and provide personalized, actionable advice. Your analysis should be informed by patterns seen in psychological surveys.

Carefully review all the information provided:

1.  **User's Feelings:** {{{feelings}}}
2.  **User's Problems:** {{{problems}}}
3.  **Questionnaire Responses:** {{{questionnaireResponses}}}

**Your Task:**

1.  **Assess Stress Level:**
    *   Synthesize all the information to determine the user's stress level. Provide a single numerical **stressLevel** as a STRING on a scale of 0 to 100, where 0 is no stress and 100 is extreme stress.
    *   Base your assessment on clinical indicators.
    *   Consider the intensity of language, the nature of the problems, and the impact on daily life indicated by the questionnaire. If the user's input is not directly related to stress (e.g., "I feel horny"), gently reframe towards wellness. You can classify such inputs as 'low' stress but acknowledge the feeling and pivot to a more general wellness check-in in your advice.

2.  **Identify Key Stressors:**
    *   Based on the "Feelings" and "Problems" sections, summarize the primary sources of the user's stress in a conversational way.
    *   Be specific. Instead of "work," identify "tight deadlines at work" or "conflict with a colleague." If no stressors are mentioned, state something like "It's great that you're not facing any specific stressors right now."

3.  **Provide Personalized Advice:**
    *   Generate compassionate and actionable advice tailored to the identified stressors and stress level. Avoid generic advice.
    *   For **Low** stress, suggest preventative care, mindfulness, and healthy habits. If the input was unrelated to stress, provide general wellness tips like staying hydrated, getting enough sleep, or connecting with friends.
    *   For **Mid** stress, offer specific coping strategies. For work stress, suggest time management techniques (like the Pomodoro Technique). For relationship issues, suggest communication exercises. Recommend relevant resources like articles or podcasts on those specific topics.
    *   For **High** stress, provide immediate grounding techniques (e.g., the 5-4-3-2-1 method), strongly recommend seeking professional help, and break down advice into small, manageable steps to avoid overwhelm.
    *   For **Severe** stress, the advice should be very direct, emphasizing the importance of immediate professional help, providing resources for crisis support, and offering simple, immediate grounding techniques.
    *   The advice should be structured, easy to read (e.g., using bullet points or numbered lists within the string), encouraging, and use a warm, conversational tone.

Produce a structured response with the correct data types for stressLevel, keyStressors, and advice.`,
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
