'use client';

import React, { useState } from 'react';
import SearchBar from './SearchBar';
import QuickAccessCard from './QuickAccessCard';
import * as Icons from 'lucide-react';

// Tipagem para os artigos recebidos como props, agora incluindo icon_name
type QuickAccessArticle = {
  id: number;
  title: string;
  category: string;
  icon_name: string;
};

// Tipagem para os artigos agrupados por categoria
type GroupedArticles = {
  [key: string]: QuickAccessArticle[];
};

interface HomePageContentProps {
  articles: QuickAccessArticle[];
  categorizedArticles: GroupedArticles;
}

// Mapeia dinamicamente todos os ícones da biblioteca 'lucide-react'
const iconMap: { [key: string]: React.ElementType } = Icons as any;

export default function HomePageContent({ articles: quickAccessArticles, categorizedArticles }: HomePageContentProps) {
  const [mainSearch, setMainSearch] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Como podemos te ajudar?
        </h1>
        <p className="text-gray-600 mb-6">Encontre ajuda e respostas para suas perguntas.</p>
        <div className="mb-8">
          <SearchBar 
            placeholder="Busque por um artigo..."
            value={mainSearch}
            onChange={(e) => setMainSearch(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessArticles.map((article) => (
            <QuickAccessCard
              key={article.id}
              id={article.id}
              title={article.title}
              // A lógica agora busca o ícone pelo nome, depois pela categoria, e por último usa um padrão.
              Icon={iconMap[article.icon_name] || iconMap[article.category.toUpperCase()] || Icons.FileQuestion}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
