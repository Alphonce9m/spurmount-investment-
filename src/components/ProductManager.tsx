import { useState, useEffect } from 'react';
import { ref as dbRef, push, set, onValue, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  minOrder: number;
  unit: string;
  weight: number;
  createdAt?: number;
  updatedAt?: number;
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    inStock: true,
    minOrder: 1,
    unit: 'kg',
    weight: 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch products
  useEffect(() => {
    const productsRef = dbRef(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        productsData.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val()
        });
      });
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `products/${Date.now()}.${fileExt}`;
    
    try {
      setIsUploading(true);
      
      // Create a reference to the file
      const fileRef = storageRef(storage, fileName);
      
      // Upload the file
      const uploadTask = uploadBytes(fileRef, file);
      
      // Monitor upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully
          try {
            // Get the download URL
            const downloadURL = await getDownloadURL(fileRef);
            
            // Update form data with the new image URL
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, downloadURL]
            }));
            
            setIsUploading(false);
            setUploadProgress(0);
          } catch (error) {
            console.error('Error getting download URL:', error);
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      // Reset form and refresh products
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: '',
        in_stock: true,
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in_stock"
              checked={formData.in_stock}
              onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-700">
              In Stock
            </label>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-md"
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading image...</p>}
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {formData.image_url}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  price: 0,
                  image_url: '',
                  category: '',
                  in_stock: true,
                });
                setEditingId(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isUploading}
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
      
      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => product.id && handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found. Add your first product above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
