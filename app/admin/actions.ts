'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { type Category, type Article } from '@/app/page';

// Action to create a category
export async function createCategoryAction(categoryData: Omit<Category, 'id'>) {
  const { error } = await supabase.from('categories').insert([categoryData]);

  if (error) {
    console.error('Error creating category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/'); // Revalidate home page

  return { success: true, message: 'Categoria criada com sucesso!' };
}

// Action to update a category
export async function updateCategoryAction(categoryId: number, categoryData: Omit<Category, 'id'>) {
  const { error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', categoryId);

  if (error) {
    console.error('Error updating category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/'); // Revalidate home page
  // Also revalidate the specific category page if it exists
  revalidatePath(`/categoria/${categoryData.slug}`);

  return { success: true, message: 'Categoria atualizada com sucesso!' };
}

// Action to delete a category
export async function deleteCategoryAction(id: number, slug: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/'); // Revalidate home page
  revalidatePath(`/categoria/${slug}`); // Revalidate the category page

  return { success: true, message: 'Categoria excluída com sucesso!' };
}

// --- Article Actions ---

// Action to create an article
export async function createArticleAction(articleData: Omit<Article, 'id' | 'created_at' | 'categories'>) {
  const { data, error } = await supabase.from('articles').insert([articleData]).select().single();

  if (error) {
    console.error('Error creating article:', error);
    return { success: false, message: error.message };
  }

  // Revalidate relevant paths
  revalidatePath('/');
  if (data?.category_id) {
    const { data: category } = await supabase.from('categories').select('slug').eq('id', data.category_id).single();
    if (category) {
      revalidatePath(`/categoria/${category.slug}`);
    }
  }

  return { success: true, message: 'Artigo criado com sucesso!' };
}

// Action to update an article
export async function updateArticleAction(articleId: number, articleData: Omit<Article, 'id' | 'created_at' | 'categories'>) {
  const { error } = await supabase
    .from('articles')
    .update(articleData)
    .eq('id', articleId);

  if (error) {
    console.error('Error updating article:', error);
    return { success: false, message: error.message };
  }

  // Revalidate relevant paths
  revalidatePath('/');
  revalidatePath(`/artigo/${articleId}`);
  if (articleData.category_id) {
     const { data: category } = await supabase.from('categories').select('slug').eq('id', articleData.category_id).single();
    if (category) {
      revalidatePath(`/categoria/${category.slug}`);
    }
  }

  return { success: true, message: 'Artigo atualizado com sucesso!' };
}

// Action to delete an article
export async function deleteArticleAction(articleId: number, categoryId: number) {
    const { data: category } = await supabase.from('categories').select('slug').eq('id', categoryId).single();

  const { error } = await supabase.from('articles').delete().eq('id', articleId);

  if (error) {
    console.error('Error deleting article:', error);
    return { success: false, message: error.message };
  }

  // Revalidate relevant paths
  revalidatePath('/');
  revalidatePath(`/artigo/${articleId}`);
  if (category) {
    revalidatePath(`/categoria/${category.slug}`);
  }

  return { success: true, message: 'Artigo excluído com sucesso!' };
}
