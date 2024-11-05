import React, { useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';

const TextSummarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const summarizeText = async () => {
    if (!text.trim() || isSummarizing) return;

    setIsSummarizing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummary('This is a simulated summary of the provided text. In a real implementation, this would use an AI model to generate a concise summary.');
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-emerald-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-emerald-400" />
        <h2 className="text-emerald-400 font-semibold">Text Summarizer</h2>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to summarize..."
          className="w-full h-32 bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-emerald-100 placeholder-emerald-400/50 resize-none"
        />

        <button
          onClick={summarizeText}
          disabled={!text.trim() || isSummarizing}
          className="w-full py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSummarizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            'Summarize'
          )}
        </button>

        {summary && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
            <h3 className="text-emerald-400 text-sm mb-2">Summary:</h3>
            <p className="text-emerald-100">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSummarizer;