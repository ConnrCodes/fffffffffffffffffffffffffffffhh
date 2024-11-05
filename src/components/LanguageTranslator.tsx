import React, { useState } from 'react';
import { Languages, ArrowRight, RefreshCw } from 'lucide-react';

const LanguageTranslator = () => {
  const [sourceText, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translation, setTranslation] = useState('');
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

  const translate = async () => {
    if (!sourceText.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranslation(`Translated text from ${sourceLang} to ${targetLang}: ${sourceText}`);
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
    setText(translation);
    setTranslation('');
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-violet-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-violet-400" />
        <h2 className="text-violet-400 font-semibold">Language Translator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-violet-900/20 border border-violet-500/30 rounded p-2 text-violet-100"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-2 text-violet-400 hover:text-violet-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-violet-900/20 border border-violet-500/30 rounded p-2 text-violet-100"
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
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full h-24 bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 text-violet-100 placeholder-violet-400/50 resize-none"
        />

        <button
          onClick={translate}
          disabled={!sourceText.trim() || isTranslating}
          className="w-full py-2 bg-violet-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isTranslating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>

        {translation && (
          <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
            <p className="text-violet-100">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageTranslator;