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
  images: string[];
  created_at?: string;
  updated_at?: string;
}

// Default empty product
export const emptyProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  in_stock: true,
  is_featured: false,
  stock_quantity: 0,
  min_order: 1,
  unit: 'kg',
  weight: 1,
  images: [],
};

// Helper function to format product from Supabase
export const formatProductFromSupabase = (product: any): Product => ({
  ...product,
  in_stock: product.in_stock ?? true,
  is_featured: product.is_featured ?? false,
  stock_quantity: product.stock_quantity ?? 0,
  min_order: product.min_order ?? 1,
  unit: product.unit ?? 'kg',
  weight: product.weight ?? 1,
  images: product.images ?? [],
  created_at: product.created_at || new Date().toISOString(),
  updated_at: product.updated_at || new Date().toISOString(),
});
