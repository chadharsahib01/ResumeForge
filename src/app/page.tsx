'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import CoverLetterGenerator from '@/components/CoverLetterGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateResumeAction, recommendTemplateAction, parseResumeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [formattedResume, setFormattedResume] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState<ParseResumeTextOutput | null>(null);

  const { toast } = useToast();

  const handleParseAndRecommend = async () => {
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

    // Run both actions in parallel
    const [parseResult, recommendResult] = await Promise.all([
      parseResumeAction({ resumeText }),
      recommendTemplateAction({ resumeText })
    ]);

    setIsParsing(false);

    // Handle parsing result
    if (parseResult.error || !parseResult.parsedData) {
      toast({
        title: 'Parsing Failed',
        description: parseResult.error || 'The AI could not understand the resume structure. Try adding clear headings like "Experience", "Education", and "Skills".',
        variant: 'destructive',
      });
    } else {
      setParsedData(parseResult.parsedData);
      toast({
        title: 'Resume Analyzed',
        description: "Your resume has been broken down into sections for easier editing.",
      });
    }

    // Handle recommendation result
    if (recommendResult.recommendation) {
        const { templateName, reason } = recommendResult.recommendation;
        return { recommendedTemplate: templateName, reason };
    }
    return { recommendedTemplate: null, reason: null };
  };

  const handleGenerateResume = async (finalResumeText: string, templateName: string) => {
    if (!finalResumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide your resume details.',
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

    const result = await generateResumeAction({ resumeText: finalResumeText, templateName });

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-10">
            <TabsTrigger value="resume">Resume Builder</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="resume">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <ResumeForm 
                    onGenerateSubmit={handleGenerateResume} 
                    onParseAndRecommend={handleParseAndRecommend}
                    isLoading={isLoading || isParsing}
                    isParsing={isParsing}
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    parsedData={parsedData}
                    setParsedData={setParsedData}
                />
                <div className="lg:sticky top-8">
                    <h2 className="text-3xl font-bold mb-4 text-foreground font-headline text-center lg:text-left">Preview</h2>
                    <Card className="h-auto min-h-[842px] lg:h-[842px] overflow-auto bg-white/50 dark:bg-card/50 backdrop-blur-2xl border-2 border-white/40 dark:border-white/10 shadow-2xl dark:shadow-primary/10">
                    <CardContent className="p-0">
                        {isLoading ? (
                        <div className="space-y-4 p-8">
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
          </TabsContent>
          <TabsContent value="cover-letter">
            <CoverLetterGenerator resumeText={resumeText} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
