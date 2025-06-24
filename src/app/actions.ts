'use server';

import { formatResumeContent, FormatResumeContentInput } from '@/ai/flows/format-resume-content';
import { parseResumeText, ParseResumeTextInput, ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';
import { recommendTemplate, TemplateRecommendationInput, TemplateRecommendationOutput } from '@/ai/flows/template-recommendation';
import { generateCoverLetter, GenerateCoverLetterInput, GenerateCoverLetterOutput } from '@/ai/flows/generate-cover-letter';
import { generateLogo, GenerateLogoInput } from '@/ai/flows/generate-logo';

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

interface RecommendResult {
    recommendation?: TemplateRecommendationOutput;
    error?: string;
}

export async function recommendTemplateAction(input: TemplateRecommendationInput): Promise<RecommendResult> {
    try {
        const recommendation = await recommendTemplate(input);
        if (!recommendation) {
            return { error: 'Failed to get template recommendation.' };
        }
        return { recommendation };
    } catch (e: any) {
        console.error('Error recommending template:', e);
        // Don't surface this error to the user, it's a non-critical feature.
        return { error: 'Could not get a recommendation.' };
    }
}

interface CoverLetterResult {
    coverLetter?: string;
    error?: string;
}

export async function generateCoverLetterAction(input: GenerateCoverLetterInput): Promise<CoverLetterResult> {
    try {
        const { coverLetter } = await generateCoverLetter(input);
        if (!coverLetter) {
            return { error: 'Failed to generate cover letter. The AI model did not return any content.' };
        }
        return { coverLetter };
    } catch (e: any) {
        console.error('Error generating cover letter:', e);
        return { error: 'An unexpected error occurred while generating your cover letter. Please try again later.' };
    }
}

interface LogoResult {
    logoDataUri?: string;
    error?: string;
}

export async function generateLogoAction(input: GenerateLogoInput): Promise<LogoResult> {
    try {
        const { logoDataUri } = await generateLogo(input);
        if (!logoDataUri) {
            return { error: 'Failed to generate logo. The AI model did not return an image.' };
        }
        return { logoDataUri };
    } catch (e: any) {
        console.error('Error generating logo:', e);
        return { error: 'An unexpected error occurred while generating your logo. Please try again later.' };
    }
}
