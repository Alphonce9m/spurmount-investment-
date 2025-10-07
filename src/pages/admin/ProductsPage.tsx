import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addProduct, getProducts, deleteProduct, updateProduct } from '@/lib/supabase/services/productService';
import { Product } from '@/lib/supabase/models/product';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Format URL for Supabase storage
const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    // Convert signed URLs to public URLs if needed
    const match = url.match(/storage\/v1\/object\/(sign|public)\/([^?]+)/);
    if (match) {
      const path = match[2];
      return `https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/${path}`;
    }
    return url;
  }
  
  // If it's just a path, construct the full URL
  return `https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/${url.replace(/^\/+/, '')}`;
};

// Define form data type
type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  images: string[];
};

// Empty product template
const emptyProduct: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: '',
  in_stock: true,
  is_featured: false,
  stock_quantity: 0,
  min_order: 1,
  unit: 'kg',
  weight: 0,
  images: [],
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);

  // Format WhatsApp message
  const formatWhatsAppMessage = (product: Product) => {
    const message = `*SPURMOUNT TRADING & INVESTMENT*

*Hello Spurmount Team,*

I would like to place an order for:

*Product:* ${product.name}
*Price:* Ksh ${product.price}
*Category:* ${product.category}

*Name:* 
*Email:* 
*Phone:* 
*Quantity (in ${product.unit || 'units'}):* 
*Delivery Address:* 

Looking forward to your response.`;
    
    // Encode the message for URL
    return encodeURIComponent(message);
  };

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      // Upload each image and get their URLs
      const uploadedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
          const filePath = `products/${fileName}`;

          // Upload the file to Supabase Storage
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);
            
          if (error) throw error;
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);
            
          return publicUrl;
        })
      );

      // Update form data with new image URLs
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    // Get the URL of the image to be removed
    const imageToRemove = formData.images[index];
    
    try {
      // Extract the file path from the URL
      const pathMatch = imageToRemove.match(/storage\/v1\/object\/public\/(.+)/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        // Delete the file from storage
        const { error } = await supabase.storage
          .from('product-images')
          .remove([filePath]);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
      // Continue with removing from UI even if storage deletion fails
    }
    
    // Remove from form data
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingId) {
        await updateProduct(editingId, formData as unknown as Product);
      } else {
        await addProduct(formData as unknown as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      }
      
      // Reset form and reload products
      setFormData(emptyProduct);
      setEditingId(null);
      
      // Reload products
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      in_stock: product.in_stock || false,
      is_featured: product.is_featured || false,
      stock_quantity: product.stock_quantity || 0,
      min_order: product.min_order || 1,
      unit: product.unit || 'kg',
      weight: product.weight || 0,
      images: product.images || [],
    });
    setEditingId(product.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setLoading(true);
      await deleteProduct(id);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images?.map((image, index) => {
                      const imageUrl = formatImageUrl(image);
                      return (
                        <div key={index} className="relative group">
                          <div className="h-20 w-20 rounded-md overflow-hidden border-2 border-gray-200">
                            <img
                              src={imageUrl}
                              alt={`Product ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load image:', imageUrl);
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder-product.png';
                                target.classList.add('opacity-50');
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                    <label className="flex h-20 w-20 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 bg-gray-50">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Add Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                        disabled={uploading || loading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (Ksh)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_order">Minimum Order</Label>
                    <Input
                      id="min_order"
                      name="min_order"
                      type="number"
                      min="1"
                      value={formData.min_order}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="pcs">Pieces</option>
                      <option value="packet">Packet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight per unit (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="in_stock"
                      name="in_stock"
                      checked={formData.in_stock}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? 'Update Product' : 'Add Product'}
                  </Button>
                  
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({ ...emptyProduct });
                        setEditingId(null);
                      }}
                      className="w-full mt-2"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Product List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            No products found. Add your first product above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  {product.images && product.images.length > 0 && (
                    <div className="mb-4 h-40 bg-gray-100 rounded-md overflow-hidden">
                      {typeof product.images[0] === 'string' ? (
                        <img
                          src={formatImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder-product.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Invalid image URL
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="font-bold mt-2">Ksh {product.price?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        {product.is_featured && ' • Featured'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        title="Edit product"
                        className="h-8 w-8"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => product.id && handleDelete(product.id)}
                        title="Delete product"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`https://wa.me/254712345678?text=${formatWhatsAppMessage(product)}`, '_blank')}
                        title="Order via WhatsApp"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
