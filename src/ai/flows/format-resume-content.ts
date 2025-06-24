// format-resume-content.ts
'use server';

/**
 * @fileOverview Formats resume content based on a selected template.
 *
 * - formatResumeContent - A function that formats resume content.
 * - FormatResumeContentInput - The input type for the formatResumeContent function.
 * - FormatResumeContentOutput - The return type for the formatResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatResumeContentInputSchema = z.object({
  resumeText: z.string().describe('The raw text of the resume content.'),
  templateName: z.string().describe('The name of the selected resume template.'),
});
export type FormatResumeContentInput = z.infer<typeof FormatResumeContentInputSchema>;

const FormatResumeContentOutputSchema = z.object({
  formattedResume: z.string().describe('The formatted resume content, ready for PDF conversion.'),
});
export type FormatResumeContentOutput = z.infer<typeof FormatResumeContentOutputSchema>;

export async function formatResumeContent(input: FormatResumeContentInput): Promise<FormatResumeContentOutput> {
  return formatResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResumeContentPrompt',
  input: {schema: FormatResumeContentInputSchema},
  output: {schema: FormatResumeContentOutputSchema},
  prompt: `You are an AI resume formatting expert. You will take the raw resume text provided and format it according to the selected template, ensuring it is ATS-friendly and highlights the most relevant information for recruiters.

Resume Text:
{{{resumeText}}}

Template Name:
{{{templateName}}}

Format the resume text according to the specified template. Ensure the output is a well-formatted, ATS-friendly resume.
`,  
});

const formatResumeContentFlow = ai.defineFlow(
  {
    name: 'formatResumeContentFlow',
    inputSchema: FormatResumeContentInputSchema,
    outputSchema: FormatResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
