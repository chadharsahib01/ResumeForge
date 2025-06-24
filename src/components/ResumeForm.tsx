'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, Check, Wand2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseResumeAction } from '@/app/actions';
import type { ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';

interface ResumeFormProps {
  onSubmit: (resumeText: string, templateName: string) => void;
  isLoading: boolean;
}

const templates = [
  { name: 'Modern',
    image: 'https://placehold.co/400x566/E9EBF8/3F51B5.png',
    aiHint: 'resume modern'
  },
  { name: 'Classic',
    image: 'https://placehold.co/400x566/F5F5F5/333333.png',
    aiHint: 'resume classic'
  },
  { name: 'Creative',
    image: 'https://placehold.co/400x566/E0F2F1/009688.png',
    aiHint: 'resume creative'
  },
];

const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].name);
  const [parsedData, setParsedData] = useState<ParseResumeTextOutput | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const handleParse = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste your resume text to analyze it.',
        variant: 'destructive',
      });
      return;
    }
    setIsParsing(true);
    setParsedData(null);
    const result = await parseResumeAction({ resumeText });
    setIsParsing(false);

    if (result.error || !result.parsedData) {
      toast({
        title: 'Parsing Failed',
        description: result.error || 'The AI could not understand the resume structure. Try adding clear headings like "Experience", "Education", and "Skills".',
        variant: 'destructive',
      });
    } else {
      setParsedData(result.parsedData);
      toast({
        title: 'Resume Analyzed',
        description: "Your resume has been broken down into sections for easier editing.",
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
    onSubmit(finalResumeText, selectedTemplate);
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
        className="bg-background/10 border-white/20 focus:bg-background/20"
      />
    </div>
  );
  
  const arraySeparator = '\n---\n';

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-white/20 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">Create Your Resume</CardTitle>
                <CardDescription>Paste your details, select a template, and let AI do the rest.</CardDescription>
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
                className="bg-background/10 border-white/20 focus:bg-background/20"
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
            <Label>Choose a Template</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.name} className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setSelectedTemplate(template.name)}
                        className={cn(
                        'relative block w-full rounded-lg border-2 p-1 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
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
          <Button type="submit" disabled={isLoading || isParsing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
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
