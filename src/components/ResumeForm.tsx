'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2, Check } from 'lucide-react';

interface ResumeFormProps {
  onSubmit: (resumeText: string, templateName: string) => void;
  isLoading: boolean;
}

const templates = [
  { name: 'Modern',
    image: 'https://placehold.co/400x566/f3f4f6/111827.png',
    aiHint: 'resume modern'
  },
  { name: 'Classic',
    image: 'https://placehold.co/400x566/e5e7eb/1f2937.png',
    aiHint: 'resume classic'
  },
  { name: 'Creative',
    image: 'https://placehold.co/400x566/d1d5db/374151.png',
    aiHint: 'resume creative'
  },
];

const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmit, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(resumeText, selectedTemplate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create Your Resume</CardTitle>
        <CardDescription>Paste your details, select a template, and let AI do the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-text">Your Resume Details</Label>
            <Textarea
              id="resume-text"
              placeholder="Paste your resume content here. Include headings like 'Experience', 'Education', 'Skills', etc. for best results."
              rows={15}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="bg-card"
            />
          </div>
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
                        selectedTemplate === template.name ? 'border-primary' : 'border-border hover:border-primary/50'
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
