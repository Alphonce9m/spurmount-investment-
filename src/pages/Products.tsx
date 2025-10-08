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
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Update categories to match your product categories in Supabase
  const categories = ["All", "Grains", "Pulses", "Spices", "Nuts", "Dried Fruits"];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

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
        price: Number(product.price) || 0,
        category: product.category || 'Uncategorized',
        in_stock: product.in_stock || false,
        is_featured: product.is_featured || false,
        stock_quantity: Number(product.stock_quantity) || 0,
        min_order: Number(product.min_order) || 1,
        unit: product.unit || 'kg',
        weight: Number(product.weight) || 0,
        images_url: product.images_url || null,
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString()
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query and selected category
  const filterProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase().includes(query) || 
         p.description?.toLowerCase().includes(query) ||
         p.category?.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle WhatsApp order button click
  const handleWhatsAppOrder = (product: Product) => {
    const message = `SPURMOUNT TRADING & INVESTMENTS\n\nHello Spurmount Team,\n\nI would like to order: ${product.name}\n\nThank you.`;
    const formattedPhone = '254740581156'; // Your WhatsApp business number
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // State to track loading images
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  // Handle image load start
  const handleImageLoadStart = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: true }));
    setImageError(prev => ({ ...prev, [productId]: false }));
  };

  // Handle image load complete
  const handleImageLoadComplete = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  // Handle image error
  const handleImageError = (productId: string) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-grow">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground font-heading">Our Products</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Quality wholesale products at competitive prices
          </p>
          
          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <div className="relative px-2 sm:px-0">
              <Search className="absolute left-5 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center px-2 sm:px-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="text-xs sm:text-sm h-8 px-2 sm:px-3"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 animate-fade-up flex flex-col h-full overflow-hidden"
              >
                <div className="relative aspect-square bg-muted/30">
                  {/* Loading Skeleton */}
                  {imageLoading[product.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  
                  {/* Image */}
                  <img
                    src={imageError[product.id] ? "/placeholder-product.png" : (product.images_url || "/placeholder-product.png")}
                    alt={product.name}
                    className={`object-cover w-full h-full transition-opacity duration-300 ${imageLoading[product.id] ? 'opacity-0' : 'opacity-100'}`}
                    onLoadStart={() => handleImageLoadStart(product.id)}
                    onLoad={() => handleImageLoadComplete(product.id)}
                    onError={() => handleImageError(product.id)}
                    loading="lazy"
                  />
                  
                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2 sm:py-1 rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Error State */}
                  {imageError[product.id] && !imageLoading[product.id] && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Image not available</p>
                    </div>
                  )}
                </div>
                <CardContent className="flex-grow p-3 sm:p-4 flex flex-col">
                  <div className="mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 sm:py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 line-clamp-2 h-10 sm:h-12 flex items-center">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 flex-grow">
                    {product.description || 'No description available'}
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <span className="font-bold text-base sm:text-lg">Ksh {product.price.toLocaleString()}</span>
                      <p className="text-[10px] sm:text-xs text-muted-foreground italic mt-0.5">
                        * Prices may vary based on quantity
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
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
