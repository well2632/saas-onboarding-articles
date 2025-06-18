'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { availableLucideIcons, type IconName } from '@/lib/icon-types';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect?: (iconName: IconName) => void; // Opcional: para selecionar um ícone diretamente do modal
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({ isOpen, onClose, onIconSelect }) => {
  if (!isOpen) return null;

  // Mapeamento para renderizar ícones. Precisamos do 'as any' por causa da natureza dinâmica.
  const iconComponents = Icons as any;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Selecione um Ícone</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            aria-label="Fechar modal"
          >
            <Icons.X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-1">
          {availableLucideIcons.map((iconName) => {
            const IconComponent = iconComponents[iconName];
            return (
              <div 
                key={iconName} 
                className={`flex flex-col items-center p-2 border rounded-md hover:bg-gray-100 hover:shadow-sm cursor-pointer transition-all 
                            ${onIconSelect ? 'hover:border-blue-500' : ''}`}
                onClick={() => onIconSelect && onIconSelect(iconName)}
                title={iconName}
              >
                {IconComponent ? (
                  <IconComponent size={32} className="mb-1 text-gray-700" />
                ) : (
                  <Icons.HelpCircle size={32} className="mb-1 text-red-500" /> // Fallback se o ícone não for encontrado
                )}
                <span className="text-xs text-center text-gray-600 truncate w-full">{iconName}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-right">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
