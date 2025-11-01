export interface ArchitecturalStructure {
  id: string; // Unique identifier for the gallery
  name: string;
  description: string;
  materials: string[];
  style: string;
  dimensions: {
    height: string;
    width: string;
    floors: number;
  };
  structuralIntegrityScore: number; // A score from 1-100 indicating structural soundness
  environmentalImpact: 'Low' | 'Moderate' | 'High' | 'Unknown'; // An assessment of the environmental footprint
}

export interface FeasibilityReport {
  stability: {
    rating: number; // 1-10
    analysis: string;
  };
  energyEfficiency: {
    rating: number; // 1-10
    analysis: string;
  };
  materialSuitability: {
    rating: number; // 1-10
    analysis: string;
  };
  costEstimation: {
    rating: number; // 1-10 (1=cheap, 10=exorbitant)
    analysis: string;
  };
  suggestions: string[];
}

export enum AppState {
  Idle = 'IDLE',
  GeneratingStructure = 'GENERATING_STRUCTURE',
  GeneratingImage = 'GENERATING_IMAGE',
  Analyzing = 'ANALYZING',
}

export enum AppMode {
  Summon = 'SUMMON',
  Revive = 'REVIVE',
}

export interface GalleryItem {
    id: string;
    structure: ArchitecturalStructure;
    imageUrl: string;
}
