import { Timestamp } from 'firebase/firestore';

export interface FirestoreProduct extends Omit<Product, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id?: string; // Document ID will be added when retrieved from Firestore
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  minOrder: number;
  unit: string;
  weight: number; // in kg
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Default empty product
export const emptyProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  inStock: true,
  isFeatured: false,
  stockQuantity: 0,
  minOrder: 1,
  unit: 'kg',
  weight: 1,
  images: [],
};
