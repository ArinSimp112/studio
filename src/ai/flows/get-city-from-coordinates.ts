'use server';
/**
 * @fileOverview This file defines a Genkit flow for getting the city from coordinates.
 *
 * - getCityFromCoordinates - The main function to trigger the flow.
 * - GetCityFromCoordinatesInput - The input type for the flow.
 * - GetCityFromCoordinatesOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

// Define the prompt
const getCityPrompt = ai.definePrompt({
  name: 'getCityPrompt',
  input: {schema: GetCityFromCoordinatesInputSchema},
  output: {schema: GetCityFromCoordinatesOutputSchema},
  prompt: `Based on the provided latitude and longitude, identify the corresponding city.
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  Return only the city name.`,
});

// Define the flow
const getCityFlow = ai.defineFlow(
  {
    name: 'getCityFlow',
    inputSchema: GetCityFromCoordinatesInputSchema,
    outputSchema: GetCityFromCoordinatesOutputSchema,
  },
  async (input) => {
    const {output} = await getCityPrompt(input);
    return output!;
  }
);

// Exported function to get city from coordinates
export async function getCityFromCoordinates(input: GetCityFromCoordinatesInput): Promise<GetCityFromCoordinatesOutput> {
  return getCityFlow(input);
}
