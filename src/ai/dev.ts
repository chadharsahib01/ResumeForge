import { config } from 'dotenv';
config();

import '@/ai/flows/template-recommendation.ts';
import '@/ai/flows/format-resume-content.ts';
import '@/ai/flows/parse-resume-text.ts';
import '@/ai/flows/generate-cover-letter.ts';
import '@/ai/flows/generate-logo.ts';
