export default function ArticlePageSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto">
      {/* Skeleton para o título do artigo */}
      <div className="h-12 bg-gray-300 rounded-md w-3/4 mb-6"></div>

      {/* Skeleton para metadados ou breadcrumbs (opcional) */}
      <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-8"></div>

      {/* Skeleton para o corpo do artigo */}
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <br />
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}
