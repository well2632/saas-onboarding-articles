'use client';

import React, { useState, useEffect, FormEvent } from 'react'; // Adicionado React para Fragment
import type { IconName } from '@/lib/icon-types';
import { availableLucideIcons } from '@/lib/icon-types';
import { supabase } from '@/lib/supabase';
import IconPickerModal from './IconPickerModal'; // Importando o modal

// Tipagens espelhando o banco de dados
interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  description: string | null;
  icon_name: string | null;
}

interface Category {
  id: number;
  title: string;
}

// Props para o formulário
interface ArticleFormProps {
  onSubmit: (article: Omit<Article, 'id'>) => void;
  initialData?: Article | null;
  categories: Category[];
  buttonText: string;
}

// Componente do Formulário de Artigo
function ArticleForm({ onSubmit, initialData, categories, buttonText }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [iconName, setIconName] = useState<IconName | ''>(() => {
    const initialIcon = initialData?.icon_name;
    if (initialIcon && availableLucideIcons.includes(initialIcon as IconName)) {
      return initialIcon as IconName;
    }
    return '';
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    onSubmit({
      title,
      content,
      category_id: parseInt(categoryId, 10),
      description,
      icon_name: iconName,
    });
    if (!initialData) {
        setTitle('');
        setContent('');
        setCategoryId('');
        setDescription('');
        setIconName('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <input type="text" placeholder="Título do Artigo" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded bg-white" required>
        <option value="" disabled>Selecione uma categoria</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.title}</option>
        ))}
      </select>
      <textarea placeholder="Conteúdo (suporta Markdown)" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-40" required />
      <textarea placeholder="Descrição (para cards)" value={description || ''} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-20" />
      <div className="my-0">
        <button type="button" onClick={() => setIsIconModalOpen(true)} className="text-sm text-blue-600 hover:underline">
          Ver lista visualmente
        </button>
      </div>
      <select value={iconName} onChange={(e) => setIconName(e.target.value as IconName | '')} className="w-full p-2 border rounded bg-white">
        <option value="">Selecione um ícone (opcional)</option>
        {availableLucideIcons.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
     
      <button type="submit" className="px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-orange-600">{buttonText}</button>
    </form>
    <IconPickerModal 
        isOpen={isIconModalOpen} 
        onClose={() => setIsIconModalOpen(false)} 
        onIconSelect={(selectedIcon) => {
            setIconName(selectedIcon);
            setIsIconModalOpen(false);
        }}
    />
  </>
  );
}

// Componente Principal do Gerenciador de Artigos
export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  async function fetchData() {
    setLoading(true);
    const { data: articlesData, error: articlesError } = await supabase.from('articles').select('*').order('title', { ascending: true });
    const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, title').order('title', { ascending: true });

    if (articlesData) setArticles(articlesData);
    if (articlesError) console.error('Error fetching articles:', articlesError);

    if (categoriesData) setCategories(categoriesData);
    if (categoriesError) console.error('Error fetching categories:', categoriesError);

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateArticle = async (article: Omit<Article, 'id'>) => {
    const { error } = await supabase.from('articles').insert([article]);
    if (error) alert('Erro ao criar artigo: ' + error.message);
    else {
      alert('Artigo criado com sucesso!');
      fetchData();
    }
  };

  const handleUpdateArticle = async (article: Omit<Article, 'id'>) => {
    if (!editingArticle) return;
    const { error } = await supabase.from('articles').update(article).eq('id', editingArticle.id);
    if (error) alert('Erro ao atualizar artigo: ' + error.message);
    else {
      alert('Artigo atualizado com sucesso!');
      setEditingArticle(null);
      fetchData();
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) alert('Erro ao excluir artigo: ' + error.message);
      else {
        alert('Artigo excluído com sucesso!');
        fetchData();
      }
    }
  };

  if (loading) return <p>Carregando artigos e categorias...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gerenciar Artigos</h2>
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">{editingArticle ? 'Editando Artigo' : 'Criar Novo Artigo'}</h3>
        <ArticleForm
          key={editingArticle?.id || 'new'}
          onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
          initialData={editingArticle}
          categories={categories}
          buttonText={editingArticle ? 'Atualizar Artigo' : 'Criar Artigo'}
        />
        {editingArticle && (
            <button onClick={() => setEditingArticle(null)} className="mt-2 text-sm text-gray-600 hover:underline">
                Cancelar Edição
            </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-medium mb-2">Artigos Existentes</h3>
        {articles.map((art) => (
          <div key={art.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
            <div>
                <p className="font-bold">{art.title}</p>
                <p className="text-sm text-gray-500">Categoria: {categories.find(c => c.id === art.category_id)?.title || 'N/A'}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => setEditingArticle(art)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
              <button onClick={() => handleDeleteArticle(art.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
