import React, { useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode.react';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <QrCode className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">QR Generator</h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL"
          className="w-full bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100 placeholder-purple-400/50"
        />

        <div className="flex justify-center bg-white rounded-lg p-4">
          <QRCode
            value={text || 'https://stackblitz.com'}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-purple-400 text-sm mb-1">Size</label>
            <input
              type="range"
              min="128"
              max="512"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={handleDownload}
            disabled={!text}
            className="flex items-center justify-center gap-2 bg-purple-500 text-white rounded p-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;