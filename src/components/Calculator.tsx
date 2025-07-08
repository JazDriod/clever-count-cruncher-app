
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
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

  const buttonClasses = "h-16 text-xl font-semibold transition-all duration-150 hover:scale-105 active:scale-95";
  const numberButtonClasses = "bg-slate-700 hover:bg-slate-600 text-white border-slate-600";
  const operatorButtonClasses = "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-500";
  const specialButtonClasses = "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border-slate-500";

  return (
    <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
      {/* Display */}
      <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="text-right text-3xl font-mono text-white overflow-hidden">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button 
          className={`${buttonClasses} ${specialButtonClasses} col-span-2`}
          onClick={clear}
        >
          Clear
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('÷')}
        >
          ÷
        </Button>
        <Button 
          className={`${buttonClasses} ${operatorButtonClasses}`}
          onClick={() => performOperation('×')}
        >
          ×
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
          onClick={() => performOperation('-')}
        >
          -
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
          onClick={() => performOperation('+')}
        >
          +
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
          className={`${buttonClasses} ${operatorButtonClasses} row-span-2`}
          onClick={() => performOperation('=')}
        >
          =
        </Button>

        {/* Row 5 */}
        <Button 
          className={`${buttonClasses} ${numberButtonClasses} col-span-2`}
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
      </div>
    </Card>
  );
};

export default Calculator;
