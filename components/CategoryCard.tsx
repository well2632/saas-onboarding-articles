'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';

// Mapeia dinamicamente todos os ícones da biblioteca 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: React.ElementType } = Icons as any;

interface CategoryCardProps {
  title: string;
  description: string | null;
  slug: string;
  iconName: string | null;
}

export default function CategoryCard({ title, description, slug, iconName }: CategoryCardProps) {
  const Icon = iconName ? iconMap[iconName] : Icons.FileText;

  return (
    <Link href={`/categoria/${slug}`}>
      <div className="bg-white p-6 rounded-lg border border-gray-200  hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <div className="mb-4">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <span className="text-[#FF6B35] font-semibold hover:underline text-sm">Saiba mais →</span>
      </div>
    </Link>
  );
}
