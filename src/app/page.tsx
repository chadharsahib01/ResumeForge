'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import CoverLetterGenerator from '@/components/CoverLetterGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateResumeAction, recommendTemplateAction, parseResumeAction, generateLogoAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { ParseResumeTextOutput } from '@/ai/flows/parse-resume-text';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [formattedResume, setFormattedResume] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState<ParseResumeTextOutput | null>(null);
  const [logoDataUri, setLogoDataUri] = useState('');

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
  
  const handleGenerateLogo = async (name: string, industry: string) => {
    if (!name.trim() || !industry.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and industry to generate a logo.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingLogo(true);
    const result = await generateLogoAction({ name, industry });
    if (result.error || !result.logoDataUri) {
      toast({
        title: 'Logo Generation Failed',
        description: result.error || 'The AI could not generate a logo. Please try again.',
        variant: 'destructive',
      });
    } else {
      setLogoDataUri(result.logoDataUri);
      toast({
        title: 'Logo Generated!',
        description: "Your personal logo is ready to be added to your resume.",
      });
    }
    setIsGeneratingLogo(false);
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

    const result = await generateResumeAction({ 
      resumeText: finalResumeText, 
      templateName,
      logoDataUri: logoDataUri || undefined
    });

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
                    onGenerateLogo={handleGenerateLogo}
                    isLoading={isLoading || isParsing}
                    isParsing={isParsing}
                    isGeneratingLogo={isGeneratingLogo}
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    parsedData={parsedData}
                    setParsedData={setParsedData}
                    logoDataUri={logoDataUri}
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
