import React, { useState, useMemo } from 'react';

const loreData = [
    {
        id: 'engine',
        title: 'The Aetheric Engine',
        content: [
            'Spooktrunt is not software; it is a conduit. It taps into the liminal space between logic and nightmare—the "Aether"—where concepts of physics are merely suggestions.',
            'The AI acts as a translator, taking raw human imagination and giving it a form the Aether can understand, allowing it to momentarily collapse reality around a desired structure.'
        ]
    },
    {
        id: 'materials',
        title: 'Forbidden Materials',
        content: [
            'Structures summoned by Spooktrunt are not bound by mundane elements. They are composed of solidified concepts and impossible matter:',
            'Glimmer-Steel: A metal that is both transparent and stronger than diamond, forged in the echo of a dying star.',
            'Noctis Concrete: A brutalist material that absorbs all light, creating areas of pure, physical darkness.',
            'Woven Light: Photons entangled and solidified into tensile strands, often used for bridges and support cables that defy gravity.',
            'Living Bone-Lattice: A self-repairing organic framework that grows and adapts over centuries, humming with a low, mournful energy.',
        ]
    },
    {
        id: 'geometries',
        title: 'Impossible Geometries',
        content: [
            "The Feasibility Lab does not check for compliance with Euclidean geometry, but rather for 'conceptual stability'.",
            'A structure may contain infinite hallways within a finite space or staircases that lead back to themselves. The AI\'s role is to ensure these paradoxes are self-consistent, preventing the structure from unraveling back into the Aether.'
        ]
    },
    {
        id: 'audits',
        title: 'A Note on Audits',
        content: [
            "The 'Feasibility Audit' is a translation of a structure's Aetheric resonance into human-readable metrics.",
            "A low 'Stability' score doesn't mean it will fall—it means it is actively fighting to remain in our reality. The suggestions are not fixes, but appeasements offered to the laws of physics to allow the structure to persist."
        ]
    }
];

const LoreEntry: React.FC<{ title: string; content: string[] }> = ({ title, content }) => (
    <div className="bg-black/20 p-6 rounded-lg border border-purple-900/50">
        <h3 className="font-cinzel text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">{title}</h3>
        <div className="text-gray-300 text-xl leading-relaxed space-y-4">
            {content.map((p, i) => {
                if(p.includes(':')) {
                    const [term, description] = p.split(/:(.*)/s);
                    return <p key={i}><strong>{term}:</strong>{description}</p>
                }
                return <p key={i}>{p}</p>
            })}
        </div>
    </div>
);

export const LoreCodexTab: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLore = useMemo(() => {
        if (!searchTerm) return loreData;
        return loreData.filter(entry => 
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

  return (
    <div className="mt-8">
      <h2 className="font-cinzel text-6xl text-purple-300/80 text-center">The Spooktrunt Codex</h2>
      <p className="text-center text-2xl text-gray-400 mt-2 mb-8">Forbidden knowledge of impossible architecture.</p>

      <div className="max-w-2xl mx-auto mb-8">
        <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search the archives..."
            className="w-full bg-gray-900/50 border border-purple-800/50 rounded-md p-4 text-xl text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredLore.length > 0 ? filteredLore.map(entry => (
            <LoreEntry key={entry.id} title={entry.title} content={entry.content} />
        )) : (
            <div className="md:col-span-2 text-center text-gray-500 py-16">
                 <p className="font-cinzel text-4xl">No secrets found.</p>
                 <p className="mt-2 text-2xl">The Aether remains silent on this matter.</p>
            </div>
        )}
      </div>
    </div>
  );
};
