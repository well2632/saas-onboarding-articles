import { supabase } from '@/lib/supabase';
import CategoryPageContent from '@/components/CategoryPageContent';
import { notFound } from 'next/navigation';

// Tipagens para os dados
export type Article = {
  id: number;
  title: string;
  icon_name: string | null;
};

export type Category = {
  id: number;
  title: string;
  description: string | null;
};

// Busca os dados da categoria e seus artigos
// Busca os dados da categoria e seus artigos
async function getCategoryData(slug: string): Promise<{ articles: Article[], category: Category }> {
  // 1. Encontra a categoria pelo slug
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, title, description')
    .eq('slug', slug)
    .single();

  // Se a categoria não for encontrada, retorna 404
  if (categoryError || !category) {
    notFound();
  }

  // 2. Busca os artigos usando o ID da categoria encontrada
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('id, title, description, icon_name')
    .eq('category_id', category.id)
    .order('title', { ascending: true });

  if (articlesError) {
    console.error('Error fetching articles for category:', articlesError);
    // Retorna a categoria mas com artigos vazios em caso de erro
    return { articles: [], category };
  }

  return { articles: articles || [], category };
}

interface CategoryPageProps {
  params: Promise<{ slug: string; }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Componente de Página (Server Component)
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { articles, category } = await getCategoryData(slug);

  // Passa os dados para o componente de cliente
  return <CategoryPageContent initialArticles={articles} category={category} />;
}
