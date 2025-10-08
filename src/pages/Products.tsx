import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    const phoneNumber = '+254712345678'; // Replace with actual number
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground font-heading">
            Our Products
          </h1>
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
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 animate-fade-up flex flex-col h-full overflow-hidden"
              >
                <div className="relative aspect-square bg-muted/30">
                  {imageLoading[product.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  
                  <img
                    src={imageError[product.id] ? "/placeholder-product.png" : (product.images_url || "/placeholder-product.png")}
                    alt={product.name}
                    className={`object-cover w-full h-full transition-opacity duration-300 ${imageLoading[product.id] ? 'opacity-0' : 'opacity-100'}`}
                    onLoadStart={() => handleImageLoadStart(product.id)}
                    onLoad={() => handleImageLoadComplete(product.id)}
                    onError={() => handleImageError(product.id)}
                    loading="lazy"
                  />
                  
                  {product.is_featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2 sm:py-1 rounded">
                      Featured
                    </div>
                  )}
                  
                  {imageError[product.id] && !imageLoading[product.id] && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Image not available</p>
                    </div>
                  )}
                </div>
                
                <CardContent className="flex-grow p-3 sm:p-4 flex flex-col">
                  <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 h-10 sm:h-12 flex items-center">
                    {product.name}
                  </h3>
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <span className="font-bold text-base sm:text-lg">Ksh {product.price.toLocaleString()}</span>
                      <p className="text-[10px] sm:text-xs text-muted-foreground italic mt-0.5">
                        * Prices are subject to market changes
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-2 sm:p-3 bg-muted/10">
                  <Button 
                    variant="default" 
                    className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9 sm:h-10"
                    onClick={() => handleWhatsAppOrder(product)}
                  >
                    <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Order Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
