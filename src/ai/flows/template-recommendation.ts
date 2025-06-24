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

// Enforce that the output is one of the available templates.
const TemplateRecommendationOutputSchema = z.object({
  templateName: z.enum(['Modern', 'Classic', 'Creative']).describe('The name of the recommended template.'),
  reason: z.string().describe('A brief explanation of why this template is a good fit for the user\'s resume content.'),
});
export type TemplateRecommendationOutput = z.infer<typeof TemplateRecommendationOutputSchema>;

export async function recommendTemplate(input: TemplateRecommendationInput): Promise<TemplateRecommendationOutput> {
  return recommendTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'templateRecommendationPrompt',
  input: {schema: TemplateRecommendationInputSchema},
  output: {schema: TemplateRecommendationOutputSchema},
  prompt: `You are an expert resume template recommender. Based on the resume text provided, you will recommend the best resume template for the user.

The available templates are "Modern", "Classic", and "Creative".

-   **Modern**: Best for tech, startups, and contemporary fields. Features clean lines and a dynamic layout.
-   **Classic**: Best for traditional fields like law, finance, and academia. Features a timeless, professional, and straightforward format.
-   **Creative**: Best for design, arts, and marketing fields. Features a unique layout that allows for more visual expression.

Analyze the content of the resume (e.g., job titles, industries mentioned, skills) and choose the single most appropriate template from the list. Provide a very brief, one-sentence reason for your choice.

Resume Text:
{{{resumeText}}}
`,
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
