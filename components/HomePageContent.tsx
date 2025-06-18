'use client';

import React, { useState, useEffect, useMemo } from 'react';

import QuickAccessCard from './QuickAccessCard';
import * as Icons from 'lucide-react'; // Import all icons
import { supabase } from '@/lib/supabase';
import SearchBar from './SearchBar';
import CategoryCard from './CategoryCard';
import { type Category } from '@/app/page';

import type { IconName } from '@/lib/icon-types';

// Define o tipo para um artigo, similar ao que temos no Sidebar
interface Article {
  id: number;
  title: string;
  description: string; // QuickAccessCard espera uma descrição
  icon_name: IconName | null; // Para determinar o ícone
}

interface HomePageContentProps {
  categories: Category[];
}

export default function HomePageContent({ categories }: HomePageContentProps) {
  const [mainSearch, setMainSearch] = useState('');
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  // Mapeamento de nome de ícone para componente de ícone (similar ao CategoryPageContent)
  const iconMap: { [key: string]: React.ElementType } = {
    'file-text': Icons.FileText,
    'settings': Icons.Settings,
    'home': Icons.Home,
    // Adicione outros mapeamentos conforme necessário
  };

  useEffect(() => {
    async function fetchAllArticles() {
      setIsLoadingArticles(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, description, icon_name')
          .order('title', { ascending: true });

        if (error) throw error;
        setAllArticles(data || []);
      } catch (error) {
        console.error('Error fetching all articles for homepage search:', error);
        // Considerar adicionar um estado de erro para feedback ao usuário
      } finally {
        setIsLoadingArticles(false);
      }
    }
    fetchAllArticles();
  }, []);

  const searchedArticles = useMemo(() => {
    if (!mainSearch.trim()) return [];
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(mainSearch.toLowerCase().trim())
    );
  }, [allArticles, mainSearch]);

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

      {/* Conteúdo condicional: Resultados da Busca ou Categorias */}
      {mainSearch.trim() ? (
        <div className="mt-10">
          {isLoadingArticles ? (
            <p className="text-center text-gray-500">Buscando artigos...</p>
          ) : searchedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedArticles.map(article => (
                <QuickAccessCard
                  key={`search-home-${article.id}`}
                  id={article.id}
                  title={article.title}
                  description={article.description || 'Sem descrição disponível.'} // Fallback para descrição
                  Icon={iconMap[article.icon_name || ''] || Icons.FileQuestion} // Fallback para ícone
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">Nenhum artigo encontrado para &quot;{mainSearch}&quot;.</p>
          )}
        </div>
      ) : (
        // Seção de Categorias (quando não há busca ativa)
        <div className="mt-12">
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
      )}
    </div>
  );
}
