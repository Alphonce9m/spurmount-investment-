import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/models/product';
import { formatImageUrl } from '@/lib/supabase/utils';

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
    const message = `SPURMOUNT TRADING & INVESTMENT\n\nHello Spurmount Team,\n\nI would like to order: ${product.name}\n\nThank you.`;
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 sm:py-12 flex-grow">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground font-heading">Our Products</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Quality wholesale products at competitive prices
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {(searchQuery || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-muted/50 relative">
                  {product.images_url && product.images_url[0] ? (
                    <>
                      <img
                        src={formatImageUrl(product.images_url[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onLoadStart={() => handleImageLoadStart(product.id)}
                        onLoad={() => handleImageLoadComplete(product.id)}
                        onError={(e) => {
                          console.error('Error loading image:', product.images_url[0]);
                          handleImageError(product.id);
                        }}
                      />
                      {imageLoading[product.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      {/* Category - Commented out for now
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      */}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KSh {product.price.toLocaleString()}</p>
                      <p className="text-sm font-medium text-green-600">
                        In Stock
                        {product.stock_quantity > 0 && (
                          <span className="block text-xs text-muted-foreground">
                            {product.stock_quantity} units available
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Description - Commented out for now
                  {product.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  */}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => handleWhatsAppOrder(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
