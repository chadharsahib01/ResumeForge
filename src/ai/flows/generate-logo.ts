'use server';
/**
 * @fileOverview Generates a personal logo using an AI image model.
 *
 * - generateLogo - A function that generates a logo.
 * - GenerateLogoInput - The input type for the generateLogo function.
 * - GenerateLogoOutput - The return type for the generateLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Helper to get initials from a name
const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const GenerateLogoInputSchema = z.object({
  name: z.string().describe('The full name of the user to generate initials from.'),
  industry: z.string().describe('The user\'s industry or profession (e.g., "Software Engineer", "Graphic Designer").'),
});
export type GenerateLogoInput = z.infer<typeof GenerateLogoInputSchema>;

const GenerateLogoOutputSchema = z.object({
  logoDataUri: z.string().describe('The generated logo as a data URI.'),
});
export type GenerateLogoOutput = z.infer<typeof GenerateLogoOutputSchema>;

export async function generateLogo(input: GenerateLogoInput): Promise<GenerateLogoOutput> {
  return generateLogoFlow(input);
}

const generateLogoFlow = ai.defineFlow(
  {
    name: 'generateLogoFlow',
    inputSchema: GenerateLogoInputSchema,
    outputSchema: GenerateLogoOutputSchema,
  },
  async ({ name, industry }) => {
    const initials = getInitials(name);
    const prompt = `Generate a very simple, elegant, and professional monogram-style logo using the initials "${initials}". The logo must be single-color (black) on a completely transparent background. It needs to be clean, modern, and suitable for a ${industry}'s resume. It should look good at a small size. Do not include any other text or elements. Minimalist vector style.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('AI model did not return an image.');
    }

    return { logoDataUri: media.url };
  }
);
