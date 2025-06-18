'use client';

'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import IconPickerModal from './IconPickerModal';
import { availableLucideIcons, type IconName } from '@/lib/icon-types';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/admin/actions';
import type { Category } from '@/app/page';

interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => Promise<void>;
  initialData?: Category | null;
  buttonText: string;
}

function CategoryForm({ onSubmit, initialData, buttonText }: CategoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [iconName, setIconName] = useState<IconName | null>(initialData?.icon_name || null);
  const [homeOrder, setHomeOrder] = useState(initialData?.home_order != null ? initialData.home_order.toString() : '');
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      title,
      slug,
      description,
      icon_name: iconName,
      home_order: homeOrder ? parseInt(homeOrder, 10) : null,
    });
    if (!initialData) {
      setTitle('');
      setSlug('');
      setDescription('');
      setIconName(null);
      setHomeOrder('');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <input
          type="text"
          placeholder="Título da Categoria"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Slug (ex: primeiros-passos)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Descrição"
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
        <div className="my-0">
          <button type="button" onClick={() => setIsIconModalOpen(true)} className="text-sm text-blue-600 hover:underline" disabled={isSubmitting}>
            Ver lista visualmente
          </button>
        </div>
        <select
          value={iconName || ''}
          onChange={(e) => setIconName(e.target.value ? e.target.value as IconName : null)}
          className="w-full p-2 border rounded bg-white"
          disabled={isSubmitting}
        >
          <option value="">Selecione um ícone (opcional)</option>
          {availableLucideIcons.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Ordem na Home (ex: 1)"
          value={homeOrder}
          onChange={(e) => setHomeOrder(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
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

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleFormSubmit = async (categoryData: Omit<Category, 'id'>) => {
    let result;
    if (editingCategory) {
      result = await updateCategoryAction(editingCategory.id, categoryData);
    } else {
      result = await createCategoryAction(categoryData);
    }

    alert(result.message);

    if (result.success) {
      setEditingCategory(null); // Resets the form to "Create" mode
      router.refresh();
    }
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.title}"? Esta ação não pode ser desfeita.`)) {
      const result = await deleteCategoryAction(category.id, category.slug);
      alert(result.message);
      if (result.success) {
        router.refresh();
      }
      // No need to manually refetch, revalidatePath in the action handles it.
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gerenciar Categorias</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">{editingCategory ? 'Editando Categoria' : 'Criar Categoria'}</h3>
        <CategoryForm
          key={editingCategory?.id || 'new'}
          onSubmit={handleFormSubmit}
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
              <button onClick={() => handleDelete(cat)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
