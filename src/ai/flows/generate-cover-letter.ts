'use server';
/**
 * @fileOverview Generates a cover letter based on resume content and a job description.
 *
 * - generateCoverLetter - A function that handles the cover letter generation.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resumeText: z.string().describe('The full text of the user\'s resume.'),
  jobDescription: z.string().describe('The full text of the job description the user is applying for.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are a professional career coach and expert cover letter writer. Your task is to write a compelling, professional, and concise cover letter for a job applicant.

You will be given the applicant's resume and the job description for the role they are applying for.

Carefully analyze the job description to understand the key requirements, skills, and qualifications the employer is looking for.
Then, review the applicant's resume to identify their most relevant experiences, skills, and accomplishments that align with the job description.

Your generated cover letter should:
1.  Be structured professionally with an introduction, body, and conclusion.
2.  Highlight 2-3 of the applicant's most relevant qualifications and experiences from their resume.
3.  Directly address the needs mentioned in the job description.
4.  Maintain a confident and professional tone.
5.  Keep the letter concise, ideally around 3-4 paragraphs.
6.  Do not invent any information. Base the letter strictly on the provided resume and job description.
7.  The output should be only the text of the cover letter. Do not include a subject line or contact information headers unless they are present in the resume.

Applicant's Resume:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}
`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI model did not return any content.');
    }
    return output;
  }
);
