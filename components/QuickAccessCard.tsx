interface QuickAccessCardProps {
  icon: React.ElementType;
  title: string;
  href: string;
}

const QuickAccessCard = ({ icon: Icon, title, href }: QuickAccessCardProps) => {
  return (
    <a href={href} className="block group">
      <div className="bg-white p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md">
        <div className="aspect-video bg-gray-50 rounded-md flex items-center justify-center mb-4">
          <Icon className="w-12 h-12 text-red-500 opacity-80" />
        </div>
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>
    </a>
  );
};

export default QuickAccessCard;