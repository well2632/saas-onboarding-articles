'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import QuickAccessCard from '@/components/QuickAccessCard';
import * as Icons from 'lucide-react';

// Tipagem para os artigos, incluindo o novo campo de ícone
type Article = {
  id: number;
  title: string;
  content: string; // Mantido para possível uso futuro, mas não exibido no card
  icon_name: string;
};

// Mapeia nomes de ícones (string) para componentes React
const iconMap: { [key: string]: React.ElementType } = Icons;

export default function CategoryPageContent({ initialArticles, categoryName }: { initialArticles: Article[], categoryName: string }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = initialArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setArticles(filtered);
  }, [searchTerm, initialArticles]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-700 capitalize">
          {categoryName}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
      {categoryName}
      </h1>
      <p className="text-gray-600 mb-6">Encontre ajuda e respostas para suas perguntas.</p>

      <div className="mb-8">
        <SearchBar 
          placeholder={`Procurar em ${categoryName}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <QuickAccessCard
              key={article.id}
              id={article.id}
              title={article.title}
              Icon={iconMap[article.icon_name] || Icons.FileQuestion} // Referência direta e mais segura
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">Nenhum artigo encontrado</h2>
          <p className="text-gray-500 mt-2">
            Sua busca por "{searchTerm}" não encontrou resultados.
          </p>
        </div>
      )}
    </div>
  );
}
