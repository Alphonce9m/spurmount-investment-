import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config';
import { Product, FirestoreProduct } from '../models/product';

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const productsRef = collection(db, 'products');
    const timestamp = Timestamp.now();
    
    const newProduct: FirestoreProduct = {
      ...productData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    return { id: docRef.id, ...newProduct };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('__name__', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

export const getProducts = async (category?: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    let q;
    
    if (category) {
      q = query(productsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    } else {
      q = query(productsRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreProduct;
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        inStock: data.inStock,
        isFeatured: data.isFeatured,
        stockQuantity: data.stockQuantity,
        minOrder: data.minOrder,
        unit: data.unit,
        weight: data.weight,
        images: data.images,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};
