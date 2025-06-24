'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Clipboard, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetterAction } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

interface CoverLetterGeneratorProps {
  resumeText: string;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ resumeText }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please make sure both your resume details and the job description are filled out.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedLetter('');

    const result = await generateCoverLetterAction({ resumeText, jobDescription });
    
    if (result.error || !result.coverLetter) {
      toast({
        title: 'Generation Failed',
        description: result.error || 'The AI failed to generate a cover letter. Please try again.',
        variant: 'destructive',
      });
    } else {
      setGeneratedLetter(result.coverLetter);
    }
    
    setIsLoading(false);
  };
  
  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    toast({
        title: 'Copied to Clipboard!',
        description: 'The cover letter has been copied.',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Cover Letter Generator</CardTitle>
          <CardDescription>
            Provide your resume details and a job description to generate a personalized cover letter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-details-cl">Your Resume Details</Label>
            <Textarea
              id="resume-details-cl"
              value={resumeText}
              readOnly
              rows={8}
              className="bg-muted/40 border-white/20 focus:bg-background/20"
              placeholder="Your resume text will appear here once you enter it in the Resume Builder tab."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description you are applying for here."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="bg-background/10 border-white/20 dark:border-white/10 focus:bg-background/20"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Generate Cover Letter
          </Button>
        </CardContent>
      </Card>
      <div className="lg:sticky top-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground font-headline">Generated Letter</h2>
        <Card className="h-auto min-h-[600px] lg:h-[600px] overflow-auto bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg relative group">
          <CardContent className="p-6">
            {isLoading ? (
               <div className="space-y-4">
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
                 <br/>
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
                 <br/>
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
               </div>
            ) : generatedLetter ? (
                <>
                    <Button onClick={handleCopy} size="sm" variant="outline" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Clipboard className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <pre className="whitespace-pre-wrap font-body text-sm text-foreground">{generatedLetter}</pre>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                    <FileText className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold font-headline">Your cover letter will appear here</h3>
                    <p>Fill out the form and click "Generate" to create it.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
