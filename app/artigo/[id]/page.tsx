import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

type Article = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  category: string;
};

async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  if (!article) {
    return null; // Handled by notFound() in getArticle
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Home</span>
        <span className="mx-2">›</span>
        <span className="capitalize">{article.category.toLowerCase()}</span>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-700">{article.title}</span>
      </div>

      <article className="bg-white p-8 rounded-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated on {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="prose prose-lg max-w-none text-gray-800">
          {article.content}
        </div>
      </article>
    </div>
  );
}
