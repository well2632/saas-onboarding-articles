import { supabase } from '@/lib/supabase';
import AdminView from './AdminView';
import type { Category, Article } from '@/app/page';

async function getAllCategories(): Promise<{ categories: Category[], articles: Article[] }> {
  // Fetch categories and articles in parallel
  const [categoriesResult, articlesResult] = await Promise.all([
    supabase.from('categories').select('*').order('home_order, title'),
    supabase.from('articles').select('*').order('title')
  ]);

  const categories = categoriesResult.data || [];
  const articles = articlesResult.data || [];

  if (categoriesResult.error) {
    console.error('Error fetching categories:', categoriesResult.error.message);
  }
  if (articlesResult.error) {
    console.error('Error fetching articles:', articlesResult.error.message);
  }

  return { categories, articles };
}

// Este é agora um Componente de Servidor.
// Ele busca os dados e os passa para o componente de cliente AdminView.
export default async function AdminPage() {
  const { categories, articles } = await getAllCategories();

  return <AdminView categories={categories} articles={articles} />;
}
