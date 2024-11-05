import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    'javascript',
    'typescript',
    'python',
    'html',
    'css',
    'json',
    'markdown'
  ];

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-emerald-500/30">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-emerald-400 text-lg font-semibold">Code Editor</h2>
        </div>
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-emerald-900/20 border border-emerald-500/30 rounded px-2 py-1 text-emerald-300 text-sm"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="h-[400px] border border-emerald-500/30 rounded-lg overflow-hidden">
        <Editor
          value={code}
          language={language}
          theme="vs-dark"
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;