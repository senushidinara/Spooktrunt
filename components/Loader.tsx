
import React from 'react';
import { AppState } from '../types';

interface LoaderProps {
  state: AppState;
}

const stateMessages: Record<AppState, string> = {
  [AppState.Idle]: '',
  [AppState.GeneratingStructure]: 'Summoning Spirits from the Aether...',
  [AppState.GeneratingImage]: 'Weaving Light into a Visual Echo...',
  [AppState.Analyzing]: 'Consulting the Architects of the Void...',
};

export const Loader: React.FC<LoaderProps> = ({ state }) => {
  const message = stateMessages[state] || 'Processing...';
  
  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-black/20 border-2 border-dashed border-purple-900/50 rounded-lg p-8">
        <svg className="animate-spin h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-purple-300 text-lg animate-pulse">{message}</p>
    </div>
  );
};
