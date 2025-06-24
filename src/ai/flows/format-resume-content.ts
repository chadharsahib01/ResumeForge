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
  formattedResume: z.string().describe('The formatted resume content, as an HTML string.'),
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

Format the resume text into a single HTML string. **Crucially, you must use inline CSS styles for all formatting.** Do not use external stylesheets or Tailwind CSS classes. Do not include \`<html>\`, \`<head>\`, or \`<body>\` tags. The final output must be a self-contained block of HTML that can be injected into a \`<div>\`.

Make it look professional and polished, suitable for printing as a PDF. Use a common sans-serif font like Arial or Helvetica. The layout should be clean and easy to read. Use professional colors (e.g., shades of blue, gray, black).

Here is an example of the kind of inline styling expected:
\`<h2 style="font-size: 20px; color: #3F51B5; border-bottom: 2px solid #3F51B5; padding-bottom: 5px; margin-top: 20px;">Work Experience</h2>\`
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
