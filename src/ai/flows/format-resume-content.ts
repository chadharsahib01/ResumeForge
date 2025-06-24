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
  templateName: z.string().describe('The name of the selected resume template. One of "Modern", "Classic", or "Creative".'),
  logoDataUri: z.string().optional().describe('An optional data URI for a personal logo image.'),
});
export type FormatResumeContentInput = z.infer<typeof FormatResumeContentInputSchema>;

const FormatResumeContentOutputSchema = z.object({
  formattedResume: z.string().describe('The formatted resume content, as a single HTML string.'),
});
export type FormatResumeContentOutput = z.infer<typeof FormatResumeContentOutputSchema>;

export async function formatResumeContent(input: FormatResumeContentInput): Promise<FormatResumeContentOutput> {
  return formatResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResumeContentPrompt',
  input: {schema: FormatResumeContentInputSchema},
  output: {schema: FormatResumeContentOutputSchema},
  prompt: `You are an expert resume formatting expert specializing in creating clean, semantic HTML that is both visually appealing on screen and prints perfectly.

**INPUTS:**
- **Resume Text:**
  {{{resumeText}}}
- **Selected Template Name:**
  {{{templateName}}}
{{#if logoDataUri}}
- **Personal Logo:**
  A personal logo has been provided. You MUST include it. The URI is: {{{logoDataUri}}}
{{/if}}

**CRITICAL INSTRUCTIONS:**
1.  **Output MUST be a single, well-formed HTML string.**
2.  **The entire resume must be wrapped in a single main container: \`<div class="resume-wrapper">\`.**
3.  **{{#if logoDataUri}}The user provided a logo. You MUST place it at the top of the resume, inside the wrapper div. The image tag MUST be exactly: \`<img src="{{{logoDataUri}}}" alt="Personal Logo" class="personal-logo" />\`{{/if}}**
4.  **Use ONLY the specified semantic class names.** This is essential for styling and printing.
5.  **ABSOLUTELY NO INLINE CSS (\`style\` attribute) OR \`<style>\` TAGS.** Do not include \`<html>\`, \`<head>\`, or \`<body>\` tags.

**HTML STRUCTURE & CLASS NAMES:**
-   **Main Container:** \`<div class="resume-wrapper">\`.
-   **Logo (if present):** \`<img class="personal-logo" ... />\`.
-   **Contact Info:** \`<div class="contact-info">\`. Use \`<p>\` tags for details and an \`<h1>\` for the name.
-   **Summary:** \`<div class="summary">\` with a \`<p>\` tag inside.
-   **Sections (Experience, Education, etc.):** Wrap each in \`<div class="section">\`.
-   **Section Title:** Use \`<h2 class="section-title">\`.
-   **Individual Entries (Job, School):** Wrap each in \`<div class="entry">\`.
-   **Entry Header:** \`<div class="entry-header">\` containing title and date.
-   **Entry Sub-header:** \`<div class="entry-subheader">\` for company/school and location.
-   **Specific Fields:**
    -   Job Title/Degree: \`<span class="entry-title">\`
    -   Company/School Name: \`<span class="entry-company">\` or \`<span class="entry-school">\`
    -   Date Range: \`<span class="entry-date">\`
    -   Location: \`<span class="entry-location">\`
-   **Details/Bullet Points:** Use \`<ul class="details">\` with \`<li>\` for each point.
-   **Skills:** Use a \`<ul class="skills-list">\` with each skill as an \`<li>\`.

**Example Entry:**
\`\`\`html
<div class="entry">
  <div class="entry-header">
    <span class="entry-title">Senior Software Engineer</span>
    <span class="entry-date">Jan 2020 - Present</span>
  </div>
  <div class="entry-subheader">
    <span class="entry-company">Tech Solutions Inc.</span>
    <span class="entry-location">San Francisco, CA</span>
  </div>
  <ul class="details">
    <li>Developed and maintained web applications using React and Node.js.</li>
    <li>Led a team of 3 junior developers.</li>
  </ul>
</div>
\`\`\`

Now, generate the complete HTML for the provided resume text.
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
