import { supabase, handleSupabaseError } from '../client';
import { Product, FirestoreProduct, formatProductFromSupabase, toFirestoreProduct } from '../models/product';

// Custom error class for product service errors
export class ProductServiceError extends Error {
  constructor(
    message: string,
    public code: string = 'PRODUCT_SERVICE_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'ProductServiceError';
  }
}

const TABLE_NAME = 'products';

/**
 * Adds a new product to the database
 * @param productData The product data to add
 * @returns The newly created product
 * @throws {ProductServiceError} If the operation fails
 */
export const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  try {
    // Convert to Firestore format and ensure required fields
    const newProduct = toFirestoreProduct({
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newProduct])
      .select('*')
      .single();

    if (error) {
      throw new ProductServiceError(
        'Failed to add product',
        'ADD_PRODUCT_ERROR',
        { error, productData }
      );
    }

    return formatProductFromSupabase(data);
  } catch (error) {
    if (error instanceof ProductServiceError) throw error;
    
    const errorMessage = handleSupabaseError(error, 'addProduct');
    throw new ProductServiceError(
      `Failed to add product: ${errorMessage}`,
      'ADD_PRODUCT_ERROR',
      { originalError: error }
    );
  }
};

/**
 * Retrieves a product by its ID
 * @param id The ID of the product to retrieve
 * @returns The product if found, null if not found
 * @throws {ProductServiceError} If the operation fails
 */
export const getProduct = async (id: string): Promise<Product | null> => {
  if (!id) {
    throw new ProductServiceError('Product ID is required', 'INVALID_INPUT');
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Handle not found case specifically
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw new ProductServiceError(
        'Failed to fetch product',
        'FETCH_PRODUCT_ERROR',
        { error, productId: id }
      );
    }

    return data ? formatProductFromSupabase(data) : null;
  } catch (error) {
    if (error instanceof ProductServiceError) throw error;
    
    const errorMessage = handleSupabaseError(error, 'getProduct');
    throw new ProductServiceError(
      `Failed to get product: ${errorMessage}`,
      'FETCH_PRODUCT_ERROR',
      { productId: id, originalError: error }
    );
  }
};

/**
 * Updates an existing product
 * @param id The ID of the product to update
 * @param productData The fields to update
 * @returns The updated product
 * @throws {ProductServiceError} If the operation fails
 */
export const updateProduct = async (
  id: string, 
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> => {
  if (!id) {
    throw new ProductServiceError('Product ID is required', 'INVALID_INPUT');
  }

  try {
    const updateData = toFirestoreProduct({
      ...productData,
      updated_at: new Date().toISOString(),
    });
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new ProductServiceError(
        'Failed to update product',
        'UPDATE_PRODUCT_ERROR',
        { error, productId: id, updateData }
      );
    }

    return formatProductFromSupabase(data);
  } catch (error) {
    if (error instanceof ProductServiceError) throw error;
    
    const errorMessage = handleSupabaseError(error, 'updateProduct');
    throw new ProductServiceError(
      `Failed to update product: ${errorMessage}`,
      'UPDATE_PRODUCT_ERROR',
      { productId: id, originalError: error }
    );
  }
};

/**
 * Fetches products, optionally filtered by category
 * @param category Optional category to filter by
 * @returns Array of products
 * @throws {ProductServiceError} If the operation fails
 */
/**
 * Deletes a product by ID
 * @param id The ID of the product to delete
 * @returns True if deletion was successful
 * @throws {ProductServiceError} If the operation fails
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  if (!id) {
    throw new ProductServiceError('Product ID is required', 'INVALID_INPUT');
  }

  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new ProductServiceError(
        'Failed to delete product',
        'DELETE_PRODUCT_ERROR',
        { error, productId: id }
      );
    }

    return true;
  } catch (error) {
    if (error instanceof ProductServiceError) throw error;
    
    const errorMessage = handleSupabaseError(error, 'deleteProduct');
    throw new ProductServiceError(
      `Failed to delete product: ${errorMessage}`,
      'DELETE_PRODUCT_ERROR',
      { productId: id, originalError: error }
    );
  }
};

/**
 * Fetches products, optionally filtered by category
 * @param category Optional category to filter by
 * @returns Array of products
 * @throws {ProductServiceError} If the operation fails
 */
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

    if (error) {
      throw new ProductServiceError(
        'Failed to fetch products',
        'FETCH_PRODUCTS_ERROR',
        { error, category }
      );
    }

    return (data || []).map(formatProductFromSupabase);
  } catch (error) {
    if (error instanceof ProductServiceError) throw error;
    
    const errorMessage = handleSupabaseError(error, 'getProducts');
    throw new ProductServiceError(
      `Failed to fetch products: ${errorMessage}`,
      'FETCH_PRODUCTS_ERROR',
      { category, originalError: error }
    );
  }
};
