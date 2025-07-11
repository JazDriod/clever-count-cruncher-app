
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  };

  const inputParentheses = () => {
    // Simple parentheses handling - just add to display for now
    if (waitingForOperand) {
      setDisplay('(');
      setWaitingForOperand(false);
    } else {
      const openCount = (display.match(/\(/g) || []).length;
      const closeCount = (display.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        setDisplay(display + ')');
      } else {
        setDisplay(display + '(');
      }
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(String(inputValue));
    } else if (operation && !waitingForOperand) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      if (nextOperation === '=') {
        setHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
      } else {
        setHistory(`${newValue}`);
      }
    }

    if (nextOperation !== '=') {
      setWaitingForOperand(true);
      setOperation(nextOperation);
      
      if (previousValue !== null) {
        setHistory(prev => `${prev} ${nextOperation}`);
      } else {
        setHistory(prev => `${prev} ${nextOperation}`);
      }
    } else {
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'cube':
        result = inputValue * inputValue * inputValue;
        break;
      case 'factorial':
        result = factorial(inputValue);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setHistory(`${func}(${inputValue}) = ${result}`);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      case '%':
        return (firstValue * secondValue) / 100;
      default:
        return secondValue;
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    
    if (key >= '0' && key <= '9') {
      inputNumber(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === '+') {
      performOperation('+');
    } else if (key === '-') {
      performOperation('-');
    } else if (key === '*') {
      performOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      performOperation('=');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clear();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const buttonClasses = `${isScientific ? 'h-12 text-base' : 'h-16 text-xl'} font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 active:rounded-full transform`;
  const numberButtonClasses = theme === 'dark' 
    ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600" 
    : "bg-white hover:bg-blue-50 text-slate-800 border-blue-200";
  const operatorButtonClasses = theme === 'dark'
    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500"
    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white border-blue-400";
  const specialButtonClasses = theme === 'dark'
    ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border-slate-500"
    : "bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 text-white border-slate-300";
  const scientificButtonClasses = theme === 'dark'
    ? "bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white border-red-700 text-sm"
    : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 text-white border-blue-300 text-sm";

  return (
    <Card className={theme === 'dark' 
      ? "p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl transition-all duration-300" 
      : "p-6 bg-white/90 backdrop-blur-sm border-blue-200 shadow-2xl transition-all duration-300"}>
      {/* Theme Toggle */}
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
          <Moon className="h-4 w-4 text-blue-400" />
        </div>
      </div>

      {/* History Display */}
      {history && (
        <div className={theme === 'dark' 
          ? "mb-2 p-2 bg-slate-900/30 rounded-lg border border-slate-700/50 transition-all duration-300" 
          : "mb-2 p-2 bg-blue-50/50 rounded-lg border border-blue-200/50 transition-all duration-300"}>
          <div className={theme === 'dark' 
            ? "text-right text-sm font-mono text-slate-400 overflow-hidden" 
            : "text-right text-sm font-mono text-slate-600 overflow-hidden"}>
            {history}
          </div>
        </div>
      )}

      {/* Display */}
      <div className={theme === 'dark' 
        ? "mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700 relative transition-all duration-300" 
        : "mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200 relative transition-all duration-300"}>
        {operation && operation !== '=' && (
          <div className={theme === 'dark'
            ? "absolute top-2 left-2 text-red-400 text-sm font-mono bg-slate-800/70 px-2 py-1 rounded transition-all duration-300"
            : "absolute top-2 left-2 text-blue-600 text-sm font-mono bg-white/70 px-2 py-1 rounded transition-all duration-300"}>
            {operation}
          </div>
        )}
        <div className={theme === 'dark' 
          ? "text-right text-3xl font-mono text-white overflow-hidden" 
          : "text-right text-3xl font-mono text-slate-800 overflow-hidden"}>
          {display}
        </div>
      </div>

      {/* Scientific Functions (animated reveal/hide) */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
        isScientific 
          ? 'max-h-96 opacity-100 translate-y-0 mb-4' 
          : 'max-h-0 opacity-0 -translate-y-4 mb-0'
      }`}>
        <div className="grid grid-cols-5 gap-2">
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('sin')}
          >
            sin
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('cos')}
          >
            cos
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('tan')}
          >
            tan
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('ln')}
          >
            ln
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('log')}
          >
            log
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('sqrt')}
          >
            √
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('square')}
          >
            x²
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('cube')}
          >
            x³
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performOperation('^')}
          >
            x^y
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performOperation('mod')}
          >
            mod
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('factorial')}
          >
            n!
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('pi')}
          >
            π
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses}`}
            onClick={() => performScientificOperation('e')}
          >
            e
          </Button>
          <Button 
            className={`${buttonClasses} ${scientificButtonClasses} col-span-2`}
            onClick={clear}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Basic Calculator Grid */}
      <div className="grid grid-cols-4 gap-3 transition-all duration-300">
        {/* Row 1 */}
        <Button 
          className={`${buttonClasses} ${specialButtonClasses}`}
          onClick={clear}
        >
          AC
        </Button>
        <Button 
          className={`${buttonClasses} ${specialButtonClasses}`}
          onClick={inputParentheses}
        >
          ( )
        </Button>
        <Button 
          className={`${buttonClasses} ${specialButtonClasses}`}
          onClick={() => performOperation('%')}
        >
          %
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('÷')}
        >
          ÷
        </Button>

        {/* Row 2 */}
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('7')}
        >
          7
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('8')}
        >
          8
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('9')}
        >
          9
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('×')}
        >
          ×
        </Button>

        {/* Row 3 */}
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('4')}
        >
          4
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('5')}
        >
          5
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('6')}
        >
          6
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('-')}
        >
          -
        </Button>

        {/* Row 4 */}
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('1')}
        >
          1
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('2')}
        >
          2
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('3')}
        >
          3
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('+')}
        >
          +
        </Button>

        {/* Row 5 */}
        <Button 
          className={`${buttonClasses} ${specialButtonClasses} flex items-center justify-center`}
          onClick={() => setIsScientific(!isScientific)}
        >
          <div className={`transition-transform duration-500 ${isScientific ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L16 8H4L10 2Z"/>
            </svg>
          </div>
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={() => inputNumber('0')}
        >
          0
        </Button>
        <Button 
          className={`${buttonClasses} ${numberButtonClasses}`}
          onClick={inputDecimal}
        >
          .
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('=')}
        >
          =
        </Button>
      </div>
    </Card>
  );
};

export default Calculator;
