import React, { useState, useEffect } from 'react';
import type { FeasibilityReport } from '../types';

interface FeasibilityReportViewerProps {
  report: FeasibilityReport;
}

const RatingBar: React.FC<{ rating: number; label: string; isSimulating: boolean; }> = ({ rating, label, isSimulating }) => {
    const width = `${rating * 10}%`;
    const colorClass = rating < 4 ? 'bg-red-500' : rating < 7 ? 'bg-yellow-500' : 'bg-green-500';
    const simulationClass = isSimulating ? 'animate-pulse' : '';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-xl font-medium text-gray-300">{label}</span>
                <span className="text-xl font-bold text-white">{rating}/10</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div className={`h-4 rounded-full transition-all duration-500 ${colorClass} ${simulationClass}`} style={{ width }}></div>
            </div>
        </div>
    );
};


export const FeasibilityReportViewer: React.FC<FeasibilityReportViewerProps> = ({ report }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  
  useEffect(() => {
    // Reset simulation when report changes
    setIsSimulating(false);
    setSimulationLog([]);
  }, [report]);

  const runStressTest = () => {
    setIsSimulating(true);
    setSimulationLog(["[SYS] Initiating Aetheric Stress Test..."]);

    const events = [
      { time: 1000, log: "[EVENT] Applying localized temporal flux..." },
      { time: 2500, log: "[REPORT] Energy signature unstable but holding." },
      { time: 4000, log: "[EVENT] Simulating Class-3 seismic anomaly..." },
      { time: 5500, log: "[REPORT] Material integrity fluctuating... Compensating." },
      { time: 7000, log: "[EVENT] Projecting high-band psionic resonance..." },
      { time: 8500, log: "[REPORT] Structure remains conceptually sound." },
      { time: 10000, log: "[SYS] Simulation complete. Structural integrity within acceptable paradox limits." },
    ];
    
    events.forEach(event => {
        setTimeout(() => {
            setSimulationLog(prev => [...prev, event.log]);
        }, event.time);
    });

    setTimeout(() => setIsSimulating(false), 10500);
  };

  if (!report) return null;

  return (
    <div className="bg-black/20 p-6 rounded-lg border border-teal-900/50 shadow-lg shadow-teal-900/10">
      <h2 className="font-cinzel text-5xl font-bold text-teal-300 mb-6">Feasibility Audit</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
            <RatingBar rating={report.stability.rating} label="Stability" isSimulating={isSimulating} />
            <p className="text-lg text-gray-400 pt-2">{report.stability.analysis}</p>
        </div>
        <div className="space-y-3">
            <RatingBar rating={report.energyEfficiency.rating} label="Energy Efficiency" isSimulating={isSimulating}/>
            <p className="text-lg text-gray-400 pt-2">{report.energyEfficiency.analysis}</p>
        </div>
        <div className="space-y-3">
            <RatingBar rating={report.materialSuitability.rating} label="Material Suitability" isSimulating={isSimulating}/>
             <p className="text-lg text-gray-400 pt-2">{report.materialSuitability.analysis}</p>
        </div>
        <div className="space-y-3">
            <RatingBar rating={report.costEstimation.rating} label="Cost Estimation" isSimulating={isSimulating}/>
             <p className="text-lg text-gray-400 pt-2">{report.costEstimation.analysis}</p>
        </div>
      </div>

      <div className="mt-10">
          <h3 className="font-bold text-teal-300 text-xl tracking-wider uppercase mb-3">Suggestions for Reality-Bending</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-xl">
              {report.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
              ))}
          </ul>
      </div>

      <div className="mt-10">
        <button onClick={runStressTest} disabled={isSimulating} className="w-full bg-teal-600/50 text-teal-200 font-bold py-3 px-4 rounded-md hover:bg-teal-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl">
          {isSimulating ? 'Simulation in Progress...' : 'Run Stress Test'}
        </button>
        {simulationLog.length > 0 && (
            <div className="mt-4 bg-gray-900/70 p-4 rounded-md h-40 overflow-y-auto font-mono text-sm text-green-400">
                {simulationLog.map((log, i) => <p key={i} className="animate-fade-in">{`> ${log}`}</p>)}
            </div>
        )}
      </div>
    </div>
  );
};
