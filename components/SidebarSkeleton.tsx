export default function SidebarSkeleton() {
  return (
    <aside className="hidden md:block w-64 h-screen-minus-header p-4 border-r border-gray-200 overflow-y-auto animate-pulse">
      <div className="relative mb-4">
        <div className="h-10 bg-gray-300 rounded-md w-full"></div>
      </div>
      <nav className="flex-grow space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="pl-4 space-y-1 ml-3">
              <div className="h-6 bg-gray-200 rounded w-5/6"></div>
              <div className="h-6 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
