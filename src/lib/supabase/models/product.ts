// Base product interface that matches our application's domain model
export interface Product {
  id?: string; // Document ID will be added when retrieved from Supabase
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  is_featured: boolean;
  stock_quantity: number;
  min_order: number;
  unit: string;
  weight: number; // in kg
  images_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface for the database representation of a product
export interface FirestoreProduct extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}

// Default empty product with ordering enabled by default
export const emptyProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  in_stock: true,        // Enable ordering by default
  is_featured: false,
  stock_quantity: 100,   // Set a default stock quantity
  min_order: 1,          // Minimum order quantity
  unit: 'kg',
  weight: 1,
  images_url: null,
};

/**
 * Formats a product from Supabase to our application's Product type
 * @param product The raw product data from Supabase
 * @returns A properly formatted Product object
 */
export const formatProductFromSupabase = (product: any): Product => {
  if (!product) {
    throw new Error('Cannot format null or undefined product');
  }

  return {
    id: product.id,
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    price: Number(product.price) || 0,
    category: product.category || 'uncategorized',
    in_stock: product.in_stock ?? true,
    is_featured: product.is_featured ?? false,
    stock_quantity: Number(product.stock_quantity) || 0,
    min_order: Number(product.min_order) || 1,
    unit: product.unit || 'kg',
    weight: Number(product.weight) || 1,
    images_url: product.images_url || null,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
  };
};

/**
 * Converts a Product to a FirestoreProduct (for saving to the database)
 * @param product The product to convert
 * @returns A FirestoreProduct ready to be saved
 */
export const toFirestoreProduct = (product: Partial<Product>): Partial<FirestoreProduct> => {
  // Remove undefined values
  const cleanProduct = Object.entries(product).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return {
    ...cleanProduct,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as FirestoreProduct;
};
