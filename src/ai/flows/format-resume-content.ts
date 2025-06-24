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
  prompt: `You are an AI resume formatting expert. You will take the raw resume text and format it into clean, semantic HTML based on the selected template style.

Resume Text:
{{{resumeText}}}

Template Name:
{{{templateName}}}

Format the resume text into a single HTML string.
**CRITICAL INSTRUCTIONS:**
1.  **DO NOT USE INLINE CSS STYLES.**
2.  **DO NOT INCLUDE \`<style>\`, \`<html>\`, \`<head>\`, or \`<body>\` tags.**
3.  The final output must be just the HTML content for the resume body, ready to be injected into a \`<div>\`.
4.  Use semantic class names to structure the content. For example:
    -   Top-level sections: \`<div class="section">\` with a \`<h2 class="section-title">Work Experience</h2>\`
    -   Contact info: \`<div class="contact-info">...\`
    -   Summary: \`<div class="summary">...\`
    -   Individual jobs/schools: \`<div class="entry">\`
    -   Header for an entry: \`<div class="entry-header">\` containing title and date.
    -   Sub-header for an entry: \`<div class="entry-subheader">\` containing company and location.
    -   Titles: \`<span class="entry-title">Senior Engineer</span>\`
    -   Dates: \`<span class="entry-date">Jan 2020 - Present</span>\`
    -   Description points: \`<ul class="details"><li>...</li></ul>\`
    -   Skills: \`<ul class="skills-list"><li>JavaScript</li>...</ul>\`
This structure is essential for the styling to be applied correctly.
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
    if (!output) {
      throw new Error('AI model did not return any content.');
    }
    
    const printStyles = `
<style>
  body { -webkit-print-color-adjust: exact; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #333; }
  .resume-wrapper { padding: 1rem; }
  h1, h2, h3, h4, h5, h6 { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #2c3e50; margin: 0; padding: 0; }
  h2.section-title { font-size: 20px; color: #3F51B5; border-bottom: 2px solid #3F51B5; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; }
  .contact-info { text-align: center; margin-bottom: 20px; font-size: 14px; line-height: 1.6; }
  .summary { margin-bottom: 20px; font-size: 15px; }
  .section { margin-bottom: 20px; }
  .entry { margin-bottom: 15px; page-break-inside: avoid; }
  .entry-header, .entry-subheader { display: flex; justify-content: space-between; flex-wrap: wrap; align-items: baseline; }
  .entry-title { font-size: 18px; font-weight: bold; }
  .entry-company, .entry-school { font-size: 16px; font-style: italic; color: #555; }
  .entry-date { font-weight: normal; color: #555; font-size: 15px;}
  .entry-location { font-style: italic; color: #555; }
  ul.details { padding-left: 20px; margin-top: 5px; }
  ul.details li { margin-bottom: 5px; }
  .skills-list { list-style-type: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .skills-list li { background-color: #E9EBF8; color: #3F51B5; padding: 4px 10px; border-radius: 12px; font-size: 14px; }
</style>
`;
    // The prompt now returns just the core HTML. We wrap it with styles.
    const finalHtml = `${printStyles}<div class="resume-wrapper">${output.formattedResume}</div>`;

    return { formattedResume: finalHtml };
  }
);
