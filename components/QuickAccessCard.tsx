import Link from 'next/link';
import React from 'react';

interface QuickAccessCardProps {
  id: number;
  title: string;
  description: string;
  Icon: React.ElementType;
}

export default function QuickAccessCard({ id, title, description, Icon }: QuickAccessCardProps) {
  const href = `/artigo/${id}`;

  return (
    <Link href={href} className="block group h-full w-full">
      <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-all duration-200 h-full ">
        <div> {/* Wrapper for content above the button */}
          <div className="mb-3">
            {Icon && <Icon className="w-8 h-8 text-[#FF6B35]" />}
          </div>
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-[#FF6B35] transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">
            {description}
          </p>
        </div>
        
      </div>
    </Link>
  );
};