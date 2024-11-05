import React, { useState } from 'react';
import { MessageSquare, Smile, Meh, Frown, RefreshCw } from 'lucide-react';

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<{
    score: number;
    label: string;
    confidence: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentiment = async () => {
    if (!text.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const score = Math.random();
      setSentiment({
        score,
        label: score > 0.6 ? 'Positive' : score > 0.4 ? 'Neutral' : 'Negative',
        confidence: Math.random() * 0.3 + 0.7
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = () => {
    if (!sentiment) return null;
    if (sentiment.score > 0.6) return <Smile className="w-6 h-6 text-green-400" />;
    if (sentiment.score > 0.4) return <Meh className="w-6 h-6 text-yellow-400" />;
    return <Frown className="w-6 h-6 text-red-400" />;
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h2 className="text-indigo-400 font-semibold">Sentiment Analyzer</h2>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze sentiment..."
          className="w-full h-24 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-3 text-indigo-100 placeholder-indigo-400/50 resize-none"
        />

        <button
          onClick={analyzeSentiment}
          disabled={!text.trim() || isAnalyzing}
          className="w-full py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </button>

        {sentiment && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              {getSentimentIcon()}
              <span className="text-indigo-100 font-medium">
                {sentiment.label}
              </span>
              <span className="text-indigo-400 text-sm">
                {Math.round(sentiment.confidence * 100)}% confidence
              </span>
            </div>
            <div className="w-full bg-indigo-900/30 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sentiment.score * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalyzer;