
import React from 'react';
import type { StylePreset } from '../types';

interface StyleSelectorProps {
  presets: StylePreset[];
  selectedPreset: StylePreset | null;
  onSelect: (preset: StylePreset) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ presets, selectedPreset, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
          className={`relative rounded-lg overflow-hidden h-24 group focus:outline-none focus:ring-4 transition-all duration-300 ${
            selectedPreset?.id === preset.id ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent hover:ring-indigo-600'
          }`}
        >
          <img src={preset.imageUrl} alt={preset.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center p-2">
            <span className="text-white font-semibold text-center text-sm">{preset.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;