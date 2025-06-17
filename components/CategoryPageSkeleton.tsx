export default function CategoryPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Skeleton para o título da categoria */}
      <div className="h-10 bg-gray-300 rounded-md w-1/2 mb-8"></div>

      {/* Skeleton para a grade de artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 h-48">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mt-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
