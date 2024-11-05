import React, { useState } from 'react';
import { Languages, ArrowRight } from 'lucide-react';

const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      // Simulating translation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranslatedText(`Translated: ${sourceText}`);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Languages className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Translator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-2 text-purple-400 hover:text-purple-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-24 bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100 placeholder-purple-400/50 resize-none"
        />

        <button
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isTranslating}
          className="w-full bg-purple-500 text-white rounded p-2 disabled:opacity-50"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>

        {translatedText && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100">
            {translatedText}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;