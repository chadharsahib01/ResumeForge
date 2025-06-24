'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateResumeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [formattedResume, setFormattedResume] = useState('');
  const { toast } = useToast();

  const handleGenerateResume = async (resumeText: string, templateName: string) => {
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste your resume text.',
        variant: 'destructive',
      });
      return;
    }
    if (!templateName) {
      toast({
        title: 'Error',
        description: 'Please select a template.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setFormattedResume('');

    const result = await generateResumeAction({ resumeText, templateName });

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.formattedResume) {
      setFormattedResume(result.formattedResume);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ResumeForm onSubmit={handleGenerateResume} isLoading={isLoading} />
          <div className="lg:sticky top-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground font-headline">Preview</h2>
            <Card className="h-auto min-h-[792px] lg:h-[792px] overflow-auto">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="pt-8">
                      <Skeleton className="h-6 w-1/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="pt-8">
                      <Skeleton className="h-6 w-1/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ) : (
                  <ResumePreview formattedResume={formattedResume} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
