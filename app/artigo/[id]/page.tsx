import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Article = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  video_url?: string; // Campo de vídeo opcional
  categories: { // O Supabase retorna o nome da tabela relacionada
    title: string;
    slug: string;
  } | null;
};

async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(title, slug)') // Puxa dados da tabela relacionada 'categories'
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function ArticlePage({ params: rawParams }: { params: { id: string } }) {
  const params = await rawParams; // Await params
  const { id } = params;
  // Incrementa o contador de visualização de forma segura via RPC
  // Usamos `then()` em vez de `await` para não bloquear a renderização da página
  supabase.rpc('increment_view_count', { article_id_to_update: id }).then();

  const article = await getArticle(id);

  if (!article) {
    return null; // Handled by notFound() in getArticle
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        {article.categories && (
          <>
            <span className="mx-2">›</span>
            <Link 
              key={article.categories.slug}
              href={`/categoria/${article.categories.slug}`}
              className="hover:underline"
            >
              {article.categories.title}
            </Link>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-700">{article.title}</span>
      </div>

      <article className="bg-white p-8 rounded-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {article.video_url && (
          <div className="my-6">
            <div className="aspect-video w-full">
              <iframe
                src={article.video_url}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-800">
          {article.content}
        </div>
      </article>
    </div>
  );
}
