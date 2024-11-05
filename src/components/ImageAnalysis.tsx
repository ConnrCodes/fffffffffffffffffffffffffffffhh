import React, { useState } from 'react';
import { Image, Upload, X, Loader2 } from 'lucide-react';

const ImageAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        analyzeImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis({
        objects: ['person', 'car', 'tree'],
        colors: ['blue', 'red', 'green'],
        tags: ['outdoor', 'sunny', 'urban'],
        confidence: 0.95
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-pink-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-pink-400" />
          <h2 className="text-pink-400 font-semibold">Image Analysis</h2>
        </div>
        {image && (
          <button
            onClick={clearImage}
            className="text-pink-400 hover:text-pink-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!image ? (
        <label className="block w-full h-40 border-2 border-dashed border-pink-500/30 rounded-lg cursor-pointer hover:border-pink-500/50">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="h-full flex flex-col items-center justify-center text-pink-400">
            <Upload className="w-8 h-8 mb-2" />
            <span>Upload image for analysis</span>
          </div>
        </label>
      ) : (
        <div className="space-y-4">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-40 object-cover rounded-lg"
          />
          
          {isAnalyzing ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
            </div>
          ) : analysis && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-pink-900/20 p-2 rounded">
                  <span className="text-pink-400">Objects:</span>
                  <div className="text-pink-100">
                    {analysis.objects.join(', ')}
                  </div>
                </div>
                <div className="bg-pink-900/20 p-2 rounded">
                  <span className="text-pink-400">Colors:</span>
                  <div className="text-pink-100">
                    {analysis.colors.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {analysis.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;