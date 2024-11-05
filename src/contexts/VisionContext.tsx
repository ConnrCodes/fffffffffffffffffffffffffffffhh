import React, { createContext, useState, useEffect } from 'react';
import { VisionAnalysis } from '../types/vision';

interface VisionContextType {
  currentVisionData: VisionAnalysis | null;
  updateVisionData: (data: VisionAnalysis) => void;
}

export const VisionContext = createContext<VisionContextType>({
  currentVisionData: null,
  updateVisionData: () => {}
});

export const VisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVisionData, setCurrentVisionData] = useState<VisionAnalysis | null>(null);

  const updateVisionData = (data: VisionAnalysis) => {
    setCurrentVisionData(data);
  };

  return (
    <VisionContext.Provider value={{ currentVisionData, updateVisionData }}>
      {children}
    </VisionContext.Provider>
  );
};