'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';

// Mapeia dinamicamente todos os ícones da biblioteca 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: React.ElementType } = Icons as any;

import type { IconName } from '@/lib/icon-types';

interface CategoryCardProps {
  title: string;
  description: string | null;
  slug: string;
  iconName: IconName | null; // Using IconName type
}

export default function CategoryCard({ title, description, slug, iconName }: CategoryCardProps) {
  const IconComponent = (iconName && iconMap[iconName]) ? iconMap[iconName] : Icons.FileText;
  const Icon = IconComponent || Icons.HelpCircle; // Fallback final se FileText também falhar

  console.log(`CategoryCard Debug: slug='${slug}', iconName='${iconName}'`);
  console.log(`  - iconMap[iconName] resolved to:`, iconName ? iconMap[iconName] : 'N/A (iconName is null/empty)');
  console.log(`  - IconComponent resolved to:`, IconComponent ? (typeof IconComponent === 'string' ? IconComponent : 'ComponentObject') : IconComponent);
  console.log(`  - Final Icon resolved to:`, Icon ? (typeof Icon === 'string' ? Icon : 'ComponentObject') : Icon);

  if (!Icon) {
    console.error(`CRITICAL: Icon is undefined for category slug '${slug}' with iconName '${iconName}'. Fallbacks (FileText, HelpCircle) might also be undefined.`);
  }

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
