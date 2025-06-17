'use client';

import React, { useState } from 'react';
import SearchBar from './SearchBar';
import CategoryCard from './CategoryCard';
import { type Category } from '@/app/page';

interface HomePageContentProps {
  categories: Category[];
}

export default function HomePageContent({ categories }: HomePageContentProps) {
  const [mainSearch, setMainSearch] = useState('');

  return (
    <div className="w-full mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Como podemos te ajudar?
        </h1>
        <p className="text-gray-600 mb-6">Encontre ajuda e respostas para suas perguntas.</p>
        <div className="max-w-2xl mx-auto">
          <SearchBar 
            placeholder="Busque por um artigo..."
            value={mainSearch}
            onChange={(e) => setMainSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Seção de Categorias */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Navegue por Categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              title={category.title}
              description={category.description}
              slug={category.slug}
              iconName={category.icon_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
