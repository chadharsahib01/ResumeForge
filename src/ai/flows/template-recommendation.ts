// src/ai/flows/template-recommendation.ts
'use server';

/**
 * @fileOverview Recommends suitable resume templates based on user-provided content.
 *
 * - recommendTemplate - A function that recommends a resume template.
 * - TemplateRecommendationInput - The input type for the recommendTemplate function.
 * - TemplateRecommendationOutput - The return type for the recommendTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TemplateRecommendationInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The resume text provided by the user.'),
});
export type TemplateRecommendationInput = z.infer<typeof TemplateRecommendationInputSchema>;

const TemplateRecommendationOutputSchema = z.object({
  templateName: z.string().describe('The name of the recommended template.'),
  templateDescription: z.string().describe('A description of the recommended template and why it is suitable.'),
});
export type TemplateRecommendationOutput = z.infer<typeof TemplateRecommendationOutputSchema>;

export async function recommendTemplate(input: TemplateRecommendationInput): Promise<TemplateRecommendationOutput> {
  return recommendTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'templateRecommendationPrompt',
  input: {schema: TemplateRecommendationInputSchema},
  output: {schema: TemplateRecommendationOutputSchema},
  prompt: `You are an expert resume template recommender. Based on the resume text provided, you will recommend the best resume template for the user. The template should be ATS-friendly and optimized for HR preferences.

Resume Text:
{{{resumeText}}}

Consider various resume templates and recommend the most suitable one, including a brief explanation of why the template is a good fit.

Output:
Template Name: {templateName}
Template Description: {templateDescription}`,
});

const recommendTemplateFlow = ai.defineFlow(
  {
    name: 'recommendTemplateFlow',
    inputSchema: TemplateRecommendationInputSchema,
    outputSchema: TemplateRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
