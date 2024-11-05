import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  isListening: boolean;
}

const VoiceWaveform: React.FC<Props> = ({ isListening }) => {
  const bars = 20;
  
  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-blue-400"
          animate={{
            height: isListening ? [8, 32, 8] : 8,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
          style={{
            opacity: isListening ? 0.8 : 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;