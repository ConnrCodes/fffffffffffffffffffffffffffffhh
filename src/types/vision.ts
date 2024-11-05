export interface Detection {
  class: string;
  score: number;
  bbox: number[];
}

export interface VisionAnalysis {
  detections: Detection[];
  anomalies: string[];
  timestamp: number;
}