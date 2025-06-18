'use client';

import React, { useState, FormEvent } from 'react';
import type { IconName } from '@/lib/icon-types';
import { availableLucideIcons } from '@/lib/icon-types';
import IconPickerModal from './IconPickerModal';
import { createArticleAction, updateArticleAction, deleteArticleAction } from '@/app/admin/actions';
import type { Article, Category } from '@/app/page';

// Tipagem omitindo campos que não são enviados pelo formulário
type ArticleFormData = Omit<Article, 'id' | 'created_at' | 'categories'>;

interface ArticleFormProps {
  onSubmit: (article: ArticleFormData) => Promise<void>;
  initialData?: Article | null;
  categories: Category[];
  buttonText: string;
}

function ArticleForm({ onSubmit, initialData, categories, buttonText }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [iconName, setIconName] = useState<IconName | null>(initialData?.icon_name || null);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('Por favor, selecione uma categoria.');
      return;
    }
    setIsSubmitting(true);
    await onSubmit({
      title,
      content,
      category_id: parseInt(categoryId, 10),
      description,
      icon_name: iconName,
      video_url: videoUrl || null,
    });
    if (!initialData) {
      setTitle('');
      setContent('');
      setCategoryId('');
      setDescription('');
      setIconName(null);
      setVideoUrl('');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <input type="text" placeholder="Título do Artigo" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required disabled={isSubmitting} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded bg-white" required disabled={isSubmitting}>
          <option value="" disabled>Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
        <textarea placeholder="Conteúdo (suporta Markdown)" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-40" required disabled={isSubmitting} />
        <textarea placeholder="Descrição (para cards)" value={description || ''} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-20" disabled={isSubmitting} />
        <input type="url" placeholder="URL do Vídeo (opcional)" value={videoUrl || ''} onChange={(e) => setVideoUrl(e.target.value)} className="w-full p-2 border rounded" disabled={isSubmitting} />
        <div className="my-0">
          <button type="button" onClick={() => setIsIconModalOpen(true)} className="text-sm text-blue-600 hover:underline" disabled={isSubmitting}>
            Ver lista visualmente
          </button>
        </div>
        <select value={iconName || ''} onChange={(e) => setIconName(e.target.value ? e.target.value as IconName : null)} className="w-full p-2 border rounded bg-white" disabled={isSubmitting}>
          <option value="">Selecione um ícone (opcional)</option>
          {availableLucideIcons.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-orange-600 disabled:bg-gray-400" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : buttonText}
        </button>
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

interface ArticleManagerProps {
  articles: Article[];
  categories: Category[];
}

export default function ArticleManager({ articles, categories }: ArticleManagerProps) {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleFormSubmit = async (articleData: ArticleFormData) => {
    let result;
    if (editingArticle) {
      result = await updateArticleAction(editingArticle.id, articleData);
    } else {
      result = await createArticleAction(articleData);
    }
    alert(result.message);
    if (result.success) {
      setEditingArticle(null);
    }
  };

  const handleDeleteArticle = async (article: Article) => {
    if (window.confirm(`Tem certeza que deseja excluir o artigo "${article.title}"?`)) {
      const result = await deleteArticleAction(article.id, article.category_id);
      alert(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gerenciar Artigos</h2>
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">{editingArticle ? 'Editando Artigo' : 'Criar Novo Artigo'}</h3>
        <ArticleForm
          key={editingArticle?.id || 'new'}
          onSubmit={handleFormSubmit}
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
              <button onClick={() => handleDeleteArticle(art)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
