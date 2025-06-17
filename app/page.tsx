import { supabase } from '@/lib/supabase';
import HomePageContent from '@/components/HomePageContent';

async function getQuickAccessArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, category')
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

  return <HomePageContent quickAccessArticles={quickAccessArticles} />;
}