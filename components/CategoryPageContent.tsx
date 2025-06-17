'use client';

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import QuickAccessCard from '@/components/QuickAccessCard';
import * as Icons from 'lucide-react';
import { type Article, type Category } from '@/app/categoria/[slug]/page'; // Importa as tipagens

// Mapeia nomes de ícones (string) para componentes React
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: React.ElementType } = Icons as any;

export default function CategoryPageContent({ initialArticles, category }: { initialArticles: Article[], category: Category }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = initialArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setArticles(filtered);
  }, [searchTerm, initialArticles]);

  return (
    <div className="w-full mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-700">
          {category.title}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {category.title}
      </h1>
      {category.description && (
        <p className="text-gray-600 mb-6">{category.description}</p>
      )}

      <div className="mb-8">
        <SearchBar 
          placeholder={`Procurar em ${category.title}...`}
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
              description={article.description ?? ''}
              Icon={iconMap[article.icon_name || ''] || Icons.FileQuestion}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">Nenhum artigo encontrado</h2>
          <p className="text-gray-500 mt-2">
            Sua busca por &quot;{searchTerm}&quot; não encontrou resultados.
          </p>
        </div>
      )}
    </div>
  );
}
