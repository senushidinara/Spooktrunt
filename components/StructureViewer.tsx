import React from 'react';
import type { ArchitecturalStructure } from '../types';

interface StructureViewerProps {
  structure: ArchitecturalStructure;
  imageUrl: string;
}

const DimensionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>;
const IntegrityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.18-4.181M12 21a9 9 0 008.618-11.955 9 9 0 00-2.05-2.05A9 9 0 0012 3.944 9 9 0 004.382 8.045 9 9 0 003 12a9 9 0 004.18 7.818" /></svg>;
const EnvironmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export const StructureViewer: React.FC<StructureViewerProps> = ({ structure, imageUrl }) => {
  if (!structure) return null;

  const getImpactColor = (impact: string) => {
    switch(impact) {
        case 'Low': return 'text-green-400';
        case 'Moderate': return 'text-yellow-400';
        case 'High': return 'text-red-400';
        default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/20 p-6 rounded-lg border border-purple-900/50 shadow-lg shadow-purple-900/10">
      <h2 className="font-cinzel text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">{structure.name}</h2>
      
      {imageUrl ? (
        <img src={imageUrl} alt={structure.name} className="w-full h-auto object-cover rounded-md mb-6 border-2 border-purple-900/30" />
      ) : (
        <div className="w-full h-64 bg-gray-800 animate-pulse rounded-md mb-6 flex items-center justify-center">
            <p className="text-gray-500">Conjuring visual form...</p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-bold text-purple-300 text-md tracking-wider uppercase mb-3">Core Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-gray-900/50 p-4 rounded-lg">
            <div className="flex flex-col items-center">
                <DimensionIcon />
                <span className="font-bold text-2xl mt-1">{structure.dimensions.height}</span>
                <span className="text-sm text-gray-400">{structure.dimensions.floors} Floors</span>
            </div>
            <div className="flex flex-col items-center">
                <IntegrityIcon />
                <span className="font-bold text-2xl mt-1">{structure.structuralIntegrityScore}/100</span>
                <span className="text-sm text-gray-400">Integrity Score</span>
            </div>
            <div className="flex flex-col items-center">
                <EnvironmentIcon />
                <span className={`font-bold text-2xl mt-1 ${getImpactColor(structure.environmentalImpact)}`}>{structure.environmentalImpact}</span>
                <span className="text-sm text-gray-400">Environmental Impact</span>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-purple-300 text-md tracking-wider uppercase">Style</h3>
          <p className="text-gray-300 text-xl">{structure.style}</p>
        </div>
        <div>
          <h3 className="font-bold text-purple-300 text-md tracking-wider uppercase">Description</h3>
          <p className="text-gray-300 leading-relaxed text-lg">{structure.description}</p>
        </div>
        <div>
          <h3 className="font-bold text-purple-300 text-md tracking-wider uppercase">Primary Materials</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {structure.materials.map((material, index) => (
              <span key={index} className="bg-purple-900/50 text-purple-200 text-sm font-medium px-3 py-1.5 rounded-full">
                {material}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};