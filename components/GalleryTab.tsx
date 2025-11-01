import React from 'react';
import type { GalleryItem } from '../types';

interface GalleryTabProps {
  gallery: GalleryItem[];
  activeItemId: string | null;
  onSelect: (id: string) => void;
}

const GalleryCard: React.FC<{ item: GalleryItem; isActive: boolean; onSelect: () => void }> = ({ item, isActive, onSelect }) => (
  <div className={`rounded-lg overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-purple-900/50'}`}>
    <img src={item.imageUrl} alt={item.structure.name} className="w-full h-48 object-cover" />
    <div className="p-4 bg-gray-900/50">
      <h3 className="text-2xl font-bold truncate text-gray-200">{item.structure.name}</h3>
      <p className="text-md text-gray-400 h-12 overflow-hidden">{item.structure.description}</p>
      <button 
        onClick={onSelect} 
        disabled={isActive}
        className="w-full mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-lg">
        {isActive ? 'Selected' : 'Select'}
      </button>
    </div>
  </div>
);


export const GalleryTab: React.FC<GalleryTabProps> = ({ gallery, activeItemId, onSelect }) => {
  return (
    <div className="mt-8">
      <h2 className="font-cinzel text-6xl text-purple-300/80 text-center">The Gallery of Whispers</h2>
      <p className="text-center text-2xl text-gray-400 mt-2">A collection of your resurrected creations from this session.</p>

      <div className="mt-8">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map(item => (
                <GalleryCard 
                    key={item.id} 
                    item={item} 
                    isActive={item.id === activeItemId} 
                    onSelect={() => onSelect(item.id)} 
                />
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center bg-black/20 border-2 border-dashed border-purple-900/50 rounded-lg p-8">
            <div className="text-center text-gray-500">
              <p className="font-cinzel text-5xl">The Archive is Empty</p>
              <p className="mt-2 text-2xl">Creations you summon will be chronicled here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
