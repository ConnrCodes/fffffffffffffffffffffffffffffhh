import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioVisualizer = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number>();

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 64;
      sourceRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      animate();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setAudioData(new Array(32).fill(0));
  };

  const animate = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    setAudioData(Array.from(dataArray).slice(0, 32));
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-purple-500/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-purple-400 text-lg font-semibold">Audio Visualizer</h2>
        <button
          onClick={isListening ? stopListening : startListening}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isListening ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="h-24 flex items-end justify-between gap-1">
        {audioData.map((value, index) => (
          <div
            key={index}
            className="w-full bg-purple-500"
            style={{
              height: `${(value / 255) * 100}%`,
              transition: 'height 0.1s ease',
              opacity: isListening ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;