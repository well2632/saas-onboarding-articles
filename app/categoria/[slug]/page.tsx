import { supabase } from '@/lib/supabase';
import CategoryPageContent from '@/components/CategoryPageContent';

// Tipagem para os artigos, pode ser movida para um arquivo compartilhado no futuro
type Article = {
  id: number;
  title: string;
  content: string;
  icon_name: string;
};

// Função de Servidor que busca os dados no Supabase
async function getCategoryData(categorySlug: string): Promise<{ articles: Article[], categoryName: string | null }> {
  // 1. Buscar todas as categorias únicas
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('articles')
    .select('category');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return { articles: [], categoryName: null };
  }

  const uniqueCategories = Array.from(new Set(categoriesData.map(item => item.category).filter(Boolean)));

  // 2. Encontrar a categoria original que corresponde ao slug
  const originalCategory = uniqueCategories.find(cat => 
    cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (!originalCategory) {
    return { articles: [], categoryName: categorySlug.replace(/-/g, ' ') };
  }

  // 3. Buscar artigos usando o nome da categoria original
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, content, icon_name')
    .eq('category', originalCategory)
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching articles by category:', error);
    return { articles: [], categoryName: originalCategory };
  }
  
  return { articles: data || [], categoryName: originalCategory };
}

// Componente de Página (Server Component)
export default async function CategoryPage({ params: { slug } }: { params: { slug: string } }) {
  const { articles, categoryName } = await getCategoryData(slug);

  // Passa os dados buscados para o componente de cliente
  return <CategoryPageContent initialArticles={articles} categoryName={categoryName || slug.replace(/-/g, ' ')} />;
}
