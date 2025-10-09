import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/models/product';

const Products = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, products, selectedCategory]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the Product interface
      const formattedProducts = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category || 'General',
        price: Number(product.price) || 0,
        in_stock: true,
        is_featured: product.is_featured || false,
        stock_quantity: Number(product.stock_quantity) || 0,
        min_order: Number(product.min_order) || 1,
        unit: product.unit || 'kg',
        weight: Number(product.weight) || 0,
        images_url: product.images_url || null,
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString()
      } as Product));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Image loading handlers
  const handleImageLoadStart = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: true }));
    setImageError(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageLoadComplete = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  // Handle WhatsApp order
  const handleWhatsAppOrder = (product: Product) => {
    const phoneNumber = '254740581156'; // Spurmount Trading WhatsApp number
    const message = `Hello! I would like to order ${product.name} (${product.unit}). Price: Ksh ${product.price}.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filter products based on search query and category
  const filterProducts = () => {
    let filtered = [...products];

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        (p.description?.toLowerCase() || '').includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your search.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Our Products</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Quality wholesale products at competitive prices
          </p>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-input bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {Array.from(new Set(products.map(p => p.category))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="relative pt-[100%] bg-muted/20">
                {imageLoading[product.id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                <img
                  src={product.images_url || "/placeholder-product.png"}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading[product.id] ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => handleImageLoadComplete(product.id)}
                  onError={() => handleImageError(product.id)}
                  loading="lazy"
                />
                {imageError[product.id] && (
                  <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Ksh {product.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleWhatsAppOrder(product)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
