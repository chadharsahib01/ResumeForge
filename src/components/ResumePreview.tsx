'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface ResumePreviewProps {
  formattedResume: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ formattedResume }) => {
  const handlePrint = () => {
    window.print();
  };
  
  if (!formattedResume) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 min-h-[300px]">
        <FileText className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Your resume will appear here</h3>
        <p>Fill out the form and click "Generate Resume" to see the magic happen.</p>
      </div>
    );
  }

  return (
    <div className="relative group">
       <div id="print-button-container" className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
         <Button onClick={handlePrint} variant="default">
           <Download className="mr-2 h-4 w-4" />
           Download PDF
         </Button>
       </div>
      <div id="resume-content-wrapper">
        <pre id="resume-content" className="whitespace-pre-wrap font-sans text-sm bg-transparent p-6">{formattedResume}</pre>
      </div>
    </div>
  );
};

export default ResumePreview;
