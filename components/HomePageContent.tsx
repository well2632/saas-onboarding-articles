'use client';

import { useState } from 'react';
import QuickAccessCard from '@/components/QuickAccessCard';
import SearchBar from '@/components/SearchBar';
import { FileText, KeyRound, Plug, BookUser } from 'lucide-react';

// Tipagem para os artigos recebidos como props
type Article = {
  id: number;
  title: string;
  category: string;
};

interface HomePageContentProps {
  quickAccessArticles: Article[];
}

const popularSearches = ['transfer', 'reset password', 'subs credit'];

// Mapeia categorias a ícones para dinamismo
const iconMap: { [key: string]: React.ElementType } = {
  ACCOUNT: BookUser,
  SECURITY: KeyRound,
  BILLING: FileText,
  DEFAULT: Plug, // Ícone padrão
};

export default function HomePageContent({ quickAccessArticles }: HomePageContentProps) {
  const [mainSearch, setMainSearch] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Home</span>
      </div>

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Como podemos te ajudar?</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar value={mainSearch} onChange={(e) => setMainSearch(e.target.value)} />
        <div className="flex items-center space-x-2 mt-2 text-sm">
          <span className="text-gray-500">Popular search:</span>
          {popularSearches.map((term) => (
            <button key={term} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quickAccessArticles.map((article) => (
            <QuickAccessCard
              key={article.id}
              icon={iconMap[article.category] || iconMap.DEFAULT}
              title={article.title}
              href={`/artigo/${article.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
