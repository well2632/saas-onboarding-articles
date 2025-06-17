'use client';

import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

// Tipagem para a categoria, espelhando o banco de dados
interface Category {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  home_order: number | null;
}

// Props para o formulário, para reutilização entre criar e editar
interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => void;
  initialData?: Category | null;
  buttonText: string;
}

// Componente do Formulário de Categoria
function CategoryForm({ onSubmit, initialData, buttonText }: CategoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [iconName, setIconName] = useState(initialData?.icon_name || '');
  const [homeOrder, setHomeOrder] = useState(initialData?.home_order != null ? initialData.home_order.toString() : '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug,
      description,
      icon_name: iconName,
      home_order: homeOrder ? parseInt(homeOrder, 10) : null,
    });
    // Limpar o formulário após o envio se não for edição
    if (!initialData) {
        setTitle('');
        setSlug('');
        setDescription('');
        setIconName('');
        setHomeOrder('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <input
        type="text"
        placeholder="Título da Categoria"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Slug (ex: primeiros-passos)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Descrição"
        value={description || ''}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Nome do Ícone (ex: file-text)"
        value={iconName || ''}
        onChange={(e) => setIconName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Ordem na Home (ex: 1)"
        value={homeOrder || ''}
        onChange={(e) => setHomeOrder(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-orange-600">
        {buttonText}
      </button>
    </form>
  );
}

// Componente Principal do Gerenciador
export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('title', { ascending: true });
    if (data) setCategories(data);
    if (error) console.error('Error fetching categories:', error);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert([category]);
    if (error) {
      alert('Erro ao criar categoria: ' + error.message);
    } else {
      alert('Categoria criada com sucesso!');
      fetchCategories(); // Re-fetch para atualizar a lista
    }
  };

  const handleUpdateCategory = async (category: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    const { error } = await supabase.from('categories').update(category).eq('id', editingCategory.id);
    if (error) {
      alert('Erro ao atualizar categoria: ' + error.message);
    } else {
      alert('Categoria atualizada com sucesso!');
      setEditingCategory(null);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir categoria: ' + error.message);
      } else {
        alert('Categoria excluída com sucesso!');
        fetchCategories();
      }
    }
  };

  if (loading) return <p>Carregando categorias...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gerenciar Categorias</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">{editingCategory ? 'Editando Categoria' : 'Criar Nova Categoria'}</h3>
        <CategoryForm
          key={editingCategory?.id || 'new'}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          initialData={editingCategory}
          buttonText={editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
        />
        {editingCategory && (
            <button onClick={() => setEditingCategory(null)} className="mt-2 text-sm text-gray-600 hover:underline">
                Cancelar Edição
            </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-medium mb-2">Categorias Existentes</h3>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
            <div>
                <p className="font-bold">{cat.title}</p>
                <p className="text-sm text-gray-500">Slug: {cat.slug}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => setEditingCategory(cat)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
