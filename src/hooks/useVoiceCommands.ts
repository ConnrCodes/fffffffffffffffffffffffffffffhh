import { useState, useEffect, useCallback } from 'react';

interface VoiceCommandOptions {
  wakeWord?: string;
  language?: string;
  continuous?: boolean;
  onCommand?: (command: string) => void;
}

export const useVoiceCommands = (options: VoiceCommandOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    wakeWord = 'hey fletcher',
    language = 'en-GB',
    continuous = true,
    onCommand
  } = options;

  // ... (rest of the code remains the same)
};