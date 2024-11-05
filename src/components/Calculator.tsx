import React, { useState } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
    setEquation(equation + num);
  };

  const handleOperator = (op: string) => {
    setDisplay('0');
    setEquation(equation + ' ' + op + ' ');
  };

  const calculate = () => {
    try {
      // Using Function instead of eval for better security
      const result = new Function('return ' + equation)();
      setDisplay(result.toString());
      setEquation(result.toString());
    } catch (error) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <CalcIcon className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Calculator</h2>
      </div>
      
      <div className="bg-purple-900/20 p-2 rounded mb-2 text-right">
        <div className="text-purple-300 text-sm h-4">{equation}</div>
        <div className="text-purple-100 text-xl">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              switch (btn) {
                case '=': calculate(); break;
                case '÷': handleOperator('/'); break;
                case '×': handleOperator('*'); break;
                case '+':
                case '-': handleOperator(btn); break;
                default: handleNumber(btn);
              }
            }}
            className={`p-2 rounded ${
              btn === '=' 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
      
      <button
        onClick={clear}
        className="w-full mt-1 p-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
      >
        Clear
      </button>
    </div>
  );
};

export default Calculator;