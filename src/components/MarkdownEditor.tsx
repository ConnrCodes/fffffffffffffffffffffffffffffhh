import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Editor\n\nStart typing your markdown here...');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-violet-500/30">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-400" />
          <h2 className="text-violet-400 text-lg font-semibold">Markdown Editor</h2>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 text-violet-400 hover:text-violet-300 transition-colors"
          title="Copy markdown"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[400px]">
        <div className="relative">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full bg-violet-900/20 border border-violet-500/30 rounded-lg p-4 text-violet-100 focus:outline-none focus:border-violet-400 resize-none font-mono"
          />
        </div>
        
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-4 overflow-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
            className="prose prose-invert prose-violet max-w-none"
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;