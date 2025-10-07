import { supabase } from '../client';
import { Product, FirestoreProduct } from '../models/product';

const TABLE_NAME = 'products';

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const timestamp = new Date().toISOString();
    const newProduct: Omit<FirestoreProduct, 'id'> = {
      ...productData,
      created_at: timestamp,
      updated_at: timestamp,
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const updateData: Partial<FirestoreProduct> = {
      ...productData,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProducts = async (category?: string): Promise<Product[]> => {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};
