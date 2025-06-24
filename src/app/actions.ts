'use server';

import { formatResumeContent, FormatResumeContentInput } from '@/ai/flows/format-resume-content';
import { parseResumeText, ParseResumeTextInput, ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';

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

interface ParseResult {
  parsedData?: ParseResumeTextOutput;
  error?: string;
}

export async function parseResumeAction(input: ParseResumeTextInput): Promise<ParseResult> {
  try {
    const parsedData = await parseResumeText(input);
    if (!parsedData) {
      return { error: 'Failed to parse resume. The AI model did not return any data.' };
    }
    return { parsedData };
  } catch (e: any)
  {
    console.error('Error parsing resume:', e);
    return { error: 'An unexpected error occurred while parsing your resume. Please try again later.' };
  }
}
