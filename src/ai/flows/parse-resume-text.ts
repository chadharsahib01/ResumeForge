// This is an example Genkit flow definition.
'use server';
/**
 * @fileOverview Parses unformatted resume text into structured data.
 *
 * - parseResumeText - A function that parses resume text.
 * - ParseResumeTextInput - The input type for the parseResumeText function.
 * - ParseResumeTextOutput - The return type for the parseResumeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeTextInputSchema = z.object({
  resumeText: z.string().describe('The raw, unformatted text of the resume.'),
});
export type ParseResumeTextInput = z.infer<typeof ParseResumeTextInputSchema>;

const ParseResumeTextOutputSchema = z.object({
  contactInformation: z
    .string() // Looser schema to allow free-form parsing.
    .describe('The contact information of the resume, including name, address, phone number, and email.'),
  workExperience: z
    .array(z.string())
    .describe('An array of strings, where each string is a work experience entry.'),
  education: z
    .array(z.string())
    .describe('An array of strings, where each string is an education entry.'),
  skills: z.array(z.string()).describe('An array of skills listed in the resume.'),
  summary: z.string().describe('A summary or objective statement from the resume.'),
});
export type ParseResumeTextOutput = z.infer<typeof ParseResumeTextOutputSchema>;

export async function parseResumeText(input: ParseResumeTextInput): Promise<ParseResumeTextOutput> {
  return parseResumeTextFlow(input);
}

const parseResumeTextPrompt = ai.definePrompt({
  name: 'parseResumeTextPrompt',
  input: {schema: ParseResumeTextInputSchema},
  output: {schema: ParseResumeTextOutputSchema},
  prompt: `You are an expert resume parser. Your job is to take the raw text of a resume and parse it into structured data.

Here is the resume text:

{{resumeText}}

Parse the resume text into the following sections:

- contactInformation: The contact information of the resume, including name, address, phone number, and email.
- workExperience: An array of strings, where each string is a work experience entry.
- education: An array of strings, where each string is an education entry.
- skills: An array of skills listed in the resume.
- summary: A summary or objective statement from the resume.

Return the parsed data in JSON format.`,
});

const parseResumeTextFlow = ai.defineFlow(
  {
    name: 'parseResumeTextFlow',
    inputSchema: ParseResumeTextInputSchema,
    outputSchema: ParseResumeTextOutputSchema,
  },
  async input => {
    const {output} = await parseResumeTextPrompt(input);
    return output!;
  }
);
