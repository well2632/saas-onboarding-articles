import { supabase } from '@/lib/supabase';
import HomePageContent from '@/components/HomePageContent';

import type { IconName } from '@/lib/icon-types';

// Tipagem para a categoria, que será usada em múltiplos locais
export type Category = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon_name: IconName | null;
  home_order: number | null;
};

// Tipagem para os artigos de acesso rápido
// Tipagem completa para um Artigo
export type Article = {
  id: number;
  title: string;
  content: string;
  category_id: number;
  description: string | null;
  icon_name: IconName | null;
  video_url?: string | null; 
  created_at: string;
  // Opcional, para join com a tabela de categorias
  categories?: {
    title: string;
  };
};

export type QuickAccessArticle = {
  id: number;
  title: string;
  description: string | null;
  icon_name: IconName | null;
};

// Busca as categorias que devem ser exibidas na página inicial
async function getHomePageCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, slug, description, icon_name, home_order')
    .order('home_order', { ascending: true });

  if (error) {
    console.error('Error fetching home page categories:', error.message);
    return [];
  }

  return data || [];
}


export default async function Home() {
  const [homePageCategories] = await Promise.all([
    getHomePageCategories(),
  ]);



  return <HomePageContent categories={homePageCategories}  />;
}
