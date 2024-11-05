import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as faceDetection from '@tensorflow-models/face-detection';
import { Camera, Eye, AlertTriangle, User } from 'lucide-react';

interface Detection {
  class: string;
  score: number;
  bbox: number[];
}

const VisionSystem = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectModel, setObjectModel] = useState<cocossd.ObjectDetection | null>(null);
  const [faceModel, setFaceModel] = useState<faceDetection.FaceDetector | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [faces, setFaces] = useState<faceDetection.Face[]>([]);
  const [anomalies, setAnomalies] = useState<string[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      await tf.ready();
      
      // Load object detection model
      const loadedObjectModel = await cocossd.load();
      setObjectModel(loadedObjectModel);
      
      // Load face detection model with proper configuration
      const faceDetector = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        {
          runtime: 'tfjs',
          modelType: 'short'
        }
      );
      setFaceModel(faceDetector);
    };
    loadModels();
  }, []);

  const detectObjects = async () => {
    if (!objectModel || !faceModel || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    setIsProcessing(true);

    // Get video properties
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    // Set canvas dimensions
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    try {
      // Detect objects
      const objectPredictions = await objectModel.detect(video);
      setDetections(objectPredictions);

      // Detect faces
      const facePredictions = await faceModel.estimateFaces(video);
      setFaces(facePredictions);

      // Draw results
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        
        // Draw object detections
        objectPredictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          ctx.fillStyle = '#00FFFF';
          ctx.font = '16px Arial';
          ctx.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            x,
            y > 10 ? y - 5 : 10
          );
        });

        // Draw face detections
        facePredictions.forEach(face => {
          const box = face.box;
          ctx.strokeStyle = '#FF00FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.xMin, box.yMin, box.width, box.height);
          
          ctx.fillStyle = '#FF00FF';
          ctx.font = '16px Arial';
          ctx.fillText(
            'Face',
            box.xMin,
            box.yMin > 10 ? box.yMin - 5 : 10
          );
        });
      }

      // Analyze for potential issues
      const potentialIssues = analyzeScene(objectPredictions, facePredictions);
      setAnomalies(potentialIssues);
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeScene = (
    predictions: Detection[],
    faces: faceDetection.Face[]
  ): string[] => {
    const issues: string[] = [];
    
    // Check for potentially dangerous objects
    const dangerousObjects = ['knife', 'scissors', 'fire'];
    predictions.forEach(pred => {
      if (dangerousObjects.includes(pred.class.toLowerCase())) {
        issues.push(`Detected potentially dangerous object: ${pred.class}`);
      }
    });

    // Check for unusual numbers of objects
    const objectCounts = predictions.reduce((acc: {[key: string]: number}, pred) => {
      acc[pred.class] = (acc[pred.class] || 0) + 1;
      return acc;
    }, {});

    Object.entries(objectCounts).forEach(([obj, count]) => {
      if (count > 3) {
        issues.push(`Unusual number of ${obj}s detected (${count})`);
      }
    });

    // Check number of faces
    if (faces.length > 1) {
      issues.push(`Multiple faces detected (${faces.length})`);
    }

    return issues;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detectObjects();
    }, 1000);
    return () => clearInterval(interval);
  }, [objectModel, faceModel]);

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-blue-500/30">
      <h2 className="text-blue-400 text-lg font-semibold mb-4 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Vision System
      </h2>
      
      <div className="relative">
        <Webcam
          ref={webcamRef}
          className="rounded-lg w-full"
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        {isProcessing && (
          <div className="absolute top-2 right-2">
            <Camera className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-blue-400 font-semibold">Detections:</h3>
          <div className="text-blue-300 text-sm">
            <User className="inline-block w-4 h-4 mr-1" />
            {faces.length} {faces.length === 1 ? 'face' : 'faces'} detected
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {detections.map((det, idx) => (
            <div key={idx} className="text-blue-300 text-sm">
              {det.class} ({Math.round(det.score * 100)}%)
            </div>
          ))}
        </div>

        {anomalies.length > 0 && (
          <div className="mt-4">
            <h3 className="text-yellow-400 font-semibold flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Potential Issues:
            </h3>
            <ul className="list-disc list-inside text-yellow-300 text-sm">
              {anomalies.map((anomaly, idx) => (
                <li key={idx}>{anomaly}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionSystem;