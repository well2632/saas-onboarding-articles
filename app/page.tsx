import { supabase } from '@/lib/supabase';
import HomePageContent from '@/components/HomePageContent';

// Tipagem para o artigo, garantindo consistência
type Article = {
  id: number;
  title: string;
  category: string;
  icon_name: string;
};

// Tipagem para os artigos agrupados por categoria
type GroupedArticles = {
  [key: string]: Article[];
};

async function getCategorizedArticles(): Promise<GroupedArticles> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category, icon_name')
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching articles:', error.message);
    return {};
  }

  if (!data) {
    return {};
  }

  // Agrupa os artigos por categoria
  const grouped = data.reduce((acc, article) => {
    const { category } = article;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {} as GroupedArticles);

  return grouped;
}

async function getQuickAccessArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category, icon_name') // Adiciona icon_name
    .eq('is_quick_access', true)
    .limit(6);

  if (error) {
    console.error('Error fetching quick access articles:', error.message);
    // Retorna um array vazio em caso de erro para não quebrar a página.
    return [];
  }
  return data || [];
}

export default async function Home() {
  const quickAccessArticles = await getQuickAccessArticles();
  const categorizedArticles = await getCategorizedArticles();

  return <HomePageContent articles={quickAccessArticles} categorizedArticles={categorizedArticles} />;
}