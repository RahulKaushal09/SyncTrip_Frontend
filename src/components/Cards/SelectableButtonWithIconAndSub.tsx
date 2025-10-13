'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
type Props = {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon: string; // Ionicon name, e.g., 'airplane', 'walk-outline'
};

const SelectableButtonWithIconAndSub: React.FC<Props> = ({
  label,
  description,
  isSelected,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-xl p-3 mb-3 transition-all 
        ${isSelected ? 'bg-primary-background border border-primary-1' : 'bg-white border border-transparent shadow-sm hover:shadow-md'}`}
      style={{ boxShadow: '0px 2px 8px #838BB419' }}
    >
      {/* Left icon */}
      <div className="flex items-center flex-1">
        {/* <IonIcon
          icon={icon as any}
          className={`text-xl mr-3 ${
            isSelected ? 'text-primary-1' : 'text-gray-400'
          }`}
        /> */}

        {/* Text */}
        <div className="flex flex-col text-left">
          <span
            className={`font-semibold text-base ${
              isSelected ? 'text-primary-1' : 'text-black'
            }`}
          >
            {label}
          </span>
          <span className="text-sm text-gray-500">{description}</span>
        </div>
      </div>

      {/* Tick icon if selected */}
      {isSelected && (
        <div className="w-7 h-7 rounded-full border-2 border-primary-1 bg-primary-background flex items-center justify-center">
            <CheckCircle className="text-primary-1" size={20} />
        </div>
      )}
    </button>
  );
};

export default SelectableButtonWithIconAndSub;
