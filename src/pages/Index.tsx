
import Calculator from '@/components/Calculator';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-100 light:via-purple-100 light:to-slate-100 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-2">Calculator</h1>
            <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">Modern & Scientific Calculator App</p>
          </div>
          <Calculator />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
