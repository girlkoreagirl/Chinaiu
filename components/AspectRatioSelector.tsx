
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  ratios: AspectRatio[];
  selectedRatio: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ ratios, selectedRatio, onSelect }) => {
  return (
    <div className="flex items-center justify-center gap-3 bg-gray-700/50 p-2 rounded-lg">
      {ratios.map((ratio) => (
        <button
          key={ratio.id}
          onClick={() => onSelect(ratio)}
          title={ratio.label}
          className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
            selectedRatio.id === ratio.id
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          {ratio.icon}
          <span className="font-medium hidden sm:inline">{ratio.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;