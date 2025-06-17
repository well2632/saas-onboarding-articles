'use client';

import { useState } from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
import ArticleManager from '@/components/admin/ArticleManager';






export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'articles'>('categories');
  
  // PIN fixo conforme solicitado
  const correctPin = '300382';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('PIN incorreto. Tente novamente.');
      setPin('');
    }
  };

  // Renderiza a tela de login se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Acesso Administrativo</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Digite o PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                placeholder="******"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B35] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Renderiza o painel de administração se estiver autenticado
  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Painel Administrativo</h1>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gerenciar Categorias
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'articles'
                ? 'border-[#FF6B35] text-[#FF6B35]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Gerenciar Artigos
          </button>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'articles' && <ArticleManager />}
      </div>
    </div>
  );
}
