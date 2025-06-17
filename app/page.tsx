import { supabase } from '@/lib/supabase';
import HomePageContent from '@/components/HomePageContent';

// Tipagem para a categoria, que será usada em múltiplos locais
export type Category = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
};

// Tipagem para os artigos de acesso rápido
export type QuickAccessArticle = {
  id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
};

// Busca as categorias que devem ser exibidas na página inicial
async function getHomePageCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, title, slug, description, icon_name')
    .order('home_order', { ascending: true });

  if (error) {
    console.error('Error fetching home page categories:', error.message);
    return [];
  }

  return data || [];
}


export default async function Home() {
  const [homePageCategories = await Promise.all([
    getHomePageCategories(),
  ]);

  

  return <HomePageContent categories={homePageCategories}  />;
}
