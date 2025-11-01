import React, { useState } from 'react';

interface ARViewerTabProps {
  imageUrl: string | null;
}

type ViewMode = 'normal' | 'thermal' | 'structural';

export const ARViewerTab: React.FC<ARViewerTabProps> = ({ imageUrl }) => {
  const [rotationY, setRotationY] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  const getViewModeStyle = (): React.CSSProperties => {
    switch (viewMode) {
      case 'thermal':
        return { filter: 'hue-rotate(280deg) saturate(2.5) brightness(1.1)' };
      case 'structural':
        return { filter: 'grayscale(1) contrast(2.5) brightness(0.9)' };
      case 'normal':
      default:
        return {};
    }
  };

  return (
    <div className="mt-8">
      <div 
        className="relative w-full h-[60vh] max-h-[700px] bg-black/20 border-2 border-dashed border-cyan-700/50 rounded-lg p-4 flex items-center justify-center overflow-hidden"
        style={{ perspective: '1500px' }}
      >
        {imageUrl ? (
          <div 
            className="relative w-full h-full transition-transform duration-200"
            style={{ transformStyle: 'preserve-3d', transform: `rotateY(${rotationY}deg)` }}
          >
            <img 
              src={imageUrl} 
              alt="AR Preview" 
              className="absolute top-0 left-0 w-full h-full object-contain transition-all duration-300"
              style={getViewModeStyle()}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="font-cinzel text-5xl">Projection Field Empty</p>
            <p className="mt-2 text-2xl">Summon or select a structure to project.</p>
          </div>
        )}

        {/* AR Overlay UI */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          <div className="absolute top-4 left-4 text-left text-lg">
            <p>STATUS: <span className="text-green-400 font-bold">LOCKED</span></p>
            <p>ANCHOR: <span className="text-green-400">PLANAR_SURFACE</span></p>
            <p className="uppercase">MODE: <span className="text-cyan-300 font-bold">{viewMode}</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-black/20 rounded-lg border border-cyan-900/50">
        <h3 className="text-2xl font-bold text-cyan-200 mb-4">Projection Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="rotation-slider" className="block mb-2 text-lg text-gray-300">Rotate Structure</label>
            <input
              id="rotation-slider"
              type="range"
              min="-90"
              max="90"
              value={rotationY}
              onChange={(e) => setRotationY(Number(e.target.value))}
              disabled={!imageUrl}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
          </div>
          <div className="flex items-center justify-around gap-2">
            <button onClick={() => setViewMode('normal')} disabled={!imageUrl} className={`px-4 py-2 text-lg font-bold rounded-md transition-colors disabled:opacity-50 ${viewMode === 'normal' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Normal</button>
            <button onClick={() => setViewMode('thermal')} disabled={!imageUrl} className={`px-4 py-2 text-lg font-bold rounded-md transition-colors disabled:opacity-50 ${viewMode === 'thermal' ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Thermal</button>
            <button onClick={() => setViewMode('structural')} disabled={!imageUrl} className={`px-4 py-2 text-lg font-bold rounded-md transition-colors disabled:opacity-50 ${viewMode === 'structural' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Structural</button>
          </div>
        </div>
      </div>
    </div>
  );
};
