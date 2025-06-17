'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRightIcon, ChevronDownIcon, SearchIcon as LucideSearchIcon } from 'lucide-react'; // Renomeado para evitar conflito
import SidebarSkeleton from './SidebarSkeleton';

// Tipos para os dados
interface Category {
  id: number;
  title: string;
  slug: string;
  icon_name?: string; // Mantido para consistência, mas não usado no estilo anterior
}

interface Article {
  id: number;
  title: string;
  category_id: number | null;
}

export default function Sidebar() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [categoriesResponse, articlesResponse] = await Promise.all([
          supabase.from('categories').select('id, title, slug, icon_name').order('home_order', { ascending: true }), // Usando home_order como no seu código original
          supabase.from('articles').select('id, title, category_id').order('title', { ascending: true }),
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (articlesResponse.error) throw articlesResponse.error;

        setAllCategories(categoriesResponse.data || []);
        setAllArticles(articlesResponse.data || []);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const searchedArticles = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [allArticles, searchTerm]);

  // Combina categorias com seus artigos filtrados para a visualização de acordeão
  const categoriesWithArticlesForAccordion = useMemo(() => {
    return allCategories.map(category => ({
      ...category,
      articles: allArticles.filter(article => Number(article.category_id) === Number(category.id))
    })).filter(category => category.articles.length > 0 || category.title.toLowerCase().includes(searchTerm.toLowerCase().trim())); // Filtro para categorias que têm artigos ou cujo título corresponde à busca (para o modo acordeão)

  }, [allCategories, allArticles, searchTerm]);


  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="hidden md:block w-64 h-screen-minus-header p-4 border-r border-gray-200 overflow-y-auto">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar artigos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
        />
        <LucideSearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <nav className="flex-grow space-y-1">
        {searchTerm.trim() ? ( // Se houver termo de busca, mostra lista simples de artigos
          <div>
            {searchedArticles.length > 0 ? (
              <ul>
                {searchedArticles.map(article => (
                  <li key={`search-${article.id}`}>
                    <Link
                      href={`/artigo/${article.id}`}
                      className="block p-2 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-2 text-sm text-gray-500 italic">Nenhum artigo encontrado.</p>
            )}
          </div>
        ) : ( // Se não houver termo de busca, mostra o acordeão de categorias
          categoriesWithArticlesForAccordion.map(category => {
            const isOpen = !!openCategories[category.id];
            // Não mostrar categoria no modo acordeão se não tiver artigos (a menos que o título da categoria corresponda à busca, o que não se aplica aqui pois searchTerm está vazio)
            if (category.articles.length === 0 && !category.title.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
                 // No modo sem busca, só mostramos categorias que têm artigos.
                if (!searchTerm.trim() && category.articles.length === 0) return null;
            }

            return (
              <div key={category.id}>
                <div className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                     onClick={() => category.articles.length > 0 && toggleCategory(category.id)}
                >
                  <Link href={`/categoria/${category.slug}`} className="flex-grow hover:underline" onClick={(e) => e.stopPropagation()}>
                    {category.title}
                  </Link>
                  {category.articles.length > 0 && (
                    <button
                      aria-label={isOpen ? 'Fechar categoria' : 'Abrir categoria'}
                      className="ml-4 focus:outline-none"
                    >
                      {isOpen ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                {isOpen && category.articles.length > 0 && (
                  <div className="pl-4 mt-1 space-y-1 border-l border-gray-200 ml-3">
                    {category.articles.map(article => (
                      <Link
                        key={article.id}
                        href={`/artigo/${article.id}`}
                        className="block p-2 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {article.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}