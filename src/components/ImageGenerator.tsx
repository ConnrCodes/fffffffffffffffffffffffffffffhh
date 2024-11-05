import React, { useState } from 'react';
import { Image, RefreshCw, Download } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // For demo purposes, using a placeholder image
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedImage('https://images.unsplash.com/photo-1703631952319-1c5b47f76e0d');
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-pink-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-pink-400" />
        <h2 className="text-pink-400 text-lg font-semibold">Image Generator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-pink-900/20 border border-pink-500/30 rounded-lg px-4 py-2 text-pink-100 placeholder-pink-400/50 focus:outline-none focus:border-pink-400"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>

        {generatedImage && (
          <div className="relative group">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;