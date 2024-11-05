import { useState, useEffect, useRef } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

interface GestureResult {
  name: string;
  confidence: number;
}

export const useGestures = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [gestures, setGestures] = useState<GestureResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);

  useEffect(() => {
    const initializeDetector = async () => {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full'
      } as handPoseDetection.MediaPipeHandsModelConfig;

      detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
      setIsDetecting(true);
    };

    initializeDetector();
  }, []);

  const detectGestures = async () => {
    if (!detectorRef.current || !videoRef.current) return;

    try {
      const hands = await detectorRef.current.estimateHands(videoRef.current);
      
      const gestureResults = hands.map(hand => {
        // Simple gesture detection based on finger positions
        const landmarks = hand.keypoints;
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        
        // Calculate distance between thumb and index finger
        const distance = Math.sqrt(
          Math.pow(thumbTip.x - indexTip.x, 2) + 
          Math.pow(thumbTip.y - indexTip.y, 2)
        );

        // Detect basic gestures
        if (distance < 30) {
          return { name: 'pinch', confidence: 0.9 };
        } else if (landmarks[8].y < landmarks[5].y) {
          return { name: 'pointing', confidence: 0.8 };
        } else {
          return { name: 'open', confidence: 0.7 };
        }
      });

      setGestures(gestureResults);
    } catch (error) {
      console.error('Gesture detection error:', error);
    }
  };

  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(detectGestures, 100);
    return () => clearInterval(interval);
  }, [isDetecting]);

  return {
    gestures,
    isDetecting
  };
};