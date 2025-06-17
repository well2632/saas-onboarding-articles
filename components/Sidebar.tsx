'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

type Article = {
  id: number;
  title: string;
  category: string;
};

type GroupedArticles = {
  [key: string]: Article[];
};

const Sidebar = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedArticles, setGroupedArticles] = useState<GroupedArticles>({});

  useEffect(() => {
    const getArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching articles for sidebar:', error);
        setArticles([]);
      } else {
        setArticles(data || []);
      }
    };

    getArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, article) => {
      const { category } = article;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
      return acc;
    }, {} as GroupedArticles);

    setGroupedArticles(grouped);
  }, [searchTerm, articles]);

  return (
    <aside className="w-full md:w-72 bg-white border-r border-gray-200 p-6 flex-shrink-0 hidden md:block">
      <div className="mb-6">
        <SearchBar
          placeholder="Procurar postagem"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <nav className="space-y-6">
        {Object.keys(groupedArticles).length > 0 ? (
          Object.entries(groupedArticles).map(([category, articlesInCategory]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {articlesInCategory.map((article) => (
                  <li key={article.id}>
                    <Link href={`/artigo/${article.id}`} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 block p-2 rounded-md text-sm">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum artigo encontrado.</p>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;