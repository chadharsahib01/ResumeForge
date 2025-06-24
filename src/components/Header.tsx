import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card/60 border-b border-white/20 shadow-lg backdrop-blur-xl sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="p-2 bg-primary text-primary-foreground rounded-lg">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-primary font-headline">
          CV Bnao
        </h1>
      </div>
    </header>
  );
};

export default Header;
