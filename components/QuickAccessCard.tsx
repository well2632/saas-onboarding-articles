import Link from 'next/link';
import React from 'react';

interface QuickAccessCardProps {
  id: number;
  title: string;
  Icon: React.ElementType;
}

export default function QuickAccessCard({ id, title, Icon }: QuickAccessCardProps) {
  const href = `/artigo/${id}`;

  return (
    <Link href={href} className="block group h-full">
      <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg  hover:border-[#FF6B35] transition-all duration-200 h-full">
        <div className="flex-shrink-0">
          {/* Renderiza o ícone apenas se ele for um componente válido */}
          {Icon && <Icon className="w-6 h-6 text-[#FF6B35]" />}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 group-hover:text-[#FF6B35] transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};