import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import './globals.css';

export const metadata: Metadata = {
  title: 'CV Bnao',
  description: 'Create a professional, ATS-friendly resume from your text in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 -z-50 dark:from-slate-950 dark:via-slate-900 dark:to-gray-950" />
          <div className="fixed top-0 left-0 -z-10 h-full w-full">
              <div className="absolute top-0 -right-1/4 h-[500px] w-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob dark:opacity-20"></div>
              <div className="absolute top-0 -left-1/4 h-[500px] w-[500px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000 dark:opacity-20"></div>
              <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000 dark:opacity-20"></div>
          </div>
          
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
