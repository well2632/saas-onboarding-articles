'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Sidebar() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('category');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      const uniqueCategories = Array.from(new Set(data.map(item => item.category).filter(Boolean)));
      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

  return (
    <aside className="hidden md:block w-64 h-screen-minus-header p-4 border-r border-gray-200">
      <h2 className="text font-semibold text-gray-800 mb-4 px-3">Categorias</h2>
      <nav className="space-y-1">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link 
              key={category}
              href={`/categoria/${category.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ /g, '-')}`}
              className="block px-3 py-2 text font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              {category}
            </Link>
          ))
        ) : (
          <p className="text text-gray-500">Carregando categorias...</p>
        )}
      </nav>
    </aside>
  );
}