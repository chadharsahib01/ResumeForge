'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, Check, Wand2, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ResumeFormProps {
  onGenerateSubmit: (resumeText: string, templateName: string) => void;
  onParseAndRecommend: () => Promise<{ recommendedTemplate: string | null; reason: string | null; }>;
  isLoading: boolean;
  isParsing: boolean;
  resumeText: string;
  setResumeText: (text: string) => void;
  parsedData: ParseResumeTextOutput | null;
  setParsedData: (data: ParseResumeTextOutput | null) => void;
}

const templates = [
  { name: 'Modern',
    image: 'https://placehold.co/400x566/e0e7ff/4338ca.png',
    aiHint: 'resume modern'
  },
  { name: 'Classic',
    image: 'https://placehold.co/400x566/f1f5f9/1e293b.png',
    aiHint: 'resume classic'
  },
  { name: 'Creative',
    image: 'https://placehold.co/400x566/f0fdf4/16a34a.png',
    aiHint: 'resume creative'
  },
];

const ResumeForm: React.FC<ResumeFormProps> = ({ 
    onGenerateSubmit, 
    onParseAndRecommend,
    isLoading,
    isParsing,
    resumeText,
    setResumeText,
    parsedData,
    setParsedData
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].name);
  const { toast } = useToast();

  const handleParse = async () => {
    const { recommendedTemplate, reason } = await onParseAndRecommend();
    if (recommendedTemplate) {
        setSelectedTemplate(recommendedTemplate);
        toast({
            title: `We suggest the "${recommendedTemplate}" template!`,
            description: reason,
        });
    }
  };

  const handleParsedChange = (section: keyof ParseResumeTextOutput, value: string) => {
    if (!parsedData) return;
    
    if (Array.isArray(parsedData[section])) {
      setParsedData({ ...parsedData, [section]: value.split('\n---\n') });
    } else {
      setParsedData({ ...parsedData, [section]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalResumeText = resumeText;
    if (parsedData) {
      const { summary, contactInformation, workExperience, education, skills } = parsedData;
      const sections: string[] = [];
      if (summary) sections.push(`Summary\n${summary}`);
      if (contactInformation) sections.push(`Contact Information\n${contactInformation}`);
      if (workExperience?.length > 0 && workExperience[0]) sections.push(`Work Experience\n${workExperience.join('\n\n')}`);
      if (education?.length > 0 && education[0]) sections.push(`Education\n${education.join('\n\n')}`);
      if (skills?.length > 0 && skills[0]) sections.push(`Skills\n${skills.join(', ')}`);
      finalResumeText = sections.join('\n\n');
    }
    onGenerateSubmit(finalResumeText, selectedTemplate);
  };
  
  const EditableField: React.FC<{label: string, value: string, section: keyof ParseResumeTextOutput, rows?: number, description?: string}> = ({label, value, section, rows = 3, description}) => (
    <div className="space-y-2">
      <Label htmlFor={`parsed-${section}`}>{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Textarea
        id={`parsed-${section}`}
        value={value}
        onChange={(e) => handleParsedChange(section, e.target.value)}
        rows={rows}
        className="bg-background/10 border-white/20 dark:border-white/10 focus:bg-background/20"
      />
    </div>
  );
  
  const arraySeparator = '\n---\n';

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">Resume Details</CardTitle>
                <CardDescription>Paste your details, choose a template, and generate.</CardDescription>
            </div>
            {parsedData && (
                 <Button variant="outline" size="sm" onClick={() => setParsedData(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Raw Text
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!parsedData ? (
            <div className="space-y-2">
              <Label htmlFor="resume-text">Your Resume Details</Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your resume content here. Include headings like 'Experience', 'Education', 'Skills', etc. for best results."
                rows={15}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="bg-background/10 border-white/20 dark:border-white/10 focus:bg-background/20"
              />
              <Button type="button" onClick={handleParse} disabled={isParsing} className="w-full mt-2">
                {isParsing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                Analyze & Edit Sections
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
                <EditableField label="Summary / Objective" value={parsedData.summary} section="summary" />
                <EditableField label="Contact Information" value={parsedData.contactInformation} section="contactInformation" />
                <EditableField 
                  label="Work Experience" 
                  value={parsedData.workExperience.join(arraySeparator)} 
                  section="workExperience" 
                  rows={8}
                  description="Separate each job entry with '---' on a new line."
                />
                <EditableField 
                  label="Education" 
                  value={parsedData.education.join(arraySeparator)} 
                  section="education" 
                  rows={4} 
                  description="Separate each school/degree with '---' on a new line."
                />
                <EditableField 
                  label="Skills" 
                  value={parsedData.skills.join(arraySeparator)} 
                  section="skills" 
                  rows={4} 
                  description="Separate each skill with '---' on a new line."
                />
            </div>
          )}

          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <Label>Choose a Template</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>We'll recommend one for you when you analyze your resume!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
             </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.name} className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setSelectedTemplate(template.name)}
                        className={cn(
                        'relative block w-full rounded-lg border-2 p-1 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                        selectedTemplate === template.name ? 'border-primary' : 'border-transparent hover:border-primary/50'
                        )}
                    >
                        <Image
                            src={template.image}
                            alt={`${template.name} template preview`}
                            width={400}
                            height={566}
                            className="rounded-md aspect-[400/566]"
                            data-ai-hint={template.aiHint}
                        />
                         {selectedTemplate === template.name && (
                            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                    </button>
                   <p className="text-sm font-medium text-center text-foreground">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Resume
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResumeForm;
