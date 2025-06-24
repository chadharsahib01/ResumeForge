import { FileText } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-card/60 border-b border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                <FileText className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-primary font-headline tracking-tight">
                    CV Bnao
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 font-medium">by Ali Raza Chadhar</p>
            </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
