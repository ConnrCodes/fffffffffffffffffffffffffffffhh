import { useState, useCallback } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  voice?: string;
}

export const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initialize voices
  useState(() => {
    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Prefer British English voices
      const sortedVoices = allVoices.sort((a, b) => {
        const aIsBritish = a.lang === 'en-GB';
        const bIsBritish = b.lang === 'en-GB';
        if (aIsBritish && !bIsBritish) return -1;
        if (!aIsBritish && bIsBritish) return 1;
        return 0;
      });
      setVoices(sortedVoices);
    };
    
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  });

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set British voice if available
    const britishVoice = voices.find(v => v.lang === 'en-GB');
    if (britishVoice) {
      utterance.voice = britishVoice;
    }
    
    // Slower rate and lower pitch for gentleman-like voice
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 0.9;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    speaking,
    voices,
  };
};