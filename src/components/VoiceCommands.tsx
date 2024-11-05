import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceWaveform = ({ isListening }: { isListening: boolean }) => {
  const bars = 20;
  
  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-blue-400"
          animate={{
            height: isListening ? [8, 32, 8] : 8,
            opacity: isListening ? [0.3, 0.8, 0.3] : 0.3,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const VoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          setLastCommand(transcript);
          processCommand(transcript);
        }
      };

      recognition.start();
    }
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak('Hello! How can I assist you?');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-blue-500/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-blue-400 font-semibold">Voice Commands</h2>
        </div>
        <motion.button
          onClick={startListening}
          className={`p-2 rounded-full ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      <VoiceWaveform isListening={isListening} />

      <AnimatePresence mode="wait">
        {transcript && (
          <motion.div 
            className="mt-4 p-3 bg-blue-900/20 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-blue-300 text-sm">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {lastCommand && (
        <motion.div 
          className="mt-2 text-blue-400/60 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Last command: {lastCommand}
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceCommands;