import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Loader2, ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  addProduct, 
  getProducts, 
  deleteProduct, 
  updateProduct, 
  ProductServiceError 
} from '@/lib/supabase/services/productService';
import { Product } from '@/lib/supabase/models/product';
import { supabase } from '@/lib/supabase/client';
import { formatImageUrl } from '@/lib/supabase/utils';
import ErrorBoundary from '@/components/ErrorBoundary';
import * as z from 'zod';

// Define form validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  in_stock: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock_quantity: z.number().min(0, 'Stock quantity cannot be negative'),
  min_order: z.number().min(1, 'Minimum order must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  weight: z.number().min(0, 'Weight must be a positive number'),
  images_url: z.string().url('Invalid image URL').nullable(),
});

type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  images_url: string | null;
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
  images_url: null,
};

const ProductsPage: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handle adding a new product
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyProduct);
    setFormErrors({});
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update all products to be in stock
  const updateAllProductsToInStock = async () => {
    if (!confirm('Are you sure you want to update all products to be in stock?')) return;
    
    try {
      setLoading(true);
      
      // Update each product to be in stock with minimum quantity of 1
      const updatePromises = products.map(product => 
        updateProduct(product.id!, { 
          in_stock: true,
          stock_quantity: Math.max(1, product.stock_quantity || 0)
        })
      );
      
      await Promise.all(updatePromises);
      await loadProducts();
      
      toast.success('All products have been updated to be in stock');
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Format WhatsApp message for order placement
  const formatWhatsAppMessage = (product: Product) => {
    const message = [
      'SPURMOUNT TRADING & INVESTMENTS',
      '',
      'Hello Spurmount Team,',
      '',
      `I would like to order: ${product.name || 'Product Name'}`,
      '',
      'Thank you.'
    ];
    
    // Join with newlines and URL encode
    return encodeURIComponent(message.join('\n'));
  };

  // Load products with error handling and retry logic
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      toast.error('Failed to load products', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: loadProducts
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // In a real app, you would upload the file to a storage service here
      // For now, we'll just create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        images_url: imageUrl
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      toast.error('Error uploading image', { description: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      images_url: null
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    setFormErrors({});
    
    try {
      // Validate form data
      const validationResult = productSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[String(err.path[0])] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }

      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(formData);
        toast.success('Product added successfully');
      }
      
      // Reset form and reload products
      setFormData(emptyProduct);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save product';
      setError(errorMessage);
      
      // Show error toast with retry option
      const formEvent = e as React.FormEvent<HTMLFormElement>;
      toast.error('Error saving product', { 
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(formEvent)
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = useCallback((product: Product) => {
    if (!product.id) {
      console.error('Cannot edit product: Missing ID');
      toast.error('Cannot edit product: Missing ID');
      return;
    }
    
    const { id, created_at, updated_at, ...productData } = product;
    setFormData({
      ...productData,
      images_url: product.images_url || null,
    });
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error('Error deleting product', { description: errorMessage });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading products</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" className="mt-2" onClick={loadProducts}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
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
                  <Label htmlFor="images_url">Product Image</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.images_url ? (
                      <div className="relative">
                        <img
                          src={formData.images_url}
                          alt={formData.name || 'Product'}
                          className="h-32 w-32 rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">Upload an image</p>
                          </div>
                          <input
                            id="images_url"
                            name="images_url"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {formErrors.images_url && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.images_url}</p>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Price */}
                <div>
                  <Label htmlFor="price">Price (Ksh) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className={formErrors.price ? 'border-red-500' : ''}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    className={formErrors.category ? 'border-red-500' : ''}
                  />
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                {/* Stock Quantity */}
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="Enter stock quantity"
                    className={formErrors.stock_quantity ? 'border-red-500' : ''}
                  />
                  {formErrors.stock_quantity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.stock_quantity}</p>
                  )}
                </div>

                {/* Minimum Order */}
                <div>
                  <Label htmlFor="min_order">Minimum Order *</Label>
                  <Input
                    id="min_order"
                    name="min_order"
                    type="number"
                    min="1"
                    value={formData.min_order}
                    onChange={handleInputChange}
                    placeholder="Enter minimum order quantity"
                    className={formErrors.min_order ? 'border-red-500' : ''}
                  />
                  {formErrors.min_order && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.min_order}</p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (L)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="piece">Piece</option>
                    <option value="packet">Packet</option>
                    <option value="carton">Carton</option>
                  </select>
                  {formErrors.unit && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight in kg"
                    className={formErrors.weight ? 'border-red-500' : ''}
                  />
                  {formErrors.weight && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="in_stock"
                      name="in_stock"
                      checked={formData.in_stock}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="in_stock" className="text-sm font-medium">In Stock</Label>
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
                    <Label htmlFor="is_featured" className="text-sm font-medium">Featured Product</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(emptyProduct);
                    setEditingId(null);
                    setFormErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting || uploading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : editingId ? (
                  'Update Product'
                ) : (
                  'Add Product'
                )}
              </Button>
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
                  {product.images_url ? (
                    <div className="mb-4 h-40 bg-gray-100 rounded-md overflow-hidden relative">
                      <img
                        src={formatImageUrl(product.images_url)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="font-bold mt-2">Ksh {product.price?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {product.stock_quantity} {product.unit} in stock
                        </p>
                        <p className="text-sm text-gray-600">
                          Min. order: {product.min_order} {product.unit}
                        </p>
                        <p className="text-sm text-gray-600">Weight: {product.weight} kg</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                        {product.is_featured && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => product.id && handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`https://wa.me/?text=${formatWhatsAppMessage(product)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.498 14.382v-.002c-.301-.15-1.767-.867-2.04-.966-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.267-.465-2.412-1.485-.888-.795-1.484-1.761-1.66-2.061-.173-.3-.019-.465.13-.615.137-.135.3-.345.451-.523.146-.18.194-.3.296-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.207-.24-.584-.487-.51-.672-.516-.172-.009-.371-.01-.571-.01-.2 0-.523.074-.797.36-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.109 3.195 5.1 4.785.714.3 1.27.489 1.704.625.713.227 1.365.195 1.879.12.574-.09 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.36m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a11.73 11.73 0 01-1.5-5.925C2.51 5.858 7.03 1.5 12.582 1.5 18.065 1.5 22.5 5.79 22.5 11.25c0 5.46-4.435 9.575-9.918 9.575"/>
                          </svg>
                          WhatsApp
                        </a>
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
