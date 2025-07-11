
import Calculator from '@/components/Calculator';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-red-900 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">Calculator</h1>
            <p className="text-slate-600 dark:text-slate-300">Modern & Scientific Calculator App</p>
          </div>
          <Calculator />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
