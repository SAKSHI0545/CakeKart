import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  available: boolean;
  ingredients: string[];
  allergens: string[];
  preparation_time: number | null;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export const useCakes = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCakesAndCategories();
  }, []);

  const fetchCakesAndCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch cakes with category information
      const { data: cakesData, error: cakesError } = await supabase
        .from('cakes')
        .select(`
          *,
          category:categories(id, name, description)
        `)
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (cakesError) throw cakesError;

      setCategories(categoriesData || []);
      setCakes(cakesData || []);
    } catch (err) {
      console.error('Error fetching cakes and categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cakes');
    } finally {
      setLoading(false);
    }
  };

  const getCakeById = (id: string): Cake | undefined => {
    return cakes.find(cake => cake.id === id);
  };

  const getCakesByCategory = (categoryId: string): Cake[] => {
    return cakes.filter(cake => cake.category_id === categoryId);
  };

  const searchCakes = (query: string): Cake[] => {
    const lowercaseQuery = query.toLowerCase();
    return cakes.filter(cake => 
      cake.name.toLowerCase().includes(lowercaseQuery) ||
      cake.description.toLowerCase().includes(lowercaseQuery) ||
      cake.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  return {
    cakes,
    categories,
    loading,
    error,
    getCakeById,
    getCakesByCategory,
    searchCakes,
    refetch: fetchCakesAndCategories
  };
};