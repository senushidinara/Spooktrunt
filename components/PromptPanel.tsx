import React, { useRef } from 'react';
import { AppMode } from '../types';

interface PromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSummon: () => void;
  onAnalyze: () => void;
  onRevive: () => void;
  isLoading: boolean;
  isStructureGenerated: boolean;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  setBlueprintFile: (file: File | null) => void;
  blueprintFileName?: string;
}

const examplePrompts = [
    "A cathedral grown from bones & violet glass, spiraling like a cursed seashell dreaming of stars.",
    "Floating forest hotel over an ocean canyon, connected by bridges of woven light.",
    "A cyberpunk skyscraper that phases in and out of reality, built from glitching chrome and neon.",
    "A brutalist library carved inside a mountain, illuminated by a single, massive crystal.",
];

export const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  setPrompt,
  onSummon,
  onAnalyze,
  onRevive,
  isLoading,
  isStructureGenerated,
  appMode,
  setAppMode,
  setBlueprintFile,
  blueprintFileName,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBlueprintFile(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleExampleClick = (example: string) => {
        setPrompt(example);
    }

    const SummonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 1a1 1 0 01.894.553l2 4A1 1 0 0113 9h-2v2.223a1 1 0 01-1.38.924l-3-1.5a1 1 0 010-1.789l3-1.5A1 1 0 0111 7.223V5zm-2 8a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1H6a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>;
    const AnalyzeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" /></svg>;
    const ReviveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM3.586 5.05a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414L3.586 5.05zM14.95 14.95a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" /><path d="M10 3a7 7 0 100 14 7 7 0 000-14zM8 11a1 1 0 112 0v3a1 1 0 11-2 0v-3z" /></svg>;

    return (
    <div className="bg-black/20 p-6 rounded-lg border border-purple-900/50 shadow-lg shadow-purple-900/10">
      <div className="flex border-b border-purple-800/50 mb-4">
        <button onClick={() => setAppMode(AppMode.Summon)} className={`px-4 py-2 text-xl font-bold transition-colors ${appMode === AppMode.Summon ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-500 hover:text-purple-300'}`}>Summon</button>
        <button onClick={() => setAppMode(AppMode.Revive)} className={`px-4 py-2 text-xl font-bold transition-colors ${appMode === AppMode.Revive ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-500 hover:text-purple-300'}`}>Revive Blueprint</button>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={appMode === AppMode.Summon ? "Whisper your vision... e.g., 'A floating castle made of moonlight'" : "Describe the revival... e.g., 'Rebuild this as a cyberpunk metropolis'"}
        className="w-full h-48 bg-gray-900/50 border border-purple-800/50 rounded-md p-4 text-xl text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
      />
      <div className="mt-4 text-md text-gray-400">Example Visions:</div>
        <div className="mt-2 flex flex-wrap gap-2">
            {examplePrompts.map(ex => (
                <button key={ex} onClick={() => handleExampleClick(ex)} className="text-md bg-purple-900/50 hover:bg-purple-800/70 text-purple-300 px-3 py-1 rounded-full transition-colors truncate max-w-full">
                    {ex}
                </button>
            ))}
        </div>

      {appMode === AppMode.Revive && (
        <div className="mt-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
            <button onClick={handleUploadClick} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-3 border border-dashed border-purple-700 rounded-md text-purple-300 hover:bg-purple-900/50 hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                {blueprintFileName ? `Selected: ${blueprintFileName}` : "Upload Blueprint Image"}
            </button>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {appMode === AppMode.Summon ? (
            <button onClick={onSummon} disabled={isLoading || !prompt} className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-xl">
                <SummonIcon/> {isLoading ? 'Summoning...' : 'Summon Structure'}
            </button>
        ) : (
            <button onClick={onRevive} disabled={isLoading || !prompt || !blueprintFileName} className="flex items-center justify-center w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-xl">
                <ReviveIcon/> {isLoading ? 'Reviving...' : 'Revive Blueprint'}
            </button>
        )}
        <button onClick={onAnalyze} disabled={isLoading || !isStructureGenerated} className="flex items-center justify-center w-full bg-gray-700 text-gray-200 font-bold py-3 px-4 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl">
            <AnalyzeIcon/> {isLoading ? 'Analyzing...' : 'Analyze Feasibility'}
        </button>
      </div>
    </div>
  );
};
