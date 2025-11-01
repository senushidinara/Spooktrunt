import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptPanel } from './components/PromptPanel';
import { StructureViewer } from './components/StructureViewer';
import { FeasibilityReportViewer } from './components/FeasibilityReportViewer';
import { Loader } from './components/Loader';
import { ARViewerTab } from './components/ARViewerTab';
import { GalleryTab } from './components/GalleryTab';
import { LoreCodexTab } from './components/LoreCodexTab';
import { type ArchitecturalStructure, type FeasibilityReport, AppState, AppMode, type GalleryItem } from './types';
import { generateStructure, analyzeStructureFeasibility, generateImage, reviveBlueprint } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const TABS = [
  { id: 'design', label: 'Design Studio' },
  { id: 'feasibility', label: 'Feasibility Lab' },
  { id: 'ar', label: 'AR/3D Viewer' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'lore', label: 'Lore & Codex' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.Summon);
  const [activeTab, setActiveTab] = useState<string>('design');
  const [prompt, setPrompt] = useState<string>('');
  const [activeStructure, setActiveStructure] = useState<GalleryItem | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleNewStructure = (structureData: ArchitecturalStructure, imageUrl: string) => {
    const newGalleryItem: GalleryItem = {
      id: structureData.id,
      structure: structureData,
      imageUrl: imageUrl,
    };
    setGallery(prevGallery => [newGalleryItem, ...prevGallery]);
    setActiveStructure(newGalleryItem);
    setReport(null);
  };

  const handleSummon = useCallback(async () => {
    if (!prompt) {
      setError('Please whisper a vision into the prompt.');
      return;
    }
    setError('');
    setActiveStructure(null);
    setReport(null);
    setActiveTab('design');
    setAppState(AppState.GeneratingStructure);

    try {
      const { structureData, imageGenPrompt } = await generateStructure(prompt);
      
      setAppState(AppState.GeneratingImage);
      const generatedImage = await generateImage(imageGenPrompt);
      
      handleNewStructure(structureData, `data:image/jpeg;base64,${generatedImage}`);

    } catch (err) {
      console.error(err);
      setError('The spirits failed to materialize the vision. Please try again.');
    } finally {
      setAppState(AppState.Idle);
    }
  }, [prompt]);

  const handleRevive = useCallback(async () => {
    if (!prompt || !blueprintFile) {
      setError('A blueprint and a revival prompt are required.');
      return;
    }
    setError('');
    setActiveStructure(null);
    setReport(null);
    setActiveTab('design');
    setAppState(AppState.GeneratingStructure);

    try {
      const { base64, mimeType } = await fileToBase64(blueprintFile);
      const imagePart = { inlineData: { data: base64, mimeType } };

      const { structureData, imageGenPrompt } = await reviveBlueprint(prompt, imagePart);
      
      setAppState(AppState.GeneratingImage);
      const generatedImage = await generateImage(imageGenPrompt);
      
      handleNewStructure(structureData, `data:image/jpeg;base64,${generatedImage}`);

    } catch (err) {
      console.error(err);
      setError('The blueprint resists resurrection. Please try again.');
    } finally {
      setAppState(AppState.Idle);
    }
  }, [prompt, blueprintFile]);

  const handleAnalyze = useCallback(async () => {
    if (!activeStructure) {
      setError('A structure must be summoned before it can be analyzed.');
      return;
    }
    setError('');
    setReport(null);
    setAppState(AppState.Analyzing);

    try {
      const base64Data = activeStructure.imageUrl.split(',')[1];
      const analysisReport = await analyzeStructureFeasibility(activeStructure.structure, base64Data);
      setReport(analysisReport);
      setActiveTab('feasibility'); // Switch to feasibility tab on success
    } catch (err) {
      console.error(err);
      setError('The architectural spirits are conflicted. Analysis failed.');
    } finally {
      setAppState(AppState.Idle);
    }
  }, [activeStructure]);

  const handleSelectFromGallery = useCallback((itemId: string) => {
    const selected = gallery.find(item => item.id === itemId);
    if (selected) {
      setActiveStructure(selected);
      setReport(null); // Clear old reports when switching
      setError('');
      setActiveTab('design'); // Go to design tab to see the selected item
    }
  }, [gallery]);

  const isLoading = appState !== AppState.Idle;

  const renderContent = () => {
    switch (activeTab) {
      case 'design':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <PromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              onSummon={handleSummon}
              onAnalyze={handleAnalyze}
              onRevive={handleRevive}
              isLoading={isLoading}
              isStructureGenerated={!!activeStructure}
              appMode={appMode}
              setAppMode={setAppMode}
              setBlueprintFile={setBlueprintFile}
              blueprintFileName={blueprintFile?.name}
            />
            <div className="space-y-8">
              {isLoading ? (
                <Loader state={appState} />
              ) : error ? (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                  <h3 className="font-bold text-2xl">An Omen...</h3>
                  <p className="text-lg">{error}</p>
                </div>
              ) : null}

              {!isLoading && activeStructure && (
                <StructureViewer structure={activeStructure.structure} imageUrl={activeStructure.imageUrl} />
              )}
              
              {!isLoading && !activeStructure && (
                <div className="h-full min-h-[400px] flex items-center justify-center bg-black/20 border-2 border-dashed border-purple-900/50 rounded-lg p-8">
                    <div className="text-center text-gray-500">
                        <p className="font-cinzel text-5xl">The Void Awaits Your Vision</p>
                        <p className="mt-2 text-2xl">Use the Design Studio to summon a structure from the ether.</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'feasibility':
        return (
            <div className="mt-8">
                {isLoading && appState === AppState.Analyzing ? (
                    <Loader state={appState} />
                ) : report && activeStructure ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <StructureViewer structure={activeStructure.structure} imageUrl={activeStructure.imageUrl} />
                        <FeasibilityReportViewer report={report} />
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center bg-black/20 border-2 border-dashed border-teal-900/50 rounded-lg p-8">
                        <div className="text-center text-gray-500">
                            <p className="font-cinzel text-5xl">No Audit Performed</p>
                            <p className="mt-2 text-2xl">Summon a structure and run an analysis, or select one from the Gallery.</p>
                        </div>
                    </div>
                )}
            </div>
        );
      case 'ar':
        return <ARViewerTab imageUrl={activeStructure?.imageUrl ?? null} />;
      case 'gallery':
        return <GalleryTab gallery={gallery} activeItemId={activeStructure?.id ?? null} onSelect={handleSelectFromGallery} />;
      case 'lore':
        return <LoreCodexTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a001a] via-gray-900 to-[#1a000d] text-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <nav className="mt-8 border-b-2 border-purple-500/20 flex items-center justify-center flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-4 text-lg md:text-2xl font-bold transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                activeTab === tab.id
                  ? 'text-purple-300 border-b-4 border-purple-400'
                  : 'text-gray-500 hover:text-purple-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
