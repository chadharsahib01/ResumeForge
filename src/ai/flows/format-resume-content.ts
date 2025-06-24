// This is an example Genkit flow definition.
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
  prompt: `You are an AI resume formatting expert. Your task is to convert raw resume text into clean, structured, and semantic HTML based on a selected template style.

Resume Text to Format:
{{{resumeText}}}

Selected Template Name:
{{{templateName}}}

**CRITICAL INSTRUCTIONS:**
1.  **If a \`logoDataUri\` is provided, you MUST include it at the very top of the resume.** The image tag should look like this: \`<img src="{{{logoDataUri}}}" alt="Personal Logo" class="personal-logo" />\`. It should be inside the main \`<div class="resume-wrapper">\`, but before any other content like contact information.
2.  **DO NOT USE ANY INLINE CSS STYLES (e.g., \`<div style="...">\`).**
3.  **DO NOT INCLUDE A \`<style>\` TAG, \`<html>\`, \`<head>\`, or \`<body>\` TAGS.**
4.  The entire output must be a single, well-formed HTML string ready to be injected into a parent container.
5.  Use the following semantic class names precisely as specified. This structure is essential for the front-end styling to be applied correctly.

    -   **Main Container:** The entire resume should be wrapped in \`<div class="resume-wrapper">\`.
    -   **Logo:** If present, the logo image should be \`<img class="personal-logo" ... />\`.
    -   **Contact Info:** Use \`<div class="contact-info">\`. Inside, use simple \`<p>\` tags for name, email, phone, etc. The main name should be in an \`<h1>\`.
    -   **Summary:** Use \`<div class="summary">\`. The content should be in a \`<p>\` tag.
    -   **Sections (like Experience, Education):** Each major section must be wrapped in \`<div class="section">\`.
    -   **Section Title:** Inside each section, the title must be an \`<h2 class="section-title">\`. For example: \`<h2 class="section-title">Work Experience</h2>\`.
    -   **Individual Entries (Job, School):** Each entry within a section (e.g., a single job) must be in \`<div class="entry">\`.
    -   **Entry Header:** The top part of an entry containing the title and date must be in \`<div class="entry-header">\`.
    -   **Entry Sub-header:** The part of an entry with company/school and location must be in \`<div class="entry-subheader">\`.
    -   **Specific Fields:**
        -   Job Title/Degree: \`<span class="entry-title">Senior Engineer</span>\`
        -   Company/School Name: \`<span class="entry-company">Tech Solutions Inc.</span>\` or \`<span class="entry-school">University of Technology</span>\`
        -   Date Range: \`<span class="entry-date">Jan 2020 - Present</span>\`
        -   Location: \`<span class="entry-location">Remote</span>\`
    -   **Details/Bullet Points:** Use a \`<ul class="details">\` for description bullet points, with each point being an \`<li>\`.
    -   **Skills:** For a skills section, use a \`<ul class="skills-list">\` with each skill being an \`<li>\`.

Example of a "Work Experience" entry structure:
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

Now, generate the complete HTML for the provided resume text and template.
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
    // The prompt now generates the complete, clean HTML. We just return it.
    return output;
  }
);
