import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (useUppercase) chars += uppercase;
    if (useLowercase) chars += lowercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (!chars) return;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(generatedPassword);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Password Generator</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
            placeholder="Generated password"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handleCopy}
              className="p-1 text-purple-400 hover:text-purple-300"
              disabled={!password}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={generatePassword}
              className="p-1 text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-purple-400 text-sm mb-1">
            Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2 text-purple-100">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="rounded border-purple-500/30"
            />
            Uppercase
          </label>
          <label className="flex items-center gap-2 text-purple-100">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="rounded border-purple-500/30"
            />
            Lowercase
          </label>
          <label className="flex items-center gap-2 text-purple-100">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="rounded border-purple-500/30"
            />
            Numbers
          </label>
          <label className="flex items-center gap-2 text-purple-100">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="rounded border-purple-500/30"
            />
            Symbols
          </label>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;