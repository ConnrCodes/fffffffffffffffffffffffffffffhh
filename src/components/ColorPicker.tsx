import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = () => {
  const [color, setColor] = useState('#6366F1');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Color Picker</h2>
      </div>

      <div className="space-y-4">
        <HexColorPicker
          color={color}
          onChange={setColor}
          className="w-full max-w-[200px] mx-auto"
        />

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded border border-purple-500/30"
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100 uppercase"
          />
          <button
            onClick={handleCopy}
            className="p-2 text-purple-400 hover:text-purple-300"
            title="Copy color code"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;