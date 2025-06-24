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
  templateName: z.string().describe('The name of the selected resume template. One of "Modern", "Classic", or "Creative". This should influence the styling.'),
  logoDataUri: z.string().optional().describe('An optional data URI for a personal logo image.'),
});
export type FormatResumeContentInput = z.infer<typeof FormatResumeContentInputSchema>;

const FormatResumeContentOutputSchema = z.object({
  formattedResume: z.string().describe('The formatted resume content, as a single, self-contained HTML string using Tailwind CSS classes.'),
});
export type FormatResumeContentOutput = z.infer<typeof FormatResumeContentOutputSchema>;

export async function formatResumeContent(input: FormatResumeContentInput): Promise<FormatResumeContentOutput> {
  return formatResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResumeContentPrompt',
  input: {schema: FormatResumeContentInputSchema},
  output: {schema: FormatResumeContentOutputSchema},
  prompt: `You are an expert resume designer who creates visually appealing, professional resumes using HTML and Tailwind CSS.

**TASK:**
Convert the provided raw resume text into a single, well-formed, self-contained HTML string.

**CRITICAL INSTRUCTIONS:**
1.  **SINGLE HTML STRING:** The entire output must be a single HTML string.
2.  **TAILWIND CSS ONLY:** Use only Tailwind CSS classes for all styling. Do not use <style> tags or inline style attributes.
3.  **CONTAINER AND COLORS:** The entire output MUST be wrapped in a single container: \`<div class="p-8 font-sans bg-white text-gray-800">\`. This provides a solid white background and dark text.
4.  **PROFESSIONAL DESIGN:** The design should be clean, professional, and easy to read. Pay close attention to spacing, typography, and hierarchy. Use the selected template name ({{{templateName}}}) as a guide for the overall aesthetic (e.g., 'Classic' should be more traditional, 'Creative' can use more color or unique layouts).
5.  **LOGO INTEGRATION:** {{#if logoDataUri}}A personal logo has been provided. You MUST include it at the very top of the resume, right after the opening \`<div>\` tag. The image tag must be styled like this: \`<img src="{{{logoDataUri}}}" alt="Personal Logo" class="mx-auto mb-6 h-20 w-20 rounded-full border p-1" />\`{{/if}}

**INPUTS:**
-   **Resume Text:**
    {{{resumeText}}}
-   **Selected Template Name:**
    {{{templateName}}}

**EXAMPLE HTML STRUCTURE FOR A SECTION:**
\`\`\`html
<div class="mb-6">
  <h2 class="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-3 text-gray-700">Work Experience</h2>
  
  <div class="mb-4">
    <div class="flex justify-between items-baseline">
      <h3 class="text-lg font-semibold text-gray-800">Senior Software Engineer</h3>
      <p class="text-sm text-gray-600">Jan 2020 - Present</p>
    </div>
    <div class="flex justify-between items-baseline">
      <p class="text-md font-medium text-gray-700">Tech Solutions Inc.</p>
      <p class="text-sm text-gray-600">San Francisco, CA</p>
    </div>
    <ul class="list-disc list-inside mt-2 text-gray-700 space-y-1">
      <li>Developed and maintained web applications using React and Node.js.</li>
      <li>Led a team of 3 junior developers.</li>
    </ul>
  </div>

  <!-- ... more entries ... -->
</div>
\`\`\`

Now, generate the complete, styled HTML for the provided resume text.
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
    if (!output || !output.formattedResume) {
      throw new Error('AI model did not return any valid content.');
    }
    // Basic validation to ensure it's likely HTML
    if (!output.formattedResume.includes('<div')) {
      throw new Error('AI model returned non-HTML content.');
    }
    return output;
  }
);
