'use server';

import { formatResumeContent, FormatResumeContentInput } from '@/ai/flows/format-resume-content';

interface ActionResult {
  formattedResume?: string;
  error?: string;
}

export async function generateResumeAction(input: FormatResumeContentInput): Promise<ActionResult> {
  try {
    const { formattedResume } = await formatResumeContent(input);
    if (!formattedResume) {
      return { error: 'Failed to generate resume. The AI model did not return any content.' };
    }
    return { formattedResume };
  } catch (e: any) {
    console.error('Error generating resume:', e);
    return { error: 'An unexpected error occurred while generating your resume. Please try again later.' };
  }
}
