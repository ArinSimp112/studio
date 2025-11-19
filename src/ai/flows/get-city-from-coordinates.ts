'use server';
/**
 * @fileOverview This file defines a Genkit flow for getting the city from coordinates.
 *
 * - getCityFromCoordinates - The main function to trigger the flow.
 */

import {ai} from '@/ai/genkit';
import {
  GetCityFromCoordinatesInputSchema,
  type GetCityFromCoordinatesInput,
  GetCityFromCoordinatesOutputSchema,
  type GetCityFromCoordinatesOutput,
} from '@/app/schema';


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
